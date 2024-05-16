import {
  Paper,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Box, Button
} from '@mui/material'
import EventNoteIcon from '@mui/icons-material/EventNote';
import FlagIcon from '@mui/icons-material/Flag';
import InfoIcon from '@mui/icons-material/Info';
import styles from './TaskDetail.module.css'
import { selected_task_signal } from '../../pages/Panel/Panel'
import { event_trigger_task_show_t, suspended_task_show_t } from '../../api/schedule_api'
import { now_doing_task_signal, timestamp_to_string } from '../TaskSidebar/TaskSidebar'
import { useCallback } from 'preact/compat'
import { set_now_doing_task } from '../../api/app_state_api'

export const TaskDetail = () => {

  if (!selected_task_signal.value || !selected_task_signal.value.type) {
    return (
      <Paper className={styles.TaskDetail} elevation={3} sx={{ borderRadius: 0 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <InfoIcon fontSize="large" color="disabled" />
        </Box>
      </Paper>
    );
  }

  const handleStartTask = useCallback(() => {
    if (now_doing_task_signal.value === -1) {
      set_now_doing_task(selected_task_signal.value.todo!.id).then(() => {
        now_doing_task_signal.value = selected_task_signal.value.todo!.id;
      });
    } else {
      if (now_doing_task_signal.value === selected_task_signal.value.todo!.id) {
        set_now_doing_task(-1).then(() => {
          now_doing_task_signal.value = -1;
        });
      }else {
        set_now_doing_task(selected_task_signal.value.todo!.id).then(() => {
          now_doing_task_signal.value = selected_task_signal.value.todo!.id;
        });
      }
    }
  }, []);

  const task = selected_task_signal.value[selected_task_signal.value.type];

  return (
    <Paper className={styles.TaskDetail} elevation={3} sx={{ padding: 2 , borderRadius: 0 }}>
      <Typography variant="h4" gutterBottom>{task!.name}</Typography>
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
      <Chip label={task!.in_work_time ? 'Work Time' : 'Off Work'} color={task!.in_work_time ? 'error' : 'success'} />
      {selected_task_signal.value.type === 'suspended' && (
        <Card variant="outlined" sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">Suspended</Typography>
              <Box sx={{ margin: 2 }}>
                <Typography variant="body2">Type: {(task as suspended_task_show_t).type}</Typography>
                {selected_task_signal.value.suspended!.type === 'time' && (
                  <Typography variant="body2">Time: {timestamp_to_string((task as suspended_task_show_t).time_info!.time)}</Typography>
                )}
                {selected_task_signal.value.suspended!.type === 'email' && (
                  <>
                    <Typography variant="body2">Email: {(task as suspended_task_show_t).email_info?.email}</Typography>
                    <Typography variant="body2">Keywords: {(task as suspended_task_show_t).email_info?.keywords.join(', ')}</Typography>
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
              <Typography variant="body1">Name: {(task as event_trigger_task_show_t).event_name}</Typography>
              <Typography variant="body1">Description: {(task as event_trigger_task_show_t).event_description}</Typography>
            </Box>
              </CardContent>
        </Card>
      )}
      {selected_task_signal.value?.type === 'todo' && <Button className={now_doing_task_signal.value === selected_task_signal.value.todo!.id ? styles.RemoveDoingButton : styles.SetDoingButton} onClick={handleStartTask}>{now_doing_task_signal.value === selected_task_signal.value.todo!.id ? 'Undo' : 'Do'}</Button>}
    </Paper>
  );
}
