import React, { useState } from 'react'
import { MapEditor } from 'components/MapEditor'
import { Game } from 'components/Game'

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
        <MapEditor onSaveMap={(map) => {console.log(map)}} />
      </div>
    </div>
  )
}
