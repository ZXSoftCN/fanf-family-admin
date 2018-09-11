import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'


const Menu = ({
  location, dispatch, menu, loading,
}) => {
  const { query, pathname } = location
  const {
    list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys,
  } = menu

  const handleRefresh = (newQuery) => {
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify({
        ...query,
        ...newQuery,
      }),
    }))
  }

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`menu/${modalType}`],
    title: `${modalType === 'create' ? '创建菜单' : '修改菜单'}`,
    modalType: modalType,
    wrapClassName: 'vertical-center-modal',
    dispatch:dispatch,
    onOk (data) {
      dispatch({
        type: `menu/${modalType}`,
        payload: data,
      })
        .then(() => {
          handleRefresh()
        })
    },
    onCancel () {
      dispatch({
        type: 'menu/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['menu/query'],
    pagination,
    location,
    isMotion,
    size: 'middle',
    onChange (page) {
      handleRefresh({
        page: page.current,
        size: page.pageSize,
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'menu/delete',
        payload: id,
      })
        .then(() => {
          handleRefresh({
            page: (list.length === 1 && pagination.current > 1) ? pagination.current - 1 : pagination.current,
          })
        })
    },
    onEditItem (item) {
      dispatch({
        type: 'menu/queryCurrent',
        payload:{
          id: item.id,
        },
      }).then(() => {
        dispatch({
          type: 'menu/showModal',
          payload: {
            eyeOpen: false,
            modalType: 'update',
          },
        })
        }
      )

    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'menu/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const filterProps = {
    isMotion,
    filter: {
      ...query,
    },
    onFilterChange (value) {
      handleRefresh({
        ...value,
        page: 1,
      })
    },
    onAdd () {
      dispatch({
        type: 'menu/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'menu/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'menu/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
      .then(() => {
        handleRefresh({
          page: (list.length === selectedRowKeys.length && pagination.current > 1) ? pagination.current - 1 : pagination.current,
        })
      })
  }

  return (
    <Page inner>
      <Filter {...filterProps} />
      {
        selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {`已选中 ${selectedRowKeys.length} 项 `}
            <Popconfirm title="你确定要删除该菜单项？" placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" style={{ marginLeft: 8 }}>删除</Button>
            </Popconfirm>
          </Col>
        </Row>
      }
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

Menu.propTypes = {
  menu: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ menu, loading }) => ({ menu, loading }))(Menu)
