import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OrioKerg — питомник ориентальных кошек",
    short_name: "OrioKerg",
    description:
      "Здоровые социализированные ориентальные котята с документами, прививками и поддержкой на всю жизнь.",
    lang: "ru",
    start_url: "/",
    display: "standalone",
    background_color: "#f2ead8",
    theme_color: "#2a1a18",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
