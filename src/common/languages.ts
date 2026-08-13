import langs from 'langs';

const all = langs.all().map((lang) => ({
    ...lang,
    code: lang['2'],
    label: lang.local,
    alpha2: lang['1'],
    alpha3: [lang['2'], lang['2B'], lang['2T'], lang['3']],
    ietf: lang['ietf'],
}));

const find = (code: string) => {
    return all.find(({ alpha2, alpha3, ietf }) => [alpha2, ...alpha3, ietf].includes(code));
};

const toCode = (code: string) => {
    const language = find(code);
    return language?.[2] ?? code;
};

const label = (code: string) => {
    const language = find(code);
    return language?.label ?? code;
};

export {
    all,
    find,
    toCode,
    label,
};
