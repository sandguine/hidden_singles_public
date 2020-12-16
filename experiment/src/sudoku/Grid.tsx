import './Grid.css';
import React from 'react';
import {GridAction, GridActionType} from "./GridAction";
import {Dict} from "../misc/dict";
import {arrayEquals, Coordinate, deepMap, replaceAll} from "../misc/util";
import * as assert from "assert";
var _ = require('lodash');
var classNames = require('classnames');

class AxisCell extends React.Component {
  props: {
    grid: Grid,
    key: string,
    digit: string | null,
    size: number
  };

  render() {
    const cellStyle = {
      width: this.props.size,
      height: this.props.size,
      fontSize: this.props.size*.7
    };

    return (
      <span className={'cell-button'} style={cellStyle}>{this.props.digit}</span>
    );
  }
}

class CellProps {
  x: number;
  y: number;
  mutable: boolean;
  size: number;

  onSelect: (cell: Cell) => void;

  value?: string;

  selectable: boolean;
  color?: string;
  background?: string;
  borderLeft?: boolean;
  borderRight?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;

  constructor (x: number, y: number, mutable: boolean, size: number, onSelect: (cell: Cell) => void) {
    this.x = x;
    this.y = y;
    this.mutable = mutable;
    this.size = size;
    this.onSelect = onSelect;
    this.selectable = true;
  }
}

export class Cell extends React.Component {

  props: {
    cellProps: CellProps,
    key: string
  };

  state: {
    selected: boolean
  };

  coordinate: Coordinate;

  constructor(props: any) {
    super(props);
    this.state = {
      selected: false
    };
    this.coordinate = new Coordinate(this.props.cellProps.x, this.props.cellProps.y);
  }

  render() {
    const classes = classNames ({
      'cell-button': true,
      'border-left': this.props.cellProps.borderLeft,
      'border-right': this.props.cellProps.borderRight,
      'border-top': this.props.cellProps.borderTop,
      'border-bottom': this.props.cellProps.borderBottom,
    });

    const cellStyle = {
      width: this.props.cellProps.size,
      height: this.props.cellProps.size,
      fontSize: this.props.cellProps.size*.7,
      color: this.props.cellProps.color ? this.props.cellProps.color : 'black',
      background: this.props.cellProps.background ? this.props.cellProps.background : 'white',
    };

    return (
      <button className={classes}
              disabled={!this.props.cellProps.selectable}
              style={cellStyle}
              onClick={() => this.props.cellProps.onSelect(this)}>
        {this.props.cellProps.value}
      </button>
    );
  }
}

enum GridPropInstructionType {
  Background = 'background',
  Selectable = 'selectable',
  Write = 'write'
}

export interface GridPropParams {
  gridString: string,
  solutionString?: string,
  width?: number, // default 280
  mutable?: boolean, // default true
  selectable?: boolean, // default same as mutable
  multiselect?: boolean, // default false
  actionCallback: (gridAction: GridAction) => void
}

export class GridProps {
  gridString: string;
  solutionString?: string;
  width: number;
  mutable: boolean;
  selectable: boolean;
  multiselect: boolean;
  actionCallback: (gridAction: GridAction) => void;
  maxDigit: number;
  dimX: number;
  dimY: number;

  styleInstructions: Dict;
  writeInstructions: Dict;

  constructor(params: GridPropParams) {
    this.width = params.width ? params.width : 280;
    this.mutable = params.mutable == undefined ? true : params.mutable;
    this.selectable = this.mutable ? true : !!params.selectable;
    this.multiselect = this.selectable && !!params.multiselect;
    this.actionCallback = params.actionCallback;
    this.styleInstructions = new Dict();
    this.writeInstructions = new Dict();

    const gridString = params.gridString;
    const solutionString = params.solutionString;

    this.dimX = parseInt(gridString[0]);
    this.dimY = parseInt(gridString[2]);
    this.maxDigit = this.dimX*this.dimY;
    this.gridString = gridString.slice(4);

    if (solutionString) {
      assert.strictEqual(gridString.slice(0, 4), solutionString.slice(0, 4));
      this.solutionString = solutionString.slice(4);
    }
  }

  clone() {
    const props = new GridProps({
      gridString: this.gridString,
      actionCallback: this.actionCallback
    });
    props.gridString = this.gridString;
    props.solutionString = this.solutionString;
    props.width = this.width;
    props.mutable = this.mutable;
    props.selectable = this.selectable;
    props.multiselect = this.multiselect;
    props.maxDigit = this.maxDigit;
    props.dimX = this.dimX;
    props.dimY = this.dimY;
    props.styleInstructions = this.styleInstructions.clone();
    props.writeInstructions = this.writeInstructions.clone();
    return props;
  }

