
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import {Outfit} from 'next/font/google'
import Provider from "./provider";
import { auth } from "@/auth";


export const metadata = {
  title: "AI Room Design",
  description: "Transform your room with AI-powered design",
};

const outfit=Outfit({subsets:['latin']})

export default async function RootLayout({ children }) {
  const session = await auth();
  
  return (
    <html lang="en">
      <body
        className={outfit.className}
      >
        <SessionProvider session={session}>
          <Provider>
            {children}
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
