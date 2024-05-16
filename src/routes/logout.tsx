import { auth } from '../firebase';

export default function Logout() {
  const logOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log('Logged out');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return <button onClick={logOut}>Log out</button>;
}

// import { auth } from '../firebase';

// export default function Logout() {
//   const logOut = () => {
//     auth.signOut();
//   };
//   return (
//     <h1>
//       <button onClick={logOut}>Log out</button>
//     </h1>
//   );
// }
