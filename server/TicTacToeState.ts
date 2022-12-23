import { Schema, ArraySchema, type } from "@colyseus/schema";

import ITicTacToe from '../types/ITicTacToeState';

export default class TicTacToeState extends Schema implements ITicTacToe {
    @type(['number']) 
    board: ArraySchema<number>;

    @type('number') 
    activePlayer = 0;

    constructor() {
        super();

        this.board = new ArraySchema(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        )
    }
}