import Home from "../../pages";
import styles from "./header.module.scss";

export default function Header() {
  return(
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="assets/Vectorlogo.svg" alt="logo"/>
        <img src="assets/spacetravelingLogoName.svg" alt="Space Traveling"/>
      </div>
    </header>
  )
}
