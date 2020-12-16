import './SudokuExperiment.css';
import 'primeflex/primeflex.css';
import * as _js from 'underscore';
import {Button} from 'primereact/button';
import {Growl} from 'primereact/growl';
import {ProgressBar} from 'primereact/progressbar';

import Screen from "../experiment/Screen"
import ScreenData from "../experiment/ScreenData";
import {Datastore, DatumType} from "../experiment/Datastore";

import * as React from 'react';
import {ComponentClass, RefObject} from 'react';

import WelcomeScreen from "./WelcomeScreen";

import TutorialHiddenSingle1 from "./TutorialHiddenSingle1";
import TutorialHiddenSingle2 from "./TutorialHiddenSingle2";
import ThankYouScreen from "./ThankYouScreen";
import TutorialFullHouseScreen from "./TutorialFullHouseScreen";
import CountdownTimer from "../experiment/CountdownTimer";
import {settings} from "./AppSettings";
import DiagnosticTest from "./DiagnosticTest";
import {ButtonDisplay, SubmitResult} from "../experiment/ScreenEnums";
import DiagnosticSurvey from "./DiagnosticSurvey";
import DemographicSurvey from "./DemographicSurvey";

import {
  emitHitComplete,
  getUrlParams,
  round,
  toCents,
  toUSD
} from "../misc/util";
import TutorialContradictionScreen from "./TutorialContradictionScreen";
import HiddenSingleCP from "./HiddenSingleCP";
import Phase2Inst from "./instructionScreens/Phase2Inst";
import Phase1Inst from "./instructionScreens/Phase1Inst";
import {NewExperimentData} from "../service/sudokuService";
import TutorialHiddenSingle3 from "./TutorialHiddenSingle3";
import TutorialHiddenSingle4 from "./TutorialHiddenSingle4";
import TutorialHiddenSingle5 from "./TutorialHiddenSingle5";
import TutorialHiddenSingle6 from "./TutorialHiddenSingle6";
import TutorialHiddenSingle7 from "./TutorialHiddenSingle7";
import TutorialHiddenSingle8 from "./TutorialHiddenSingle8";
import TutorialHiddenSingle9 from "./TutorialHiddenSingle9";
import HiddenSinglePuzzle from "./HiddenSinglePuzzle";
import TutorialInst1 from "./instructionScreens/TutorialInst1";
import TutorialInst2 from "./instructionScreens/TutorialInst2";
import MathBackgroundSurvey from "./MathBackgroundSurvey";
import CopyTaskScreen from "../templateScreens/CopyTaskScreen";
import QPuzzle from "./questionnaire/QPuzzle";
import QFreeResponse from "./questionnaire/QFreeResponse";
import QNumber from "./questionnaire/QNumber";
import {QuestionnaireData, QuestionnaireKeys} from "./questionnaire/QuestionnaireData";
import QSelect from "./questionnaire/QSelect";
import {SurveyResponse} from "../experiment/Datum";
import QSelectHints from "./questionnaire/QSelectHints";
import QuestionnaireInst from "./questionnaire/QuestionnaireInst";
import QSelectHintFreeResponse from "./questionnaire/QSelectHintFreeResponse";
import PuzzleRecord from "../experiment/PuzzleRecord";

const _ = require('lodash');

enum ScreenMode {
  Task = 'task',
  Timeout = 'timeout',
  Fail = 'fail'
}

class SudokuExperiment extends React.Component {
  static assignmentIdParam = 'assignmentId';
  static hitIdParam = 'hitId';
  static workerIdParam = 'workerId';

  assignmentId: string;
  hitId: string;
  workerId: string;

  props: {
    loadedData: NewExperimentData;
  };

  state: {
    current_screen: number,
    screenTaskCompleted: boolean,
    next_button: boolean,
    screen_mode: ScreenMode,
    submitButtonDisabled: boolean,
    compensation: number,
    currentCompensation: number,
    progress: number
  };

  screens: Array<{screen: Screen, screenData: ScreenData}>;
  awaitBeforeScreens: Array<number>; // Wait for server response when these screens are the next ones
  completedScreens: Set<number>;
  screenIndices: any;
  datastore: Datastore;
  growl: any;
  timerRef: RefObject<CountdownTimer>;

  skipToEnd: boolean;
  onComplete: string;

  questionnaireData: QuestionnaireData;

