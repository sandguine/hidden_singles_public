import '../index.css';

import * as React from 'react';
import Screen from "../experiment/Screen";
import Radio from "../survey/Radio";
import {DatumType, SurveyResponse} from "../experiment/Datum";
import {ButtonDisplay} from "../experiment/ScreenEnums";
import {settings} from "./AppSettings";

class DiagnosticSurvey extends Screen {

  readonly name = 'DiagnosticSurvey';
  readonly title = "Sudoku Experience";
  readonly hasTask = true;
  showReset = ButtonDisplay.Hide;
  compensation = settings.simpleTaskPay;

  static exposureKey = 'prior_exposure';
  static exposureQuestion = 'Have you heard of Sudoku before?';
  static exposureResponses = ['Yes', 'No', 'Not sure'];
  static attemptKey = 'prior_attempt';
  static attemptQuestion = 'Have you ever attempted to solve a Sudoku puzzle?';
  static attemptResponses = ['Yes', 'No', 'Not sure'];
  static completedKey = 'prior_completed';
  static completedQuestion = 'About how many Sudoku puzzles have you successfully completed?';
  static completedResponses = ['None', '1 to 3', '4 to 6', '7 to 9', '10 or more'];

  state: {
    sudokuExposure: string | null,
    sudokuAttempt: string | null,
    sudokuCompleted: string | null
  };

  constructor(props: any) {
    super(props);
    this.state = {
      sudokuExposure: null,
      sudokuAttempt: null,
      sudokuCompleted: null
    }
  }

  onSubmit(callback: () => void) {
    if (this.state.sudokuAttempt && this.state.sudokuCompleted && this.state.sudokuExposure) {
      const exposureResponse = new SurveyResponse(DiagnosticSurvey.exposureKey, this.state.sudokuExposure);
      const attemptResponse = new SurveyResponse(DiagnosticSurvey.attemptKey, this.state.sudokuAttempt);
      const completedResponse = new SurveyResponse(DiagnosticSurvey.completedKey, this.state.sudokuCompleted);
      this.props.screenData.appendData(DatumType.SurveyResponse, exposureResponse);
      this.props.screenData.appendData(DatumType.SurveyResponse, attemptResponse);
      this.props.screenData.appendData(DatumType.SurveyResponse, completedResponse);

      this.props.screenData.completed = true;

      const surveyResponses = this.props.screenData.datastore.surveyResponses;
      surveyResponses[DiagnosticSurvey.completedKey] = completedResponse.response;
      surveyResponses[DiagnosticSurvey.exposureKey] = exposureResponse.response;
      surveyResponses[DiagnosticSurvey.attemptKey] = attemptResponse.response;
      this.setState(this.state, () => callback());
    } else {
      this.props.screenData.showErrorMessage("Form Incomplete",
        "Please answer all the questions.");
    }
  }

  render() {
    return (
      <div className={"DiagnosticSurvey"}>
        <Radio question={DiagnosticSurvey.exposureQuestion} responses={DiagnosticSurvey.exposureResponses}
               disabled={this.props.screenData.completed}
               onChange={(v) => this.setState({sudokuExposure: v})}>
        </Radio>
        <Radio question={DiagnosticSurvey.attemptQuestion} responses={DiagnosticSurvey.attemptResponses}
               disabled={this.props.screenData.completed}
               onChange={(v) => this.setState({sudokuAttempt: v})}>
        </Radio>
        <Radio question={DiagnosticSurvey.completedQuestion} responses={DiagnosticSurvey.completedResponses}
               disabled={this.props.screenData.completed}
               onChange={(v) => this.setState({sudokuCompleted: v})}>
        </Radio>
      </div>
    );
  }
}

export default DiagnosticSurvey