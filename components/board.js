import React from 'react';

class Board extends React.Component {

    constructor() {
        super();

        this.tiles = [
            'upperLeft',
            'upperCenter',
            'upperRight',
            'middleLeft',
            'middleCenter',
            'middleRight',
            'lowerLeft',
            'lowerCenter',
            'lowerRight'
        ];
    }

    render() {
        return (
            <div className="board">
                {this.tiles.map(this.renderTile)}
            </div>
        );
    }

    renderTile(tile, index) {
        return (
            <div key={index} className="tile">
                <div className="tile--content">
                    ⨯○
                </div>
            </div>
        );
    }
}

export default Board;

