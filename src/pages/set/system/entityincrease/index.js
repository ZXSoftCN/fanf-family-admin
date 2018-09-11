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


const EntityIncrease = ({
  location, dispatch, entityIncrease, loading,
}) => {
  const { query, pathname } = location
  const {
    list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys,
  } = entityIncrease

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
    confirmLoading: loading.effects[`entityIncrease/${modalType}`],
    title: `${modalType === 'create' ? '创建编码规则' : '修改编码规则'}`,
    modalType: modalType,
    wrapClassName: 'vertical-center-modal',
    dispatch:dispatch,
    onOk (data) {
      dispatch({
        type: `entityIncrease/${modalType}`,
        payload: data,
      })
        .then(() => {
          handleRefresh()
        })
    },
    onCancel () {
      dispatch({
        type: 'entityIncrease/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['entityIncrease/query'],
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
        type: 'entityIncrease/delete',
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
        type: 'entityIncrease/queryCurrent',
        payload:{
          id: item.id,
        },
      }).then(() => {
        dispatch({
          type: 'entityIncrease/showModal',
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
          type: 'entityIncrease/updateState',
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
        type: 'entityIncrease/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'entityIncrease/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'entityIncrease/multiDelete',
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
            <Popconfirm title="你确定要删除该编码规则？" placement="left" onConfirm={handleDeleteItems}>
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

EntityIncrease.propTypes = {
  entityIncrease: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ entityIncrease, loading }) => ({ entityIncrease, loading }))(EntityIncrease)
