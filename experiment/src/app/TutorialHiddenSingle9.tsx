import './TutorialSudokuScreen.css';
import '../index.css'

import * as React from 'react';
import Screen from "../experiment/Screen";
import Grid, {GridProps} from "../sudoku/Grid";
import {HiddenSingle, HouseType} from "../sudoku/HiddenSingle";
import ScreenData from "../experiment/ScreenData";
import EmphText from "../misc/EmphText";
import {Color} from "../misc/util";

class TutorialHiddenSingle9 extends Screen {

  readonly name = 'TutorialHiddenSingle9';
  readonly title = "Tutorial";
  gridPropsTarget: GridProps;
  gridPropsDistractor: GridProps;

  props: {
    screenData: ScreenData,
    hiddenSingle: HiddenSingle;
  };

  constructor(props: any) {
    super(props);
    const hiddenSingle = this.props.hiddenSingle;
    this.gridPropsTarget = new GridProps({
      gridString: hiddenSingle.gridstrings.puzzle,
      mutable: false,
      actionCallback: this.props.screenData.recordGridAction
    });

    const coordinates = hiddenSingle.coordinates;
    if (hiddenSingle.houseType == HouseType.Row) {
      this.gridPropsTarget.background(this.gridPropsTarget.row(coordinates.goal.x), '#7FDBFF');
    } else {
      this.gridPropsTarget.background(this.gridPropsTarget.column(coordinates.goal.y), '#7FDBFF');
    }
    this.gridPropsTarget.background(coordinates.goal, '#01FF70');
    this.gridPropsTarget.background(coordinates.occupied, Color.red);
    this.gridPropsTarget.background(coordinates.emptyDouble, 'orange');
    this.gridPropsTarget.background(coordinates.emptyBox, Color.purple);

    this.gridPropsDistractor = this.gridPropsTarget.clone();

    this.gridPropsTarget.background(coordinates.targetDouble, 'orange');
    this.gridPropsTarget.background(coordinates.targetBox, Color.purple);
    this.gridPropsTarget.background(coordinates.targetSingle, 'orange');
    this.gridPropsTarget.background(coordinates.emptySingle, 'orange');

    this.gridPropsDistractor.background(coordinates.distractorDouble, 'orange');
    this.gridPropsDistractor.background(coordinates.distractorBox, Color.purple);
  }

  render() {
    const hiddenSingle = this.props.hiddenSingle;
    const target = <EmphText color={'blue'} text={`${hiddenSingle.digits.target}`}/>;
    const distractor = <EmphText color={'blue'} text={`${hiddenSingle.digits.distractor}`}/>;

    return (
      <div className={"TutorialHiddenSingle1"}>
        <div className={"maintext"}>
          Below, we can see that exploring {target} (grid on left) successfully
          eliminated every cell in the {hiddenSingle.houseType} as potential candidates
          for {target} whereas exploring {distractor} (grid on right) left another empty cell as a potential
          candidate for {distractor} (highlighted <EmphText color={Color.blue}/>).
          <br/>
          <br/>
          Therefore, we cannot conclude that the green cell must be a {distractor} but can
          conclude that it must be a {target}.
        </div>
        <br/>
        <span className={"grid-house"}>
          <span className={"grid-label"}>Exploring {target}</span>
          <Grid gridProps={this.gridPropsTarget}/>
        </span>
        <span className={"grid-house"}>
          <span className={"grid-label"}>Exploring {distractor}</span>
          <Grid gridProps={this.gridPropsDistractor}/>
        </span>
        <br/>
        <br/>
        <div className={"maintext"}>
          Press the Next button to continue.
        </div>
      </div>
    );
  }
}

export default TutorialHiddenSingle9