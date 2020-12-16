import '../index.css'

import * as React from 'react';
import Screen from "../experiment/Screen";
import {toUSD} from "../misc/util";
import {settings} from "./AppSettings";
import PuzzleRecord from "../experiment/PuzzleRecord";
const _ = require('lodash');


  class ThankYouScreen extends Screen {
  readonly name = 'ThankYouScreen';
  title = "Thank you!";

  render() {
    const puzzleRecords = _.values(this.props.screenData.datastore.puzzleRecords);
    const solved = _.sum(_.map(puzzleRecords, (r: PuzzleRecord) => r.correct));

    const bonus = this.props.screenData.getCompensation() - settings.basePay;

    return (
      <div className={"maintext"}>
        {puzzleRecords.length > 0 && <span>
          You solved {solved} out of {puzzleRecords.length} puzzles.
          <br/><br/>
        </span>}
        {toUSD(settings.basePay)} will be paid once the HIT is
        approved. {bonus >= 0.005 && <span>
          Please allow a week for the remaining bonus of {toUSD(bonus)} to be awarded.
        </span>}
        <br/><br/>
        You may close the window.
      </div>
    );
  }
}

export default ThankYouScreen