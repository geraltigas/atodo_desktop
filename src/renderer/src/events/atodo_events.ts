// import from preact
import { useCallback, useEffect } from 'preact/compat'
import { Connection, Edge as ReactflowEdge, Node as ReactflowNode } from 'reactflow'
import { is_modified } from '../components/ShowModified/ShowModified'
import {
  entered_reactflow,
  show_create_task_dialog,
  show_edit_task_dialog
} from '../components/Flow/Flow'
import { add_task_uis, task_ui } from '../api/task_ui_api'
import {
  now_selected,
  position_map,
  update_show_graph_with_show_data,
  Node,
  Edge,
  init_show_graph_data
} from '../components/ShowGraph/ShowGraph'
import { get_show_data } from '../api/task_show_api'
import { add_relation_default, delete_relation } from '../api/task_relation_api'
import { is_inputting } from '../pages/ATodo/ATodo'
import { eliminate_task, get_detailed_task } from '../api/task_api'
import { back_to_parent_task, set_now_viewing_task } from '../api/app_state_api'
import { init_show_stack_data } from '../components/ShowStack/ShowStack'
import { form_data, TaskStatus } from '../components/EditTaskDialog/EditTaskDialog'
import { batch } from '@preact/signals'
import { Page, route } from '../App'

type KeyBoardCallBack = (event: KeyboardEvent) => void
const documentKeyBoardEventsReference: Set<KeyBoardCallBack> = new Set()

type MouseCallBack = (event: MouseEvent) => void
const documentMouseEventsReference: Set<MouseCallBack> = new Set()

// export const updateReference = (newTask: Task) => {
//   let parent = newTask.parent
//   let subtasks = newTask.subtasks.nodes
//
//   if (parent !== null) {
//     let oldTaskIndex = parent.subtasks.nodes.findIndex((task) => task.id === newTask.id)
//     // remove old task
//     parent.subtasks.nodes.splice(oldTaskIndex, 1)
//     parent.subtasks.nodes.push(newTask)
//   }
//   subtasks.forEach((task) => {
//     task.parent = newTask
//   })
// }

// sometimes, It is worth to have duplicate state to make the code more readable.

const atodo_events = () => {
  unregister_all_atodo_event_listener()
  useDocumentOnADown()
  useDocumentOnEnterDown()
  useDocumentOnDeleteDown()
  useDocumentOnSpaceDown()
  useDocumentOnMouse3Down()
  useDocumentOnCtrlSDown()
  useDocumentOnEDown()
}

export const useOnMouseEnter = () => {
  return useCallback((_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    entered_reactflow.value = true
  }, [])
}

export const useOnMouseLeave = () => {
  return useCallback((_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    entered_reactflow.value = false
  }, [])
}

