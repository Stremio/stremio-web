// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');

const useMetaExtensions = (metaResources) => {
    const tabs = metaResources.filter((metaResource) => metaResource.content.type === 'Ready' && metaResource.content.content.metaExtension !== null && metaResource.addon !== null)
        .map((metaResource) => ({
            id: metaResource.addon.transportUrl,
            label: metaResource.addon.manifest.name,
            logo: metaResource.addon.manifest.logo,
            icon: 'ic_addons',
            onClick: () => { setSelected(metaResource); }
        }));
    const [selected, setSelected] = React.useState(null);
    const closeSelected = React.useCallback(() => {
        setSelected(null);
    }, []);
    return { tabs, selected, closeSelected };
};

module.exports = useMetaExtensions;
