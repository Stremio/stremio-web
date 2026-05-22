// Copyright (C) 2017-2025 Smart code 203358507

import EventEmitter from 'eventemitter3';

type DiscordStatusData = {
    connected: boolean;
};

class Discord {
    private events: EventEmitter;
    private shell: any;

    constructor() {
        this.events = new EventEmitter();
        this.shell = null;
    }

    init(shellService: any): void {
        this.shell = shellService;

        if (this.shell) {
            this.shell.on('stateChanged', () => {
                this.events.emit('availabilityChanged', this.available);
            });
        }

        if (this.shell) {
            this.shell.on('discord-status', (data: DiscordStatusData) => {
                this.events.emit('statusChanged', data.connected);
            });
        }
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

    setActivity(state: string, details: string, image?: string | null, startTimestamp?: number | null): void {
        if (this.shell && this.shell.active) {
            this.shell.send('discord-set-activity', {
                state,
                details,
                image: image || null,
                startTimestamp: startTimestamp || null
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
