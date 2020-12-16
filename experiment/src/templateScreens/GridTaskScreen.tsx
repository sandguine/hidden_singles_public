import {GridProps} from "../sudoku/Grid";
import {RefObject} from "react";
import Screen from "../experiment/Screen";
import Grid from "../sudoku/Grid";
import * as React from 'react';
import {GridAction} from "../sudoku/GridAction";
import {DatumType} from "../experiment/Datum";

class GridTaskScreen extends Screen {

  readonly hasTask = true;
  gridProps: GridProps;
  gridRef: RefObject<Grid>;

  state: {
    text?: any;
  };

  constructor(props: any) {
    super(props);
    this.gridRef = React.createRef();
  }

  gridActionCallback(grid: Grid, action: GridAction) {
    this.props.screenData.appendData(DatumType.GridAction, action);
  }

  onReset(callback?: () => void) {
    (this.gridRef.current as Grid).reset(callback);
  }

  componentDidMount() {
    super.componentDidMount();
  }

  render() {
    return (
      <div className={"GridTaskScreen"}>
        {this.state && this.state.text && <div className={"maintext"}>
          {this.state.text}
        </div>}
        <br/>
        <Grid gridProps={this.gridProps} ref={this.gridRef}/>
      </div>
    );
  }
}

export default GridTaskScreen;