import React from 'react';
import ScreenData from "./ScreenData";
import {ButtonDisplay, SubmitResult} from "./ScreenEnums";

class Screen extends React.Component {

  static puzzlePath: string;
  readonly title: string;
  readonly name: string;
  readonly hasTask: boolean;
  timer?: number;
  readonly compensation?: number | number[];

  showBack?: ButtonDisplay;
  showReset?: ButtonDisplay;
  showSubmit?: ButtonDisplay;
  showSkip?: ButtonDisplay;

  props: {
    screenData: ScreenData
  };

  onReset(callback?: () => void) {

  }

  onHint(callback?: () => void) {

  }

  onSubmit(callback?: (result: SubmitResult | object) => void) {

  }

  onTimeout(callback?: () => void) {

  }

  setScreenData(): void{
    const screenData = this.props.screenData;
    screenData.screenName = this.name;
    screenData.title = this.title;
    screenData.timer = this.timer ? this.timer : 0;
    screenData.onSubmit = this.onSubmit.bind(this);
    screenData.onReset = this.onReset.bind(this);
    screenData.onHint = this.onHint.bind(this);
    screenData.onTimeout = this.onTimeout.bind(this);

    if (this.showBack) {
      screenData.showBack = this.showBack;
    }
    if (this.showSubmit) {
      screenData.showSubmit = this.showSubmit;
    }
    if (this.showReset) {
      screenData.showReset = this.showReset;
    }
    if (this.showSkip) {
      screenData.showSkip = this.showSkip;
    }

    if (!this.hasTask) {
      screenData.completed = true;
    }
    else if (this.hasTask && screenData.completed == undefined) {
      screenData.completed = !this.hasTask;
    }
    screenData.refreshParent();
  }

  componentWillMount(): void {
    this.setScreenData();
    if (this.compensation != undefined) {
      if (Array.isArray(this.compensation)) {
        this.props.screenData.setScreenCompensation(this.compensation[0]);
      } else {
        this.props.screenData.setScreenCompensation(this.compensation);
      }
    }
  }

  componentWillUnmount(): void {
    this.props.screenData.lastState = this.state;
  }

  componentDidMount() {
    if (this.props.screenData.lastState) {
      this.setState(this.props.screenData.lastState);
    }
  }
}

export default Screen