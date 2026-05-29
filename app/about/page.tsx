import { remark } from "remark";
import html from "remark-html";

import type { AboutSettings } from "@/lib/content";
import { getSettings, getSettingsContent } from "@/lib/content";

export default async function AboutPage() {
  const about = getSettings<AboutSettings>("about");
  const aboutBody = getSettingsContent("about");
  const processedContent = await remark().use(html).process(aboutBody);
  const htmlContent = processedContent.toString();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <section className="rounded-[2rem] border border-border bg-card p-8 sm:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">
          О питомнике
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
          {about.title}
        </h1>
        <div
          className="mt-8 max-w-3xl space-y-5 text-lg leading-8 text-muted [&_h1]:font-serif [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-foreground [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mb-5 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </section>

      {about.photo ? (
        <div
          className="h-[420px] w-full overflow-hidden rounded-[2rem] border border-border bg-gray-800"
          style={{
            backgroundImage: `url(${about.photo})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
      ) : (
        <div className="h-[420px] w-full rounded-[2rem] border border-border bg-gray-800" />
      )}
    </div>
  );
}
