import { Step, StepLabel, Stepper } from '@mui/material'
import styles from './ShowStack.module.css'
import { signal, Signal } from '@preact/signals'
import { get_show_stack } from '../../api/task_show_api'

// task stack
const task_stack_init: string[] = ['']
const task_stack: Signal<string[]> = signal<string[]>(task_stack_init)

export const init_show_stack_data = async () => {
  return get_show_stack().then((res) => {
    task_stack.value = res.stack
  })
}

export const ShowStack = () => {
  return (
    <Stepper nonLinear className={styles.Stack}>
      {task_stack.value.map((str) => {
        return (
          <Step key={str} completed={false}>
            <StepLabel>{str}</StepLabel>
          </Step>
        )
      })}
    </Stepper>
  )
}

export { task_stack }
