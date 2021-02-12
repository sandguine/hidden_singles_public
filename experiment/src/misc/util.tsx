import * as assert from "assert";
import * as React from "react";

const _ = require('lodash');
const stringify = require('json-stable-stringify');
import * as moment from 'moment';
import {settings} from "../app/AppSettings";

export class Coordinate {
  readonly x: number;
  readonly y: number;

  constructor(x: number | number[] | object, y?: number) {
    assert((Array.isArray(x) && x.length == 2)
      || (typeof x == "object" && x['x'] != undefined && x['y'] != undefined)
      || (typeof x == "number" && typeof y == "number"));
    if (Array.isArray(x)) {
      this.x = x[0];
      this.y = x[1];
    } else if (typeof x == "object") {
      this.x = x['x'];
      this.y = x['y'];
    } else {
      this.x = x;
      this.y = y!;
    }
  }

  equals(other: Coordinate) {
    return this.x == other.x && this.y == other.y;
  }

  inNeighborhood(other: Coordinate, dimX: number, dimY: number) {
    const neighborhood = this.neighborhood(dimX, dimY);
    const index = _.find(neighborhood, (c: Coordinate) => _.isEqual(c, other));
    return index != undefined;
  }

  neighborhood(dimX: number, dimY: number) {
    const row = Coordinate.row(dimX, dimY, this.x);
    const column = Coordinate.column(dimX, dimY, this.y);
    const box_index = dimX * Math.floor(this.x / dimX) + Math.floor(this.y / dimY);
    const box = Coordinate.box(dimX, dimY, box_index);
    return _.unionWith(row, column, box, _.isEqual);
  }

  inSameBox(other: Coordinate, dimX: number, dimY: number) {
    const box_index = dimX * Math.floor(this.x / dimX) + Math.floor(this.y / dimY);
    const box = Coordinate.box(dimX, dimY, box_index);
    const index = _.find(box, (c: Coordinate) => _.isEqual(c, other));
    return index != undefined;
  }

  static row(dimX: number, dimY: number, index: number) {
    const maxDigit = dimX * dimY;
    return _.map(_.range(maxDigit), (i: number) => new Coordinate(index, i));
  }

  static column(dimX: number, dimY: number, index: number) {
    const maxDigit = dimX * dimY;
    return _.map(_.range(maxDigit), (i: number) => new Coordinate(i, index));
  }

  static box(dimX: number, dimY: number, index: number) {
    const coordinates = [];
    const x_min = Math.floor(index/dimX)*dimX;
    const y_min = (index%dimY)*dimY;
    for (let x=x_min; x < x_min+dimX; x++) {
      for (let y=y_min; y < y_min+dimY; y++) {
        coordinates.push(new Coordinate(x, y));
      }
    }
    return coordinates;
  }

  static sort(coords: Coordinate[]) {
    return _.sortBy(coords, ['x', 'y']);
  }

  static isCoordinate(s: string) {
    return /^\([0-9]+\s*,\s*[0-9]+\)$/.test(s);
  }

  static fromString(s: string) {
    if (Coordinate.isCoordinate(s)) {
      const numbers = extractNumbers(s);
      return new Coordinate(numbers[0], numbers[1]);
    } else {
      return null;
    }
  }
}

export enum Color {
  green = 'rgb(0, 200, 70)',
  red = 'orangered',
  blue = 'rgb(50, 150, 255)',
  purple = 'orchid',
  gray = '#848484',
  orange = 'orange'
}

async function attemptPost(filename: string, data: any) {
  const stringForm = stringify(data);
  return await fetch(settings.postURL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "filename": filename,
      data: data,
    })
  }).then(response => response.json())
    .then(function (response: any) {
      const result = stringify(response['data']) == stringForm;
      if (result) {
        return true;
      } else {
        console.log(response);
        return false;
      }
    })
    .catch(function (error: any) {
      console.log(error);
      return false;
    });
}

export async function post(filename: string, data: any, wait: boolean) {
  let retry = true;
  let i = 1;
  if (wait) {
    while (retry) {
      console.log(`Attempt with await ${i}: posting to ${filename}`);
      retry = !await attemptPost(filename, data);
      i += 1;
      await sleep(Math.min(8000, Math.pow(2, i)*50)); // exponential backoff
    }
    console.log("Post success!");
  } else {
    console.log(`Posting to ${filename}`);
    attemptPost(filename, data);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function now() {
  return moment().utc().format("YYYYMMDD_HHmmssSSSS_z");
}

export function getUrlParams() {
  const params = new URL(window.location.href).searchParams;
  // @ts-ignore
  const keys = Array.from(params.keys());
  const values = _.map(keys, (k: string) => params.get(k));
  return _.zipObject(keys, values);
}

export function emitHitComplete(message: string) {
  window.top.postMessage(message,"*")
}

export function toCents(n: number) {
  n = round(n*100, 1e-2, 2);
  return n.toString() + '\xA2'
}

export function toUSD(n: number) {
  n = round(n, 1e-2, 2);
  let s = n.toString().split('.');
  let precision = 2;
  if (s.length > 1) {
    precision = Math.max(2, s[1].length);
  }
  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: precision
  });
  return usdFormatter.format(n);
}

export function round(n: number, to: number, precision?: number) {

  let rounded = Math.round(n / to) * to;
  if (rounded == 0) {
    return 0; // prevents -0
  }

  if (precision == undefined) {
    precision = Number.isInteger(to) ? 0 : to.toString().split('.')[1].length;
  }
  rounded = parseFloat(Number.parseFloat(rounded.toString()).toFixed(precision));

  return rounded;
}

