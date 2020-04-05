import React, { useState, useEffect } from 'react'

import { GameMap, Coor } from 'common/GameMap'
import { MoveDirection } from 'common/Constants'
import { Tile } from 'components/Tile'

import sampleMap from 'assets/maps/sample.json'
import 'assets/css/game.css'
import dstImg from 'assets/images/target.gif'
import boxImg from 'assets/images/box1.gif'
import heroImg from 'assets/images/worker.gif'

export interface GameProps {
  level: number
  onSuccess?: () => void
}

export const Game = (props: GameProps) => {
  const tileLen = 30
  const [mapData, setMapData] = useState<GameMap>(null)

  useEffect(() => {
    // fetch level map
    fetch(sampleMap)
      .then(res => res.text())
      .then(res => {
        setMapData(GameMap.deserialize(res))
      }, error => {
        alert(error)
      })
  }, [])
  useEffect(() => {
    document.addEventListener('keyup', keyUp)

    return () => {
      document.removeEventListener('keyup', keyUp)
    }
  })

  function drawMap() {
    if (mapData == null)
      return null

    return mapData.map.map((row, i1) => {
      return (
        <div key={i1} className='map-row'>
        {
          row.map((value, i2) => (
            <Tile type={value} key={i2} width={tileLen} />
          ))
        }
        </div>
      )
    })
  }

  function drawActor() {
    if (mapData == null) {
      return null
    }

    const calcPosition = (c: Coor) => (
      {
        width: tileLen,
        height: tileLen,
        top: c.y * tileLen,
        left: c.x * tileLen
      }
    )

    return (
      <>
      {
        mapData.dst.map((value, index) => (
          <div className='map-actor' style={calcPosition(value)} key={index}>
            <img src={dstImg} />
          </div>
        ))
      }
      {
        mapData.box.map((value, index) => (
          <div className='map-actor' style={calcPosition(value)} key={index}>
            <img src={boxImg} />
          </div>
        ))
      }
        <div className='map-actor' style={calcPosition(mapData.hero)}>
          <img src={heroImg} />
        </div>
      </>
    )
  }

  function keyUp(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowLeft':
        keyActionHandler(MoveDirection.Left)
        break
      case 'ArrowRight':
        keyActionHandler(MoveDirection.Right)
        break
      case 'ArrowUp':
        keyActionHandler(MoveDirection.Top)
        break
      case 'ArrowDown':
        keyActionHandler(MoveDirection.Bottom)
        break
      default:
        break
    }
  }

  function keyActionHandler(direct: MoveDirection): void {
    switch (direct) {
      case MoveDirection.Left:
        setMapData({...mapData, hero: new Coor(mapData.hero.x - 1, mapData.hero.y)})
        break
      case MoveDirection.Right:
        setMapData({...mapData, hero: new Coor(mapData.hero.x + 1, mapData.hero.y)})
        break
      case MoveDirection.Top:
        setMapData({...mapData, hero: new Coor(mapData.hero.x, mapData.hero.y - 1)})
        break
      case MoveDirection.Bottom:
        setMapData({...mapData, hero: new Coor(mapData.hero.x, mapData.hero.y + 1)})
        break
    }
  }

  return (
    <div className='map-container'>
    { drawMap() }
    { drawActor() }
    </div>
  )
}
