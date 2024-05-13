import { Paper, Typography, Chip, List, ListItem, ListItemText, ListItemIcon, Card, CardContent, Box } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FlagIcon from '@mui/icons-material/Flag';
import InfoIcon from '@mui/icons-material/Info';
import styles from './TaskDetail.module.css'
import { selected_task_signal } from '../../pages/Panel/Panel'
import { event_trigger_task_show_t, suspended_task_show_t } from '../../api/schedule_api'
import { timestamp_to_string } from '../TaskSidebar/TaskSidebar'

export const TaskDetail = () => {
  const selectedTask = selected_task_signal.value;

  if (!selectedTask || !selectedTask.type) {
    return (
      <Paper className={styles.TaskDetail} elevation={3}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <InfoIcon fontSize="large" color="disabled" />
        </Box>
      </Paper>
    );
  }

  const task = selectedTask[selectedTask.type];

  return (
    <Paper className={styles.TaskDetail} elevation={3} sx={{ padding: 2 }}>
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
      {selectedTask.type === 'suspended' && (
        <Card variant="outlined" sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">Suspended</Typography>
              <Box sx={{ margin: 2 }}>
                <Typography variant="body2">Type: {(task as suspended_task_show_t).type}</Typography>
                {selectedTask.suspended!.type === 'time' && (
                  <Typography variant="body2">Time: {timestamp_to_string((task as suspended_task_show_t).time_info!.time)}</Typography>
                )}
                {selectedTask.suspended!.type === 'email' && (
                  <>
                    <Typography variant="body2">Email: {(task as suspended_task_show_t).email_info?.email}</Typography>
                    <Typography variant="body2">Keywords: {(task as suspended_task_show_t).email_info?.keywords.join(', ')}</Typography>
                  </>
                )}
              </Box>
          </CardContent>
        </Card>
      )}

      {selectedTask.type === 'event' && (
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

    </Paper>
  );
}
