import BaseButton from '@/components/atoms/Buttons/BaseButton';
import { getUsers } from '@/src/services/UserServices';
import { UserType } from '@/src/types/documents';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


export default function Users() {

  const [users, setUsers] = useState<Array<UserType>>([]);

  const router = useRouter();

  useEffect(() => {
    getUsers().then(users => {
      setUsers(users as Array<UserType>)
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
      <h1 className='text-3xl'>All Users</h1>

      <div className='mt-5'>
        {
          users.length > 0
            ?
            users.map(user => {
              return (
                <div id={user.id} onClick={() => {
                  router.push(`/admin/dashboard/users/${user.id}`)
                  console.log(user.id)
                }} className={`w-full ${user.role == "Admin" ? "bg-red-400": "bg-blue-400"} rounded-md shadow-md p-4 mb-3`}>
                  <h3>{user.name}</h3>
                  <p className='text-lg'>Credits: ${user.credits}</p>
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
