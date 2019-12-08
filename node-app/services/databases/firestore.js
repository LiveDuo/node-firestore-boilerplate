import Firestore from '@google-cloud/firestore'

let firestore

const connect = async () => {
  firestore = new Firestore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: {
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY
    }
  })
  return true
}

const quickstart = async () => {
  const newItem = {
    name: 'The First Item',
    description: 'This item is useless',
  }
  await firestore.collection('items').add(newItem)
  console.log('added again')
}

export { connect, firestore, quickstart }