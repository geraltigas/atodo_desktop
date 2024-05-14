import { Dialog, DialogActions, DialogTitle, Button, IconButton } from '@mui/material'
import { batch, signal } from '@preact/signals'
import styled from './WorkControl.module.css'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import { schedule_signal, selected_task_signal } from '../../pages/Panel/Panel'
import { useEffect, useState } from 'preact/hooks'
import { useCallback } from 'preact/compat'
import {
  set_now_doing_task,
  set_now_is_work_time,
  set_work_time
} from '../../api/app_state_api'
import { now_doing_task_signal } from '../TaskSidebar/TaskSidebar'
import styles from './WorkControl.module.css'
import { complete_task } from '../../api/task_api'
import { get_schedule } from '../../api/schedule_api'

// Create a signal to store the work time status
export const work_time_record_control_signal = signal<boolean>(false)

// Create a signal to store the timer
export const timer_signal = signal<number>(0)

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return [
    hrs.toString().padStart(2, '0'),
    mins.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':')
}

export let interval: NodeJS.Timeout;
export let intervalSync: NodeJS.Timeout;

const ClearTimeButton = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    let p_work_time = set_work_time(0)
    let p_now_is_work_time = set_now_is_work_time(false)
    let p_now_doing_task = set_now_doing_task(-1)
    Promise.all([p_work_time, p_now_is_work_time, p_now_doing_task]).then(([work_time, now_is_work_time, now_doing_task]) => {
      batch(() => {
        if (work_time.status && now_is_work_time.status && now_doing_task.status) {
          work_time_record_control_signal.value = false
          timer_signal.value = 0
          now_doing_task_signal.value = -1
        }
      })
    })
    setOpen(false);
  };
  return (
    <div className={styles.ClearTimeButton}>
      <IconButton onClick={handleClickOpen}>
        <CleaningServicesIcon color="error" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Clear Time"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export const WorkControl = () => {

  const isDisabled = selected_task_signal.value.type !== 'todo'

  const handleIconButtonClick = useCallback(() => {
    if (work_time_record_control_signal.value) {
      let p_now_is_work_time = set_now_is_work_time(false)
      let p_work_time = set_work_time(timer_signal.value)
      Promise.all([p_now_is_work_time, p_work_time]).then(([now_is_work_time, work_time]) => {
        batch(() => {
          if (now_is_work_time.status && work_time.status) {
            work_time_record_control_signal.value = false
          }
        })
      })
    } else {
      let p_now_is_work_time = set_now_is_work_time(true)
      Promise.all([p_now_is_work_time]).then(([now_is_work_time]) => {
        batch(() => {
          if (now_is_work_time.status) {
            work_time_record_control_signal.value = true
            now_doing_task_signal.value = selected_task_signal.value.todo!.id
          }
        })
      })
    }
  }, [])

  const handleButtonClick = useCallback(() => {
    let p_now_doing_task = set_now_doing_task(-1)
    let p_complete_task = complete_task(now_doing_task_signal.value)
    Promise.all([p_now_doing_task, p_complete_task]).then(() => {
      return get_schedule()
    }).then((schedule) => {
      batch(() => {
        now_doing_task_signal.value = -1
        schedule_signal.value = schedule
      })
    })
  }, [])

  useEffect(() => {
    if (work_time_record_control_signal.value) {
      clearInterval(interval)
      clearInterval(intervalSync)
      interval = setInterval(() => {
        timer_signal.value = timer_signal.value + 1
      }, 1000)
      intervalSync = setInterval(() => {
        set_work_time(timer_signal.value)
        set_now_is_work_time(true)
      }, 1000 * 60 * 5)
    } else {
      clearInterval(interval)
      clearInterval(intervalSync)
    }
    return () => {
      clearInterval(interval)
      clearInterval(intervalSync)
    }
  }, [work_time_record_control_signal.value])

  return (
    <div className={styled.workControl}>
      <ClearTimeButton />
      <div className={styled.timer}>{formatTime(timer_signal.value)}</div>
      <IconButton onClick={handleIconButtonClick} disabled={isDisabled}>
        {work_time_record_control_signal.value ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <Button onClick={handleButtonClick} disabled={isDisabled || now_doing_task_signal.value === -1}>Complete Task</Button>
    </div>
  )
}
