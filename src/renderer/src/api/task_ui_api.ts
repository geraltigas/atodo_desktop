import { boolean_response } from './database_api'
import { axios_ } from './axios'
import { position } from './task_show_api'

export type task_ui = {
  id: string
  position: position
}

export const add_task_uis = async (task_uis: task_ui[]): Promise<boolean_response> => {
  return axios_.post('/task_ui/add_task_uis', { task_uis })
}
