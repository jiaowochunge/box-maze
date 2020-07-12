import React, { useState } from 'react'

import { GameMap, Coor } from 'common/GameMap'
import { EditorTile } from 'components/Tile'
import { TileType, TileName, ActorType, ActorName } from 'common/Constants'

export interface MapEditorProps {
  onSaveMap?: (map: GameMap) => void
}

// 参见`Game.tsx`文件注释
let actorMap: number[][]
// 为了做出hover到地图方块上，出现编辑菜单，我需要设置编辑菜单延迟消失。这个变量就是延迟事件的引用
let hideMenu: any = null

export const MapEditor = (props: MapEditorProps) => {
  const tileLen = 30
  const [mapData, setMapData] = useState<GameMap>(GameMap.default())
  const [menuData, setMenuData] = useState<MenuData>({show: false, pos: new Coor(0, 0)})

  const handleChange = (type: 'width' | 'height') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { size } = mapData
    const val = parseInt(event.target.value)
    if (isNaN(val)) {
      return
    }
    if (type == 'width') {
      size.width = val
    } else {
      size.height = val
    }

    // 修改宽高后，重新初始化地图
    if (size.width > 0 && size.height > 0) {
      actorMap = []
      const map = []
      for (let i = 0; i < size.height; i++) {
        actorMap.push([])
        map.push([])
        for (let j = 0; j < size.width; j++) {
          actorMap[i][j] = ActorType.Null
          map[i][j] = TileType.Blank
        }
      }

      setMapData({...mapData, size, map})
    } else {
      setMapData({...mapData, size})
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (validateMap() && props.onSaveMap) {
      props.onSaveMap.call(null, mapData)
    }
    e.preventDefault()
  }

  function validateMap(): boolean {
    // TODO: 这个API就随意设计了。
    // 其实应该返回检查出来的错误，而不是简单返回布尔值。
    // 检查内容：地图是否封闭，是否存在搬运工，是否存在箱子，箱子与目标点是否匹配
    /** 地图封闭性算法设计：
     * 1. 从某个道路方块出发，可以遍历到所有道路方块。保证道路连成一片
     * 2. 所有道路方块的邻居是道路方块或墙壁方块
     */

    return true
  }

  const onMouseEnterTile = (i: number, j: number) => (e: React.MouseEvent) => {
    if (hideMenu) {
      clearTimeout(hideMenu)
      hideMenu = null
    }
    setMenuData({
      show: true,
      pos: new Coor(i, j)
    })
  }

  const onMouseLeaveTile = (i: number, j: number) => (e: React.MouseEvent) => {
    if (!hideMenu) {
      hideMenu = setTimeout(() => {
        setMenuData(Object.assign({}, menuData, {
          show: false
        }))
      }, 100)
    }
  }

  const drawEditMenu = () => {
    if (mapData.map == null) {
      return null
    }
    const style: any = {}
    style.visibility = menuData.show ? 'visible' : 'hidden'
    style.left = (menuData.pos.x + 0.6) * (tileLen + 1)
    style.top = (menuData.pos.y + 0.6) * (tileLen + 1)

    const tileValue = mapData.map[menuData.pos.y][menuData.pos.x]
    const hasHero = !!(actorMap[menuData.pos.y][menuData.pos.x] & ActorType.Hero)
    const hasBox = !!(actorMap[menuData.pos.y][menuData.pos.x] & ActorType.Box)
    const hasDst = !!(actorMap[menuData.pos.y][menuData.pos.x] & ActorType.Dst)

    return (
      <div
        className='map-editor-menu'
        style={style}
        onMouseEnter={(e: React.MouseEvent) => {
          if (hideMenu) {
            clearTimeout(hideMenu)
            hideMenu = null
          }
        }}
        onMouseLeave={(e: React.MouseEvent) => {
          if (!hideMenu) {
            hideMenu = setTimeout(() => {
              setMenuData(Object.assign({}, menuData, {
                show: false
              }))
            }, 100)
          }
        }}>
        <form style={{margin: 8}}>
        {
          [TileType.Blank, TileType.Obstacle, TileType.Road].map(value =>(
            <div key={value}>
              <label>
                <input
                  type='radio'
                  name='tile'
                  value={value}
                  checked={tileValue == value}
                  onChange={(e: React.FormEvent) => {
                    let map = mapData.map
                    map[menuData.pos.y][menuData.pos.x] = value
                    setMapData({...mapData, map})
                  }}
                />
                {TileName[value]}
              </label>
            </div>
          ))
        }
          <hr/>
          <div>
            <label>
              <input type='checkbox' name='hero' checked={hasHero} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const pos = menuData.pos
                if (e.target.checked) {
                  if (hasBox || hasDst) {
                    return
                  }
                  if (mapData.map[pos.y][pos.x] != TileType.Road) {
                    alert('搬运工只能放在道路上')
                    return
                  }
                  if (mapData.hero) {
                    actorMap[mapData.hero.y][mapData.hero.x] ^= ActorType.Hero
                  }
                  actorMap[pos.y][pos.x] |= ActorType.Hero
                  setMapData({...mapData, hero: new Coor(pos.x, pos.y)})
                } else {
                  actorMap[mapData.hero.y][mapData.hero.x] ^= ActorType.Hero
                  setMapData({...mapData, hero: null})
                }
              }} />
              {ActorName[ActorType.Hero]}
            </label>
          </div>
          <div>
            <label>
              <input type='checkbox' name='box' checked={hasBox} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const pos = menuData.pos
                if (e.target.checked) {
                  if (hasHero) {
                    return
                  }
                  if (mapData.map[pos.y][pos.x] != TileType.Road) {
                    alert('箱子只能放在道路上')
                    return
                  }
                  actorMap[pos.y][pos.x] |= ActorType.Box
                  const box = mapData.box || []
                  box.push(new Coor(pos.x, pos.y))
                  setMapData({...mapData, box})
                } else {
                  actorMap[pos.y][pos.x] ^= ActorType.Box
                  const box = mapData.box.filter((ele: Coor) => !(ele.x == pos.x && ele.y == pos.y))
                  setMapData({...mapData, box})
                }
              }} />
              {ActorName[ActorType.Box]}
            </label>
          </div>
          <div>
            <label>
              <input type='checkbox' name='dst' checked={hasDst} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const pos = menuData.pos
                if (e.target.checked) {
                  if (hasHero) {
                    return
                  }
                  if (mapData.map[pos.y][pos.x] != TileType.Road) {
                    alert('目标点只能放在道路上')
                    return
                  }
                  actorMap[pos.y][pos.x] |= ActorType.Dst
                  const dst = mapData.dst || []
                  dst.push(new Coor(pos.x, pos.y))
                  setMapData({...mapData, dst})
                } else {
                  actorMap[pos.y][pos.x] ^= ActorType.Dst
                  const dst = mapData.dst.filter((ele: Coor) => !(ele.x == pos.x && ele.y == pos.y))
                  setMapData({...mapData, dst})
                }
              }} />
              {ActorName[ActorType.Dst]}
            </label>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>请设定地图尺寸</h2>
      <form onSubmit={handleSubmit}>
        <label>
          宽度:
          <input type='number' name='width' value={mapData.size ? mapData.size.width : 0} onChange={handleChange('width')} />
        </label>
        <label>
          高度:
          <input type='number' name='height' value={mapData.size ? mapData.size.height : 0} onChange={handleChange('height')} />
        </label>
        <input type='submit' value='保存地图'/>
      </form>
      <p><b>地图编辑器说明：</b><br/>首先选择地图尺寸，然后鼠标放到地图方块上，选择方块类型。编辑完成后，点击‘保存地图’按钮</p>
      <div className='map-editor-container'>
      {
        mapData.map && mapData.map.map((row, i) =>(
          <div key={i} className='map-row'>
          {
            row.map((val, j) =>(
              <EditorTile
                width={tileLen}
                tileType={val}
                actorType={actorMap[i][j] == (ActorType.Box | ActorType.Dst) ? ActorType.Box : actorMap[i][j]}
                reach={!!(actorMap[i][j] & ActorType.Dst)}
                key={j}
                onMouseEnter={onMouseEnterTile(j, i)}
                onMouseLeave={onMouseLeaveTile(j, i)}
              />
            ))
          }
          </div>
        ))
      }
      {
        drawEditMenu()
      }
      </div>
    </div>
  )
}

interface MenuData {
  show: boolean
  pos: Coor
}
