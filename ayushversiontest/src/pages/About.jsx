const team = ["Member One", "Member Two", "Member Three", "Member Four", "Member Five", "Member Six"];

export default function About() {
  return (
    <>
      <section className="border-b border-black">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About</h1>
          <p className="mt-6 max-w-prose text-lg text-neutral-700">
            Placeholder for the Jaseci mission and vision. Editorial copy goes
            here describing why Jaseci exists and where it's headed.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-2xl font-bold tracking-tight">Team</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3">
            {team.map((name) => (
              <div key={name} className="border border-neutral-300 p-4">
                <div className="aspect-square w-full bg-neutral-100" />
                <p className="mt-3 font-medium">{name}</p>
                <p className="text-sm text-neutral-600">Role</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
