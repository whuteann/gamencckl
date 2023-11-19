import BaseButton from '@/components/atoms/Buttons/BaseButton';
import { GAME, GAME_COLLECTION } from '@/src/types/collections';
import { UserType } from '@/src/types/documents';
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';


export default function Game() {


  const router = useRouter();
  const [message, setMessage] = useState("");

  const startGameButtonClick = async () => {

    const q = query(GAME, where("winner_determined", "==", false))
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      const currentTime = new Date();

      await addDoc(GAME, {
        winner_determined: false,

        created_at: currentTime
      })

      return setMessage("Game created successfully");
    }

    setMessage("A game is currently ongoing")
    return
  }

  return (
    <div className='flex flex-col h-screen p-10 border overflow-y-auto'>
      <div className='w-1/4 ml-auto'>
        <BaseButton clickFunction={() => {
          router.push("/admin/dashboard")
        }}>
          Back
        </BaseButton>
      </div>

      <h1 className='text-3xl mb-5'>Start Game</h1>
      <label>Click on the button below to start the game: </label>
      {
        message
          ?
          <p className='text-xl text-center mt-5'>{message}</p>
          :
          <></>
      }
      <div className='flex flex-col items-center w-full mt-10'>
        <div
          onClick={() => {
            startGameButtonClick()
          }}
          className="bg-red-500 rounded-full shadow-md mb-4 h-60 w-60 flex justify-center items-center hover:bg-red-600 hover:text-white"
        >
          <h2 className="font-semibold mb-2 text-center">Start</h2>
        </div>
      </div>
    </div >
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const user: UserType = (session as any)?.currentUser || null;

  console.log(user);
  if (!user || user.role == "User") {
    return {
      redirect: {
        permanent: false,
        destination: `/admin`,
      },
      props: {},
    };
  }

  return {
    props: {
    }
  }
}
