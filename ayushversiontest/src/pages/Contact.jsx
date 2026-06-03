export default function Contact() {
  return (
    <section>
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Contact</h1>
        <p className="mt-6 text-lg text-neutral-700">
          Placeholder contact form. Not wired to a backend.
        </p>

        <form
          className="mt-10 space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="mt-2 w-full border border-black bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-2 w-full border border-black bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              className="mt-2 w-full border border-black bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button
            type="submit"
            className="border border-black bg-black px-5 py-2 text-sm font-medium text-white hover:bg-white hover:text-black"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
