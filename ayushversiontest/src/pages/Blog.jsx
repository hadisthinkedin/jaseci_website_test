const posts = Array.from({ length: 5 }, (_, i) => ({
  title: `Post title ${i + 1}`,
  date: "2026-01-01",
  excerpt: "Placeholder excerpt for this blog post. One or two lines of summary.",
}));

export default function Blog() {
  return (
    <>
      <section className="border-b border-black">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Blog</h1>
          <p className="mt-6 max-w-prose text-lg text-neutral-700">
            Placeholder for the blog index. Articles and release notes.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-12">
          <ul className="divide-y divide-neutral-300">
            {posts.map((post) => (
              <li key={post.title} className="py-8">
                <p className="text-xs uppercase tracking-widest text-neutral-600">
                  {post.date}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight hover:underline">
                  <a href="#">{post.title}</a>
                </h2>
                <p className="mt-2 max-w-prose text-neutral-700">
                  {post.excerpt}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
