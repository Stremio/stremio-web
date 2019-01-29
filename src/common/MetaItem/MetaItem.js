import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Popup, Button } from 'stremio-common';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class MetaItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuPopupOpen: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.menuPopupOpen !== this.state.menuPopupOpen ||
            nextProps.className !== this.props.className ||
            nextProps.popupClassName !== this.props.popupClassName ||
            nextProps.id !== this.props.id ||
            nextProps.type !== this.props.type ||
            nextProps.relativeSize !== this.props.relativeSize ||
            nextProps.posterShape !== this.props.posterShape ||
            nextProps.poster !== this.props.poster ||
            nextProps.title !== this.props.title ||
            nextProps.subtitle !== this.props.subtitle ||
            nextProps.progress !== this.props.progress ||
            nextProps.released !== this.props.released ||
            nextProps.menuOptions !== this.props.menuOptions;
    }

    onMenuPopupOpen = () => {
        this.setState({ menuPopupOpen: true });
    }

    onMenuPopupClose = () => {
        this.setState({ menuPopupOpen: false });
    }

    onClick = (event) => {
        if (typeof this.props.onClick === 'function') {
            this.props.onClick(event);
        }
    }

    menuOptionOnSelect = (event) => {
        if (typeof this.props.menuOptionOnSelect === 'function') {
            this.props.menuOptionOnSelect(event);
        }
    }

    renderProgress() {
        if (this.props.progress <= 0) {
            return null;
        }

        return (
            <div className={styles['progress-bar-container']}>
                <div className={styles['progress']} style={{ width: `${Math.min(this.props.progress, 1) * 100}%` }} />
            </div>
        );
    }

    renderPoster() {
        const placeholderIcon = this.props.type === 'tv' ? 'ic_tv'
            : this.props.type === 'series' ? 'ic_series'
                : this.props.type === 'channel' ? 'ic_channels'
                    : 'ic_movies';
        return (
            <div className={styles['poster-image-container']}>
                <Icon className={styles['placeholder-image']} icon={placeholderIcon} />
                <div className={styles['poster-image']} style={{ backgroundImage: `url('${this.props.poster}')` }} />
                <div className={styles['play-icon-container']}>
                    <Icon className={styles['play-icon']} icon={'ic_play'} viewBox={'-291.6 0 1190.6 1024'} />
                </div>
                {this.renderProgress()}
            </div>
        );
    }

    renderInfoBar() {
        if (this.props.title.length === 0 && this.props.subtitle.length === 0 && this.props.menuOptions.length === 0) {
            return null;
        }

        return (
            <Fragment>
                <div className={styles['title-bar-container']}>
                    <div className={styles['title']}>{this.props.title}</div>
                    {
                        this.props.menuOptions.length > 0 ?
                            <Popup className={classnames(styles['menu-popup-container'], this.props.popupClassName)} onOpen={this.onMenuPopupOpen} onClose={this.onMenuPopupClose}>
                                <Popup.Label>
                                    <Icon className={classnames(styles['menu-icon'], { 'active': this.state.menuPopupOpen })} icon={'ic_more'} />
                                </Popup.Label>
                                <Popup.Menu>
                                    <div className={styles['menu-items-container']}>
                                        {this.props.menuOptions.map(({ label, type }) => (
                                            <Button key={type} className={styles['menu-item']} data-meta-item-id={this.props.id} data-menu-option-type={type} onClick={this.menuOptionOnSelect}>{label}</Button>
                                        ))}
                                    </div>
                                </Popup.Menu>
                            </Popup>
                            :
                            null
                    }
                </div>
                {
                    this.props.subtitle.length > 0 ?
                        <div className={styles['title-bar-container']}>
                            <div className={styles['title']}>{this.props.subtitle}</div>
                        </div>
                        :
                        null
                }
            </Fragment>
        );
    }

    render() {
        return (
            <Button className={classnames(styles['meta-item-container'], styles[`relative-size-${this.props.relativeSize}`], styles[`poster-shape-${this.props.posterShape}`], this.props.className)} data-meta-item-id={this.props.id} onClick={this.onClick}>
                {this.renderPoster()}
                {this.renderInfoBar()}
            </Button>
        );
    }
}

MetaItem.propTypes = {
    className: PropTypes.string,
    popupClassName: PropTypes.string,
    onClick: PropTypes.func,
    menuOptionOnSelect: PropTypes.func,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    relativeSize: PropTypes.oneOf(['auto', 'height']).isRequired,
    posterShape: PropTypes.oneOf(['poster', 'landscape', 'square']).isRequired,
    poster: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    released: PropTypes.instanceOf(Date).isRequired,
    menuOptions: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    })).isRequired
};
MetaItem.defaultProps = {
    relativeSize: 'auto',
    posterShape: 'square',
    poster: '',
    title: '',
    subtitle: '',
    progress: 0,
    released: new Date(NaN),
    menuOptions: Object.freeze([])
};

export default MetaItem;
