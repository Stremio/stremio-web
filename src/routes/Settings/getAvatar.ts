// Copyright (C) 2017-2026 Smart code 203358507

const getAvatar = (auth: Profile['auth']) => {
    if (!auth) {
        return `url('${require('/assets/images/anonymous.png')}')`;
    }

    if (auth.user.avatar) {
        return `url('${auth.user.avatar}')`;
    }

    return `url('${require('/assets/images/default_avatar.png')}')`;
};

export default getAvatar;
