"use client";
import React from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";

import firebase_app from "@/firebase/config";

const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let unsubscribeAuth;

    unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => {
              console.log("testlogin");
              return res.json();
            })
            .then((data) => {
              if (data.error) {
                console.log("Error al crear session cookie para el user");
                auth.signOut();
              } else {
                // User is signed in
                setUser(user);
              }
            });
        });
      } else {
        fetch("/api/logout", { method: "POST" }).then((res) => {
          setUser(false);
        }).catch((err) => {
          console.log(err);
          setUser(false);
        });
        setUser(false);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
