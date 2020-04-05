import React from 'react'
import { TileType } from 'common/Constants.ts'

import bgImg from 'assets/images/bg.gif'
import wallImg from 'assets/images/wall.gif'

export interface TileProps {
  type: TileType
  width: number
}

export const Tile = (props: TileProps) => {
  let { type, width, ...rest } = props

  let innerImg: any = null
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
