import * as React from 'react';
import Timeout = NodeJS.Timeout;

function str_pad_left(s: string, pad: string, length: number) {
  return (new Array(length+1).join(pad) + s).slice(-length);
}

function getTimeString(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return str_pad_left(minutes.toString(),'0',2)+':'+str_pad_left(seconds.toString(),'0',2);
}

class CountdownTimer extends React.Component {

  props: {
    maxTime: number,
    callback?: () => void,
    showSeconds?: boolean,
    showMaxTime: boolean
  };

  state: {
    elapsed: number;
  };

  interval: Timeout;
  startTimestamp: number;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      elapsed: 0
    };
  }

  tick() {
    const now = Date.now();
    const elapsed = now - this.startTimestamp;
    this.setState({elapsed: Math.floor(elapsed/1000)});
    if (elapsed >= this.props.maxTime*1000) {
      this.stop();
      if (this.props.callback) {
        this.props.callback();
      }
    }
  }

  stop() {
    clearInterval(this.interval);
  }

  componentDidMount(): void {
    this.startTimestamp = Date.now();
    this.interval = setInterval(this.tick.bind(this), 250);
  }

  componentWillUnmount(): void {
    this.stop();
  }

  displayString() {
    const remaining = this.props.maxTime - this.state.elapsed;
    let s = this.props.showSeconds ? remaining : getTimeString(remaining);
    s += this.props.showMaxTime ? `/ ${getTimeString(this.props.maxTime)}` : '';
    return s;
  }

  render() {
    return (
      <span className={"timer"}>
        {this.displayString()}
      </span>
    );
  }
}

export default CountdownTimer