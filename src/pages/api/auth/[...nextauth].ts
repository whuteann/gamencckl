import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";
import { getDocs, query, where } from "firebase/firestore";
import { USERS } from "@/src/types/collections";
import { UserType } from "@/src/types/documents";

const THIRTY_DAYS = 30 * 24 * 60 * 60
const THIRTY_MINUTES = 30 * 60

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {},
        async authorize(credentials): Promise<any> {

          const name = (credentials as any).name;
          const password = (credentials as any).password;
          console.log(`
          
          `)
          console.log(name, password);

          try {
            const q = query(USERS, where("searchname", "==", name.toLowerCase()));
            const snapshot = await getDocs(q);

            if(!snapshot.empty){
              const userCredential: UserType = (await snapshot.docs[0].data()) as UserType

              if(userCredential.password != password){
                throw new Error("Wrong Password");
              }
              console.log("success")
              return userCredential;
            }else{
              throw new Error("User Doesn't Exist");
            }
            
          } catch (error: any) {
            console.log(`${error.message}`);
            throw new Error(`${error.message}`);
          }
        }
      })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
      maxAge: THIRTY_DAYS,
      updateAge: THIRTY_MINUTES
    },
    callbacks: {
      jwt: async ({ token, user }) => {

        // console.log("ran jwt", req?.url);
        if (req?.url?.includes("update") || req?.url?.includes("credentials")) {
          console.log(`
        
          `)
          console.log("ran query");
          const q = query(USERS, where("searchname", "==", token?.name?.toLowerCase()));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const user = snapshot.docs.map(doc => {
              const userinfo = doc.data();
              delete userinfo.password;
              return {
                id: doc.id,
                ...userinfo
              };
            })[0]

            token.user = {
              ...user
            }
          }
        }

        return token;
      },
      session: ({ session, token }: any) => {
        // console.log("ran session");
        const userData: UserType = {
          id: token.user.id,
          name: token.user.name,
          role: token.user.role,
          credits: token.user.credits
        }

        session.currentUser = userData;

        return session
      },
      redirect: ({ url, baseUrl }) => {

        return url;
      }
    },
    pages: {
      signIn: "/login"
    },


  }
  )
}