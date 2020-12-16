import './WelcomeScreen.css';
import '../index.css'

import * as React from 'react';
import Screen from "../experiment/Screen";
import {settings} from "./AppSettings";

class WelcomeScreen extends Screen {

  readonly name = 'WelcomeScreen';
  readonly title = "Welcome!";
  compensation = settings.basePay;

  render() {
    return (
      <div className={"WelcomeScreen"}>
        <div className={"inner"}>
          <div className={"maintext"}>
            Please proceed through the entire program until you see the screen titled "Thanks for your participation"
            and click the "Complete HIT" button. Failure to do so will result in an incomplete HIT and may forfeit compensation.
            <br/>
            <br/>
            Each worker may only complete this HIT once. This HIT may take anywhere from 3 to 60 minutes. Please ensure
            you have sufficient time to finish the HIT before proceeding.
            <br/>
            <br/>
            Located at the top-left corner of the screen is the total compensation earned so far.
            The <i>(+ x&cent;)</i> indicates how much would be earned if the current screen was completed without additional errors.
            <br/>
            <br/>
            Press the Next button to continue.
          </div>

        </div>
      </div>
    );
  }
}

export default WelcomeScreen