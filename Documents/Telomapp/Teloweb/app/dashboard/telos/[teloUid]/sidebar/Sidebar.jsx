"use client";
import Link from "next/link";
import {
  FaTachometerAlt,
  FaHome,
  FaBed,
  FaTags,
  FaCalendarCheck,
  FaUserCog,
} from "react-icons/fa";
import { BsHousesFill } from "react-icons/bs";
import LogOutButton from "@/components/shared/LogOutButton/LogOutButton";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTeloContext } from "@/app/context/TeloDocProvider";
const Sidebar = ({ onLinkClick }) => {
  const setClose = onLinkClick ? onLinkClick : () => {};
  const params = useParams();
  const teloUid = params.teloUid;
  const { teloDoc } = useTeloContext();
  // Función para determinar si la ruta actual coincide con la ruta dada

  return (
    <ul className="bg-base-200 rounded-box [&_li:not(:last-child)]:mb-2 [&_ul]:mt-2">
      <li>
        <Button
          variant="ghost"
          className={`justify-start flex gap-2 w-full text-md `}
          onClick={() => setClose(false)}
          asChild
        >
          <Link href="/dashboard">
            <BsHousesFill />
            Mis Telos
          </Link>
        </Button>
      </li>
      <li>
        <Button
          variant="ghost"
          className={`justify-start flex gap-2 w-full text-md `}
          onClick={() => setClose(false)}
          asChild
        >
          <Link href="/dashboard/profile">
            <FaUserCog />
            Mi Cuenta
          </Link>
        </Button>
      </li>
      <li>
        <Button
          variant="ghost"
          className={`justify-start flex gap-2 w-full text-md`}
          onClick={() => setClose(false)}
          asChild
        >
          <Link href={`/dashboard/telos/${teloUid}`}>
            <FaHome />
            {teloDoc?.nombre}
          </Link>
        </Button>

        <ul>
          <li>
            <Button
              variant="ghost"
              className="justify-start flex gap-2 w-full font-medium text-md"
              onClick={() => setClose(false)}
              asChild
            >
              <Link href={`/dashboard/telos/${teloUid}/habitaciones`}>
                <FaBed />
                Todas las habitaciones
              </Link>
            </Button>
          </li>
          <li>
            <div className="flex gap-2 items-center px-4 py-2 font-medium text-md">
              <FaTags /> Tipos de habitaciones
            </div>
            <ul className="pl-4">
              <li>
                <Button variant="ghost" onClick={() => setClose(false)} asChild>
                  <Link
                    style={{ width: "100%", display: "block" }}
                    href={`/dashboard/telos/${teloUid}/tiposHabitacion/basica`}
                  >
                    Básica
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" onClick={() => setClose(false)} asChild>
                  <Link
                    style={{ width: "100%", display: "block" }}
                    href={`/dashboard/telos/${teloUid}/tiposHabitacion/premium`}
                  >
                    Premium
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" onClick={() => setClose(false)} asChild>
                  <Link
                    style={{ width: "100%", display: "block" }}
                    href={`/dashboard/telos/${teloUid}/tiposHabitacion/superior`}
                  >
                    Superior
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" onClick={() => setClose(false)} asChild>
                  <Link
                    style={{ width: "100%", display: "block" }}
                    href={`/dashboard/telos/${teloUid}/tiposHabitacion/top`}
                  >
                    Top
                  </Link>
                </Button>
              </li>
            </ul>
          </li>
          <li>
            <Button
              onClick={() => setClose(false)}
              variant="ghost"
              className="justify-start flex gap-2 w-full text-md"
              asChild
            >
              <Link href={`/dashboard/telos/${teloUid}/reservas`}>
                <FaCalendarCheck />
                Reservas
              </Link>
            </Button>
          </li>
        </ul>
      </li>
      <li onClick={() => setClose(false)}>
        <LogOutButton />
      </li>
    </ul>
  );
};

export default Sidebar;
