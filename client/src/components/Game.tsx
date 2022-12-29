import React, { useEffect, useRef } from "react";
import EndMatch from "../game/scenes/EndMatch";
import FindMatch from "../game/scenes/FindMatch";
import MainGame from "../game/scenes/MainGame";
import Title from "../game/scenes/Title";

import './Game.css';

const Game = () => {
    const gameInitialised = useRef(false);

    useEffect(() => {
        if (gameInitialised.current) return; 

        const gameConfig = {
            type: Phaser.CANVAS,
            parent: "phaser-game",
            width: 360,
            height: 640,
            scene: [Title, FindMatch, MainGame, EndMatch]
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