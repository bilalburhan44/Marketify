import React from 'react'
import { Tabs } from "antd"
import ProductsUi from './Products/ProductsUi'
import ProfilePic from './ProfilePic'

function ProfileUi() {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Profile" key="1">
          <ProfilePic/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Products" key="2">
          <ProductsUi/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default ProfileUi
