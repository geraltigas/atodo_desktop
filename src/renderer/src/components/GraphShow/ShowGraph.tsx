import { applyNodeChanges, Background, BackgroundVariant, Controls, Position, ReactFlow } from 'reactflow'
import { useOnConnect, useOnEdgeClick, useOnNodeClick } from '../../events/use_event_atodo'
import { useEffect } from 'preact/compat'
import StartNode from '../Nodes/StartNode/StartNode'
import EndNode from '../Nodes/EndNode/EndNode'
import TaskNode from '../Nodes/TaskNode/TaskNode'
import OriginNode from '../Nodes/OriginNode/OriginNode'
import { signal, Signal } from '@preact/signals'
import DefaultEdges from '../Edges/DefaultEdges/DefaultEdges'
import { get_show_data, position, show_data } from '../../api/task_show_api'
import { is_modified } from '../ShowModified/ShowModified'

// nodes
export type Node = {
  id: string
  position: {
    x: number
    y: number
  }
  type: 'start' | 'end' | 'origin' | 'task'
  // style: CSSProperties;
  draggable: boolean
  selectable: boolean
  data: {}
  sourcePosition?: Position
  targetPosition?: Position
}

export const origin_node: Node = {
  id: 'origin',
  type: 'origin',
  position: {
    x: 0,
    y: 0
  },
  data: {},
  draggable: false,
  selectable: false
}

export const start_node: Node = {
  id: 'start',
  position: {
    x: 0,
    y: 0
  },
  data: {},
  type: 'start',
  selectable: false,
  draggable: false,
  targetPosition: Position.Right
}

export const end_node: Node = {
  id: 'end',
  position: {
    x: 100,
    y: 0
  },
  data: {},
  type: 'end',
  selectable: false,
  draggable: true
}

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  task: TaskNode,
  origin: OriginNode
}

export const nodes_init: Node[] = [start_node, end_node, origin_node]
const nodes: Signal<Node[]> = signal<Node[]>(nodes_init)

export type Edge = {
  id: string
  source: string
  target: string
  sourceHandle: string
  targetHandle: string
  type: string
  selected: boolean
}

export const edges_init: Edge[] = [
  {
    id: `start-end`,
    source: 'start',
    target: 'end',
    sourceHandle: 'start-node-source',
    targetHandle: 'end-node-target',
    type: 'default_e',
    selected: false
  }
]
const edges: Signal<Edge[]> = signal<Edge[]>(edges_init)

export type NowSelected = {
  type: 'node' | 'edge' | 'none'
  reference: Node | Edge | null
}

const now_selected_init: NowSelected = {
  type: 'none',
  reference: null
}
export const now_selected: Signal<NowSelected> = signal<NowSelected>(now_selected_init)

const edgeTypes = {
  default_e: DefaultEdges
}

export const update_show_graph_with_show_data = (show_data: show_data) => {
    let _show_nodes: Node[] = []
    let _show_edges: Edge[] = []
    if (show_data.nodes.length <= 0 ) {
      _show_edges.push(edges_init[0])
    }
    let avg_y = 0
    let max_x = 0
    let temp_nodes = show_data.nodes.map((node) => {
      avg_y += node.position.y
      if (node.position.x > max_x) {
        max_x = node.position.x
      }
      return {
        id: node.id,
        position: {
          x: node.position.x,
          y: node.position.y
        },
        type: 'task' as 'task',
        draggable: true,
        selectable: true,
        data: {
          name: node.name,
          id: node.id,
        }
      }
    })
    avg_y /= show_data.nodes.length
    _show_nodes.push(...temp_nodes)
    _show_nodes.push(origin_node)
    _show_nodes.push({
      ...end_node,
      position: {
        // if NaN then set to 0
        x: isNaN(max_x) ? 100 : (max_x + 100),
        y: isNaN(avg_y) ? 0 : avg_y
      },
    })
    _show_nodes.push(start_node)
    nodes.value = _show_nodes
    let temp_edges = show_data.edges.map((edge) => {
      return {
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        sourceHandle: 'task-node-source',
        targetHandle: 'task-node-target',
        type: 'default_e',
        selected: false
      }
    })
    _show_edges.push(...temp_edges)
    show_data.node_connected_to_end.forEach((node_id) => {
      _show_edges.push({
        id: `${node_id}-end`,
        source: node_id,
        target: 'end',
        sourceHandle: 'task-node-source',
        targetHandle: 'end-node-target',
        type: 'default_e',
        selected: false
      })
    })
    show_data.node_connected_to_start.forEach((node_id) => {
      _show_edges.push({
        id: `start-${node_id}`,
        source: 'start',
        target: node_id,
        sourceHandle: 'start-node-source',
        targetHandle: 'task-node-target',
        type: 'default_e',
        selected: false
      })
    })
    edges.value = _show_edges
}

export const  init_show_graph_data = async () => {
  return get_show_data().then((res) => {
    update_show_graph_with_show_data(res)
    console.log(res)
  })
}

export const position_map = new Map<string, position>()

export const ShowGraph = () => {
  let onConnect = useOnConnect()
  let onNodeClick = useOnNodeClick()
  let onEdgeClick = useOnEdgeClick()

  // console.log('GraphShow rendered')

  useEffect(() => {
    return () => {}
  }, [])

  return (
    <ReactFlow
      nodes={nodes.value}
      edges={edges.value}
      onNodesChange={(changes) => {
        nodes.value = applyNodeChanges(changes, nodes.value) as Node[]
        changes.forEach((value) => {
          if (value.type === 'position' && value.dragging && value.id !== 'start' && value.id !== 'end') {
            position_map.set(value.id, { x: value.position!.x, y: value.position!.y })
            is_modified.value = true
          }
        })
      }}
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      snapGrid={[10, 10]}
      snapToGrid={true}
      fitView
    >
      <Background gap={10} color="black" variant={BackgroundVariant.Dots} />
      <Controls />
    </ReactFlow>
  )
}

export { nodes, edges }
