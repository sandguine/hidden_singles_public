import QuestionnaireScreen from "./QuestionnaireScreen";
import * as React from "react";
import {GridAction} from "../../sudoku/GridAction";
import {Cell} from "../../sudoku/Grid";
const _ = require('lodash');


class QSelectHints extends QuestionnaireScreen {
  compensation = 0.10;

  showGridBelow = true;

  constructor(props: any) {
    super(props);
    this.gridProps.selectable = true;
    this.gridProps.multiselect = true;
    this.gridProps.setSelectable(this.gridProps.all(), true);
    this.gridProps.setSelectable(this.props.hiddenSingle.coordinates.goal, false);
    this.gridProps.actionCallback = (gridAction: GridAction) => {
      const cells = this.gridRef.current!.state.selectedCells;
      const coords = _.map(cells, (c: Cell) => c.coordinate);
      this.updateResponseState(coords);
    }
  }

  renderInstructions() {
    return (<div className={"maintext"}>
      Please select the cell(s) that initially made one candidate seem more
      likely to be correct than the other.
    </div>);
  }

  validateResponse(): boolean {
    return this.state.response.length > 0;
  }
}

export default QSelectHints