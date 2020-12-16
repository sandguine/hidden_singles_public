import {QuestionnaireKeys} from "./QuestionnaireData";
import QFreeResponse from "./QFreeResponse";


class QSelectHintFreeResponse extends QFreeResponse {

  constructor(props: any) {
    super(props);
    this.gridProps.background(this.props.questionnaireData.responses[QuestionnaireKeys.HintSelect], 'yellow');
  }
}

export default QSelectHintFreeResponse