import _ from 'lodash';
import React from 'react';
import Board from 'components/board';

class App extends React.Component {


    componentDidMount() {
        io().emit("register", _.uniqueId());
    }

    render() {
        return (
            <div className="app">
                <div className="app--title">
                    TIC TAC TOE
                </div>
                <Board />
            </div>
        );
    }
}

export default App;

