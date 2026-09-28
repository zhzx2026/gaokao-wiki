# 浙江高考 Wikipedia

面向浙江省新高考的开源知识百科，受 [OI-wiki](https://github.com/OI-wiki/OI-wiki) 启发。

## 内容

- **数学知识点库**：高中数学课内全覆盖（人教 A 版必修 + 选择性必修），每节标注 **难度 / 重要性** 双维度星级（最高 5 颗星），配函数图象、平面几何、立体几何 SVG 插图
- **课本清单**：全部 50 册人教版高中课本在线链接（见 `课本下载/`）

## 本地运行

```bash
pip install mkdocs mkdocs-material
python -m mkdocs serve
```

## 导出 PDF

```bash
# 合并 markdown 后用 pandoc 转换
pandoc merged.md --pdf-engine=xelatex -o output.pdf
```

或通过 GitHub Actions 自动导出（`.github/workflows/export.yml`）。
