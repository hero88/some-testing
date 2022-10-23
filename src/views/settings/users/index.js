// ** React Imports
import React, { Fragment, useEffect, useState } from 'react'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Tables
import UserTable from './UserTable'

// ** User detail Modal
import UserDetail from './UserDetail'

import { useDispatch } from 'react-redux'
import { setSelectedUser } from '@src/views/settings/users/store/actions'
import ChangePassword from '@src/views/settings/users/ChangePassword'
import { getAllCustomers } from '@src/views/settings/customers/store/actions'
import { getAllProjects } from '@src/views/settings/projects/store/actions'
import { STATE as STATUS } from '@constants/common'

const Users = () => {
  const dispatch = useDispatch()
  const [isShowUserDetail, setIsShowUserDetail] = useState(false),
    [isShowChangePassword, setIsShowChangePassword] = useState(false),
    [isEditUser, setIsEditUser] = useState(false)

  const addUser = () => {
    setIsShowUserDetail(true)
    setIsEditUser(false)
  }

  const editUser = (user) => {
    setIsShowUserDetail(true)
    setIsEditUser(true)
    dispatch(setSelectedUser(user))
  }

  const changePassword = (user) => {
    setIsShowChangePassword(true)
    dispatch(setSelectedUser(user))
  }

  useEffect(async () => {
    await Promise.all([
      dispatch(getAllCustomers({
        fk: '*',
        state: [STATUS.ACTIVE].toString(),
        rowsPerPage: -1
      })),
      dispatch(getAllProjects({
        fk: '*',
        state: [STATUS.ACTIVE].toString(),
        rowsPerPage: -1
      }))
    ])
  }, [])

  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <UserTable
            addUser={addUser}
            editUser={editUser}
            changePassword={changePassword}
          />
        </Col>
      </Row>
      <UserDetail
        isShowUserDetail={isShowUserDetail}
        setIsShowUserDetail={setIsShowUserDetail}
        userDetailTitle={isEditUser ? 'Edit user' : 'Add new user'}
        isEditUser={isEditUser}
      />
      <ChangePassword
        isShowChangePassword={isShowChangePassword}
        setIsShowChangePassword={setIsShowChangePassword}
      />
    </Fragment>
  )
}

export default Users
