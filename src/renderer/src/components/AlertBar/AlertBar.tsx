import { Snackbar } from '@mui/material'
import { signal, Signal } from '@preact/signals'

// show_alert
export type ShowAlert = {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}
const show_alert_init: ShowAlert = {
  show: false,
  message: '',
  type: 'success'
}
const show_alert: Signal<ShowAlert> = signal<ShowAlert>(show_alert_init)

export const show_alert_warp = (alert: string, type: 'success' | 'error' | 'warning' | 'info') => {
  show_alert.value = { show: true, message: alert, type: type }
  setTimeout(() => {
    show_alert.value = { ...show_alert.value, show: false }
  }, 3000)
}

export const show_alert_error = (alert: string) => {
  show_alert_warp(alert, 'error')
  console.error(alert)
}

export const AlertBar = () => {
  return <Snackbar open={show_alert.value.show} message={show_alert.value.message} />
}

export { show_alert }
