import React, { useState } from 'react';
import { Menu, Dropdown, Checkbox } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const FilterDropdown = ({ setFilters }) => {
 

  const handleCheckboxChange = (type, value, checked) => {
    // Call setFilters from the parent component (Home)
    setFilters((prevFilters) => {
      const updatedValues = checked
        ? [...prevFilters[type], value]
        : prevFilters[type].filter((item) => item !== value);

      return { ...prevFilters, [type]: updatedValues };
    });
  };

  const columnStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  };

  const menu = (
    <Menu>
      <div style={columnStyle}>
        <Menu.ItemGroup title="Age">
          <Menu.Item key="age:1">
            <Checkbox onChange={(e) => handleCheckboxChange('age', '0-2', e.target.checked)}>0-2</Checkbox>
          </Menu.Item>
          <Menu.Item key="age:2">
            <Checkbox onChange={(e) => handleCheckboxChange('age', '3-6', e.target.checked)}>3-6</Checkbox>
          </Menu.Item>
          <Menu.Item key="age:3">
            <Checkbox onChange={(e) => handleCheckboxChange('age', '50', e.target.checked)}>7+</Checkbox>
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title="Category">
          <Menu.Item key="category:1">
            <Checkbox onChange={(e) => handleCheckboxChange('category', 'Electronics', e.target.checked)}>Electronics</Checkbox>
          </Menu.Item>
          <Menu.Item key="category:2">
            <Checkbox onChange={(e) => handleCheckboxChange('category', 'Fashion', e.target.checked)}>Fashion</Checkbox>
          </Menu.Item>
          <Menu.Item key="category:3">
            <Checkbox onChange={(e) => handleCheckboxChange('category', 'Home', e.target.checked)}>Home</Checkbox>
          </Menu.Item>
        </Menu.ItemGroup>
      </div>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        <FilterOutlined style={{ fontSize: '29px', color: '#1890ff' }}  className="cursor-pointer"/>
      </a>
    </Dropdown>
  );
};

export default FilterDropdown;