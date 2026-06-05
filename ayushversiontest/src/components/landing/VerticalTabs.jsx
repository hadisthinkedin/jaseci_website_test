import { useState } from "react";
import CodeBlock from "../CodeBlock.jsx";
import { docs } from "../../lib/links.js";

const tab0Jac = `import from byllm { Model, Image }

glob llm = Model(model_name="gpt-4o");

# One tiny object replaces a giant schema
obj MemoryDetails {
    has who: list[str];
    has what: str;
    has where: str;
}
sem MemoryDetails = "Extract people, event, place from the photo";

def extract_memory_details(
    image: Image, city: str
) -> MemoryDetails by llm(); # Magic happens

with entry {
    img = Image("image.png");
    details = extract_memory_details(img, "Paris");
    print(details);
}`;

const tab0Py = `import json, base64
from datetime import datetime
from openai import OpenAI

client = OpenAI()

# --- Lots of boilerplate just to define a schema ---
tools = [{
    "type": "function",
    "function": {
        "name": "process_memory",
        "description":
            "Extract structured memory details from the photo",
        "parameters": {
            "type": "object",
            "properties": {
                "who": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Names of people in the photo"
                },
                "what": {
                    "type": "string",
                    "description": "What is happening in the scene"
                },
                "where": {
                    "type": "string",
                    "description":
                        "Location or setting of the photo"
                }
            },
            "required": ["who", "what", "where"]
        }
    }
}]

# --- The prompt has to sit here like a Novel ---
SYS_PROMPT = """
# Role and Objective
Your goal is to extract structured memory details from
referenced images and user context...
"""

with open("image.png", "rb") as f:
    image_b64 = base64.b64encode(f.read()).decode("utf-8")

messages = [
    {"role": "system", "content": SYS_PROMPT},
    {
        "role": "user",
        "content": [
            {"type": "text", "text": "Photo took in Paris."},
            {"type": "image_url", "image_url": {
                "url": f"data:image/png;base64,{image_b64}"}
            }
        ]
    }
]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
    tool_choice={
        "type": "function",
        "function": {"name": "process_memory"}
    }
)

result = json.loads(
    response.choices[0].message.tool_calls[0].function.arguments
)

print(result)`;

const tab1Jac = `node Library {
    has location: str;
    can search_shelves with borrower entry;
}

node Shelf {
    has category: str;
    can check_books with borrower entry;
}

node Book {
    has title: str;
    has available: bool;
}

walker borrower {
    has book_needed: str;
    can find_book with \`root entry;
}

with entry {
    # Building the world is just linking nodes
    lib1 = root ++> Library("Central Library");
    shelf1 = lib1 ++> Shelf("Fiction");
    book1 = shelf1 ++> Book("1984", True);

    # Send Borrower walking
    borrower("1984") spawn root;
}

impl Shelf.check_books {
    found_book = [self -->(\`?Book)](
        ?title == visitor.book_needed, available == True
    );
    if (found_book) {
        print(f"Borrowed: {found_book}");
        disengage; # Stop traversal cleanly
    }
}`;

const tab1Py = `class Borrower:
    def __init__(self, name, book_needed):
        self.name = name
        self.book_needed = book_needed
        self.libraries = []

class Library:
    def __init__(self, location):
        self.location = location
        self.shelves = []

# ... Shelf, Book classes ...

found_book = None
# Nested loops everywhere
for lib in libraries:
    for shelf in lib.shelves:
        for book in shelf.books:
            if book.title == wanted and book.available:
                found_book = book
                break
        if found_book:
            break
    if found_book:
        break

if found_book:
    print(f"Borrowed: {found_book.title}")
else:
    print("Book not available")`;

const tabs = [
  {
    title: "AI without writing prompts",
    link: docs.withLlm,
    summary:
      "Tell Jac what you want: the inputs, the output, a short description. It writes the prompt for you. No prompt engineering, no giant JSON schemas. Look how much disappears on the right.",
    jac: tab0Jac,
    py: tab0Py,
  },
  {
    title: "Data that thinks in graphs",
    link: docs.osp,
    summary:
      "Your data is a graph: nodes hold the information, and little “walkers” move through it doing the work. Great for search, AI agents, and anything with messy connections, with no nested loops in sight.",
    jac: tab1Jac,
    py: tab1Py,
  },
];

export default function VerticalTabs() {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <section id="vertical-tabs" className="border-b border-black">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          AI without the prompt wrangling
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-neutral-700">
          Declare what you want; Jac writes the prompt. Same idea in Jac vs the
          old way. See how much disappears.
        </p>

        {/* Tab buttons */}
        <div className="mt-12 flex flex-wrap gap-px border border-black bg-black">
          {tabs.map((t, i) => (
            <button
              key={t.title}
              onClick={() => setActive(i)}
              className={`flex-1 px-4 py-3 text-left text-sm font-medium ${
                active === i ? "bg-black text-white" : "bg-white hover:bg-neutral-100"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-neutral-700">{tab.summary}</p>
        <a
          href={tab.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-medium underline"
        >
          Read the docs ↗
        </a>

        {/* Code comparison */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-600">
              Jac
            </p>
            <CodeBlock code={tab.jac} lang="jac" />
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-600">
              The old way (Python)
            </p>
            <CodeBlock code={tab.py} lang="python" />
          </div>
        </div>
      </div>
    </section>
  );
}
