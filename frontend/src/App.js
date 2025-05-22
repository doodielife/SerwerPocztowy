import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import MailBoxPage from "./MailBoxPage";
import SendMessageForm from "./SendMessageForm";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(logged);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          !isLoggedIn ? (
            <>
              <LoginForm setIsLoggedIn={setIsLoggedIn} />
              <RegisterForm />
            </>
          ) : (
            <Navigate to="/mailbox" replace />
          )
        }
      />
      <Route
        path="/mailbox"
        element={
          isLoggedIn ? (
            <MailBoxPage onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/sendmessage"
        element={<SendMessageForm onLogout={handleLogout} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
