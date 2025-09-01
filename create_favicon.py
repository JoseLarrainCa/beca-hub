from PIL import Image, ImageDraw, ImageFont
import io
import base64

# Crear imagen 32x32
img = Image.new('RGB', (32, 32), color='#1e40af')  # Azul UDD
draw = ImageDraw.Draw(img)

# Intentar usar una fuente, si no usar la default
try:
    font = ImageFont.truetype("arial.ttf", 14)
except:
    font = ImageFont.load_default()

# Dibujar texto UDD en blanco
text = "UDD"
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]

x = (32 - text_width) // 2
y = (32 - text_height) // 2 - 2

draw.text((x, y), text, fill='white', font=font)

# Guardar como ICO
img.save('public/favicon.ico', format='ICO', sizes=[(32, 32)])
print("✅ Favicon UDD creado en public/favicon.ico")
