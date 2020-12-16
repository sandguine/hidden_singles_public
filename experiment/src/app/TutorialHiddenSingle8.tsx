import './TutorialSudokuScreen.css';
import '../index.css'

import * as React from 'react';
import Screen from "../experiment/Screen";
import Grid, {GridProps} from "../sudoku/Grid";
import {HiddenSingle, HouseType} from "../sudoku/HiddenSingle";
import ScreenData from "../experiment/ScreenData";
import EmphText from "../misc/EmphText";
import {Color} from "../misc/util";

class TutorialHiddenSingle8 extends Screen {

  readonly name = 'TutorialHiddenSingle8';
  readonly title = "Tutorial";
  gridProps: GridProps;

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

    const coordinates = hiddenSingle.coordinates;
    if (hiddenSingle.houseType == HouseType.Row) {
      this.gridProps.background(this.gridProps.row(coordinates.goal.x), '#7FDBFF');
    } else {
      this.gridProps.background(this.gridProps.column(coordinates.goal.y), '#7FDBFF');
    }

    this.gridProps.background(coordinates.goal, '#01FF70');
    this.gridProps.background(coordinates.occupied, Color.red);
    this.gridProps.background(coordinates.emptyDouble, Color.red);
    this.gridProps.background(coordinates.emptyBox, Color.red);
  }

  render() {
    const hiddenSingle = this.props.hiddenSingle;
    const target = <EmphText color={'blue'} text={`${hiddenSingle.digits.target}`}/>;
    const distractor = <EmphText color={'blue'} text={`${hiddenSingle.digits.distractor}`}/>;
    const blueCell = <EmphText color={Color.blue} text={`blue cell`}/>;
    const greenCell = <EmphText color={Color.green} text={`green cell`}/>;

    return (
      <div className={"TutorialHiddenSingle1"}>
        <div className={"maintext"}>
          We have eliminated 7 cells (now highlighted in <EmphText color={Color.red}/>)
          as possible candidates for {distractor} in
          the {hiddenSingle.houseType} containing
          the <EmphText color={Color.green} text={'green cell'}/>. If we could
          conclude that the last remaining blue cell cannot be a {distractor}, we could
          definitely conclude that the green cell is a {distractor}.
          <br/>
          <br/>
          However, unlike in the case with the {target}s, there are no {distractor}s that share a
          row, column, or box with the last empty {blueCell}, which means we cannot rule out the possibility that
          the {blueCell} is a {distractor}. Since either the {blueCell} or the {greenCell} can be a {distractor},
          we cannot be certain which one would be the {distractor}.
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

export default TutorialHiddenSingle8