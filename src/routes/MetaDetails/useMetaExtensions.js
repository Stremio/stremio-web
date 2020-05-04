// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');

const useMetaExtensions = (metaResources) => {
    const tabs = React.useMemo(() => {
        return metaResources.filter((metaResource) => metaResource.content.type === 'Ready' && metaResource.content.content.metaExtensions.length > 0 && metaResource.addon !== null)
            .map((metaResource) => {
                return metaResource.content.content.metaExtensions.map((metaExtension) => (
                    {
                        id: metaExtension.url,
                        label: metaResource.addon.manifest.name,
                        logo: metaResource.addon.manifest.logo,
                        icon: 'ic_addons',
                        onClick: () => { setSelectedMetaExtension(metaExtension); }
                    }
                ));
            })
            .flat(2)
            .filter((tab, index, tabs) => tabs.findIndex((_tab) => _tab.id === tab.id) === index);
    }, [metaResources]);
    const [selectedMetaExtension, setSelectedMetaExtension] = React.useState(null);
    const clearSelectedMetaExtension = React.useCallback(() => {
        setSelectedMetaExtension(null);
    }, []);
    return { tabs, selectedMetaExtension, clearSelectedMetaExtension };
};

module.exports = useMetaExtensions;
