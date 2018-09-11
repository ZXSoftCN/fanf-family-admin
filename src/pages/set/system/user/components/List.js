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
        title: '你确定要删除该用户？',
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
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record) => <Link to={`/set/system/user/${record.id}`}>{text}</Link>,
    }, {
      title: '昵称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '电话',
      dataIndex: 'telephone',
      key: 'telephone',
    }, {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },{
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      render:(text) => new Date(text).format('yyyy-MM-dd'),
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: text => (<span>{text
        ? '启用'
        : '禁用'}</span>),
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
