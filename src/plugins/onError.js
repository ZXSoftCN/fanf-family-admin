import { message } from 'antd'

export default {
  onError (e) {
    e.preventDefault()
    if (e.statusCode !== 200) {
        message.error(e.message)
    }
  },
}