  constructor(props: Readonly<{}>) {
    super(props);
    this.questionnaireData = new QuestionnaireData();
    this.datastore = new Datastore(this.props.loadedData, this.questionnaireData);
    this.timerRef = React.createRef();
    this.completedScreens = new Set<number>();
    this.state = {
      current_screen: 0,
      screenTaskCompleted: false,
      next_button: false,
      screen_mode: ScreenMode.Task,
      submitButtonDisabled: false,
      compensation: 0,
      currentCompensation: settings.instructionPay[0],
      progress: 0
    };
    this.skipToEnd = false;


    const params = getUrlParams();
    this.onComplete = params['onComplete'];
    this.assignmentId = params[SudokuExperiment.assignmentIdParam]
      ? params[SudokuExperiment.assignmentIdParam]
      : 'testAssignmentId';
    this.workerId = params[SudokuExperiment.workerIdParam]
      ? params[SudokuExperiment.workerIdParam]
      : 'testWorkerId';
    this.hitId = params[SudokuExperiment.hitIdParam]
      ? params[SudokuExperiment.hitIdParam]
      : 'testHitId';

    this.initializeScreens();
    this.recordNewScreen();

    this.recordData(DatumType.KeyValue, {key: 'assignmentId', value: this.assignmentId});
    this.recordData(DatumType.KeyValue, {key: 'workerId', value: this.workerId});
    this.recordData(DatumType.KeyValue, {key: 'hitId', value: this.hitId});

    this.awaitBeforeScreens = _.map([DiagnosticSurvey,
      TutorialHiddenSingle1,
      Phase1Inst,
      Phase2Inst,
      ThankYouScreen], this.getScreenIndex.bind(this));


    // Test environment functions.
    if (settings.testEnvironment) {

      // Backdoor for skipping directly to screens.
      const skipTo = parseInt(params['skipTo']);
      if (skipTo) {
        this.state.current_screen = skipTo;
      }
    }
  }

  refresh() {
    this.setState((state, props) => {return state});
  }

  getCurrentScreen() {
    return this.screens[this.state.current_screen].screen
  }

  getCurrentScreenData() {
    return this.screens[this.state.current_screen].screenData;
  }

  getScreenIndex(screen: ComponentClass<any>): number {
    return this.screenIndices[screen.toString()];
  }

  initializeScreens() {
    this.screenIndices = {};
    this.screens = [];

    this.addScreen(WelcomeScreen);
    this.addScreen(DiagnosticTest);
    this.addScreen(DiagnosticSurvey);
    this.addScreen(TutorialInst1);
    this.addScreen(TutorialInst2);

    this.addScreen(CopyTaskScreen,
      {
        filepath: 'images/understand1.png',
        text: 'I understand that, after the tutorial, I will only be compensated for puzzles that I solve correctly on the first attempt.',
        maxErrors: .15
      });

    this.addScreen(TutorialContradictionScreen,
      {gridstring: this.props.loadedData.contradiction,
              tutorial: this.props.loadedData.tutorial});
    this.addScreen(TutorialFullHouseScreen,
      {gridstring: this.props.loadedData.fullhouse,
              tutorial: this.props.loadedData.tutorial});


    this.addScreen(TutorialHiddenSingle1,
      {hiddenSingle: this.props.loadedData.tutorial});
    this.addScreen(TutorialHiddenSingle2,
      {hiddenSingle: this.props.loadedData.tutorial});
    this.addScreen(TutorialHiddenSingle3,
      {hiddenSingle: this.props.loadedData.tutorial});
    this.addScreen(TutorialHiddenSingle4,
      {hiddenSingle: this.props.loadedData.tutorial});
    this.addScreen(TutorialHiddenSingle5,
      {hiddenSingle: this.props.loadedData.tutorial});
    this.addScreen(TutorialHiddenSingle6,
      {hiddenSingle: this.props.loadedData.tutorial});
    this.addScreen(TutorialHiddenSingle7,
      {hiddenSingle: this.props.loadedData.tutorial});
    this.addScreen(TutorialHiddenSingle8,
      {hiddenSingle: this.props.loadedData.tutorial});
    this.addScreen(TutorialHiddenSingle9,
      {hiddenSingle: this.props.loadedData.tutorial});

    this.addPhase1();
    this.addPhase2();
    this.addQuestionnaire();
    this.addScreen(DemographicSurvey);
    this.addScreen(MathBackgroundSurvey);
    this.addScreen(ThankYouScreen);

    _js.mapObject(getUrlParams(), (val: string, key: string) => {
      this.recordData(DatumType.KeyValue, {'key': key, 'value': val})
    });
  }

