import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from '../../../../../components/index'
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
        title: '你确定要删除该编码规则？',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '实体项',
      dataIndex: 'entityName',
      key: 'entityName',
    }, {
      title: '前缀',
      dataIndex: 'prefix',
      key: 'prefix',
    },{
      title: '日期格式',
      dataIndex: 'dateFormat',
      key: 'dateFormat',
    }, {
      title: '流水号长度',
      dataIndex: 'codeNumLength',
      key: 'codeNumLength',
    }, {
      title: '分隔符',
      dataIndex: 'separate',
      key: 'separate',
    },{
      title: '当前流水号',
      dataIndex: 'codeNumMax',
      key: 'codeNumMax',
    }, {
      title: '排序号最大值',
      dataIndex: 'sortNoMax',
      key: 'sortNoMax',
    }, {
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
