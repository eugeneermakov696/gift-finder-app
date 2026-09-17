import { Routes, Route } from 'react-router-dom';
import { Layout } from './shared/components/Layout';

import { HomePage } from './modules/HomePage';
import { ProfilePage } from './modules/ProfilePage';
import { ProductDetailsPage } from './modules/ProductDetailsPage';
import { WishlistPage } from './modules/WishlistPage';
import { NotFoundPage } from './modules/NotFoundPage';
import { FiltersPage } from './modules/FiltersPage';
import { CatalogPage } from './modules/CatalogPage.tsx';
import { RightsPage } from './modules/RightsPage/RightsPage.tsx';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="wishlist" element={<FiltersPage />} />
        <Route path="wishlist" element={<CatalogPage />} />
        <Route path="product/:productId" element={<ProductDetailsPage />} />
        <Route path="wishlist" element={<RightsPage />} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
