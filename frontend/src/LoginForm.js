import React, { useState, useEffect } from "react";

import "./Styles.css"

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(logged);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const user = { email, password };

    try {
      const response = await fetch("http://localhost:8081/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const text = await response.text();
      if (response.ok && text === "Zalogowano pomyślnie!") {
        setMessage(text);
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
      }
      else {
        setMessage("Błąd logowania: " + text);
      }
}      catch(error) {
      setMessage("Błąd sieci: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setMessage("");
    setEmail("");
    setPassword("");
  };

  return (
     <div className="login-form">
      <form onSubmit={handleLogin}>
        <h2>Logowanie</h2>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoggedIn} // jeśli zalogowany, blokujemy inputy
          />
        </label>

        <br />

        <label>
          Hasło:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoggedIn} // jeśli zalogowany, blokujemy inputy
          />
        </label>

        <br />

        <button type="submit" disabled={isLoggedIn}>
          Zaloguj się
        </button>
      </form>

      <p>{message}</p>

      {isLoggedIn && (
        <div>
          <p>Jesteś zalogowany!</p>
          <button onClick={handleLogout}>Wyloguj</button>
        </div>
      )}
    </div>
  );
}
