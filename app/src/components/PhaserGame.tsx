import Phaser from "phaser";
import { useEffect, useState } from "react";

const PhaserGame = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [game, setGame] = useState<Phaser.Game>();
  const [music, setMusic] = useState<Phaser.Sound.BaseSound>();

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: "phaser-container",
      width: 1080,
      height: 1080,
      scene: {
        preload() {
          this.load.audio("music", "sounds/Aldous Ichnite - Elevator to Nowhere.mp3");
          this.load.image("roomStructure", "images/Room estructure.png");
          // Load other assets
        },
        create() {
          const newMusic = this.sound.add("music", { loop: true, volume: 0.5 });
          setMusic(newMusic);
          this.add.image(540, 540, "roomStructure");
          // Create other game objects
        },
        update() {
          // Game update logic
        },
      },
    });
    setGame(game);

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

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      game.destroy(true);
      if (music) {
        music.destroy();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (music) {
      if (isMusicPlaying) {
        music.pause();
      } else {
        music.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  return (
    <div>
      <div id="phaser-container"></div>
      <button onClick={toggleMusic}>{isMusicPlaying ? "Pause Music" : "Play Music"}</button>
    </div>
  );
};

export default PhaserGame;
