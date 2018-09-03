import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import CountUp from 'react-countup'
import { color } from 'utils'
import styles from './user.less'

const countUpProps = {
  start: 0,
  duration: 2.75,
  useEasing: true,
  useGrouping: true,
  separator: ',',
}

function User ({
  avatarPath:avatar, name,  dealAmount:sales, numbers,msg,month,
}) {
  return (<div className={styles.user}>
    <div className={styles.header}>
      <div className={styles.headerinner}>
        <h5>{`${month}月最佳员工`}</h5>
        <div className={styles.avatar} style={{ backgroundImage: `url(${avatar})` }} />
        <h5 className={styles.name}>{name}</h5>
        <p>dongdong@163.net</p>
      </div>
    </div>
    <div className={styles.number}>
      <div className={styles.item}>
        <p>成交金额 (万元)</p>
        <p style={{ color: color.green }}><CountUp
          end={sales}
          prefix="$"
          {...countUpProps}
        /></p>
      </div>
      <div className={styles.item}>
        <p>成交笔数</p>
        <p style={{ color: color.blue }}><CountUp
          end={numbers}
          {...countUpProps}
        /></p>
      </div>
    </div>
    <div className={styles.footer}>
      <p>{msg}</p>
      {/*<Button type="ghost" size="large">View Profile</Button>*/}
    </div>
  </div>)
}

User.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  sales: PropTypes.number,
  sold: PropTypes.number,
}

export default User
