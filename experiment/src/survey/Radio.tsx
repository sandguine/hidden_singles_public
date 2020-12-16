import './Radio.css';

import * as React from 'react';
import {RadioButton} from "primereact/radiobutton";

class Radio extends React.Component {

  props: {
    question: string,
    responses: Array<string>,
    onChange: (response: string) => void
    disabled?: boolean,
    children?: any // Temp fix, not sure why not having this causes error
  };

  state: {
    response: string | null;
  };

  constructor(props: any) {
    super(props);
    this.state = {
      response: null
    };
  }

  onChange(e: any) {
    this.setState({response: e.value}, () => {this.props.onChange(e.value)});
  }

  createResponses() {
    const responses = [];
    for (let i = 0; i < this.props.responses.length; i++) {
      responses.push(
        <div className={"radio-question-response"} key={`${this.props.responses[i]}`}>
          <RadioButton inputId={`response${i}`}
                       name={`response${this.props.responses[i]}`}
                       value={this.props.responses[i]}
                       onChange={this.onChange.bind(this)}
                       disabled={this.props.disabled}
                       checked={this.state.response === this.props.responses[i]}/>
          <label htmlFor={`response${i}`}
                 className="p-radiobutton-label">
            {this.props.responses[i]}
          </label>
        </div>
      );
    }
    return responses;
  }

  render() {
    return <div className={"radio-question"}>
      <div className={"radio-question-text"}>
        {this.props.question}
      </div>
      {this.createResponses()}
    </div>
  }
}

export default Radio;