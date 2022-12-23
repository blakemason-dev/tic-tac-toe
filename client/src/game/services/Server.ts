import { Client } from 'colyseus.js';
import Phaser from 'phaser';

import ITicTacToeState from '../../../../types/ITicTacToeState';

export default class Server {
    private client: Client;
    private events: Phaser.Events.EventEmitter;

    constructor () {
        this.client = new Client('ws://localhost:2567');
        this.events = new Phaser.Events.EventEmitter();
    }

    async join() {
        const room = await this.client.joinOrCreate<ITicTacToeState>('tic-tac-toe');
        
        room.onStateChange.once(state => {
            this.events.emit("once-state-changed", state);
        })
    }

    onceStateChanged(cb: (state: ITicTacToeState) => void, context?: any) {
        this.events.once("once-state-changed", cb, context);
    }
}