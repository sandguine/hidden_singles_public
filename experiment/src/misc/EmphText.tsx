import * as React from 'react';
import {Color, reverseMap} from "./util";

const reverseColor = reverseMap(Color);

class EmphText extends React.Component {
  props: {
    color?: string | Color,
    bold?: boolean,
    text?: string
  };

  render() {
    const style = {
      color: this.props.color ? this.props.color : 'black',
      fontWeight: (this.props.bold || this.props.bold == undefined) ? "bold" : "inherit"
    } as React.CSSProperties;
    return (
      <span style={style}>
        {this.props.text ? this.props.text : reverseColor[style.color!] ? reverseColor[style.color!] : style.color}
      </span>
    );
  }

}

export default EmphText;