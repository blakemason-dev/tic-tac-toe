import Phaser from "phaser";
import Server from "../services/Server";

import ITicTacToeState, { Cell } from "../../../../types/ITicTacToeState";

export default class MainGame extends Phaser.Scene {

    private server?: Server;
    private cellImages: Phaser.GameObjects.Image[] = [];
    // private cellStates: Cell[] = [];

    constructor() {
        super('main-game');
    }

    preload() {
        this.load.image('cross', '/src/game/assets/cross.png');
        this.load.image('circle', '/src/game/assets/cross.png');
    }

    async create(data: { server: Server }) {
        const { server } = data;

        this.server = server;

        if (!this.server) {
            throw new Error('server instance missing');
        }

        await this.server.join();

        this.server.onceStateChanged(this.createBoard);
        this.server.onStateChanged(this.updateBoard);
    }

    private createBoard = (state: ITicTacToeState) => {
        const { width, height } = this.scale;
        const size = 96;
        const spacing = 5;

        let x = (width * 0.5) - size - spacing;
        let y = (height * 0.5) - size - spacing;

        state.board.forEach((cellState, idx) => {
            this.add.rectangle(x, y, size, size, 0xffffff)
                .setInteractive()
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                    this.server?.makeSelection(idx);
                });
            const cellImage = this.add.image(x, y, 'cross');
            cellImage.setDisplaySize(size*0.9, size*0.9);
            cellImage.setVisible(false);
            this.cellImages.push(cellImage);
            // this.cellStates.push(Cell.Empty);

            x += size + spacing;
            
            if ((idx+1) % 3 === 0) {
                y += size+spacing;
                x = (width * 0.5) - size - spacing;
            }
        });
    }

    private updateBoard = (state: ITicTacToeState) => {
        state.board.forEach((cell, idx) => {
            switch (cell) {
                case Cell.X: {
                    this.cellImages[idx].setTexture('cross');
                    this.cellImages[idx].setVisible(true);
                    break;
                }
                case Cell.O: {
                    this.cellImages[idx].setTexture('circle');
                    this.cellImages[idx].setVisible(true);
                    break;
                }
                default: {
                    this.cellImages[idx].setVisible(false);
                    break;
                }
            }
        });
    }
}