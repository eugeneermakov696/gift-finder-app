import { Routes, Route } from 'react-router-dom';
import { Layout } from './shared/components/Layout';

import { HomePage } from './modules/HomePage';
import { ProfilePage } from './modules/ProfilePage';
import { ProductDetailsPage } from './modules/ProductDetailsPage';
import { WishlistPage } from './modules/WishlistPage';
import { NotFoundPage } from './modules/NotFoundPage';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="product/:productId" element={<ProductDetailsPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
