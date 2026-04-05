// Copyright (C) 2017-2023 Smart code 203358507

let batchAddonUpdateEventsMuted = false;

export function setBatchAddonUpdateEventsMuted(value: boolean): void {
    batchAddonUpdateEventsMuted = Boolean(value);
}

export function isBatchAddonUpdateEventsMuted(): boolean {
    return batchAddonUpdateEventsMuted;
}