  removeAll(digit: number, solution?: boolean) {
    this.replaceAll(digit, null, solution);
  }

  replaceAll(from: number, to: number | null, solution?: boolean) {
    solution = solution || (solution == undefined);

    const charFrom = from.toString();
    const charTo = to == null ? '.' : to.toString();
    this.gridString = replaceAll(this.gridString, charFrom, charTo);
    if (solution && this.solutionString != undefined) {
      this.solutionString = replaceAll(this.solutionString, charFrom, charTo);
    }
  }

  getPuzzleArray() {
    return this.parseGridString(this.gridString);
  }

  getSolutionArray() {
    return this.solutionString ? this.parseGridString(this.solutionString) : null;
  }

  getHintArray() {
    return deepMap(this.getPuzzleArray(), 2, (e: number) => e > 0);
  }

  parseGridString(gridString: string) {
    const digits = _.map(Array(this.maxDigit), () => Array(this.maxDigit).fill(null) );
    if (gridString != '.') {
      let x = 0;
      let y = 0;
      const stride = String(this.maxDigit).length;
      while (gridString.length > 0) {
        if (gridString[0] == '.') {
          gridString = gridString.substring(1);
        } else {
          digits[x][y] = gridString.substring(0, stride);
          gridString = gridString.substring(stride);
        }
        y = (y + 1)%this.maxDigit;
        x += y == 0 ? 1 : 0;
      }
    }
    return digits;
  }

  addInstruction(type: GridPropInstructionType, cells: number[][] | number[] | Coordinate | Coordinate[], detail: any) {
    if (cells instanceof Coordinate) {
      cells = [cells];
    } else if (typeof cells[0] == 'number') {
      cells = [new Coordinate(cells[0] as number, cells[1] as number)];
    } else if (!(cells[0] instanceof Coordinate)) {
      cells = _.map(cells, (a: number[]) => new Coordinate(a[0], a[1]));
    }
    for (let i=0; i < (cells as Coordinate[]).length; i++) {
      this.styleInstructions.set([cells[i].x, cells[i].y, type], detail);
    }
  }

  background(cells: number[][] | number[] | Coordinate | Coordinate[], color: string) {
    this.addInstruction(GridPropInstructionType.Background, cells, color);
  }

  setSelectable(cells: number[][] | number[] | Coordinate | Coordinate[], selectable: boolean) {
    this.addInstruction(GridPropInstructionType.Selectable, cells, selectable);
  }

  write(coordinates: Coordinate | Coordinate[], digit: string) {
    if (!Array.isArray(coordinates)) {
      coordinates = [coordinates];
    }

    for (let i=0; i < coordinates.length; i++) {
      let coord = coordinates[i];
      this.writeInstructions.set([coord.x, coord.y], digit);
    }
  }

  column(index: number){
    const cells = [];
    for (let i=0; i < this.maxDigit; i++) {
      cells.push([i, index]);
    }
    return cells;
  }

  row(index: number){
    const cells = [];
    for (let i=0; i < this.maxDigit; i++) {
      cells.push([index, i]);
    }
    return cells;
  }

  box(index: number){
    const cells = [];
    const x_min = Math.floor(index/this.dimX)*this.dimX;
    const y_min = (index%this.dimY)*this.dimY;
    for (let x=x_min; x < x_min+this.dimX; x++) {
      for (let y=y_min; y < y_min+this.dimY; y++) {
        cells.push([x, y]);
      }
    }
    return cells;
  }

  all(){
    const cells = [];
    for (let i=0; i < this.maxDigit; i++) {
      for (let j=0; j < this.maxDigit; j++) {
        cells.push([i, j]);
      }
    }
    return cells;
  }
}

class Grid extends React.Component {
  boundHandleKeyDown: (event: any) => void;

  props: {
    gridProps: GridProps,
    solution?: boolean
  };

  state: {
    digits: string[][],
    selectedCells: Cell[],
    showAxes: boolean,
  };

  baseState: object;
  isHint: boolean[][];

  constructor(props: any) {
    super(props);

    let digits = this.props.solution ? this.props.gridProps.getSolutionArray() : this.props.gridProps.getPuzzleArray();
    if (!this.props.solution) { // apply write instructions, but only for puzzle
      const writeKeys = this.props.gridProps.writeInstructions.keys;
      for (let i = 0; i < writeKeys.length; i++) {
        const key = writeKeys[i];
        const x = key[0];
        const y = key[1];
        digits[x][y] = this.props.gridProps.writeInstructions.get(key);
      }
    }

    this.state = {
      digits: digits,
      selectedCells: [],
      showAxes: false
    };

    this.isHint = this.props.gridProps.getHintArray();
    this.baseState = this.state;
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
  }

