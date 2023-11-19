import BaseButton from '@/components/atoms/Buttons/BaseButton';
import { convertFirebaseDateObj } from '@/src/helpers/AppHelper';
import { generateRandomName, getLocalStorageItem, setLocalStorageItem } from '@/src/helpers/CookieHelper';
import { findFastestUser, winnersLogic } from '@/src/services/GameServices';
import { docRef, GAME, GAME_COLLECTION } from '@/src/types/collections';
import { collection, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


export default function Game() {
  const [color, setColor] = useState<string>("");
  const router = useRouter();
  const [usersName, setUsersName] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");


  useEffect(() => {
    const cookie = getLocalStorageItem("phoneId");
    let username = ""

    console.log("beginning", cookie);

    if (!cookie) {
      const new_name = generateRandomName()
      setLocalStorageItem("phoneId", new_name)
      username = new_name
    } else {
      username = cookie
    }

    setUsersName(username);
  }, [])

  useEffect(() => {
    if (gameId) {
      const subcollectionRef = collection(docRef(GAME_COLLECTION, gameId), 'participants');

      getDocs(subcollectionRef).then(snapshots => {
        const users = snapshots.docs.map((doc) => {
          return {
            uid: doc.data().uid,
            pressed_at: convertFirebaseDateObj(doc.data().pressed_at)
          }
        });

        const fastest = findFastestUser(users);

        if (usersName == fastest) {
          setColor("bg-green-500")
        } else {
          setColor("bg-red-500")
        }
      })
    }
  }, [gameId])

  const startGameButtonClick = async () => {
    const result = await winnersLogic(usersName);

    if (!result) {
      setColor("bg-red-500")
    } else {
      setGameId(result)
    }
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
      <div className='mt-auto'>
        <BaseButton color='#ff8080' clickFunction={()=>{
          router.reload()
        }}>
          Reset Button
        </BaseButton>
      </div>
    </div >
  )
}