// Copyright (C) 2017-2023 Smart code 203358507

const {
  normalizePlaybackSegments,
  findActivePlaybackSegment,
} = require("../src/routes/Player/playbackSegments");

describe("normalizePlaybackSegments", () => {
  it("returns empty array when stream is missing", () => {
    expect(normalizePlaybackSegments(null)).toEqual([]);
  });

  it("parses intro and credits in seconds to ms", () => {
    const stream = {
      behaviorHints: {
        segments: [
          { type: "intro", start: 52, end: 110 },
          { type: "credits", start: 2400, end: 2600 },
        ],
      },
    };
    expect(normalizePlaybackSegments(stream)).toEqual([
      { type: "intro", start: 52000, end: 110000 },
      { type: "credits", start: 2400000, end: 2600000 },
    ]);
  });

  it("drops invalid segments", () => {
    const stream = {
      behaviorHints: {
        segments: [
          { type: "intro", start: 10, end: 5 },
          { type: "recap", start: 0, end: 1 },
          { type: "intro", start: 1, end: 2 },
        ],
      },
    };
    expect(normalizePlaybackSegments(stream)).toEqual([
      { type: "intro", start: 1000, end: 2000 },
    ]);
  });
});

describe("findActivePlaybackSegment", () => {
  const segments = [
    { type: "intro", start: 52000, end: 110000 },
    { type: "credits", start: 2400000, end: 2600000 },
  ];

  it("returns null when time is invalid", () => {
    expect(findActivePlaybackSegment(null, segments)).toBeNull();
  });

  it("detects intro", () => {
    expect(findActivePlaybackSegment(60000, segments)).toEqual(segments[0]);
  });

  it("detects credits", () => {
    expect(findActivePlaybackSegment(2500000, segments)).toEqual(segments[1]);
  });

  it("prioritizes credits over intro when both ranges match", () => {
    const overlap = [
      { type: "intro", start: 0, end: 100000 },
      { type: "credits", start: 50000, end: 150000 },
    ];
    expect(findActivePlaybackSegment(80000, overlap)).toEqual(overlap[1]);
  });
});
