// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const ReactIs = require('react-is');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const Button = require('stremio/common/Button');
const CONSTANTS = require('stremio/common/CONSTANTS');
const MetaRowPlaceholder = require('./MetaRowPlaceholder');
const styles = require('./styles');

const MetaRow = ({ className, title, message, items, itemComponent, deepLinks }) => {
    const { t } = useTranslation();
    return (
        <div className={classnames(className, styles['meta-row-container'])}>
            {
                (typeof title === 'string' && title.length > 0) || (deepLinks && (typeof deepLinks.discover === 'string' || typeof deepLinks.library === 'string')) ?
                    <div className={styles['header-container']}>
                        {
                            typeof title === 'string' && title.length > 0 ?
                                <div className={styles['title-container']} title={title}>{title}</div>
                                :
                                null
                        }
                        {
                            deepLinks && (typeof deepLinks.discover === 'string' || typeof deepLinks.library === 'string') ?
                                <Button className={styles['see-all-container']} title={t('BUTTON_SEE_ALL')} href={deepLinks.discover || deepLinks.library} tabIndex={-1}>
                                    <div className={styles['label']}>{ t('BUTTON_SEE_ALL') }</div>
                                    <Icon className={styles['icon']} name={'chevron-forward'} />
                                </Button>
                                :
                                null
                        }
                    </div>
                    :
                    null
            }
            {
                typeof message === 'string' && message.length > 0 ?
                    <div className={styles['message-container']} title={message}>{message}</div>
                    :
                    <div className={styles['meta-items-container']}>
                        {
                            ReactIs.isValidElementType(itemComponent) ?
                                items.slice(0, CONSTANTS.CATALOG_PREVIEW_SIZE).map((item, index) => {
                                    return React.createElement(itemComponent, {
                                        ...item,
                                        key: index,
                                        className: classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${item.posterShape}`])
                                    });
                                })
                                :
                                null
                        }
                        {Array(Math.max(0, CONSTANTS.CATALOG_PREVIEW_SIZE - items.length)).fill(null).map((_, index) => (
                            <div key={index} className={classnames(styles['meta-item'], styles['poster-shape-poster'])} />
                        ))}
                    </div>
            }
        </div>
    );
};

MetaRow.Placeholder = MetaRowPlaceholder;

MetaRow.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        posterShape: PropTypes.string
    })),
    itemComponent: PropTypes.elementType,
    deepLinks: PropTypes.shape({
        discover: PropTypes.string,
        library: PropTypes.string
    })
};

module.exports = MetaRow;
