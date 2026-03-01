import cv2
import numpy as np
import glob
import os
import concurrent.futures

os.makedirs('public/baba-transparent-clean', exist_ok=True)

def process_file(f):
    img = cv2.imread(f)
    if img is None: return
    
    # Create an alpha channel
    bg_removed = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    
    # Define thresholds for white and light grey
    # The checkerboard has #ffffff (255,255,255) and #e6e6e6 (230,230,230)
    # We can mask out any pixel that is very bright and very unsaturated
    
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    
    # The checkerboard is grayscale and very bright
    # Saturation is almost 0, Value is high (e.g. > 220)
    # We also don't want to remove his white beard or clothes. Right now he is mostly orange/skin tone/white beard.
    # His beard is white, but usually not EXACTLY the checkerboard color or we can use a contour matching technique.
    # A safer approach for this specific checkerboard: Flood fill from the corners!
    
    # Create mask for floodfill
    h, w = img.shape[:2]
    mask = np.zeros((h+2, w+2), np.uint8)
    
    # Flood fill from the 4 corners, assuming they are background
    cv2.floodFill(bg_removed, mask, (0,0), (255,255,255,0), (10,10,10,10), (10,10,10,10), cv2.FLOODFILL_FIXED_RANGE)
    cv2.floodFill(bg_removed, mask, (w-1,0), (255,255,255,0), (10,10,10,10), (10,10,10,10), cv2.FLOODFILL_FIXED_RANGE)
    cv2.floodFill(bg_removed, mask, (0,h-1), (255,255,255,0), (10,10,10,10), (10,10,10,10), cv2.FLOODFILL_FIXED_RANGE)
    cv2.floodFill(bg_removed, mask, (w-1,h-1), (255,255,255,0), (10,10,10,10), (10,10,10,10), cv2.FLOODFILL_FIXED_RANGE)
    
    # The checkerboard might not flood fill nicely. Let's try thresholding instead but isolated to the border/background
    
    # Better yet, since we have the original `baba.png` which had a transparent background, did we? No, it was white.
    # Let's use `rembg` which uses AI to perfectly cut out the background.
    print(f"skipping opencv, will use rembg instead for {f}")

# process_file('public/baba-frames-new/ezgif-frame-001.jpg')
