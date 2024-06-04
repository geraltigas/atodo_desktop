import { render } from 'preact'
import App from './App'
import './styles.css'
import { window_control_api } from './api/window_control_api'
import { get_show_stack } from './api/task_show_api'

const test_service = async () => {
  return get_show_stack()
}

test_service()
  .then((_r) => {
    render(<App />, document.getElementById('root')!)
  })
  .catch((_err) => {
    window_control_api.show_notification(
      'Unable to connect to the service',
      'Please check service status and try again.'
    )
    window_control_api.set_close()
  })
