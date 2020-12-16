import ScreenData from "../experiment/ScreenData";
import Grid, {GridProps} from "../sudoku/Grid";
import {ButtonDisplay, SubmitResult} from "../experiment/ScreenEnums";
import * as React from "react";
import {RefObject} from "react";
import {settings} from "../app/AppSettings";
import CountdownTimer from "../experiment/CountdownTimer";
import GridTaskScreen from "./GridTaskScreen";
import {HiddenSingle, HouseType} from "../sudoku/HiddenSingle";
import {Color, Coordinate} from "../misc/util";
import EmphText from "../misc/EmphText";

class SolveHiddenSingleScreen extends GridTaskScreen {
  readonly hasTask = true;
  gridProps: GridProps;
  gridRef: RefObject<Grid>;
  max_attempts?: number;
  num_attempts: number;

  origGridProps: GridProps;
  hadIncorrect: boolean;
  name: string;
  title: string;
  compensation = settings.puzzlePay;
  currentCompensationIndex: number;
  disableCorrectAutoproceed?: boolean;
  showBack = ButtonDisplay.Hide;
  experiment_screen: number;
  hide_distractors = false; // Hides distractors from the grid and feedback
  showDetailedFeedback: boolean; // Whether or not to show color-coded error analysis
  showFeedbackMessage = true; // Whether or not to show Correct/Incorrect snackbar

  failureTimeout = settings.failurePenalty;

  props: {
    screenData: ScreenData,
    hiddenSingle: HiddenSingle
  };

  state: {
    text?: any,
    instructions?: any,
    explanations?: any,
    explanationsDisabled: boolean,
    activeIndex?: number,
    correct: boolean,
    failed: boolean,
    timedOut: boolean
  };

  constructor(props: any) {
    super(props);
    this.state = {
      text: [],
      instructions: [],
      explanations: [],
      explanationsDisabled: true,
      activeIndex: 0,
      correct: false,
      failed: false,
      timedOut: false,
    };
    this.num_attempts = 0;
    this.hadIncorrect = false;
    this.currentCompensationIndex = 0;
  }

  initGridProps() {
    const hiddenSingle = this.props.hiddenSingle;
    if (!this.gridProps) {
      this.gridProps = new GridProps({
        gridString: hiddenSingle.gridstrings.puzzle,
        solutionString: hiddenSingle.gridstrings.solution,
        actionCallback: this.props.screenData.recordGridAction
      });

      if (this.hide_distractors) {
        this.gridProps.removeAll(hiddenSingle.digits.distractor);
      }


      const goal = hiddenSingle.coordinates.goal;
      if (hiddenSingle.houseType == HouseType.Row) {
        this.gridProps.background(this.gridProps.row(goal.x), '#7FDBFF');
      } else {
        this.gridProps.background(this.gridProps.column(goal.y), '#7FDBFF');
      }

      this.gridProps.background(goal, '#01FF70');
      this.gridProps.setSelectable(this.gridProps.all(), false);
      this.gridProps.setSelectable(goal, true);
      this.origGridProps = this.gridProps.clone();
    }
  }

