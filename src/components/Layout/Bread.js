import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'react-router-dom'
import pathToRegexp from 'path-to-regexp'
import { queryRouteArrayTree } from 'utils'
import styles from './Layout.less'

const Bread = ({ menu, location }) => {
  // 匹配当前路由
  let pathArray = []
  let current = queryRouteArrayTree(menu,location.pathname,'pathKey','subMenus')

  const getPathArray = (item) => {
    pathArray.unshift(item)
    if (item.parentMenu) {
      getPathArray(queryRouteArrayTree(menu,item.parentMenu,undefined, 'subMenus'))
    }
  }

  let paramMap = {}
  if (!current) {
    pathArray.push(menu[0] || {
      id: 1,
      icon: 'laptop',
      name: 'Dashboard',
    })
    pathArray.push({
      id: 404,
      name: 'Not Found',
    })
  } else {
    getPathArray(current)

    let keys = []
    let values = pathToRegexp(current.pathKey, keys).exec(location.pathname.replace('#', ''))
    if (keys.length) {
      keys.forEach((currentValue, index) => {
        if (typeof currentValue.name !== 'string') {
          return
        }
        paramMap[currentValue.name] = values[index + 1]
      })
    }
  }

  // 递归查找父级
  const breads = pathArray.map((item, key) => {
    const content = (
      <span>{item.iconType
        ? <Icon type={item.iconType} style={{ marginRight: 4 }} />
        : ''}{item.name}</span>
    )
    return (
      <Breadcrumb.Item key={key}>
        {((pathArray.length - 1) !== key && item.componentPath)
          ? <Link to={pathToRegexp.compile(item.pathKey || '')(paramMap) || '#'}>
            {content}
          </Link>
          : content}
      </Breadcrumb.Item>
    )
  })

  return (
    <div className={styles.bread}>
      <Breadcrumb>
        {breads}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  menu: PropTypes.array,
  location: PropTypes.object,
}

export default Bread
