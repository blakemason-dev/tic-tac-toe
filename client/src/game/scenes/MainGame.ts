import Phaser from "phaser";
import Server from "../services/Server";

import ITicTacToeState, { Cell } from "../../../../types/ITicTacToeState";

export default class MainGame extends Phaser.Scene {

    private server?: Server;
    private cellImages: Phaser.GameObjects.Image[] = [];

    private titleText!: Phaser.GameObjects.Text;
    private infoText!: Phaser.GameObjects.Text;

    constructor() {
        super('main-game');
    }

    preload() {
        this.load.image('cross', '/src/game/assets/cross.png');
        this.load.image('circle', '/src/game/assets/circle.png');
    }

    async create(data: { server: Server }) {
        const { server } = data;

        this.server = server;

        if (!this.server) {
            throw new Error('server instance missing');
        }

        await this.server.join();

        this.server.onceStateChanged(this.createBoard);
        this.server.onceStateChanged(this.createGui);

        this.server.onStateChanged(this.updateBoard);
        this.server.onStateChanged(this.updateGui);
        this.server.onStateChanged(this.updateVictory);
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
            cellImage.setDisplaySize(size * 0.9, size * 0.9);
            cellImage.setVisible(false);
            this.cellImages.push(cellImage);

            x += size + spacing;

            if ((idx + 1) % 3 === 0) {
                y += size + spacing;
                x = (width * 0.5) - size - spacing;
            }
        });
    }

    private createGui = (state: ITicTacToeState) => {
        this.titleText = this.add.text(20, 20, "tic... tac... toe!", {
            fontFamily: 'mono',
            fontSize: '24px'
        });

        this.infoText = this.add.text(20, this.scale.height - 20, ">> your turn", {
            fontFamily: 'mono',
            fontSize: '20px'
        });
        this.infoText.setOrigin(0, 1);
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

    private updateGui = (state: ITicTacToeState) => {
        if (this.server?.isMyTurn()) {
            this.infoText.text = ">> your turn player " + this.server.getMyMarker();
        } else {
            this.infoText.text = ">> player " + this.server?.getOthersMarker() + "'s turn";
        }
    }

    private updateVictory = (state: ITicTacToeState) => {
        // check if someone won
        const victor = this.server?.getVictor();
        if (victor === 'YOU_WON') {
            this.infoText.text = '>> You won! Refresh to play again'
        } else if (victor === 'OPPONENT_WON') {
            this.infoText.text = '>> Opponent won... refresh to play again';
        }
    }
}