import { Handle, Position } from 'reactflow'
import styles from './TaskNode.module.css'
import { now_selected, Node } from '../../ShowGraph/ShowGraph'
import { TaskStatus } from '../../EditTaskDialog/EditTaskDialog'

const TaskNode = ({ data }) => {
  const classNames = [styles.TaskNode]
  if (
    now_selected.value.type === 'node' &&
    (now_selected.value.reference! as Node).id === data.id
  ) {
    classNames.push(styles.focused)
  }

  switch (data.status) {
    case TaskStatus.todo:
      classNames.push(styles.TaskNodeTodo)
      break
    case TaskStatus.done:
      classNames.push(styles.TaskNodeDone)
      break
    case TaskStatus.suspended:
      classNames.push(styles.TaskNodeSuspended)
      break
    default:
      classNames.push(styles.TaskNodeCreated)
      break
  }

  // const realTask: Task = data.realTask

  return (
    <div className={classNames.join(' ')}>
      <Handle
        type={'source'}
        position={Position.Right}
        className={styles.TaskNodeHandle}
        id={'task-node-source'}
        isConnectable={true}
      />
      <Handle
        type={'target'}
        position={Position.Left}
        className={styles.TaskNodeHandle}
        id={'task-node-target'}
        isConnectable={true}
      />
      <div>{data.name}</div>
    </div>
  )
}

export default TaskNode
