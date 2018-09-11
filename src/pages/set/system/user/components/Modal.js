import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader,Icon } from 'antd'
import { regExpConfig } from 'regulars'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  modalType,
  eyeOpen,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        id: item.id || '0',
      }
      // data.address = data.address.join(' ')
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const handleOpenEye = () => {
    dispatch({type: 'user/switchEyeOpen'})
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="用户名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('userName', {
            initialValue: item.userName || '',
            rules: [
              {
                required: true, min: 3, max: 10, message: '用户名为3-10个字符',
              },
              { pattern: regExpConfig.userName, message: '账号3-10位数字或字母组成' },
            ],
          })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}/>)}
        </FormItem>
        <FormItem label="昵称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />}/>)}
        </FormItem>
        <FormItem label="密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            initialValue: item.password,
            rules: [
              { required: true, message: '密码请输入6-16位数字或者字母' },
              { pattern: regExpConfig.pwd, message: '密码请输入6-16位数字或者字母' },
            ],
          })(eyeOpen?<Input addonBefore={<Icon type="eye" onClick={handleOpenEye}/>} />
          : <Input addonBefore={<Icon type="lock" onClick={handleOpenEye}/>} type="password" />)}
        </FormItem>
        <FormItem label="电话" hasFeedback {...formItemLayout}>
          {getFieldDecorator('telephone', {
            initialValue: item.telephone,
            rules: [
              {
                required: false,
                pattern: regExpConfig.mobile,
                message: '录入了无效的电话号码！',
              },
            ],
          })(<Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}/>)}
        </FormItem>
        <FormItem label="邮箱" hasFeedback {...formItemLayout}>
          {getFieldDecorator('email', {
            initialValue: item.email,
            rules: [
              {
                required: false,
                pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                message: '录入了无效的邮箱地址！',
              },
            ],
          })(<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}/>)}
        </FormItem>
        <FormItem label="状态" hasFeedback {...formItemLayout}>
          {getFieldDecorator('state', {
            initialValue: item.state === undefined ? true : item.state,
            rules: [
              {
                required: true,
                type: 'boolean',
              },
            ],
          })(<Radio.Group>
            <Radio value={true}>启用</Radio>
            <Radio value={false}>禁用</Radio>
          </Radio.Group>)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
