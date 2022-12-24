import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import ITicTacToeState, { Cell } from '../../types/ITicTacToeState';
import TicTacToe from '../TicTacToe';
import TicTacToeState from '../TicTacToeState';

type Payload = {
    client: Client,
    index: number
}

export class PlayerSelectionCommand extends Command<TicTacToe, Payload> {
    execute(data: Payload) {
        console.log('execute()');
        const { client, index } = data;

        console.log(this.room.state.board);

        const clientIndex = this.room.clients.findIndex(c => c.id === client.id);
        const cellValue = clientIndex === 0 ? Cell.X : Cell.O;

        this.room.state.board[index] = cellValue;

        console.log(this.room.state.board);
    }
}