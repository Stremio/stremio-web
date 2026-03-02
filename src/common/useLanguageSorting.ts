import { useMemo } from 'react';
import interfaceLanguages from 'stremio/common/interfaceLanguages.json';

const useLanguageSorting = (options: MultiselectMenuOption[]) => {
    const userLangCode = useMemo(() => {
        const lang = interfaceLanguages.find((l) => l.codes.includes(navigator.language || 'en-US'));
        if (lang) {
            const threeLetter = lang.codes[1] || 'eng';
            const fullLocale = navigator.language || 'en-US';
            return [threeLetter, fullLocale];
        }
        return ['eng'];
    }, []);

    const isLanguageDropdown = useMemo(() => {
        return options?.some((opt) => interfaceLanguages.some((l) => l.name === opt.label));
    }, [options]);

    const sortedOptions = useMemo(() => {
        const matchingIndex = options.findIndex((opt) => {
            const lang = interfaceLanguages.find((l) => l.name === opt.label);
            return userLangCode.some((code) => lang?.codes.includes(code));
        });

        if (matchingIndex === -1) {
            return [...options].sort((a, b) => a.label.localeCompare(b.label));
        }

        const matchingOption = options[matchingIndex];
        const otherOptions = options.filter((_, idx) => idx !== matchingIndex).sort((a, b) => a.label.localeCompare(b.label));

        return [matchingOption, ...otherOptions];
    }, [options, userLangCode, isLanguageDropdown]);

    return { userLangCode, isLanguageDropdown, sortedOptions };
};

export default useLanguageSorting;
