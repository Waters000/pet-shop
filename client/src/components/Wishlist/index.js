import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../redux/Store/storeSlice";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.store.wishlist);

  return (
    <div className='flex flex-col p-4'>
      <div className='w-full'>
        {wishlist.map((product) => {
          return (
            <div key={product._id} className='flex flex-col'>
              <div className='flex flex-wrap'>
                <div className='w-4/12'>
                  <img
                    className='h-32 w-32'
                    src={product.image_url}
                    alt={product.name}
                  />
                </div>
                <div className='w-6/12'>
                  <Link to={`/store/product/${product._id}`}>
                    <div className='font-bold text-xl mb-2 hover:text-blue-700 hover:underline'>
                      {product.name}
                    </div>
                  </Link>
                </div>
                <div className='w-2/12'>
                  <p className='text-gray-700 font-semibold'>
                    ${product.price}
                  </p>
                </div>
                <div className='w-full'>
                  <div className='flex flex-col'>
                    <div className='flex flex-row'></div>
                    <div className='flex flex-row'>
                      <div className='w-1/2'>
                        <button
                          onClick={() => dispatch(addToCart(product))}
                          className='ml-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent'
                        >
                          Add To Cart
                        </button>
                      </div>
                      <div className='w-1/2'>
                        <button
                          onClick={() => console.log("remove from wishlist")}
                          className='ml-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent'
                        >
                          Remove From Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
