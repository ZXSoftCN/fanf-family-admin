import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { color } from 'utils'
import styles from './completeRateByDepts.less'

const status = {
  1: {
    color: color.yellow,
    text: '不足',
  },
  2: {
    color: color.green,
    text: '过半',
  },
  3: {
    color: color.blue,
    text: '待完成',
  },
  4: {
    color: color.red,
    text: '超额',
  },
}

function CompleteRateByDepts ({ data }) {
  const columns = [
    {
      title: '部门',
      dataIndex: 'name',
      render: (text, it) => <span style={{ color: status[it.status].color }}>{text}</span>,
    }, {
      title: '笔数',
      dataIndex: 'dealNumber',
      render: (text) => <span>{text}</span>,
    },{
      title: '金额',
      dataIndex: 'dealAmount',
      render: (text) => <span>${text}</span>,
    },{
      title: '完成率',
      dataIndex: 'rate',
      render: (text, it) => <span style={{ color: status[it.status].color }}>{`${Number(text*100).toFixed(2)}%`}</span>,
    }, {
      title: '状态',
      dataIndex: 'status',
      render: text => <Tag color={status[text].color}>{status[text].text}</Tag>,
    },
  ]
  return (
    <div className={styles.completeRateByDepts}>
      <Table pagination={false} columns={columns} rowKey={(record, key) => key} dataSource={data.filter((item, key) => key < 5)} />
    </div>
  )
}

CompleteRateByDepts.propTypes = {
  data: PropTypes.array,
}

export default CompleteRateByDepts
