import { addDoc, collection, doc, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'

export default class Ranking {

  ranking = []
  bestScore = null
  unsubscribe = null

  constructor() {

    this.fetchRanking()

  }

  fetchRanking() {
    if(this.unsubscribe) return

    const q = query( collection( db, 'ranking'),orderBy('points','desc'), limit(100) )

    this.unsubscribe = onSnapshot( q, querySnapshot => {

      const ranking = []

      querySnapshot.forEach( (doc) => {
        ranking.push({
          ...doc.data()
        })
      })

      // SET BEST SCORE
      const [bestScoreDoc] = ranking
      this.bestScore = bestScoreDoc?.points ?? 0

      //SET 100 BEST SCORES
      this.ranking = ranking
      // emit ranking change
      window.dispatchEvent( new CustomEvent('rankingChange') )
    })

  }

  addNewScore(score) {

    if(isNaN( score ) || score < this.bestScore ) return

    const docRef = addDoc( collection(db,'ranking'), {
      points: parseInt(score),
      data: new Date()
    }).then(() => {
      console.log('document written with ID: ', docRef.id);
    })


  }


}