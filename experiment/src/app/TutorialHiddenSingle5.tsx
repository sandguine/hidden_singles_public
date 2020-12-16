import '../index.css'
import * as React from 'react';
import EmphText from "../misc/EmphText";
import SolveHiddenSingleScreen from "../templateScreens/SolveHiddenSingleScreen";
import {Color} from "../misc/util";

class TutorialHiddenSingle5 extends SolveHiddenSingleScreen {
  readonly name = 'TutorialHiddenSingle5';
  readonly title = "Tutorial";
  showDetailedFeedback = true;
  disableCorrectAutoproceed = true;
  hide_distractors = true;

  constructor(props: any) {
    super(props);

    const hiddenSingle = this.props.hiddenSingle;
    const house = <EmphText color={Color.blue} text={`blue ${hiddenSingle.houseType}`}/>;
    const greenCell = <EmphText color={Color.green} text={'green cell'}/>;


    this.state.instructions = <div className={'maintext'}>
      We have successfully eliminated every cell in the {house} except for the {greenCell} as
      potential candidates for <EmphText color={'blue'} text={`${hiddenSingle.digits.target}`}/>.
      <br/>
      <br/>
      Fill in the {greenCell} with the correct digit to solve this puzzle.
    </div>;
  }
}



export default TutorialHiddenSingle5