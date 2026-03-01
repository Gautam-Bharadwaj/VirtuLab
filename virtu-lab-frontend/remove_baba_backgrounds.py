import cv2
import numpy as np
import glob
import os
import concurrent.futures

os.makedirs('public/baba-transparent-clean', exist_ok=True)

def process_file(f):
    img = cv2.imread(f, cv2.IMREAD_UNCHANGED)
    if img is None: return
    
    # Check if image already has alpha channel, if not add it
    if img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
        
    # The checkered background has two colors: whiteish and greyish.
    # Convert to grayscale to identify these backgrounds easily
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # We create a mask for pixels that are very bright (white) OR specific grey
    # Instead of hardcoding colors, we can use the fact that the background is perfectly uniform in regions.
    # But let's use color thresholds first.
    # White check: ~255
    # Grey check: ~230 (#e6e6e6) - we can look at the img
    # Let's create a mask where Saturation is low and Value is high.
    hsv = cv2.cvtColor(cv2.cvtColor(img, cv2.COLOR_BGRA2BGR), cv2.COLOR_BGR2HSV)
    _, s, v = cv2.split(hsv)
    
    # Background is white/grey meaning Saturation < 20 and Value > 200
    bg_mask = (s < 20) & (v > 200)
    
    # BUT! Baba's beard is also white! (Saturation < 20, Value > 200)
    # We must only remove the background. The background touches the edges of the image!
    # So we use floodFill from the corner (0,0) which is definitely background.
    
    # Let's create a solid mask of just the background using floodFill
    h, w = img.shape[:2]
    flood_mask = np.zeros((h+2, w+2), np.uint8)
    
    # Create a dummy image for floodfill where the background gets painted
    # We use a difference tolerance to allow filling both white and grey checks? 
    # The checks might not be connected if we use small tolerance. 
    # But since they touch, maybe we can't reliably flood fill both.
    
    # Alternative: The background is the ONLY thing at coordinate y < 100 for example, except for his halo.
    # Actually, the simplest approach is a background subtraction based on the first frame's corners.
    pass

    # Let's try simpler: Color replacement masking
    
    lower_white = np.array([245, 245, 245, 255])
    upper_white = np.array([255, 255, 255, 255])
    
    lower_grey = np.array([220, 220, 220, 255])
    upper_grey = np.array([235, 235, 235, 255])
    
    # This is tricky without Deep Learning.
    
    # Let's fix the huggingface_hub issue for `rembg` instead, it is much more robust!
    pass
