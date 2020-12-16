import '../index.css'
import SelectCellsScreen from "../templateScreens/SelectCellsScreen";
import Grid, {Cell, GridProps} from "../sudoku/Grid";
import {SubmitResult} from "../experiment/ScreenEnums";
import * as React from "react";
import ScreenData from "../experiment/ScreenData";
import {HiddenSingle, HouseType} from "../sudoku/HiddenSingle";
import {Color, Coordinate} from "../misc/util";
import EmphText from "../misc/EmphText";

const _ = require('lodash');

class TutorialHiddenSingle6 extends SelectCellsScreen {

  readonly name = 'TutorialHiddenSingle6';
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
    this.gridProps = new GridProps(
      {
        gridString: hiddenSingle.gridstrings.puzzle,
        actionCallback: this.props.screenData.recordGridAction,
        mutable: false,
        selectable: true,
        multiselect: false,
      });
    this.gridProps.setSelectable(this.gridProps.all(), true);

    const coordinates = hiddenSingle.coordinates;
    if (hiddenSingle.houseType == HouseType.Row) {
      this.gridProps.background(this.gridProps.row(coordinates.goal.x), '#7FDBFF');
    } else {
      this.gridProps.background(this.gridProps.column(coordinates.goal.y), '#7FDBFF');
    }

    this.gridProps.background([coordinates.goal.x, coordinates.goal.y], '#01FF70');
    this.gridProps.background(coordinates.occupied, Color.red);
    this.gridProps.background(coordinates.distractorDouble, Color.purple);

    this.solution = new Array<Coordinate>();
    this.solution.push(coordinates.emptyDouble);

    const target = <EmphText color={'blue'} text={`${hiddenSingle.digits.target}`}/>;
    const distractor = <EmphText color={'blue'} text={`${hiddenSingle.digits.distractor}`}/>;
    const purpleCell = <EmphText color={Color.purple} text={`purple cell`}/>;
    const blueCell = <EmphText color={Color.blue} text={`blue cell`}/>;

    const constraintHouseType = hiddenSingle.getConstraintHouseType();
    this.state = {
      text: <div>
        Below, we have the same puzzle as before except with a few {distractor}s added to the grid. Although we know
        that the green cell must contain a {target}, let's see why we cannot conclude that
        the <EmphText color={Color.green} text={`green cell`}/> must contain a {distractor}.
        <br/><br/>
        We see that the {purpleCell} below contains a {distractor}, which means any cell in
        its {constraintHouseType} cannot contain a {distractor}. In this case, it
        shares a {constraintHouseType} with one of
        the <EmphText color={Color.blue} text={`blue cells`}/>.
        <br/><br/>
        Select the {blueCell} that the {purpleCell} prevents from containing a {distractor}.
      </div>
    };
  }

  onSubmit(callback: (result: SubmitResult) => void) {
    const grid = this.gridRef.current as Grid;
    const hiddenSingle = this.props.hiddenSingle;
    const distractor = hiddenSingle.digits.distractor;
    const constraintHouseType = hiddenSingle.getConstraintHouseType();
    const distractorDouble = hiddenSingle.coordinates.distractorDouble;

    if ((this.gridRef.current as Grid).areSelected(this.solution)) {
      const comment = `The selected cell cannot possibly be a ${distractor} because it shares the
        same ${constraintHouseType} with a ${distractor} already.`;
      this.props.screenData.completed = true;
      this.props.screenData.showSuccessMessage("Correct!", comment, 8000);
      this.gridProps.selectable = false;
      callback(SubmitResult.Correct);
    } else {
      const selected: Cell = _.find(grid.state.selectedCells, function(c: any) {
        return c.props.value != hiddenSingle.digits.target});
      if (selected == undefined) {
        this.props.screenData.showErrorMessage("Try Again",
          'Please select a cell.', 5000);
      } else {
        const incorrectHouse = (constraintHouseType == HouseType.Row && selected.props.cellProps.x != distractorDouble.x)
          || (constraintHouseType == HouseType.Column && selected.props.cellProps.y != distractorDouble.y);
        if (incorrectHouse) {
          this.props.screenData.showErrorMessage("Try Again",
            `We are looking for a cell that shares the same ${constraintHouseType} as the purple cell`, 8000);
        } else { // correct house is selected
          this.props.screenData.showErrorMessage("Try Again",
            `We are looking for a cell that shares the same ${hiddenSingle.houseType} as the green cell`, 8000);
        }
      }
      callback(SubmitResult.Incorrect);
    }
  }
}

export default TutorialHiddenSingle6