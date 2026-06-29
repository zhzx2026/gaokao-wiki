#!/bin/bash
set -e
cd "$(dirname "$0")"

SCRIPT_DIR="$(pwd)"

echo "📦 Installing Node.js dependencies..."
npm install

echo "🔨 Building LaTeX sources from Markdown..."
node build.js

echo "📄 Compiling PDF with xelatex..."
mkdir -p ../../export-output

# Run xelatex twice for TOC and cross-references
xelatex -interaction=nonstopmode -output-directory=../../export-output template.tex || true
xelatex -interaction=nonstopmode -output-directory=../../export-output template.tex

PDF_PATH="../../export-output/template.pdf"
if [ -f "$PDF_PATH" ]; then
    mv "$PDF_PATH" ../../export/gaokao-wiki.pdf
    echo "✅ PDF generated: export/gaokao-wiki.pdf ($(du -h ../../export/gaokao-wiki.pdf | cut -f1))"
else
    echo "❌ PDF generation failed"
    exit 1
fi
