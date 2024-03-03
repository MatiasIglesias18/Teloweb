"use client";
import Link from "next/link";
import { FaTachometerAlt, FaUserCog } from "react-icons/fa";
import LogOutButton from "../../../components/shared/LogOutButton/LogOutButton";
import { Button } from "@/components/ui/button";
import { FaListCheck, FaUsers } from "react-icons/fa6";
import { BsHousesFill, BsHouseCheckFill } from "react-icons/bs";

const Sidebar = ({ onLinkClick }) => {
  const setClose = onLinkClick ? onLinkClick : () => {};
  return (
    <ul className="menu bg-base-200 rounded-box [&_li:not(:last-child)]:mb-2 [&_ul]:mt-2">
      {/* <li>
        <Button
          variant="ghost"
          className="justify-start flex gap-2 w-full text-md"
          asChild
        >
          <Link href="/admin" onClick={() => setClose(false)}>
            <FaTachometerAlt /> <h2 className="inline">Dashboard</h2>
          </Link>
        </Button>
      </li> */}
      <li>
        <Button
          variant="ghost"
          className={`justify-start flex gap-2 w-full text-md `}
          asChild
        >
          <Link href="/admin" onClick={() => setClose(false)}>
            <FaUserCog />
            Mi Cuenta
          </Link>
        </Button>
      </li>

      <li>
        <Button
          variant="ghost"
          className="justify-start flex gap-2 w-full text-md"
          asChild
        >
          <Link href="/admin/users" onClick={() => setClose(false)}>
            <FaUsers />
            Operadores
          </Link>
        </Button>
      </li>
      <li>
        <Button
          variant="ghost"
          className="justify-start flex gap-2 w-full text-md"
          asChild
        >
          <Link href="/admin/aprobar-telos" onClick={() => setClose(false)}>
            <BsHouseCheckFill />
            Alta inicial de Telos
          </Link>
        </Button>
      </li>
      <li>
        <Button
          variant="ghost"
          className="justify-start flex gap-2 w-full text-md"
          asChild
        >
          <Link href="/admin/telos" onClick={() => setClose(false)}>
            <BsHousesFill />
            Telos
          </Link>
        </Button>
      </li>
      <li>
        <Button
          variant="ghost"
          className="justify-start flex gap-2 w-full text-md"
          asChild
        >
          <Link href="/admin/aprobar-cambios" onClick={() => setClose(false)}>
            <FaListCheck />
            Solicitudes de Cambios
          </Link>
        </Button>
      </li>

      <li onClick={() => setClose(false)}>
        <LogOutButton />
      </li>
    </ul>
  );
};

export default Sidebar;
