import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        const graphics = scene.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(0, 0, 32, 32);
        const rt = scene.add.renderTexture(0, 0, 32, 32).draw(graphics);

        super(scene, x, y, rt.texture.key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.setGravityY(300);

        this.cursors = scene.input.keyboard?.createCursorKeys()!;
    }

    update() {
        if (this.cursors.left?.isDown) {
            this.setVelocityX(-160);
        } else if (this.cursors.right?.isDown) {
            this.setVelocityX(160);
        } else {
            this.setVelocityX(0);
        }

        if (this.cursors.up?.isDown && this.body?.touching.down) {
            this.setVelocityY(-330);
        }
    }
}
