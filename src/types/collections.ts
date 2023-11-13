import { firestore } from "@/firebase/config";
import { collection, doc } from "firebase/firestore";

export const docRef = (collection: string, id: string) =>{
  return doc(firestore, collection, id)
}

export const USERS_COLLECTION = "users";
export const USERS = collection(firestore, USERS_COLLECTION);