  addScreen(screen: ComponentClass<any>, props?: object, screenData?: ScreenData) {
    if (props == undefined) {
      props = {};
    }

    if (screenData == undefined) {
      screenData = new ScreenData(this);
    }

    props['screenData'] = screenData;
    const component = React.createElement(screen, props);
    this.screenIndices[screen.toString()] = this.screens.length;
    this.screens.push({
      screen: component as unknown as Screen,
      screenData: screenData
    });
  }

  addPhase1() {
    this.addScreen(Phase1Inst);
    for (let i=0; i < this.props.loadedData.phase1.length; i++) {
      let hiddenSingle = this.props.loadedData.phase1[i];

      let puzzleRecord = new PuzzleRecord(1, i+1, hiddenSingle.condition);
      this.datastore.puzzleRecords.push(puzzleRecord);
      let screenData = new ScreenData(this, puzzleRecord);
      let props = {
        screenData: screenData,
        hiddenSingle: hiddenSingle,
        cp_number: i,
        key: `hiddenSingleCP${i+1}`
      };
      this.addScreen(HiddenSingleCP, props, screenData);
    }
  }

  addPhase2() {
    this.addScreen(Phase2Inst);
    for (let i=0; i < this.props.loadedData.phase2.length; i++) {
      let hiddenSingle = this.props.loadedData.phase2[i];

      let puzzleRecord = new PuzzleRecord(2, i+1, hiddenSingle.condition);
      this.datastore.puzzleRecords.push(puzzleRecord);
      let screenData = new ScreenData(this, puzzleRecord);

      let puzzleSet = Math.floor(i / 8) + 1;
      let puzzleSetTrial = (i % 8) + 1;
      let props = {
        screenData: screenData,
        hiddenSingle: hiddenSingle,
        puzzleNumber: i,
        puzzleName: `${puzzleSet}.${puzzleSetTrial}`,
        key: `hiddenSinglePuzzle${i}`
      };
      this.addScreen(HiddenSinglePuzzle, props, screenData);
    }
  }

  addQuestionnaireScreen(screen: ComponentClass<any>, props: any) {
    this.questionnaireData.screenNumbers[props.questionKey] = this.screens.length;

    props.hiddenSingle = this.props.loadedData.questionnaire;
    props.questionnaireData = this.questionnaireData;
    props.key = props.questionKey;

    if (props.onSubmitCallback == undefined) { // provide a default of just going to next screen
      props.onSubmitCallback = (response: SurveyResponse) => {this.goToNextScreen()};
    }

    this.addScreen(screen, props);
  }

