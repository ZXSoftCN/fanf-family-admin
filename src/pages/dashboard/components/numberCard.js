import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Card } from 'antd'
import CountUp from 'react-countup'
import styles from './numberCard.less'

function NumberCard ({
  icon,  title, numbers, countUp,color,amount,subTitle1,subTitle2,
}) {
  return (
    <Card className={styles.numberCard} bordered={false} bodyStyle={{ padding: 0 }}>
      <Icon className={styles.iconWarp} style={ {color} } type={icon} />
      <div className={styles.content}>
        <p className={styles.title}>{title || 'No Title'}</p>
        <div className={styles.p}>
          {subTitle1?<p>
            <span className={styles.subtitle}>{subTitle1}</span>
            <CountUp className={styles.number}
                     start={0}
                     end={numbers}
                     duration={2.75}
                     useEasing
                     useGrouping
                     separator=","
                     {...countUp || {}}
            />
          </p>:<div />}
          {subTitle2?<p>
          <span className={styles.subtitle}>{subTitle2}</span>
          <CountUp className={styles.number}
            start={0}
            end={amount}
            duration={2.75}
            useEasing
            useGrouping
            separator=","
            {...countUp || {}}
          />
        </p>:<p></p>}
        </div>
      </div>
    </Card>
  )
}

NumberCard.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
  number: PropTypes.number,
  countUp: PropTypes.object,
}

export default NumberCard
