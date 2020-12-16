import {now} from "../misc/util";

export class SurveyResponse {
  key: string;
  response: any;

  constructor(key: string, response: any) {
    this.key = key;
    this.response = response;
  }
}

export enum DatumType {
  Start = 'start',
  ButtonClick = 'buttonClick',
  Submit = "submit",
  SubmitResult = "submitResult",
  GridAction = "gridAction",
  TimeOut = "timeout",
  SurveyResponse = 'surveyResponse',
  KeyValue = "keyValue",
  Compensation = 'compensation',
  HiddenSingle = 'hiddenSingle'
}

export class Datum {
  timestamp: string;
  screen: string;
  screenNumber: number;
  actionKey: DatumType;
  actionValue: any;


  constructor(screenName: string, screenNumber: number, datumType: DatumType, value: any) {
    this.screen = screenName;
    this.screenNumber = screenNumber;
    this.actionKey = datumType;
    this.actionValue = value;
    this.timestamp = now();
  }
}