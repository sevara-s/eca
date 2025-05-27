"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@mui/material";
import { X, Menu } from "lucide-react";
import { useState, useEffect } from "react";

import logo from "../../public/imgs/header.png"

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 p-[10px] bg-white/10 backdrop-blur-sm z-40 transition-all   ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Menu
              className="text-[#19a3dd] w-[30px] h-[30px] hidden max-[1024px]:block cursor-pointer hover:opacity-80 transition-opacity"
              onClick={toggleMenu}
            />
            <Link href="/" onClick={closeMenu}>
              <Image 
                src={logo} 
                width={280} 
                height={90} 
                alt="Company Logo"
                className="max-[400px]:w-[220px]"
                priority
              />
            </Link>
          </div>
          
          <div className="header_links flex items-center gap-[20px] max-[1024px]:hidden">
            <Link 
              href="/texnic" 
              className="text-[#19a3dd] font-medium hover:underline underline-offset-4 transition-all"
            >
             Texnik yordam
            </Link>
            <Link
              href="/certificate"
              className="text-[#19a3dd] font-medium hover:underline underline-offset-4 transition-all"
            >
              Sertifikatlar
            </Link>
          </div>

          <div className="btns flex items-center gap-[25px] max-[1024px]:hidden">
            <Button 
              className="bg-[#19a3dd] text-white hover:bg-[#1282b0] transition-colors"
              variant="contained"
            >
              Chiqish
            </Button>
            <Link href={"/register"}>
            <Button 
              className="bg-[#19a3dd] text-white hover:bg-[#1282b0] transition-colors"
              variant="contained"
            >
              Roʻyxatdan oʻtish
            </Button>
            </Link>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 transform transition-all duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-[80%] max-w-[320px] h-full bg-[#19a3dd] p-5 flex flex-col">
          <div className="flex justify-between   gap-9 mb-8">
          
          
          
          <Link href="/" onClick={closeMenu} className="mb-8">
            <Image 
              src={logo} 
              width={280} 
              height={90} 
              alt="Company Logo" 
              className="w-full max-w-[240px]"
              
            />
            
          </Link>
            <X
              className="text-white w-[30px] h-[30px] cursor-pointer hover:opacity-80 transition-opacity "
              onClick={toggleMenu}
            />
          </div>

          <div className="flex flex-col items-center gap-6 mb-8">
            <Link 
              href="/texnic" 
              className="text-white font-medium text-lg hover:underline underline-offset-4 transition-all"
              onClick={closeMenu}
            >
             Texnik yordam
            </Link>
            <Link
              href="/certificate"
              className="text-white font-medium text-lg hover:underline underline-offset-4 transition-all"
              onClick={closeMenu}
            >
             Sertifikatlar
            </Link>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            <Button 
              className="bg-black text-white hover:bg-gray-800 transition-colors w-full"
              variant="contained"
              onClick={closeMenu}
            >
              Chiqish
            </Button>
            <Link href={"/register"}>
            <Button 
              className="bg-black text-white hover:bg-gray-800 transition-colors w-full"
              variant="contained"
              onClick={closeMenu}
            >
             Roʻyxatdan oʻtish
            </Button>
            </Link>
          </div>
        </div>
        
        {isMenuOpen && (
          <div 
            className="absolute inset-0 bg-black/50 -z-10" 
            onClick={closeMenu}
          />
        )}
      </div>
    </>
  );
}