// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect, useMemo, useState } from 'react';
import { useCore } from 'stremio/core';
import { useModelState } from 'stremio/common';

// What the strip on a Continue Watching card says about a series, if anything:
//
//   episodes aired since the last watch (the +N tag)   → nothing, the tag has the floor
//   the latest aired episode, no pull run since         → "S13E1423 · yesterday"
//   the first episode dated today or later              → "S13E1423 · in 2 days"
//   otherwise                                           → nothing
//
// Dates come from the core's own `calendar` model: the same `calendar-videos` request the
// Calendar screen makes, one per add-on for the whole library. The core keeps the response and
// re-buckets it per month, so walking the previous, current and next month costs one request;
// Unload makes it forget the response, which is how a changed row gets fresh dates. The core
// re-asks the add-ons for new episodes at most every six hours, so right after an episode airs
// the +N tag lags; until a pull has run after that day the strip announces the episode itself.

const MODEL = 'calendar';
const MONTH_OFFSETS = [-1, 0, 1];
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export type NextEpisode = {
    season?: number,
    episode?: number,
    // whole days from today to the episode's day, negative once it aired
    days: number,
    // aired, but the core has not counted it yet, so the +N tag is not there to say so
    aired: boolean,
};

// A Continue Watching item as the bridge sends it (serialize_continue_watching_preview.rs)
type Item = { _id: string, type: string, state: { videoId: string | null } };
type Catalog = { items: Item[] };
type WithNextEpisode<T extends Catalog> = Omit<T, 'items'> & { items: (T['items'][number] & { nextEpisode: NextEpisode | null })[] };
type YearMonth = { year: number, month: number };
// `date`: UTC midnight of the day the core bucketed the episode in, in ms
type Episode = { videoId: string, season?: number, episode?: number, date: number };
type Walk = { key: string, months: YearMonth[], buckets: Record<string, CalendarItem[]> };

const utcDay = (date: Date) => Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

const monthKey = ({ year, month }: YearMonth) => `${year}-${month}`;

const monthsAround = (today: Date): YearMonth[] => MONTH_OFFSETS.map((offset) => {
    const first = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return { year: first.getFullYear(), month: first.getMonth() + 1 };
});

const load = (args: YearMonth) => ({ action: 'Load', args: { model: 'Calendar', args } });

const toEpisodes = (buckets: CalendarItem[][]): Episode[] => buckets.flat().flatMap(({ date, items }) => items.map(({ id, season, episode }) => ({
    videoId: id,
    season,
    episode,
    date: Date.UTC(date.year, date.month - 1, date.day),
})));

const nextEpisode = (item: Item, episodes: Episode[], notifications: Notifications, today: Date): NextEpisode | null => {
    if ((notifications.items?.[item._id]?.length ?? 0) > 0) {
        return null;
    }
    const todayDay = utcDay(today);
    const describe = ({ season, episode, date }: Episode, aired: boolean): NextEpisode => ({ season, episode, days: Math.round((date - todayDay) / DAY_MS), aired });
    // this series' episodes, oldest first, minus the one the user is on
    const own = episodes
        .filter(({ videoId }) => videoId.startsWith(`${item._id}:`) && videoId !== item.state.videoId)
        .sort((a, b) => a.date - b.date);
    const lastPull = notifications.lastUpdated ? Date.parse(notifications.lastUpdated) : 0;
    const latest = own.filter(({ date }) => date < todayDay).pop();
    if (latest && lastPull < latest.date + DAY_MS) {
        return describe(latest, true);
    }
    const upcoming = own.find(({ date }) => date >= todayDay);
    return upcoming ? describe(upcoming, false) : null;
};

// `today` as state, so the strips age ("in 2 days", "tomorrow") on a screen that stays open.
const useToday = () => {
    const [today, setToday] = useState(() => new Date());
    useEffect(() => {
        const interval = setInterval(() => setToday(new Date()), HOUR_MS);
        return () => clearInterval(interval);
    }, []);
    return today;
};

// The calendar's dated episodes for `key` (the row's series plus the month). A new key starts
// over; an empty one loads nothing. The model is shared with the Calendar screen: useModelState
// only listens while the Board is the active route, and if that screen empties the model on its
// way out, the walk resumes from the first month it still misses.
const useLibraryCalendar = (key: string): Episode[] => {
    const core = useCore();
    const calendar = useModelState({ model: MODEL, action: null }) as Calendar;
    const [walk, setWalk] = useState<Walk>({ key: '', months: [], buckets: {} });

    // Start over: drop what we had and make the core drop its response.
    useEffect(() => {
        setWalk({ key, months: [], buckets: {} });
        if (key) {
            core.transport.dispatch({ action: 'Unload' }, MODEL);
        }
    }, [key, core.transport]);

    // Walk the months: once the model is empty ask for the first one; keep each month that
    // comes back ready and ask for the next one still missing.
    useEffect(() => {
        if (!key || walk.key !== key || calendar.metaItems.some(({ type }) => type === 'Loading')) {
            return;
        }
        const { months, buckets } = walk;
        const selected = calendar.selected;
        if (months.length === 0) {
            if (selected === null) {
                const next = monthsAround(new Date());
                setWalk({ key, months: next, buckets });
                core.transport.dispatch(load(next[0]), MODEL);
            }
            return;
        }
        const current = selected !== null && months.some((month) => monthKey(month) === monthKey(selected)) ? monthKey(selected) : null;
        const stored = current !== null && !buckets[current] ? { ...buckets, [current]: calendar.items } : null;
        if (stored !== null) {
            setWalk({ key, months, buckets: stored });
        }
        const missing = months.find((month) => !(stored ?? buckets)[monthKey(month)]);
        if (missing && (stored !== null || current === null)) {
            core.transport.dispatch(load(missing), MODEL);
        }
    }, [key, walk, calendar, core.transport]);

    return useMemo(() => toEpisodes(Object.values(walk.buckets)), [walk.buckets]);
};

// The Continue Watching catalog with `nextEpisode` set on every item.
const useNextEpisodes = <T extends Catalog>(catalog: T, notifications: Notifications): WithNextEpisode<T> => {
    const today = useToday();
    // The calendar is fetched again when the series in the row or the month change; order and
    // movies do not count, so playing something else does not refetch.
    const key = useMemo(() => {
        const ids = catalog.items.filter(({ type }) => type !== 'movie').map(({ _id }) => _id).sort();
        return ids.length > 0 ? [today.getFullYear(), today.getMonth(), ...ids].join(',') : '';
    }, [catalog.items, today]);
    const episodes = useLibraryCalendar(key);
    return useMemo(() => ({
        ...catalog,
        items: catalog.items.map((item) => ({ ...item, nextEpisode: nextEpisode(item, episodes, notifications, today) })),
    }), [catalog, episodes, notifications, today]);
};

export default useNextEpisodes;
