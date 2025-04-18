// src/scenes/RealityScene.ts
import Phaser from 'phaser'
import Player from '../assets/player'
import { playDreamTransition } from '../transitions/dreamEffect'

export default class RealityScene extends Phaser.Scene {
    private player!: Player
    private keyE!: Phaser.Input.Keyboard.Key
    private doorZone!: Phaser.GameObjects.Zone

    constructor() {
        super('RealityScene')
    }

    create() {
        // 1) Texte et décor
        this.add.text(20, 20, 'Réalité', { font: '24px sans-serif', color: '#ff4d4d' })

        const ground = this.add.rectangle(400, 580, 800, 40, 0xff4d4d)
        this.physics.add.existing(ground, true)

        const platform = this.add.rectangle(600, 450, 100, 20, 0xff4d4d)
        this.physics.add.existing(platform, true)

        // 2) Joueur
        this.player = new Player(this, 100, 400)
        this.physics.add.collider(this.player, ground)
        this.physics.add.collider(this.player, platform)

        // 3) PORTE → Zone non‑bloquante
        this.doorZone = this.add.zone(750, 540, 30, 60).setOrigin(0.5)

        // active la physique sur la zone
        this.physics.world.enable(this.doorZone)
        const dzBody = this.doorZone.body as Phaser.Physics.Arcade.Body
        dzBody.setAllowGravity(false)
        dzBody.setImmovable(true)

        // debug visuel du capteur
        dzBody.debugShowBody = true

        // seul l’overlap va déclencher l’ouverture
        this.physics.add.overlap(
            this.player,
            this.doorZone,
            this.handleDoorOverlap,
            undefined,
            this,
        )

        // 4) Bascule vers le rêve
        this.keyE = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E) as Phaser.Input.Keyboard.Key

        // 5) Trace la donnée hasKey
        this.registry.events.on('changedata-hasKey', (_p: any, k: string, v: any) => {
            if (k === 'hasKey') console.log('🔑 hasKey ➡', v)
        })
        console.log('RealityScene créée, hasKey =', this.registry.get('hasKey'))
    }

    update() {
        this.player.update()

        // switch vers le rêve
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
            playDreamTransition(() => this.scene.switch('DreamScene'))
        }
    }

    private handleDoorOverlap() {
        const hasKey = this.registry.get('hasKey') as boolean
        console.log('🔍 Overlap porte, hasKey =', hasKey)

        if (hasKey) {
            // on affiche et on stoppe
            this.add
                .text(400, 300, 'Tu as réussi !', { font: '24px sans-serif', color: '#fff' })
                .setOrigin(0.5)
            this.scene.pause()
        } else {
            const msg = this.add
                .text(400, 300, 'Il te manque la clé…', { font: '16px sans-serif', color: '#f00' })
                .setOrigin(0.5)
            this.time.delayedCall(1000, () => msg.destroy(), [], this)
        }
    }
}
