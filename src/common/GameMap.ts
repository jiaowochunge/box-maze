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
    let tmp: any[] = data.split(',')

    return new Size(tmp[0] as number, tmp[1] as number)
  }
}

export class Coor {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  static serialize(data: Coor): string {
    let tmp: number[]
    tmp.push(data.x)
    tmp.push(data.y)

    return tmp.join(',')
  }

  static deserialize(data: string): Coor {
    let tmp: any[] = data.split(',')

    return new Coor(tmp[0] as number, tmp[1] as number)
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
    ret.box = tmp.box.map(v => Coor.deserialize(v as string))
    ret.dst = tmp.dst.map(v => Coor.deserialize(v as string))

    return ret
  }
}
