import styles from "./LoadMoreButtons.module.scss"

export default function LoadMoreButton(props) {  
    return (
        <button onClick={props.onClick} className={styles.loadMoreButton}>
            Carregar mais posts
        </button>
    )

}