import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import MailBoxPage from "./MailBoxPage";
import SendMessageForm from "./SendMessageForm";
import ReadMessagePage from "./ReadMessagePage";


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
            <Navigate to="/mailbox/inbox" replace />
          )
        }
      />


      <Route
        path="/mailbox/inbox"
        element={
          isLoggedIn ? (
            <MailBoxPage onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/mailbox/sent"
        element={
          isLoggedIn ? (
            <MailBoxPage onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/mailbox/trash"
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
        element={
          isLoggedIn ? (
            <SendMessageForm onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
        )
        }
      />




      <Route
        path="/mailbox/message/inbox/:id"
        element={
          isLoggedIn ? (
            <ReadMessagePage onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/mailbox/message/sent/:id"
        element={
          isLoggedIn ? (
            <ReadMessagePage onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/mailbox/message/trash/:id"
        element={
          isLoggedIn ? (
            <ReadMessagePage onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />


      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
