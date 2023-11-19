import { deleteDoc, getDocs, increment, query, updateDoc } from "firebase/firestore"
import { docRef, USERS, USERS_COLLECTION } from "../types/collections"

export const getUsers = async () => {
  const snapshot = await getDocs(USERS)

  if (snapshot.empty) {
    return []
  }

  return snapshot.docs.map(user => {
    return {
      id: user.id,
      ...user.data()
    }
  })
}

export const deleteUser = async (id: string, onSuccess: () => void, onError: () => void) => {
  await deleteDoc(docRef(USERS_COLLECTION, id))
    .then(() => {
      onSuccess();
    }).catch((e) => {
      console.log(e);
      onError();
    })
}

export const updateUserCredit = async (
  id: string,
  values: { amount: string, increase: string },
  onSuccess: () => void,
  onError: () => void,
) => {

  const amount: number = values.increase == "plus" ? Number(values.amount) : -Number(values.amount)

  await updateDoc(docRef(USERS_COLLECTION, id), {
    credits: increment(amount)
  }).then(() => {
    onSuccess();
  }).catch((e) => {
    console.log(e);
    onError();
  })
}

export const updateMultipleUserCredit = async (
  ids: Array<string>,
  values: { amount: string, increase: string },
  onSuccess: () => void,
  onError: () => void,
) => {

  try {
    const amount: number = values.increase == "plus" ? Number(values.amount) : -Number(values.amount)

    const promises = ids.map(async (id) => {
      return await updateDoc(docRef(USERS_COLLECTION, id), {
        credits: increment(amount)
      })
    })

    await Promise.all(promises)

    onSuccess()
  } catch (error) {
    console.log(error);
    onError()
  }
}