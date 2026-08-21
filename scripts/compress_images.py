"""Create deploy-ready WebP images from approved source assets.

Run from the repository root with: python3 scripts/compress_images.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path("/home/ubuntu/webdev-static-assets")
OUTPUT = ROOT / "src" / "assets" / "images"

ASSETS = {
    "kakei-logo.png": ("kakei-logo.webp", 256, 88),
    "kakei-hero-notebook.png": ("kakei-hero-notebook.webp", 1600, 82),
    "kakei-balance-illustration.png": ("kakei-balance-illustration.webp", 1100, 82),
    "tsumugi-kurashi-money-icon.png": ("tsumugi-kurashi-money-icon.webp", 650, 84),
}


def resize(image: Image.Image, max_width: int) -> Image.Image:
    if image.width <= max_width:
        return image
    new_height = round(image.height * max_width / image.width)
    return image.resize((max_width, new_height), Image.Resampling.LANCZOS)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for original, (target, max_width, quality) in ASSETS.items():
        source_path = SOURCE / original
        if not source_path.exists():
            raise FileNotFoundError(f"Missing source asset: {source_path}")
        with Image.open(source_path) as source_image:
            image = resize(source_image, max_width)
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA" if "transparency" in image.info else "RGB")
            image.save(OUTPUT / target, "WEBP", quality=quality, method=6)
            print(f"Created {target}: {image.width}x{image.height}")


if __name__ == "__main__":
    main()
