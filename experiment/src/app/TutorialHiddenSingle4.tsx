import './TutorialSudokuScreen.css';
import '../index.css'

import * as React from 'react';
import Grid, {Cell, GridProps} from "../sudoku/Grid";
import {HiddenSingle, HouseType} from "../sudoku/HiddenSingle";
import ScreenData from "../experiment/ScreenData";
import EmphText from "../misc/EmphText";
import {Color, Coordinate} from "../misc/util";
import SelectCellsScreen from "../templateScreens/SelectCellsScreen";
import {SubmitResult} from "../experiment/ScreenEnums";

const _ = require('lodash');

class TutorialHiddenSingle4 extends SelectCellsScreen {

  readonly name = 'TutorialHiddenSingle4';
  readonly title = "Tutorial";

  props: {
    screenData: ScreenData,
    hiddenSingle: HiddenSingle;
  };

  state: {
    text: any;
  };

  constructor(props: any) {
    super(props);
    const hiddenSingle = this.props.hiddenSingle;
    this.gridProps = new GridProps({
      gridString: hiddenSingle.gridstrings.puzzle,
      mutable: false,
      selectable: true,
      multiselect: false,
      actionCallback: this.props.screenData.recordGridAction
    });
    this.gridProps.removeAll(hiddenSingle.digits.distractor);
    this.gridProps.setSelectable(this.gridProps.all(), true);

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
    this.gridProps.background(coordinates.emptySingle, Color.purple);

    this.solution = new Array<Coordinate>();
    this.solution.push(coordinates.targetSingle);

    const targetElement = <EmphText color={'blue'} text={`${hiddenSingle.digits.target}`}/>;
    const purpleCell = <EmphText color={Color.purple} text={`purple cell`}/>;

    this.state = {
      text: <div>
        We have eliminated 7 cells (now highlighted in <EmphText color={Color.red}/>)
        as possible candidates for {targetElement} in
        the {hiddenSingle.houseType} containing
        the <EmphText color={Color.green} text={'green cell'}/>, which means we
        now have only one other cell to eliminate before we can definitively conclude that
        the <EmphText color={Color.green} text={'green cell'}/> is
        a {targetElement}.
        <br/>
        <br/>
        Select the {targetElement} that is preventing the {purpleCell} from being a {targetElement}.
      </div>
    }
  }

  onSubmit(callback: (result: SubmitResult) => void) {
    const grid = this.gridRef.current as Grid;
    const hiddenSingle = this.props.hiddenSingle;
    const target = hiddenSingle.digits.target;
    const constraintHouseType = hiddenSingle.getConstraintHouseType();
    const emptySingle = hiddenSingle.coordinates.emptySingle;

    if ((this.gridRef.current as Grid).areSelected(this.solution)) {
      const comment = `The purple cell cannot possibly be a ${target} because it shares the
        same ${constraintHouseType} with a ${target} already.`;
      this.props.screenData.completed = true;
      this.props.screenData.showSuccessMessage("Correct!", comment, 8000);
      this.gridProps.selectable = false;
      callback(SubmitResult.Correct);
    } else {
      const selected: Cell = _.find(grid.state.selectedCells, function(c: any) {
        return c.props.value != target});
      if (selected == undefined) {
        this.props.screenData.showErrorMessage("Try Again",
          'Please select a cell.', 5000);
      } else {
        const incorrectHouse = (constraintHouseType == HouseType.Row && selected.props.cellProps.x != emptySingle.x)
          || (constraintHouseType == HouseType.Column && selected.props.cellProps.y != emptySingle.y);
        if (incorrectHouse) {
          this.props.screenData.showErrorMessage("Try Again",
            `We are looking for a cell that shares the same ${constraintHouseType} as the purple cell`, 8000);
        } else { // correct house is selected
          this.props.screenData.showErrorMessage("Try Again",
            `Recall that only a ${target} can prevent the purple cell
          from being a ${target}. Please select a cell with a ${target}`, 8000);
        }
      }
      callback(SubmitResult.Incorrect);
    }
  }
}

export default TutorialHiddenSingle4