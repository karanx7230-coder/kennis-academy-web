/* Download placeholder images locally so the site works offline / on any network.
   Run: node tools/fetch-placeholders.mjs   (re-run anytime to refresh) */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "assets", "images");
await mkdir(outDir, { recursive: true });

const U = (id, w) => `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop&fm=webp`;

const files = [
  ["hero.webp", U("1524178232363-1fb2b075b655", 1920)],
  ["mentor.webp", U("1560250097-0b93528c311a", 900)],
  ["program-primary.webp", U("1503676260728-1c00da094a0b", 800)],
  ["program-math.webp", U("1509228468518-180dd4864904", 800)],
  ["program-senior.webp", U("1523240795612-9a054b0db644", 800)],
  ["banner.webp", U("1481627834876-b7833e8f5570", 1920)],
  ["govt-exams.webp", U("1434030216411-0b793f4b4173", 1000)],
  ["home-tuition.webp", U("1544717297-fa95b6ee9643", 1000)],
  ["review-1.jpg", "https://randomuser.me/api/portraits/women/65.jpg"],
  ["review-2.jpg", "https://randomuser.me/api/portraits/men/32.jpg"],
  ["review-3.jpg", "https://randomuser.me/api/portraits/women/44.jpg"],
];

let ok = 0;
for (const [name, url] of files) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(join(outDir, name), buf);
    console.log(`✓ ${name}  (${(buf.length / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (e) {
    console.error(`✗ ${name}  ${e.message}`);
  }
}
console.log(`\nDone: ${ok}/${files.length} images saved to assets/images/`);