export const useOnConnect = () => {
  return useCallback((params: Connection) => {
    // batch(() => {
    //   task_api.add_relation(Number(params.source!), Number(params.target!))
    //   console.log(task_api.get_task_relation_buffer())
    //   reactflow_api.update_subtasks_relation(now_viewing_task.value)
    // })
    add_relation_default({
      source: Number(params.source!),
      target: Number(params.target!)
    })
      .then((res) => {
        if (res.status) {
          sync_position_and_fetch_data()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
}

export const useOnNodeClick = () => {
  return useCallback((_event: React.MouseEvent, node: ReactflowNode) => {
    if (node.type === 'task') {
      if (
        now_selected.value.type === 'node' &&
        (now_selected.value.reference as Node).id === node.id
      ) {
        now_selected.value = {
          type: 'none',
          reference: null
        }
      } else {
        now_selected.value = {
          type: 'node',
          // @ts-ignore
          reference: node
        }
      }
    }
  }, [])
}

export const useOnEdgeClick = () => {
  return useCallback((_event: React.MouseEvent, edge: ReactflowEdge) => {
    if (
      now_selected.value.type === 'edge' &&
      (now_selected.value.reference as Edge).id === edge.id
    ) {
      now_selected.value = {
        type: 'none',
        reference: null
      }
    } else {
      now_selected.value = {
        type: 'edge',
        reference: edge as Edge
      }
    }
  }, [])
}

const format_and_to_local_string = (date: Date) => {
  // The format is "yyyy-MM-ddThh:mm" followed by optional ":ss" or ":ss.SSS". month have two digits, and is 0-indexed. should add 1 to get the real month.
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const useDocumentOnEDown = () => {
  const callback = useCallback((event: KeyboardEvent) => {
    if (
      event.key === 'e' &&
      !is_inputting.value &&
      now_selected.value.type == 'node' &&
      entered_reactflow.value
    ) {
      // show_edit_task_dialog.value = true
      get_detailed_task(Number((now_selected.value.reference as Node).id)).then((res) => {
        console.log(res)
        batch(() => {
          form_data.value = {
            id: res.task.id.toString(),
            name: res.task.name,
            goal: res.task.goal,
            //The format is "yyyy-MM-ddThh:mm" followed by optional ":ss" or ":ss.SSS".
            deadline: format_and_to_local_string(new Date(Number(res.task.deadline))),
            in_work_time: res.task.in_work_time,
            status: res.task.status as TaskStatus,
            trigger_type: res.trigger_type,
            after_effect: res.after_effect_type,
            suspended_task_type: res.suspended_task_type,
            resume_time: format_and_to_local_string(
              new Date(Number(res.suspended_task.resume_time))
            ),
            email: res.suspended_task.email,
            keywords: res.suspended_task.keywords,
            event_name: res.trigger.event_name,
            event_description: res.trigger.event_description,
            now_at: res.after_effect.now_at,
            period: res.after_effect.period,
            intervals: res.after_effect.intervals,
            dependency_constraint: res.task_constraint.dependency_constraint,
            subtask_constraint: res.task_constraint.subtask_constraint
          }
          show_edit_task_dialog.value = true
        })
      })
    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

const useDocumentOnADown = () => {
  const callback = useCallback((event: KeyboardEvent) => {
    if (event.key === 'a' && !is_inputting.value && entered_reactflow.value) {
      show_create_task_dialog.value = true
    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

const useDocumentOnEnterDown = () => {
  // open worker
  const callback = useCallback((event: KeyboardEvent) => {
    if (!is_inputting.value && entered_reactflow.value && event.key === 'Enter') {
      unregister_all_atodo_event_listener()
      route.value = Page.Panel
    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

const useDocumentOnDeleteDown = () => {
  const callback = useCallback((event: KeyboardEvent) => {
    if (
      (event.key === ' ' || event.key == 'Delete') &&
      now_selected.value.type !== 'none' &&
      entered_reactflow.value &&
      !is_inputting.value
    ) {
      if (
        now_selected.value.type == 'edge' &&
        (now_selected.value.reference as Edge).source != 'start' &&
        (now_selected.value.reference as Edge).target != 'end'
      ) {
        console.log({
          source: Number((now_selected.value.reference as Edge).source),
          target: Number((now_selected.value.reference as Edge).target)
        })
        delete_relation({
          source: Number((now_selected.value.reference as Edge).source),
          target: Number((now_selected.value.reference as Edge).target)
        })
          .then((_res) => {
            sync_position_and_fetch_data()
          })
          .catch((err) => {
            console.log(err)
          })
      } else if (now_selected.value.type == 'node') {
        eliminate_task(Number((now_selected.value.reference as Node).id))
          .then((res) => {
            if (res.status) {
              sync_position_and_fetch_data()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

const useDocumentOnSpaceDown = () => {
  const callback = useCallback((event: KeyboardEvent) => {
    if (
      event.key === ' ' &&
      now_selected.value.type === 'node' &&
      !is_inputting.value &&
      entered_reactflow.value &&
      !is_modified.value
    ) {
      set_now_viewing_task(Number((now_selected.value.reference as Node).id))
        .then((res) => {
          if (res.status) {
            let p1 = init_show_stack_data()
            let p2 = init_show_graph_data()
            Promise.all([p1, p2])
              .then(() => {
                console.log('Flow data init')
              })
              .catch((err) => {
                console.error(err)
              })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

export const sync_position_and_fetch_data = () => {
  let task_uis: task_ui[] = []
  position_map.forEach((value, key) => {
    task_uis.push({
      id: key,
      position: {
        x: value.x,
        y: value.y
      }
    })
  })
  add_task_uis(task_uis)
    .then((res) => {
      if (res.status) {
        is_modified.value = false
        position_map.clear()
        get_show_data().then((res) => {
          update_show_graph_with_show_data(res)
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

const useDocumentOnCtrlSDown = () => {
  const callback = useCallback((event: KeyboardEvent) => {
    if (
      event.ctrlKey &&
      event.key === 's' &&
      is_modified.value &&
      entered_reactflow.value &&
      !is_inputting.value
    ) {
      sync_position_and_fetch_data()
    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

// const useDocumentOnCtrlCDown = () => {
//   const callback = useCallback((event: KeyboardEvent) => {
//     if (event.ctrlKey && event.key === 'c' && !is_inputting.value) {
//       if (now_selected.value.type === 'node') {
//         task_api.get_task(Number((now_selected.value.reference as Node).id)).then((res) => {
//           copied_task.value = {
//             ...res,
//             id: dayjs().valueOf(),
//             position_x: res.position_x + 10,
//             position_y: res.position_y + 10,
//             time_consumed: 0
//           }
//         })
//       }
//     }
//   }, [])
//
//   useEffect(() => {
//     documentKeyBoardEventsReference.add(callback)
//     document.addEventListener('keydown', callback)
//   }, [])
// }

// const useDocumentOnCtrlVDown = () => {
//   const callback = useCallback((event: KeyboardEvent) => {
//     if (event.ctrlKey && event.key === 'v' && copied_task.value && !is_inputting.value) {
//       task_api.add_task(copied_task.value)
//       copied_task.value = null
//     }
//   }, [])
//
//   useEffect(() => {
//     documentKeyBoardEventsReference.add(callback)
//     document.addEventListener('keydown', callback)
//   }, [])
// }

// ------------------ mouse event ------------------

const useDocumentOnMouse3Down = () => {
  const callback = useCallback((event: MouseEvent) => {
    if (event.button === 3 && entered_reactflow.value && !is_inputting.value && !is_modified.value) {
      back_to_parent_task()
        .then((res) => {
          if (res.status) {
            let p1 = init_show_stack_data()
            let p2 = init_show_graph_data()
            Promise.all([p1, p2])
              .then(() => {
                console.log('Flow data init')
              })
              .catch((err) => {
                console.error(err)
              })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])

  useEffect(() => {
    documentMouseEventsReference.add(callback)
    document.addEventListener('mousedown', callback)
  }, [])
}

export const unregister_all_atodo_event_listener = () => {
  documentKeyBoardEventsReference.forEach((callback) => {
    document.removeEventListener('keydown', callback)
  })
  documentMouseEventsReference.forEach((callback) => {
    document.removeEventListener('mousedown', callback)
  })
}

export default atodo_events
