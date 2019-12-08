
import { PubSub } from '@google-cloud/pubsub'

const topic2SubName = topicName => `${topicName}-subscription`
const commonMessageHandler = ({attributes = {}, data = ''}) => JSON.parse(data.toString())

const options = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY
  }
}

const pubsub = new PubSub(options)

const getSubscription = async (topicName) => {
  let subName = topic2SubName(topicName)

  const sub = pubsub.subscription(subName)
  const [exists] = await sub.exists()
  if (exists) {
    return sub
  } else {
    const [newSub] = await pubsub.topic(topicName).createSubscription(subName)
    return newSub
  }
}

// pubsub.on('USER_UPDATED', (data) => onUpdateUser(ws, data))

const on = async (topicName, callback) => {
  let subscription = await getSubscription(topicName)

  subscription.on('message', (message) => {
    message.ack()
    try {
      let obj = commonMessageHandler(message)
      callback(obj)
    } catch (error) {
      console.log(error.message)
    }
  })
  subscription.on('error', () => {
    console.log(error.message)
  })

  subscription.unsubscribe = () => {
    subscription.removeListener('message', subscription._events.message)
    subscription.removeListener('error', subscription._events.error)
  }

  return subscription
}
pubsub.on = on

// pubsub.publish('USER_UPDATED', { onUpdateUser: { first_name: Math.random().toString() }})

const publish = async (topicName, data) => {
  let dataString = JSON.stringify(data)
  await pubsub.topic(topicName).publish(Buffer.from(dataString))
}
pubsub.publish = publish

export { pubsub }