  addQuestionnaire() {
    this.addScreen(QuestionnaireInst,
      {questionnaireData: this.questionnaireData,
        onSubmitCallback: () => {this.goToNextScreen()}});

    this.addQuestionnaireScreen(QPuzzle,
      {questionKey: QuestionnaireKeys.Puzzle});

    this.addQuestionnaireScreen(QNumber, {
      questionKey: QuestionnaireKeys.Confidence,
      questionText: "How confident do you feel that your answer is correct, expressed as a percentage?",
      min: 0,
      max: 100,
      step: 5,
      suffix: '%'
    });

    this.addQuestionnaireScreen(QFreeResponse, {
      questionKey: QuestionnaireKeys.Strategy,
      questionText: "Explain as clearly as possible the steps you went through to choose your answer." +
        " Please be as detailed as possible so that someone else could replicate your strategy" +
        " by following your response.",
      onSubmitCallback: (response: SurveyResponse) => {
        if (this.questionnaireData.responses[QuestionnaireKeys.Puzzle] != this.props.loadedData.questionnaire.digits.target
          && this.questionnaireData.responses[QuestionnaireKeys.Puzzle] != this.props.loadedData.questionnaire.digits.distractor) {
          this.goToNextScreen(this.questionnaireData.screenNumbers[QuestionnaireKeys.AdditionalInfo]);
        } else {
          this.goToNextScreen();
        }
      }});

    this.addQuestionnaireScreen(QSelect, {
      questionKey: QuestionnaireKeys.DigitSelection,
      questionText: "There are two numbers in the puzzle that occur three times outside of" +
        ` the ${this.props.loadedData.tutorial.houseType} containing the target cell.` +
        " Which of the following best describes how you chose between the two candidate numbers to consider?",
      options: [
        "I noticed something in the puzzle that initially made one candidate seem more likely to be correct than the other.",
        "I arbitrarily chose between the two candidates because they seemed equally promising to consider."
      ],
      onSubmitCallback: (response: SurveyResponse) => {
        if (response.response.index == 1) {
          this.goToNextScreen(this.questionnaireData.screenNumbers[QuestionnaireKeys.AdditionalInfo]);
        } else {
          this.goToNextScreen();
        }
      }
    });

    this.addQuestionnaireScreen(QFreeResponse, {
      questionKey: QuestionnaireKeys.HintNotice,
      questionText: "What did you notice in the puzzle that initially made one candidate seem more likely" +
        " to be correct than the other?"
    });

    this.addQuestionnaireScreen(QSelectHints, {
      questionKey: QuestionnaireKeys.HintSelect
    });

    this.addQuestionnaireScreen(QSelectHintFreeResponse, {
      questionKey: QuestionnaireKeys.HintExplain,
      questionText: "Please explain how the cell(s) you selected initially made one seem more likely to be correct" +
        " than the other."
    });

    this.addQuestionnaireScreen(QSelect, {
      questionKey: QuestionnaireKeys.DigitCheck,
      questionText: "After you selected a candidate to consider," +
        " did you check further to determine whether that candidate was actually correct or not?",
      options: [
        "Yes, I checked to see whether the candidate was actually correct.",
        "No, I just submitted my original guess without checking any further."
      ],
      onSubmitCallback: (response: SurveyResponse) => {
        if (response.response.index == 1) {
          this.goToNextScreen(this.questionnaireData.screenNumbers[QuestionnaireKeys.AdditionalInfo]);
        } else {
          this.goToNextScreen();
        }
      }
    });

    this.addQuestionnaireScreen(QFreeResponse, {
      questionKey: QuestionnaireKeys.CheckStrategy,
      questionText: "What did you do to determine if that candidate was actually correct?"
    });

    this.addQuestionnaireScreen(QSelect, {
      questionKey: QuestionnaireKeys.CheckStrategySelect,
      questionText: "Which of the following best describes the way you determined whether or not the" +
        " candidate was actually the correct answer?",
      options: [
        "I looked at other numbers in the puzzle until I noticed something that helped me" +
          " decide whether or not the candidate was correct.",
        "I checked whether the candidate I chose could go in any of the empty blue cells in the row/column."
      ]
    });

    this.addQuestionnaireScreen(QFreeResponse, {
      questionKey: QuestionnaireKeys.AdditionalInfo,
      questionText: "Please provide any additional information or clarifications to any of your previous" +
        " responses so that we can most accurately understand as best we can how you solved this puzzle."
    });
  }

  recordData(key: DatumType, value: any) {
    let screen_name = this.getCurrentScreenData().screenName;
    screen_name = screen_name ? screen_name : 'metadata';
    this.datastore.append.bind(this.datastore)(
      screen_name,
      this.state.current_screen,
      key,
      value);
    if (settings.testEnvironment) {
      console.log(this.datastore);
    }
  }

  recordNewScreen() {
    this.recordData(DatumType.Start, null);
  }

  onTimeOut() {
    this.recordData(DatumType.TimeOut, null);
    if (this.getCurrentScreenData().onTimeout != undefined) {
      this.getCurrentScreenData().onTimeout();
    } else {
      this.setState({screen_mode: ScreenMode.Timeout}, () => {
        setTimeout(() => {
          this.setState({screen_mode: ScreenMode.Task});
          this.goToNextScreen();
        }, settings.timeoutPenalty*1000);
      })
    }
  }

  setScreenCompensation(n: number) {
      this.setState({currentCompensation: n});
  }

  addScreenCompensation(n: number) {
      // No negative compensations
    this.setState((state, props) => {
      return {currentCompensation: Math.max(round(state['currentCompensation'] + n, 1e-3), 0)}
    });
  }

  resetButtonClick() {
    this.recordData(DatumType.ButtonClick, "reset");
    this.getCurrentScreenData().onReset();
  }

  backButtonClick() {
    this.recordData(DatumType.ButtonClick, "back");

    this.setState((state, props) => {
      const nextScreen = state['current_screen'] - 1;
      return {
        currentCompensation: 0,
        current_screen: nextScreen,
        progress: 100*((nextScreen+1) / this.screens.length)
      };
    }, this.recordNewScreen);
  }

