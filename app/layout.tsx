import "./globals.css";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import lang from "@/dictionaries/lang.json";

const inter = Inter({ subsets: ["latin"] });

const currentMonth = () => {
  const currentDate = new Date();
  return `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const statsLink = `/stats/${currentMonth()}`;

  return (
    <ClerkProvider>
      <html lang={lang.htmlLang}>
        <body className={`${inter.className} dark`}>
          <header className="flex justify-between items-center px-4 h-12 border-b">
            <Link href="/">{lang.header.title}</Link>
            <Link href={statsLink}>{lang.header.stats}</Link>
            <div className="h-8 w-8">
              <SignedIn>{<UserButton afterSignOutUrl="/" />}</SignedIn>
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
