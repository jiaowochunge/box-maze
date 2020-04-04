import React, { useState, useEffect } from 'react'

import { GameMap } from 'common/GameMap'
import { Tile } from 'components/Tile'
import sampleMap from 'assets/maps/sample.json'
import 'assets/css/game.css'
import dstImg from 'assets/images/target.gif'
import boxImg from 'assets/images/box1.gif'
import heroImg from 'assets/images/worker.gif'

export interface GameProps {
  level: number;
}

export const Game = (props: GameProps) => {
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
  })

  function drawMap() {
    if (mapData == null)
      return null

    return mapData.map.map((row, i1) => {
      return (
        <div key={i1} className='map-row'>
        {
          row.map((value, i2) => (
            <Tile type={value} key={i2} />
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

    return (
      <>
      {
        mapData.dst.map((value, index) => (
          <div className='map-actor' style={{width: '30px', height: '30px', top: value.y * 30, left: value.x * 30}} key={index}>
            <img src={dstImg} />
          </div>
        ))
      }
      {
        mapData.box.map((value, index) => (
          <div className='map-actor' style={{width: '30px', height: '30px', top: value.y * 30, left: value.x * 30}} key={index}>
            <img src={boxImg} />
          </div>
        ))
      }
        <div className='map-actor' style={{width: '30px', height: '30px', top: mapData.hero.y * 30, left: mapData.hero.x * 30}}>
          <img src={heroImg} />
        </div>
      </>
    )
  }

  return (
    <div className='map-container'>
    { drawMap() }
    { drawActor() }
    </div>
  )
}
