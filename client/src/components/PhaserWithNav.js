import Phaser from 'phaser'
import { useEffect } from 'react'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
}

function preload() {
  // Add any assets you want to preload here
}

function create() {
  // Add any game objects you want to create here
}

function update() {
  // Add any game logic you want to update here
}

export default function PhaserWithNav() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator) {
      const game = new Phaser.Game(config)
      return () => {
        game.destroy()
      }
    }
  }, [])

  return <div id="phaserWrapperDiv"></div>
}
