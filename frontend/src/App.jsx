import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation/Navigation';
import SpotSearch from './components/Spots/SpotSearchPage/SpotSearchPage';
import SpotOwner from './components/Spots/SpotOwnerPage/SpotOwnerPage';
import SpotSolo from './components/Spots/SpotSoloPage/SpotSoloPage';
import ReviewsUser from './components/Reviews/ReviewsUserPage/ReviewsUserPage';
import SpotEdit from './components/Spots/SpotEditPage/SpotEditPage';
import BookingClientPage from './components/Bookings/BookingClientPage/BookingClientPage';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotSearch/>
      },
      {
        path: '/spots',
        children: [
          {
            path: '/spots/current',
            element: <SpotOwner/>
          },
          {
            path: '/spots/:spotId',
            children: [
              {
                path: '/spots/:spotId',
                element: <SpotSolo/>
              },
              {
                path: '/spots/:spotId/edit',
                element: <SpotEdit/>
              },
              
            ]
          },
          {
            path: '/spots/new',
            element: <SpotEdit/>
          },
          
        ]
      },
      {
        path: '/reviews',
        children: [
          {
            path: '/reviews/current',
            element: <ReviewsUser/>
          }
        ]
      },
      {
        path: '/bookings',
        children: [
          {
            path: '/bookings/current',
            element: <BookingClientPage/>
          }
        ]
      }
      
      
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;