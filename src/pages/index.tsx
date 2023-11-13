import BaseButton from '@/components/atoms/Buttons/BaseButton';
import { getSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getUser } from '../services/AuthServices';
import { UserType } from '../types/documents';

interface HomeProps {
  user: UserType
}

export default function Home({ user }: HomeProps) {

  const [userData, setUserData] = useState<UserType | undefined>(undefined);

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
      <div className="bg-white rounded-md shadow-md p-4 mb-4">
        <h1 className="font-semibold mb-2">Hi, {user.name}</h1>
        <p className="text-gray-600">Here is how many credits you own.</p>
      </div>

      <div className="flex flex-col items-end mt-32">
        <div className="flex items-center">
          <h2 className="font-bold mr-2">$</h2>
          <h1 className="font-bold text-6xl">{userData?.credits}</h1>
        </div>
        <p className="text-sm mt-2">Available Credits</p>
      </div>

      <div className='w-full mt-auto'>
        <BaseButton type='button' clickFunction={() => {
          logout();
        }} isLoading={false} className='transition-all border-2 border-transparent w-full font-bold bg-themeColorLighter text-themeColorDark hover:bg-themeColorDark hover:text-white p-2 rounded-md'>
          Click Here to Log Out
        </BaseButton>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const user: UserType = (session as any)?.currentUser || null;

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: `/login`,
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
