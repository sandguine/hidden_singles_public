import * as React from 'react';
import './App.css';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import SudokuExperiment from "./app/SudokuExperiment";
import {getNewExperiment, NewExperimentData} from "./service/sudokuService";
import {getUrlParams} from "./misc/util";

class App extends React.Component {
  data: NewExperimentData;

  state: {
    dataLoaded: boolean
  };

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      dataLoaded: false
    }
  }

  async componentDidMount() {
    const params = getUrlParams();

    let seed;
    if (params['seed'] != undefined) {
      seed = params['seed'];
    } else if (params[SudokuExperiment.workerIdParam]) {
      seed = params[SudokuExperiment.workerIdParam];
    }
    this.data = await getNewExperiment(seed);
    this.setState({dataLoaded: true});
  }

  public render() {
    if (this.state.dataLoaded) {
      return <SudokuExperiment loadedData={this.data}/>
    } else {
      return "Loading"
    }
  }
}

export default App;
