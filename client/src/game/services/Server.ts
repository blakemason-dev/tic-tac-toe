import { Client, Room } from 'colyseus.js';
import { Schema } from '@colyseus/schema';
import Phaser from 'phaser';
import { EventEmitter } from 'events';

import ITicTacToeState from '../../../../types/ITicTacToeState';
import { Message } from '../../../../types/messages';

export default class Server {
    private client: Client;

    private eventEmitter = new EventEmitter();

    private room?: Room<ITicTacToeState & Schema>;

    constructor () {
        this.client = new Client('ws://localhost:2567');
    }

    async join() {
        this.room = await this.client.joinOrCreate<ITicTacToeState & Schema>('tic-tac-toe');
        
        this.room.onStateChange.once(state => {
            this.eventEmitter.emit("once-state-changed", state);
        });
        
        this.room.onStateChange(state => {
            this.eventEmitter.emit("on-state-changed", state);
        });

        this.room.onMessage('victory', (msg) => {

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

    isMyTurn() {
        return this.room?.sessionId !== this.room?.state.lastMoveSessionId;
    }

    getMyMarker() {
        if (this.room?.sessionId === this.room?.state.playerX) {
            return 'X';
        } else {
            return 'O';
        }
    }

    getOthersMarker() {
        if (this.room?.sessionId === this.room?.state.playerX) {
            return 'O';
        } else {
            return 'X';
        }
    }

    getVictor() {
        switch (this.room?.state.victorSessionId) {
            case '': {
                return 'STILL_PLAYING';
            }
            case this.room?.sessionId: {
                return 'YOU_WON';
            }
            default: {
                return 'OPPONENT_WON';
            }
        }
    }

}