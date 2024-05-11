import { boolean_response } from './database_api'
import { axios_ } from './axios'

export type task_relation = {
  source: number
  target: number
}

export const add_relation_default = async (task_relation: task_relation) : Promise<boolean_response> => {
  return axios_.post('/task_relation/add_relation_default', { task_relation })
}

export const delete_relation = async (task_relation: task_relation) : Promise<boolean_response> => {
  return axios_.post('/task_relation/delete_relation', { task_relation })
}
