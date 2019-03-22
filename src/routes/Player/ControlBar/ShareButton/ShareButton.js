const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Popup } = require('stremio-common');
const styles = require('./styles');

class ShareButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popupOpen: false
        };
    }

    onPopupOpen = () => {
        this.setState({ popupOpen: true });
    }

    onPopupClose = () => {
        this.setState({ popupOpen: false });
    }

    render() {
        return (
            <Popup className={this.props.popupContainerClassName} border={true} onOpen={this.onPopupOpen} onClose={this.onPopupClose} >
                <Popup.Label>
                    <div className={classnames(this.props.className, { 'active': this.state.popupOpen })}>
                        <Icon className={'icon'} icon={'ic_share'} />
                    </div>
                </Popup.Label>
                <Popup.Menu>
                    <div className={classnames(this.props.popupContentClassName, styles['popup-content'])} />
                </Popup.Menu>
            </Popup >
        );
    };
}

module.exports = ShareButton;
