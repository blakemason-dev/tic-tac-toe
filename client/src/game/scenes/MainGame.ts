import Phaser from "phaser";
import Server from "../services/Server";

export default class MainGame extends Phaser.Scene {
    constructor() {
        super('main-game');
    }

    create(data: { server: Server }) {
        console.log('main game scene');
        const { server } = data;

        server.join();
    }
}