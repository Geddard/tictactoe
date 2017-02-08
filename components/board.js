import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

class Board extends React.Component {

    static defaultProps = {
        tiles: []
    };

    constructor(props) {
        super();

        this.socket = io();

        if (props.gameMode === 'multiplayer') {
            this.room = 'room123';
            this.id = '';
        }

        this.state = {
            lastUserInput: ''
        };
    }

    componentDidMount() {
        var isMultiplayer = (this.props.gameMode === 'multiplayer');

        if (isMultiplayer) {
            this.socket.on('connect', () => {
                this.socket.emit('room', this.room);
            });

            this.socket.on('assing_id', (id) => {
                this.id = id;
            });
        } else {
            this.id = 'soloUser';
        }

        this.socket.on('update_board', (data) => {
            this.props.addStone(data);

            if (isMultiplayer) {
                this.setState({
                    lastUserInput: data.userId
                });
            }
        });
    }

    shouldComponentUpdate(nextProps) {
        return (!_.isEqual(this.props.tiles, nextProps.tiles));
    }

    render() {
        return (
            <div className="board">
                <div className="board--container">
                    {this.props.tiles.map((tile, index) => this.renderTile(tile, index))}
                </div>
                {this.renderWinner()}
            </div>
        );
    }

    renderTile(tile, index) {
        return (
            <div {...this.getTileProps(tile, index)}>
                <div className={this.getTileContentClass(index)}>
                    {tile}
                </div>
            </div>
        );
    }

    renderWinner() {
        var draw = this.props.draw;
        var winner = this.props.winner;
        var result;

        if (winner) {
            result = 'And the winner is: ' + winner +  '!';
        } else if (draw) {
            result = 'It\'s a draw!';
        }

        if (winner || draw) {
            return (
                <div className="board--container-result">
                    <div>{result}</div>
                    <button className="board--container-button" onClick={() => this.resetGame()}>New Game</button>
                </div>
            );
        }
    }

    getTileProps(tile, index) {
        return {
            className: 'tile',
            key: index,
            onClick: () => this.handleTileClick(index)
        };
    }

    getTileContentClass(index) {
        return classNames({
            'tile--content': true,
            'tile--content_winner': this.isThisAWinner(index)
        });
    }

    isThisAWinner(index) {
        if (this.props.winningCombination) {
            return this.props.winningCombination.length && this.props.winningCombination.includes(index);
        }
    }

    handleTileClick(index) {
        var data;

        if (!this.props.winner && (this.state.lastUserInput !== this.id)) {
            data = {
                index: index,
                userId: this.id,
                nextStone: this.props.nextStone,
                room: this.room
            };

            if (this.props.gameMode === 'multiplayer') {
                this.socket.emit('add_stone', data);
            } else {
                this.socket.emit('add_stone_solo', data);
            }
        }
    }

    resetGame() {
        this.props.reset();
        this.setState({
            lastUserInput: ''
        });
    }
}

var mapStateToProps = function (state) {
    var game = state.game;

    return {
        draw: game.draw,
        nextStone: game.nextStone,
        tiles: game.tiles,
        winner: game.winner,
        winningCombination: game.winningCombination
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

Board.propTypes = {
    draw: React.PropTypes.bool,
    gameMode: React.PropTypes.string,
    tiles: React.PropTypes.array,
    winner: React.PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);

