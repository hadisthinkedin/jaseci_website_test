export const jacTabsData = [
    {
        filename: "ai_sentiment_analysis.jac",
        code: `
import from byllm { Model, Image }

glob llm = Model(model_name="gpt-4o");

# One tiny object replaces a giant schem
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
}`,
    },
    {
        filename: "oop_example.jac",
        code: `
node Library {
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
    lib2 = root ++> Library("Community Library");

    shelf1 = lib1 ++> Shelf("Fiction");
    shelf2 = lib1 ++> Shelf("Non-Fiction");
    shelf3 = lib2 ++> Shelf("Science");

    book1 = shelf1 ++> Book("1984", True);
    book2 = shelf1 ++> Book("Brave New World", False);
    book3 = shelf2 ++> Book("Sapiens", True);
    book4 = shelf3 ++> Book("A Brief History of Time", False);
    book5 = shelf3 ++> Book("The Selfish Gene", True);

    # Send Borrower walking
    borrower("1984") spawn root;
}

impl Library.search_shelves {
    visit [-->(\`?Shelf)]; # No loops, just visit
}

impl Shelf.check_books {
    found_book = [self -->(\`?Book)](
        ?title == visitor.book_needed, available == True
    );

    if (found_book) {
        print(f"Borrowed: {found_book}");
        print(f"From Shelf: {self.category}");
        disengage; # Stop traversal cleanly
    } else {
        print("Book not available in shelf", self.category);
    }
}

impl borrower.find_book {
    visit [-->(\`?Library)];
}`,
    },
    // Commented out - jac-scale has its own dedicated section
    // {
    //     filename: "cloud_scaling.jac",
    //     code: `
    // # nodes + walkers + jac-scale --> auto-endpoint magic
    // # Auth & database handled behind the scenes
    //
    // node Memory {
    //     has memories: list[str] = [];
    //
    //     can add_memory with add_memory entry {
    //         # Simple append, no DB worries
    //         self.memories.append(visitor.memory);
    //         report {
    //             "message": f"Memory added: {visitor.memory}"
    //         };
    //     }
    //     can list_memories with get_memories entry {
    //         report { "memories": self.memories };
    //     }
    // }
    //
    // # Endpoint ready!, thanks to the walker abstraction
    // walker add_memory {
    //     has memory: str;
    //
    //     can add_memory with \`root entry {
    //         visit [--> (\`?Memory)] else {
    //             visit root ++> Memory();
    //         }
    //     }
    // }
    //
    // walker get_memories {
    //     can list_memories with \`root entry {
    //         visit [--> (\`?Memory)] else {
    //             report { "memories": [] };
    //         }
    //     }
    // }
    // `,
    // },
];

