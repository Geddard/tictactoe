import React from 'react';
import { addStone } from 'redux/actions';
import { connect } from 'react-redux';

class Board extends React.Component {

    static defaultProps = {
        tiles: []
    };

    render() {
        return (
            <div className="board">
                {this.props.tiles.map((tile, index) => this.renderTile(tile, index))}
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

    getTileProps(tile, index) {
        return {
            className: 'tile',
            key: index,
            onClick: (event) => this.handleTileClick(event, index)
        }
    }

    handleTileClick(event, index) {
        this.props.addStone(index);
    }
}

var mapStateToProps = function (state) {
    var game = state.game;

    return {
        nextStone: game.nextStone,
        tiles: game.tiles
    };
}

var mapDispatchToProps = function (dispatch) {
    return {
        addStone: function (tileId) {
            dispatch({
                type: 'add_stone',
                tileId: tileId
            });
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);

