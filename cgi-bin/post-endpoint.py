#!/usr/bin/python

print("Access-Control-Allow-Origin: *")
print('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS')
print("Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With, remember-me\n")

import sys
import json

try:
    body = json.load(sys.stdin)
    filename = body[u'filename']
    data = body[u'data']

    with open('data/' + filename, 'w') as f:
        json.dump(data, f)
    response = {'success': True, 'filename': filename, 'data': data}
    print(json.dumps(response))
except Exception as e:
    print(json.dumps({'error': str(e)}))