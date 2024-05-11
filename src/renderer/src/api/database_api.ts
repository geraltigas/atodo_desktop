import { axios_ } from './axios'

// define response type
export type boolean_response = {
  status: boolean
  msg?: string
}

export type file_path_response = {
  path: string
}

export const check_database_existence = async (): Promise<boolean_response> => {
  return axios_.post('/database/check_database_existence', {})
}

export const get_database_file_path = async (): Promise<file_path_response> => {
  return axios_.post('/database/get_database_file_path', {})
}

export const set_database_file_path = async (path: string): Promise<boolean_response> => {
  return axios_.post('/database/set_database_file_path', { path })
}

export const create_database = async (): Promise<boolean_response> => {
  return axios_.post('/database/create_database', {})
}

export const delete_database = async (): Promise<boolean_response> => {
  return axios_.post('/database/delete_database', {})
}
