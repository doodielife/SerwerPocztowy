import React, { useState } from "react";

import "./Styles.css"

export default function RegisterForm() {
  // Stan przechowujący dane formularza
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imie, setImie] = useState("");
  const [nazwisko, setNazwisko] = useState("");
  const [message, setMessage] = useState("");

  // Obsługa wysłania formularza
  const handleSubmit = async (e) => {
    e.preventDefault(); // zapobiega przeładowaniu strony

    // Tworzymy obiekt z danymi użytkownika
    const user = { email, password, imie, nazwisko };

    try {
      // Wysyłamy POST na backend
      const response = await fetch("http://localhost:8081/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setMessage("Rejestracja zakończona sukcesem!");
        // Możesz wyczyścić formularz, jeśli chcesz:
        setEmail("");
        setPassword("");
        setImie("");
        setNazwisko("");
      } else {
        setMessage("Coś poszło nie tak podczas rejestracji.");
      }
    } catch (error) {
      setMessage("Błąd sieci: " + error.message);
    }
  };

  return (
  <div className="login-form">
    <form onSubmit={handleSubmit}>
      <h2>Rejestracja użytkownika</h2>

      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
          minLength={6}
        />
      </label>

      <br />

      <label>
        Imię:
        <input
          type="imie"
          value={imie}
          onChange={(e) => setImie(e.target.value)}
          required
        />
      </label>

      <br />

      <label>
        Nazwisko:
        <input
          type="nazwisko"
          value={nazwisko}
          onChange={(e) => setNazwisko(e.target.value)}
          required
        />
      </label>

      <br />

      <button type="submit">Zarejestruj się</button>

      <p>{message}</p>
    </form>
    </div>
  );
}
