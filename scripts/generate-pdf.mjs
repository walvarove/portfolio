/**
 * Generates public/resume.pdf by rendering /resume in a headless browser.
 * Runs after `astro build` and `astro preview` is used as the server.
 *
 * Usage:  node scripts/generate-pdf.mjs
 *   (called automatically via `npm run build`)
 */

import puppeteer from "puppeteer-core";
import { spawn } from "child_process";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "resume.pdf");

// Path to system Chrome on macOS; override via CHROME_PATH env var
const CHROME_PATH =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const PORT = 4322; // use a non-default port to avoid conflicts

/** Start `astro preview` and wait until it's ready */
function startPreviewServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      "node",
      ["node_modules/.bin/astro", "preview", "--port", String(PORT)],
      { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] }
    );

    const onData = (data) => {
      const text = data.toString();
      if (text.includes(String(PORT))) {
        resolve(proc);
      }
    };

    proc.stdout.on("data", onData);
    proc.stderr.on("data", onData);

    proc.on("error", reject);

    // Safety timeout
    setTimeout(() => reject(new Error("Preview server timed out")), 15_000);
  });
}

async function main() {
  console.log("▶ Starting Astro preview server on port", PORT, "…");
  const server = await startPreviewServer();

  let browser;
  try {
    console.log("▶ Launching headless Chrome…");
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}/resume/`, {
      waitUntil: "networkidle0",
    });

    await mkdir(path.dirname(OUT), { recursive: true });

    await page.pdf({
      path: OUT,
      format: "A4",
      printBackground: false,
      margin: { top: "12mm", bottom: "12mm", left: "14mm", right: "14mm" },
    });

    console.log("✓ PDF saved to", OUT);
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
}

main().catch((err) => {
  console.error("✗ PDF generation failed:", err.message);
  process.exit(1);
});
