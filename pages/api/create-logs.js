import { appendFile } from 'fs'
import moment from 'moment'

export default function handler(req, res) {
  if (req.method === 'POST') {

const data = 
`
${'='.repeat(30)} ${moment().format('LLLL')} ${'='.repeat(30)}
\n\n
${req.body.message}
\n\n
${'= END ='.repeat(20)}
${'= END ='.repeat(20)}
\n\n
`

  appendFile('logs.txt', data, (err) => {
      if (err) throw err;
    })
  } else {
    // Handle any other HTTP method
  }

  res.status(200).json({ success: 'Success' })
}
