import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from '@/lib/mongodb';
import autoprefixer from 'autoprefixer';

const adminEmails = ['tobiasrf22@gmail.com']

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ token, session, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false
      }

    },
  },
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),

  ]
}

export default NextAuth(authOptions);

export const isAdminRequest=async (req,res)=>{
  const session = await getServerSession(req,res,authOptions);
  if (!adminEmails.includes(session?.user?.email)){
    res.status(401);
    res.end();
    throw 'not an admin'
  }
}

//https://youtu.be/dTFXufTgfOE?si=92cSChJ60bS4gtf8&t=20095