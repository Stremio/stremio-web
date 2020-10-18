// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const UrlUtils = require('url');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const init = () => ({
    selected: null,
    selectable: {
        types: [],
        catalogs: [],
        extra: [],
        prev_page: null,
        next_page: null
    },
    catalog: null,
    default_request: null,
    page: 1,
});

const map = (discover) => ({
    ...discover,
    catalog: discover.catalog !== null && discover.catalog.content.type === 'Ready' ?
        {
            ...discover.catalog,
            content: {
                ...discover.catalog.content,
                content: discover.catalog.content.content.map((metaItem) => ({
                    type: metaItem.type,
                    name: metaItem.name,
                    logo: metaItem.logo,
                    poster: metaItem.poster,
                    posterShape: metaItem.posterShape === 'landscape' ? 'square' : metaItem.posterShape,
                    runtime: metaItem.runtime,
                    releaseInfo: metaItem.releaseInfo,
                    released: new Date(typeof metaItem.released === 'string' ? metaItem.released : NaN),
                    description: metaItem.description,
                    trailerStreams: metaItem.trailerStreams,
                    deepLinks: metaItem.deep_links
                }))
            }
        }
        :
        discover.catalog
});

const useDiscover = (urlParams, queryParams) => {
    const { core } = useServices();
    const action = React.useMemo(() => {
        if (typeof urlParams.transportUrl === 'string' && typeof urlParams.type === 'string' && typeof urlParams.catalogId === 'string') {
            const { hostname } = UrlUtils.parse(urlParams.transportUrl);
            if (typeof hostname === 'string' && hostname.length > 0) {
                return {
                    action: 'Load',
                    args: {
                        model: 'CatalogWithFilters',
                        args: {
                            request: {
                                base: urlParams.transportUrl,
                                path: {
                                    resource: 'catalog',
                                    type: urlParams.type,
                                    id: urlParams.catalogId,
                                    extra: Array.from(queryParams.entries())
                                }
                            }
                        }
                    }
                };
            }
        } else {
            const discover = core.transport.getState('discover');
            if (discover.default_request !== null) {
                return {
                    action: 'Load',
                    args: {
                        model: 'CatalogWithFilters',
                        args: {
                            request: discover.default_request
                        }
                    }
                };
            }
        }

        return {
            action: 'Unload'
        };
    }, [urlParams, queryParams]);
    return useModelState({ model: 'discover', action, map, init });
};

module.exports = useDiscover;
