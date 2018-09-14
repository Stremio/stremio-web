import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class Addon extends Component {
    renderLogo() {
        if(this.props.logo.length === 0) {
            return (
                <div className={styles['logo-container']}>
                    <Icon className={styles['logo']} icon={'ic_addons'}/>
                </div>
            );
        }

        return (
            <div className={styles['logo-container']}>
                <Icon className={styles['logo']} icon={this.props.logo}/>
            </div>
        );

    }

    renderName() {
        if(this.props.name.length === 0) {
            return null;
        }

        return (
            <span className={styles['name']}>{this.props.name}</span>
        );
    }

    renderVersion() {
        if(this.props.version.length === 0) {
            return null;
        }

        return (
            <span className={styles['version']}>{'v. ' + this.props.version}</span>
        );
    }

    renderInstalled() {
        if(!this.props.isInstalled) {
            return null;
        }

        return (
            <span className={styles['check-container']}>
                <Icon className={styles['check-icon']} icon={'ic_check'}/> Installed
            </span>
        );
    }

    renderType() {
        var allTypes = this.props.types;

        if(this.props.types.length <= 1) {
            return (
                <div className={styles['type']}>
                    {allTypes.join('')}
                </div>
            );
        }

        return (
            <div className={styles['type']}>
                {allTypes.slice(0, -1).join(', ') + ' & ' + allTypes[allTypes.length - 1]}
            </div>
        );
    }

    renderDescription() {
        if(this.props.description.length === 0) {
            return null;
        }

        return (
            <span className={styles['description']}>{this.props.description}</span>
        );
    }

    renderUrls() {
        if(this.props.urls.length === 0) {
            return null;
        }

        return (
            <div className={styles['urls']}>
                {this.props.urls.map((item, key) => {
                    return (
                        <label className={styles['url-container']}>
                            <input type='checkbox' className={styles['default-checkbox']}/>
                            <p className={styles['checkbox']}>
                                <Icon className={styles['checkmark']} icon={'ic_check'}/>
                            </p>
                            <span key={key} className={styles['url']}>{item}</span>
                        </label>
                    );
                })}
            </div>
        );
    }

    renderShareButton() {
        return (
            <div className={styles['share-container']}>
                <Icon className={styles['share-icon']} icon={'ic_share'}/>
                <span className={styles['share-label']}>SHARE ADD-ON</span>
            </div>
        );
    }

    renderState() {
        if(this.props.isInstalled) {
            return (
                <div className={styles['uninstall-label']}>Uninstall</div>
            );
        }

        return (
            <div className={styles['install-label']}>Install</div>
        );
    }

    render() {
        return (
            <div className={styles['addon']}>
                <div className={styles['info-container']}>
                    {this.renderLogo()}
                    {this.renderName()}
                    {this.renderVersion()}
                    {this.renderInstalled()}
                    {this.renderType()}
                    {this.renderDescription()}
                </div>
                {this.renderUrls()}
                <div className={styles['buttons']}>
                    {this.renderShareButton()}
                    {this.renderState()}
                </div>
            </div>
        );
    }
}

Addon.propTypes = {
    logo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    isInstalled: PropTypes.bool.isRequired,
    types: PropTypes.array.isRequired,
    description: PropTypes.string.isRequired,
    urls: PropTypes.array.isRequired
};
Addon.defaultProps = {
    logo: '',
    name: '',
    version: '',
    isInstalled: false,
    types: [],
    description: '',
    urls: []
};

export default Addon;