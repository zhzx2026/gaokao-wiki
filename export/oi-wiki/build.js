import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkDetails from "remark-details";
import remarkTabbed from "remark-tabbed";
import remarkFootnotes from "remark-footnotes";
import { latex } from "remark-latex";
import { read, writeSync } from "to-vfile";
import { load } from "js-yaml";
import { join, dirname } from "path";
import { promises as fs } from "fs";
import escape from "escape-latex";

const prefixRegEx = /[^a-zA-Z0-9]/gi;

const root = dirname(new URL(import.meta.url).pathname);
const docsRoot = join(root, "..", "..", "docs");
const mkdocsPath = join(root, "..", "..", "mkdocs.yml");
const texDir = join(root, "tex");

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch (e) {
    return false;
  }
}

function extractAdvancedMath(nav) {
  for (const item of nav) {
    if (item["数学"]) {
      for (const mathItem of item["数学"]) {
        if (mathItem["强基数学"]) {
          return mathItem["强基数学"];
        }
      }
    }
  }
  return null;
}

async function convertMarkdown(filename, depth) {
  const filepath = join(docsRoot, filename);
  if (!filepath.endsWith(".md")) {
    console.log(`Skip: ${filename} (not .md)`);
    return;
  }

  if (!(await exists(filepath))) {
    console.error(`Error: File '${filepath}' does not exist`);
    return;
  }

  console.log(`Processing: ${filename}`);

  await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkDetails)
    .use(remarkTabbed)
    .use(remarkFootnotes)
    .use(latex, {
      prefix: filename.replace(prefixRegEx, "").replace(/md$/, ""),
      depth: depth,
      current: filename,
      root: docsRoot,
      nested: false,
      forceEscape: false,
      path: filename.replace(/\.md$/, "/"),
    })
    .process(await read(filepath), function (err, file) {
      if (err) {
        console.error(`Error processing ${filename}:`, err);
        return;
      }
      file.dirname = texDir;
      file.stem = filename.replace(prefixRegEx, "");
      file.extname = ".tex";
      writeSync(file);
    });
}

async function main() {
  if (!(await exists(mkdocsPath))) {
    console.error(`Error: config file '${mkdocsPath}' does not exist`);
    process.exit(1);
  }

  const yamlContent = await fs.readFile(mkdocsPath, "utf8");
  const config = load(yamlContent);
  const nav = config.nav;

  const advancedMath = extractAdvancedMath(nav);
  if (!advancedMath) {
    console.error("Error: 强基数学 not found in nav");
    process.exit(1);
  }

  await fs.mkdir(texDir, { recursive: true });

  let includes = "";
  for (const item of advancedMath) {
    const [title, content] = Object.entries(item)[0];

    if (typeof content === "string") {
      await convertMarkdown(content, 1);
      includes += `\\section{${escape(title)}}\n`;
      includes += `\\input{tex/${content.replace(prefixRegEx, "")}}\n\n`;
    } else if (Array.isArray(content)) {
      includes += `\\section{${escape(title)}}\n`;
      for (const subItem of content) {
        const [subTitle, subFile] = Object.entries(subItem)[0];
        if (typeof subFile === "string") {
          await convertMarkdown(subFile, 2);
          includes += `\\subsection{${escape(subTitle)}}\n`;
          includes += `\\input{tex/${subFile.replace(prefixRegEx, "")}}\n\n`;
        }
      }
    }
  }

  await fs.writeFile(join(root, "includes.tex"), includes);
  console.log("Export complete. includes.tex generated.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
