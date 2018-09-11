import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Icon } from 'antd'
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
        parentMenuId: item.parentMenuId || '0',
        sortNo: item.sortNo || 0,
      }
      // data.address = data.address.join(' ')
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="菜单名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name || '',
            rules: [
              {
                required: true,
              },
            ],
          })(<Input prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />}/>)}
        </FormItem>
        <FormItem label="路径" hasFeedback {...formItemLayout}>
          {getFieldDecorator('pathKey', {
            initialValue: item.pathKey,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />}/>)}
        </FormItem>
        <FormItem label="图标" hasFeedback {...formItemLayout}>
          {getFieldDecorator('iconType', {
            initialValue: item.iconType || 'appstore-o',
            rules: [
              {
                required: false,
              },
            ],
          })(<Input prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />}/>)}
        </FormItem>
        <FormItem label="组件项" hasFeedback {...formItemLayout}>
          {getFieldDecorator('componentPath', {
            initialValue: item.componentPath || 'index.js',
            rules: [
              {
                required: false,
              },
            ],
          })(<Input prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />}/>)}
        </FormItem>
        <FormItem label="状态" hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: item.status === undefined ? true : item.status,
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
        <FormItem label="是否可见" hasFeedback {...formItemLayout}>
          {getFieldDecorator('showMenu', {
            initialValue: item.showMenu === undefined ? true : item.showMenu,
            rules: [
              {
                required: true,
                type: 'boolean',
              },
            ],
          })(<Radio.Group>
            <Radio value={true}>可见</Radio>
            <Radio value={false}>隐藏</Radio>
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
