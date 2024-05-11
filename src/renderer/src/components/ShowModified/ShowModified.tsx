import styles from './ShowModified.module.css'
import { signal, Signal } from '@preact/signals'

const is_modified_init: boolean = false
const is_modified: Signal<boolean> = signal<boolean>(is_modified_init)

export const ShowModified = () => {
  const modifiedClassName = is_modified.value
    ? styles.modifiedBase + ' ' + styles.modified
    : styles.modifiedBase
  return <div className={modifiedClassName}></div>
}

export { is_modified }
