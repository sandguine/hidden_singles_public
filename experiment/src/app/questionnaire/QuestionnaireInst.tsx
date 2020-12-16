import '../../index.css'
import './QuestionnaireInst.css'

import * as React from 'react';
import Screen from "../../experiment/Screen";
import {ButtonDisplay} from "../../experiment/ScreenEnums";
import {SelectButton} from "primereact/selectbutton";
import {QuestionnaireData} from "./QuestionnaireData";
import ScreenData from "../../experiment/ScreenData";
import {DatumType, SurveyResponse} from "../../experiment/Datum";

class QuestionnaireInst extends Screen {
  readonly name = 'QuestionnaireInst';
  readonly title = "Questionnaire";
  readonly hasTask = true;
  showReset = ButtonDisplay.Hide;
  showBack = ButtonDisplay.Hide;

  props: {
    screenData: ScreenData,
    questionnaireData: QuestionnaireData,
    onSubmitCallback: () => void
  };

  state: {
    attnCheck1: boolean | null,
    attnCheck2: boolean | null,
    attnCheck3: boolean | null
  };

  static attnCheck1Key = 'q_attn_check1';
  static attnCheck2Key = 'q_attn_check2';
  static attnCheck3Key = 'q_attn_check3';
  static attnCheckQ1 = '1. I will be asked to solve one more puzzle on the next screen.';
  static attnCheckQ2 = '2. I will be compensated for my answers to the questions about my solution.';
  static attnCheckQ3 = '3. The puzzle will be removed after I solve it and before the questions appear.';

  static options = [
    {label: 'True', value: true},
    {label: 'False', value: false}
  ];

  constructor(props: any) {
    super(props);
    this.state = {
      attnCheck1: null,
      attnCheck2: null,
      attnCheck3: null
    };
    this.props.screenData.setSubmitButtonDisabled(true);
  }

  validateResponse(): boolean {
    return this.state.attnCheck1 != null && this.state.attnCheck2 != null && this.state.attnCheck3 != null;
  }

  updateResponseState(state: any) {
    this.setState(state,
      () => {
        const valid = this.validateResponse();
        this.props.screenData.setSubmitButtonDisabled(!valid);
      });
  }

  onSubmit() {
    if (this.validateResponse()) {
      this.props.screenData.completed = true;

      const response1 = new SurveyResponse(QuestionnaireInst.attnCheck1Key, this.state.attnCheck1);
      const response2 = new SurveyResponse(QuestionnaireInst.attnCheck2Key, this.state.attnCheck2);
      const response3 = new SurveyResponse(QuestionnaireInst.attnCheck3Key, this.state.attnCheck3);
      this.props.screenData.appendData(DatumType.SurveyResponse, response1);
      this.props.screenData.appendData(DatumType.SurveyResponse, response2);
      this.props.screenData.appendData(DatumType.SurveyResponse, response3);
      this.props.questionnaireData.responses[QuestionnaireInst.attnCheck1Key] = response1.response;
      this.props.questionnaireData.responses[QuestionnaireInst.attnCheck2Key] = response2.response;
      this.props.questionnaireData.responses[QuestionnaireInst.attnCheck3Key] = response3.response;

      this.props.onSubmitCallback();
    }
  }


  render() {
    return (
      <div>
        <div className={"maintext"}>
          Thank you for completing the puzzles. Before the HIT concludes, we would
          like to ask you to describe your strategy for solving these puzzles.
          <br/><br/>
          In the following screen, you will be presented with a puzzle similar
          to the ones encountered so far. Please solve it to the best of your ability.
          You will then be asked a series of questions regarding how you solved this puzzle.
          The puzzle and your response will be provided with each question for reference.
          <br/><br/>
          Your answers will help us understand how people learn new reasoning skills and
          you will be compensated for your answer to each question so
          please answer them as truthfully and accurately as possible.
          <br/><br/>
          <b>Please answer these attention check questions correctly:</b>
        </div>
        <br/>
        <div>
          <div className={"q-container p-grid p-justify-between"}>
            <span className={"question p-col-9"}>
              {QuestionnaireInst.attnCheckQ1}
            </span>
            <span className={"response p-col-3"}>
              <SelectButton value={this.state.attnCheck1}
                            options={QuestionnaireInst.options}
                            onChange={(e) => this.updateResponseState({attnCheck1: e.value})}/>
            </span>
          </div>
          <div className={"q-container p-grid"}>
            <div className={"question p-col-9"}>
              {QuestionnaireInst.attnCheckQ2}
            </div>
            <div className={"response p-col-3"}>
              <SelectButton value={this.state.attnCheck2}
                            options={QuestionnaireInst.options}
                            onChange={(e) => this.updateResponseState({attnCheck2: e.value})} />
            </div>
          </div>
          <div className={"q-container p-grid"}>
            <div className={"question p-col-9"}>
              {QuestionnaireInst.attnCheckQ3}
            </div>
            <div className={"response p-col-3"}>
              <SelectButton value={this.state.attnCheck3}
                            options={QuestionnaireInst.options}
                            onChange={(e) => this.updateResponseState({attnCheck3: e.value})} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionnaireInst