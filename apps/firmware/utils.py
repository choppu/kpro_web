import os
import shutil
import zipfile

def zip_db_files(db_path, zip_path):
  with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
    for fp in db_path.glob("**/*"):
      if fp.suffix in {".json", ".bin"}:
        zipf.write(fp, arcname=fp.relative_to(db_path))

def makedirs(path):
      try:
        os.makedirs(path)
      except OSError as e:
        if e.errno == 17:
            pass

def deletedirs(path):
  if os.path.exists(path):
    shutil.rmtree(path)