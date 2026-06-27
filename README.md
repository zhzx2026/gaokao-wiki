# 浙江高考 Wikipedia

面向浙江省新高考的开源知识百科，受 [OI-wiki](https://github.com/OI-wiki/OI-wiki) 启发。

## 内容

- **强基数学**：基于强基班讲义，函数专题全覆盖，含详细解析
- **高考学科**：10 科知识框架（浙江规则）
- **课本清单**：全部 50 册人教版高中课本在线链接

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
