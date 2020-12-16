import ScreenData from "../experiment/ScreenData";
import {ButtonDisplay} from "../experiment/ScreenEnums";
import SolveHiddenSingleScreen from "../templateScreens/SolveHiddenSingleScreen";
import {HiddenSingle} from "../sudoku/HiddenSingle";

class HiddenSingleCP extends SolveHiddenSingleScreen {
  name: string;
  title: string;
  showBack = ButtonDisplay.Hide;
  disableCorrectAutoproceed = true;
  showDetailedFeedback = true;

  props: {
    screenData: ScreenData,
    hiddenSingle: HiddenSingle,
    cp_number: number
  };

  constructor(props: any) {
    super(props);
    this.name = `Phase1_${this.props.cp_number}`;
    this.title = `Phase 1: Puzzle ${this.props.cp_number+1}`;
  }
}

export default HiddenSingleCP;