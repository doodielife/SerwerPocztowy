import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SendForm.css";

export default function SendMessageForm({ onLogout }) {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Stan z plikami i ich URLami do pobrania
  const [attachments, setAttachments] = useState([]); // [{ file, url }]

  // Funkcja do tworzenia ikonki na podstawie rozszerzenia pliku
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return "📄"; // ikona PDF
      case "docx":
      case "doc":
        return "📝"; // ikona DOCX
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️"; // ikona obrazka
      default:
        return "📁"; // ikona domyślna
    }
  };

  // Obsługa zmiany plików - dodajemy do stanu obiekt z URL
  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setAttachments(prev => [...prev, ...newFiles]);
  };

  // Czyszczenie URL przy odmontowaniu komponentu lub zmianie attachments
  useEffect(() => {
    return () => {
      attachments.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [attachments]);

//  const handleSubmit = async (e) => {
//    e.preventDefault();
//    const senderEmail = localStorage.getItem("email");
//
//    try {
//      const response = await fetch("http://localhost:8081/api/messages/send", {
//        method: "POST",
//        headers: {
//          "Content-Type": "application/json",
//        },
//        body: JSON.stringify({
//          senderEmail,
//          recipientEmail: recipient,
//          subject,
//          content: body,
//          // Tutaj możesz dodać logikę wysyłania plików jeśli backend to obsługuje
//        }),
//      });
//
//      if (!response.ok) {
//        throw new Error("Nie udało się wysłać wiadomości");
//      }
//
//      await response.json();
//      setMessage("✅ Wiadomość została wysłana!");
//      setRecipient("");
//      setSubject("");
//      setBody("");
//      // Czyszczenie załączników po wysłaniu
//      attachments.forEach(({ url }) => URL.revokeObjectURL(url));
//      setAttachments([]);
//    } catch (error) {
//      console.error("Błąd wysyłania:", error);
//      setMessage("❌ Wystąpił błąd podczas wysyłania.");
//    }
//  };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("senderEmail", localStorage.getItem("email"));
      formData.append("recipientEmail", recipient); // zamiast "recipient"
      formData.append("subject", subject);
      formData.append("content", body);             // zamiast "body"
      attachments.forEach(({file}) => {
        formData.append("attachments", file);       // OK, jeśli obsługujesz pliki po stronie backendu
      });

      try {
        console.log("Załączniki:");
        attachments.forEach(({file}) => {
          console.log(`Nazwa: ${file.name}, Typ: ${file.type}, Rozmiar: ${file.size}`);
        });
        const response = await fetch("http://localhost:8081/api/messages/send", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          setMessage("✅ Wiadomość została wysłana!");
          setAttachments([]);
        } else {
          setMessage(`Błąd: ${result.error || " ❌ Nie udało się wysłać wiadomości."}`);
        }
      } catch (err) {
        setMessage(`Błąd: ${err.message}`);
      }
    };

  return (
    <div className="send-message-page">
      <nav className="sidebar">
        <h3>Menu</h3>
        <button onClick={() => navigate("/mailbox/inbox")}>📥 Odebrane</button>
        <button onClick={() => navigate("/mailbox/sent")}>📤 Wysłane</button>
        <button onClick={() => navigate("/mailbox/trash")}>🗑️ Kosz</button>
        <hr style={{ margin: "20px 0", borderColor: "#444" }} />
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

          <label className="custom-file-upload">
            📎 Wybierz pliki
            <input
              type="file"
              multiple
              onChange={handleFilesChange}
              style={{ display: "none" }}
            />
          </label>

          <ul>
            {attachments.map(({ file, url }, index) => (
              <li key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <a href={url} download={file.name} style={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}>
                  {getFileIcon(file.name)} {file.name}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    // Zwolnij URL, potem usuń plik z listy
                    URL.revokeObjectURL(url);
                    setAttachments((prev) => prev.filter((_, i) => i !== index));
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                    fontSize: "1.2em",
                    lineHeight: "1",
                  }}
                  aria-label={`Usuń plik ${file.name}`}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <button type="submit">Wyślij</button>

          {message && <p className="success-message">{message}</p>}
        </form>
      </main>
    </div>
  );
}
