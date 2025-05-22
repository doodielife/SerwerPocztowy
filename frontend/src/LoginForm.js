import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles.css";

export default function LoginForm({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const user = { email, password };

    try {
      const response = await fetch("http://localhost:8081/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const text = await response.text();

      if (response.ok && text === "Zalogowano pomyślnie!") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("email", email);
        setIsLoggedIn(true);
        setMessage(text);
        navigate("/mailbox");
      } else {
        setMessage("Błąd logowania: " + text);
      }
    } catch (error) {
      setMessage("Błąd sieci: " + error.message);
    }
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
          />
        </label>

        <label>
          Hasło:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit">Zaloguj się</button>
      </form>

      <p>{message}</p>
    </div>
  );
}
