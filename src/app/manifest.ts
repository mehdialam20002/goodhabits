import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aura Habit Tracker",
    short_name: "Aura",
    description: "High-performance habit tracking workspace.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#4f46e5",
    icons: [{ src: "/favicon.ico", sizes: "64x64", type: "image/x-icon" }],
  };
}
