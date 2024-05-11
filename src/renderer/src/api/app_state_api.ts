import { boolean_response } from './database_api'
import { axios_ } from './axios'

export const set_now_viewing_task = async (now_viewing_task: number) : Promise<boolean_response> => {
  return axios_.post('/app_state/set_now_viewing_task', { now_viewing_task })
}

export const back_to_parent_task = async () : Promise<boolean_response> => {
  return axios_.post('/app_state/back_to_parent_task', {})
}
