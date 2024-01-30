// Copyright (C) 2017-2023 Smart code 203358507

const { useCallback } = require('react');
const { useTranslation } = require('react-i18next');

const useTranslate = () => {
    const { t } = useTranslation();

    const string = useCallback((key) => t(key), [t]);

    const stringWithPrefix = useCallback((value, prefix, fallback = null) => {
        const key = `${prefix}${value}`;
        const defaultValue = fallback ?? value.charAt(0).toUpperCase() + value.slice(1);

        return t(key, {
            defaultValue,
        });
    }, [t]);

    const catalogTitle = useCallback(({ addon, id, name, type } = {}, withType = true) => {
        if (addon && id && name) {
            const partialKey = `${addon.manifest.id.replaceAll('.', '_')}_${id}`;
            const translatedName = stringWithPrefix(partialKey, 'CATALOG_', name);

            if (type && withType) {
                const translatedType = stringWithPrefix(type, 'TYPE_');
                return `${translatedName} - ${translatedType}`;
            }

            return translatedName;
        }

        return null;
    }, [stringWithPrefix]);

    return {
        string,
        stringWithPrefix,
        catalogTitle,
    };
};

module.exports = useTranslate;
