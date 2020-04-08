import React, { useState } from 'react'

import { GameMap, Coor } from 'common/GameMap'
import { EditorTile } from 'components/Tile'
import { TileType, ActorType } from 'common/Constants'

export interface MapEditorProps {

}

let actorMap: number[][]

export const MapEditor = (props: MapEditorProps) => {
  const tileLen = 30
  const [mapData, setMapData] = useState<GameMap>(GameMap.default())

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
    console.log('save map')
    event.preventDefault()
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
      <div>
      {
        mapData.map == null ? null :
        mapData.map.map((row, i) =>(
          <div key={i} className='map-row'>
          {
            row.map((val, j) =>(
              <EditorTile
                width={tileLen}
                tileType={val}
                actorType={actorMap[i][j] == (ActorType.Box | ActorType.Dst) ? ActorType.Box : actorMap[i][j]}
                reach={!!(actorMap[i][j] & ActorType.Dst)}
                key={j}
              />
            ))
          }
          </div>
        ))
      }
      </div>
    </div>
  )
}
