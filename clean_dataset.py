from glob import glob
import os
from PIL import Image
from skimage import io, color
from tqdm import tqdm

from dotenv import load_dotenv
load_dotenv()

files = glob(f"{os.getenv('FURNITURE_DATASET_DOWNLOAD_DIRECTORY')}/*/*/*")
with tqdm(total=len(files)) as pbar:
  for filename in files:
    try:
      image = Image.open(filename)
      image.verify()

      mode = image.mode
      if mode == 'RGB':
        im = io.imread(filename)
        io.imsave(filename, im)
      elif mode == 'RGBA':
        im = io.imread(filename)
        im = color.rgba2rgb(im)
        io.imsave(filename, im)
      elif mode == 'L':
        im = io.imread(filename)
        im = color.gray2rgb(im)
        io.imsave(filename, im)
      elif mode == 'P':
        os.remove(filename)
      elif mode == 'CMYK':
        os.remove(filename)
      else:
        pass
    except:
      os.remove(filename)

    pbar.update(1)
