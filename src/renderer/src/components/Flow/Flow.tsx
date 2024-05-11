import styles from './Flow.module.css'
import { sync_position_and_fetch_data, useOnMouseEnter, useOnMouseLeave } from '../../events/use_event_atodo'
import { HeadBar } from '../HeadBar/HeadBar'
import { ShowModified } from '../ShowModified/ShowModified'
import { AlertBar, show_alert_error } from '../AlertBar/AlertBar'
import { init_show_graph_data, ShowGraph, update_show_graph_with_show_data } from '../GraphShow/ShowGraph'
import { init_show_stack_data, ShowStack } from '../ShowStack/ShowStack'
import { data_loading } from '../../App'
import { CreateTaskDialog, CreateTaskFormData } from '../CreateTaskDialog/CreateTaskDialog'
import { Signal, signal } from '@preact/signals'
import { useCallback } from 'preact/compat'
import { add_task_default, set_detailed_task, task_detailed } from '../../api/task_api'
import { get_show_data } from '../../api/task_show_api'
import { EditTaskDialog, Task } from '../EditTaskDialog/EditTaskDialog'

export const init_flow_data = () => {
  let promise1 = init_show_stack_data()
  let promise2 = init_show_graph_data()
  Promise.all([promise1, promise2]).then(() => {
    console.log('Flow data init')
    data_loading.value = false
  }).catch((err) => {
    show_alert_error(err)
  })
}

export const show_create_task_dialog: Signal<boolean> = signal(false);

export const show_edit_task_dialog: Signal<boolean> = signal(false);

const entered_reactflow_init: boolean = false
export const entered_reactflow: Signal<boolean> = signal<boolean>(entered_reactflow_init)

export default function Flow() {

  let onMouseEnter = useOnMouseEnter()
  let onMouseLeave = useOnMouseLeave()

  console.log('Flow rendered')

  const create_task = useCallback((data: CreateTaskFormData) => {
    // deadline from string to unix timestamp
    add_task_default(data.name, data.goal, new Date(data.deadline).getTime(), data.in_work_time).then((_res) => {
      return get_show_data()
    }).then((res) => {
      update_show_graph_with_show_data(res)
    }).catch((err) => {
      show_alert_error(err)
    })
  }, [])

  const set_task_detail = useCallback((data: Task) => {
    let task : task_detailed = {
      task: {
        task_id: Number(data.id),
        name: data.name,
        goal: data.goal,
        deadline: new Date(data.deadline).getTime().toString(),
        in_work_time: data.in_work_time,
        status: data.status
      },
      trigger_type: data.trigger_type.map((trigger) => trigger.toString()),
      after_effect_type: data.after_effect.map((after_effect) => after_effect.toString()),
      suspended_task_type: data.suspended_task_type.map((suspended_task) => suspended_task.toString()),
      trigger: {
        event_name: data.event_name,
        event_description: data.event_description
      },
      after_effect: {
        now_at: data.now_at,
        period: data.period,
        intervals: data.intervals
      },
      suspended_task: {
        resume_time: new Date(data.resume_time).getTime().toString(),
        email: data.email,
        keywords: data.keywords
      }
    }
    console.log(task)
    set_detailed_task(task).then((res) => {
      if(!res.status) {
        show_alert_error(res.msg!)
      }
      sync_position_and_fetch_data()
    }).catch((err) => {
      show_alert_error(err)
    })
  }, [])

  return (
    <div className={styles.Flow} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <HeadBar />
      <ShowModified />
      <AlertBar />
      <ShowStack />
      <ShowGraph />
      <CreateTaskDialog open={show_create_task_dialog.value} onClose={() => show_create_task_dialog.value = false} onSubmit={create_task} />
      <EditTaskDialog open={show_edit_task_dialog.value} onClose={() => show_edit_task_dialog.value = false} onSubmit={set_task_detail} />
    </div>
  )
}
