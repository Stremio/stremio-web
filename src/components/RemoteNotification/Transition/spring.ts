// Copyright (C) 2017-2026 Smart code 203358507

const STEP = 1000 / 60;
const REST = 0.0015;
const LIMIT = 180;

const createSpring = (response: number, damping: number) => {
    const omega = 2 * Math.PI / response;
    const decay = Math.min(1, damping) * omega;
    const frequency = omega * Math.sqrt(Math.max(0, 1 - damping * damping));
    const at = (time: number) => (
        frequency === 0 ?
            Math.exp(-decay * time) * (1 + decay * time)
            :
            Math.exp(-decay * time) * (Math.cos(frequency * time) + decay / frequency * Math.sin(frequency * time))
    );
    const left = [1];
    while (left.length < LIMIT && Math.exp(-decay * left.length * STEP) * (1 + decay * left.length * STEP) > REST) {
        left.push(at(left.length * STEP));
    }

    left.push(0);
    return { duration: (left.length - 1) * STEP, left };
};

type Spring = ReturnType<typeof createSpring>;

export type { Spring };

export default createSpring;
