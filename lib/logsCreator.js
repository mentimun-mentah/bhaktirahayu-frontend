import axios from 'axios'

export const createLogs = (data) => {
  const errData = { message: JSON.stringify(data, null, 2) }

  axios.post('/api/create-logs', errData)
    .then(() => { })
    .catch(() => { })
}
