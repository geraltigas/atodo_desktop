import './App.css'
import 'reactflow/dist/style.css'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ATodo, { init_atodo_data } from './pages/AToDo/ATodo'
import { Signal, signal } from '@preact/signals'
import { Loading } from './pages/Loading/Loading'
import { useEffect } from 'preact/compat'

export enum Page {
  ATodo,
}

export const route = signal(Page.ATodo)
export const data_loading: Signal<boolean> = signal<boolean>(true)

const init_app_data = (page: Page) => {
  data_loading.value = true
  switch (page) {
    case Page.ATodo:
      init_atodo_data()
      break
    default:
  }
}

export default function App() {
  let view: JSX.Element

  useEffect(() => {
    init_app_data(route.value)
  }, [])

  if (data_loading.value) {
    view = <Loading />
  } else {
    switch (route.value) {
      case Page.ATodo:
        view = <ATodo />
        break
      default:
        view = <ATodo />
    }
  }
  return <LocalizationProvider dateAdapter={AdapterDayjs}>{view}</LocalizationProvider>
}
