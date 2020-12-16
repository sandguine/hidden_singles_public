import SudokuExperiment from "../app/SudokuExperiment";
import {ButtonDisplay, SubmitResult} from "./ScreenEnums";
import {DatumType} from "./Datum";
import {GridAction} from "../sudoku/GridAction";
import {Datastore} from "./Datastore";
import {round} from "../misc/util";
import PuzzleRecord from "./PuzzleRecord";

class ScreenData {
  private experiment: SudokuExperiment;
  datastore: Datastore;
  puzzleRecord?: PuzzleRecord;
  screenName: string;
  title?: string;
  timer: number;
  completed: boolean;

  showReset: ButtonDisplay;
  showSubmit: ButtonDisplay;
  showBack: ButtonDisplay;
  showSkip: ButtonDisplay;

  lastState?: object;
  onReset: (callback?: () => void) => void;
  onHint: (callback?: () => void) => void;
  onSubmit: (callback?: (result: SubmitResult | object) => void) => void;
  onTimeout: (callback?: () => void) => void;

  constructor(experiment: SudokuExperiment,
              puzzleRecord?: PuzzleRecord) {
    this.experiment = experiment;
    this.datastore = this.experiment.datastore;
    this.showReset = ButtonDisplay.Default;
    this.showSubmit = ButtonDisplay.Default;
    this.showBack = ButtonDisplay.Default;
    this.showSkip = ButtonDisplay.Default;
    this.puzzleRecord = puzzleRecord;
    this.recordGridAction = this.recordGridAction.bind(this);
  }

  appendData(key: DatumType, value: any) {
    this.experiment.recordData(key, value);
  }

  recordGridAction(gridAction: GridAction) {
    this.experiment.recordData(DatumType.GridAction, gridAction);
  }

  refreshParent() {
    this.experiment.refresh();
  }

  showSuccessMessage(summary?: string, detail?: string, life?: number) {
    this.experiment.showSuccessMessage(summary, detail, life);
  }

  showErrorMessage(summary?: string, detail?: string, life?: number) {
    this.experiment.showErrorMessage(summary, detail, life);
  }

  stopTimer() {
    this.experiment.timerRef.current!.stop();
  }

  goToNextScreen() {
    this.experiment.goToNextScreen();
  }

  getCurrentScreen() {
    return this.experiment.state.current_screen;
  }

  setSubmitButtonDisabled(disabled: boolean) {
    this.experiment.setSubmitButtonDisabled(disabled);
  }

  getCompensation() {
    return round(this.experiment.state.compensation, 1e-2);
  }

  setScreenCompensation(n: number) {
    this.experiment.setScreenCompensation(n);
  }

  addScreenCompensation(n: number) {
    this.experiment.addScreenCompensation(n);
  }
}

export default ScreenData