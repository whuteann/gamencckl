import { getDocs, orderBy, query } from "firebase/firestore"
import { GAME, GAME_COLLECTION } from "../types/collections"

export const getWinners = async () =>{

  const q = await query(GAME, orderBy("created_at", "desc"))

  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    return []
  }

  return snapshot.docs.map(item => {
    return {
      id: item.id,
      ...item.data()
    }
  })
}