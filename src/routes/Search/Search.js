// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Image, MainNavBars, MetaRow, MetaItem, withCoreSuspender, getVisibleChildrenRange } = require('stremio/common');
const useSearch = require('./useSearch');
const styles = require('./styles');

const THRESHOLD = 100;

const Search = ({ queryParams }) => {
    const { t } = useTranslation();
    const [search, loadSearchRows] = useSearch(queryParams);
    const query = React.useMemo(() => {
        return search.selected !== null ?
            search.selected.extra.reduceRight((query, [name, value]) => {
                if (name === 'search') {
                    return value;
                }

                return query;
            }, null)
            :
            null;
    }, [search.selected]);
    const scrollContainerRef = React.useRef();
    const onVisibleRangeChange = React.useCallback(() => {
        if (search.catalogs.length === 0) {
            return;
        }

        const range = getVisibleChildrenRange(scrollContainerRef.current, THRESHOLD);
        if (range === null) {
            return;
        }

        loadSearchRows(range);
    }, [search.catalogs]);
    const onScroll = React.useCallback(debounce(onVisibleRangeChange, 250), [onVisibleRangeChange]);
    React.useLayoutEffect(() => {
        onVisibleRangeChange();
    }, [search.catalogs, onVisibleRangeChange]);
    return (
        <MainNavBars className={styles['search-container']} route={'search'} query={query}>
            <div ref={scrollContainerRef} className={styles['search-content']} onScroll={onScroll}>
                {
                    query === null ?
                        <div className={classnames(styles['search-hints-wrapper'])}>
                            <div className={classnames(styles['search-hints-title-container'], 'animation-fade-in')}>
                                <div className={styles['search-hints-title']}>{t('SEARCH_ANYTHING')}</div>
                            </div>
                            <div className={classnames(styles['search-hints-container'], 'animation-fade-in')}>
                                <div className={styles['search-hint-container']}>
                                    <Icon className={styles['icon']} name={'trailer'} />
                                    <div className={styles['label']}>{t('SEARCH_CATEGORIES')}</div>
                                </div>
                                <div className={styles['search-hint-container']}>
                                    <Icon className={styles['icon']} name={'actors'} />
                                    <div className={styles['label']}>{t('SEARCH_PERSONS')}</div>
                                </div>
                                <div className={styles['search-hint-container']}>
                                    <Icon className={styles['icon']} name={'link'} />
                                    <div className={styles['label']}>{t('SEARCH_PROTOCOLS')}</div>
                                </div>
                                <div className={styles['search-hint-container']}>
                                    <Icon className={styles['icon']} name={'imdb-outline'} />
                                    <div className={styles['label']}>{t('SEARCH_TYPES')}</div>
                                </div>
                            </div>
                        </div>
                        :
                        search.catalogs.length === 0 ?
                            <div className={styles['message-container']}>
                                <Image
                                    className={styles['image']}
                                    src={require('/images/empty.png')}
                                    alt={' '}
                                />
                                <div className={styles['message-label']}>{ t('STREMIO_TV_SEARCH_NO_ADDONS') }</div>
                            </div>
                            :
                            search.catalogs.map((catalog, index) => {
                                switch (catalog.content?.type) {
                                    case 'Ready': {
                                        return (
                                            <MetaRow
                                                key={index}
                                                className={classnames(styles['search-row'], styles[`search-row-${catalog.content.content[0].posterShape}`], 'animation-fade-in')}
                                                catalog={catalog}
                                                itemComponent={MetaItem}
                                            />
                                        );
                                    }
                                    case 'Err': {
                                        return (
                                            <MetaRow
                                                key={index}
                                                className={classnames(styles['search-row'], 'animation-fade-in')}
                                                catalog={catalog}
                                                message={catalog.content.content}
                                            />
                                        );
                                    }
                                    default: {
                                        return (
                                            <MetaRow.Placeholder
                                                key={index}
                                                className={classnames(styles['search-row'], styles['search-row-poster'], 'animation-fade-in')}
                                                catalog={catalog}
                                            />
                                        );
                                    }
                                }
                            })
                }
            </div>
        </MainNavBars>
    );
};

Search.propTypes = {
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

const SearchFallback = ({ queryParams }) => (
    <MainNavBars className={styles['search-container']} route={'search'} query={queryParams.get('search') ?? queryParams.get('query')} />
);

SearchFallback.propTypes = Search.propTypes;

module.exports = withCoreSuspender(Search, SearchFallback);
