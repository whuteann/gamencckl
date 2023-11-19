import { addDoc, collection, getDocs, orderBy, query, setDoc, where } from "firebase/firestore"
import { docRef, GAME, GAME_COLLECTION } from "../types/collections"

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

export const winnersLogic = async (usersName: string) =>{
  
  const q = query(GAME, where("winner_determined", "==", false))
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null
  }

  const currentTime = new Date();
  await addDoc(collection(docRef(GAME_COLLECTION, snapshot.docs[0].id), 'participants'), {
    uid: usersName,
    pressed_at: currentTime
  })

  await setDoc(docRef(GAME_COLLECTION, snapshot.docs[0].id), {
    winner_determined: true,
  }, {merge: true})

  return snapshot.docs[0].id
}

export function findFastestUser(users: Array<{uid: string, pressed_at: Date}>) {
  if (!users || users.length === 0) {
    // Handle the case where the array is empty or undefined
    return null;
  }

  // Find the object with the earliest pressed_at timestamp
  const fastestUser = users.reduce((minUser, currentUser) => {
    const currentTimestamp = currentUser.pressed_at;
    const minTimestamp = minUser.pressed_at;

    return currentTimestamp < minTimestamp ? currentUser : minUser;
  }, users[0]);

  // Return the uid of the fastest user
  return fastestUser.uid;
}