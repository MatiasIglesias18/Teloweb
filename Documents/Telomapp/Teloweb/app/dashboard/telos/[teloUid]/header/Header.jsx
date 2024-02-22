"use client";
import { useTeloContext } from "@/app/context/TeloDocProvider";
import MenuButton from "./MenuButton";

const Header = () => {
  const { teloDoc } = useTeloContext();
  return <header className="px-4 py-2 h-14 bg-primary text-white flex flex-row justify-between items-center "><h1 className="text-2xl font-semibold">{teloDoc?.nombre}</h1><MenuButton /></header>;
};

export default Header;
