import '../../index.css'

import * as React from 'react';
import Screen from "../../experiment/Screen";
import {ButtonDisplay} from "../../experiment/ScreenEnums";
import {settings} from "../AppSettings";
import {toCents} from "../../misc/util";

class TutorialInst1 extends Screen {
  readonly name = 'TutorialInst1';
  showBack = ButtonDisplay.Hide;

  render() {
    return (
      <div>
        <div className={"maintext"}>
          This HIT is divided into three phases, each with
          varying task, feedback, and compensation structures.
          <br/><br/>
          <b>Tutorial:</b> compensated for completion; unlimited attempts to solve the tasks;
          detailed feedback upon error
          <br/><br/>
          <b>Practice:</b> {settings.numPhase1Puzzles} puzzles. {toCents(settings.practicePuzzlePay[0])} for correctly solved puzzles.
          Detailed feedback upon error
          <br/><br/>
          <b>Test:</b> 64 puzzles. {toCents(settings.puzzlePay[0])} for correctly solved puzzles. No feedback upon error.
          <br/><br/>
          Press the Next button to continue.
        </div>
      </div>
    );
  }
}

export default TutorialInst1