import './QuestionnaireScreen.css'

import * as React from "react";
import {ButtonDisplay} from "../../experiment/ScreenEnums";
import ScreenData from "../../experiment/ScreenData";
import {HiddenSingle, HouseType} from "../../sudoku/HiddenSingle";
import Grid, {GridProps} from "../../sudoku/Grid";
import Screen from "../../experiment/Screen";
import {ReactNode, RefObject} from "react";
import {QuestionnaireData, QuestionnaireKeys} from "./QuestionnaireData";
import {DatumType, SurveyResponse} from "../../experiment/Datum";


class QuestionnaireScreen extends Screen {
  name = "questionnaire_screen";
  title = "Questionnaire";
  readonly hasTask = true;
  showBack = ButtonDisplay.Hide;
  showReset = ButtonDisplay.Hide;
  gridProps: GridProps;
  showGridBelow = false;
  gridRef: RefObject<Grid>;

  props: {
    screenData: ScreenData,
    hiddenSingle: HiddenSingle,
    questionnaireData: QuestionnaireData,
    questionKey: string
    onSubmitCallback?: (response: SurveyResponse) => any
  };

  state: {
    response: any
  };

  constructor(props: Readonly<{}>) {
    super(props);
    this.props.screenData.setSubmitButtonDisabled(true);
    this.gridProps = new GridProps(
      {
        gridString: this.props.hiddenSingle.gridstrings.puzzle,
        actionCallback: this.props.screenData.recordGridAction,
        mutable: false,
        selectable: false
      });
    this.gridRef = React.createRef();
    const goal = this.props.hiddenSingle.coordinates.goal;
    if (this.props.hiddenSingle.houseType == HouseType.Row) {
      this.gridProps.background(this.gridProps.row(goal.x), '#7FDBFF');
    } else {
      this.gridProps.background(this.gridProps.column(goal.y), '#7FDBFF');
    }

    this.gridProps.background(goal, '#01FF70');
    this.gridProps.write(goal, this.props.questionnaireData.responses[QuestionnaireKeys.Puzzle].toString());
  }

  validateResponse(): boolean {
    return true;
  }

  updateResponseState(response: any) {
    this.setState({response: response},
      () => {
        const valid = this.validateResponse();
        this.props.screenData.setSubmitButtonDisabled(!valid);
      });
  }

  renderInstructions(): ReactNode {
    return;
  }

  renderResponseArea(): ReactNode {
    return;
  }

  onSubmit() {
    if (this.validateResponse()) {
      this.props.screenData.completed = true;

      const response = new SurveyResponse(this.props.questionKey, this.state.response);
      this.props.screenData.appendData(DatumType.SurveyResponse, response);
      this.props.questionnaireData.responses[this.props.questionKey] = response.response;

      if (this.props.onSubmitCallback) {
        this.props.onSubmitCallback(response);
      }
    }
  }

  render() {
    let containerClass = "";
    let responseContainerClass = "response-container";
    let gridContainerClass = "grid-container";

    if (!this.showGridBelow) {
      containerClass = "p-grid p-justify-between";
      responseContainerClass += " p-col-2";
      gridContainerClass += " p-col-2";
    } else {
      gridContainerClass += " grid-below";
    }

    return (
      <div className={"body"}>
        <div className={"instructions-container"}>
          {this.renderInstructions()}
        </div>
        <br/>
        <div className={containerClass}>
          <div className={responseContainerClass}>
            {this.renderResponseArea()}
          </div>
          <div className={gridContainerClass}>
            <Grid gridProps={this.gridProps} ref={this.gridRef}/>
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionnaireScreen