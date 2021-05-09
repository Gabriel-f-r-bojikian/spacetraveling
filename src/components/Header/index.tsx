import Home from "../../pages";
import styles from "./header.module.scss";
import Link from 'next/link'

export default function Header() {
  return(
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a>
            <img src="/assets/Vectorlogo.svg" alt="logo"/>
            <img src="/assets/spacetravelingLogoName.svg" alt="Space Traveling"/>
          </a>
        </Link>
      </div>
    </header>
  )
}
