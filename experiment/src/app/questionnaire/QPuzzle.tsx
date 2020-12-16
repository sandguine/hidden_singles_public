import SolveHiddenSingleScreen from "../../templateScreens/SolveHiddenSingleScreen";
import {ButtonDisplay} from "../../experiment/ScreenEnums";
import {QuestionnaireData, QuestionnaireKeys} from "./QuestionnaireData";
import {DatumType, SurveyResponse} from "../../experiment/Datum";
import ScreenData from "../../experiment/ScreenData";
import {HiddenSingle} from "../../sudoku/HiddenSingle";

class QPuzzle extends SolveHiddenSingleScreen {
  name = "questionnaire_puzzle";
  title = "Questionnaire: Puzzle";
  showBack = ButtonDisplay.Hide;
  disableCorrectAutoproceed = false;
  showDetailedFeedback = false;
  readonly max_attempts = 1;
  showFeedbackMessage = false;

  props: {
    screenData: ScreenData,
    hiddenSingle: HiddenSingle,
    questionnaireData: QuestionnaireData,
    questionKey: string,
    onSubmitCallback: (response: SurveyResponse) => any,
  };

  onSubmit() {
    const goal = this.props.hiddenSingle.coordinates.goal;
    const input = parseInt(this.gridRef.current!.getDigit(goal));
    this.props.questionnaireData.responses[QuestionnaireKeys.Puzzle] = input;

    const response = new SurveyResponse(this.props.questionKey, input);
    this.props.screenData.appendData(DatumType.SurveyResponse, response);

    this.props.onSubmitCallback(response);
  }
}

export default QPuzzle;