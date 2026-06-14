// Copyright (C) 2017-2025 Smart code 203358507

import EventEmitter from 'eventemitter3';

type DiscordStatusData = {
    connected: boolean;
};

class Discord {
    private events: EventEmitter;
    private shell: any;
    private onDiscordStatus: ((data: DiscordStatusData) => void) | null = null;

    constructor() {
        this.events = new EventEmitter();
        this.shell = null;
    }

    init(shellService: any): void {
        this.shell = shellService;

        if (this.shell) {
            this.onDiscordStatus = (data: DiscordStatusData) => {
                this.events.emit('availabilityChanged', this.available);
                this.events.emit('statusChanged', data.connected);
            };
            this.shell.on('discord-status', this.onDiscordStatus);
        }
    }

    destroy(): void {
        if (this.shell && this.onDiscordStatus) {
            this.shell.off('discord-status', this.onDiscordStatus);
            this.onDiscordStatus = null;
        }
        this.shell = null;
    }

    connect(): void {
        if (this.shell && this.shell.active) {
            this.shell.send('discord-connect', {});
        }
    }

    disconnect(): void {
        if (this.shell && this.shell.active) {
            this.shell.send('discord-disconnect', {});
        }
    }

    setActivity(state: string, details: string, image?: string | null, startTimestamp?: number | null, endTimestamp?: number | null): void {
        if (this.shell && this.shell.active) {
            this.shell.send('discord-set-activity', {
                state,
                details,
                image: image || null,
                startTimestamp: startTimestamp || null,
                endTimestamp: endTimestamp || null
            });
        }
    }

    clearActivity(): void {
        if (this.shell && this.shell.active) {
            this.shell.send('discord-clear-activity', {});
        }
    }

    get available(): boolean {
        return this.shell && this.shell.active;
    }

    on(name: string, listener: (data: any) => void): void {
        this.events.on(name, listener);
    }

    off(name: string, listener: (data: any) => void): void {
        this.events.off(name, listener);
    }
}

export default Discord;
