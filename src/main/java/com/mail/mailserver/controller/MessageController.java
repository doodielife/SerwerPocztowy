package com.mail.mailserver.controller;

import com.mail.mailserver.model.Message;
import com.mail.mailserver.service.AESUtil;
import com.mail.mailserver.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // Endpoint do wysyłania wiadomości
//    @PostMapping("/send")
//    public Message sendMessage(@RequestBody Message message) {
//        return messageService.sendMessage(message);
//    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessageWithAttachments(
            @RequestParam("senderEmail") String senderEmail,
            @RequestParam("recipientEmail") String recipientEmail,
            @RequestParam("subject") String subject,
            @RequestParam("content") String content,
            @RequestParam(value = "attachments", required = false) MultipartFile[] attachments
    ) {
        System.out.println("Attachments: " + (attachments != null ? attachments.length : "null"));

        try {
            Message savedMessage = messageService.sendMessageWithAttachments(
                    senderEmail, recipientEmail, subject, content, attachments
            );
            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Błąd podczas wysyłania wiadomości: " + e.getMessage());
        }
    }

    // Pobranie wiadomości dla odbiorcy
    @GetMapping("/inbox")
    public List<Message> getMessagesForRecipient(@RequestParam String recipientEmail) {
        return messageService.getMessagesForRecipient(recipientEmail);
    }

    // Pobranie wiadomości wysłanych przez nadawcę
    @GetMapping("/sent")
    public List<Message> getMessagesFromSender(@RequestParam String senderEmail) {
        return messageService.getMessagesFromSender(senderEmail);
    }

    @GetMapping("/trash")
    public List<Message> getMessagesFromTrash(@RequestParam String recipientEmail){
        return messageService.getMessagesFromTrash(recipientEmail);
    }

//    @GetMapping("/{id}")
//    public Message getMessageById(@PathVariable Long id) {
//        Message message = messageService.getMessageById(id);
//        message.setRead(true);
//        messageService.sendMessage(message);
//        if (message.getAttachments() != null) {
//            message.getAttachments().size(); // wymusza fetch z bazy
//        }
//        return message;
//    }

    @GetMapping("/{id}")
    public Message getMessageById(@PathVariable Long id) {
        Message message = messageService.getMessageById(id);
        message.setRead(true);
        messageService.sendMessage(message);

        // Odszyfrowanie treści przed zwróceniem do klienta
        String decryptedContent = AESUtil.decrypt(message.getContent());
        message.setContent(decryptedContent);

        if (message.getAttachments() != null) {
            message.getAttachments().size(); // wymusza fetch z bazy
        }
        return message;
    }


    @PutMapping("/{id}/delete")
    public ResponseEntity<?> deleteMessage(
            @PathVariable Long id,
            @RequestParam String userType // "sender" albo "recipient"
    ) {
        try {
            messageService.markMessageAsDeleted(id, userType);
            // Jeśli wszystko pójdzie dobrze, zwracamy HTTP 200 OK bez treści
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            // Jeśli podano zły typ użytkownika (userType), zwracamy HTTP 400 Bad Request
            // i w ciele odpowiedzi wysyłamy wiadomość błędu
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            // Jeśli wiadomość o danym id nie istnieje (np. wyjątek rzucany przez serwis),
            // zwracamy HTTP 404 Not Found bez treści
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/trash")
    public ResponseEntity<?> moveToTrash(
            @PathVariable Long id
    ){
        try {
            messageService.changeDirtoTrash(id);
            return ResponseEntity.ok().build();
        }catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


}
