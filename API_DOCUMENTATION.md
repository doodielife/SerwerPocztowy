# Dokumentacja API Serwera Pocztowego

## Spis treści
1.  [Bezpieczeństwo i Szyfrowanie](#bezpieczeństwo-i-szyfrowanie)
2.  [Użytkownicy (User API)](#użytkownicy-user-api)
3.  [Wiadomości (Message API)](#wiadomości-message-api)
4.  [Załączniki (Attachment API)](#załączniki-attachment-api)

---

## Bezpieczeństwo i Szyfrowanie

Aplikacja implementuje dwa główne mechanizmy kryptograficzne w celu ochrony danych użytkowników:

### 1. Haszowanie haseł (BCrypt)
*   **Algorytm:** BCrypt (zaimplementowany przez Spring Security).
*   **Zastosowanie:** Hasła użytkowników nigdy nie są przechowywane w bazie danych jawnym tekstem.
*   **Działanie:**
    *   Podczas rejestracji hasło jest haszowane (np. `$2a$10$...`).
    *   Podczas logowania podane hasło jest ponownie haszowane i porównywane z zapisanym skrótem.
*   **Lokalizacja w kodzie:** `UserService.java`

### 2. Szyfrowanie treści wiadomości (AES)
*   **Algorytm:** AES (Advanced Encryption Standard).
*   **Tryb:** ECB (Electronic Codebook) - domyślny w Javie dla `Cipher.getInstance("AES")`.
*   **Klucz:** 128-bitowy klucz symetryczny.
*   **Zastosowanie:** Treść wiadomości e-mail (`content`) jest szyfrowana przed zapisem do bazy danych i odszyfrowywana dopiero w momencie odczytu przez uprawnionego użytkownika.
*   **Działanie:**
    *   **Zapis:** Tekst jawny -> Szyfrowanie AES -> Kodowanie Base64 -> Baza danych.
    *   **Odczyt:** Baza danych -> Dekodowanie Base64 -> Odszyfrowanie AES -> Tekst jawny.
*   **Lokalizacja w kodzie:** `AESUtil.java`, `MessageService.java`, `MessageController.java`.

---

## Użytkownicy (User API)
Zarządzanie rejestracją i logowaniem użytkowników.

### 1. Rejestracja użytkownika
Tworzy nowe konto użytkownika. Hasło jest automatycznie haszowane przed zapisem.

*   **URL:** `/api/users/register`
*   **Metoda:** `POST`
*   **Body (JSON):**
    ```json
    {
      "email": "jan@example.com",
      "password": "haslo123",
      "imie": "Jan",
      "nazwisko": "Kowalski"
    }
    ```
*   **Odpowiedź:** Obiekt utworzonego użytkownika (JSON).

### 2. Logowanie
Weryfikuje dane logowania użytkownika.

*   **URL:** `/api/users/login`
*   **Metoda:** `POST`
*   **Body (JSON):**
    ```json
    {
      "email": "jan@example.com",
      "password": "haslo123"
    }
    ```
*   **Odpowiedź (String):**
    *   `"Zalogowano pomyślnie!"` (jeśli dane są poprawne)
    *   `"Nieprawidłowy e-mail lub hasło."` (jeśli błędne)

### 3. Znajdź użytkownika po e-mailu
Pobiera dane użytkownika na podstawie adresu e-mail.

*   **URL:** `/api/users/findByEmail`
*   **Metoda:** `GET`
*   **Parametry:**
    *   `email` (String) - Adres e-mail użytkownika
*   **Przykład:** `/api/users/findByEmail?email=jan@example.com`

### 4. Znajdź użytkownika po ID
Pobiera dane użytkownika na podstawie jego unikalnego identyfikatora.

*   **URL:** `/api/users/findById`
*   **Metoda:** `GET`
*   **Parametry:**
    *   `id` (Long) - ID użytkownika
*   **Przykład:** `/api/users/findById?id=1`

### 5. Pobierz wszystkich użytkowników
Zwraca listę wszystkich zarejestrowanych użytkowników.

*   **URL:** `/api/users/findAll`
*   **Metoda:** `GET`

---

## Wiadomości (Message API)
Wysyłanie, odbieranie i zarządzanie wiadomościami e-mail. Treść wiadomości jest szyfrowana (AES).

### 1. Wyślij wiadomość (z opcjonalnymi załącznikami)
Wysyła nową wiadomość. Obsługuje przesyłanie plików (multipart/form-data).

*   **URL:** `/api/messages/send`
*   **Metoda:** `POST`
*   **Typ zawartości:** `multipart/form-data`
*   **Parametry (Form Data):**
    *   `senderEmail` (String) - E-mail nadawcy
    *   `recipientEmail` (String) - E-mail odbiorcy
    *   `subject` (String) - Temat wiadomości
    *   `content` (String) - Treść wiadomości
    *   `attachments` (File[], opcjonalne) - Pliki załączników
*   **Odpowiedź:**
    *   `200 OK`: Obiekt zapisanej wiadomości.
    *   `400 Bad Request`: Jeśli odbiorca nie istnieje lub wystąpił błąd.

### 2. Skrzynka odbiorcza (Inbox)
Pobiera listę wiadomości odebranych przez użytkownika (folder "inbox").

*   **URL:** `/api/messages/inbox`
*   **Metoda:** `GET`
*   **Parametry:**
    *   `recipientEmail` (String) - E-mail użytkownika sprawdzającego skrzynkę
*   **Przykład:** `/api/messages/inbox?recipientEmail=jan@example.com`

### 3. Wiadomości wysłane (Sent)
Pobiera listę wiadomości wysłanych przez użytkownika.

*   **URL:** `/api/messages/sent`
*   **Metoda:** `GET`
*   **Parametry:**
    *   `senderEmail` (String) - E-mail nadawcy
*   **Przykład:** `/api/messages/sent?senderEmail=jan@example.com`

### 4. Kosz (Trash)
Pobiera listę wiadomości znajdujących się w koszu użytkownika.

*   **URL:** `/api/messages/trash`
*   **Metoda:** `GET`
*   **Parametry:**
    *   `recipientEmail` (String) - E-mail użytkownika
*   **Przykład:** `/api/messages/trash?recipientEmail=jan@example.com`

### 5. Pobierz szczegóły wiadomości
Pobiera pojedynczą wiadomość po ID. **Automatycznie odszyfrowuje treść** i oznacza wiadomość jako przeczytaną.

*   **URL:** `/api/messages/{id}`
*   **Metoda:** `GET`
*   **Przykład:** `/api/messages/5`

### 6. Przenieś do kosza
Przenosi wiadomość do folderu "trash" (lub przywraca do "inbox", jeśli już tam jest).

*   **URL:** `/api/messages/{id}/trash`
*   **Metoda:** `PUT`
*   **Przykład:** `/api/messages/5/trash`

### 7. Usuń wiadomość (trwale lub ukryj)
Oznacza wiadomość jako usuniętą przez nadawcę lub odbiorcę. Jeśli obie strony usuną wiadomość, jest ona trwale usuwana z bazy danych.

*   **URL:** `/api/messages/{id}/delete`
*   **Metoda:** `PUT`
*   **Parametry:**
    *   `userType` (String) - Kto usuwa wiadomość: `"sender"` lub `"recipient"`
*   **Przykład:** `/api/messages/5/delete?userType=recipient`

---

## Załączniki (Attachment API)
Pobieranie plików dołączonych do wiadomości.

### 1. Pobierz załącznik
Pobiera plik załącznika na podstawie jego ID.

*   **URL:** `/api/attachments/{id}/download`
*   **Metoda:** `GET`
*   **Odpowiedź:** Strumień bajtów pliku (automatyczne pobieranie w przeglądarce).
