import BaseButton from '@/components/atoms/Buttons/BaseButton';
import { convertFirebaseDate } from '@/src/helpers/AppHelper';
import { deleteAllSessions, getWinners } from '@/src/services/GameServices';
import { getUsers } from '@/src/services/UserServices';
import { GameType, UserType } from '@/src/types/documents';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


export default function Winners() {

  const [winners, setWinners] = useState<Array<GameType>>([]);

  const router = useRouter();

  useEffect(() => {
    getWinners().then(items=> {
      setWinners(items as Array<GameType>)
    })
  }, [])

  return (
    <div className='flex flex-col h-screen p-10 border boder-black overflow-y-auto'>
      <div className='w-1/4 ml-auto'>
        <BaseButton clickFunction={() => {
          router.push("/admin/dashboard")
        }}>
          Back
        </BaseButton>
      </div>
      <h1 className='text-3xl'>All Winners and Sessions</h1>
      <BaseButton clickFunction={()=>{
          deleteAllSessions(()=>{
            router.reload();
          });
        }}>
          Clear All
        </BaseButton>

      <div className='mt-5'>
        {
          winners.length > 0
            ?
            winners.map(item => {
              return (
                <div key={item.id} id={item.id} className={`w-full bg-blue-100 rounded-md shadow-md p-4 mb-3`}>
                  <h3>{item.winner || "No winner yet"}</h3>
                  <p className='text-base'>Created At: {`${convertFirebaseDate(item.created_at)}`}</p>
                </div>
              )
            }):
            <></>
        }

      </div>

    </div>
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
