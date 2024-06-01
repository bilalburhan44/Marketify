import React, { useState } from 'react';
import { Menu, Dropdown, Checkbox } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const FilterDropdown = ({ setFilters }) => {
 const { t } = useTranslation();

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
        <Menu.ItemGroup title={t('age')}>
          <Menu.Item key="age:1">
            <Checkbox onChange={(e) => handleCheckboxChange('age', '0-2', e.target.checked)}>{t('0-2')}</Checkbox>
          </Menu.Item>
          <Menu.Item key="age:2">
            <Checkbox onChange={(e) => handleCheckboxChange('age', '3-5', e.target.checked)}>{t('3-5')}</Checkbox>
          </Menu.Item>
          <Menu.Item key="age:3">
            <Checkbox onChange={(e) => handleCheckboxChange('age', '6-8', e.target.checked)}>{t('6-8')}</Checkbox>
          </Menu.Item>
          <Menu.Item key="age:4">
            <Checkbox onChange={(e) => handleCheckboxChange('age', '50', e.target.checked)}>{t('9+')}</Checkbox>
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title={t('category')}>
          <Menu.Item key="category:1">
            <Checkbox onChange={(e) => handleCheckboxChange('category', 'electronics', e.target.checked)}>{t('electronic')}</Checkbox>
          </Menu.Item>
          <Menu.Item key="category:2">
            <Checkbox onChange={(e) => handleCheckboxChange('category', 'fashion', e.target.checked)}>{t('fashion')}</Checkbox>
          </Menu.Item>
          <Menu.Item key="category:3">
            <Checkbox onChange={(e) => handleCheckboxChange('category', 'home', e.target.checked)}>{t('homec')}</Checkbox>
          </Menu.Item>
          <Menu.Item key="category:4">
            <Checkbox onChange={(e) => handleCheckboxChange('category', 'sports', e.target.checked)}>{t('sport')}</Checkbox>
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