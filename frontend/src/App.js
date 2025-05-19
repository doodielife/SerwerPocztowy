import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import MailBoxPage from "./MailBoxPage"; // Dodaj import

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sprawdź localStorage przy ładowaniu
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (loginStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

//  return (
//    <div>
//      {isLoggedIn && (
//        <>
//          <h2>Witaj, jesteś zalogowany!</h2>
//          <button onClick={handleLogout}>Wyloguj</button>
//        </>
//      )}
//      <LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
//      <RegisterForm isLoggedIn={isLoggedIn} />
//    </div>
//  );

return (
  <div>
    {isLoggedIn ? (
      <MailBoxPage onLogout={handleLogout} />
    ) : (
      <>
        <LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <RegisterForm isLoggedIn={isLoggedIn} />
      </>
    )}
  </div>
);
}
