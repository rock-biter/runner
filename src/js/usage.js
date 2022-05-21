import { doc, increment, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

const SHARDS_NUMBER = 5

const incrementPlayCounter = () => {

  const shard = getRandomShard()

  const playCounterRef = doc(db,'playCounters',shard);
  updateDoc( playCounterRef, { count: increment(1) } )

}

const incrementJumpCounter = () => {

  const shard = getRandomShard()
  const jumpCounterRef = doc(db,'jumpCounters',shard);
  updateDoc( jumpCounterRef, { count: increment(1) } )

}

const incrementDistanceCounter = (n) => {

  const shard = getRandomShard()
  const distanceCounterRef = doc(db,'distanceCounters',shard);
  updateDoc( distanceCounterRef, { count: increment(n) } )

}

const getRandomShard = () => {
  return Math.floor( Math.random() * SHARDS_NUMBER ).toString()
}

export { 
  incrementPlayCounter, 
  incrementJumpCounter, 
  incrementDistanceCounter 
}
