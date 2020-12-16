const _ = require('lodash');

/**
 * Dict is a flexible dictionary that allows for arrays as keys.
 */
export class Dict {

  dict: Map<number | string, any>;
  keys: Array<number | string | Array<number | string>>;

  constructor () {
    this.dict = new Map<number | string, any>();;
    this.keys = new Array<number | string | Array<number | string>>();
  }

  get (key: string | number | Array<string | number>) {
    if (!Array.isArray(key)) {
      return this.isTopLayerKey(key) ? this.dict.get(key) : undefined;
    } else if (key.length == 1) {
      return this.isTopLayerKey(key[0]) ? this.dict.get(key[0]) : undefined;
    } else {
      return this.isTopLayerKey(key[0]) ? this.dict.get(key[0]).get(_.tail(key)) : undefined;
    }
  }

  set (key: string | number | Array<string | number>, value: any ) {
    this.keys.push(key);
    if (!Array.isArray(key)) {
      this.dict.set(key, value);
    } else if (key.length == 1) {
      this.dict.set(key[0], value);
    } else {
      if (!this.isTopLayerKey(key[0])) {
        this.dict.set(key[0], new Dict());
      }
      this.dict.get(key[0]).set(_.tail(key), value);
    }
  }

  isTopLayerKey(key: string | number) {
    return this.dict.has(key);
  }

  clone() {
    const d = new Dict();
    d.dict = _.cloneDeep(this.dict);
    d.keys = _.cloneDeep(this.keys);
    return d
  }
}