import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Popup } from 'stremio-common';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class MetaItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuPopupOpen: false
        };
    }

    onMenuPopupOpen = () => {
        this.setState({ menuPopupOpen: true });
    }

    onMenuPopupClose = () => {
        this.setState({ menuPopupOpen: false });
    }

    onClick = (event) => {
        event.preventDefault();
        if (typeof this.props.onClick === 'function') {
            this.props.onClick();
        }
    }

    renderProgress() {
        if (this.props.progress === 0) {
            return null;
        }

        return (
            <div className={styles['progress-bar-container']}>
                <div className={styles['progress']} style={{ width: `${this.props.progress * 100}%` }} />
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
                {this.renderProgress()}
            </div>
        );
    }

    renderInfoBar() {
        if (this.props.title.length === 0 && this.props.menu.length === 0 && this.props.subtitle.length === 0) {
            return null;
        }

        return (
            <Fragment>
                <div className={styles['title-bar-container']}>
                    <div className={styles['title']}>{this.props.title}</div>
                    {
                        this.props.menu.length > 0 ?
                            <Popup className={this.props.popupClassName} onOpen={this.onMenuPopupOpen} onClose={this.onMenuPopupClose}>
                                <Popup.Label>
                                    <Icon
                                        className={classnames(styles['menu-icon'], { 'active': this.state.menuPopupOpen })}
                                        icon={'ic_more'}
                                    />
                                </Popup.Label>
                                <Popup.Menu>
                                    <div className={styles['menu-items-container']}>
                                        {this.props.menu.map(({ label, callback }) => (
                                            <div key={label} className={styles['menu-item']} onClick={callback}>{label}</div>
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
            <a className={classnames(styles['meta-item-container'], styles[`relative-size-${this.props.relativeSize}`], styles[`poster-shape-${this.props.posterShape}`], this.props.className)} href="#" onClick={this.onClick}>
                {this.renderPoster()}
                {this.renderInfoBar()}
            </a>
        );
    }
}

MetaItem.propTypes = {
    className: PropTypes.string,
    popupClassName: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string.isRequired,
    relativeSize: PropTypes.oneOf(['auto', 'height']).isRequired,
    posterShape: PropTypes.oneOf(['poster', 'landscape', 'square']).isRequired,
    poster: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    released: PropTypes.instanceOf(Date).isRequired,
    menu: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        callback: PropTypes.func.isRequired
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
    menu: Object.freeze([])
};

export default MetaItem;
