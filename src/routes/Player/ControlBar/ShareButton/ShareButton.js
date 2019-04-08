const React = require('react');
const PropTypes = require('prop-types');
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

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.popupOpen !== this.state.popupOpen ||
            nextProps.className !== this.props.className ||
            nextProps.modalContainerClassName !== this.props.modalContainerClassName;
    }

    onPopupOpen = () => {
        this.setState({ popupOpen: true });
    }

    onPopupClose = () => {
        this.setState({ popupOpen: false });
    }

    render() {
        return (
            <Popup modalContainerClassName={this.props.modalContainerClassName} onOpen={this.onPopupOpen} onClose={this.onPopupClose}>
                <Popup.Label>
                    <div className={classnames(this.props.className, { 'active': this.state.popupOpen })}>
                        <Icon className={'icon'} icon={'ic_share'} />
                    </div>
                </Popup.Label>
                <Popup.Menu>
                    <div className={styles['share-dialog-container']} />
                </Popup.Menu>
            </Popup>
        );
    }
}

ShareButton.propTypes = {
    className: PropTypes.string,
    modalContainerClassName: PropTypes.string
};

module.exports = ShareButton;
