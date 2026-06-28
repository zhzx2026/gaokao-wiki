import sys, re

text = sys.stdin.read()

# Convert ??? note / !!! question blocks to simple markdown sections
def replace_admonitions(t):
    def repl(m):
        tag = m.group(1)
        title = m.group(2) or tag
        body = m.group(3)
        body = re.sub(r'\?{3}\s*\w+.*', '', body)
        return f'\n**【{title}】**\n\n{body}\n\n---\n'
    
    return re.sub(
        r'[\?\!]{3}\s+(\w+)(?:\s+"([^"]*)")?\s*\n(.*?)(?=\n(?:##|【\d+】|\Z))',
        repl, t, flags=re.DOTALL
    )

text = replace_admonitions(text)
sys.stdout.write(text)
