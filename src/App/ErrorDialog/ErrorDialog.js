// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Button, Image } = require('stremio/common');
const styles = require('./styles');

const ErrorDialog = ({ className }) => {
    const [dataCleared, setDataCleared] = React.useState(false);
    const reload = React.useCallback(() => {
        window.location.reload();
    }, []);
    const clearData = React.useCallback(() => {
        window.localStorage.clear();
        setDataCleared(true);
    }, []);
    return (
        <div className={classnames(className, styles['error-container'])}>
            <Image
                className={styles['error-image']}
                src={require('/images/empty.png')}
                alt={' '}
            />
            <div className={styles['error-message']}>Something went wrong!</div>
            <div className={styles['buttons-container']}>
                <Button className={styles['button-container']} title={'Try again'} onClick={reload}>
                    <div className={styles['label']}>Try again</div>
                </Button>
                <Button className={styles['button-container']} disabled={dataCleared} title={'Clear data'} onClick={clearData}>
                    <div className={styles['label']}>Clear data</div>
                </Button>
            </div>
        </div>
    );
};

ErrorDialog.displayName = 'ErrorDialog';

ErrorDialog.propTypes = {
    className: PropTypes.string
};

module.exports = ErrorDialog;
