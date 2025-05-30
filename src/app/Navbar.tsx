import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";

import logo from "@/assets/logo.png";
import SearchField from "@/components/SearchField";

export default async function Navbar() {
  return (
    <header className="bg-background shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 p-5">
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/" className="flex items-center gap-4">
            <Image src={logo} alt="Flow Shop logo" width={40} height={40} />
            <span className="text-xl font-bold">Flow Shop</span>
          </Link>

          <SearchField className="hidden max-w-96 lg:inline" />
          <div className="flex items-center justify-center gap-5">
            <User />
          </div>
        </div>
      </div>
    </header>
  );
}
