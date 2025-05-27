"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebar_items } from "@/utils";
import Image from "next/image";
import logo from "../../../public/imgs/header.png";
import logout from "../../../public/svgs/logout.svg"
export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-[200px] h-screen bg-white  p-4 flex flex-col justify-between shadow-lg overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <Image src={logo} alt="noimg" />
        </div>

        <nav className="flex-1   pr-2">
          <div className="flex flex-col gap-2">
            {sidebar_items.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link href={item.path} key={item.id}>
                  <div
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg relative group transition-all
                      ${isActive ? "bg-[#e6f0ff]" : "hover:bg-[#f0f7ff]"}`}
                  >
                    <Image src={item.icon} alt="noiMG" className="!w-5 !h-5" />

                    <span
                      className={`text-[15px] font-semibold transition-colors ${
                        isActive
                          ? "text-[#3f8cff]"
                          : "text-[#7d8592] group-hover:text-[#3f8cff]"
                      }`}
                    >
                      {item.title}
                    </span>
                    {isActive && (
                      <div className="w-[4px] h-9 bg-[#3f8cff] absolute -right-[12px] rounded-full"></div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
      <div className=" flex flex-col gap-4">
   

        <Link
          href="/sign-in"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#f0f7ff] transition"
        >
          <Image src={logout} alt="logout" className="w-5 h-5" />

          <span className="text-[15px] font-semibold text-[#7d8592] hover:text-[#3f8cff]">
            Logout
          </span>
        </Link>
      </div>
    </aside>
  );
}
