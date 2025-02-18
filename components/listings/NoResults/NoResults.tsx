import styles from './NoResults.module.css'

const NoResults: React.FC = () => {
  return (
    <div className={styles.noResults}>
      <div className={styles.emoji}>🤷‍♂️</div>
      <p className={styles.message}>
        Hmm, we can&apos;t find anything for this search. Try removing some
        filters or adjusting the map and see if that helps.
      </p>
    </div>
  )
}

export default NoResults
