import { Room } from 'colyseus';

export default class TicTacToe extends Room {
    onCreate() {
        console.log('created');
    }
}