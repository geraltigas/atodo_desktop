import { List, ListItem, ListItemText, Typography } from '@mui/material'
import { schedule_signal, selected_task_signal, selected_task_t } from '../../pages/Panel/Panel'
import styles from './TaskSidebar.module.css'
import { signal } from '@preact/signals'

export const now_doing_task_signal = signal<number>(-1)

export function timestamp_to_string(timestamp: number) {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

export const TaskSidebar = () => {
  const handleTaskClick = (task: selected_task_t) => {
    if (
      task.type === selected_task_signal.value.type &&
      task[task.type!]!.id === selected_task_signal.value[task.type!]!.id
    ) {
      selected_task_signal.value = { type: null }
    } else {
      selected_task_signal.value = task
    }
  }

  return (
    <List className={styles.taskSidebar}>
      <Typography variant="h6" className={styles.sectionHeader}>
        Todo
      </Typography>
      {schedule_signal.value.tasks.map((task) => (
        <ListItem
          key={task.id}
          onClick={() => handleTaskClick({ type: 'todo', todo: task })}
          className={`${styles.taskItem} ${now_doing_task_signal.value === task.id ? styles.selectedTaskItem : ''}`}
        >
          <ListItemText
            primary={
              <span>
                {task.name + ' '}
                {now_doing_task_signal.value === task.id && (
                  <span className={styles.doing}>doing</span>
                )}
              </span>
            }
            secondary={
              <span>
                {timestamp_to_string(task.deadline) + ' - '}
                {task.in_work_time ? (
                  <span className={styles.workTime}>Work Time</span>
                ) : (
                  <span className={styles.offWork}>Off Work</span>
                )}
              </span>
            }
          />
        </ListItem>
      ))}

      <Typography variant="h6" className={styles.sectionHeader}>
        Suspended
      </Typography>
      {schedule_signal.value.suspended_tasks.map((task) => (
        <ListItem
          key={task.id}
          onClick={() => handleTaskClick({ type: 'suspended', suspended: task })}
          className={styles.taskItem}
        >
          <ListItemText
            primary={task.name}
            secondary={timestamp_to_string(task.deadline) + ' - ' + task.type}
          />
        </ListItem>
      ))}

      <Typography variant="h6" className={styles.sectionHeader}>
        Event
      </Typography>
      {schedule_signal.value.event_trigger_tasks.map((task) => (
        <ListItem
          key={task.id}
          onClick={() => handleTaskClick({ type: 'event', event: task })}
          className={styles.taskItem}
        >
          <ListItemText
            primary={task.name}
            secondary={timestamp_to_string(task.deadline) + ' - ' + task.event_name}
          />
        </ListItem>
      ))}
    </List>
  )
}
