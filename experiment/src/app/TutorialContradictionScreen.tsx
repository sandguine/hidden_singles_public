import '../index.css'
import * as React from 'react';
import SelectCellsScreen from "../templateScreens/SelectCellsScreen";
import {GridProps} from "../sudoku/Grid";
import {settings} from "./AppSettings";
import ScreenData from "../experiment/ScreenData";
import {HiddenSingle} from "../sudoku/HiddenSingle";
import EmphText from "../misc/EmphText";

class TutorialContradictionScreen extends SelectCellsScreen {

  readonly name = 'TutorialContradictionScreen';
  readonly title = "What is Sudoku?";
  correctComment: string;
  compensation = settings.simpleTaskPay;

  props: {
    screenData: ScreenData,
    gridstring: string,
    tutorial: HiddenSingle
  };

  state: {
    text: any;
  };

  constructor(props: any) {
    super(props);
    const distractor = this.props.tutorial.digits.distractor;
    const distractorText = <EmphText color={'blue'} text={`${distractor}`}/>;
    this.state = {
      text: <div>
        Sudoku is a puzzle with a 9x9 grid of numbers where each row, column, and 3x3 box must
        contain exactly one of each number from 1 to 9.
        <br/><br/>
        The <b>{this.props.tutorial.houseType}</b> in the grid below does not contain every number between 1 and 9, but rather contains
        two copies of the digit {distractorText}, forming a contradiction.
        Select the two cells that create this contradiction.
      </div>
    };
    this.correctComment = `The ${this.props.tutorial.houseType} contains two ${distractor}'s, which is a contradiction!`;

    this.gridProps = new GridProps(
      {
        gridString: this.props.gridstring,
        mutable: false,
        selectable: true,
        multiselect: true,
        actionCallback: this.props.screenData.recordGridAction
      });
    this.gridProps.setSelectable(this.gridProps.all(), true);

    this.solution = [this.props.tutorial.coordinates.goal, this.props.tutorial.coordinates.emptySingle];
  }
}

export default TutorialContradictionScreen