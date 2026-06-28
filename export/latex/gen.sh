#!/bin/bash
cd "$(dirname "$0")"
> content.tex
for f in ../../docs/advanced-math/chapter1/1.*.md; do
    [ ! -f "$f" ] && continue
    echo "→ $f"
    pandoc "$f" -f markdown-smart -t latex --top-level-division=chapter >> content.tex
    echo '\clearpage' >> content.tex
done
echo "✅ $(wc -l < content.tex) lines"
