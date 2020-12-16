import {HiddenSingle, HSCondition} from "../sudoku/HiddenSingle";
import {Coordinate} from "../misc/util";
import {settings} from "../app/AppSettings";
const _ = require('lodash');

const urls = {
  // newExperiment: '/sudoku_hs/experiment/new'
  newExperiment: settings.hostURL + '/sudoku_hs/experiment/new'
};

export interface NewExperimentData {
  rawData: object;
  contradiction: string; // gridstring for contradiction exercise
  fullhouse: string; // gridstring for fullhouse exercise
  tutorial: HiddenSingle;
  phase1: HiddenSingle[];
  phase2: HiddenSingle[];
  questionnaire: HiddenSingle;
}

const http = async (request: RequestInfo): Promise<any> => {
  return new Promise(resolve => {
    fetch(request, {
      mode: 'cors'
    })
      .then(response => response.json())
      .then(body => {
        resolve(body);
      });
  });
};

function hiddenSingleFromRaw(data: any, condition: HSCondition): HiddenSingle {
  const rawDigits = data['digits'];
  const rawGridstrings = data['gridstrings'];
  const rawCoordinates = data['coordinates'];

  const houseType = data['house_type'].toLowerCase();
  const digits = {
    target: rawDigits['target'],
    distractor: rawDigits['distractor'],
    occupied: rawDigits['occupied'],
    digitSet: rawDigits['digit_set'],
    map: rawDigits['map']
  };

  const coordinates = {
    goal: new Coordinate(rawCoordinates['goal']),
    emptySingle: new Coordinate(rawCoordinates['empty_single']),
    emptyDouble: new Coordinate(rawCoordinates['empty_double']),
    emptyBox: _.map(rawCoordinates['empty_box'], (a: object) => new Coordinate(a)),
    targetSingle: new Coordinate(rawCoordinates['target_single']),
    targetDouble: new Coordinate(rawCoordinates['target_double']),
    targetBox: new Coordinate(rawCoordinates['target_box']),
    distractorSingle: new Coordinate(rawCoordinates['distractor_single']),
    distractorDouble: new Coordinate(rawCoordinates['distractor_double']),
    distractorBox: new Coordinate(rawCoordinates['distractor_box']),
    occupied: _.map(rawCoordinates['occupied'], (a: object) => new Coordinate(a))
  };

  const gridstrings = {
    puzzle: rawGridstrings['puzzle'],
    solution: rawGridstrings['solution'],
    puzzleSeed: rawGridstrings['puzzle_seed'],
    solutionSeed: rawGridstrings['solution_seed']
  };

  return new HiddenSingle(houseType, digits, coordinates, gridstrings, condition);
}

export async function getNewExperiment(seed?: string): Promise<NewExperimentData> {
  const url = urls.newExperiment + (seed ? "?seed=" + seed : "");
  const rawData = await http(url);

  const controlCondition = {
    houseType: false,
    houseIndex: false,
    cellIndex: false,
    digitSet: false
  };

  const tutorial = hiddenSingleFromRaw(rawData['tutorial'], controlCondition);
  const phase1 = _.map(rawData['phase1'], (d: any) => {return hiddenSingleFromRaw(d, controlCondition)});

  const phase2 = _.map(rawData['phase2'], (e: any) => {
    let condition = {
      houseType: e['condition']['house_type'],
      houseIndex: e['condition']['house_index'],
      cellIndex: e['condition']['cell_index'],
      digitSet: e['condition']['digit_set']
    };
    return hiddenSingleFromRaw(e['hidden_single'], condition);
  });

  const questionnaire = hiddenSingleFromRaw(rawData['questionnaire'], controlCondition);

  return {
    rawData: rawData,
    contradiction: rawData['contradiction'],
    fullhouse: rawData['fullhouse'],
    tutorial: tutorial,
    phase1: phase1,
    phase2: phase2,
    questionnaire: questionnaire
  };
}