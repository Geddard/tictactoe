import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

class Board extends React.Component {

    static defaultProps = {
        tiles: []
    };

    constructor() {
        super();

        this.socket = io();
    }

    componentDidMount() {
        this.socket.on('update_board', function (data) {
            this.props.addStone(data);
        }.bind(this));
    }

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
            onClick: () => this.handleTileClick(index)
        };
    }

    handleTileClick(index, nextStone) {
        if (!this.props.winner) {
            this.socket.emit('add_stone', {index: index, nextStone: this.props.nextStone});
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
        addStone: function (data) {
            dispatch({
                type: 'add_stone',
                currentStone: data.nextStone,
                tileId: data.index
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

