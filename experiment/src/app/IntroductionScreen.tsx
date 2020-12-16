import './IntroductionScreen.css';
import '../index.css'
import * as React from 'react';
import Screen from "../experiment/Screen";
import EmphText from "../misc/EmphText";
import {Color} from "../misc/util";

class IntroductionScreen extends Screen {
  title = "Instructions";
  readonly name = 'IntroductionScreen';

  render() {

    return (
      <div className={"IntroductionScreen"}>
        <div className={"maintext"}>
          Each screen will present a <EmphText color={Color.green}/> Next button or
          a <EmphText color={Color.blue}/> Submit button.
          When the Next button is present, you may click on it to proceed to the next screen at your own pace.
          When the Submit button is present, a task will be presented on the screen.
          Once you complete the task successfully, the Submit button will turn into the Next button
          after which you may click on it to proceed.
          <br/>
          <br/>
          Some screens may present a <EmphText color={'gray'}/> Back button to go back to previous screens. Note that not all screens will
          have this button and going back to certain screens may be disabled as the program progresses.
          <br/>
          <br/>
          Some screens may present a <EmphText color={Color.red}/> Reset button. This will simply reset the screen to its original state but will
          NOT reset the timer. The Reset button is only offered as an alternative to clearing the screen through
          manual deletions.
          <br/>
          <br/>
          Located at the top-left corner of the screen is the total compensation earned so far.
          The <i>(+ x&cent;)</i> indicates how much would be earned if the current screen was completed without additional errors.
          <br/>
          <br/>
          Press the Next button to continue.
        </div>
      </div>
    );
  }
}

export default IntroductionScreen