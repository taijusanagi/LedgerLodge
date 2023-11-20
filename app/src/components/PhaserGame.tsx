import Phaser from "phaser";
import React, { useEffect } from "react";

const PhaserGame = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: "phaser-container",
      width: 800,
      height: 600,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    new Phaser.Game(config);

    function preload() {
      // Load assets
    }

    function create() {
      // Create the game
    }

    function update() {
      // Game loop
    }
  }, []);

  return <div id="phaser-container"></div>;
};

export default PhaserGame;
