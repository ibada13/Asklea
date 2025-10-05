import { useDispatch, useSelector } from 'react-redux';
import { login, register, logout, checkUser, getUser } from '@/app/state/auth/authSlice';
import { RootState, AppDispatch } from '@/app/state/store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAdmin, isDoctor, isPatient, user, loading } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    isAdmin,
    isDoctor,
    isPatient,
    isAuth: isAdmin || isDoctor || isPatient,
    user,
    loading,
    login: (email: string, password: string) => dispatch(login({ email, password })),
    register: (username: string, email: string, password: string) =>
      dispatch(register({ username, email, password })),
    logout: () => dispatch(logout()),
    checkUser: () => dispatch(checkUser()),
    getUser: () => dispatch(getUser()),
  };
};
