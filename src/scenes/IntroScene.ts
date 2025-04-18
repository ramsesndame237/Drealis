import Phaser from 'phaser';

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    create() {
        const text = this.add.text(400, 300,
            'Entre Deux Mondes\n\nAppuie sur [ESPACE] pour entrer dans la réalité...',
            {
                font: '20px sans-serif',
                color: '#ffffff',
                align: 'center',
            }
        );
        text.setOrigin(0.5);
        this.input.keyboard?.on('keydown-SPACE', () => {
            this.scene.start('RealityScene');
        });
    }
}
