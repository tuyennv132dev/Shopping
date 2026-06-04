from pathlib import Path
import math

from PIL import Image, ImageDraw, ImageFont, ImageFilter
from reportlab.graphics.barcode import qr


ROOT = Path(__file__).resolve().parents[1]
LOGO = ROOT / "images" / "main-logo" / "huyen-tuyen-rice-logo-transparent.png"
OUT_DIR = ROOT / "images" / "packaging"
OUT_FILE = OUT_DIR / "huyen-tuyen-rice-packaging-qr.png"
QR_URL = "https://tuyennv132dev.github.io/Shopping/"


def font(name, size):
    path = Path("C:/Windows/Fonts") / name
    return ImageFont.truetype(str(path), size)


def rounded_rect(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def make_qr(size=320):
    widget = qr.QrCodeWidget(QR_URL)
    code = widget.qr
    code.make()
    count = code.getModuleCount()
    quiet = 4
    cell = max(1, size // (count + quiet * 2))
    qr_size = (count + quiet * 2) * cell
    qr_img = Image.new("RGB", (qr_size, qr_size), "white")
    qdraw = ImageDraw.Draw(qr_img)
    for row in range(count):
        for col in range(count):
            if code.isDark(row, col):
                x = (col + quiet) * cell
                y = (row + quiet) * cell
                qdraw.rectangle((x, y, x + cell - 1, y + cell - 1), fill="black")
    qr_img = qr_img.resize((size, size), Image.Resampling.NEAREST)
    framed = Image.new("RGB", (size + 42, size + 42), "white")
    framed.paste(qr_img, (21, 21))
    return framed


def draw_centered(draw, xy, text, font_obj, fill, anchor="mm"):
    draw.text(xy, text, font=font_obj, fill=fill, anchor=anchor)


def draw_leaf_pattern(draw, x0, y0, x1, y1, color):
    for i in range(18):
        x = x0 + (x1 - x0) * (i / 17)
        y = y0 + 18 * math.sin(i * 0.9)
        draw.ellipse((x - 18, y - 7, x + 18, y + 7), fill=color)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    w, h = 1400, 1800
    img = Image.new("RGB", (w, h), "#f7f1df")
    draw = ImageDraw.Draw(img)

    # Background paper grain
    for y in range(0, h, 6):
        shade = 238 + (y % 18)
        draw.line((0, y, w, y), fill=(shade, max(225, shade - 8), 198), width=1)

    # Standing package silhouette
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.ellipse((245, 1650, 1155, 1758), fill=(0, 0, 0, 58))
    shadow = shadow.filter(ImageFilter.GaussianBlur(28))
    img = Image.alpha_composite(img.convert("RGBA"), shadow)
    draw = ImageDraw.Draw(img)

    bag = (280, 120, 1120, 1690)
    rounded_rect(draw, bag, 42, "#fffaf0", "#d5b76c", 5)
    draw.rectangle((280, 120, 1120, 250), fill="#f0b22e")
    draw.rectangle((280, 1510, 1120, 1690), fill="#2e6b28")
    draw.line((280, 250, 1120, 250), fill="#d5b76c", width=5)
    draw.line((280, 1510, 1120, 1510), fill="#d5b76c", width=5)

    # Top seal and rice field motif
    rounded_rect(draw, (360, 162, 1040, 214), 12, "#7a3f18")
    draw_centered(draw, (700, 188), "PREMIUM RICE", font("arialbd.ttf", 34), "white")
    for offset in range(0, 500, 52):
        draw.arc((325 + offset, 310, 670 + offset, 720), 200, 338, fill="#91ad2d", width=5)
    draw_leaf_pattern(draw, 398, 430, 1002, 430, "#d79a23")

    # Logo
    logo = Image.open(LOGO).convert("RGBA")
    logo.thumbnail((430, 430), Image.Resampling.LANCZOS)
    img.alpha_composite(logo, (700 - logo.width // 2, 305))
    draw = ImageDraw.Draw(img)

    # Product label
    draw_centered(draw, (700, 785), "HUYEN TUYEN RICE", font("georgiab.ttf", 68), "#40210f")
    draw_centered(draw, (700, 845), "Premium Rice - Full of Love", font("georgiab.ttf", 34), "#2e6b28")
    draw.line((420, 900, 1080, 900), fill="#e2a42a", width=4)

    rounded_rect(draw, (400, 950, 1000, 1165), 24, "#fff4d3", "#e0c070", 3)
    draw_centered(draw, (700, 1010), "GAO CHAT LUONG CAO", font("arialbd.ttf", 42), "#2d5c26")
    draw_centered(draw, (700, 1060), "High-quality rice for daily family meals", font("arial.ttf", 27), "#5e4a2a")
    draw_centered(draw, (700, 1113), "Net weight: 5 kg", font("arialbd.ttf", 36), "#7a3f18")

    # QR area
    qr_img = make_qr(300)
    img.paste(qr_img.convert("RGBA"), (445, 1210))
    rounded_rect(draw, (760, 1232, 1060, 1490), 20, "#ffffff", "#d5b76c", 3)
    draw_centered(draw, (910, 1290), "SCAN TO SHOP", font("arialbd.ttf", 30), "#2e6b28")
    draw.multiline_text(
        (910, 1370),
        "Quet ma QR de\nxem san pham,\ngia ban va dat hang",
        font=font("arial.ttf", 29),
        fill="#4c3b24",
        anchor="mm",
        align="center",
        spacing=9,
    )
    draw_centered(draw, (700, 1575), QR_URL, font("arialbd.ttf", 23), "white")
    draw_centered(draw, (700, 1630), "VND/kg | Fresh Rice | Huyen Tuyen Rice", font("arial.ttf", 28), "#f9e7b2")

    img.convert("RGB").save(OUT_FILE, quality=96)
    print(OUT_FILE)


if __name__ == "__main__":
    main()