  getGridString() {
    let s = ""; //`${this.props.gridPropsTarget.dimX}.${this.props.gridPropsTarget.dimY}.`;
    for (let i = 0; i < this.props.gridProps.maxDigit; i++) {
      for (let j = 0; j < this.props.gridProps.maxDigit; j++) {
        const digit = this.state.digits[i][j];
        s += digit ? digit : '.';
      }
    }
    return s;
  }

  getDigit(coord: Coordinate) {
    return this.state.digits[coord.x][coord.y];
  }

  // region logic


  getBoxNumber(x: number, y: number) {
    return Math.floor(x / this.props.gridProps.dimX)*this.props.gridProps.dimX + Math.floor(y / this.props.gridProps.dimY)
  }

  // Returns Coordinate[] for each cell sharing same box as coord
  box_coordinates(coord: Coordinate) {
    const xMin = Math.floor(coord.x/this.props.gridProps.dimX)*this.props.gridProps.dimX;
    const xMax = xMin + this.props.gridProps.dimX - 1;
    const yMin = Math.floor(coord.y/this.props.gridProps.dimY)*this.props.gridProps.dimY;
    const yMax = yMin + this.props.gridProps.dimY - 1;

    const coordinates = [];
    for (let i=xMin; i <= xMax; i++) {
      for (let j=yMin; j <= yMax; j++) {
        coordinates.push(new Coordinate(i, j));
      }
    }
    return coordinates;
  }

  digit_in_same_row(coord: Coordinate, digit: string) {
    for (let i=0; i < this.props.gridProps.maxDigit; i++) {
      if (i != coord.y && this.state.digits[coord.x][i] == digit) {
        return new Coordinate(coord.x, i);
      }
    }
    return null;
  }

  digit_in_same_column(coord: Coordinate, digit: string) {
    for (let i=0; i < this.props.gridProps.maxDigit; i++) {
      if (i != coord.x && this.state.digits[i][coord.y] == digit) {
        return new Coordinate(i, coord.y);
      }
    }
    return null;
  }

  digit_in_same_box(coord: Coordinate, digit: string) {
    const coordinates = this.box_coordinates(coord);
    for (let i=0; i < coordinates.length; i++) {
      let other = coordinates[i];
      if (!(coord.x == other.x && coord.y == other.y) && this.state.digits[other.x][other.y] == digit) {
        return new Coordinate(other.x, other.y);
      }
    }
    return null;
  }
  // endreigon

  //region Callables
  areSelected(coords: Coordinate[]) {
    const selected = _.map(this.state.selectedCells, (cell: Cell) => {
      return new Coordinate(cell.props.cellProps.x, cell.props.cellProps.y);
    });
    return arrayEquals(Coordinate.sort(coords), Coordinate.sort(selected));
  }

  reset(callback?: () => void) {
    this.deselectCells();
    this.setState(this.baseState, callback);
  }

  // TODO: Deprecate this
  setInteractivity(interactive: boolean) {
    this.props.gridProps.selectable = false;
  }
  //endregion

  //region Logging
  createGridAction(actionType: GridActionType, cell: Cell, new_digit?: string) {
    const x = cell.props.cellProps.x;
    const y = cell.props.cellProps.y;
    const digit = this.state.digits[x][y];
    return new GridAction(actionType, x, y, digit, new_digit);
  }

  callActionCallBack(action: GridAction) {
    if (this.props.gridProps.actionCallback) {
      this.props.gridProps.actionCallback(action);
    }
  }
  //endregion

  //region Interaction
  eraseCell(x: number, y: number, callback?: () => void) {
    this.setState((state: any, props) => {
      const newDigits = _.map(state.digits, _.clone);
      newDigits[x][y] = null;
      return {digits: newDigits};
    }, callback);
  }

  isSelected(x: number, y: number) {
    return !!_.find(this.state.selectedCells, (cell: Cell) => {
      return cell.props.cellProps.x == x && cell.props.cellProps.y == y;
    });
  }

