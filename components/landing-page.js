import React from 'react';
import { Link } from 'react-router';

class LandingPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="landing-page">
                <div className="landing-page--title">Select game mode</div>
                <div>
                    <Link {...this.getLinkProps('solo')}>
                        Solo
                    </Link>
                    <Link {...this.getLinkProps('multiplayer')}>
                        Multiplayer
                    </Link>
                </div>
            </div>
        );
    }

    getLinkProps(type) {
        return {
            className: 'landing-page--button',
            to: { pathname: '/game', query: {mode: type}}
        };
    }
}

export default LandingPage;
