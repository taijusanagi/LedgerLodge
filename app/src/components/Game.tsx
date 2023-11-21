import Phaser from "phaser";
import { useEffect, useState } from "react";

import { Lodge } from "@/types";

const objects = {
  lamp: {
    name: "Lamp",
    scale: 0.3,
    x: 530,
    y: 455,
    sort: 0,
  },
  desk: {
    name: "Desk 1",
    scale: 0.3,
    x: 628,
    y: 600,
    sort: 1,
  },
  chair: {
    name: "Chair 1",
    scale: 0.2,
    x: 580,
    y: 660,
    sort: 3,
  },
  closet: {
    name: "Closet 1",
    scale: 0.4,
    x: 827,
    y: 620,
    sort: 4,
  },
  mirror: {
    name: "Mirror 1",
    scale: 0.2,
    x: 170,
    y: 500,
    sort: 5,
  },
  bed: {
    name: "Bed 1",
    scale: 0.4,
    x: 314,
    y: 756,
    sort: 6,
  },
};

interface GameProps {
  lodge: Lodge;
}

const Game: React.FC<GameProps> = ({ lodge }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [game, setGame] = useState<Phaser.Game>();
  const [music, setMusic] = useState<Phaser.Sound.BaseSound>();
  // const [sprites, setSprites] = useState(new Map());

  useEffect(() => {
    if (!game) {
      return;
    }
    console.log("Game.lodge", lodge);
  }, [game, lodge]);

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
          // newMusic.play();
          // setIsMusicPlaying(true);
          this.add.image(540, 540, "Room estructure");
          // const newSprites = new Map();
          // Object.entries(objects).forEach(([key, obj]) => {
          //   const sprite = this.add.sprite(obj.x, obj.y, obj.name).setScale(obj.scale).setInteractive();
          //   sprite.on("pointerdown", () => {
          //     sprite.destroy();
          //     newSprites.delete(key);
          //   });
          //   newSprites.set(key, sprite);
          // });
          // setSprites(newSprites);
        },
        update() {
          // Game update logic
        },
      },
    });
    setGame(game);
    function resize() {
      const canvas = game.canvas,
        width = 350,
        height = 350;
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

  // const toggleMusic = () => {
  //   if (music) {
  //     if (isMusicPlaying) {
  //       music.pause();
  //     } else {
  //       music.play();
  //     }
  //     setIsMusicPlaying(!isMusicPlaying);
  //   }
  // };

  // const recoverObjects = () => {
  //   if (game) {
  //     const newSprites = new Map();
  //     sprites.forEach((sprite) => {
  //       console.log;
  //       if (sprite.active) {
  //         sprite.destroy();
  //       }
  //     });
  //     Object.entries(objects).forEach(([key, obj]) => {
  //       const sprite = game.scene.scenes[0].add.sprite(obj.x, obj.y, obj.name).setScale(obj.scale).setInteractive();
  //       sprite.on("pointerdown", () => {
  //         sprite.destroy();
  //         newSprites.delete(key);
  //       });
  //       newSprites.set(key, sprite);
  //     });
  //     setSprites(newSprites);
  //   }
  // };

  return (
    <div className="flex flex-col justify-center items-center">
      <div id="phaser-container"></div>
      {/* <button onClick={toggleMusic}>{isMusicPlaying ? "Pause Music" : "Play Music"}</button>
      <button onClick={recoverObjects}>Recover Furniture</button> */}
    </div>
  );
};

export default Game;
