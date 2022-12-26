export enum Cell {
    Empty,
    X,
    O
}

export interface ITicTacToeState {
    board: number[];
    activePlayer: number;
    lastMoveSessionId: string;
    playerX: string;
    playerO: string;
    victorSessionId: string;
}

export default ITicTacToeState;