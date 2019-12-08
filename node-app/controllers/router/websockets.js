import onUpdateUser from '../../controllers/users/onUpdateUser'

import WebSocket from 'ws'

const WebSocketServer = (subscriber) => {
  const wss = new WebSocket.Server({ noServer: true })
  wss.on('connection', subscriber.onConnection)
  wss.on('close', subscriber.onClose)
  return wss
}

const wsses = [
  { pathname: '/onUpdateUser', wss: WebSocketServer(onUpdateUser) }, 
  { pathname: '/test', wss: WebSocketServer(onUpdateUser) }
]

export { wsses }