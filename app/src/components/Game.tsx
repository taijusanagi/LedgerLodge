import Phaser from "phaser";
import { useEffect, useState } from "react";

import { Lodge } from "@/types";
import { objects } from "@/lib/objects";

interface GameProps {
  mode: "edit" | "view";
  lodge: Lodge;
  setLodge: any;
  setSelectedCredential?: any;
}

const Game: React.FC<GameProps> = ({ mode, lodge, setLodge, setSelectedCredential }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [game, setGame] = useState<Phaser.Game>();
  const [clickSound, setClickSound] = useState<Phaser.Sound.BaseSound>();
  const [music, setMusic] = useState<Phaser.Sound.BaseSound>();
  const [sprites, setSprites] = useState(new Map());

  useEffect(() => {
    if (!game || !clickSound) {
      return;
    }
    console.log("Game.lodge", lodge);
    let setSound = false;
    const _objects = objects as any;
    const newSprites = new Map();
    sprites.forEach((sprite) => {
      if (sprite.active) {
        sprite.destroy();
      }
    });
    Object.entries(lodge)
      .sort(([k1], [k2]) => _objects[k1].sort - _objects[k2].sort)
      .map(([k, v], i) => {
        setSound = true;
        const obj = _objects[k];
        const sprite = game.scene.scenes[0].add.sprite(obj.x, obj.y, obj.name).setScale(obj.scale).setInteractive();
        if (mode == "edit") {
          sprite.on("pointerdown", () => {
            if (clickSound) {
              clickSound.play();
            }
            sprite.destroy();
            setLodge((prev: any) => {
              delete prev[k];
              return { ...prev };
            });
          });
          newSprites.set(k, sprite);
        } else {
          sprite.on("pointerdown", () => {
            if (clickSound) {
              clickSound.play();
            }
            setSelectedCredential(v);
          });
        }
      });
    setSprites(newSprites);
    if (setSound && clickSound) {
      clickSound.play();
    }
  }, [mode, game, lodge, setLodge, clickSound, setSelectedCredential]);

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: "phaser-container",
      width: 1080,
      height: 1080,
      scene: {
        preload() {
          this.load.audio("Aldous Ichnite - Elevator to Nowhere", "/sounds/Aldous Ichnite - Elevator to Nowhere.mp3");
          this.load.audio("Click", "/sounds/Click.mp3");
          this.load.image("Room estructure", "/images/Room estructure.png");
          this.load.image(objects.chair.name, `/images/${objects.chair.name}.png`);
          this.load.image(objects.desk.name, `/images/${objects.desk.name}.png`);
          this.load.image(objects.lamp.name, `/images/${objects.lamp.name}.png`);
          this.load.image(objects.closet.name, `/images/${objects.closet.name}.png`);
          this.load.image(objects.mirror.name, `/images/${objects.mirror.name}.png`);
          this.load.image(objects.bed.name, `/images/${objects.bed.name}.png`);
        },
        create() {
          const newMusic = this.sound.add("Aldous Ichnite - Elevator to Nowhere", { loop: true, volume: 0.5 });
          setMusic(newMusic);
          newMusic.play();
          const clickSound = this.sound.add("Click", { volume: 0.5 });
          setClickSound(clickSound);
          setIsMusicPlaying(true);
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
