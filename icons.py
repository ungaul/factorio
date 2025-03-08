import os
from PIL import Image

def crop_images(input_folder, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        if filename.endswith(".png"):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, filename)

            try:
                with Image.open(input_path) as img:
                    cropped_img = img.crop((0, 0, 64, 64))
                    cropped_img.save(output_path)
                    print(f"Cropped and saved: {output_path}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

directory = "C:/Users/.../Desktop/Icons"
output_directory = os.path.join(directory, "cropped")
crop_images(directory, output_directory)
