// Copyright (C) 2017-2023 Smart code 203358507

const { t } = require('i18next');

const translateCatalog = ({ addon, id, name, type } = {}, withType = true) => {
    if (addon && id && name) {
        const label = `${addon.manifest.id}/${id}`;
        const translatedName = t(`CATALOG_${label}`, { defaultValue: name });
        if (type && withType) {
            const translatedType = t(`TYPE_${type}`, { defaultValue: type });
            return `${translatedName} - ${translatedType}`;
        }
        return translatedName;
    }
    return null;
};

module.exports = translateCatalog;
