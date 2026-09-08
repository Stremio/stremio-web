// Copyright (C) 2017-2023 Smart code 203358507

export type ThumbnailCue = {
    start: number,
    end: number,
    url: string,
    x: number,
    y: number,
    w: number,
    h: number,
};

function parseVttTimestamp(t: string): number {
    const segments = t.trim().split(':').map((s) => parseFloat(s.trim()));
    if (segments.length < 2 || segments.some((n) => Number.isNaN(n))) {
        return 0;
    }
    const [a, b, c = 0] = segments;
    return segments.length === 2 ? a * 60 + b : a * 3600 + b * 60 + c;
}

function parseThumbnailVtt(text: string): ThumbnailCue[] {
    const cues: ThumbnailCue[] = [];
    const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const blocks = normalized.split(/\n\n+/);

    for (const raw of blocks) {
        const block = raw.trim();
        if (block.length === 0 || block === 'WEBVTT' || block.startsWith('WEBVTT\n') || block.startsWith('NOTE')) {
            continue;
        }
        const lines = block.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
        if (lines.length < 2) {
            continue;
        }
        let i = 0;
        if (!lines[0].includes('-->')) {
            if (lines[1].includes('-->')) {
                i = 1;
            } else {
                continue;
            }
        }
        const timeLine = lines[i];
        const arrow = timeLine.indexOf('-->');
        if (arrow === -1) {
            continue;
        }
        const startStr = timeLine.slice(0, arrow).trim();
        const endStr = timeLine.slice(arrow + 3).trim().split(/\s/)[0];
        const start = parseVttTimestamp(startStr);
        const end = parseVttTimestamp(endStr);
        const imageLine = lines.slice(i + 1).join('\n').trim();
        if (!imageLine.length) {
            continue;
        }
        const xywhMatch = imageLine.match(/#xywh=(\d+),(\d+),(\d+),(\d+)/);
        let url = imageLine;
        let x = 0;
        let y = 0;
        let w = 0;
        let h = 0;
        if (xywhMatch) {
            url = imageLine.slice(0, imageLine.indexOf('#'));
            x = parseInt(xywhMatch[1], 10);
            y = parseInt(xywhMatch[2], 10);
            w = parseInt(xywhMatch[3], 10);
            h = parseInt(xywhMatch[4], 10);
        }
        cues.push({ start, end, url, x, y, w, h });
    }

    cues.sort((a, b) => a.start - b.start);
    return cues;
}

function findThumbnailCue(cues: ThumbnailCue[], time: number): ThumbnailCue | null {
    if (cues.length === 0) {
        return null;
    }
    for (const c of cues) {
        if (time >= c.start && time < c.end) {
            return c;
        }
    }
    if (time < cues[0].start) {
        return cues[0];
    }
    const last = cues[cues.length - 1];
    if (time >= last.end) {
        return last;
    }
    return null;
}

export { parseThumbnailVtt, findThumbnailCue };
