import {GameScene} from "./GameScene";
import {connectionManager} from "../../Connexion/ConnectionManager";
import {Room} from "../../Connexion/Room";
import {MenuSceneName} from "../Menu/MenuScene";

export interface HasMovedEvent {
    direction: string;
    moving: boolean;
    x: number;
    y: number;
}

/**
 * This class should be responsible for any scene starting/stopping
 */
export class GameManager {
    private playerName!: string;
    private characterLayers!: string[];
    private startRoom!:Room;
    private lastGameSceneName: string|null = null;
    private openingSceneId: string|null = null;

    public async init(scenePlugin: Phaser.Scenes.ScenePlugin) {
        this.startRoom = await connectionManager.initGameConnexion();
        await this.loadMap(this.startRoom, scenePlugin);
    }

    public setPlayerName(name: string): void {
        this.playerName = name;
    }

    public setLastGameSceneName(name: string): void {
        this.lastGameSceneName = name;
    }

    public setCharacterLayers(layers: string[]): void {
        this.characterLayers = layers;
    }

    getPlayerName(): string {
        return this.playerName;
    }

    getCharacterSelected(): string[] {
        return this.characterLayers;
    }


    public async loadMap(room: Room, scenePlugin: Phaser.Scenes.ScenePlugin): Promise<void> {
        const roomID = room.id;
        const mapUrl = await room.getMapUrl();

        const gameIndex = scenePlugin.getIndex(roomID);
        if(gameIndex === -1){
            const game : Phaser.Scene = new GameScene(room, mapUrl);
            scenePlugin.add(roomID, game, false);
        }
    }

    public goToStartingMap(scenePlugin: Phaser.Scenes.ScenePlugin): void {
        console.log('starting '+ (this.lastGameSceneName || this.startRoom.id))
        scenePlugin.start(this.lastGameSceneName || this.startRoom.id);
    }

    menuIsOpened(): boolean {
        return this.openingSceneId !== null;
    }

    openMenu(scene: GameScene) {
        if (this.openingSceneId !== null) return;

        scene.scene.launch(MenuSceneName);
        this.openingSceneId = scene.scene.key;
    }
    closeMenu(scene: Phaser.Scene) {
        if (this.openingSceneId === null) return;

        scene.scene.stop(MenuSceneName);
        this.openingSceneId = null;
    }

    /**
     * Temporary leave a gameScene to go back to the loginScene for example.
     * This will close the socket connections and stop the gameScene, but won't remove it.
     */
    leaveGame(scene: Phaser.Scene, targetSceneName: string): void {
        if (this.openingSceneId === null) return;

        gameManager.setLastGameSceneName(this.openingSceneId);
        const gameScene: GameScene = scene.scene.get(this.openingSceneId) as GameScene;
        gameScene.cleanupClosingScene();
        scene.scene.stop(this.openingSceneId);
        scene.scene.stop(MenuSceneName);
        scene.scene.run(targetSceneName);
        this.openingSceneId = null;
    }
}

export const gameManager = new GameManager();
