import { addDoc, getDocs, query, where } from "firebase/firestore";
import { signIn } from "next-auth/react";
import { USERS } from "../types/collections";
import { UserType } from "../types/documents";

interface SignUpFormFieldsProps {
  name: string,
  password: string,
  confirmPassword: string
}

export const login = async (data: { name: string, password: string }, onSuccess: (url: string) => void, onError: (error: string) => void) => {
  const res: any = await signIn('credentials', {
    redirect: false,
    name: data.name.toLowerCase().trim(),
    password: data.password,
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}`,
  });

  if (res?.error) {
    onError(res.error);
  } else {
    onSuccess(res.url);
  }
}

export const loginAdmin = async (data: { name: string, password: string }, onSuccess: (url: string) => void, onError: (error: string) => void) => {
  const res: any = await signIn('credentials', {
    redirect: false,
    name: data.name.toLowerCase().trim(),
    password: data.password,
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/admin/dashboard`,
  });

  if (res?.error) {
    onError(res.error);
  } else {
    onSuccess(res.url);
  }
}

export const createUser = async (signUpFormFields: SignUpFormFieldsProps, onSuccess: () => void, onError: (message: string) => void) => {
  const { name, password, confirmPassword } = signUpFormFields;

  if (password != confirmPassword) {
    return onError("Password does not match")
  }

  const userSnapshot = (await getDocs(query(USERS, where('searchname', "==", name.toLowerCase()))))

  const docdata: UserType = {
    name: name,
    searchname: name.toLowerCase(),
    password: password,
    role: "User",
    credits: 0,
    created_at: new Date()
  };

  if (userSnapshot.empty) {
    return await addDoc(USERS, docdata).then(() => {
      onSuccess();
    }).catch((e) => {
      console.log(e);
      onError("Error has occurred")
    })

  } else {
    return onError("Name is already Taken")
  }
}

export const getUser = async (username: string) => {
  const queryObj = query(USERS, where('searchname', "==", username.toLowerCase()))

  const snapshot = await getDocs(queryObj)

  if (snapshot.empty) {
    return null
  } else {
    return snapshot.docs[0].data()
  }
}