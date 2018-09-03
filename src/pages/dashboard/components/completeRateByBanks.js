import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { color } from 'utils'
import styles from './completeRateByDepts.less'

function CompleteRateByBanks ({ data }) {
  const columns = [
    {
      title: '银行',
      dataIndex: 'name',
    }, {
      title: '笔数',
      dataIndex: 'dealNumber',
      render: (text) => <span>{text}</span>,
    }, {
      title: '成交金额',
      dataIndex: 'dealAmount',
      render: (text) => <span>${text}</span>,
    },
  ]
  return (
    <div className={styles.completeRateByDepts}>
      <Table pagination={false} columns={columns} rowKey={(record, key) => key} dataSource={data.filter((item, key) => key < 5)} />
    </div>
  )
}

CompleteRateByBanks.propTypes = {
  data: PropTypes.array,
}

export default CompleteRateByBanks
