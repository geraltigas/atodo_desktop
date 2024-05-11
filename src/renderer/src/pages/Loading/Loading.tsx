import styles from './Loading.module.css'
import { HeadBar } from '../../components/HeadBar/HeadBar'

export const Loading = () => {

  return (
    <div className={styles.loading}>
      <HeadBar />
      <div className={styles.sk_cube_grid}>
        <div className={styles.sk_cube1 + ' ' + styles.sk_cube}></div>
        <div className={styles.sk_cube2 + ' ' + styles.sk_cube}></div>
        <div className={styles.sk_cube3 + ' ' + styles.sk_cube}></div>
        <div className={styles.sk_cube4 + ' ' + styles.sk_cube}></div>
        <div className={styles.sk_cube5 + ' ' + styles.sk_cube}></div>
        <div className={styles.sk_cube6 + ' ' + styles.sk_cube}></div>
        <div className={styles.sk_cube7 + ' ' + styles.sk_cube}></div>
        <div className={styles.sk_cube8 + ' ' + styles.sk_cube}></div>
        <div className={styles.sk_cube9 + ' ' + styles.sk_cube}></div>
      </div>
    </div>
  )
}
