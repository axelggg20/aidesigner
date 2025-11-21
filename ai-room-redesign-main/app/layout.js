
import "./globals.css";
import {Outfit} from 'next/font/google'
import Provider from "./provider";

export const metadata = {
  title: "AI Room Design",
  description: "Transform your room with AI-powered design",
};

const outfit=Outfit({subsets:['latin']})

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={outfit.className}
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
