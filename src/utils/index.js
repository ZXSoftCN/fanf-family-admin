/* global window */
import cloneDeep from 'lodash.clonedeep'
import pathToRegexp from "path-to-regexp"

export classnames from 'classnames'
export config from './config'
export request from './request'
export outrequest from './outrequest'
export { color } from './theme'

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param  name {String}
 * @return  {String}
 */
export function queryURL (name) {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
export function queryArray (array, key, keyAlias = 'key') {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 树内查询
 * @param   {Array}     arrTree:数组树（不是唯一根节点的树）
 * @param   {object}    key:待检索的项
 * @param   {String}    keyAlias:数组树中核准检索项的对象属性
 * @return  {String}    children:数组树的子级节点属性名
 */
export function queryArrayTree (arrTree,key,  keyAlias = 'id',children = 'children') {

  if (!(arrTree instanceof Array)) {
    return null
  }
  let item = arrTree.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  } else {
    arrTree.forEach(_ => {
      if (_[children]) {
        queryArrayTree(_[children],key,keyAlias,children)
      }
    })
  }
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 与queryArrayTree区别：使用pathToRegexp进行比较
 * @param arrTree
 * @param key
 * @param keyAlias
 * @param children
 * @returns {*}
 */
export function queryRouteArrayTree (arrTree,key,  keyAlias = 'id',children = 'children') {
  if (!(arrTree instanceof Array)) {
    return null
  }

  const cyclicCall = (arrTree,key,  keyAlias ,children) => {
    if (!arrTree || !(arrTree instanceof Array)) {
      return
    }
    let currRlt = arrTree.filter(_ => pathToRegexp(_[keyAlias]).exec(key));
    if (currRlt.length) {
      item = currRlt[0]
    }else{
      arrTree.forEach(_ => {
        if (_[children]) {
          cyclicCall(_[children],key,keyAlias,children)
        }
      })
    }
  }

  let item
  cyclicCall(arrTree,key,keyAlias,children)
  return item
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    parentMenu
 * @param   {String}    children
 * @return  {Array}
 */
export function arrayToTree (array, id = 'id', pid = 'parentMenu', children = 'children') {
  let data = cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}
