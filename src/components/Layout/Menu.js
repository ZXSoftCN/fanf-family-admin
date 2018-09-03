import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { arrayToTree, queryArray } from 'utils'
import pathToRegexp from 'path-to-regexp'

const { SubMenu } = Menu
let openKeysFlag = false

const Menus = ({
  siderFold, darkTheme, navOpenKeys, changeOpenKeys, menu, location,
}) => {
  // 生成树状
  // const menuTree = arrayToTree(menu.filter(_ => _.showMenu !== 0), 'id', 'parentMenuId','subMenus')
  const levelMap = {}

  // 递归生成菜单
  const getDeprecatedMenus = (menuTreeN, siderFoldN) => {
    return menuTreeN.map((item) => {
      if (item.children) {
        if (item.showMenu && item.showMenu === 1) {
          //记录中层菜单节点，到levelMap中。为后续getAncestorKeys
          levelMap[item.id] = item.parentMenuId
        }
        return (
          <SubMenu
            key={item.id}
            title={<span>
              {item.iconType && <Icon type={item.iconType} />}
              {(!siderFoldN || !menuTree.includes(item)) && item.name}
            </span>}
          >
            {getMenus(item.children, siderFoldN)}
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={item.id}>
          <Link to={item.pathKey || '#'} style={siderFoldN ? { width: 10 } : {}}>
            {item.iconType && <Icon type={item.iconType} />}
            {item.name}
          </Link>
        </Menu.Item>
      )
    })
  }

  const getMenus = (menu, siderFoldN) => {
    return menu.map((item) => {
      if (item.subMenus) {
        if (item.showMenu && item.parentMenu) {
          //记录中层菜单节点，到levelMap中。为后续getAncestorKeys
          levelMap[item.id] = item.parentMenu
        }
        return (
          <SubMenu
            key={item.id}
            title={<span>
              {item.iconType && <Icon type={item.iconType} />}
              {(!siderFoldN || !menu.includes(item)) && item.name}
            </span>}
          >
            {getMenus(item.subMenus, siderFoldN)}
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={item.id}>
          <Link to={item.pathKey || '#'} style={siderFoldN ? { width: 10 } : {}}>
            {item.iconType && <Icon type={item.iconType} />}
            {item.name}
          </Link>
        </Menu.Item>
      )
    })
  }
  const menuItems = getMenus(menu, siderFold)

  // 保持选中
  const getAncestorKeys = (key) => {
    let map = {}
    const getParent = (index) => {
      const result = [String(levelMap[index])]
      if (levelMap[result[0]]) {
        result.unshift(getParent(result[0])[0])
      }
      return result
    }
    for (let index in levelMap) {
      if ({}.hasOwnProperty.call(levelMap, index)) {
        map[index] = getParent(index)
      }
    }
    return map[key] || []
  }

  //展开菜单时记录打开的菜单项，并保存检索它的上游菜单项（包括中层菜单项）。用于展开菜单和分析当前currentMenu项。
  const onOpenChange = (openKeys) => {
    if (navOpenKeys.length) changeOpenKeys([]), openKeysFlag = true
    const latestOpenKey = openKeys.find(key => !navOpenKeys.includes(key))// 根据当前打开的菜单ID，检索已经打开过的navOpenKeys中没有的id，作为最近打开的菜单ID
    const latestCloseKey = navOpenKeys.find(key => !openKeys.includes(key))// 已经打开过的navOpenKey菜单组中若那些没有在当前打开的openKeys中则视为最近关闭的菜单项
    let nextOpenKeys = []
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey)
    }
    changeOpenKeys(nextOpenKeys)
  }

  let menuProps = !siderFold ? {
    onOpenChange,
    openKeys: navOpenKeys,
  } : {}


  // 寻找选中路由
  let currentMenu
  let defaultSelectedKeys
  for (let item of menu) {
    if (item.pathKey && pathToRegexp(item.pathKey).exec(location.pathname)) {
      if (!navOpenKeys.length && item.showMenu === 1 && !openKeysFlag) changeOpenKeys([String(item.parentMenuId)])
      currentMenu = item
      break
    }
  }
  const getPathArray = (array, current, pid, id) => {
    let result = [String(current[id])]
    const getPath = (item) => {
      if (item && item[pid]) {
        if (item[pid] === '-1') { // ToDo 检测节点pid是否由null判断
          result.unshift(String(item['parentId']))
        } else {
          result.unshift(String(item[pid]))
          getPath(queryArray(array, item[pid], id))
        }
      }
    }
    getPath(current)
    return result
  }
  if (currentMenu) {
    defaultSelectedKeys = getPathArray(menu, currentMenu, 'parentMenuId', 'id')
  }

  if (!defaultSelectedKeys) {
    defaultSelectedKeys = ['1']
  }

  return (
    <Menu
      {...menuProps}
      mode={siderFold ? 'vertical' : 'inline'}
      theme={darkTheme ? 'dark' : 'light'}
      selectedKeys={defaultSelectedKeys}
    >
      {menuItems}
    </Menu>
  )
}

Menus.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
  location: PropTypes.object,
}

export default Menus