export const pythonTabsData = [
    {
        filename: "ai_sentiment_analysis.py",
        code: `
import json, base64
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
referenced images and user context. Engage in a way that feels 
natural, as if you were helping someone document their 
experiences, but always return structured output.

# Instructions
- Extract details only based on the image and user input.
- Avoid hallucinations or assumptions if information is missing.
- Always call the \`process_memory\` tool to return results.
- Keep results short, factual, and consistent.

# Sub-categories for more detailed instructions
## First Turn
- React to the image or context briefly.
- Encourage clarification if information is incomplete.

## Field Writing (for process_memory)
- **who**: list of people, animals, or notable entities.
- **what**: concise description of the activity or event 
  (3-5 words).
- **where**: specific place, city, or landmark provided 
   or visible.

### Reasoning Steps
- If the user corrects existing information, update the fields.
- If new information is provided, add it without discarding 
  existing relevant details.
- If a field is not mentioned or visible, leave it empty.

## Response Writing
- Keep responses factual and grounded in what's visible or given.
- Never ask the user irrelevant questions.
- Use the photo context to refine details when applicable.

# Output Format
Always return JSON via the \`process_memory\` tool with:
- \`who\`: list of strings
- \`what\`: string (short activity/event description)
- \`where\`: string (location or place)
"""

with open("image.png", "rb") as f:
    image_b64 = base64.b64encode(f.read()).decode("utf-8")

# --- Verbose message construction ---
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

print(result)
`,
    },
    {
        filename: "oop_example.py",
        code: `
class Borrower:
    def __init__(self, name, book_needed):
        self.name = name
        self.book_needed = book_needed
        self.libraries = []

class Library:
    def __init__(self, location):
        self.location = location
        self.shelves = []

class Shelf:
    def __init__(self, category):
        self.category = category
        self.books = []

class Book:
    def __init__(self, title, available=True):
        self.title = title
        self.available = available

borrower = Borrower("Reader", book_needed="1984")

lib1 = Library("Central Library")
lib2 = Library("Community Library")
borrower.libraries.extend([lib1, lib2])

shelf1 = Shelf("Fiction")
shelf2 = Shelf("Non-Fiction")
shelf3 = Shelf("Science")

lib1.shelves.extend([shelf1, shelf2])
lib2.shelves.append(shelf3)

book1 = Book("1984", True)
book2 = Book("Brave New World", False)
book3 = Book("Sapiens", True)
book4 = Book("A Brief History of Time", False)
book5 = Book("The Selfish Gene", True)

shelf1.books.extend([book1, book2])
shelf2.books.append(book3)
shelf3.books.extend([book4, book5])

found_book = None
found_shelf = None
found_library = None
libraries = borrower.libraries
wanted = borrower.book_needed

# Nested loops everywhere
for lib in libraries:
    for shelf in lib.shelves:
        for book in shelf.books:
            if book.title == wanted and book.available:
                found_book = book
                found_shelf = shelf
                found_library = lib
                break
        if found_book:
            break
    if found_book:
        break

if found_book:
    print(f"Borrowed: {found_book.title}")
    print(f"From Shelf: {found_shelf.category}")
else:
    print("Book not available")
`,
    },
    // Commented out - jac-scale has its own dedicated section
    // {
    //     filename: "cloud_scaling.py",
    //     code: `
    // from fastapi import FastAPI, Depends, HTTPException
    // from fastapi.security import OAuth2PasswordBearer
    // from pydantic import BaseModel
    // from datetime import datetime, timedelta
    // import jwt, pymongo, hashlib
    //
    // # --- App & Security Setup ---
    // app = FastAPI()
    // SECRET_KEY = "secret123"
    // ALGORITHM = "HS256"
    // oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
    //
    // # --- MongoDB Setup ---
    // client = pymongo.MongoClient("mongodb://localhost:27017/")
    // db = client["mydb"]
    // users_collection = db["users"]
    // memories_collection = db["memories"]
    //
    // # --- Models ---
    // class User(BaseModel):
    //     username: str
    //     password: str
    //
    // class MemoryItem(BaseModel):
    //     memory: str
    //
    // # --- Auth Helpers ---
    // def create_token(username: str):
    //     """Generate JWT token for a user."""
    //     payload = {
    //         "sub": username,
    //         "exp": datetime.utcnow() + timedelta(hours=1)
    //     }
    //     return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    //
    // def verify_token(token: str = Depends(oauth2_scheme)):
    //     """Decode and validate JWT token."""
    //     try:
    //         payload = jwt.decode(
    //             token, SECRET_KEY, algorithms=[ALGORITHM]
    //         )
    //         return payload["sub"]
    //     except jwt.ExpiredSignatureError:
    //         raise HTTPException(
    //             status_code=401, detail="Token expired"
    //         )
    //     except jwt.InvalidTokenError:
    //         raise HTTPException(
    //             status_code=401, detail="Invalid token"
    //         )
    //
    // # --- Routes ---
    // @app.post("/signup")
    // def signup(user: User):
    //     """Register a new user with hashed password."""
    //     hashed_pw = hashlib.sha256(user.password.encode()).hexdigest()
    //
    //     if users_collection.find_one({"username": user.username}):
    //         raise HTTPException(
    //             status_code=400, detail="User already exists"
    //         )
    //
    //     users_collection.insert_one({
    //         "username": user.username,
    //         "password": hashed_pw
    //     })
    //     return {"message": "User created successfully"}
    //
    // @app.post("/login")
    // def login(user: User):
    //     """Authenticate user and return JWT token."""
    //     hashed_pw = hashlib.sha256(user.password.encode()).hexdigest()
    //     db_user = users_collection.find_one({
    //         "username": user.username,
    //         "password": hashed_pw
    //     })
    //
    //     if not db_user:
    //         raise HTTPException(
    //             status_code=400,
    //             detail="Invalid username or password"
    //         )
    //     access_token = create_token(user.username)
    //     return {"access_token": access_token, "token_type": "bearer"}
    //
    //
    // # --- the long road to a simple task ---
    // @app.post("/add_memory")
    // def add_memory(
    //     item: MemoryItem,
    //     current_user: str = Depends(verify_token)
    // ):
    //     """Add a memory for the current user."""
    //     memories_collection.insert_one({
    //         "username": current_user,
    //         "memory": item.memory,
    //         "timestamp": datetime.utcnow()
    //     })
    //     return {"message": f"Memory added: {item.memory}"}
    //
    //
    // @app.get("/get_memories")
    // def get_user_memories(current_user: str = Depends(verify_token)):
    //     """Retrieve all memories for the current user."""
    //     user_memories = list(memories_collection.find(
    //         {"username": current_user},
    //         {"_id": 0, "memory": 1, "timestamp": 1}
    //     ))
    //     return {"memories": user_memories}
    // `},
];

export const tabsData = [
    {
        title: "AI Without Prompt Engineering",
        summary:
            "Jac introduces Meaning Typed Programming - replace function bodies with AI. The function signature IS the specification. No complex prompts needed, just declare what you want.",
        link: "https://docs.jaseci.org/learn/jac-byllm/with_llm/",
        diagram: {
            src: "/diagrams/image.png",
            fallback: "/diagrams/ai-abstractions-static.png",
            title: "AI Programming Abstractions Flow",
            description: "Visual representation of how AI models integrate seamlessly into Jac code",
            type: "animated"
        }
    },
    {
        title: "Agentic Object-Spatial Programming",
        summary:
            "Build AI agents that traverse knowledge graphs naturally. Nodes hold data, walkers carry intelligence. Perfect for RAG systems, autonomous agents, and complex AI workflows.",
        link: "https://docs.jaseci.org/reference/language/osp/",
        diagram: {
            src: "/diagrams/object-spatial-diagram.gif",
            fallback: "/diagrams/object-spatial-static.png",
            title: "Object-Spatial Programming Flow",
            description: "Visual representation of nodes, walkers, and spatial relationships",
            type: "animated"
        }
    },
];
