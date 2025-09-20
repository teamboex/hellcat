import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import StorePage from './pages/StorePage';
import AdminDashboard from './components/AdminDashboard';

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <StorePage />,
  },
  {
    path: '/store',
    element: <StorePage />,
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  // Add more routes here as needed
  // {
  //   path: '/product/:id',
  //   element: <ProductDetailsPage />,
  // },
  // {
  //   path: '/checkout',
  //   element: <CheckoutPage />,
  // },
]);

// Router component
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
