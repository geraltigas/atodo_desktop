import { useCallback, useEffect } from 'preact/compat'
import { Page, route } from '../App'
import { interval, intervalSync, timer_signal } from '../components/WorkControl/WorkControl'
import { now_doing_task_signal } from '../components/TaskSidebar/TaskSidebar'
import { selected_task_signal } from '../pages/Panel/Panel'
import { batch } from '@preact/signals'

type KeyBoardCallBack = (event: KeyboardEvent) => void
const documentKeyBoardEventsReference: Set<KeyBoardCallBack> = new Set()

type MouseCallBack = (event: MouseEvent) => void
const documentMouseEventsReference: Set<MouseCallBack> = new Set()

const panel_events = () => {
  unregister_all_panel_event_listener()
  useDocumentOnEnterDown()
}

const useDocumentOnEnterDown = () => {
  const callback = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      clearInterval(interval)
      clearInterval(intervalSync)
      batch(() => {
        route.value = Page.ATodo
        now_doing_task_signal.value = -1
        selected_task_signal.value = { type: null }
        timer_signal.value = 0
      })
    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

export const unregister_all_panel_event_listener = () => {
  documentKeyBoardEventsReference.forEach((callback) => {
    document.removeEventListener('keydown', callback)
  })
  documentMouseEventsReference.forEach((callback) => {
    document.removeEventListener('mousedown', callback)
  })
}

export default panel_events
