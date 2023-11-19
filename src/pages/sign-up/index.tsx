import BaseButton from '@/components/atoms/Buttons/BaseButton';
import { createUser } from '@/src/services/AuthServices';
import { UserType } from '@/src/types/documents';
import { Field, Form, Formik } from 'formik';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const SignUp = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const signUpSubmit = (values: { name: string, password: string, confirmPassword: string }) => {
    setLoading(true);

    createUser(values, () => {
      setLoading(false);
      router.push("/login");
    }, (errmsg) => {
      setLoading(false);
      setError(errmsg);
    })
  }

  return (
    <div className='p-6 py-8 overflow-y-auto'>
      <div className='bg-themeColorDark p-2 mb-5'>
        <h1 className='text-white'>
          Lifeline and Abide Christmas Games App
        </h1>
      </div>
      <h1>Sign Up Now!</h1>
      <p className='mt-3 text-base'>Please make sure to remember your password, and do note that the Admin can see your password. </p>
      <div className='mt-7'>
        <Formik
          initialValues={{
            name: "",
            password: "",
            confirmPassword: ""
          }}
          onSubmit={(values) => {
            signUpSubmit(values);
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

                <label className="">
                  Confirm password
                </label>
                <div className="w-full">
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className=""
                  />
                </div>
                <Link className='text-themeColorMain' href={'/login'}>Already have an account? Login now!</Link>
                <div className='mb-5' />

                <BaseButton type='submit' isLoading={loading}>
                  Sign Up
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

export default SignUp;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const user: UserType = (session as any)?.currentUser || null;

  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
      props: {},
    };
  }

  return {
    props: {}
  }
}