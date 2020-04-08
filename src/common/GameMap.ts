import { MoveDirection } from 'common/Constants'

export class Size {
  width: number
  height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  static serialize(data: Size): string {
    let tmp: number[]
    tmp.push(data.width)
    tmp.push(data.height)

    return tmp.join(',')
  }

  static deserialize(data: string): Size {
    let tmp: string[] = data.split(',')

    return new Size(parseInt(tmp[0]), parseInt(tmp[1]))
  }
}

export class Coor {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  neighbour(direct: MoveDirection): Coor {
    const n = new Coor(this.x, this.y)

    switch (direct) {
      case MoveDirection.Left:
        n.x -= 1
        break
      case MoveDirection.Right:
        n.x += 1
        break
      case MoveDirection.Top:
        n.y -= 1
        break
      case MoveDirection.Bottom:
        n.y += 1
        break
    }

    return n
  }

  static serialize(data: Coor): string {
    let tmp: number[]
    tmp.push(data.x)
    tmp.push(data.y)

    return tmp.join(',')
  }

  static deserialize(data: string): Coor {
    let tmp: string[] = data.split(',')

    return new Coor(parseInt(tmp[0]), parseInt(tmp[1]))
  }
}

interface EncodeGameMap {
  size: string
  map: number[][]
  hero: string
  box: string[]
  dst: string[]
}

export class GameMap {
  size: Size
  map: Array<Array<number>>
  hero: Coor
  box: Coor[]
  dst: Coor[]

  static default(): GameMap {
    const tmp = new GameMap

    tmp.size = new Size(0, 0)
    tmp.map = null
    tmp.hero = null
    tmp.box = []
    tmp.dst = []

    return tmp
  }

  static serialize(data: GameMap): string {
    let tmp = {} as EncodeGameMap
    tmp.size = Size.serialize(data.size)
    tmp.map = data.map
    tmp.hero = Coor.serialize(data.hero)
    tmp.box = data.box.map(v => Coor.serialize(v))
    tmp.dst = data.dst.map(v => Coor.serialize(v))

    return JSON.stringify(tmp)
  }

  static deserialize(data: string): GameMap {
    let tmp: EncodeGameMap = JSON.parse(data)

    let ret = new GameMap()
    ret.size = Size.deserialize(tmp.size)
    ret.map = tmp.map
    ret.hero = Coor.deserialize(tmp.hero)
    ret.box = tmp.box.map(v => Coor.deserialize(v))
    ret.dst = tmp.dst.map(v => Coor.deserialize(v))

    return ret
  }
}
