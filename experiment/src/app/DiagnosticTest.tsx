import './TutorialSudokuScreen.css';
import '../index.css';
import * as moment from 'moment';

import * as React from 'react';
import {RefObject} from 'react';
import Screen from "../experiment/Screen";
import Grid, {GridProps} from "../sudoku/Grid";

import {DatumType} from "../experiment/Datastore";
import ScreenData from "../experiment/ScreenData";
import {GridAction} from "../sudoku/GridAction";
import {settings} from "./AppSettings";
import {ButtonDisplay, SubmitResult} from "../experiment/ScreenEnums";
import {toUSD} from "../misc/util";

class DiagnosticTest extends Screen {

  readonly name = 'DiagnosticTest';
  readonly title = "Simple Sudoku";
  readonly hasTask = true;
  readonly max_attempts = settings.tutorialMaxAttempts;
  static puzzleGrid = '2.2..2.....14.....3.';
  static solutionGrid = '1243342143122134';
  readonly showSkip = ButtonDisplay.Show;
  num_attempts: number;
  showBack = ButtonDisplay.Hide;
  compensation = settings.diagnosticTestPay;
  incorrectPenalty = 0.01;
  minCompensation = 0.05;

  startTime: moment.Moment;

  gridRef: RefObject<Grid>;

  props: {
    screenData: ScreenData
  };

  state: {
    compensation: number
  };

  constructor(props: any) {
    super(props);
    this.state = {
      compensation: this.compensation
    };

    this.gridRef = React.createRef();
    this.num_attempts = 0;
  }

  componentDidMount() {
    super.componentDidMount();
    this.startTime = moment();
  }

  gridActionCallback(grid: Grid, action: GridAction) {
    this.props.screenData.appendData(DatumType.GridAction, action);
  }

  onReset(callback?: () => void) {
    (this.gridRef.current as Grid).reset(callback);
  }

  onSubmit(callback: (result: SubmitResult) => void) {
    const grid = this.gridRef.current as Grid;
    const gridstring = grid.getGridString();
    const correct = gridstring == DiagnosticTest.solutionGrid;
    const responseTime = moment.duration(moment().diff(this.startTime)).asSeconds();
    const response = {
      responseTime: responseTime,
      gridstring: gridstring,
      correct: correct
    };
    this.props.screenData.datastore.diagnosticTestResponses.push(response);

    if (correct) {
      this.props.screenData.completed = true;
      grid.setInteractivity(false);
      this.props.screenData.showSuccessMessage("Correct!");
      callback(SubmitResult.Correct);
    } else {
      this.num_attempts += 1;
      this.setState((state, props) => {
        const compensation = Math.max(this.minCompensation, state['compensation'] - this.incorrectPenalty);
        this.props.screenData.setScreenCompensation(compensation);
        return {compensation: compensation}
      });
      this.props.screenData.showErrorMessage("Try Again",
        `That is not the correct solution.`);
      if (this.num_attempts < this.max_attempts) {
        callback(SubmitResult.Incorrect);
      } else {
        callback(SubmitResult.Fail);
      }
    }
  }

  render() {
    return (
      <div>
        <div className={"maintext"}>
          Below is a 4x4 variant of a puzzle called Sudoku. If you are already familiar with the game, please
          complete the puzzle. To interact with the Sudoku grid, click on a cell to select it and press a number key on the keyboard
          to change its value. Press <b>backspace</b> with a cell selected to erase its contents. Hint cells are indicated
          by their blue color and cannot be selected.
          <br/>
          <br/>
          If you are unfamiliar with Sudoku, please skip this screen. Otherwise, successfully completing this puzzle
          will yield <b>{toUSD(this.state.compensation)}</b>. Each incorrect attempt will reduce the bonus
          by <b>{toUSD(this.incorrectPenalty)}</b> down to <b>{toUSD(this.minCompensation)}</b>
        </div>
        <br />
        <Grid gridProps={new GridProps({
          gridString: DiagnosticTest.puzzleGrid,
          actionCallback: this.props.screenData.recordGridAction
        })}
              ref={this.gridRef}/>
      </div>
    );
  }
}

export default DiagnosticTest