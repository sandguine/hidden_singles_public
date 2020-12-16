import "./QSelect.css"

import QuestionnaireScreen from "./QuestionnaireScreen";
import ScreenData from "../../experiment/ScreenData";
import {HiddenSingle} from "../../sudoku/HiddenSingle";
import {QuestionnaireData} from "./QuestionnaireData";
import * as React from "react";
import {RadioButton} from "primereact/radiobutton";
import {SurveyResponse} from "../../experiment/Datum";

interface QSelectResponse {
  index: number,
  text: string
}

class QSelect extends QuestionnaireScreen {
  compensation = 0.10;

  props: {
    screenData: ScreenData,
    hiddenSingle: HiddenSingle,
    questionnaireData: QuestionnaireData,
    questionKey: string,
    questionText: string,
    options: string[],
    onSubmitCallback?: (response: SurveyResponse) => any
  };

  state: {
    response: QSelectResponse | null;
  };

  constructor(props: any) {
    super(props);
    this.state = {
      response: null
    }
  }

  renderInstructions() {
    return (<div className={"maintext"}>
      {this.props.questionText}
    </div>);
  }

  renderResponseArea() {
    const radios = [];
    for (let [index, value] of this.props.options.entries()) {
      radios.push(<div className={"radio-container p-grid p-justify-between"} key={`rbcontainer${index}`}>
        <span className={"radio centered p-col-1"}>
          <RadioButton inputId={`rb${index}`}
                     name={"response"}
                     key={`rb${index}`}
                     value={{index: index, text: value}}
                     onChange={(e) => this.updateResponseState( e.value)}
                     checked={this.state.response != null && this.state.response.text === value} />
        </span>
        <span className={"label-container p-col-11"}>
          {value}
        </span>
      </div>)
    }

    return (<div>
      {radios}
    </div>);
  }


}

export default QSelect