// import { createContext, useContext, useState, useEffect } from "react";
// import { isTokenExpired, logout, login, refreshAccesToken, initAuth } from "../auth/spotifyAuth";
// const AuthContext = createContext(null);

// export function useAuth() {
//     return useContext(AuthContext);
// };

// export function AuthProvider({ children }) {


//     function logoutFromSpotify() {
//         logout();
//         setIsLogged(false);
//     };
//     async function loginToSpotify() {
//         await login();
//         return setIsLogged(true);
//     };

//     useEffect(() => {
//         async function checkAuth() {
//             try {
//                 await initAuth();
//                 if (!localStorage.getItem("access_token")) {
//                     setIsLogged(false);
//                     return;
//                 };
//                 if (!isTokenExpired()) {
//                     setIsLogged(true);
//                 } else {
//                     await refreshAccesToken();
//                     setIsLogged(true);
//                 };
//             } catch (error) {
//                 console.log("Authentication error: ", error);
//                 logout();
//                 setIsLogged(false);
//             } finally { setLoading(false) };
//         };
//         // checkAuth();
//     }, []);

//     const value = {
//         loading,
//         isLogged,
//         logoutFromSpotify,
//         loginToSpotify
//     };
//     return (
//         <AuthContext value={value}>
//             {children}
//         </AuthContext>
//     );
// };

