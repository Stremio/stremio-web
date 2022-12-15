// Copyright (C) 2017-2022 Smart code 203358507

const { t } = require('i18next');

const translateOption = (option, translateKeyPrefix = '') => {
    const translateKey = `${translateKeyPrefix}${option}`;
    const translateKeyUppercase = translateKey.toUpperCase();
    const translateValue = t(translateKey);
    const translateValueUppercase = t(translateKeyUppercase);
    if (translateKey !== translateValue) {
        return translateValue;
    } else if (translateKeyUppercase !== translateValueUppercase) {
        return translateValueUppercase;
    }
    return option.charAt(0).toUpperCase() + option.slice(1);
};

module.exports = translateOption;
