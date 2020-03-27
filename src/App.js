import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";


import { observer } from 'mobx-react';
import { action, observable } from 'mobx';

@observer
class App extends React.Component {
  @observable appName = 'ReactMobx Workplace'

  render() {
    return <div className='app relative' id='app'>
      <div className='p-8 text center'>{this.appName}</div>
        <Router ref={this.router}>
          <Switch>
              <Route path='/' component={() => <></>}/>
          </Switch>
        </Router>
      </div>
  }
}
export default App
