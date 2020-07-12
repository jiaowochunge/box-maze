import React, { useState, useEffect } from 'react'
import { MapEditor } from 'components/MapEditor'
import { Game } from 'components/Game'
import { sharedMapRepo } from 'common/MapRepositoryWebSQLImpl'
import { GameMap } from 'common/GameMap'
import { MapRecord } from 'common/IMapRepository'

import 'assets/css/game.css'

export const Home = () => {
  const [tab, setTab] = useState<number>(1)
  const [level, setLevel] = useState<number>(null)
  const [stages, setStages] = useState<Array<MapRecord>>(null)
  useEffect(() => {
    sharedMapRepo.allWithoutData().then(data => {
      setLevel(data[0].id)
      setStages(data)
    }).catch(error => {
      alert(error.message)
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(parseInt(e.target.value))
  }

  return (
    <div>
      <div>
        <button onClick={() => setTab(1)}>demo试玩</button>
        <button onClick={() => setTab(2)}>地图编辑器</button>
      </div>
      <div style={{display: tab == 1 ? 'block' : 'none'}}>
        <ul>
          <li>存储使用WebSQL，相当于本地存储。如果你的浏览器不支持WebSQL，很遗憾demo也看不到</li>
          <li>你看到的第一关是自动导入的，你可以使用地图编辑器自己设计关卡</li>
          <li>无任何联网功能，再次声明数据都保存在本地</li>
          <li>地图编辑器有时会有地图重叠的bug</li>
          <li>地图预览，地图排序功能没实现，毕竟是本地数据库，保存图片恐怕占用空间太大</li>
          <li>如果你的浏览器不支持WebSQL，你可以下载代码倒退几个版本，那时候没做选关，只有demo关卡体验</li>
          <li>兴趣作品，恐怕不会再更新了</li>
          <li>原来设计地图编辑器时，只想到这种交互，后来发现不方便，有空会考虑换个交互方式</li>
        </ul>
        <label>关卡选择</label>
        {
          stages == null ? <label>无数据</label> : (
            <>
              <select value={level} onChange={handleChange}>
              {
                stages.map(record => (
                  <option value={ record.id } key={ record.id }>{ record.id }</option>
                ))
              }
              </select>
              <Game level={level} onSuccess={() => alert('you win')} />
            </>
          )
        }
      </div>
      <div style={{display: tab == 2 ? 'block' : 'none'}}>
        <MapEditor onSaveMap={(map: GameMap) => {
          sharedMapRepo.store({
            id: 0,
            mapData: GameMap.serialize(map)
          }).then(() => {
            alert('save success')
          }).catch(error => {
            alert(error.message)
          })
        }} />
      </div>
    </div>
  )
}
