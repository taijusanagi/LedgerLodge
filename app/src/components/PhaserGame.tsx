import Phaser from "phaser";
import React, { useEffect } from "react";

const PhaserGame = () => {
  useEffect(() => {
    let game: Phaser.Game;

    function resize() {
      const canvas = game.canvas,
        width = window.innerWidth,
        height = window.innerHeight;
      const wratio = width / height,
        ratio = canvas.width / canvas.height;

      if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = width / ratio + "px";
      } else {
        canvas.style.width = height * ratio + "px";
        canvas.style.height = height + "px";
      }
    }

    game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: "phaser-container",
      width: 1080,
      height: 1080,
      scene: {
        preload() {
          this.load.image("roomStructure", "/images/Room estructure.png");
          // Load other assets
        },
        create() {
          this.add.image(540, 540, "roomStructure");
          // Create other game objects
        },
        update() {
          // Game update logic
        },
      },
    });

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-container"></div>;
};

export default PhaserGame;
