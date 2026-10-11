import { Routes, Route } from 'react-router-dom';
import { useAppDispatch } from './store/hooks.ts';
import { useEffect } from 'react';
import { fetchMe } from './store/auth/authSlice.ts';

import { Layout } from './shared/components/Layout';
import { HomePage } from './modules/HomePage';
import { ProfilePage } from './modules/ProfilePage';
import { ProductDetailsPage } from './modules/ProductDetailsPage';
import { WishlistPage } from './modules/WishlistPage';
import { NotFoundPage } from './modules/NotFoundPage';
import { FiltersPage } from './modules/FiltersPage';
import { CatalogPage } from './modules/CatalogPage.tsx';
import { RightsPage } from './modules/RightsPage/RightsPage.tsx';
import { TermsPage } from './modules/ConditionsPage/TermsPage.tsx';

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="find-a-gift" element={<FiltersPage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="product/:productId" element={<ProductDetailsPage />} />
        <Route path="privacy-policy" element={<RightsPage />} />
        <Route path="terms&conditions" element={<TermsPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
