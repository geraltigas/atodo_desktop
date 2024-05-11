import { render } from 'preact'
import App from './App'
import './styles.css'
import {
  check_database_existence,
  create_database,
  get_database_file_path
} from './api/database_api'

const init_database = async () => {
  const db_existence = await check_database_existence()
  if (!db_existence.status) {
    const db_create = await create_database()
    if (!db_create.status) {
      console.error('Failed to create database')
    }
  }
  const file_path = await get_database_file_path()
  console.log('Database file path: ', file_path.path)
}

init_database().then((_r) => {
  render(<App />, document.getElementById('root')!)
})
