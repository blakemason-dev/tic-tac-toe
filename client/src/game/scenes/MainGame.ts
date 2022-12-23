import Phaser from "phaser";
import Server from "../services/Server";

import ITicTacToeState from "../../../../types/ITicTacToeState";

export default class MainGame extends Phaser.Scene {
    constructor() {
        super('main-game');
    }

    async create(data: { server: Server }) {
        const { server } = data;

        await server.join();

        server.onceStateChanged(this.createBoard, this);
    }

    private createBoard(state: ITicTacToeState) {

        const { width, height } = this.scale;
        const size = 64;
        const spacing = 5;

        let x = (width * 0.5) - size - spacing;
        let y = (height * 0.5) - size - spacing;

        state.board.forEach((cellState, idx) => {
            this.add.rectangle(x, y, size, size, 0xffffff);
            x += size + spacing;
            
            if ((idx+1) % 3 === 0) {
                y += size+spacing;
                x = (width * 0.5) - size - spacing;
            }
        });
    }
}