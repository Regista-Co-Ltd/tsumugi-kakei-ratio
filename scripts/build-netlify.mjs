import { cp, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await cp("netlify-dist", "dist", { recursive: true });
console.log("Copied netlify-dist to dist");
