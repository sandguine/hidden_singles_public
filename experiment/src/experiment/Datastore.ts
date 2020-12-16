import {Datum, DatumType} from './Datum';
import {post} from "../misc/util";
import {QuestionnaireData} from "../app/questionnaire/QuestionnaireData";
import PuzzleRecord from "./PuzzleRecord";


class Datastore {
  data: Array<Datum>;
  experimentDetails: object;
  questionnaireResponses: object;
  surveyResponses: object;
  puzzleRecords: PuzzleRecord[];
  diagnosticTestResponses: object[];

  constructor(experimentDetails: object, questionnaireData: QuestionnaireData) {
    this.experimentDetails = experimentDetails;
    this.data = new Array<Datum>();
    this.questionnaireResponses = questionnaireData.responses;
    this.surveyResponses = {};
    this.puzzleRecords = [];
    this.diagnosticTestResponses = [];
  }

  append(screenName: string, screenNumber: number, actionKey: DatumType, actionValue: any) {
    this.data.push(new Datum(screenName, screenNumber, actionKey, actionValue));
  }

  async export(filename: string, wait: boolean) {
    await post(filename, this, wait);
  }
}

export {DatumType, Datastore}