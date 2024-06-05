import styles from './Panel.module.css'
import {
  event_trigger_task_show_t,
  get_schedule,
  schedule_t,
  suspended_task_show_t,
  task_show_t
} from '../../api/schedule_api'
import { batch, signal, Signal } from '@preact/signals'
import { data_loading } from '../../App'
import { HeadBar } from '../../components/HeadBar/HeadBar'
import { now_doing_task_signal, TaskSidebar } from '../../components/TaskSidebar/TaskSidebar'
import { TaskDetail } from '../../components/TaskDetail/TaskDetail'
import {
  timer_signal,
  work_time_record_control_signal,
  WorkControl
} from '../../components/WorkControl/WorkControl'
import {
  get_now_doing_task,
  get_now_is_work_time,
  get_work_time,
  now_doing_task_t,
  work_time_t
} from '../../api/app_state_api'
import { boolean_response } from '../../api/database_api'
import { AlertBar } from '../../components/AlertBar/AlertBar'
import panel_events from '../../events/panel_events'

export const update_work_control_and_task_detail = (
  work_time: work_time_t,
  now_doing_task: now_doing_task_t,
  now_is_work_time: boolean_response
) => {
  batch(() => {
    timer_signal.value = work_time.work_time
    now_doing_task_signal.value = now_doing_task.now_doing_task
    work_time_record_control_signal.value = now_is_work_time.status
    schedule_signal.value.tasks.forEach((task) => {
      if (task.id === now_doing_task.now_doing_task) {
        selected_task_signal.value = {
          type: 'todo',
          todo: task
        }
      }
      return
    })
    schedule_signal.value.suspended_tasks.forEach((task) => {
      if (task.id === now_doing_task.now_doing_task) {
        selected_task_signal.value = {
          type: 'suspended',
          suspended: task
        }
      }
      return
    })
    schedule_signal.value.event_trigger_tasks.forEach((task) => {
      if (task.id === now_doing_task.now_doing_task) {
        selected_task_signal.value = {
          type: 'event',
          event: task
        }
      }
      return
    })
  })
}

export const init_panel_data = () => {
  let p_schedule = get_schedule()
  let p_work_time = get_work_time()
  let p_now_doing_task = get_now_doing_task()
  let p_now_is_work_time = get_now_is_work_time()

  Promise.all([p_schedule, p_work_time, p_now_doing_task, p_now_is_work_time]).then(
    ([schedule, work_time, now_doing_task, now_is_work_time]) => {
      batch(() => {
        schedule_signal.value = schedule
        update_work_control_and_task_detail(work_time, now_doing_task, now_is_work_time)
        data_loading.value = false
      })
    }
  )

  // then((schedule) => {
  //   batch(() => {
  //     schedule_signal.value = schedule
  //
  //     data_loading.value = false
  //   })
  // })
}

export type selected_task_t = {
  type: 'todo' | 'event' | 'suspended' | null
  todo?: task_show_t
  suspended?: suspended_task_show_t
  event?: event_trigger_task_show_t
}

export const selected_task_signal: Signal<selected_task_t> = signal<selected_task_t>({
  type: null
})

const init_schedule: schedule_t = {
  tasks: [],
  suspended_tasks: [],
  event_trigger_tasks: []
}
export const schedule_signal: Signal<schedule_t> = signal<schedule_t>(init_schedule)

export const schedule_preprocess = (schedule: schedule_t):task_show_t[] => {
  let tasks:task_show_t[];
  if (work_time_record_control_signal.value) {
    // rank in work time to the top
    let in_work_time:task_show_t[] = []
    let off_work:task_show_t[] = []
    schedule.tasks.forEach((task) => {
      if (task.in_work_time) {
        in_work_time.push(task)
      } else {
        off_work.push(task)
      }
    })
    tasks = in_work_time.concat(off_work)
  }else {
    // rank in work time to the bottom
    let in_work_time:task_show_t[] = []
    let off_work:task_show_t[] = []
    schedule.tasks.forEach((task) => {
      if (task.in_work_time) {
        in_work_time.push(task)
      } else {
        off_work.push(task)
      }
    })
    tasks = off_work.concat(in_work_time)
  }

  return tasks
}

export const Panel = () => {
  panel_events()

  return (
    <div className={styles.PanelPage}>
      <HeadBar />
      <div className={styles.Panel}>
        <TaskSidebar />
        <TaskDetail />
      </div>
      <WorkControl />
      <AlertBar />
    </div>
  )
}