export function arrayEquals(x: object[], y: object[]) {
  return _(x).xorWith(y, _.isEqual).isEmpty();
}

export function readFile(filename: string, callback: (text: string) => void) {
  fetch(filename)
    .then((r) => (r.text().then((t) => callback(t))));
}

export function loadImage(filename: string, width?: number, height?: number) {
  filename = process.env.PUBLIC_URL + filename;
  return <img src={filename} width={width} height={height}/>;
}


export function replaceAll(s: string, search: string, replacement: string) {
  return s.split(search).join(replacement);
}

export function shuffleMap(min: number, max: number, stringify?: boolean) {
  stringify = stringify || (stringify == undefined);
  const range = _.map(_.range(min, max+1), (n: number) => stringify ? n.toString() : n);
  const shuffled = _.shuffle(range);
  return _.zipObject(range, shuffled);
}

export function indexOf(s: string, sub: string, n?: number) {
  // returns the index of the nth occurrencee of sub
  if (!n) {
    n = 1;
  }
  let index = s.indexOf(sub);
  if (n == 1 || index < 0) {
    return index;
  }

  for (let i=1; i < n; i++) {
    index += 1;
    let new_s = s.slice(index);
    let newIndex = new_s.indexOf(sub);
    if (newIndex < 0) {
      return newIndex // exit early
    }
    index += newIndex;
  }
  return index;
}

export function findAll(seq: any[] | string, value: any) {
  const indices = [];
  let lastIndex = 0;
  while (lastIndex > -1) {
    if (typeof seq == "string") {
      lastIndex = seq.indexOf(value, lastIndex+1);
    } else {
      lastIndex = _.indexOf(seq, value, lastIndex+1);
    }
    indices.push(lastIndex);
  }
  indices.pop();
  return indices;
}

export function deepMap(a: any[], depth: number, f: (e: any) => any): any[] {
  if (depth == 1) {
    return _.map(a, f);
  }
  return _.map(a, (e: any) => deepMap(e, depth-1, f));
}

export function emptyTensor(...shape: number[]) {
  let array = Array(shape[0]).fill(null);
  for (let i = 1; i < shape.length; i++) {
    array = deepMap(array, i, (e => Array(shape[i]).fill(null)));
  }
  return array;
}

export function combinations(...arrays: any[]) {
  let combined = _.map(arrays[0], (e: any) => [e]);
  for (let a of arrays.slice(1)) {
    let new_combined = [];
    for (let item of a) {
      let combination = _.map(combined, (e: any) => {
        let arr = _.clone(e);
        arr.push(item);
        return arr;
      });
      new_combined.push(combination);
    }
    combined = _.flatten(new_combined);
  }
  return combined;
}

export function strCombinations(separator: string, ...arrays: any[]) {
  let combined = combinations(...arrays);
  return _.map(combined, (e: any) => _.join(e, separator));
}

export function XOR(a: any, b: any) {
  return !a != !b;
}

export function choice(a: any[], size?: number, replace?: boolean) {
  size = size ? size : 1;
  replace = replace === undefined ? true : replace;

  if (replace) {
    return _.shuffle(a).slice(0, size);
  } else {
    const b = [];
    for (let i=0; i<size; i++) {
      b.push(a[Math.floor((Math.random() * a.length))]);
    }
    return b;
  }
}

export function find2d(a: any[][], predicate: any) {
  const coords = [];
  for (let i=0; i<a.length; i++) {
    for (let j=0; j<a[i].length; j++) {
      if (_.isFunction(predicate) && predicate(a[i][j])) {
        coords.push(new Coordinate(i, j));
      } else if (a[i][j] == predicate) {
        coords.push(new Coordinate(i, j));
      }
    }
  }
  return coords;
}

export function extractNumbers(s: string) {
  const match = s.match(/\d+/g);
  return match ? match.map(Number) : [];
}

export function reverseMap(o: object) {
  const keys = _.keys(o);
  const values = _.map(keys, (k: string) => {return o[k]});
  return _.zipObject(values, keys);
}

export function rotate(a: Array<any>, n: number) {
  return a.slice(n, a.length).concat(a.slice(0, n));
}

export function balanced_latin_square(n: number) {
  const a = _.range(n);
  const latin_square = [];
  for (let i=0; i<n; i++) {
    latin_square.push(rotate(a, (i%2 ? 1 : -1)*Math.floor((i+1)/2)));
  }
  return _.zip(...latin_square);
}

export function random_balanced_latin_square(n: number) {
  let latin_square = balanced_latin_square(n);
  latin_square = _.shuffle(latin_square);
  const map = shuffleMap(0, n-1, false);
  latin_square = deepMap(latin_square, 2, (e) => {return map[e]});
  return latin_square;
}

/*
Generates a random integer between [a, b] inclusive if b is provided.
If b is not provided, generates a random integer between [0, a] inclusive.
 */
export function randInt(a: number, b?: number) {
  if (b != undefined) {
    return a + Math.floor(Math.random() * (b - a + 1));
  } else {
    return Math.floor(Math.random() * (a + 1));
  }
}

export function random_boolean() {
  return Math.random() >= 0.5;
}

export function levenshteinDistance(a: string, b: string): number {
  // pulled from https://github.com/trekhleb/javascript-algorithms/blob/master/src/algorithms/string/levenshtein-distance/levenshteinDistance.js
  const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i += 1) {
    distanceMatrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j += 1) {
    distanceMatrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      distanceMatrix[j][i] = Math.min(
        distanceMatrix[j][i - 1] + 1, // deletion
        distanceMatrix[j - 1][i] + 1, // insertion
        distanceMatrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return distanceMatrix[b.length][a.length];
}