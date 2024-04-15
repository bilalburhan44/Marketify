import React from 'react'
import {Tabs} from 'antd'
import AdminProduct from './AdminProduct'
import AdminUser from './AdminUser'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getCurrentUser } from '../../apicalls/users'

function Admin() {
  const navigate = useNavigate()
  const {user} = useSelector(state => state.users)
  const getUser = async() => {
    try {
      if(user.role !== 'admin'){
        navigate('/')
      }
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    getUser()
  },[])

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Products" key="1">
          <AdminProduct />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Users" key="2">
          <AdminUser />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default Admin
