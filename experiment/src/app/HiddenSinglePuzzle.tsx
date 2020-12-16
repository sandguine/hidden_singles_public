import ScreenData from "../experiment/ScreenData";
import {ButtonDisplay} from "../experiment/ScreenEnums";
import SolveHiddenSingleScreen from "../templateScreens/SolveHiddenSingleScreen";
import {HiddenSingle} from "../sudoku/HiddenSingle";
import {settings} from "./AppSettings";

class HiddenSinglePuzzle extends SolveHiddenSingleScreen {
  name: string;
  title: string;
  showBack = ButtonDisplay.Hide;
  disableCorrectAutoproceed = false;
  showDetailedFeedback = false;
  readonly timer = settings.maxTime;
  readonly max_attempts = settings.testMaxAttempts;

  props: {
    screenData: ScreenData,
    hiddenSingle: HiddenSingle,
    puzzleNumber: number,
    puzzleName: string
  };

  constructor(props: any) {
    super(props);
    this.name = `Phase2_${this.props.puzzleNumber}`;
    this.title = `Phase 2: Puzzle ${this.props.puzzleName}`;
  }
}

export default HiddenSinglePuzzle;