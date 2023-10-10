import json
import os
import struct
from secp256k1Crypto import PrivateKey
import hashlib

CHAIN_MAGIC = 0x4348
ERC20_MAGIC = 0x3020
VERSION_MAGIC = 0x4532

PAGE_SIZE = 8192
WORD_SIZE = 16

enc_key = os.environ['DB_SIGN_KEY']
version_len = 0x0004

def serialize_addresses(addresses):
    res = b''
    for id, address in addresses.items():
        if len(address) != 42:
            assert "Unexpected address format"
        res = res + struct.pack("<I20s", id, bytes.fromhex(address[2:]))

    return res

def serialize_chain(chain):
    chain_len = 4 + len(chain["ticker"]) + 1 + len(chain["name"]) + 1 + len(chain["shortName"]) + 1
    return struct.pack("<HHI", CHAIN_MAGIC, chain_len, chain["id"]) + \
        bytes(chain["ticker"], "ascii") + b'\0' + \
        bytes(chain["name"], "ascii") + b'\0' + \
        bytes(chain["shortName"], "ascii") + b'\0'

def serialize_token(token):
    addresses = serialize_addresses(token["addresses"])
    token_len = 1 + len(addresses) + 1 + len(token["ticker"]) + 1

    return struct.pack("<HHB", ERC20_MAGIC, token_len, len(token["addresses"])) + \
        addresses + \
        struct.pack("B", token["decimals"]) + \
        bytes(token["ticker"], "ascii") + b'\0'

def pad_write(f, m, buf, page_limit):
    f.write(buf)
    m.update(buf)

    if page_limit != PAGE_SIZE:
        return

    size = len(buf)
    padlen = WORD_SIZE - (size % WORD_SIZE)

    while padlen > 0:
        f.write((0x80 | padlen).to_bytes(1))
        m.update((0x80 | padlen).to_bytes(1))
        padlen = padlen - 1
        size = size + 1

    while size < PAGE_SIZE:
        f.write(0xff.to_bytes(1))
        m.update(0xff.to_bytes(1))
        size = size + 1

def serialize_db(f, m, page_align, chains, tokens, ver):
    page_limit = PAGE_SIZE if page_align else 0xffffffff
    buf = b''

    buf = ver

    for chain in chains.values():
        serialized_chain = serialize_chain(chain)
        if len(buf) + len(serialized_chain) <= page_limit:
            buf = buf + serialized_chain
        else:
            pad_write(f, m, buf, page_limit)
            buf = serialized_chain

    for token in tokens.values():
        serialized_token = serialize_token(token)
        if len(buf) + len(serialized_token) <= page_limit:
            buf = buf + serialized_token
        else:
            pad_write(f, m, buf, page_limit)
            buf = serialized_token

    if len(buf) > 0:
        pad_write(f, m, buf, page_limit)


def lookup_chain(chains_json, chain_id):
    for chain in chains_json:
        if chain["chainId"] == chain_id:
            return chain
    return None

def process_token(tokens, chains, token_json, chains_json):
    chain_id = token_json["chainId"]

    chain = chains.get(chain_id)
    if chain is None:
        chain_json = lookup_chain(chains_json, chain_id)
        chain = {
            "id": chain_id,
            "name": chain_json["name"],
            "shortName": chain_json["shortName"],
            "ticker": chain_json["nativeCurrency"]["symbol"],
            "decimals": chain_json["nativeCurrency"]["decimals"],
        }

        chains[chain_id] = chain

    symbol = token_json["symbol"]
    token = tokens.get(symbol)

    if token is None:
        token = {
            "addresses": {},
            "ticker": symbol,
            "decimals": token_json["decimals"]
        }
        tokens[symbol] = token

    token["addresses"][chain_id] = token_json["address"]

def sign(m):
    key = PrivateKey(bytes(bytearray.fromhex(enc_key)), raw=True)
    sig = key.ecdsa_sign(m, raw=True)
    return key.ecdsa_serialize_compact(sig)

def generate_token_bin_file(token_list, chain_list, output, db_version, page_align):
    token_list = json.load(open(token_list))
    chain_list = json.load(open(chain_list))
    m = hashlib.sha256()

    tokens = {}
    chains = {}

    ver = struct.pack("<HHI", VERSION_MAGIC, version_len, db_version)

    for token in token_list["tokens"]:
        process_token(tokens, chains, token, chain_list)

    with open(output, 'wb') as f:
        serialize_db(f, m, page_align, chains, tokens, ver)
        m_hash = m.digest()
        signature = sign(m_hash)
        f.write(signature)

    return m_hash.hex()
