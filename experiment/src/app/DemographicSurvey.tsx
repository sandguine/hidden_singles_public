import './DemographicSurvey.css'

import Screen from '../experiment/Screen';
import {ButtonDisplay} from "../experiment/ScreenEnums";
import * as React from "react";
import {Spinner} from 'primereact/spinner';
import {Dropdown} from "primereact/dropdown";
import {DatumType, SurveyResponse} from "../experiment/Datum";

class DemographicSurvey extends Screen {

  readonly name = 'DemographicSurvey';
  readonly title = 'Demographics';
  readonly hasTask = true;
  showReset = ButtonDisplay.Hide;
  compensation = .05;

  static ageKey = 'age';
  static ageQuestion = 'What is your age?';
  static genderKey = 'gender';
  static genderQuestion = 'What is your gender?';
  static genderResponses = [{'label': 'Male'}, {'label': 'Female'}, {'label': 'Other'}, {'label': 'Prefer not to say'}];
  static educationKey = 'education';
  static educationQuestion = 'What is your highest level of education (including currently pursuing)?';
  static educationResponses = [
    {'label': 'Have not graduated high school'},
    {'label': 'High school graduate, diploma or equivalent'},
    {'label': 'Associate degree'},
    {'label': 'Bachelor’s degree'},
    {'label': 'Master’s degree'},
    {'label': 'Professional degree (e.g. M.D., J.D.)'},
    {'label': 'Doctoral degree'}
  ];
  static degreeKey = 'degree';
  static degreeQuestion = 'Degree status';
  static degreeResponses = [
    {'label': 'Currently pursuing'},
    {'label': 'Completed'}
    ];

  state: {
    age?: number,
    gender: any | null,
    education: any | null,
    degree: any | null
  };

  constructor(props: any) {
    super(props);
    this.state = {
      age: undefined,
      gender: null,
      education: null,
      degree: null
    }
  }

  validateResponse() {
    return this.state.age && this.state.gender && this.state.education && this.state.degree;
  }

  onSubmit(callback: () => void) {
    if (this.validateResponse()) {
      this.props.screenData.completed = true;

      const ageResponse = new SurveyResponse(DemographicSurvey.ageKey, this.state.age);
      const genderResponse = new SurveyResponse(DemographicSurvey.genderKey, this.state.gender.label);
      const educationResponse = new SurveyResponse(DemographicSurvey.educationKey, this.state.education.label);
      const degreeResponse = new SurveyResponse(DemographicSurvey.degreeKey, this.state.degree.label);


      this.props.screenData.appendData(DatumType.SurveyResponse, ageResponse);
      this.props.screenData.appendData(DatumType.SurveyResponse, genderResponse);
      this.props.screenData.appendData(DatumType.SurveyResponse, educationResponse);
      this.props.screenData.appendData(DatumType.SurveyResponse, degreeResponse);

      const surveyResponses = this.props.screenData.datastore.surveyResponses;
      surveyResponses[DemographicSurvey.ageKey] = ageResponse.response;
      surveyResponses[DemographicSurvey.genderKey] = genderResponse.response;
      surveyResponses[DemographicSurvey.educationKey] = educationResponse.response;
      surveyResponses[DemographicSurvey.degreeKey] = degreeResponse.response;
      this.setState(this.state, callback);
    } else {
      this.props.screenData.showErrorMessage("Form Incomplete",
        "Please answer all the questions.");
    }
  }

  render() {
    return (
      <div>
        <div className={'maintext'}>
          Please answer these demographic questions.
          Your answers will not be associated with your identity.
        </div>
        <br/>
        <div className={"question p-grid"}>
          <span className={"question-text p-col-8"}>
            {DemographicSurvey.ageQuestion}
          </span>
          <span className={"question-response p-col-4"}>
            <Spinner value={this.state.age}
                     size={17.5}
                     onChange={(e) => this.setState({age: e.value})}
                     disabled={this.props.screenData.completed}
                     min={0}
                     max={99}/>
          </span>
        </div>
        <div className={"question p-grid"}>
          <span className={"question-text p-col-8"}>
            {DemographicSurvey.genderQuestion}
          </span>
          <span className={"question-response p-col-4"}>
            <Dropdown value={this.state.gender}
                      options={DemographicSurvey.genderResponses}
                      optionLabel={'label'}
                      style={{'width': '170px'}}
                      disabled={this.props.screenData.completed}
                      onChange={(e) => this.setState({gender: e.value})}/>
          </span>
        </div>
        <div className={"question p-grid"}>
          <span className={"question-text p-col-8"}>
            {DemographicSurvey.educationQuestion}
          </span>
          <span className={"question-response p-col-4"}>
            <Dropdown value={this.state.education}
                      options={DemographicSurvey.educationResponses}
                      optionLabel={'label'}
                      autoWidth={false}
                      style={{'width': '170px'}}
                      disabled={this.props.screenData.completed}
                      onChange={(e) => this.setState({education: e.value})}/>
          </span>
        </div>
        <div className={"question p-grid"}>
          <span className={"question-text p-col-8"}>
            {DemographicSurvey.degreeQuestion}
          </span>
          <span className={"question-response p-col-4"}>
            <Dropdown value={this.state.degree}
                      options={DemographicSurvey.degreeResponses}
                      optionLabel={'label'}
                      style={{'width': '170px'}}
                      autoWidth={false}
                      disabled={this.props.screenData.completed}
                      onChange={(e) => this.setState({degree: e.value})}/>
          </span>
        </div>
      </div>
    );
  }
}

export default DemographicSurvey