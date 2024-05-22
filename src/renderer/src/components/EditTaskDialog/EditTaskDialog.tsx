import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormGroup
} from '@mui/material'
import { ChangeEvent } from 'react'
import { Signal } from '@preact/signals'
import { is_inputting } from '../../pages/ATodo/ATodo'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface Task {
  id: string
  name: string
  goal: string
  deadline: string
  in_work_time: boolean
  status: TaskStatus
  trigger_type: string[]
  after_effect: string[]
  suspended_task_type: string[]
  resume_time: string
  email: string
  keywords: string[]
  event_name: string
  event_description: string
  now_at: number
  period: number
  intervals: number[]
  dependency_constraint: string
  subtask_constraint: string
}

export enum TaskAfterEffectType {
  periodic = 'periodic'
}

export enum TaskStatus {
  todo = 'todo',
  in_progress = 'in_progress',
  paused = 'paused',
  suspended = 'suspended',
  done = 'done'
}

export enum SuspendedTaskType {
  time = 'time',
  email = 'email'
}

export enum TaskTriggerType {
  event = 'event'
}

interface EditTaskDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (task: Task) => void
}

export const form_data: Signal<Task> = new Signal<Task>({
  id: '',
  name: '',
  goal: '',
  deadline: '',
  in_work_time: false,
  status: TaskStatus.todo,
  trigger_type: [],
  after_effect: [],
  suspended_task_type: [],
  resume_time: '',
  email: '',
  keywords: [],
  event_name: '',
  event_description: '',
  now_at: 0,
  period: 0,
  intervals: [],
  dependency_constraint: '',
  subtask_constraint: ''
})

