import React from 'react';
import { Button, Divider, message } from 'antd';
import { DeleteBid, GetBids, GetProductById } from '../../apicalls/products';
import { SetLoader } from '../../redux/loadersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import BidModal from './BidModal';
import image from "./../Profile/profileicon.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function ProductInfo() {
  const [showbid, setShowbid] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  const [bids, setBids] = React.useState(null);
  const [selectedimage, setSelectedimage] = React.useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const { user } = useSelector((state) => state.users);

  let formattedDate = "";
  if (product) {
    const postDate = moment(product.createdAt);
    const currentDate = moment();
    const diffInMinutes = currentDate.diff(postDate, 'minutes');
    const diffInDays = currentDate.diff(postDate, 'days');
    
    if(diffInMinutes < 1){
      formattedDate="just Now"
    } else if(diffInMinutes < 60) {
      formattedDate = `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      formattedDate = `${Math.floor(diffInMinutes / 60)}h`;
    } else if (diffInDays < 7) {
      formattedDate = `${diffInDays}d`;
    } else {
      formattedDate = moment(product.createdAt).format("MMM D, YYYY");
    }
  }

  const getdata = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProductById(id);
      if (response.success) {
        const bidResponse = await GetBids({ product: id, buyer: user._id });
        setProduct({ ...response.data, bids: bidResponse.data });
        setBids(bidResponse.data);
      } else {
        console.log("Failed to fetch products");
      }
      setLoading(false);
      dispatch(SetLoader(false));
    } catch (error) {
      message.error(error.message);
      setLoading(false);
      dispatch(SetLoader(false));
    }
  };

  React.useEffect(() => {
    getdata();
  }, []);

  const deleteBid = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await DeleteBid(id);
      if (response.success) {
        message.success(response.message);
        getdata();
      } else {
        message.error(response.message);
      }
      dispatch(SetLoader(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoader(false));
    }
  };

  return (
    <div className="w-full">
    {showbid && <BidModal showbidModal={showbid} setShowbidModal={setShowbid} product={product} getdata={getdata} />}
      {loading ? (
        <div className='ml-8 w-screen'>
  <div className="relative flex flex-col mr-16 lg:grid lg:grid-cols-2">
    <div className="m-8 mr-4 mx-auto lg:w-full rounded-md flex flex-col gap-2">
      <div className="flex flex-col gap-4 min-w-96">
        <div className="flex gap-4 items-center">
          <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
          <div className="skeleton h-4 w-20"></div>
          <div className="skeleton h-4 w-28"></div>
        </div>
        <div className="skeleton h-60 w-full mr-24"></div>
      </div>
    </div>
    <div className="flex flex-cols-2 mt-32 lg:mt-2 lg:ml-8 gap-4 items-center">
  <div className="flex flex-col">
    <div className="flex flex-col">
      <div className="skeleton w-10 h-10 rounded-full mb-2"></div> 
    <div className="skeleton w-10 h-10 rounded-full mb-2"></div> 
    <div className="skeleton w-10 h-10 rounded-full"></div> 
    </div>
  </div>
  <div className="flex flex-col gap-4">
  <div className="skeleton h-4 w-36 mb-3"></div>
  <div className="skeleton h-4 w-44 mb-3"></div>
  <div className="skeleton h-4 w-40 "></div>
  
  </div>
</div>

  </div>
</div>
      ) : (
        <section className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <div className="flex flex-col gap-4">
              <div className='flex items-center'>
                  <div className="dropdown dropdown-start">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">

                      <div className="w-24 rounded-full">
                        <img src={product.seller.profilepic || image} />

                      </div>
                    </div>
                     <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                      <li>{product.seller.name}</li>
                      <li>{product.seller.email}</li>
                      <li>{product.seller.phone}</li>
                    </ul>
                  </div>
                  <div className="ml-2">
                    <span className="text-lg font-bold">{product.seller.name}</span>
                    <p className='text-sm text-gray-500'>{formattedDate}</p>
                  </div>
                </div>
                <div className="relative h-64 md:h-auto">
                  <img
                    className="block h-full w-full object-cover rounded-md shadow-lg"
                    src={product.images[selectedimage]}
                    alt="Product"
                  />
                  <div className="absolute bottom-0 right-0 m-4 flex gap-2">
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt="Thumbnail"
                        className={"w-20 h-20 object-cover rounded-md cursor-pointer" + (index === selectedimage ? " border-2 border-blue-500 border-solid p-1" : "")} onClick={() => setSelectedimage(index)}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl md:text-2xl font-bold">{product.name}</h2>
                  <p className="text-sm md:text-base">{product.description}</p>
                  <p className="text-sm md:text-base">
                    Purchased {moment().subtract(product.age, 'years').format("YYYY")} ({product.age === 0 ? "This Year" : `${product.age} year${product.age > 1 ? "s" : ""} ago`})
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">${product.price}</span>
                    <div className="flex flex-col">
                      <div className="grid grid-cols-2 gap-2">
                        <div className={"badge " + (product.deliveryAvailable ? "badge-success" : "badge-error")}>Delivery {product.deliveryAvailable ? "Available" : "Not Available"}</div>
                        <div className={"badge " + (product.boxAvailable ? "badge-success" : "badge-error")}>Box {product.boxAvailable ? "Available" : "Not Available"}</div>
                        <div className={"badge " + (product.warrantyAvailable ? "badge-success" : "badge-error")}>Warranty {product.warrantyAvailable ? "Available" : "Not Available"}</div>
                        <div className={"badge " + (product.accessoryAvailable ? "badge-success" : "badge-error")}>Accessory {product.accessoryAvailable ? "Available" : "Not Available"}</div>
                      </div>
                    </div>
                  </div>
                  <Button className='focus:outline-none mt-2' onClick={() => setShowbid(!showbid)} disabled={user._id === product.seller._id}>New Bid</Button>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-bold">Bids</h3>
              <Divider />
              {product.bids && product.bids.map((bid) => {
                const postDate = moment(bid.createdAt);
                const currentDate = moment();
                const diffInMinutes = currentDate.diff(postDate, 'minutes');
                const diffInDays = currentDate.diff(postDate, 'days');
              
                let formattedBidDate = "";
                if (diffInMinutes < 1) {
                  formattedBidDate = "just Now";
                } else if (diffInMinutes < 60) {
                  formattedBidDate = `${diffInMinutes}m`;
                } else if (diffInMinutes < 1440) {
                  formattedBidDate = `${Math.floor(diffInMinutes / 60)}h`;
                } else if (diffInDays < 7) {
                  formattedBidDate = `${diffInDays}d`;
                } else {
                  formattedBidDate = moment(bid.createdAt).format("MMM D, YYYY");
                }
                return (
                  <div className='flex items-center mt-3'>
                <div className="dropdown dropdown-start">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">

                    <div className="w-24 rounded-full">
                      <img src={bid.buyer.profilepic || image} />

                    </div>
                  </div>
                  {(product.seller._id === user._id || bid.buyer._id === user._id || user.role === "admin" ) && <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                    <li>{bid.buyer.name}</li>
                    <li>{bid.buyer.email}</li>
                    <li>{bid.phone}</li>
                  </ul>}
                </div>
                <div className="ml-2">
                  <span className="text-lg font-bold">{bid.buyer.name}</span>
                  <span className="text-lg text-gray-500 font-bold ml-8">${bid.bidAmount}</span>
                  {(bid.buyer._id === user._id || user.role === "admin") && (
                    <FontAwesomeIcon icon={faTrash} onClick={(e) => {
                      e.stopPropagation();
                      deleteBid(bid._id);
                    }} className="cursor-pointer ml-5" />
                  )}
                  <p className='text-sm text-gray-500'>{formattedBidDate}</p>
                </div>
              </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
      
    </div>
  );
}

export default ProductInfo;
