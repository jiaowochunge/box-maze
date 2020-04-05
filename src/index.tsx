import React from 'react'
import ReactDOM from 'react-dom'

import { Game } from 'components/Game'

ReactDOM.render(
  <Game level={1} onSuccess={() => alert('you win')} />,
  document.getElementById('app')
)
