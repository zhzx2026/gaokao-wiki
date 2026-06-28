#!/bin/bash
set -e
cd "$(dirname "$0")/.."
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

HEADER='---
title: "浙江高考 Wikipedia · 强基数学"
author: "浙江高考 Wikipedia"
documentclass: book
toc: true
toc-depth: 2
header-includes: |
  \usepackage{xeCJK}
  \setCJKmainfont{Noto Serif CJK SC}
  \setCJKsansfont{Noto Sans CJK SC}
  \setCJKmonofont{Noto Sans Mono CJK SC}
  \usepackage{amsmath,amssymb,amsthm}
  \usepackage{hyperref,xcolor}
  \hypersetup{colorlinks=true,linkcolor=blue}
  \usepackage{framed}
---
'

echo "$HEADER" > /tmp/merged.md

for f in docs/advanced-math/chapter1/1.*.md; do
    [ ! -f "$f" ] && continue
    echo "→ $f"
    python3 "$SCRIPT_DIR/preprocess.py" < "$f" >> /tmp/merged.md
    echo -e "\n\n\\newpage\n" >> /tmp/merged.md
done

mkdir -p export
pandoc /tmp/merged.md \
    --pdf-engine=xelatex \
    --from markdown+tex_math_dollars+raw_tex \
    -V geometry:margin=2cm \
    -o export/gaokao-wiki.pdf 2>&1

echo "✅ export/gaokao-wiki.pdf ($(du -h export/gaokao-wiki.pdf 2>/dev/null | cut -f1))"
