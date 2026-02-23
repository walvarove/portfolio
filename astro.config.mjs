// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Vite plugin that adds a dev-only POST /api/generate-pdf endpoint */
function generatePdfPlugin() {
    return {
        name: 'generate-pdf-dev',
        configureServer(server) {
            server.middlewares.use('/api/generate-pdf', (req, res) => {
                if (req.method !== 'POST') {
                    res.writeHead(405).end();
                    return;
                }
                const script = path.join(__dirname, 'scripts/generate-pdf.mjs');
                const proc = spawn('node', [script], { cwd: __dirname });
                let out = '';
                proc.stdout.on('data', (d) => { out += d; });
                proc.stderr.on('data', (d) => { out += d; });
                proc.on('close', (code) => {
                    res.writeHead(code === 0 ? 200 : 500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ ok: code === 0, log: out }));
                });
            });
        },
    };
}

// https://astro.build/config
export default defineConfig({
    site: 'https://walva.dev',
    integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/resume') }), react(), tailwind()],
    vite: {
        plugins: [generatePdfPlugin()],
    },
});