import re
import numpy as np
import random
import jsonpickle
import json
import os
import hashlib


def mkdir(dirname):
    if not os.path.exists(dirname):
        os.makedirs(dirname)


def short_hash(strings: list, hash_length: int):
    """
    Creates a short hash for a list of strings of a specified length.
    Raises an error if collisions are found.
    :param strings: list of strings
    :param hash_length: int
    :return:
    """
    hashes = [hashlib.sha1(s.encode("UTF-8")).hexdigest()[:hash_length] for s in strings]
    if len(set(hashes)) < len(strings):
        raise Exception("Hash collisions found. Increase hash length.")
    return hashes


# String misc
def replace(s: str, replacements: dict):
    to_replace = list(replacements)
    replace_tokens = {s: '<<<{}>>>'.format(s) for s in to_replace}
    regex_tokenize = re.compile('|'.join(map(re.escape, to_replace)))
    s = regex_tokenize.sub(lambda match: replace_tokens[match.group(0)], s)
    replace_with = {v: replacements[k] for k, v in replace_tokens.items()}
    regex_replace = re.compile('|'.join(map(re.escape, list(replace_tokens.values()))))
    return regex_replace.sub(lambda match: replace_with[match.group(0)], s)


def get_combinations(a, b):
    """
    :param a: 1-d iterable
    :param b: 1-d iterable
    :return: 1-d numpy array of (a[i], b[j]) for every i, j in a, b
    """
    return np.array(np.meshgrid(a, b)).T.reshape(-1, 2)


def flatten(lst):
    return [item for sublist in lst for item in sublist]


def sample(s: set, n=1):
    s = random.sample(s, n)
    return s[0] if n == 1 else s


def as_dict(obj):
    return json.loads(jsonpickle.encode(obj, unpicklable=False))


def rotate(array, n):
    return array[n:] + array[:n]


class UniversalEncoder(json.JSONEncoder):
    def default(self, o):
        if type(o) == set:
            return sorted(o)

        if hasattr(o, 'toJSON'):
            return o.toJSON()

        # For numpy
        if isinstance(o, (np.int_, np.intc, np.intp, np.int8,
                            np.int16, np.int32, np.int64, np.uint8,
                            np.uint16, np.uint32, np.uint64)):
            return int(o)
        if isinstance(o, (np.float_, np.float16, np.float32,
                              np.float64)):
            return float(o)
        if isinstance(o, (np.ndarray,)):  #### This is the fix
            return o.tolist()

        # Default: return the dict of object
        return o.__dict__