import { Room, Client } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import TicTacToeState from './TicTacToeState';

import { Message } from '../types/messages';
import { PlayerSelectionCommand } from './commands/PlayerSelectionCommand';

// import { ITicTacToeState } from '../types/ITicTacToeState';

export default class TicTacToe extends Room<TicTacToeState> {
    private dispatcher = new Dispatcher(this);

    onCreate() {
        this.setState(new TicTacToeState());

        this.onMessage(Message.PlayerSelection, (client, message: { index: number }) => {
            console.log('onMessage()');
            this.dispatcher.dispatch(new PlayerSelectionCommand(), {
                client: client,
                index: message.index
            });
        });
    }
}