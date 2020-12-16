import * as React from "react";
import QuestionnaireScreen from "./QuestionnaireScreen";
import {InputTextarea} from "primereact/inputtextarea";
import ScreenData from "../../experiment/ScreenData";
import {HiddenSingle} from "../../sudoku/HiddenSingle";
import {SurveyResponse} from "../../experiment/Datum";
import {QuestionnaireData} from "./QuestionnaireData";


class QFreeResponse extends QuestionnaireScreen {

  compensation = 0.20;

  props: {
    screenData: ScreenData,
    hiddenSingle: HiddenSingle,
    questionnaireData: QuestionnaireData,
    questionKey: string,
    questionText: string,
    onSubmitCallback?: (response: SurveyResponse) => any,
  };

  state: {
    response: string;
  };

  constructor(props: any) {
    super(props);
    this.state = {
      response: ""
    };
  }

  renderInstructions() {
    return (<div className={"maintext"}>
      {this.props.questionText}
    </div>);
  }

  renderResponseArea() {
    return (<div>
      <InputTextarea value={this.state.response}
                     onChange={(e) => this.updateResponseState(e.target['value'])}
                     rows={10}
                     cols={32} />
    </div>);
  }

  validateResponse() {
    return this.state.response.length > 0;
  }
}

export default QFreeResponse