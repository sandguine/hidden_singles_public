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

class TutorialHiddenSingle7 extends SelectCellsScreen {

  readonly name = 'TutorialHiddenSingle7';
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
        multiselect: true,
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
    this.gridProps.background(coordinates.emptyDouble, Color.red);
    this.gridProps.background(coordinates.distractorBox, Color.purple);

    this.solution = new Array<Coordinate>();
    this.solution = this.solution.concat(coordinates.emptyBox);

    const distractor = <EmphText color={'blue'} text={`${hiddenSingle.digits.distractor}`}/>;
    const purpleCell = <EmphText color={Color.purple} text={`purple cell`}/>;
    const blueCells = <EmphText color={Color.blue} text={`blue cells`}/>;

    this.state = {
      text: <div>
        The {distractor} in the {purpleCell} prevents any cell that it shares
        its 3x3 box with from being a {distractor}.
        <br/><br/>
        Select the three {blueCells} that the {purpleCell} prevents from being {distractor}s.
      </div>
    };
  }

  onSubmit(callback: (result: SubmitResult) => void) {
    const grid = this.gridRef.current as Grid;
    const hiddenSingle = this.props.hiddenSingle;
    const distractor = hiddenSingle.digits.distractor;
    const distractorBox = hiddenSingle.coordinates.distractorBox;

    if ((this.gridRef.current as Grid).areSelected(this.solution)) {
      const comment = `The selected cells cannot possibly be ${distractor}s because they share the
        same box with a ${distractor} already.`;
      this.props.screenData.completed = true;
      this.props.screenData.showSuccessMessage("Correct!", comment, 8000);
      this.gridProps.selectable = false;
      callback(SubmitResult.Correct);
    } else {
      const selected: Cell[] = grid.state.selectedCells;
      if (selected.length < this.solution.length) {
        this.props.screenData.showErrorMessage("Try Again",
            'You have selected too few cells.', 5000);
      } else if (selected.length > this.solution.length) {
        this.props.screenData.showErrorMessage("Try Again",
          'You have selected too many cells.', 5000);
      } else if (_.find(selected, function (c: Cell) {
        return !c.coordinate.inSameBox(distractorBox, 3, 3)
      })) {
        this.props.screenData.showErrorMessage("Try Again",
          'We are looking for cells that share the same box as the purple cell', 8000);
      } else if (_.find(selected, function (c: Cell) {
        if (hiddenSingle.houseType == HouseType.Row) {
          return c.coordinate.x != distractorBox.x;
        } else {
          return c.coordinate.y != distractorBox.y;
        }
      })) {
        this.props.screenData.showErrorMessage("Try Again",
          `We are looking for cells that share the same ${hiddenSingle.houseType} as the green cell`, 8000);
      }
      callback(SubmitResult.Incorrect);
    }
  }
}

export default TutorialHiddenSingle7