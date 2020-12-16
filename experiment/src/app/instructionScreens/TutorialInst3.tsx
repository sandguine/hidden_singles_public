import '../../index.css'

import * as React from 'react';
import Screen from "../../experiment/Screen";
import {ButtonDisplay} from "../../experiment/ScreenEnums";

class TutorialInst3 extends Screen {
  readonly name = 'TutorialInst3';
  showBack = ButtonDisplay.Hide;

  render() {
    return (
      <div>
        <div className={"maintext"}>
          Although the bulk of the experiment is the test phase,
          no feedback will be provided during this stage.
          <br/><br/>
          Because instruction is only available in the early parts of the experiment,
          to maximize your earnings,
          please be sure to fully understand the material during the tutorial phase.
          <br/><br/>
          Press the Next button to continue.
        </div>
      </div>
    );
  }
}

export default TutorialInst3