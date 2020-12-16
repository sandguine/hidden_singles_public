import Grid from "../sudoku/Grid";
import {Coordinate} from "../misc/util";
import GridTaskScreen from "./GridTaskScreen";
import {settings} from "../app/AppSettings";
import {SubmitResult} from "../experiment/ScreenEnums";

class SelectCellsScreen extends GridTaskScreen {
  solution: Array<Coordinate>;
  correctComment?: string;
  compensation = settings.simpleTaskPay;



  onSubmit(callback: (result: SubmitResult) => void) {
    const grid = this.gridRef.current as Grid;

    if (grid.state.selectedCells.length > this.solution.length) {
      this.props.screenData.showErrorMessage("Try Again",
        'You have selected too many cells!');
      callback(SubmitResult.Incorrect);
    } else if (grid.state.selectedCells.length < this.solution.length) {
      this.props.screenData.showErrorMessage("Try Again",
        'You have selected too few cells!');
      callback(SubmitResult.Incorrect);
    } else if ((this.gridRef.current as Grid).areSelected(this.solution)) {
      this.props.screenData.completed = true;
      this.props.screenData.showSuccessMessage("Correct!", this.correctComment, 8000);
      this.gridProps.selectable = false;
      callback(SubmitResult.Correct);
    } else {
      const text = this.solution.length == 1
        ? "The cell you have selected is incorrect!"
        : 'One or more cells you have selected is/are incorrect!';

      this.props.screenData.showErrorMessage("Try Again", text, 5000);
      callback(SubmitResult.Incorrect);
    }
  }
}

export default SelectCellsScreen;