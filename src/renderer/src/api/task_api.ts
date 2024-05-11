import { boolean_response } from './database_api'
import { axios_ } from './axios'

export type task_detailed = {
  task: {
    task_id: number
    name: string
    goal: string
    deadline: string
    in_work_time: boolean
    status: string
  }
  trigger_type: string[]
  after_effect_type: string[]
  suspended_task_type: string[]
  trigger: {
    event_name: string
    event_description: string
  }
  after_effect: {
    now_at: number
    period: number
    intervals: number[]
  }
  suspended_task: {
    resume_time: string
    email: string
    keywords: string[]
  }
}

export const add_task_default = async (name: string, goal: string, deadline: number, in_work_time: boolean) : Promise<boolean_response> => {
  return axios_.post('/task/add_task_default', { name, goal, deadline, in_work_time })
}

export const eliminate_task = async (id: number) : Promise<boolean_response> => {
  return axios_.post('/task/eliminate_task', { id })
}

export const get_detailed_task = async (id: number) : Promise<task_detailed> => {
  return axios_.post('/task/get_detailed_task', { id })
}

export const set_detailed_task = async (task: task_detailed) : Promise<boolean_response> => {
  return axios_.post('/task/set_detailed_task', { ...task })
}
