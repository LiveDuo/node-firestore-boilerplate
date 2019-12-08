import http from 'http'

import { app } from '../http/express'

import { config } from '../../services/globals/config'

import url from 'url'

import { wsses } from '../../controllers/router/websockets'

const server = http.createServer()

const onUpgrade = (request, socket, head) => {
  const pathname = url.parse(request.url).pathname

  const found = wsses.find((wss) => wss.pathname === pathname )
  if (found) {
    found.wss.handleUpgrade(request, socket, head, (ws) => {
      found.wss.emit('connection', ws, request)
    })
  } else {
    socket.destroy()
  }
}

server.on('request', app)
server.on('upgrade', onUpgrade)

const listen = () => server.listen(config.defaultPort, () => console.log(`Express with websockets listening on port ${server.address().port}`))

export { listen }