import Link from "next/link";

const categories = [
  {
    number: "01",
    name: "Technology",
    topics: "Python, ROS & Reinforcement Learning",
  },
  {
    number: "02",
    name: "Languages",
    topics: "Korean & English",
  },
  {
    number: "03",
    name: "Daily Journal",
    topics: "Thoughts, experiences & reflections",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F7F3] text-[#24251F]">
      {/* Navbar */}
      <header className="border-b border-[#E5E2DA]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" className="text-xl font-bold tracking-tight">
            personal<span className="text-[#7B8064]">.</span>
            newspaper
          </Link>

          <div className="hidden items-center gap-8 text-sm md:flex">
            <Link href="/" className="hover:text-[#7B8064]">
              Home
            </Link>
            <Link href="/newspaper" className="hover:text-[#7B8064]">
              Newspaper
            </Link>
            <a href="#about" className="hover:text-[#7B8064]">
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-medium hover:bg-[#ECEAE3] sm:inline-flex"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="rounded-full bg-[#292B24] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#45483A]"
            >
              Get started <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28 lg:px-10">
        <div>
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#7B8064]">
            A space for thoughts & discoveries
          </p>

          <h1 className="max-w-2xl font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Every thought has a story.
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-[#696A60] md:text-lg">
            A personal space to collect knowledge, document your journey, and
            share the little things that make life meaningful.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/newspaper"
              className="rounded-full bg-[#292B24] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#45483A]"
            >
              Explore newspaper <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/register"
              className="rounded-full border border-[#D8D5CC] px-6 py-3.5 text-sm font-medium transition hover:bg-[#ECEAE3]"
            >
              Start your journey
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-3">
            <div className="flex -space-x-2">
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-[#F8F7F3] bg-[#D9C8AD] text-xs">
                P
              </span>
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-[#F8F7F3] bg-[#C6D0BD] text-xs">
                N
              </span>
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-[#F8F7F3] bg-[#E5C7C1] text-xs">
                J
              </span>
            </div>
            <p className="text-xs leading-5 text-[#77786F]">
              Learn something new.
              <br />
              Keep a record of your journey.
            </p>
          </div>
        </div>

        {/* Editorial visual */}
        <div className="relative">
          <div className="absolute -right-3 -top-3 size-24 rounded-full bg-[#E5E7D9]" />

          <div className="relative border border-[#E2DED4] bg-[#EFEEE7] p-5 sm:p-8">
            <div className="flex items-center justify-between border-b border-[#D8D5CC] pb-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                The personal edition
              </span>
              <span className="text-xs text-[#77786F]">VOL. 001</span>
            </div>

            <div className="py-9 sm:py-12">
              <p className="text-xs uppercase tracking-[0.2em] text-[#7B8064]">
                Notes from the journey
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                Collect moments.
                <br />
                Connect ideas.
                <br />
                <span className="italic text-[#7B8064]">Keep growing.</span>
              </h2>

              <div className="my-8 h-px bg-[#D8D5CC]" />

              <p className="max-w-sm text-sm leading-7 text-[#696A60]">
                From technology and language learning to everyday reflections,
                every page is an opportunity to discover something new.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[#D8D5CC] pt-4">
              <span className="text-xs text-[#77786F]">
                YOUR IDEAS, YOUR STORIES
              </span>
              <span className="text-xl" aria-hidden="true">
                ✳
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-[#E5E2DA] bg-[#F0EFE9]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B8064]">
                Explore your interests
              </p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                Different interests, one place.
              </h2>
            </div>

            <Link
              href="/newspaper"
              className="text-sm font-medium hover:text-[#7B8064]"
            >
              Visit newspaper <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <article
                key={category.number}
                className="border border-[#E0DDD4] bg-[#F8F7F3] p-6 transition hover:-translate-y-1 hover:border-[#B6B9A5] sm:p-7"
              >
                <span className="text-xs text-[#7B8064]">
                  {category.number} / CATEGORY
                </span>

                <h3 className="mt-8 font-serif text-2xl">{category.name}</h3>

                <p className="mt-3 text-sm leading-6 text-[#696A60]">
                  {category.topics}
                </p>

                <div className="mt-7 text-lg" aria-hidden="true">
                  ↗
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B8064]">
            The idea behind it
          </p>

          <div>
            <h2 className="max-w-3xl font-serif text-3xl leading-tight sm:text-4xl">
              Not just a place to read, but a place to grow.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#696A60]">
              Personal Newspaper is a home for ideas, learning notes,
              experiences, and stories. A small archive of what you discover
              today, so you can look back at how far you have come tomorrow.
            </p>

            <Link
              href="/newspaper"
              className="mt-8 inline-flex rounded-full border border-[#D8D5CC] px-6 py-3 text-sm font-medium transition hover:bg-[#ECEAE3]"
            >
              Discover the stories →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E2DA]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-7 text-xs text-[#77786F] sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <Link href="/" className="font-semibold text-[#24251F]">
            personal.newspaper
          </Link>

          <p>Every thought has a story.</p>

          <p>© 2026 Personal Newspaper</p>
        </div>
      </footer>
    </main>
  );
}
