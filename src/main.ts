import Phaser from "phaser";
import DreamScene from "./scenes/DreamScene";
import RealityScene from "./scenes/RealityScene";
import IntroScene from "./scenes/IntroScene.ts";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    backgroundColor: "#111",
    scene: [IntroScene,RealityScene, DreamScene],
    physics: {
        default: "arcade",
        arcade: {
            gravity: {x:0, y: 600 },
            debug: true,
        },
    },
};

new Phaser.Game(config);
