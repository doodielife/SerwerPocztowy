import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SendForm.css";

export default function SendMessageForm({ onLogout }) {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // logika wysyłania wiadomości
    setMessage("Wiadomość wysłana!");
  };

  return (
    <div className="send-message-page">
      <nav className="sidebar">
        <h3>Menu</h3>
        <button onClick={() => navigate("/mailbox")}>📥 Odebrane</button>
        <button onClick={() => navigate("/mailbox/sent")}>📤 Wysłane</button>
        <button onClick={() => navigate("/mailbox/trash")}>🗑️ Kosz</button>
        <hr style={{margin: "20px 0", borderColor: "#444"}} />
        <button className="logout-button" onClick={onLogout}>Wyloguj</button>
      </nav>

      <main className="send-message-content">
        <header>
          <h2>Nowa wiadomość</h2>
        </header>

        <form onSubmit={handleSubmit} className="send-message-form">
          <label>
            Do:
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
              placeholder="Adres email odbiorcy"
            />
          </label>

          <label>
            Temat:
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Temat wiadomości"
            />
          </label>

          <label>
            Treść:
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              placeholder="Napisz wiadomość..."
              rows={6}
            />
          </label>

          <button type="submit">Wyślij</button>

          {message && <p className="success-message">{message}</p>}
        </form>
      </main>
    </div>
  );
}
