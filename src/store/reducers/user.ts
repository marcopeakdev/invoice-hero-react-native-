import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../models/user';
import { getUser, signIn, signUp } from '../thunk/user';

type Type = {
  isAuthorized: boolean;
  isFirstLogin: boolean;
  token: string;
  user: User | undefined;
  signIn: {
    loading: boolean;
  };
  signUp: {
    loading: boolean;
    success: boolean;
  };
};

const initialState: Type = {
  isFirstLogin: false,
  isAuthorized: false,
  token: '',
  user: undefined,
  signIn: {
    loading: false,
  },
  signUp: {
    loading: false,
    success: false,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state, action) => {
      state.user = action.payload;
    },
    clearStoreUser: state => {
      return {
        ...initialState,
      };
    },
    resetSignUp: state => {
      state.signUp = initialState.signUp;
    },
    socialLogin: (state, action) => {
      state.token = action.payload.token;
      state.isAuthorized = action.payload.success;
      state.isFirstLogin = action.payload.isFirstLogin;
      state.signIn = {
        ...state.signIn,
        loading: false,
      };
    },
    resetFirstLogin: state => {
      state.isFirstLogin = false
    }
  },
  extraReducers: builder => {
    builder
      .addCase(signIn.rejected, (state, action) => {
        state.signIn = {
          ...state.signIn,
          loading: false,
        };
      })
      .addCase(signIn.pending, (state, action) => {
        state.signIn = {
          ...state.signIn,
          loading: true,
        };
      })
      .addCase(signIn.fulfilled, (state, action) => {
        console.log("DATA", action.payload)
        state.token = action.payload.token;
        state.isAuthorized = action.payload.success;
        state.isFirstLogin = action.payload.isFirstLogin;
        state.signIn = {
          ...state.signIn,
          loading: false,
        };
      })
      .addCase(signUp.rejected, (state, action) => {
        state.signUp = {
          ...state.signUp,
          loading: false,
          success: false,
        };
      })
      .addCase(signUp.pending, (state, action) => {
        state.signUp = {
          ...state.signUp,
          loading: true,
          success: false,
        };
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.signUp = {
          ...state.signUp,
          loading: false,
          success: true,
        };
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearStoreUser, resetSignUp, socialLogin, resetFirstLogin } = userSlice.actions;

export const userReducer = userSlice.reducer;