  componentWillMount(): void {
    super.componentWillMount();
    this.initGridProps();
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.screenData.puzzleRecord) {
      this.props.screenData.puzzleRecord.recordStart();
    }
  }

  proceedTimerExpire() {
    const current_screen = this.props.screenData.getCurrentScreen();
    if (current_screen == this.experiment_screen) {
      this.props.screenData.setSubmitButtonDisabled(false);
      this.props.screenData.goToNextScreen();
    }
  }

  setUninteractable() {
    this.origGridProps.selectable = false;
    this.origGridProps.mutable = false;
    this.gridProps.selectable = false;
    this.gridProps.mutable = false;
  }

  onTimeout(callback?: () => void) {
    this.experiment_screen = this.props.screenData.getCurrentScreen();
    this.setUninteractable();
    this.props.screenData.setSubmitButtonDisabled(true);
    this.props.screenData.setScreenCompensation(0);
    this.setState({timedOut: true});
  }

  onSubmit(callback: (result: SubmitResult) => void) {
    const grid = this.gridRef.current as Grid;
    this.experiment_screen = this.props.screenData.getCurrentScreen();
    const correct = grid.getGridString() == this.gridProps.solutionString;
    const input = parseInt(grid.getDigit(this.props.hiddenSingle.coordinates.goal));

    if (this.props.screenData.puzzleRecord) {
      this.props.screenData.puzzleRecord.recordAttempt(input, correct);
    }

    if (correct) {
      this.setUninteractable();
      this.props.screenData.completed = true;
      this.setState({correct: true});

      if (this.showFeedbackMessage) {
        this.props.screenData.showSuccessMessage("Correct!");
      }

      this.setState({state: this.state});
      if (this.showDetailedFeedback && this.hadIncorrect) {
        this.showReason(true);
      }
      callback(SubmitResult.Correct);
    } else {
      let failed = false;
      this.num_attempts += 1;
      let errorSummary;
      let errorDetail;

      if (this.max_attempts && this.num_attempts >= this.max_attempts) {

        errorSummary = "Incorrect";
        this.setUninteractable();
        this.setState({failed: true});
        this.props.screenData.setScreenCompensation(0);
        failed = true;
        this.onFailure(() => callback(SubmitResult.Fail));
      } else {
        this.currentCompensationIndex = Math.min(this.currentCompensationIndex + 1, this.compensation.length-1);
        this.props.screenData.setScreenCompensation(this.compensation[this.currentCompensationIndex]);
        errorSummary = "Try Again";
        this.onReset(() => {callback(SubmitResult.Incorrect)});
      }
      if (this.max_attempts && this.max_attempts > 1) {
         errorDetail = `${this.num_attempts} out of ${this.max_attempts} attempts used.`
      }

      if (this.showFeedbackMessage) {
        this.props.screenData.showErrorMessage(errorSummary, errorDetail);
      }
      if (this.showDetailedFeedback) {
        this.showReason(false);
      }

      this.hadIncorrect = true;
      if (failed) { // Why must it go here? No idea but else it doesn't work. Probably fixed but don't need to move it.
        if (this.timer) {
          this.props.screenData.stopTimer();
        }
        this.props.screenData.setSubmitButtonDisabled(true);
      }
    }
  }

  showReason(correct: boolean) {
    this.gridProps = this.origGridProps.clone();
    const hiddenSingle = this.props.hiddenSingle;
    const grid = this.gridRef.current!;
    const target: Coordinate = hiddenSingle.coordinates.goal;
    const digit: string = grid.getDigit(target);
    let digitElement = <EmphText color={'blue'} text={digit}/>;
    const greenCell = <EmphText color={Color.green} text={'green cell'}/>;
    let texts = [];

    const coordinates = hiddenSingle.coordinates;

    // First, check if they had an input
    if (!digit) {
      this.props.screenData.showErrorMessage("Please enter a number into the green cell.");
      this.gridRef.current!.reset();
      return;
    }

    // Next, check for contradiction
    let contradiction;
    if (hiddenSingle.houseType == HouseType.Row) {
      contradiction = grid.digit_in_same_row(target, digit);
    } else {
      contradiction = grid.digit_in_same_column(target, digit);
    }

    if (contradiction) {
      this.gridProps.background(contradiction, 'orangered');
      texts.push(<div key={'row'}><br/>{digitElement} cannot be at
        the  because {digitElement} already
        exists in the same {hiddenSingle.houseType} in
        the <EmphText color={Color.red} text={'red cell'}/>.
        <br/><br/>
        Try again to enter the correct digit in the {greenCell}.
      </div>);
    } else if (!this.hide_distractors && parseInt(digit) == hiddenSingle.digits.distractor) {
      // Check if the input was the distractor

      this.gridProps.background(coordinates.emptyBox, Color.red);
      this.gridProps.background(coordinates.emptyDouble, Color.red);
      this.gridProps.background(coordinates.occupied, Color.red);

      texts.push(<div key={'row'}><br/>
        It is not certain that {digitElement} must be at
        the {greenCell} because {digitElement} may potentially be in
        the <EmphText color={Color.blue} text={'blue cell'}/>.
        Note that neither the {greenCell} nor
        the <EmphText color={Color.blue} text={'blue cell'}/> share the same row, column, or box
        with a {digitElement}.
        <br/><br/>
        Try again to enter the correct digit in the {greenCell}.
      </div>);
    } else if (!correct) { // Must be a digit that doesn't have a hint on the grid
      this.gridProps.background(coordinates.occupied, Color.red);
      texts.push(<div key={'row'}><br/>
        It is not certain that {digitElement} must be at
        the {greenCell} because {digitElement} may potentially be in
        a <EmphText color={Color.blue} text={'blue cell'}/>.
        The <EmphText color={Color.red} text={'red cells'}/> cannot be {digitElement} because
        they already contain digits.
        <br/><br/>
        Try again to enter the correct digit in the {greenCell}.
      </div>);
    } else { // Correct
      this.gridProps.background(coordinates.emptyBox, Color.purple);
      this.gridProps.background(coordinates.targetBox, Color.purple);
      this.gridProps.background(coordinates.emptyDouble, 'orange');
      this.gridProps.background(coordinates.targetDouble, 'orange');
      this.gridProps.background(coordinates.emptySingle, 'orange');
      this.gridProps.background(coordinates.targetSingle, 'orange');
      this.gridProps.background(coordinates.occupied, Color.red);

      texts.push(
        <div key={'correctness'}>
          {digitElement} is correct! We can be certain that the <EmphText color={Color.green}/> cell must
          contain {digitElement} because no other cell in its {hiddenSingle.houseType} can be a {digitElement}.
          <br/><br/>
          The <EmphText color={Color.red} text={'red cells'}/> cannot be {digitElement} because
          they already contain digits.
          The empty <EmphText color={Color.purple} text={'purple cells'}/> cannot be {digitElement} because
          they share they share the same box with a {digitElement}.
          The empty <EmphText color={'orange'} text={'orange cells'}/> cannot be {digitElement} because
          they share {hiddenSingle.getConstraintHouseType()}s with other {digitElement}s.
        </div>);
    }


    this.setState({explanations: texts, explanationsDisabled: false});
  }

  onFailure(callback: (result: SubmitResult) => void) {
    this.gridProps.selectable = false;
    callback(SubmitResult.Fail);
  }

  render() {
    const showInstructions = !Array.isArray(this.state.instructions) || this.state.instructions.length > 0;

    let text;// = this.state.instructions;
    if (showInstructions && this.state.explanationsDisabled) {
      text = this.state.instructions;
    } else if (!this.state.explanationsDisabled) {
      text = this.state.explanations;
    }
    return (
      <div className={"SolveHiddenSingleScreen"}>
        {(!this.disableCorrectAutoproceed && this.state.correct) || this.state.failed || this.state.timedOut ?
          <div className={"timer"}>
            {this.state.correct ? 'Correct! You may click the Next button to proceed. Otherwise, t' : this.state.failed ? 'Incorrect. T' : 'Timed out. T'}he program will proceed in&nbsp;
            <CountdownTimer maxTime={this.failureTimeout}
                            callback={this.proceedTimerExpire.bind(this)}
                            showSeconds={true}
                            showMaxTime={false}/>
            &nbsp;seconds.
          </div>
          : (this.state && this.state.text && <div className={"maintext"}>
              {this.state.text}
            </div>)
        }

        <div className={'maintext'}>
          {text}
        </div>

        <br/>
        <Grid gridProps={this.gridProps} ref={this.gridRef}/>
      </div>
    )
  }
}

export default SolveHiddenSingleScreen;