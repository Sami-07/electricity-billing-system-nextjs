
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { User } from "../../../../models/user.js"
import { connectDB } from "@/middleware/mongoose.js";

export const authOptions = {
    
    pages: {
        signIn: "/signin"
    },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials) {
                console.log("inside");
                await connectDB();
                const user = await User.findOne({ email: credentials.email })
                // console.log(user);
                if (!user) {
                    return null;
                }
                const isPasswordCorrect = await user.isPasswordCorrect(credentials.password);
                if (!isPasswordCorrect) {
                    return null;
                }
                return user;
            }
        })
    ],
    callbacks: {


        jwt: async ({token, user}) => {
            // console.log("Output", token);
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.userName;
                token.role = user.role;

            }
            return token;
        },
        session: async ({ session, token }) => {
            // console.log("session", session);
            // console.log("token", token);
            session.user = token;
            console.log("session", session);
            return session;
        }
    }
}

export const getServerAuthSession = () => getServerSession(authOptions);