import React, { useState, useEffect } from 'react'

import { GameMap, Coor } from 'common/GameMap'
import { TileType, MoveDirection, ActorType } from 'common/Constants'
import { Tile, ActorTile } from 'components/Tile'

import sampleMap from 'assets/maps/sample.json'
import 'assets/css/game.css'

export interface GameProps {
  level: number
  onSuccess?: () => void
}

// 为了计算方便，把‘箱子’，‘目标点’，‘人物’放到这个二维数组中
let actorMap: number[][]

export const Game = (props: GameProps) => {
  const tileLen = 30
  const [mapData, setMapData] = useState<GameMap>(null)

  useEffect(() => {
    // fetch level map
    fetch(sampleMap)
      .then(res => res.text())
      .then(res => {
        const tmpMapData = GameMap.deserialize(res)
        initActorMap(tmpMapData)
        setMapData(tmpMapData)
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

  /**
   * 为了方便计算，我们把‘箱子’，‘目标点’，‘人物’放到一个二维数组中
   * 使用位运算，使这三者可以重叠放在一个点上
   */
  function initActorMap(mapData: GameMap): void {
    actorMap = []
    for (let i = 0; i < mapData.size.height; i++) {
      actorMap.push([])
      for (let j = 0; j < mapData.size.width; j++) {
        actorMap[i][j] = ActorType.Null
      }
    }
    actorMap[mapData.hero.y][mapData.hero.x] |= ActorType.Hero
    for (let i = 0, box = mapData.box[0], dst = mapData.dst[0]; box = mapData.box[i], dst = mapData.dst[i]; i++) {
      actorMap[box.y][box.x] |= ActorType.Box
      actorMap[dst.y][dst.x] |= ActorType.Dst
    }
  }

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
        top: c.y * tileLen,
        left: c.x * tileLen
      }
    )

    return (
      <>
      {
        mapData.dst.map((value, index) => (
          <ActorTile
            type={ActorType.Dst}
            width={tileLen}
            style={calcPosition(value)}
            key={index}
          />
        ))
      }
      {
        mapData.box.map((value, index) => (
          <ActorTile
            type={ActorType.Box}
            width={tileLen}
            style={calcPosition(value)}
            reach={(actorMap[value.y][value.x] & ActorType.Dst) != 0}
            key={index}
          />
        ))
      }
        <ActorTile type={ActorType.Hero} width={tileLen} style={calcPosition(mapData.hero)} />
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
    const nextHero = mapData.hero.neighbour(direct)

    // 如果有箱子
    for (let i = 0, box = mapData.box[0]; box = mapData.box[i]; i++) {
      if (box.x == nextHero.x && box.y == nextHero.y) {
        // 箱子是否撞墙或存在另一个箱子
        const nextBox = box.neighbour(direct)
        if (mapData.map[nextBox.y][nextBox.x] == TileType.Obstacle ||
          actorMap[nextBox.y][nextBox.x] & ActorType.Box) {
          return
        }
        // 没撞墙，先更新actorMap
        actorMap[mapData.hero.y][mapData.hero.x] ^= ActorType.Hero
        actorMap[nextHero.y][nextHero.x] |= ActorType.Hero
        actorMap[box.y][box.x] ^= ActorType.Box
        actorMap[nextBox.y][nextBox.x] |= ActorType.Box

        const nextMapData = {...mapData, hero: nextHero}
        nextMapData.box.splice(i, 1, nextBox)

        setMapData(nextMapData)

        // 结算是否获胜
        let matchCount = 0
        for (let j = 0; j < nextMapData.box.length; j++) {
          let box = nextMapData.box[j]
          // 如果有一个目标点与箱子不重合，那就没有获胜
          if (!(actorMap[box.y][box.x] & ActorType.Dst)) {
            return
          }
        }
        // 延迟回调。等动作执行完毕
        if (props.onSuccess) {
          setTimeout(props.onSuccess, 100)
        }
        return
      }
    }

    // 如果没有箱子，是否撞墙
    if (mapData.map[nextHero.y][nextHero.x] == TileType.Road) {
      setMapData({...mapData, hero: nextHero})
    }
  }

  return (
    <div className='map-container'>
    { drawMap() }
    { drawActor() }
    </div>
  )
}
