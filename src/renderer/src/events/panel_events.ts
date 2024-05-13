type KeyBoardCallBack = (event: KeyboardEvent) => void
const documentKeyBoardEventsReference: Set<KeyBoardCallBack> = new Set()

type MouseCallBack = (event: MouseEvent) => void
const documentMouseEventsReference: Set<MouseCallBack> = new Set()

const panel_events = () => {
  unregister_all_panel_event_listener()
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
