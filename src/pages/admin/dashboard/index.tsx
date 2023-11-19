import BaseButton from '@/components/atoms/Buttons/BaseButton';
import { getUser } from '@/src/services/AuthServices';
import { UserType } from '@/src/types/documents';
import { getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface HomeProps {
  user: UserType
}

export default function Home({ user }: HomeProps) {

  const [userData, setUserData] = useState<UserType | undefined>(undefined);
  const router = useRouter();

  const logout = async () => {
    await signOut({
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    });
  }

  useEffect(() => {
    getUser(user.name).then((user) => {
      const data: UserType = user as UserType
      setUserData(data);
    })
  }, [])

  return (
    <div className='flex flex-col h-screen p-10 border boder-black'>
      <h1 className="font-semibold mb-2 text-xl">Admin Dashboard</h1>

      <div className='w-full'>
        <BaseButton type='button' clickFunction={() => {
          logout();
        }} isLoading={false}>
          Click Here to Log Out
        </BaseButton>
      </div>

      <div className='border border-gray-200 mt-10 mb-10' />

      <div
        onClick={() => {
          router.push("/admin/dashboard/users");
        }}
        className="bg-blue-400 rounded-md shadow-md p-4 mb-4 h-32 flex justify-center items-center hover:bg-blue-600 hover:text-white"
      >
        <h2 className="font-semibold mb-2 text-center">View All Users</h2>
      </div>
      <div
        onClick={() => {
          router.push("/admin/dashboard/top-up-multiple");
        }}
        className="bg-red-400 rounded-md shadow-md p-4 mb-4 h-32 flex justify-center items-center hover:bg-red-600 hover:text-white"
      >
        <h2 className="font-semibold mb-2 text-center">Top Up Multiple</h2>
      </div>
      <div
        onClick={() => {
          router.push("/admin/dashboard/game");
        }}
        className="bg-purple-400 rounded-md shadow-md p-4 mb-4 h-32 flex justify-center items-center hover:bg-purple-600 hover:text-white"
      >
        <h2 className="font-semibold mb-2 text-center">Start Game</h2>
      </div>
      <div
        onClick={() => {
          router.push("/admin/dashboard/winners");
        }}
        className="bg-green-400 rounded-md shadow-md p-4 mb-4 h-32 flex justify-center items-center hover:bg-green-600 hover:text-white"
      >
        <h2 className="font-semibold mb-2 text-center">List of Winners</h2>
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
      user: JSON.parse(JSON.stringify(user)),
    }
  }
}
