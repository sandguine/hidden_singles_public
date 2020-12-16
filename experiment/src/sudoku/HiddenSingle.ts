import {Coordinate} from "../misc/util";

export enum HouseType {
  Row = 'row',
  Column = 'column',
  Box = 'box'
}

interface HSDigits {
  target: number;
  distractor: number;
  occupied: number[];
  digitSet: number[];
  map: object
}

interface HSCoordinates {
  goal: Coordinate;
  emptySingle: Coordinate;
  emptyDouble: Coordinate;
  emptyBox: Coordinate[];
  targetSingle: Coordinate;
  targetDouble: Coordinate;
  targetBox: Coordinate;
  distractorSingle: Coordinate;
  distractorDouble: Coordinate;
  distractorBox: Coordinate;
  occupied: Coordinate[];
}

interface HSGridstrings {
  puzzle: string;
  solution: string;
  puzzleSeed: string;
  solutionSeed: string;
}

export interface HSCondition {
  houseType: boolean;
  houseIndex: boolean;
  cellIndex: boolean;
  digitSet: boolean;
}

export class HiddenSingle {
  houseType: HouseType;
  digits: HSDigits;
  coordinates: HSCoordinates;
  gridstrings: HSGridstrings;
  condition: HSCondition;

  constructor(houseType: HouseType,
              digits: HSDigits,
              coordinates: HSCoordinates,
              gridstrings: HSGridstrings,
              condition: HSCondition) {
    this.houseType = houseType;
    this.digits = digits;
    this.coordinates = coordinates;
    this.gridstrings = gridstrings;
    this.condition = condition;
  }

  getConstraintHouseType() {
    return (this.houseType == HouseType.Row ? HouseType.Column : HouseType.Row);
  }
}