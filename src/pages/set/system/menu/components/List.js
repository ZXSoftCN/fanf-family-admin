import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from '../../../../../components/index'
import { Link } from 'react-router-dom'
import AnimTableBody from '../../../../../components/DataTable/AnimTableBody'
import styles from './List.less'

const { confirm } = Modal

const List = ({
  onDeleteItem, onEditItem, isMotion, location, ...tableProps
}) => {

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: '你确定要删除该菜单？',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    /*{
      title: '头像',
      dataIndex: 'iconUrl',
      key: 'avatar',
      width: 64,
      className: styles.avatar,
      render: text => <img alt="avatar" width={24} src={text} />,
    }, */
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '路径',
      dataIndex: 'pathKey',
      key: 'pathKey',
    }, {
      title: '图标',
      dataIndex: 'iconType',
      key: 'iconType',
    },{
      title: '组件项',
      dataIndex: 'componentPath',
      key: 'componentPath',
    }, {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      render:(text) => new Date(text).format('yyyy-MM-dd'),
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: text => (<span>{text
        ? '启用'
        : '禁用'}</span>),
    }, {
      title: '是否可见',
      dataIndex: 'showMenu',
      key: 'showMenu',
      render: text => (<span>{text
        ? '可见'
        : '隐藏'}</span>),
    },  {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '删除' }]} />
      },
    },
  ]

  const AnimateBody = (props) => {
    return <AnimTableBody {...props} />
  }

  const CommonBody = (props) => {
    return <tbody {...props} />
  }

  return (
    <Table
      {...tableProps}
      className={classnames(styles.table, { [styles.motion]: isMotion })}
      bordered
      scroll={{ x: 1000 }}
      columns={columns}
      simple
      rowKey={record => record.id}
      components={{
        body: { wrapper: isMotion ? AnimateBody : CommonBody },
      }}
    />
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
