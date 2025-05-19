import React, { useState } from "react";

export default function SendMessageForm() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();

    // ⛔️ Bez zalogowanego użytkownika nie wysyłamy wiadomości
    const senderEmail = localStorage.getItem("email");
    if (!senderEmail) {
      setStatus("Błąd: Nie jesteś zalogowany.");
      return;
    }

    const message = {
      senderEmail,
      recipientEmail,
      subject,
      content
    };

    try {
      const response = await fetch("http://localhost:8081/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
      });

      if (response.ok) {
        setStatus("Wiadomość została wysłana!");
        setRecipientEmail("");
        setSubject("");
        setContent("");
      } else {
        const errorText = await response.text();
        setStatus("Błąd podczas wysyłania: " + errorText);
      }
    } catch (error) {
      setStatus("Błąd sieci: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSend}>
      <h3>Wyślij wiadomość</h3>

      <label>
        Do (email odbiorcy):
        <input
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          required
        />
      </label>
      <br />

      <label>
        Temat:
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </label>
      <br />

      <label>
        Treść:
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </label>
      <br />

      <button type="submit">Wyślij</button>

      <p>{status}</p>
    </form>
  );
}
