import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectIsAppLoaded} from '../store/selectors/main';
import {loadApp} from '../store/thunk/main';
import {AppDispatch} from '../store/store';

type Props = {
  children: React.ReactNode;
};

export const LoadAppProvider: React.FC<Props> = ({children}) => {
  const isLoaded = useSelector(selectIsAppLoaded);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // @ts-ignore
    dispatch(loadApp());
  }, []);

  if (!isLoaded) {
    return null;
  }

  return <>{children}</>;
};
