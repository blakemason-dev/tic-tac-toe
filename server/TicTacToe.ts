import { Room, Client } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import TicTacToeState from './TicTacToeState';

import { Message } from '../types/messages';
import { PlayerSelectionCommand } from './commands/PlayerSelectionCommand';

export default class TicTacToe extends Room<TicTacToeState> {
    private dispatcher = new Dispatcher(this);

    onCreate() {
        this.maxClients = 2;

        this.setState(new TicTacToeState());

        this.onMessage(Message.PlayerSelection, (client, message: { index: number }) => {
            this.dispatcher.dispatch(new PlayerSelectionCommand(), {
                client: client,
                index: message.index
            });
        });
    }

    onJoin(client: any) {
        if (this.clients.length === 1) {
            this.state.playerX = client.sessionId;
        } else if (this.clients.length === 2) {
            this.state.playerO = client.sessionId;
            this.state.lastMoveSessionId = client.sessionId;   
            this.broadcast('found-match', this.state);
        }
    }

    onLeave(client: any) {
        if (this.state.victorSessionId === '') {
            this.broadcast('client-left', client.sessionId);
        }
    }
}