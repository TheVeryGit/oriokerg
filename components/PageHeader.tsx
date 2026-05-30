import { Reveal } from "@/components/Reveal";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  intro?: string;
};

/** Shared premium page header: eyebrow + serif title + intro, with reveal. */
export function PageHeader({ eyebrow, title, intro }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -top-10 h-64 w-64 rounded-full bg-accent/12 blur-3xl" />
      <div className="mx-auto w-full max-w-7xl px-4 pb-4 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <Reveal className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-sm uppercase tracking-luxe text-accent">
            <span className="h-px w-8 bg-accent/50" />
            {eyebrow}
          </span>
          <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] text-foreground text-balance sm:text-6xl">
            {title}
          </h1>
          {intro ? (
            <p className="mt-6 text-lg leading-8 text-muted text-pretty">{intro}</p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
