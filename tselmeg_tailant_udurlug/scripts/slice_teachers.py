import os
import cv2
import numpy as np
import shutil

base_dir = 'uploads/teachers'
output_dir = 'public/uploads/teachers_cards'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for dept in os.listdir(base_dir):
    dept_path = os.path.join(base_dir, dept)
    if not os.path.isdir(dept_path):
        continue

    out_dept_path = os.path.join(output_dir, dept)
    if not os.path.exists(out_dept_path):
        os.makedirs(out_dept_path)

    for filename in os.listdir(dept_path):
        filepath = os.path.join(dept_path, filename)
        if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            continue

        if 'negdel' in filename.lower():
            # Copy negdel
            shutil.copy(filepath, os.path.join(out_dept_path, filename))
            print(f"Copied {filename}")
            continue

        # Process teacher grid images
        print(f"Processing {filepath}")
        img = cv2.imread(filepath)
        if img is None:
            print(f"Failed to read {filepath}")
            continue

        # 1. Find blue rectangle
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        kernel = np.ones((5,5), np.uint8)
        edges = cv2.dilate(edges, kernel, iterations=2)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            print(f"No contours found in {filepath}")
            continue

        largest_contour = max(contours, key=cv2.contourArea)
        rx, ry, rw, rh = cv2.boundingRect(largest_contour)

        # 2. Find yellow circles
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        lower_yellow = np.array([10, 100, 100])
        upper_yellow = np.array([40, 255, 255])
        yellow_mask = cv2.inRange(hsv, lower_yellow, upper_yellow)
        yellow_contours, _ = cv2.findContours(yellow_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        circles = []
        for cnt in yellow_contours:
            cx, cy, cw, ch = cv2.boundingRect(cnt)
            # Filter for circles: aspect ratio ~ 1.0, width > 5% of blue rect width, and inside blue rect
            if 0.8 < cw/ch < 1.2 and cw > rw * 0.05 and cy < ry + rh:
                circles.append((cx, cy, cw, ch))

        # Handle case where multiple contours might be part of same circle (e.g., broken yellow line)
        # We can just group by Y and pick largest
        valid_circles = []
        for c in circles:
            # Check if this circle overlaps significantly with an existing one
            overlap = False
            for i, vc in enumerate(valid_circles):
                if abs(c[1] - vc[1]) < vc[3] * 0.5: # Y difference is small
                    overlap = True
                    if c[2]*c[3] > vc[2]*vc[3]: # Keep larger one
                        valid_circles[i] = c
                    break
            if not overlap:
                valid_circles.append(c)

        valid_circles.sort(key=lambda c: c[1]) # Sort by Y

        if not valid_circles:
            print(f"No valid circles found in {filepath}")
            continue

        # 3. Slice horizontally
        for i in range(len(valid_circles)):
            c_curr = valid_circles[i]
            cy_curr = c_curr[1] + c_curr[3]/2 # Center Y

            # Top boundary
            if i == 0:
                y_top = ry
            else:
                c_prev = valid_circles[i-1]
                cy_prev = c_prev[1] + c_prev[3]/2
                y_top = int(cy_prev + (cy_curr - cy_prev) / 2)

            # Bottom boundary
            if i == len(valid_circles) - 1:
                # Use a larger distance for the last one just in case
                # Look at how much text could be there.
                # Let's say dist_to_top * 1.5, bounded by ry+rh
                dist_to_top = cy_curr - y_top
                y_bottom = int(cy_curr + dist_to_top * 1.3)
                y_bottom = min(y_bottom, ry + rh)
            else:
                c_next = valid_circles[i+1]
                cy_next = c_next[1] + c_next[3]/2
                y_bottom = int(cy_curr + (cy_next - cy_curr) / 2)

            # Extract slice
            slice_img = img[y_top:y_bottom, rx:rx+rw]

            # Save slice
            base_name = os.path.splitext(filename)[0]
            out_name = f"{base_name}_teacher_{i+1}.png".replace(" ", "_")
            out_path = os.path.join(out_dept_path, out_name)
            cv2.imwrite(out_path, slice_img)
            print(f"  -> Saved {out_path} (y={y_top} to {y_bottom})")
