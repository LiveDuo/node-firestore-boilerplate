import events from 'events'
let pubsub = new events.EventEmitter()

pubsub.publish = pubsub.emit

// pubsub.on - FIX

export { pubsub }