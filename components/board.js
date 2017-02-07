import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

class Board extends React.Component {

    static defaultProps = {
        tiles: []
    };

    shouldComponentUpdate(nextProps) {
        return (!_.isEqual(this.props.tiles, nextProps.tiles));
    }

    render() {
        return (
            <div className="board">
                {this.props.tiles.map((tile, index) => this.renderTile(tile, index))}
                {this.renderWinner()}
            </div>
        );
    }

    renderTile(tile, index) {
        return (
            <div {...this.getTileProps(tile, index)}>
                <div className="tile--content">
                    {tile}
                </div>
            </div>
        );
    }

    renderWinner() {
        var winner = this.props.winner;
        var result;

        if (winner) {
            result = 'And the winner is: ' + winner +  '!';
        } else if (this.props.draw) {
            result = 'It\'s a draw!';
        }

        return (
            <div>
                <div>{result}</div>
                <button onClick={this.props.reset}>RESET</button>
            </div>
        );
    }

    getTileProps(tile, index) {
        return {
            className: 'tile',
            key: index,
            onClick: (event) => this.handleTileClick(event, index)
        };
    }

    handleTileClick(event, index) {
        if (!this.props.winner) {
            this.props.addStone(index, this.props.nextStone);
        }
    }
}

var mapStateToProps = function (state) {
    var game = state.game;

    return {
        draw: game.draw,
        nextStone: game.nextStone,
        tiles: game.tiles,
        winner: game.winner
    };
};

var mapDispatchToProps = function (dispatch) {
    return {
        addStone: function (tileId, currentStone) {
            dispatch({
                type: 'add_stone',
                currentStone: currentStone,
                tileId: tileId
            });
        },
        reset: function () {
            dispatch({
                type: 'reset_game'
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);

