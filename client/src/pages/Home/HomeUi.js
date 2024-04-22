import { message } from 'antd'
import React from 'react'
import { GetProducts } from '../../apicalls/products'
import { SetLoader } from '../../redux/loadersSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FilterDropdown from './Filters'
import NoImage from './noImageFound.jpg'
import Sort from './Sort'



function Home() {
  const [products, setProducts] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState({
    status: "Approved",
    category: [],
    age: [],
    sortBy : "name",
    sortOrder : "asc"
  })
  const dispatch = useDispatch();
  const navigate = useNavigate()
  React.useEffect(() => {
    setLoading(true); // Set loading to true when data fetching starts
    setTimeout(() => {
      setLoading(false); // Set loading to false after data is fetched
    }, 2000);
  }, []);
  React.useEffect(() => {
    getdata()
  }, [filters , searchQuery ])
  
  const getdata = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts({
        ...filters,
        searchQuery,
      });
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const handleSearch = () => {
    getdata();
  };



  return (
    <div className="bg-white">
      <div className='flex justify-center items-center'>
        <div className='mt-4 ml-2'>
        <FilterDropdown setFilters={setFilters} />
        </div>
        <div className="max-w-[600px] w-full px-4 items-center mt-4">
        
          <div className="relative ">
            <input
              type="text"
              name="q"
              className="w-full border focus:outline-none h-12 shadow p-4 rounded-full"
              placeholder="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" onClick={handleSearch}>
              <svg
                className="text-[#3765f3] h-5 w-5 absolute top-3.5 right-3 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 56.966 56.966"
                style={{ enableBackground: "new 0 0 56.966 56.966" }}
                xmlSpace="preserve"
              >
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"></path>
              </svg>
            </button>
            </div>
            </div>
            <div className='mt-4 mr-2'>
            <Sort setFilters={setFilters} />
            </div>
      </div>


      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      {products && products.length > 0 ? (

          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8`}>
          {products?.map((product) => (
              loading ? ( // Check if products are loading
                <div className='m-4'>
                  <div className="flex flex-col gap-4 w-68">
                    <div className="skeleton h-44 w-full"></div>
                    <div className="skeleton h-4 w-28"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                  </div>
                </div>
              ) : <div key={product.id} onClick={() => navigate(`/product/${product._id}`)}>
                <div className="card w-70 h-96 bg-base-100 shadow-xl cursor-pointer mr-2 mb-4">
                  <figure><img src={product.images[0]} alt={product.name} /></figure>
                  <div className="card-body">
                    <h2 className="card-title">
                      {product.name}
                      {product.createdAt < Date.now() - 86400000 && <div className="badge badge-primary">NEW</div>}
                    </h2>
                    <h2 className="card-title">
                      ${product.price}
                    </h2>
                    <p>{product.description}</p>
                    <div className="card-actions justify-end">
                      <div className="badge badge-secondary badge-outline">{product.category}</div>
                    </div>
                  </div>
                </div>
              </div>

            )
            )}
          </div>
        ) :
          (
            <div className='flex justify-center items-center mb-2'>
              <img src={NoImage} alt="" className='w-96 h-96' />
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Home