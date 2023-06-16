// Copyright (C) 2017-2023 Smart code 203358507

const { t } = require('i18next');

const translateOption = (option, translateKeyPrefix = '') => {
    const translateKey = `${translateKeyPrefix}${option}`;
    const translateValue = t(translateKey, {
        defaultValue: t(translateKey.toUpperCase(), {
            defaultValue: null
        })
    });
    return translateValue ?? option.charAt(0).toUpperCase() + option.slice(1);
};

module.exports = translateOption;
