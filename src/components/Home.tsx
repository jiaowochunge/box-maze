import React, { useState } from 'react'
import { MapEditor } from 'components/MapEditor'
import { Game } from 'components/Game'
import { sharedMapRepo } from 'common/MapRepositoryWebSQLImpl'
import { GameMap } from 'common/GameMap'

import 'assets/css/game.css'

export const Home = () => {
  const [tab, setTab] = useState<number>(1)

  return (
    <div>
      <div>
        <button onClick={() => setTab(1)}>demo试玩</button>
        <button onClick={() => setTab(2)}>地图编辑器</button>
      </div>
      <div style={{display: tab == 1 ? 'block' : 'none'}}>
        <Game level={1} onSuccess={() => alert('you win')} />
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
