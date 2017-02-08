import React from 'react';
import Board from 'components/board';

class App extends React.Component {

    constructor() {
        super();

        this.state = {
            gameMode: 'solo',
            selectionMade: false
        };
    }

    render() {
        return (
            <div className="app">
                {this.renderContent()}
            </div>
        );
    }

    renderContent() {
        var contentToRender = null;

        if (!this.state.selectionMade) {
            contentToRender = this.renderSelectionPropmt();
        } else {
            contentToRender = <Board gameMode={this.state.gameMode} />;
        }

        return contentToRender;
    }

    renderSelectionPropmt() {
        return (
            <div>
                <div className="app--mode-title">Select game mode</div>
                <div>
                    <button className="app--mode-button" onClick={() => this.setGameMode('solo')}>Solo</button>
                    <button className="app--mode-button" onClick={() => this.setGameMode('multiplayer')}>Multiplayer</button>
                </div>
            </div>
        );
    }

    setGameMode(mode) {
        this.setState({
            gameMode: mode,
            selectionMade: true
        });
    }
}

export default App;

