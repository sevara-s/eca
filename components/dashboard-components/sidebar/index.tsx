"use client";
import { useEffect, useState } from "react";
import { owner_items, master_items } from "@/utils"; 
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../../public/imgs/header.png";
import logout from "../../../public/svgs/logout.svg";
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  accountType?: 'MASTER' | 'OWNER';
}

export default function Sidebar() {
  const [accountType, setAccountType] = useState<'MASTER' | 'OWNER' | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token2') || localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.accountType === "MASTER" || decoded.accountType === "OWNER") {
          setAccountType(decoded.accountType);
        }
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    localStorage.removeItem("token");
    router.push("/login");  
  };

   
  const getMenuItems = () => {
    if (accountType === "MASTER") return master_items;
    if (accountType === "OWNER") return owner_items;
    return [];  
  };

  return (
    <aside className="w-[200px] h-screen bg-white p-4 flex flex-col justify-between shadow-lg overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <Image src={logo} alt="Company Logo" priority />
        </div>

        <nav className="flex-1 pr-2">
          <div className="flex flex-col gap-2">
            {getMenuItems().map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link href={item.path} key={item.id} passHref>
                  <div
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg relative group transition-all
                      ${isActive ? "bg-[#e6f0ff]" : "hover:bg-[#f0f7ff]"}`}
                  >
                    <Image 
                      src={item.icon} 
                      alt={`${item.title} icon`} 
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
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
      <div className="flex flex-col gap-4">
        <button
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#f0f7ff] transition"
        >
          <Image 
            src={logout} 
            alt="Logout" 
            width={20}
            height={20}
            className="w-5 h-5"
          />
          <span className="text-[15px] font-semibold text-[#7d8592] hover:text-[#3f8cff]">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}