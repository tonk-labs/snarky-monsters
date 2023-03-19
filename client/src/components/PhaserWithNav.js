import Phaser from 'phaser'
import { useEffect } from 'react'
import styled from 'styled-components'

const PhaserWrapperDiv = styled.div`
  height: calc(100vh - 136px);
`

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
      const phaserWrapperDiv = document.getElementById('phaserWrapperDiv')
      const config = {
        type: Phaser.AUTO,
        width: 359,
        height: 570,
        parent: phaserWrapperDiv,
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
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      }
      const game = new Phaser.Game(config)
      return () => {
        game.destroy()
      }
    }
  }, [])

  return <PhaserWrapperDiv id="phaserWrapperDiv" />
}
