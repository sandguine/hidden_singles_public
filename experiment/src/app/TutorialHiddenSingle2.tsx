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

class TutorialHiddenSingle2 extends SelectCellsScreen {

  readonly name = 'TutorialHiddenSingle2';
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

    const goal = this.props.hiddenSingle.coordinates.goal;
    if (hiddenSingle.houseType == HouseType.Row) {
      this.gridProps.background(this.gridProps.row(goal.x), '#7FDBFF');
    } else {
      this.gridProps.background(this.gridProps.column(goal.y), '#7FDBFF');
    }

    this.gridProps.removeAll(hiddenSingle.digits.distractor);
    this.gridProps.background(goal, '#01FF70');
    this.gridProps.background(hiddenSingle.coordinates.occupied, Color.red);
    this.gridProps.background(hiddenSingle.coordinates.emptyDouble, Color.purple);

    this.solution = new Array<Coordinate>();
    this.solution.push(hiddenSingle.coordinates.targetDouble);

    const target = <EmphText color={'blue'} text={`${hiddenSingle.digits.target}`}/>;
    const purpleCell = <EmphText color={Color.purple} text={`purple cell`}/>;
    this.state = {
      text: <div>
        Obviously, a {target} cannot be in any of the <EmphText color={Color.red} text={`red cells`}/> because
        they already contain numbers.
        Looking at the {purpleCell}, we can see that there is
        a {target} in its <b>{hiddenSingle.getConstraintHouseType()}</b>.
        This means that we can eliminate {target} as a possible candidate for the {purpleCell}.
        <br/><br/>
        Select the {target} that is preventing the {purpleCell} from being a {target}.
      </div>
    };
  }

  onSubmit(callback: (result: SubmitResult) => void) {
    const grid = this.gridRef.current as Grid;
    const hiddenSingle = this.props.hiddenSingle;
    const target = hiddenSingle.digits.target;

    const constraintHouseType = hiddenSingle.getConstraintHouseType();

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
        const incorrectHouse = (constraintHouseType == HouseType.Row
                                && selected.props.cellProps.x != hiddenSingle.coordinates.emptyDouble.x)
                              || (constraintHouseType == HouseType.Column
                                && selected.props.cellProps.y != hiddenSingle.coordinates.emptyDouble.y);
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

export default TutorialHiddenSingle2