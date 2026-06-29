import sys, re

def replace_admonitions(t):
    def repl(m):
        tag = m.group(1)
        title = m.group(2) or tag
        body = m.group(3)
        # Recursively process nested admonitions instead of stripping them
        body = replace_admonitions(body)
        
        color_map = {
            'note': 'info-blue',
            'warning': 'warning-orange',
            'question': 'info-blue',
            'tip': 'info-blue',
            'danger': 'Red',
            'info': 'info-blue',
        }
        color = color_map.get(tag, 'black!80!white')
        
        return f'\n\\begin{{details}}{{{color}}}{{{title}}}\n{body}\n\\end{{details}}\n'
    
    return re.sub(
        r'[\?\!]{3}\s+(\w+)(?:\s+"([^"]*)")?\s*\n(.*?)'
        r'(?=\n(?:##|【\d+】|\\end\{details\}|[\?\!]{3}|\Z))',
        repl, t, flags=re.DOTALL
    )

text = sys.stdin.read()
text = replace_admonitions(text)
sys.stdout.write(text)
