import { axios_ } from './axios'

export type task_show_t = {
  id: number
  name: string
  goal: string
  deadline: number
  in_work_time: boolean
}

export type suspended_time_info_t = {
  time: number
}

export type suspended_email_info_t = {
  email: string
  keywords: string[]
}

export type suspended_task_show_t = {
  id: number
  name: string
  goal: string
  deadline: number
  in_work_time: boolean
  type: string
  time_info?: suspended_time_info_t
  email_info?: suspended_email_info_t
}

export type event_trigger_task_show_t = {
  id: number
  name: string
  goal: string
  deadline: number
  in_work_time: boolean
  event_name: string
  event_description: string
}

export type schedule_t = {
  tasks: task_show_t[]
  suspended_tasks: suspended_task_show_t[]
  event_trigger_tasks: event_trigger_task_show_t[]
}

export const get_schedule = async (): Promise<schedule_t> => {
  return axios_.post('/schedule', {})
}
