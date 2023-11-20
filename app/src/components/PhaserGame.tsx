import Phaser from "phaser";
import { useEffect, useState } from "react";

const objects = {
  lamp: {
    name: "Lamp",
    scale: 0.3,
    x: 530,
    y: 455,
  },
  desk: {
    name: "Desk 1",
    scale: 0.3,
    x: 628,
    y: 600,
  },
  chair: {
    name: "Chair 1",
    scale: 0.2,
    x: 580,
    y: 660,
  },
  closet: {
    name: "Closet 1",
    scale: 0.4,
    x: 827,
    y: 620,
  },
  mirror: {
    name: "Mirror 1",
    scale: 0.2,
    x: 170,
    y: 500,
  },
  bed: {
    name: "Bed 1",
    scale: 0.4,
    x: 314,
    y: 756,
  },
};

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
          this.load.audio("Aldous Ichnite - Elevator to Nowhere", "sounds/Aldous Ichnite - Elevator to Nowhere.mp3");
          this.load.image("Room estructure", "images/Room estructure.png");
          this.load.image(objects.chair.name, `images/${objects.chair.name}.png`);
          this.load.image(objects.desk.name, `images/${objects.desk.name}.png`);
          this.load.image(objects.lamp.name, `images/${objects.lamp.name}.png`);
          this.load.image(objects.closet.name, `images/${objects.closet.name}.png`);
          this.load.image(objects.mirror.name, `images/${objects.mirror.name}.png`);
          this.load.image(objects.bed.name, `images/${objects.bed.name}.png`);
        },
        create() {
          const newMusic = this.sound.add("Aldous Ichnite - Elevator to Nowhere", { loop: true, volume: 0.5 });
          setMusic(newMusic);
          this.add.image(540, 540, "Room estructure");
          this.add.image(objects.lamp.x, objects.lamp.y, objects.lamp.name).scale = objects.lamp.scale;
          this.add.image(objects.desk.x, objects.desk.y, objects.desk.name).scale = objects.desk.scale;
          this.add.image(objects.chair.x, objects.chair.y, objects.chair.name).scale = objects.chair.scale;
          this.add.image(objects.closet.x, objects.closet.y, objects.closet.name).scale = objects.closet.scale;
          this.add.image(objects.mirror.x, objects.mirror.y, objects.mirror.name).scale = objects.mirror.scale;
          this.add.image(objects.bed.x, objects.bed.y, objects.bed.name).scale = objects.bed.scale;
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
