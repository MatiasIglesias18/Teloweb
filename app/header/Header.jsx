import styles from "./Header.module.css";
import Image from "next/image";
import Logo_Telomapp from "@/app/assets/Logo_Telomapp.png";
import AvatarMenu from "@/components/shared/AvatarMenu/AvatarMenu";
import Link from "next/link";

export function Header() {
  return (
    <header className="shadow">
      <div className="container flex flex-row">
        <div className={styles.logoWrapper}>
          <Link href={"/"}>
            <Image className={styles.logo} src={Logo_Telomapp} alt="Logo" priority={true}/>
          </Link>
        </div>
        <div className="ml-auto flex flex-row items-center">
          <AvatarMenu />
        </div>
      </div>
    </header>
  );
}
