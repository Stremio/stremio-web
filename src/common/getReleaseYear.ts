// Copyright (C) 2017-2026 Smart code 203358507

const getReleaseYear = (released: Date | string | null | undefined): string | null => {
    const date = released instanceof Date ? released : typeof released === 'string' && released.length > 0 ? new Date(released) : null;
    return date !== null && !Number.isNaN(date.getTime()) ? String(date.getFullYear()) : null;
};

export default getReleaseYear;