  selectCell(cell: Cell) {
    if (this.props.solution || !this.props.gridProps.selectable) {
      return;
    }
    let select = !_.find(this.state.selectedCells, (c: Cell) => c == cell);
    this.setState((state: any, props: any) => {
      if (select) {
        if (props.gridProps.multiselect) {
          const clone = state.selectedCells.slice(0);
          clone.push(cell);
          return {selectedCells: clone}
        } else {
          return {selectedCells: [cell]}
        }
      } else {
        return {selectedCells: _.without(state.selectedCells, cell)}
      }
    }, () => {
      if (select) {
        this.callActionCallBack(this.createGridAction(GridActionType.Select, cell));
      } else { // deselect
        this.callActionCallBack(this.createGridAction(GridActionType.Deselect, cell));

      }
    });
  }

  deselectCells() {
    this.setState({selectedCell: []});
  }

  writeSelectedCells(digit: string) {
    for (let i=0; i<this.state.selectedCells.length; i++) {
      const cell = this.state.selectedCells[i];
      this.setState((state: any, props) => {
        const newDigits = _.map(state.digits, _.clone);
        const x = cell.props.cellProps.x;
        const y = cell.props.cellProps.y;
        newDigits[x][y] = digit;
        return {digits: newDigits};
      }, () => {
        this.callActionCallBack(this.createGridAction(GridActionType.Write, cell, digit));
      });
    }
  }

  eraseSelectedCells() {
    for (let i=0; i<this.state.selectedCells.length; i++) {
      const cell = this.state.selectedCells[i];
      this.eraseCell(cell.props.cellProps.x, cell.props.cellProps.y, () => {
        this.callActionCallBack(this.createGridAction(GridActionType.Erase, cell));
      });
    }
  }

  handleKeyDown(event: any) {
    let { key } = event;
    if (key == '`') {
      this.setState((state: any, props) => {
        return {showAxes: !state.showAxes};
      });
    }

    if (!this.props.gridProps.mutable) {
      return
    }

    if (parseInt(key) > 0 && parseInt(key) <= this.props.gridProps.maxDigit) {
      this.writeSelectedCells(key);
    } else if (key == 'Backspace') {
      this.eraseSelectedCells();
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.boundHandleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.boundHandleKeyDown)
  }
  //endregion

  //region Render

  getBoxBorders(x: number, y: number) {
    return {
      top: x % this.props.gridProps.dimY == 0,
      bottom: x == this.props.gridProps.maxDigit-1,
      left: y % this.props.gridProps.dimX == 0,
      right: y == this.props.gridProps.maxDigit-1
    }
  }

  renderCell(x: number, y: number) {
    const sizeDivisor = this.props.gridProps.maxDigit + Number(this.state.showAxes);
    const borders = this.getBoxBorders(x, y);

    const cellProps = new CellProps(x, y, this.props.gridProps.mutable,
      this.props.gridProps.width/sizeDivisor, this.selectCell.bind(this));

    if (this.isHint[x][y]) {
      cellProps.mutable = false;
      cellProps.color = 'blue';
      cellProps.selectable = false;
    }
    cellProps.value = this.state.digits[x][y];
    cellProps.borderTop = borders.top;
    cellProps.borderBottom = borders.bottom;
    cellProps.borderLeft = borders.left;
    cellProps.borderRight = borders.right;

    const instructions = this.props.gridProps.styleInstructions.get([x, y]);
    if (instructions) {
      for (let i=0; i<instructions.keys.length; i++) {
        const key = instructions.keys[i];
        cellProps[key] = instructions.get(key);
      }
    }

    if (this.isSelected(x, y)) {
      cellProps.background = 'yellow';
    }

    return <Cell cellProps={cellProps} key={`${x},${y}`}/>
  }

  createGrid() {
    const maxDigit = this.props.gridProps.maxDigit;
    let grid = [];
    let row = null;
    if (this.state.showAxes) {
      row = [<AxisCell grid={this} key={`blank`} digit={null} size={this.props.gridProps.width/(maxDigit+1)}/>];
      row = row.concat(_.range(1, maxDigit+1).map(
        (i: number) => <AxisCell grid={this} key={`y_${i}`} digit={i.toString()} size={this.props.gridProps.width/(maxDigit+1)}/>));
      grid.push(row);
    }
    for (let i = 0; i < maxDigit; i++) {
      row = [];
      if (this.state.showAxes) {
        row.push(<AxisCell grid={this} key={`x_${i+1}`} digit={(i+1).toString()} size={this.props.gridProps.width/(maxDigit+1)}/>);
      }
      for (let j = 0; j < maxDigit; j++) {
        row.push(this.renderCell(i, j))
      }
      grid.push(<div className={"row"} key={i}>{row}</div>)
    }
    return grid
  }

  render () {
    return (
      <div className={"grid"}>
        {this.createGrid()}
      </div>
    );
  }
  //endregion
}

export default Grid