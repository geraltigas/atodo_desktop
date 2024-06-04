import { boolean_response } from './database_api'
import { axios_ } from './axios'

export type work_time_t = {
  work_time: number
}

export type now_doing_task_t = {
  now_doing_task: number
}

export const set_now_viewing_task = async (now_viewing_task: number): Promise<boolean_response> => {
  return axios_.post('/app_state/set_now_viewing_task', { id: now_viewing_task })
}

export const back_to_parent_task = async (): Promise<boolean_response> => {
  return axios_.post('/app_state/back_to_parent_task', {})
}

export const set_work_time = async (work_time: number): Promise<boolean_response> => {
  return axios_.post('/app_state/set_work_time', { work_time })
}

export const set_now_doing_task = async (now_doing_task: number): Promise<boolean_response> => {
  return axios_.post('/app_state/set_now_doing_task', { now_doing_task })
}

export const get_work_time = async (): Promise<work_time_t> => {
  return axios_.post('/app_state/get_work_time', {})
}

export const get_now_doing_task = async (): Promise<now_doing_task_t> => {
  return axios_.post('/app_state/get_now_doing_task', {})
}

export const set_now_is_work_time = async (
  now_is_work_time: boolean
): Promise<boolean_response> => {
  return axios_.post('/app_state/set_now_is_work_time', { now_is_work_time })
}

export const get_now_is_work_time = async (): Promise<boolean_response> => {
  return axios_.post('/app_state/get_now_is_work_time', {})
}
