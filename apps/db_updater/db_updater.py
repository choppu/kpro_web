import itertools
import json
from common.utils import makedirs, deletedirs, zip_db_files
from .token_db import generate_token_bin_file
from urllib.request import urlopen
from pathlib import Path

def upload_db_file(r_path, w_path):
      resp = urlopen(r_path)
      data = json.loads(resp.read())
      with open(w_path, "w") as outfile:
        json.dump(data, outfile)

class DBUpdate:
  element_id = itertools.count()

  def __init__(self, erc20_url, chain_url, db_version):
    self.id = next(self.element_id)
    self.erc20_url = str(erc20_url)
    self.chain_url = str(chain_url)
    self.db_version = str(db_version)

  def upload_db(self):
    p = 'uploads/' + self.db_version
    makedirs(p)

    erc20_out_path = p + '/erc20.json'
    chain_out_path = p + '/chain.json'
    bin_output = p + '/db.bin'
    zip_path = p + '/' + self.db_version + '.zip'

    upload_db_file(self.erc20_url, erc20_out_path)
    upload_db_file(self.chain_url, chain_out_path)

    file_hash = generate_token_bin_file(erc20_out_path, chain_out_path, bin_output, int(self.db_version), False)
    zip_db_files(Path(p), Path(zip_path))

    return file_hash

  def delete_db(db_version):
    p = 'uploads/' + db_version
    deletedirs(p)
