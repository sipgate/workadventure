import {LoginSceneName} from "../Login/LoginScene";
import {SelectCharacterSceneName} from "../Login/SelectCharacterScene";
import {gameManager} from "../Game/GameManager";

export const MenuSceneName = 'MenuScene';

/**
 * The scene that manages the game menu, rendered using a DOM element.
 */
export class MenuScene extends Phaser.Scene {
    private menuElement!: Phaser.GameObjects.DOMElement;

    constructor() {
        super({key: MenuSceneName});
    }

    preload () {
        this.load.html('gameMenu', 'resources/html/gameMenu.html');
    }

    create() {
        //this.cameras.main.setViewport(0, 0, this.game.renderer.width * 0.4, this.game.renderer.height);
        //this.cameras.main.setBackgroundColor(0x0055aa);

        this.menuElement = this.add.dom(0, 0).createFromCache('gameMenu');
        this.menuElement.setOrigin(0);
        this.menuElement.setAlpha(0);
        this.menuElement.addListener('click');
        this.menuElement.on('click',  (event:MouseEvent) => {
            event.preventDefault();
            
            switch ((event?.target as HTMLInputElement).id) {
                case 'changeNameButton':
                    gameManager.leaveGame(this, LoginSceneName);
                    break;
                case 'changeSkinButton':
                    gameManager.leaveGame(this, SelectCharacterSceneName);
                    break;
                case 'closeButton':
                    gameManager.closeMenu(this);
                    break;
                case 'shareButton':
                    this.shareUrl();
                    break;
            }
        });
        this.tweens.add({
            targets: this.menuElement,
            alpha: 1,
            duration: 500,
            ease: 'Power3'
        });
    }
    
    private async shareUrl() {
        await navigator.clipboard.writeText(location.toString());
        alert('URL was copy to your clipboard!');
    }
}