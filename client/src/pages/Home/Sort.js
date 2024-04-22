import React, { useState } from 'react';
import { Menu, Dropdown, Button, Radio } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const SortComponent = ({ setFilters }) => {
  const [currentSortBy, setCurrentSortBy] = useState(null);
  const [currentSortOrder, setCurrentSortOrder] = useState('asc');

  const handleSortChange = (sortBy) => {
  
      setCurrentSortBy(sortBy);
      setCurrentSortOrder('asc');
      setFilters((prevFilters) => ({
        ...prevFilters,
        sortBy,
        sortOrder: 'asc',
      }));
    
  };
  const handleOrderChange = (sortOrder) => {
  
      setCurrentSortOrder(sortOrder);
      setFilters((prevFilters) => ({
        ...prevFilters,
        sortOrder,
      }));
    
  }

  const menu = (
    <Menu>
      <Menu.ItemGroup title="Sort by">
        <Menu.Item key="name">
        <Radio.Group
        value={currentSortBy === 'name' ? currentSortOrder : null}
        onChange={() => handleSortChange('name')}
      >
        <Radio.Button value="name" className={currentSortBy === 'name' ? 'border-cyan-600 text-cyan-600' : 'border-gray-200'}
        >Name</Radio.Button>
      </Radio.Group>
      
        </Menu.Item>
        <Menu.Item key="price">
        <Radio.Group
        value={currentSortBy === 'price' ? currentSortOrder : null}
        onChange={() => handleSortChange('price')}
        
      >
        <Radio.Button value="price" className={currentSortBy === 'price' ? 'border-cyan-600 text-cyan-600' : 'border-gray-200'}
        >Price</Radio.Button>
      </Radio.Group>
      
        </Menu.Item>
        <Menu.Item key="date">
        <Radio.Group
        value={currentSortBy === 'date' ? currentSortOrder : null}
        onChange={() => handleSortChange('date')}
      >
        <Radio.Button value="date" className={currentSortBy === 'date' ? 'border-cyan-600 text-cyan-600' : 'border-gray-200'}
        >Date</Radio.Button>
      </Radio.Group>
      
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.ItemGroup title="Sort order">
        <Menu.Item key="sortOrder">
        <Radio.Group
        value={currentSortOrder}
      >
        <Radio.Button value="asc" onChange={() => handleOrderChange('asc')}>Ascending</Radio.Button>
        <Radio.Button value="desc" onChange={() => handleOrderChange('desc')}>Descending</Radio.Button>
      </Radio.Group>
      
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button className='focus:outline-blue-500'>
        Sort <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default SortComponent;