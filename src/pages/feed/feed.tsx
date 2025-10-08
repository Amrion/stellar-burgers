import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeedThunk,
  selectFeed,
  selectIsLoading
} from '../../services/slices/feed';
import { getIngredientsThunk } from '../../services/slices/ingredients';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeed);
  const isLoading: boolean = useSelector(selectIsLoading);

  const handleGetFeeds = () => {
    dispatch(getFeedThunk());
  };

  useEffect(() => {
    dispatch(getFeedThunk());
    dispatch(getIngredientsThunk());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
