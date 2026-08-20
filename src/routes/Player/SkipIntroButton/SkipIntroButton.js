// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button } = require('stremio/components');
const { useTranslation } = require('react-i18next');
const styles = require('./styles');

const SkipIntroButton = ({ className, onClick }) => {
    const { t } = useTranslation();
    const onClickButton = React.useCallback(() => {
        if (typeof onClick === 'function') {
            onClick();
        }
    }, [onClick]);

    return (
        <div className={classnames(className, styles['skip-intro-container'])}>
            <Button className={styles['skip-intro-button']} onClick={onClickButton}>
                <Icon className={styles['icon']} name={'next'} />
                <div className={styles['label']}>{t('PLAYER_SKIP_INTRO', 'Skip Intro')}</div>
            </Button>
        </div>
    );
};

SkipIntroButton.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
};

module.exports = SkipIntroButton;
