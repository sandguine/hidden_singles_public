import '../../index.css'

import * as React from 'react';
import {settings} from "../AppSettings";
import Screen from "../../experiment/Screen";
import {ButtonDisplay} from "../../experiment/ScreenEnums";
import {toCents} from "../../misc/util";

class Phase2Inst extends Screen {
  readonly name = 'Phase2Instructions';
  readonly title = 'Phase 2';
  showBack = ButtonDisplay.Hide;

  render() {
    return (
      <div>
        <div className={"maintext"}>
          In the following screens, you will be presented with <b>{settings.numConditions * settings.numConditions}</b> puzzles.
          You will have <b>{settings.maxTime}</b> seconds and a single attempt to solve each puzzle.
          <br/><br/>
          Solving the puzzle will yield <b>{toCents(settings.puzzlePay[0])}</b>.
          <br/><br/>
          Failing to solve the puzzle will yield nothing and will
          pause the program for {settings.timeoutPenalty} seconds.
          <br/><br/>
          No feedback will be provided in this segment.
          <br/><br/>
          Press the Next button to continue.
        </div>
      </div>
    );
  }
}

export default Phase2Inst