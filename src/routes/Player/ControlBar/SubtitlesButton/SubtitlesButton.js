const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Popup } = require('stremio-common');
const SubtitlesPicker = require('./SubtitlesPicker');
const styles = require('./styles');

class SubtitlesButton extends React.Component {
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
            <Popup className={this.props.popupContainerClassName} border={true} onOpen={this.onPopupOpen} onClose={this.onPopupClose}>
                <Popup.Label>
                    <div className={classnames(this.props.className, { 'active': this.state.popupOpen }, { 'disabled': this.props.subtitleTracks.length === 0 })}>
                        <Icon className={'icon'} icon={'ic_sub'} />
                    </div>
                </Popup.Label>
                <Popup.Menu>
                    <SubtitlesPicker
                        className={classnames(this.props.popupContentClassName, styles['subtitles-picker-container'])}
                        subtitleTracks={this.props.subtitleTracks}
                        selectedSubtitleTrackId={this.props.selectedSubtitleTrackId}
                        subtitleSize={this.props.subtitleSize}
                        subtitleDelay={this.props.subtitleDelay}
                        subtitleDarkBackground={this.props.subtitleDarkBackground}
                        dispatch={this.props.dispatch}
                    />
                </Popup.Menu>
            </Popup>
        );
    }
}

SubtitlesButton.propTypes = {
    className: PropTypes.string,
    popupContainerClassName: PropTypes.string,
    popupContentClassName: PropTypes.string,
    subtitleTracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired
    })).isRequired,
    selectedSubtitleTrackId: PropTypes.string,
    subtitleSize: PropTypes.number,
    subtitleDelay: PropTypes.number,
    subtitleDarkBackground: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
};
SubtitlesButton.defaultProps = {
    subtitleTracks: []
};

module.exports = SubtitlesButton;
