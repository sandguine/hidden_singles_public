import '../../index.css'

import * as React from 'react';
import Screen from "../../experiment/Screen";
import {ButtonDisplay} from "../../experiment/ScreenEnums";

class TutorialInst2 extends Screen {
  readonly name = 'TutorialInst2';
  showBack = ButtonDisplay.Hide;

  render() {
    return (
      <div>
        <div className={"maintext"}>
          Compensation for this HIT is strictly performance-based according to the
          number of puzzles you solve.
          <br/><br/>
          Instruction and feedback are only available in the early parts of the experiment.
          It is strongly recommended that you <b>fully understand the material during the tutorial phase</b> to
          maximize your earnings.
          <br/><br/>
          Press the Next button to continue.
        </div>
      </div>
    );
  }
}

export default TutorialInst2