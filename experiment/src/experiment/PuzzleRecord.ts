import {HSCondition} from "../sudoku/HiddenSingle";
import * as moment from 'moment';

interface PuzzleAttempt {
  responseTime: number;
  input: number;
  correct: boolean;
}

class PuzzleRecord {
  start: moment.Moment;
  phase: number | null;
  trial: number | null;
  condition: HSCondition;
  attempts: PuzzleAttempt[];
  correct: boolean;
  solveDuration: number;

  constructor(phase: number | null,
              trial: number | null,
              condition: HSCondition) {
    this.phase = phase;
    this.trial = trial;
    this.condition = condition;
    this.attempts = [];
  }

  recordStart() {
    this.start = moment();
  }

  recordAttempt(input: number, correct: boolean) {
    const attempt = {
      responseTime: moment.duration(moment().diff(this.start)).asSeconds(),
      input: input,
      correct: correct
    };

    if (this.attempts.length == 0) {
      this.correct = correct;
    }

    if (correct && this.solveDuration == undefined) {
      this.solveDuration = attempt.responseTime;
    }

    this.attempts.push(attempt);
  }
}

export default PuzzleRecord