import * as React from "react";
import QuestionnaireScreen from "./QuestionnaireScreen";
import ScreenData from "../../experiment/ScreenData";
import {HiddenSingle} from "../../sudoku/HiddenSingle";
import {SurveyResponse} from "../../experiment/Datum";
import {round} from "../../misc/util";
import {InputNumber} from "primereact/inputnumber";
import {QuestionnaireData} from "./QuestionnaireData";

class QNumber extends QuestionnaireScreen {
  compensation = 0.10;

  showGridBelow = true;

  props: {
    screenData: ScreenData,
    hiddenSingle: HiddenSingle,
    questionnaireData: QuestionnaireData,
    questionKey: string,
    questionText: string,
    onSubmitCallback?: (response: SurveyResponse) => any,
    min?: number,
    max?: number,
    step?: number,
    suffix?: string
  };

  state: {
    response: number | undefined;
  };

  constructor(props: any) {
    super(props);
    this.state = {
      response: undefined
    };
  }

  renderInstructions() {
    return (<div className={"p-grid"}>
      <div className={"maintext p-col-9"}>
        {this.props.questionText}
      </div>
      <div className={"p-col-3"}>
        <InputNumber value={this.state.response}
                     size={9}
                     onChange={(e) => this.updateResponseState(e.value)}
                     onBlur={(e: any) => this.spinnerOnBlur()}
                     showButtons
                     // Due to a bug in PrimeReact, this needs to be done, or min and max cannot be typed in
                     min={this.props.min != undefined ? this.props.min - 1e-10 : undefined}
                     max={this.props.max != undefined ? this.props.max + 1e-10 : undefined}
                     suffix={this.props.suffix}
                     step={this.props.step}/>
      </div>

    </div>);
  }

  renderResponseArea() {
    return (<div></div>);
  }

  spinnerOnBlur() {
    if (this.state.response != undefined) {
      let response = this.state.response;
      if (this.props.min != undefined) {
        response = Math.max(response, this.props.min);
      }
      if (this.props.max != undefined) {
        response = Math.min(response, this.props.max);
      }
      if (this.props.step != undefined) {
        response = round(response, this.props.step)
      }
      this.updateResponseState(response);
    }
  }

  validateResponse() {
    return this.state.response != undefined;
  }
}

export default QNumber