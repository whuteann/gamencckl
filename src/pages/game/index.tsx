import { generateRandomName, getLocalStorageItem, setLocalStorageItem } from '@/src/helpers/CookieHelper';
import { docRef, GAME, GAME_COLLECTION } from '@/src/types/collections';
import {  getDocs, query, setDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';


export default function Game() {
  const [color, setColor] = useState<string>("");
  const [phoneId, setPhoneId]= useState<string>("");
  const [usersName, setUsersName] = useState<string>("");
  

  useEffect(()=>{
    const cookie = getLocalStorageItem("phoneId");
    let username = ""
  
    console.log("beginning", cookie);
  
    if(!cookie){
      const new_name = generateRandomName()
      setLocalStorageItem("phoneId", new_name)
      username = new_name
    }else{
      username = cookie
    }

    setUsersName(username);
  },[])

  const startGameButtonClick = async () => {

    const q = query(GAME, where("winner_determined", "==", false))
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      setColor("bg-red-500")
      return
    }

    setColor("bg-green-500")
    await setDoc(docRef(GAME_COLLECTION, snapshot.docs[0].id), {
      winner_determined: true,
      winner: usersName
    }, {merge: true})
    return
  }

  return (
    <div className={`flex flex-col h-screen ${color} p-10 border overflow-y-auto`}>
      <h1 className='text-3xl mb-5'>NCCKL Game Show Button</h1>
      <h5 className='text-3xl mb-5'>Your ID: {usersName}</h5>
      {
        color
          ?
          <></>
          :
          <label>Click on the button below to start the game: </label>
      }
      {
        color
          ?
          <></>
          :
          <div className='flex flex-col items-center w-full mt-5'>
            <div
              onClick={() => {
                startGameButtonClick()
              }}
              className="bg-red-500 rounded-full shadow-2xl mb-4 h-72 w-72 flex justify-center items-center hover:bg-red-600 hover:text-white"
            >
              <h2 className="font-semibold mb-2 text-center">Press Me!</h2>
            </div>
          </div>
      }
    </div >
  )
}