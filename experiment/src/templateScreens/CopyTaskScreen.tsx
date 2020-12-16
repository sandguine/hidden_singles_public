import * as React from "react";
import Screen from "../experiment/Screen";
import ScreenData from "../experiment/ScreenData";
import {levenshteinDistance, loadImage} from "../misc/util";
import {ButtonDisplay} from "../experiment/ScreenEnums";
import {InputTextarea} from "primereact/inputtextarea";

class CopyTaskScreen extends Screen {
  readonly hasTask = true;
  showReset = ButtonDisplay.Hide;
  showBack = ButtonDisplay.Hide;


  props: {
    screenData: ScreenData;
    filepath: string;
    text: string;
    maxErrors?: number; // max errors in Levenshtein distance. Use < 1 for normalized, >= 1 for absolute.
  };

  state: {
    response: string
  };

  constructor(props: any) {
    super(props);
    this.state = {response: ""};
  }

  onSubmit(callback: () => void) {
    const response = this.state.response.replace(/\W/g, '').toLowerCase();
    const target = this.props.text.replace(/\W/g, '').toLowerCase();

    let success;
    if (!this.props.maxErrors) {
      success = response == target;
    } else {
      const maxLD = this.props.maxErrors >= 1 ? this.props.maxErrors : this.props.maxErrors * target.length;
      const ld = levenshteinDistance(response, target);
      success = ld <= maxLD;
    }

    if (success) {
      this.props.screenData.completed = true;
      this.props.screenData.showSuccessMessage("Success!");
      this.setState(this.state, callback);
    } else {
      this.props.screenData.showErrorMessage("No match",
        "Please type the text exactly.");
    }
  }

  render() {
    return (
      <div>
        <div className={'maintext'}>
          Please type the following exactly.
        </div>
        <br/>
        <br/>
        {loadImage(this.props.filepath, 500)}
        <br/>
        <br/>
        <div>
          <InputTextarea value={this.state.response}
                         onChange={(e: any) => {
                           if (!this.props.screenData.completed) {
                             this.setState({response: e.target.value})
                           }
                         }}
                         rows={4} cols={46} />
        </div>
      </div>
    )
  }
}

export default CopyTaskScreen;