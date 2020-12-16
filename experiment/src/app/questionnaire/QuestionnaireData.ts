export enum QuestionnaireKeys {
  Puzzle = 'q_puzzle',
  Strategy = 'q_strategy',
  Confidence = 'q_confidence',
  DigitSelection = 'q_digit_selection',
  HintNotice = 'q_digit_notice',
  HintSelect = 'q_hint_select',
  HintExplain = 'q_hint_explain',
  DigitCheck = 'q_digit_check',
  CheckStrategy = 'q_check_strategy',
  CheckStrategySelect = 'q_check_strategy_select',
  AdditionalInfo = 'q_additional_info'
}

export class QuestionnaireData {
  responses: object;
  screenNumbers: object;

  constructor() {
    this.responses = {};
    this.screenNumbers = {};

    for (let v of Object.values(QuestionnaireKeys)) {
      this.responses[v] = null;
      this.screenNumbers[v] = null;
    }

    this.responses[QuestionnaireKeys.Puzzle] = 1;
    this.responses[QuestionnaireKeys.HintSelect] = [];
  }
}
