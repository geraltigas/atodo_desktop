import styles from './ATodo.module.css'
import Flow, { init_flow_data } from '../../components/Flow/Flow'
import { signal, Signal } from '@preact/signals'
import atodo_events from '../../events/atodo_events'

export const init_atodo_data = () => {
  init_flow_data()
}

const is_inputting_init: boolean = false
export const is_inputting: Signal<boolean> = signal<boolean>(is_inputting_init)

export default function ATodo() {
  atodo_events()

  // console.log('ATodo rendered')

  // const onMouseEnter = useCallback(() => {
  //   entered_reactflow.value = true
  // }, [])
  //
  // const onMouseLeave = useCallback(() => {
  //   entered_reactflow.value = false
  // }, [])

  // const nowSelected = useAtomValue(nowSelectedAtom)

  return (
    <div
      className={styles.Window}
      // onMouseEnter={onMouseEnter}
      // onMouseLeave={onMouseLeave}
    >
      <div className={styles.AToDo}>
        {/*<FatherNodeBoard />*/}
        <Flow />

        {/*{(now_selected.value.type === 'node') && (*/}
        {/*  <NowSelectedBoard />*/}
        {/*)}*/}
      </div>
    </div>
  )
}
