import './DemographicSurvey.css'

import Screen from '../experiment/Screen';
import {ButtonDisplay} from "../experiment/ScreenEnums";
import * as _ from 'underscore';
import * as React from "react";
import {ListBox} from "primereact/listbox";
import {DatumType, SurveyResponse} from "../experiment/Datum";

class MathBackgroundSurvey extends Screen {

  readonly name = 'MathBackgroundSurvey';
  readonly title = 'Math Education';
  readonly hasTask = true;
  showReset = ButtonDisplay.Hide;
  compensation = 0.05;

  static mathKey = 'MathEducation';
  static mathQuestion = 'Which of the following mathematics topics have you taken a course in? Select all that apply.';
  static mathResponses = [
    {'label': 'High school algebra'},
    {'label': 'High school geometry'},
    {'label': 'Trigonometric functions'},
    {'label': 'Single-variable calculus'},
    {'label': 'Multi-variable calculus'},
    {'label': 'Linear algebra'},
    {'label': 'Probability & statistics'},
    {'label': 'Discrete mathematics'},
    {'label': 'Formal logic'}
  ];

  state: {
    mathEducation: Array<any>
  };

  constructor(props: any) {
    super(props);
    this.state = {
      mathEducation: []
    }
  }

  onSubmit(callback: () => void) {
    this.props.screenData.completed = true;
    const hsMathResponse = new SurveyResponse(MathBackgroundSurvey.mathKey,
      _.map(this.state.mathEducation, (e: any) => e.label));

    this.props.screenData.appendData(DatumType.SurveyResponse, hsMathResponse);

    const surveyResponses = this.props.screenData.datastore.surveyResponses;
    surveyResponses[MathBackgroundSurvey.mathKey] = hsMathResponse.response;
    this.setState(this.state, callback);
  }

  render() {
    return (
      <div className={"MathBackgroundSurvey"}>
        <div className={"question p-grid"}>
          <span className={"question-text p-col-8"}>
            {MathBackgroundSurvey.mathQuestion}
          </span>
          <span className={"question-response p-col-4"}>
            <ListBox value={this.state.mathEducation}
                     options={MathBackgroundSurvey.mathResponses}
                     onChange={(e) => this.setState({mathEducation: e.value})}
                     multiple={true}
                     disabled={this.props.screenData.completed}
                     optionLabel={"label"}/>
          </span>
        </div>
      </div>
    );
  }
}

export default MathBackgroundSurvey