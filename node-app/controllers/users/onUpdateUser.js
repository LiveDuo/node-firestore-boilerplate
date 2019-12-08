import { pubsub } from '../../services/pubsub/google'

import { verifyTokenWebSockets } from '../../services/authentication/verifyToken'

// setInterval(() => {
//   pubsub.publish('USER_UPDATED', { message: 'message' })
// }, 3000)

const onConnection = async (ws, request) => {

  let tokenDecoded
  try {
    const authHeader = request.headers['sec-websocket-protocol']
    tokenDecoded = await verifyTokenWebSockets(authHeader)
  } catch (error) {
      console.log(error.message)
      ws.close()
      throw new Error('Authentication failed')
  }
  console.log(tokenDecoded)

  pubsub.on('USER_UPDATED', (data) => onUpdateUser(ws, data))
}

const onClose = () => {
  console.log('disconnected')
}

const onUpdateUser = (ws, data) => {
  ws.send(JSON.stringify(data))
}

export default { onConnection, onClose }