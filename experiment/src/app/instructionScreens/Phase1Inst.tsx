import '../../index.css'

import * as React from 'react';
import {settings} from "../AppSettings";
import Screen from "../../experiment/Screen";
import {ButtonDisplay} from "../../experiment/ScreenEnums";
import {toCents} from "../../misc/util";

class Phase1Inst extends Screen {
  readonly name = 'Phase1Instructions';
  readonly title = 'Phase 1';
  showBack = ButtonDisplay.Hide;

  render() {
    return (
      <div>
        <div className={"maintext"}>
          In this phase, you will be presented with <b>{settings.numPhase1Puzzles}</b> puzzles.
          You will have <b>{settings.maxTime}</b> seconds and a single attempt to solve each puzzle.
          <br/><br/>
          Solving the puzzle on the <b>first attempt</b> will yield <b>{toCents(settings.practicePuzzlePay[0])}</b>.
          <br/><br/>
          Using more than one attempt to solve solve the puzzle will yield nothing.
          However, a short explanation will be provided for incorrect attempts.
          <br/><br/>
          Press the Next button to continue.
        </div>
      </div>
    );
  }
}

export default Phase1Inst