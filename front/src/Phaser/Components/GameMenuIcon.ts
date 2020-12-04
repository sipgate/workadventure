import {GameScene} from "../Game/GameScene";
import {gameManager} from "../Game/GameManager";

export const gameMenuIconName = 'gameMenuIcon';

export class GameMenuIcon extends Phaser.GameObjects.Image {
    
    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, gameMenuIconName);
        this.scene.add.existing(this);
        this.setOrigin(0, 1)
        this.displayWidth = 30;
        this.displayHeight = 30;
        this.setDepth(99999);
        this.setScrollFactor(0, 0);
        this.setInteractive();
        this.on("pointerup", () => gameManager.openMenu(scene));
    }
     
}