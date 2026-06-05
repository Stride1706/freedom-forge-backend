import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';
import { getIntegrationCode } from './integrationService';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const OUTPUT_DIR = path.join(__dirname, '../../generated');
fs.ensureDirSync(OUTPUT_DIR);

// --- WEB APP ---
export async function buildWebApp(description: string, integrations: string[] = []) {
  const integrationSnippets = integrations.map(name => 
    `// --- ${name.toUpperCase()} ---\n${getIntegrationCode(name)}`
  ).join('\n\n');

  const prompt = `
Create a complete, production-ready web app: ${description}
Use: React + TypeScript + TailwindCSS + Express backend.
INCLUDE THESE INTEGRATIONS:\n${integrationSnippets}
Return ONLY valid JSON: { "files": [ {"path": "filename.ts", "content": "full code"} ] }
No extra text, only JSON.
  `;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  const project = JSON.parse(res.choices[0].message.content || '{}');
  const id = `web-${Date.now()}`;
  const projPath = path.join(OUTPUT_DIR, id);
  fs.ensureDirSync(projPath);

  for (const file of project.files) {
    const filePath = path.join(projPath, file.path);
    fs.ensureFileSync(filePath);
    fs.writeFileSync(filePath, file.content);
  }

  // Zip it
  const zipPath = path.join(OUTPUT_DIR, `${id}.zip`);
  const out = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(out);
  archive.directory(projPath, false);
  await archive.finalize();

  return { id, downloadUrl: `/download/${id}.zip` };
}

// --- MOBILE APP ---
export async function buildMobileApp(description: string, integrations: string[] = []) {
  const integrationSnippets = integrations.map(name => getIntegrationCode(name)).join('\n\n');
  const prompt = `
Create complete React Native mobile app: ${description}
INCLUDE THESE INTEGRATIONS:\n${integrationSnippets}
Return ONLY JSON: { "files": [ {"path": "file.ts", "content": "code"} ] }
`;
  const res = await openai.chat.completions.create({ model: 'gpt-4o', messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' } });
  const project = JSON.parse(res.choices[0].message.content || '{}');
  const id = `mobile-${Date.now()}`;
  const projPath = path.join(OUTPUT_DIR, id);
  fs.ensureDirSync(projPath);
  for (const f of project.files) { const p = path.join(projPath, f.path); fs.ensureFileSync(p); fs.writeFileSync(p, f.content); }
  const zipPath = path.join(OUTPUT_DIR, `${id}.zip`);
  const out = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(out); archive.directory(projPath, false); await archive.finalize();
  return { id, downloadUrl: `/download/${id}.zip` };
}

// --- GAME ---
export async function buildGame(description: string, integrations: string[] = []) {
  const integrationSnippets = integrations.map(name => getIntegrationCode(name)).join('\n\n');
  const prompt = `
Create complete HTML5/JavaScript game: ${description}
INCLUDE THESE INTEGRATIONS:\n${integrationSnippets}
Return ONLY JSON: { "files": [ {"path": "file.js", "content": "code"} ] }
`;
  const res = await openai.chat.completions.create({ model: 'gpt-4o', messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' } });
  const project = JSON.parse(res.choices[0].message.content || '{}');
  const id = `game-${Date.now()}`;
  const projPath = path.join(OUTPUT_DIR, id);
  fs.ensureDirSync(projPath);
  for (const f of project.files) { const p = path.join(projPath, f.path); fs.ensureFileSync(p); fs.writeFileSync(p, f.content); }
  const zipPath = path.join(OUTPUT_DIR, `${id}.zip`);
  const out = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(out); archive.directory(projPath, false); await archive.finalize();
  return { id, downloadUrl: `/download/${id}.zip` };
}

// --- WEBSITE ---
export async function buildWebsite(description: string, integrations: string[] = []) {
  const integrationSnippets = integrations.map(name => getIntegrationCode(name)).join('\n\n');
  const prompt = `
Create complete responsive website: ${description}
Use HTML + CSS + JS or Next.js.
INCLUDE THESE INTEGRATIONS:\n${integrationSnippets}
Return ONLY JSON: { "files": [ {"path": "file.html", "content": "code"} ] }
`;
  const res = await openai.chat.completions.create({ model: 'gpt-4o', messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' } });
  const project = JSON.parse(res.choices[0].message.content || '{}');
  const id = `website-${Date.now()}`;
  const projPath = path.join(OUTPUT_DIR, id);
  fs.ensureDirSync(projPath);
  for (const f of project.files) { const p = path.join(projPath, f.path); fs.ensureFileSync(p); fs.writeFileSync(p, f.content); }
  const zipPath = path.join(OUTPUT_DIR, `${id}.zip`);
  const out = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(out); archive.directory(projPath, false); await archive.finalize();
  return { id, downloadUrl: `/download/${id}.zip` };
}
