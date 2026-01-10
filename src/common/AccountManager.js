// Copyright (C) 2017-2026 Smart code 203358507

const STORAGE_KEY = 'stremio-multi-accounts';

const AccountManager = {
    getAccounts: () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (_e) {
            return [];
        }
    },

    addAccount: (profile, authKey, settings = null) => {
        try {
            const accounts = AccountManager.getAccounts();
            const existing = accounts.find((a) => a.email === profile.email);
            const filtered = accounts.filter((a) => a.email !== profile.email);

            const newAccount = {
                email: profile.email,
                avatar: profile.avatar,
                authKey: authKey,
                settings: settings || existing?.settings || null,
                lastActive: Date.now()
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify([...filtered, newAccount]));
        } catch (_e) {
            console.error('Failed to add account', _e);
        }
    },

    updateSettings: (email, settings) => {
        try {
            const accounts = AccountManager.getAccounts();
            const updated = accounts.map((a) =>
                a.email === email ? { ...a, settings } : a
            );
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (_e) {
            console.error('Failed to update settings', _e);
        }
    },

    getSettings: (email) => {
        const accounts = AccountManager.getAccounts();
        const account = accounts.find((a) => a.email === email);
        return account?.settings || null;
    },

    removeAccount: (email) => {
        try {
            const accounts = AccountManager.getAccounts();
            const filtered = accounts.filter((a) => a.email !== email);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        } catch (_e) {
            console.error('Failed to remove account', _e);
        }
    },

    switchTo: (email) => {
        const accounts = AccountManager.getAccounts();
        const target = accounts.find((a) => a.email === email);
        if (target && target.authKey) {
            let updatedTarget = target;
            const updatedAccounts = accounts.map((a) => {
                if (a.email === email) {
                    const newAccount = { ...a, lastActive: Date.now() };
                    updatedTarget = newAccount;
                    return newAccount;
                }
                return a;
            });
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
            } catch (_e) {
                console.error('Failed to switch account', _e);
            }
            return updatedTarget;
        }
        return null;
    }
};

module.exports = AccountManager;