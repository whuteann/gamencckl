import BaseButton from '@/components/atoms/Buttons/BaseButton';
import { getUsers, updateMultipleUserCredit } from '@/src/services/UserServices';
import { UserType } from '@/src/types/documents';
import { user } from 'firebase-functions/v1/auth';
import { Field, Form, Formik } from 'formik';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


export default function TopUpMultiple() {

  const [users, setUsers] = useState<Array<UserType>>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
      <h1 className='text-3xl mb-5'>Select Users to top up</h1>
      <label>Select Users to Update:</label>
      <Formik
        initialValues={{
          users: [],
          amount: "",
          increase: "plus"
        } as {
          users: Array<string>,
          increase: string,
          amount: string
        }}
        onSubmit={(values) => {
          // Handle form submission with selected values
          console.log('Selected Options:', values.users);
          updateMultipleUserCredit(
            values.users,
            { amount: values.amount, increase: values.increase },
            () => {
              router.push("/admin/dashboard/users");
            }, () => {

            }
          );
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className='mt-3 overflow-y-auto h-[340px]'>

              <div role="group" aria-labelledby="checkbox-group">
                {
                  users && users.length > 0
                    ?

                    users.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => {
                          // Toggle the checkbox value
                          const newValues = values.users.includes(user.id!!)
                            ? values.users.filter((id) => id !== user.id)
                            : [...values.users, user.id];
                          // Update Formik state
                          setFieldValue('users', newValues);
                        }}
                        className={`flex flex-row space-x-4 ${values.users.includes(user.id!!) ? "bg-red-200" : "bg-blue-200"}  rounded-md p-3 mb-2`}
                      >
                        <Field type="checkbox" name="users" value={user.id} />
                        <p className='font-bold text-xl'>{user.name}</p>
                      </div>
                    ))
                    :
                    <></>
                }
              </div>
            </div>
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
            <div>
              <BaseButton type='submit' isLoading={loading}>
                Commit Change
              </BaseButton>
            </div>
          </Form>
        )}
      </Formik>
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
