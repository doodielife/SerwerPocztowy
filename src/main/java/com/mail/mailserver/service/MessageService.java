package com.mail.mailserver.service;

import com.mail.mailserver.model.Attachment;
import com.mail.mailserver.model.Message;
import com.mail.mailserver.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
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

    @Transactional
    public Message sendMessageWithAttachments(String senderEmail, String recipientEmail, String subject, String content, MultipartFile[] attachments) throws IOException {
        Message message = new Message(senderEmail, recipientEmail, subject, content);
        message.setTimestamp(LocalDateTime.now());

        if(attachments != null){
            for(MultipartFile file : attachments){
                Attachment attachment = new Attachment();
                attachment.setFilename(file.getOriginalFilename());
                attachment.setContentType(file.getContentType());
                attachment.setData(file.getBytes());
                attachment.setMessage(message);

                message.getAttachments().add(attachment);
            }
        }
        return messageRepository.save(message);
    }

    // Pobierz wiadomości dla konkretnego odbiorcy (recipient)
    public List<Message> getMessagesForRecipient(String recipientEmail) {
        return messageRepository.findByRecipientEmailAndFolderAndRecipientDeletedFalse(recipientEmail, "inbox");
    }

    public List<Message> getMessagesFromSender(String senderEmail) {
        return messageRepository.findBySenderEmailAndSenderDeletedFalse(senderEmail);
    }

    public List<Message> getMessagesFromTrash(String recipientEmail){
        return messageRepository.findByRecipientEmailAndFolderAndRecipientDeletedFalse(recipientEmail, "trash");
    }

    public Message getMessageById(Long id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wiadomość nie znaleziona"));
    }

    public void markMessageAsDeleted(Long messageId, String userType) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Wiadomość nie znaleziona"));

        if ("sender".equalsIgnoreCase(userType)) {
            message.setSenderDeleted(true);
        } else if ("recipient".equalsIgnoreCase(userType)) {
            message.setRecipientDeleted(true);
        } else {
            throw new IllegalArgumentException("Niepoprawny typ użytkownika: " + userType);
        }

        if (message.isSenderDeleted() && message.isRecipientDeleted()) {
            messageRepository.delete(message);  // usuwamy całkowicie, bo obie strony usunęły
        } else {
            messageRepository.save(message);    // tylko aktualizujemy flagi
        }
    }

    public void changeDirtoTrash(Long messageId){
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Wiadomość nie znaleziona"));
        if ("inbox".equals(message.getFolder())) {
            message.setFolder("trash");
        } else {
            message.setFolder("inbox");
        }
        messageRepository.save(message);
    }


}
