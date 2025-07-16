import { AppLayout, RootLayout } from '@/lumifi/layouts';
import { APP_ROUTES, LOGIN_ROUTES, PASSWORD_ROUTES, ProtectedRoute, SIGNUP_ROUTES } from '@/lumifi/routes';
import { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import { Loader } from './lib/ui/components/loader';
import { getUserIp } from './lib/utils/getUserIp';
import { useUserDetail } from './lumifi/hooks/use-me';
import { NoAccessPage, NotFoundPage } from './lumifi/pages';
import type { RootState } from './store/store';

function App() {
  const { isFetching, fetchUserDetail } = useUserDetail();
  const { userId } = useSelector((state: RootState) => state.loginAuth);
  const { isAuthenticated, userDetails } = useSelector((state: RootState) => state.auth);
  const practice_account_id = userDetails?.practice_account_id;

  useEffect(() => {
    getUserIp().then((ip) => {
      if (ip) localStorage.setItem('userIp', ip);
    });
  }, []);

  useEffect(() => {
    if (userId && practice_account_id) {
      const payload = {
        userId,
        practiceAccountId: practice_account_id,
      };
      fetchUserDetail(payload);
    }
  }, [userId, practice_account_id]);

  console.log('MODE: ', import.meta.env.MODE);

  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          {SIGNUP_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                isAuthenticated ? (
                  <Navigate
                    to='/home'
                    replace
                  />
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Route>
        <Route element={<RootLayout />}>
          {PASSWORD_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>

        <Route element={<RootLayout />}>
          {LOGIN_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                isAuthenticated ? (
                  <Navigate
                    to='/home'
                    replace
                  />
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {isFetching
              ? [
                  <Route
                    key='loading'
                    path='*'
                    element={<Loader overlay={true} />}
                  />,
                ]
              : APP_ROUTES.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  >
                    {route.children?.map((child, i) => (
                      <Route
                        key={child.path || `index-${i}`}
                        index={child.index}
                        path={child.path}
                        element={child.element}
                      />
                    ))}
                  </Route>
                ))}
            <Route
              key='/no-access'
              path='/no-access'
              element={<NoAccessPage />}
            />
          </Route>
        </Route>

        <Route
          path='*'
          element={<NotFoundPage />}
        />
      </Routes>

      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
        transition={Slide}
      />
    </>
  );
}

export default App;
