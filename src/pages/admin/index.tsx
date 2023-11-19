import BaseButton from '@/components/atoms/Buttons/BaseButton';
import { login, loginAdmin } from '@/src/services/AuthServices';
import { UserType } from '@/src/types/documents';
import { Field, Form, Formik } from 'formik';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const AdminLogin = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const loginUser = (values: { name: string, password: string }) => {
    setLoading(true);
    loginAdmin(values, (url) => {
      setLoading(false);
      router.push(url);
    }, (errmsg) => {
      setLoading(false);
      setError(errmsg)
    })
    console.log(values);
  }

  return (
    <div className='p-6 py-8 overflow-y-auto'>
      <div className='bg-themeColorDark p-2 mb-5'>
        <h1 className='text-white'>
          Admin Dashboard
        </h1>
      </div>
      <h1>Login</h1>
      <div className='mt-7'>
        <Formik
          initialValues={{
            name: "",
            password: ""
          }}
          onSubmit={(values) => {
            loginUser(values);
          }}
        >
          {({ touched, errors }) => (
            <Form>
              <div className="space-y-4 flex flex-col items-start w-full">

                <label className="">
                  Name
                </label>
                <div className="w-full">
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className=""
                  />
                </div>

                <label className="">
                  Password
                </label>
                <div className="w-full">
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className=""
                  />
                </div>
                <div className='mb-5' />

                <BaseButton type='submit' isLoading={loading}>
                  Login
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
    </div>
  )
}

export default AdminLogin;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const user: UserType = (session as any)?.currentUser || null;

  if (user) {
    if(user.role == "User"){
      return {
        redirect: {
          permanent: false,
          destination: `/`,
        },
        props: {},
      };
    }
    
    return {
      redirect: {
        permanent: false,
        destination: `/admin/dashboard`,
      },
      props: {},
    };
  }

  return {
    props: {}
  }
}