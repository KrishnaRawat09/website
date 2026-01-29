from PIL import Image, ImageDraw
import os

# Settings
bg_color = (0, 0, 0, 0) # Transparent
primary_color = (249, 115, 22) # #f97316 (Brand Orange)
white_color = (255, 255, 255)
size = (200, 200)
frames = 8

def generate_frames():
    for i in range(1, frames + 1):
        img = Image.new('RGBA', size, bg_color)
        draw = ImageDraw.Draw(img)
        
        # Center coordinates
        cx, cy = size[0] // 2, size[1] // 2
        
        # Logic: "Fast Geometric Build"
        # Draw expanding concentric circles segments or squares
        # Frame 1: Small center dot
        # Frame 8: Full complex shape
        
        step = i
        
        # Draw some dynamic shapes based on step
        # 1. Rotating square
        radius = 20 + (step * 10)
        draw.regular_polygon((cx, cy, radius), 4, rotation=step*45, fill=None, outline=primary_color, width=3)
        
        # 2. Expanding outer ring (only later frames)
        if step > 2:
            draw.ellipse((cx - radius - 10, cy - radius - 10, cx + radius + 10, cy + radius + 10), outline=white_color, width=2)
            
        # 3. Inner solid circle (pulse)
        if step % 2 == 0:
             draw.ellipse((cx - 10, cy - 10, cx + 10, cy + 10), fill=primary_color)

        filename = f"frame-{i}.png"
        img.save(filename)
        print(f"Generated {filename}")

if __name__ == "__main__":
    generate_frames()
