import styles from './ATodo.module.css'
import Flow, { init_flow_data } from '../../components/Flow/Flow'
import useDocumentEvent from '../../events/atodo_events'
import { signal, Signal } from '@preact/signals'
import { timestamp } from '../../../../types/sql'

export const init_atodo_data = () => {
  init_flow_data()
}

const is_inputting_init: boolean = false
export const is_inputting: Signal<boolean> = signal<boolean>(is_inputting_init)

const now_viewing_task_init: timestamp = 0
export const now_viewing_task: Signal<timestamp> = signal<timestamp>(now_viewing_task_init)

export default function ATodo() {
  useDocumentEvent()

  console.log('ATodo rendered')

  // const onMouseEnter = useCallback(() => {
  //   entered_reactflow.value = true
  // }, [])
  //
  // const onMouseLeave = useCallback(() => {
  //   entered_reactflow.value = false
  // }, [])

  // const nowSelected = useAtomValue(nowSelectedAtom)

  return (
    <div className={styles.Window}
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