from common.utils import deletedirs

def upload_file(file, output, write_type, enc, nl):
        with open(output, write_type, encoding=enc, newline=nl) as f:
           f.write(file)

def delete_fw(fw_version):
    print(fw_version)
    print("Hello")
    p = 'uploads/' + fw_version
    deletedirs(p)