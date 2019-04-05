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

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.popupOpen !== this.state.popupOpen ||
            nextProps.className !== this.props.className ||
            nextProps.popupContainerClassName !== this.props.popupContainerClassName ||
            nextProps.popupContentClassName !== this.props.popupContentClassName ||
            nextProps.subtitlesTracks !== this.props.subtitlesTracks ||
            nextProps.selectedSubtitlesTrackId !== this.props.selectedSubtitlesTrackId ||
            nextProps.subtitlesSize !== this.props.subtitlesSize ||
            nextProps.subtitlesDelay !== this.props.subtitlesDelay ||
            nextProps.subtitlesDarkBackground !== this.props.subtitlesDarkBackground;
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
                    <div className={classnames(this.props.className, { 'active': this.state.popupOpen }, { 'disabled': this.props.subtitlesTracks.length === 0 })}>
                        <Icon className={'icon'} icon={'ic_sub'} />
                    </div>
                </Popup.Label>
                <Popup.Menu>
                    <SubtitlesPicker
                        className={classnames(this.props.popupContentClassName, styles['subtitles-picker-container'])}
                        subtitlesTracks={this.props.subtitlesTracks}
                        selectedSubtitlesTrackId={this.props.selectedSubtitlesTrackId}
                        subtitlesSize={this.props.subtitlesSize}
                        subtitlesDelay={this.props.subtitlesDelay}
                        subtitlesDarkBackground={this.props.subtitlesDarkBackground}
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
    subtitlesTracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired
    })).isRequired,
    selectedSubtitlesTrackId: PropTypes.string,
    subtitlesSize: PropTypes.number,
    subtitlesDelay: PropTypes.number,
    subtitlesDarkBackground: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
};
SubtitlesButton.defaultProps = {
    subtitlesTracks: Object.freeze([])
};

module.exports = SubtitlesButton;
