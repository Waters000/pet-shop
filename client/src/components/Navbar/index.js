import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import { useSelector, useDispatch } from "react-redux";
import { updateCurrentPage } from "../../redux/Store/storeSlice";

import Auth from "../../utils/auth";

const Navbar = () => {
  const dispatch = useDispatch();
  const { currentPage, cart } = useSelector((state) => state.store);
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = window.location.pathname;
  const currentPathName = currentPath.split("/")[1];

  useEffect(() => {
    if (currentPathName === "") {
      dispatch(updateCurrentPage("Home"));
      document.title = "ProPet | Home";
      return;
    }
    const currentPage =
      currentPathName.charAt(0).toUpperCase() + currentPathName.slice(1);
    dispatch(updateCurrentPage(currentPage));

    document.title = `ProPet | ${currentPage}`;
  }, [currentPathName, dispatch]);

  const isAdmin = false;
  const loggedIn = Auth.loggedIn();

  const pages = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Store",
      path: "/store",
    },
    {
      name: "Profile",
      path: "/profile",
    },
    {
      name: "Admin",
      path: "/admin",
    },
    {
      name: "Login",
      path: "/login",
    },
  ];

  return (
    <nav className='bg-blue-700 border-gray-200 px-2 sm:px-4 py-2.5'>
      <div className='container flex flex-wrap justify-between items-center mx-auto'>
        <Link
          onClick={() => dispatch(updateCurrentPage("Home"))}
          to='/'
          className='flex items-center'
        >
          <img
            src='/assets/logo/logo.svg'
            className='text-2xl h-12'
            alt='Logo'
          />
          <div className='relative flex flex-col p-4'>
            <h1 className='relative logo text-3xl text-white'>ProPet</h1>
            <p className='absolute text-sm top-11 left-12 text-white'>
              onlineStore
            </p>
          </div>
        </Link>
        <button
          data-collapse-toggle='mobile-menu'
          type='button'
          className='inline-flex items-center p-2 ml-3 text-sm text-gray-100 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-blue-200'
          aria-controls='mobile-menu'
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className='sr-only'>Open main menu</span>
          <svg
            className='w-6 h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
              clipRule='evenodd'
            ></path>
          </svg>
          <svg
            className='hidden w-6 h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            ></path>
          </svg>
        </button>
        <div
          className={`${!isOpen && "hidden"} w-full md:block md:w-auto`}
          id='mobile-menu'
        >
          <ul className='flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium'>
            {pages.map((page, index) => {
              if (page.name === "Admin" && !isAdmin) {
                return null;
              }
              if (page.name === "Login" && loggedIn) {
                return (
                  <Link key={index} to='/' onClick={() => Auth.logout()} className='text-white'>
                    <li className='text-white hover:bg-blue-600 py-2 px-4'>
                      Logout
                    </li>
                  </Link>
                );
              }
              if (page.name === "Profile" && !loggedIn) {
                return null;
              }

              return (
                <Link key={page.name} to={page.path}>
                  <li
                    className={`${
                      currentPage === "" && page.path === "/"
                        ? "text-white bg-blue-600"
                        : currentPage === page.name
                        ? "text-white bg-blue-600"
                        : "text-white"
                    } hover:text-white hover:bg-blue-600 py-2 px-4`}
                    onClick={() => {
                      setIsOpen(false);
                      dispatch(updateCurrentPage(page.name));
                    }}
                  >
                    {page.name}
                  </li>
                </Link>
              );
            })}
            <Link to='/cart' className='flex items-center'>
              <i className='relative text-white fa-solid fa-cart-shopping text-xl'>
                {cart.length > 0 && (
                  <span className='absolute badge inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full'>
                    {cart.length}
                  </span>
                )}
              </i>
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
