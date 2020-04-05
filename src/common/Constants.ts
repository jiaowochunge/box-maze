// 地图方块类型
export enum TileType {
  Blank = 0,
  Obstacle,
  Road
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
