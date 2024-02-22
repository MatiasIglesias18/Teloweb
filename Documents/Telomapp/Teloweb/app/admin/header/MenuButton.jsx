"use client";
import { LuMenu } from "react-icons/lu";
import Sidebar from "../sidebar/Sidebar";
import { useState } from "react";
import Image from "next/image";
import logomobile from "@/app/assets/telomapp-logo-mobile.png";

const MenuButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <LuMenu
        className="text-white h-10 w-auto block lg:hidden hover:cursor-pointer"
        onClick={() => setOpen(!open)}
      />
      <nav
        className={
          "transition-transform left-0 text-black block absolute inset-y-0 h-full z-20 col-span-2 px-2 py-4 bg-white shadow-xl min-w-[280px] w-1/4 lg:min-w-0 lg:w-auto lg:hidden" +
          " " +
          (open ? "translate-x-[0%]" : "-translate-x-[100%]")
        }
      >
        <Image
          className="w-4/5 h-auto block lg:hidden mx-auto mb-4"
          src={logomobile}
          alt="Logo"
          priority={true}
        />
        <Sidebar onLinkClick={setOpen} />
      </nav>
      <div
        className={
          "fixed inset-0 bg-black opacity-50 z-10" +
          " " +
          (open ? "block" : "hidden")
        }
        onClick={() => setOpen(!open)}
      ></div>
    </>
  );
};

export default MenuButton;
