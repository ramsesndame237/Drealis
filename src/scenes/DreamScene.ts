// src/scenes/DreamScene.ts
import Phaser from 'phaser'
import Player from '../assets/player'

export default class DreamScene extends Phaser.Scene {
    private player!: Player
    private keyE!: Phaser.Input.Keyboard.Key
    private keyObj!: Phaser.GameObjects.Rectangle  // la “clé” en rectangle

    constructor() {
        super('DreamScene')
    }

    create() {
        // 1) DEBUG : affiche les bodies
        this.physics.world.createDebugGraphic().setVisible(true)

        // 2) Texte + environnement
        this.add.text(20, 20, 'Rêve', {
            font: '24px sans-serif',
            color: '#4d88ff',
        })
        const ground = this.add.rectangle(400, 580, 800, 40, 0x4d88ff)
        this.physics.add.existing(ground, true)
        const platform = this.add.rectangle(300, 350, 100, 20, 0x4d88ff)
        this.physics.add.existing(platform, true)

        // 3) Joueur
        this.player = new Player(this, 100, 400)
        this.physics.add.collider(this.player, ground)
        this.physics.add.collider(this.player, platform)

        // 4) Clé (rectangle + static body)
        this.keyObj = this.add.rectangle(700, 500, 20, 20, 0x00ffcc)
        this.physics.add.existing(this.keyObj, true)
        const keyBody = this.keyObj.body as Phaser.Physics.Arcade.StaticBody
        keyBody.setSize(20, 20)
        keyBody.setOffset(-10, -10)
        keyBody.updateFromGameObject()

        // 5) Overlap joueur ⇆ clé
        this.physics.add.overlap(
            this.player,
            this.keyObj,
            this.collectKey,
            undefined,
            this,
        )

        // 6) Touche E pour switch (on testera plus bas si on a la clé)
        this.keyE = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E) as Phaser.Input.Keyboard.Key

        // Log initial pour vérifier que hasKey est bien “false” au départ
        console.log('DreamScene démarrée, hasKey =', this.registry.get('hasKey'))
    }

    update() {
        this.player.update()

        // 7) Switch vers la Réalité uniquement si clé ramassée
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
            const hasKey = this.registry.get('hasKey') as boolean
            if (hasKey) {
                this.scene.switch('RealityScene')
            } else {
                console.log('🔒 Pas de clé, cannot switch back yet')
            }
        }
    }

    private collectKey() {
        // 8) Callback overlap : on collecte
        console.log('🔑 collectKey called')
        this.keyObj.destroy()
        this.registry.set('hasKey', true)
        this.add
            .text(20, 50, 'Clé obtenue !', {
                font: '16px sans-serif',
                color: '#00ffcc',
            })
            .setScrollFactor(0)
    }
}
