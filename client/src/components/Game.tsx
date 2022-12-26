import React, { useEffect, useRef } from "react";
import Bootstrap from "../game/scenes/Bootstrap";
import MainGame from "../game/scenes/MainGame";

import './Game.css';

const Game = () => {
    const gameInitialised = useRef(false);

    useEffect(() => {
        if (gameInitialised.current) return; 

        const gameConfig = {
            type: Phaser.AUTO,
            parent: "phaser-game",
            width: 360,
            height: 640,
            scene: [Bootstrap, MainGame]
        }

        new Phaser.Game(gameConfig);

        gameInitialised.current = true;

    }, []);

    return (
        <div id="phaser-game" className="game">
            
        </div>
    )
}

export default Game;