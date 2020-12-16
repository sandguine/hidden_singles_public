import '../index.css'
import SelectCellsScreen from "../templateScreens/SelectCellsScreen";
// import {Color, Coordinate} from "../misc/util";
import Grid, {Cell, GridProps} from "../sudoku/Grid";
import {SubmitResult} from "../experiment/ScreenEnums";
import * as React from "react";
import ScreenData from "../experiment/ScreenData";
import {HiddenSingle, HouseType} from "../sudoku/HiddenSingle";
import {Color, Coordinate} from "../misc/util";
import EmphText from "../misc/EmphText";

const _ = require('lodash');

class TutorialHiddenSingle3 extends SelectCellsScreen {

  readonly name = 'TutorialHiddenSingle3';
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
    this.gridProps.removeAll(hiddenSingle.digits.distractor);

    this.gridProps.setSelectable(this.gridProps.all(), true);

    const coordinates = hiddenSingle.coordinates;
    const goal = coordinates.goal;
    if (hiddenSingle.houseType == HouseType.Row) {
      this.gridProps.background(this.gridProps.row(goal.x), '#7FDBFF');
    } else {
      this.gridProps.background(this.gridProps.column(goal.y), '#7FDBFF');
    }

    this.gridProps.background([goal.x, goal.y], '#01FF70');
    this.gridProps.background(coordinates.occupied, Color.red);
    this.gridProps.background(coordinates.emptyDouble, Color.red);
    this.gridProps.background(coordinates.emptyBox, Color.purple);

    this.solution = new Array<Coordinate>();
    this.solution.push(coordinates.targetBox);

    const target = <EmphText color={'blue'} text={`${hiddenSingle.digits.target}`}/>;
    const purpleCells = <EmphText color={Color.purple} text={'purple cells'}/>;

    this.state = {
      text: <div>
        We've successfully eliminated four possible cells that could contain a {target}, now
        highlighted in <EmphText color={Color.red}/>.
        Let's now consider the 3x3 box containing a {target} and the three {purpleCells}.
        There can only be a single {target} in the box, so the existing {target} prevents the
        three {purpleCells} from containing a {target}.
        <br/><br/>
        Select the {target} that is preventing
        the <EmphText color={Color.purple} text={'purple cells'}/> from being a {target}.
      </div>
    };
  }

  onSubmit(callback: (result: SubmitResult) => void) {
    const grid = this.gridRef.current as Grid;
    const hiddenSingle = this.props.hiddenSingle;
    const target = hiddenSingle.digits.target;

    if ((this.gridRef.current as Grid).areSelected(this.solution)) {
      const comment = `The purple cell cannot possibly be a ${target} because it shares the
        same box with a ${target} already.`;
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
        if (!selected.coordinate.inSameBox(this.solution[0], 3, 3)) {
          this.props.screenData.showErrorMessage("Try Again",
            `We are looking for a cell that shares the same box as the purple cells`, 8000);
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

export default TutorialHiddenSingle3