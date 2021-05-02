import styles from "./LoadMoreButtons.module.scss"

export default function LoadMoreButton(next_page) {
    console.log(next_page.next_page)
    
    if (next_page.next_page == null) {
        return null;
    } else {
        return (
            <a className={styles.loadMoreButton}>
              Carregar mais...
            </a>
        )
    }
    
}