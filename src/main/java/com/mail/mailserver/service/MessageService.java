package com.mail.mailserver.service;

import com.mail.mailserver.model.Message;
import com.mail.mailserver.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    // Wstrzykujemy repozytorium przez konstruktor
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    // Zapisz nową wiadomość
    public Message sendMessage(Message message) {
        // Możesz tu dodać walidacje, logikę biznesową itp.
        return messageRepository.save(message);
    }

    // Pobierz wiadomości dla konkretnego odbiorcy (recipient)
    public List<Message> getMessagesForRecipient(String recipientEmail) {
        return messageRepository.findByRecipientEmail(recipientEmail);
    }

    public List<Message> getMessagesFromSender(String senderEmail) {
        return messageRepository.findBySenderEmail(senderEmail);
    }

    public Message getMessageById(Long id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wiadomość nie znaleziona"));
    }

//    public boolean moveToTrash(Long messageId) {
//        int updated = messageRepository.updateFolderById(messageId, "trash");
//        return updated > 0;  // zwróci true jeśli coś zmieniono
//}



//    public void moveMessageToTrash(Long id) {
//        Message msg = messageRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Nie znaleziono wiadomości"));
//        msg.setFolder("trash");
//        messageRepository.save(msg);
//    }

}
