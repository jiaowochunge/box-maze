// 地图方块类型
export enum TileType {
  Blank = 0,
  Obstacle,
  Road
}

export const TileName: {[key: number]: string} = {
  0: '空白',
  1: '墙壁',
  2: '道路'
}

export enum MoveDirection {
  Left,
  Top,
  Right,
  Bottom
}

export enum ActorType {
  Null = 0,
  Hero = 1,
  Box = 1 << 1,
  Dst = 1 << 2
}

export const ActorName: {[key: number]: string} = {
  0: '空值',
  1: '搬运工',
  2: '箱子',
  4: '目标点'
}
