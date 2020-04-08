import React from 'react'
import { TileType, ActorType } from 'common/Constants.ts'

import bgImg from 'assets/images/bg.gif'
import wallImg from 'assets/images/wall.gif'
import dstImg from 'assets/images/target.gif'
import boxImg from 'assets/images/box1.gif'
import box2Img from 'assets/images/box2.gif'
import heroImg from 'assets/images/worker.gif'

export interface TileProps {
  type: TileType
  width: number
}

export const Tile = (props: TileProps) => {
  let { type, width, ...rest } = props

  let innerImg: JSX.Element = null
  switch (type) {
    case TileType.Obstacle:
      innerImg = (<img src={wallImg} />)
      break
    case TileType.Road:
      innerImg = (<img src={bgImg} />)
      break
  }

  return (
    <div style={{width: `${width}px`, height: `${width}px`}} {...rest}>
      {innerImg}
    </div>
  )
}

export interface ActorTileProps {
  type: ActorType
  width: number
  reach?: boolean
  style?: any
}

export const ActorTile = (props: ActorTileProps) => {
  const { type, width, reach, ...rest } = props

  let innerImg: JSX.Element = null
  switch (type) {
    case ActorType.Hero:
      innerImg = <img src={heroImg} />
      break
    case ActorType.Dst:
      innerImg = <img src={dstImg} />
      break
    case ActorType.Box:
      innerImg = <img src={reach ? box2Img : boxImg} />
      break
  }
  return (
    <div className='map-actor' {...rest} style={{...rest.style, width: width, height: width}}>
      { innerImg }
    </div>
  )
}


export interface EditorTileProps {
  width: number
  tileType: TileType
  actorType: ActorType
  reach?: boolean
}

export const EditorTile = (props: EditorTileProps) => {
  const {width, tileType, actorType, reach, ...rest} = props

  return (
    <div className='map-editor-tile' {...rest}>
      <Tile type={tileType} width={width} />
      {
        props.actorType == ActorType.Null ? null : <ActorTile type={actorType} width={width} reach={reach} style={{position: 'absolute', top: 0, left: 0}} />
      }
    </div>
  )
}
