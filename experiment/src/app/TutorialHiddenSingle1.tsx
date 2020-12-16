import './TutorialSudokuScreen.css';
import '../index.css'

import * as React from 'react';
import Screen from "../experiment/Screen";
import Grid, {GridProps} from "../sudoku/Grid";
import {HiddenSingle, HouseType} from "../sudoku/HiddenSingle";
import ScreenData from "../experiment/ScreenData";
import EmphText from "../misc/EmphText";
import {Color} from "../misc/util";
import {ButtonDisplay} from "../experiment/ScreenEnums";

class TutorialHiddenSingle1 extends Screen {

  readonly name = 'TutorialHiddenSingle1';
  readonly title = "Tutorial";
  gridProps: GridProps;

  showBack = ButtonDisplay.Hide;

  props: {
    screenData: ScreenData,
    hiddenSingle: HiddenSingle;
  };

  constructor(props: any) {
    super(props);
    const hiddenSingle = this.props.hiddenSingle;
    this.gridProps = new GridProps({
      gridString: hiddenSingle.gridstrings.puzzle,
      mutable: false,
      actionCallback: this.props.screenData.recordGridAction
    });

    this.gridProps.removeAll(hiddenSingle.digits.distractor);

    const goal = this.props.hiddenSingle.coordinates.goal;
    if (hiddenSingle.houseType == HouseType.Row) {
      this.gridProps.background(this.gridProps.row(goal.x), '#7FDBFF');
    } else {
      this.gridProps.background(this.gridProps.column(goal.y), '#7FDBFF');
    }
    this.gridProps.background(goal, '#01FF70');
  }

  render() {
    const hiddenSingle = this.props.hiddenSingle;
    const target = <EmphText color={'blue'} text={`${hiddenSingle.digits.target}`}/>;
    return (
      <div className={"TutorialHiddenSingle1"}>
        <div className={"maintext"}>
          In this section, we will focus on
          the <EmphText color={Color.green} text={'green cell'}/> and solve for its value by looking along
          the <EmphText color={Color.blue} text={`blue ${hiddenSingle.houseType}`}/>.
          <br/><br/>
          Since the <EmphText color={Color.blue} text={`blue ${hiddenSingle.houseType}`}/> must
          contain exactly one {target}, let's see if we can determine if the only place a {target} can go
          is in the <EmphText color={Color.green} text={`green cell`}/>.
        </div>
        <br/>
        <Grid gridProps={this.gridProps}/>
        <br/>
        <br/>
        <div className={"maintext"}>
          Press the Next button to continue.
        </div>
      </div>
    );
  }
}

export default TutorialHiddenSingle1