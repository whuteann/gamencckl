import BaseButton from '@/components/atoms/Buttons/BaseButton';
import { updateUserCredit, deleteUser } from '@/src/services/UserServices';
import { docRef, USERS, USERS_COLLECTION } from '@/src/types/collections';
import { UserType } from '@/src/types/documents';
import { getDoc } from 'firebase/firestore';
import { Field, Form, Formik } from 'formik';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface HomeProps {
  userData: UserType
}

export default function Users({ userData }: HomeProps) {
  console.log(userData);

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>();

  const router = useRouter();

  const updateCredits = (values: { amount: string, increase: string }) => {
    setLoading(true);
    updateUserCredit(userData.id!!, values, () => {
      router.reload()
      setLoading(false);
    }, () => {
      setLoading(false);
    });
  }

  return (
    <div className='flex flex-col h-screen p-10 border boder-black overflow-y-auto'>
      <div className='w-1/4 ml-auto'>
        <BaseButton clickFunction={() => {
          router.back()
        }}>
          Back
        </BaseButton>
      </div>
      <h1 className='text-3xl mt-2'>Users: {userData?.name}</h1>

      <div className='border border-gray-300 mt-5 mb-5' />

      <div className="flex flex-col items-start">
        <div className="flex items-center">
          <h3 className='mr-5'>Credits: </h3>
          <h2 className="font-bold mr-2">$</h2>
          <h1 className="font-bold text-6xl">{userData?.credits}</h1>
        </div>
      </div>
      <div className='mt-5' />
      <BaseButton
        clickFunction={()=>{
          deleteUser(userData.id!, ()=>{
            router.push("/admin/dashboard/users")
          }, ()=>{

          })
        }}
        type='button'
      >
        Delete User
      </BaseButton>

      <div className='mt-auto' />
      <Formik
        initialValues={{
          amount: "",
          increase: "plus"
        }}
        onSubmit={(values) => {
          updateCredits(values);
        }}
      >
        {({ touched, errors, setFieldValue, values }) => (
          <Form>
            <div className=" flex flex-col items-start w-full">

              <label className="">
                Enter amount:
              </label>
              <div className="w-full">
                <Field
                  id="amount"
                  name="amount"
                  type="text"
                  className=""
                />
              </div>
              <div className='flex flex-row w-full justify-between mb-10 mt-5'>
                <div className='w-[49%]'>
                  <BaseButton
                    type='button'
                    color={values.increase == "minus" ? "red" : "#c90000"}
                    clickFunction={() => {
                      setFieldValue("increase", "minus")
                    }}
                  >
                    -
                  </BaseButton>
                </div>
                <div className='w-[49%]'>
                  <BaseButton
                    type='button'
                    color={values.increase == "plus" ? "#4ff02b" : "green"}
                    clickFunction={() => {
                      setFieldValue("increase", "plus")
                    }}
                  >
                    +
                  </BaseButton>
                </div>
              </div>

              <div className='mb-32' />


              <BaseButton type='submit' isLoading={loading}>
                Commit Change
              </BaseButton>
            </div>

            {
              error
                ?
                <p className='mt-3 text-red-600 text-base font-bold'>{error}</p>
                :
                <></>
            }
          </Form>
        )}
      </Formik>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const user: UserType = (session as any)?.currentUser || null;
  const userId = context.query.id

  if (!user || user.role == "User") {
    return {
      redirect: {
        permanent: false,
        destination: `/admin`,
      },
      props: {},
    };
  }

  const snapshot = await getDoc(docRef(USERS_COLLECTION, userId || "-"))

  if (!snapshot.exists()) {
    return {
      redirect: {
        permanent: false,
        destination: `/admin/dashboard/users`,
      },
      props: {},
    };
  }

  const userData = {
    id: snapshot.id,
    ...snapshot.data()
  };

  return {
    props: {
      userData: JSON.parse(JSON.stringify(userData)),
    }
  }
}
