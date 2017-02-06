import React from 'react';
import Board from 'components/board';

class App extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div className="app">
                <div className="app--title">
                    TIC TAC TOE
                </div>
                {this.renderRules()}
                <Board />
            </div>
        );
    }

    renderRules() {
        return (
            <div className="app--rules">
                Click on a tile to fill it with and
                <span className="app--rules-symbol app--rules-symbol-x">
                    X
                </span>
                 or an
                <span className="app--rules-symbol app--rules-symbol-o">
                    O
                </span>
                <div>
                    (X always plays first)
                </div>
            </div>
        );
    }
}

export default App;

