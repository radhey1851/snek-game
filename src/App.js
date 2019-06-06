import React from 'react';
import './App.css';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';

import PlayArea from './components/PlayArea';
import LeaderBoard from './components/LeaderBoard';
import ScoreBoard from './components/ScoreBoard';

function App() {
  return (
    <Provider store={store}>
      <div className='App'>
        <LeaderBoard />
        <PlayArea />
        <ScoreBoard />
      </div>
    </Provider>
  );
}

export default App;
