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
            lastUserInput: '',
            restartRequested: false,
            waitingForRestart: false
        };
    }

    componentDidMount() {
        if (this.isMultiplayer()) {
            this.socket.on('connect', () => {
                this.socket.emit('room', this.room);
            });

            this.socket.on('assing_id', (id) => {
                this.id = id;
            });

            this.socket.on('confirm_restart', () => {
                this.setState({
                    restartRequested: true
                });
            });

            this.socket.on('restart_all', () => {
                this.resetGame();
            });
        } else {
            this.id = 'soloUser';
        }

        this.socket.on('update_board', (data) => {
            this.props.addStone(data);

            if (this.isMultiplayer()) {
                this.setState({
                    lastUserInput: data.userId
                });
            }
        });
    }

    render() {
        return (
            <div className="board">
                <div className={this.getMarkerClass('left')}>X</div>
                <div className="board--container">
                    {this.props.tiles.map((tile, index) => this.renderTile(tile, index))}
                </div>
                <div className={this.getMarkerClass('right')}>O</div>
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
                    {this.renderWaitingMessage()}
                    {this.renderRestartRequestMessage()}
                    <button {...this.getRestartButtonProps()}>New Game</button>
                </div>
            );
        }
    }

    renderWaitingMessage() {
        if (this.state.waitingForRestart) {
            return <div className="board--container-waiting">Waiting for restar confirmation...</div>;
        }
    }

    renderRestartRequestMessage() {
        if (this.state.restartRequested && !this.state.waitingForRestart) {
            return (
                <div className="board--container-waiting">
                    Another player requested a restart...
                    Please confirm by pressing New Game
                </div>
            );
        }
    }

    getMarkerClass(side) {
        return classNames({
            'board--marker': true,
            'board--marker_active': this.isMarkerActive(side)
        }, 'board--marker_' + side);
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

    getRestartButtonProps() {
        return {
            className: 'board--container-button',
            disabled: this.state.waitingForRestart,
            onClick: () => this.requestRestart()
        };
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

            if (this.isMultiplayer()) {
                this.socket.emit('add_stone', data);
            } else {
                this.socket.emit('add_stone_solo', data);
            }
        }
    }

    requestRestart() {
        if (this.isMultiplayer()) {
            if (this.state.restartRequested) {
                this.socket.emit('request_confirmed', this.room);
            } else {
                this.setState({
                    waitingForRestart: true
                });
                this.socket.emit('request_restart', this.room);
            }

        } else {
            this.resetGame();
        }
    }

    resetGame() {
        this.props.reset();
        this.setState({
            lastUserInput: '',
            restartRequested: false,
            waitingForRestart: false
        });
    }

    isMarkerActive(side) {
        var nextStone = this.props.nextStone;

        return (side === 'left' && nextStone === 'x' ||
            side === 'right' && nextStone === 'o');
    }

    isMultiplayer() {
        return (this.props.gameMode === 'multiplayer');
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

