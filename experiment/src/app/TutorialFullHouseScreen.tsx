import './TutorialSudokuScreen.css';
import '../index.css'

import * as React from 'react';
import {RefObject} from 'react';
import Screen from "../experiment/Screen";
import Grid, {GridProps} from "../sudoku/Grid";

import ScreenData from "../experiment/ScreenData";
import {ButtonDisplay, SubmitResult} from "../experiment/ScreenEnums";
import {settings} from "./AppSettings";
import EmphText from "../misc/EmphText";
import {Color} from "../misc/util";
import {HiddenSingle} from "../sudoku/HiddenSingle";

class TutorialFullHouseScreen extends Screen {
  readonly name = 'TutorialFullHouseScreen';
  readonly title = "Tutorial";
  readonly hasTask = true;
  compensation = settings.simpleTaskPay;

  gridRef: RefObject<Grid>;
  showBack = ButtonDisplay.Hide;

  props: {
    screenData: ScreenData,
    gridstring: string,
    tutorial: HiddenSingle};

  constructor(props: any) {
    super(props);
    this.gridRef = React.createRef();
  }

  onReset(callback?: () => void) {
    (this.gridRef.current as Grid).reset(callback);
  }

  onSubmit(callback: (result: SubmitResult) => void) {
    const grid = this.gridRef.current as Grid;
    const input = grid.getDigit(this.props.tutorial.coordinates.goal);
    if (input == this.props.tutorial.digits.target.toString()) {
      this.props.screenData.completed = true;
      this.gridRef.current!.setInteractivity(false);
      this.props.screenData.showSuccessMessage("Correct!");
      callback(SubmitResult.Correct);
    } else {
      this.props.screenData.showErrorMessage("Try Again",
        `There is already a ${input} in the ${this.props.tutorial.houseType}.`);
      this.onReset(() => {callback(SubmitResult.Incorrect)});
    }
  }

  render() {
    const gridProps = new GridProps({
      gridString: this.props.gridstring,
      actionCallback: this.props.screenData.recordGridAction
    });

    gridProps.background(this.props.tutorial.coordinates.goal, '#01FF70');
    const distractor = <EmphText color={'blue'} text={`${this.props.tutorial.digits.distractor}`}/>;

    return (
      <div>
        <div className={"maintext"}>
          One of the {distractor}s forming the contradiction has been removed. Fill in the missing number in
          the <EmphText color={Color.green} text={'green cell'}/> so
          that the {this.props.tutorial.houseType} contains every number between 1 and 9.
        </div>
        <br />
        <div className={"maintext"}>
          Input the correct digit by clicking the <EmphText color={Color.green} text={'green cell'}/> and
          pressing the corresponding key on the keyboard.
        </div>
        <br/>
        <Grid gridProps={gridProps} solution={this.props.screenData.completed} ref={this.gridRef}/>
      </div>
    );
  }
}

export default TutorialFullHouseScreen