  resolveDiagnosticSurveySubmit() {
    if (this.datastore.surveyResponses[DiagnosticSurvey.completedKey] != 'None') {
      this.skipToEnd = true;
    }
  }

  async submitButtonClick() { // For submit clicks, don't wait for server response
    this.recordData(DatumType.ButtonClick, "submit");

    switch (this.state.current_screen) {
      case (this.getScreenIndex(DiagnosticSurvey)):
        this.getCurrentScreenData().onSubmit(this.resolveDiagnosticSurveySubmit.bind(this));
        this.refresh();
        break;
      default:
        this.getCurrentScreenData().onSubmit(async (result: SubmitResult) => {
          this.recordData(DatumType.SubmitResult, result);
          if (result == SubmitResult.Correct) {
            const timer = this.timerRef.current as CountdownTimer;
            if (timer) {
              timer.stop();
            }

            if (this.state.current_screen == this.getScreenIndex(DiagnosticTest)) {
              this.skipToEnd = true;
            }
          }
          this.refresh();
        });
    }
  }

  skipButtonClick() {
    this.recordData(DatumType.ButtonClick, "skip");
    this.setScreenCompensation(0.00);
    this.goToNextScreen();
  }

  nextButtonClick() {
    this.recordData(DatumType.ButtonClick, "next");

    this.goToNextScreen();
  }

  getNextScreenNumber(): number {
    let next = this.state.current_screen + 1;

    // Skip to end
    const skipToEnd = this.skipToEnd &&
      this.state.current_screen == this.getScreenIndex(DiagnosticSurvey);
    if (skipToEnd) {
      next = this.getScreenIndex(DemographicSurvey);
    }

    return next;
  }

  async goToNextScreen(screenNumber?: number) {
    let nextScreenNumber = screenNumber == undefined ? this.getNextScreenNumber() : screenNumber;

    if (this.awaitBeforeScreens.includes(nextScreenNumber)) {
      await this.sendData();
    }

    // adding compensation
    if (!this.completedScreens.has(this.state.current_screen)) {
      this.completedScreens.add(this.state.current_screen);

      this.setState((state, props) => {
        const total = round(state['compensation'] + state['currentCompensation'], 1e-3);
        this.recordData(DatumType.Compensation, {
          'compensation': state['currentCompensation'],
          'total': total
        });
        return {compensation: total,
          currentCompensation: settings.instructionPay}
      })
    } else {
      this.setState({currentCompensation: settings.instructionPay});
    }


    this.setState((state, props) => {
      return {
        current_screen: nextScreenNumber,
        progress: 100*((nextScreenNumber+1) / this.screens.length)
      }
    }, () => {
      this.recordNewScreen();
      // If the experiment is over:
      if (this.state.current_screen == this.screens.length - 1) {
        emitHitComplete(this.onComplete);
      }
    });
  }

  async sendData() {
    const filename =  `${settings.saveDirectory}/${this.workerId}`;
    await this.datastore.export(filename, true);
  }

  showSkipButton() {
    const screenData = this.getCurrentScreenData();
    switch(screenData.showSkip) {
      case ButtonDisplay.Show: {
        return true;
      }
      case ButtonDisplay.Hide: {
        return false;
      }
      default: {
        return false;
      }
    }
  }

  showResetButton() {
    const screenData = this.getCurrentScreenData();
    switch(screenData.showReset) {
      case ButtonDisplay.Show: {
        return true;
      }
      case ButtonDisplay.Hide: {
        return false;
      }
      default: {
        return !this.getCurrentScreenData().completed;
      }
    }
  }

  /* Back button should not be shown if
    the screen is the first screen
    the current screen is a timed task
    the previous screen was a timed task.
    the screen is the last screen
 .*/
  showBackButton() {
    const screenData = this.getCurrentScreenData();
    switch(screenData.showBack) {
      case ButtonDisplay.Show: {
        return true;
      }
      case ButtonDisplay.Hide: {
        return false;
      }
      default: {
        return this.state.current_screen > 0
          && screenData.timer == 0
          && this.screens[this.state.current_screen-1].screenData.timer == 0
          && this.state.current_screen < this.screens.length - 1;
      }
    }
  }

  showNextButton() {
    const screenData = this.getCurrentScreenData();
    switch(screenData.showSubmit) {
      case ButtonDisplay.Show: {
        return false;
      }
      case ButtonDisplay.Hide: {
        return true;
      }
      default: {
        if (this.screens[this.state.current_screen]) {
          return this.getCurrentScreenData().completed;
        }
        return false;
      }
    }
  }

