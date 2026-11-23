// Copyright (C) 2017-2026 Smart code 203358507

const isTraktAuthenticated = (profile: Profile) => {
    const trakt = profile?.auth?.user?.trakt;
    return !!trakt && (Date.now() / 1000) < (trakt.created_at + trakt.expires_in);
};

export default isTraktAuthenticated;
