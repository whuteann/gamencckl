import { addDoc, collection, deleteDoc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore"
import { convertFirebaseDateObj } from "../helpers/AppHelper"
import { docRef, GAME, GAME_COLLECTION } from "../types/collections"

export const getWinners = async () => {

  const q = await query(GAME, orderBy("created_at", "desc"))

  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    return []
  }

  const promises = snapshot.docs.map(async (item) => {

    if (item.data().winner) {
      console.log("pills");
      return {
        id: item.id,
        ...item.data()
      }

    } else {
      console.log("nothing is ran")
      const subcollectionRef = collection(docRef(GAME_COLLECTION, item.id), 'participants');

      return await getDocs(subcollectionRef).then(async (snapshots) => {
        const users = snapshots.docs.map((doc) => {
          return {
            uid: doc.data().uid,
            pressed_at: convertFirebaseDateObj(doc.data().pressed_at)
          }
        });

        const fastest = findFastestUser(users);

        await setDoc(docRef(GAME_COLLECTION, item.id), {
          winner: fastest
        }, { merge: true })

        return {
          id: item.id,
          winner: fastest,
          ...item.data()
        }
      })
    }
  })

  const data = await Promise.all(promises)

  return data;
}

export const deleteAllSessions = async (onSuccess:()=>void) =>{
  await getDocs(GAME).then(async (snapshots) => {
    const deletionPromises = snapshots.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
    });
  
    // Wait for all deletions to complete
    await Promise.all(deletionPromises);
  
  });

  onSuccess();
}

export const winnersLogic = async (usersName: string) => {

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
  }, { merge: true })

  return snapshot.docs[0].id
}

export function findFastestUser(users: Array<{ uid: string, pressed_at: Date }>) {
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