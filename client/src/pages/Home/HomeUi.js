import { message } from 'antd'
import React from 'react'
import { GetProducts } from '../../apicalls/products'
import { SetLoader } from '../../redux/loadersSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FilterDropdown from './Filters'
import NoImage from './noImageFound.jpg'
import Sort from './Sort'
import loadingImage from './ImageLoading.webp'
import { useTranslation } from 'react-i18next';


function Home() {
  const [products, setProducts] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [loadingImages, setLoadingImages] = React.useState(true); // State to track loading status of images
  const [searchQuery, setSearchQuery] = React.useState('');
  const { t, i18n } = useTranslation();

  const [filters, setFilters] = React.useState({
    status: "Approved",
    category: [],
    age: [],
    sortBy: "name",
    sortOrder: "asc"
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
    setLoadingImages(true); // Set loading status to true when fetching data
    getdata().then(() => setLoadingImages(false)); // Set loading status to false after data is fetched
  }, [filters, searchQuery])

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
    <div className="bg-white" >
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
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

          </div>
        </div>
        <div className='mt-4 mr-2'>
          <Sort setFilters={setFilters} />
        </div>
      </div>


      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8" key={1}>
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
                  <figure>

                    <img src={loading ? loadingImage : product.images.length > 0 ? product.images[0] : loadingImage} />

                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">
                      {product.name}
                      {product.createdAt < Date.now() - 86400000 && <div className="badge badge-primary">{t('NEW')}</div>}
                    </h2>
                    <h2 className="card-title">
                      ${product.price}
                    </h2>
                    <p>{product.description}</p>
                    <div className="card-actions justify-end">
                      {(() => {
                        let categoryClass = "";
                        if (product.category === "fashion") {
                          categoryClass = "badge-secondary badge-outline"; // Red background for 'Rejected'
                        } else if (product.category === "sports") {
                          categoryClass = "badge-accent badge-outline"; // Green background for 'Approved'
                        } else if (product.category === "electronics") {
                          categoryClass = "badge-primary badge-outline"; // Default blue background for other statuses
                        } else {
                          categoryClass = "badge-warning badge-outline"; // Default blue background for other statuses
                        }

                        return (
                          <div className={`badge ${categoryClass}`}>
                            {product.category}
                          </div>
                        );
                      })()}
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