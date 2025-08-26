import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="navbar flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>
        <Link href="/clear-session" className="text-sm text-gray-600">
          <button className="text-lg text-white border-2 border-amber-50 rounded-2xl bg-amber-500
          px-6 py-2  font-bold hover:bg-amber-400 shadow-lg hover:shadow-xl active:translate-y-1 transition-all">Sign Out</button>
        </Link>
      </nav>

      {children}
    </div>
  );
};

export default Layout;
