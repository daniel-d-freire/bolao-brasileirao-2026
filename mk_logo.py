import base64, os

parts = []
for i in range(1, 6):
    with open(f'C:\\Users\\User\\bolao-brasileirao-2026\\lp{i}.txt', 'r') as f:
        parts.append(f.read().strip())

b64 = ''.join(parts)
buf = base64.b64decode(b64)

out = 'C:\\Users\\User\\bolao-brasileirao-2026\\public\\logo_brasileirao.png'
with open(out, 'wb') as f:
    f.write(buf)
print(f'OK: {len(buf)} bytes -> {out}')
