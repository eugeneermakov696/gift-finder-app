import { Routes, Route } from 'react-router-dom';
import { useAppDispatch } from './store/hooks.ts';
import { useEffect } from 'react';
import { fetchMe } from './store/auth/authSlice.ts';
import { fetchWishlist } from './store/wishlist/wishlistSlice.ts';

import { Layout } from './shared/components/Layout';
import { HomePage } from './modules/HomePage';
import { ProfilePage } from './modules/ProfilePage';
import { ProductDetailsPage } from './modules/ProductDetailsPage';
import { WishlistPage } from './modules/WishlistPage';
import { NotFoundPage } from './modules/NotFoundPage';
import { FiltersPage } from './modules/FiltersPage';
import { ReadyIdeasPage } from './modules/ReadyIdeasPage';
import { CatalogPage } from './modules/CatalogPage.tsx';
import { RightsPage } from './modules/RightsPage/RightsPage.tsx';
import { TermsPage } from './modules/TermsPage/TermsPage.tsx';

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const hasSession = localStorage.getItem('has_session') === 'true';

    if (hasSession) {
      dispatch(fetchMe()).then(() => {
        dispatch(fetchWishlist());
      });
    } else {
      dispatch(fetchWishlist());
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="find-a-gift" element={<FiltersPage />} />
        <Route path="/ready-ideas/:recipient/:occasion" element={<ReadyIdeasPage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="product/:asin" element={<ProductDetailsPage />} />
        <Route path="privacy-policy" element={<RightsPage />} />
        <Route path="terms&conditions" element={<TermsPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
