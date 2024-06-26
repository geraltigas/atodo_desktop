import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography
} from '@mui/material'
import EventNoteIcon from '@mui/icons-material/EventNote'
import FlagIcon from '@mui/icons-material/Flag'
import InfoIcon from '@mui/icons-material/Info'
import EditIcon from '@mui/icons-material/Edit'
import styles from './TaskDetail.module.css'
import { selected_task_signal } from '../../pages/Panel/Panel'
import {
  event_trigger_task_show_t,
  suspended_email_info_t,
  suspended_task_show_t,
  suspended_time_info_t
} from '../../api/schedule_api'
import { now_doing_task_signal, timestamp_to_string } from '../TaskSidebar/TaskSidebar'
import { useCallback } from 'preact/compat'
import { set_now_doing_task, set_now_viewing_task } from '../../api/app_state_api'
import { Page, route } from '../../App'

export const TaskDetail = () => {
  if (!selected_task_signal.value || !selected_task_signal.value.type) {
    return (
      <Paper className={styles.TaskDetail} elevation={3} sx={{ borderRadius: 0 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <InfoIcon fontSize="large" color="disabled" />
        </Box>
      </Paper>
    )
  }

  const handleStartTask = useCallback(() => {
    if (now_doing_task_signal.value === -1) {
      set_now_doing_task(selected_task_signal.value.todo!.id).then(() => {
        now_doing_task_signal.value = selected_task_signal.value.todo!.id
      })
    } else {
      if (now_doing_task_signal.value === selected_task_signal.value.todo!.id) {
        set_now_doing_task(-1).then(() => {
          now_doing_task_signal.value = -1
        })
      } else {
        set_now_doing_task(selected_task_signal.value.todo!.id).then(() => {
          now_doing_task_signal.value = selected_task_signal.value.todo!.id
        })
      }
    }
  }, [])

  const handleEditClick = () => {
    let id: number;
    switch (selected_task_signal.value.type) {
      case 'todo':
        id = selected_task_signal.value.todo!.id
        break
      case 'event':
        id = selected_task_signal.value.event!.id
        break
      case 'suspended':
        id = selected_task_signal.value.suspended!.id
        break
      default:
        throw new Error('Unknown task type')
    }
    set_now_viewing_task(id).then(() => {
      route.value = Page.ATodo
    })
  }

  const task = selected_task_signal.value[selected_task_signal.value.type]

  return (
    <Paper className={styles.TaskDetail} elevation={3} sx={{ padding: 2, borderRadius: 0 }}>
      <Typography variant="h4" gutterBottom>
        {task!.name}
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <FlagIcon />
          </ListItemIcon>
          <ListItemText>
            <Card variant="outlined" sx={{ minWidth: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" height="100%">
                  <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line' }}>
                    {task!.goal}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <EventNoteIcon />
          </ListItemIcon>
          <ListItemText primary={timestamp_to_string(task!.deadline)} />
        </ListItem>
      </List>
      <Chip
        label={task!.in_work_time ? 'Work Time' : 'Off Work'}
        color={task!.in_work_time ? 'error' : 'success'}
      />
      {selected_task_signal.value.type === 'suspended' && (
        <Card variant="outlined" sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">Suspended</Typography>
            <Box sx={{ margin: 2 }}>
              <Typography variant="body2">Type: {(task as suspended_task_show_t).type}</Typography>
              {selected_task_signal.value.suspended!.type === 'time' && (
                <Typography variant="body2">
                  Time: {timestamp_to_string(((task as suspended_task_show_t).info! as suspended_time_info_t).time)}
                </Typography>
              )}
              {selected_task_signal.value.suspended!.type === 'email' && (
                <>
                  <Typography variant="body2">
                    Email: {((task as suspended_task_show_t).info! as suspended_email_info_t).email}
                  </Typography>
                  <Typography variant="body2">
                    Keywords: {((task as suspended_task_show_t).info! as suspended_email_info_t).keywords.join(', ')}
                  </Typography>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {selected_task_signal.value.type === 'event' && (
        <Card variant="outlined" sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">Event</Typography>
            <Box sx={{ margin: 2 }}>
              <Typography variant="body1">
                Name: {(task as event_trigger_task_show_t).event_name}
              </Typography>
              <Typography variant="body1">
                Description: {(task as event_trigger_task_show_t).event_description}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
      {selected_task_signal.value?.type === 'todo' && <Button
            className={
              now_doing_task_signal.value === selected_task_signal.value.todo!.id
                ? styles.RemoveDoingButton
                : styles.SetDoingButton
            }
            onClick={handleStartTask}
          >
            {now_doing_task_signal.value === selected_task_signal.value.todo!.id ? 'Undo' : 'Do'}
          </Button>}
      <IconButton onClick={handleEditClick} className={styles.EditButton}>
        <EditIcon />
      </IconButton>
    </Paper>
  )
}
