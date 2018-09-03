import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input,Icon } from 'antd'
import { regExpConfig } from 'regulars'
import { config } from 'utils'
import styles from './index.less'

const FormItem = Form.Item

const Login = ({
  loading,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }

  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <img alt="logo" src={config.logo} />
        <span>{config.name}</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true, min: 3, max: 10, message: '用户名为3-10个字符',
              },
              { pattern: regExpConfig.policeNo, message: '账号3-10位数字或字母组成' },
            ],
          })(<Input onPressEnter={handleOk} addonBefore={<Icon type="user" />} placeholder="请输入用户名" type="text" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true, min: 5, max: 16, message: '密码为5-16个字符',
              },
              { pattern: regExpConfig.pwd, message: '密码由5-16位数字或者字母组成' },
            ],
          })(<Input addonBefore={<Icon type="lock" />} placeholder="请输入密码" type="password" onPressEnter={handleOk} />)}
        </FormItem>
        <Row>
          <Button type="primary" onClick={handleOk} loading={loading.effects.login}>
            登录
          </Button>
          <p>
            <span>Username：admin</span>
            <span>Password：123456</span>
          </p>
        </Row>

      </form>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ loading }) => ({ loading }))(Form.create()(Login))
