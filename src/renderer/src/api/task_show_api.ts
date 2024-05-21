import { axios_ } from './axios'
export type show_stack = {
  show_stack: string[]
}

export const get_show_stack = async (): Promise<show_stack> => {
  return axios_.post('/task_show/get_show_stack', {})
}

export type position = {
  x: number
  y: number
}

export type show_node = {
  id: string
  name: string
  position: position,
  status: string
}

export type show_edge = {
  source: string
  target: string
}

export type show_data = {
  nodes: show_node[]
  edges: show_edge[]
  node_connected_to_start: string[]
  node_connected_to_end: string[]
}

export const get_show_data = async (): Promise<show_data> => {
  return axios_.post('/task_show/get_show_data', {})
}
