import { Button, IconButton } from '@mui/material'
import { batch, signal } from '@preact/signals'
import styled from './WorkControl.module.css'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import StopIcon from '@mui/icons-material/Stop'
import { selected_task_signal } from '../../pages/Panel/Panel'
import { useEffect } from 'preact/hooks'
import { useCallback } from 'preact/compat'
import {
  get_work_time,
  set_now_doing_task,
  set_now_is_work_time,
  set_today_work_start,
  set_work_time
} from '../../api/app_state_api'
import { now_doing_task_signal } from '../TaskSidebar/TaskSidebar'

// Create a signal to store the work time status
export const work_time_record_control_signal = signal<boolean>(false)

// Create a signal to store the timer
export const timer_signal = signal<number>(0)

// Create a signal to store the day status
export const day_signal = signal<boolean>(false)

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

let interval: NodeJS.Timeout

export const WorkControl = () => {

  // Determine whether the WorkControl component should be disabled
  const isDisabled = selected_task_signal.value.type !== 'todo'

  // Function to handle the click of the IconButton
  const handleIconButtonClick = useCallback(() => {
    // Toggle the work time signal
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

  // Function to handle the click of the button
  const handleButtonClick = useCallback(() => {
    // Logic for completing the task
  }, [])

  // Function to handle the click of the new button
  const handleDayButtonClick = useCallback(() => {
    if (day_signal.value) {
      let p_work_time_start = set_today_work_start(false)
      let p_work_time = set_work_time(0)
      let p_now_is_work_time = set_now_is_work_time(false)
      Promise.all([p_work_time_start, p_work_time, p_now_is_work_time]).then(([work_time_start, work_time, now_is_work_time]) => {
        batch(() => {
          console.log('work_time_start', work_time_start)
          console.log('work_time', work_time)
          console.log('now_is_work_time', now_is_work_time)
          if (work_time_start.status) {
            day_signal.value = false
          }
          if (work_time.status) {
            timer_signal.value = 0
          }
          if (now_is_work_time.status) {
            work_time_record_control_signal.value = false
          }
        })
      })
    } else {
      set_today_work_start(true).then((work_time_start) => {
        console.log('work_time_start', work_time_start)
        if (work_time_start.status) {
          day_signal.value = true
        }
      })
    }

    // Toggle the day signal
  }, [])

  // Effect to start or stop the timer
  useEffect(() => {
    if (work_time_record_control_signal.value) {
      clearInterval(interval)
      interval = setInterval(() => {
        timer_signal.value = timer_signal.value + 1
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [work_time_record_control_signal.value])

  return (
    <div className={styled.workControl}>
      <IconButton className={styled.dayButton} onClick={handleDayButtonClick}>
        {day_signal.value ? <StopIcon color="primary" /> : <PlayArrowIcon color="primary" />}
      </IconButton>
      <div className={styled.timer}>{formatTime(timer_signal.value)}</div>
      <IconButton onClick={handleIconButtonClick} disabled={isDisabled}>
        {work_time_record_control_signal.value ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <Button onClick={handleButtonClick} disabled={isDisabled}>Complete Task</Button>
    </div>
  )
}
