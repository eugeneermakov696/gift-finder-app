import { mockProducts } from "../../mockData";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addGift } from "../WishlistPage/wishlistSlice";

export const HomePage = () => {
  const items = useAppSelector(state => state.wishlist.items);
  const dispatch = useAppDispatch();

  return (
  <>
    <h1>Home Page</h1>
    <button onClick={() => dispatch(addGift(mockProducts[0]))}>Add</button>
    <p>{items.length}</p>
  </>
  );
}