  setSubmitButtonDisabled(disabled: boolean) {
    this.setState({submitButtonDisabled: disabled});
  }

  showSuccessMessage(summary?: string, detail?: string, life?: number) {
    this.growl.show({severity: 'success', summary: summary, detail: detail, life: life});
  }

  showErrorMessage(summary?: string, detail?: string, life?: number) {
    this.growl.show({severity: 'error', summary: summary, detail: detail, life: life});
  }

  renderScreen() {
    if (this.state.current_screen < this.screens.length) {
      return this.getCurrentScreen();
    }
    return <p>Error: current screen is {this.state.current_screen}</p>;
  }

  render() {
    return <div>
      <div className={"progress-bar"}>
        <ProgressBar value={this.state.progress} showValue={false} style={{height: '18px'}}/>
      </div>
      <div className={"SudokuExperiment"} id={"SudokuExperiment"}>


        {this.state.screen_mode == ScreenMode.Timeout ?
          <div className={"timeout"}>
            The timer expired. The program will proceed in&nbsp;
            <CountdownTimer maxTime={settings.timeoutPenalty}
                            showSeconds={true}
                            showMaxTime={false}/>
            &nbsp;seconds.
          </div> :
         this.state.screen_mode == ScreenMode.Fail ?
           <div className={"fail"}>
             Incorrect. The program will proceed in&nbsp;
             <CountdownTimer maxTime={settings.failurePenalty}
                             showSeconds={true}
                             showMaxTime={false}/>
             &nbsp;seconds.
           </div> :
          <div>
            <Growl ref={(el) => this.growl = el}></Growl>
            <div className={"header p-grid p-justify-between"}>
              <span className={"left-container p-col-3"} style={
                {textAlign: 'left',
                paddingTop: '5px',
                paddingLeft: '10px'}
              }>
                {this.state.current_screen < this.screens.length - 1
                && <span className={"compensation"}>
                  {toUSD(round(this.state.compensation, 1e-2))} {this.state.currentCompensation > 0 && <i>+ ({toCents(round(this.state.currentCompensation, 1e-2))})</i>}
                </span>
                }
              </span>
              <span className={"p-col-6"}>
                <div className={"title-container"}>
                  {this.screens[this.state.current_screen].screenData.title}
                </div>
                {settings.testEnvironment && <div>
                  Screen Number: {this.state.current_screen}
                </div>}
                <br/>
              </span>
              <span className={"right-container p-col-3"}>
                {this.getCurrentScreenData().timer > 0 && <span className={"timer-container"}>
                  <CountdownTimer maxTime={this.getCurrentScreenData().timer}
                                  callback={this.onTimeOut.bind(this)}
                                  showMaxTime={true}
                                  ref={this.timerRef}/>
                </span>}
              </span>
            </div>

            <div className={"screen"} id-="screen">
              {this.renderScreen()}
            </div>

            <div className={"footer"}>
              <span className={"left-container"}>
                <span className={"reset-container"}>
                  {this.showResetButton() && <Button label="Reset"
                                             className="p-button-danger"
                                             onClick={this.resetButtonClick.bind(this)}/>}
                </span>
                {/*<span className={"hint-container"}>*/}
                {/*<Button label="Hint" className="p-button-warning" onClick={this.hintButtonClick.bind(this)}/>*/}
                {/*</span>*/}
              </span>


              <span className={"right-container"}>
                {this.showBackButton() && <span className={"back-container"}>
                  <Button label="Back"
                          className="p-button-secondary"
                          onClick={this.backButtonClick.bind(this)}/>
                </span>}
                {this.showSkipButton() && <span className={"skip-container"}>
                  <Button label="Skip"
                          className="p-button-warning"
                          onClick={this.skipButtonClick.bind(this)}/>
                </span>}

                <span className={"next-submit-container"}>
                  {this.showNextButton() ? (
                    this.state.current_screen < this.screens.length - 1 &&
                    <Button label="Next" className="p-button-success" onClick={this.nextButtonClick.bind(this)}/>
                  ) : (
                    <Button label="Submit" className="p-button-primary"
                            disabled={this.state.submitButtonDisabled}
                            onClick={this.submitButtonClick.bind(this)}/>
                  )}
                </span>
              </span>
            </div>
          </div>
        }
      </div>
    </div>;
  }
}

export default SudokuExperiment