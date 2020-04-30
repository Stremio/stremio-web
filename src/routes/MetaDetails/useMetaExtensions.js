// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');

const useMetaExtensions = (metaResources) => {
    const tabs = metaResources.filter((metaResource) => metaResource.content.type === 'Ready' && metaResource.content.content.metaExtensions.length > 0 && metaResource.addon !== null)
        .map((metaResource) => {
            return metaResource.content.content.metaExtensions.map((metaExtension) => {
                const tab = {
                    id: metaExtension.url,
                    label: metaResource.addon.manifest.name,
                    logo: metaResource.addon.manifest.logo,
                    icon: 'ic_addons',
                    metaExtension: metaExtension,
                    onClick: () => { setSelected(tab); }
                };
                return tab;
            });
        })
        .flat(2)
        .filter((tab, index, tabs) => tabs.findIndex((_tab) => _tab.id === tab.id) === index);
    const [selected, setSelected] = React.useState(null);
    const clearSelected = React.useCallback(() => {
        setSelected(null);
    }, []);
    return { tabs, selected, clearSelected };
};

module.exports = useMetaExtensions;