export const EditTaskDialog = ({ open, onClose, onSubmit }: EditTaskDialogProps) => {
  is_inputting.value = open
  // console.log('EditTaskDialog rendered')

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    form_data.value = { ...form_data.value, [name]: value }
  }

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    form_data.value = { ...form_data.value, [name]: checked }
  }
  const handleEventNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    form_data.value = { ...form_data.value, event_name: e.target.value }
  }

  const handleEventDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    form_data.value = { ...form_data.value, event_description: e.target.value }
  }

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    form_data.value = { ...form_data.value, status: e.target.value as TaskStatus }
  }

  const handleResumeTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    form_data.value = { ...form_data.value, resume_time: e.target.value }
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    form_data.value = { ...form_data.value, email: e.target.value }
  }

  const handleKeywordsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(',')
    form_data.value = { ...form_data.value, keywords }
  }

  const handleNowAtChange = (e: ChangeEvent<HTMLInputElement>) => {
    form_data.value = { ...form_data.value, now_at: parseInt(e.target.value, 10) }
  }

  const handlePeriodChange = (e: ChangeEvent<HTMLInputElement>) => {
    form_data.value = { ...form_data.value, period: parseInt(e.target.value, 10) }
  }

  const handleIntervalsChange = (e: ChangeEvent<HTMLInputElement>) => {
    // const intervals = e.target.value.split(',').filter(interval => interval !== '').map(interval => parseInt(interval, 10));
    // form_data.value = { ...form_data.value, intervals }
    const intervals = e.target.value
      .split(',')
      .filter((interval) => interval !== '')
      .map((interval) => parseInt(interval, 10))
    form_data.value = { ...form_data.value, intervals }
  }

  const handleTriggerTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as TaskTriggerType
    const updatedTriggerTypes = form_data.value.trigger_type.includes(value)
      ? form_data.value.trigger_type.filter((t) => t !== value)
      : [...form_data.value.trigger_type, value]
    form_data.value = { ...form_data.value, trigger_type: updatedTriggerTypes }
  }

  const handleAfterEffectChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as TaskAfterEffectType
    const updatedAfterEffects = form_data.value.after_effect.includes(value)
      ? form_data.value.after_effect.filter((effect) => effect !== value)
      : [...form_data.value.after_effect, value]
    form_data.value = { ...form_data.value, after_effect: updatedAfterEffects }
  }

  const handleSuspendedTaskTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as SuspendedTaskType
    form_data.value = { ...form_data.value, suspended_task_type: [value] }
  }

  const handleSubmit = () => {
    const formattedData = {
      ...form_data.value,
      deadline: form_data.value.deadline ? form_data.value.deadline : ''
    }
    onSubmit(formattedData)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="span">
          Edit Task
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={form_data.value.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="goal"
            label="Goal"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={form_data.value.goal}
            onChange={handleInputChange}
          />
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Constraints</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                margin="dense"
                name="dependency_constraint"
                label="Dependency Constraint"
                type="text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={form_data.value.dependency_constraint}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="subtask_constraint"
                label="Subtask Constraint"
                type="text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={form_data.value.subtask_constraint}
                onChange={handleInputChange}
              />
            </AccordionDetails>
          </Accordion>
          <TextField
            margin="dense"
            name="deadline"
            label="Deadline"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={form_data.value.deadline}
            onChange={handleInputChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="in_work_time"
                checked={form_data.value.in_work_time}
                onChange={handleCheckboxChange}
              />
            }
            label="In Work Time"
          />
          <FormControl component="fieldset">
            <FormLabel component="legend">Status</FormLabel>
            <RadioGroup
              name="status"
              value={form_data.value.status.toString()}
              onChange={handleStatusChange}
            >
              {[
                { label: 'To Do', value: TaskStatus.todo },
                { label: 'Suspended', value: TaskStatus.suspended },
                { label: 'Done', value: TaskStatus.done }
              ].map((status) => (
                <FormControlLabel
                  key={status.value}
                  value={status.value.toString()}
                  control={<Radio />}
                  label={status.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
          {form_data.value.status === TaskStatus.suspended && (
            <>
                          <FormControl component="fieldset">
              <FormLabel component="legend">Suspended Task Type</FormLabel>
              <RadioGroup
                name="suspended_task_type"
                value={form_data.value.suspended_task_type[0] || ''}
                onChange={handleSuspendedTaskTypeChange}
              >
                {[
                  { label: 'Time', value: SuspendedTaskType.time },
                  { label: 'Email', value: SuspendedTaskType.email }
                  // Add more types here as needed
                ].map((type) => (
                  <FormControlLabel
                    key={type.value}
                    control={<Radio />}
                    value={type.value.toString()}
                    label={type.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
              {form_data.value.suspended_task_type.includes(SuspendedTaskType.time) && (
            <TextField
              margin="dense"
              name="resume_time"
              label="Resume Time"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              value={form_data.value.resume_time}
              onChange={handleResumeTimeChange}
            />
          )}
          {form_data.value.suspended_task_type.includes(SuspendedTaskType.email) && (
            <>
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={form_data.value.email}
                onChange={handleEmailChange}
              />
              <TextField
                margin="dense"
                name="keywords"
                label="Keywords"
                type="text"
                fullWidth
                variant="outlined"
                value={form_data.value.keywords.join(',')}
                onChange={handleKeywordsChange}
                helperText="Enter keywords separated by commas"
              />
            </>
          )}
            </>
          )}
          <FormControl component="fieldset">
            <FormLabel component="legend">Trigger Type</FormLabel>
            <FormGroup>
              {[{ label: 'Event', value: TaskTriggerType.event }].map((type) => (
                <FormControlLabel
                  key={type.value}
                  control={
                    <Checkbox
                      checked={form_data.value.trigger_type.includes(type.value)}
                      onChange={handleTriggerTypeChange}
                      value={type.value.toString()}
                    />
                  }
                  label={type.label}
                />
              ))}
            </FormGroup>
          </FormControl>
          {form_data.value.trigger_type.includes(TaskTriggerType.event) && (
            <>
              <TextField
                margin="dense"
                name="event_name"
                label="Event Name"
                type="text"
                fullWidth
                variant="outlined"
                value={form_data.value.event_name}
                onChange={handleEventNameChange}
              />
              <TextField
                margin="dense"
                name="event_description"
                label="Event Description"
                type="text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={form_data.value.event_description}
                onChange={handleEventDescriptionChange}
              />
            </>
          )}
          <FormControl component="fieldset">
            <FormLabel component="legend">After Effect</FormLabel>
            <FormGroup>
              {[
                { label: 'Periodic', value: TaskAfterEffectType.periodic }
                // Add more effects here as needed
              ].map((effect) => (
                <FormControlLabel
                  key={effect.value}
                  control={
                    <Checkbox
                      checked={form_data.value.after_effect.includes(effect.value)}
                      onChange={handleAfterEffectChange}
                      value={effect.value.toString()}
                    />
                  }
                  label={effect.label}
                />
              ))}
            </FormGroup>
          </FormControl>
          {form_data.value.after_effect.includes(TaskAfterEffectType.periodic) && (
            <>
              <TextField
                margin="dense"
                name="now_at"
                label="Now At"
                type="number"
                fullWidth
                variant="outlined"
                value={form_data.value.now_at.toString()}
                onChange={handleNowAtChange}
              />
              <TextField
                margin="dense"
                name="period"
                label="Period"
                type="number"
                fullWidth
                variant="outlined"
                value={form_data.value.period.toString()}
                onChange={handlePeriodChange}
              />
              <TextField
                margin="dense"
                name="intervals"
                label="Intervals"
                type="text"
                fullWidth
                variant="outlined"
                value={
                  form_data.value.intervals.join(',') !== ''
                    ? form_data.value.intervals.join(',') + ','
                    : ''
                }
                onChange={handleIntervalsChange}
                helperText="Enter intervals separated by commas"
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
