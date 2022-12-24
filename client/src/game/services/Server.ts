import { Client, Room } from 'colyseus.js';
import { Schema } from '@colyseus/schema';
import Phaser from 'phaser';
import { EventEmitter } from 'events';

import ITicTacToeState from '../../../../types/ITicTacToeState';
import { Message } from '../../../../types/messages';

// class CustomEventEmitter extends EventEmitter {};

export default class Server {
    private client: Client;
    // private events: Phaser.Events.EventEmitter;

    private eventEmitter = new EventEmitter();

    private room?: Room<ITicTacToeState & Schema>;

    constructor () {
        this.client = new Client('ws://localhost:2567');
        // this.events = new Phaser.Events.EventEmitter();
    }

    async join() {
        this.room = await this.client.joinOrCreate<ITicTacToeState & Schema>('tic-tac-toe');
        
        this.room.onStateChange.once(state => {
            this.eventEmitter.emit("once-state-changed", state);
        });
        
        this.room.onStateChange(state => {
            this.eventEmitter.emit("on-state-changed", state);
        });
    }

    makeSelection(idx: number) {
        if (!this.room) return;

        this.room.send(Message.PlayerSelection, { index: idx })
    }

    onceStateChanged(cb: (state: ITicTacToeState) => void) {
        this.eventEmitter.once("once-state-changed", cb);
    }

    onStateChanged(cb: (state: ITicTacToeState) => void) {
        this.eventEmitter.on("on-state-changed", cb);
    }

}