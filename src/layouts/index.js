import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import withRouter from 'umi/withRouter'
import moment from 'moment'
import 'moment/locale/zh-cn'
import App from './app'

moment.locale('zh-cn')

export default withRouter((props) => {
  return (
    <LocaleProvider locale={zh_CN}>
      <App>
        { props.children }
      </App>
    </LocaleProvider>
  )
})
