import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // 로딩 스크린을 사용할 수도 있습니다.
  }

  if (!user) {
    return <Navigate to='/login' />;
  }

  return children;
}

// import { Navigate } from 'react-router-dom';
// import { auth } from '../firebase';

// export default function ProtectedRoute({
//   children,
// }: {
//   children: React.ReactDOM;
// }) {
//   const user = auth.currentUser;
//   if (user === null) {
//     return <Navigate to='/login' />;
//   }
//   return children;
// }
