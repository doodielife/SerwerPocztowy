package com.mail.mailserver.service;

import com.mail.mailserver.model.Attachment;
import com.mail.mailserver.model.Message;
import com.mail.mailserver.repository.MessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MessageServiceTest {

    private MessageRepository messageRepository;
    private MessageService messageService;

    @BeforeEach
    void setUp() {
        messageRepository = mock(MessageRepository.class);
        messageService = new MessageService(messageRepository);
    }

    @Test
    void shouldSendSimpleMessage() {
        Message msg = new Message("sender@example.com", "recipient@example.com", "Subject", "Content");
        when(messageRepository.save(any(Message.class))).thenReturn(msg);

        Message result = messageService.sendMessage(msg);

        assertEquals("sender@example.com", result.getSenderEmail());
        verify(messageRepository).save(msg);
    }

    @Test
    void shouldSendMessageWithAttachments() throws Exception {
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn("file.txt");
        when(mockFile.getContentType()).thenReturn("text/plain");
        when(mockFile.getBytes()).thenReturn("file content".getBytes(StandardCharsets.UTF_8));

        Message savedMessage = new Message("a", "b", "c", "d");
        when(messageRepository.save(any(Message.class))).thenReturn(savedMessage);

        Message result = messageService.sendMessageWithAttachments(
                "sender@example.com",
                "recipient@example.com",
                "Subject",
                "Secret content",
                new MultipartFile[]{mockFile}
        );

        assertNotNull(result);
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    void shouldReturnMessagesForRecipient() {
        List<Message> mockMessages = List.of(new Message());
        when(messageRepository.findByRecipientEmailAndFolderAndRecipientDeletedFalse("recipient@example.com", "inbox")).thenReturn(mockMessages);

        List<Message> result = messageService.getMessagesForRecipient("recipient@example.com");

        assertEquals(1, result.size());
        verify(messageRepository).findByRecipientEmailAndFolderAndRecipientDeletedFalse("recipient@example.com", "inbox");
    }

    @Test
    void shouldThrowWhenMessageNotFound() {
        when(messageRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> messageService.getMessageById(1L));
        assertEquals("Wiadomość nie znaleziona", ex.getMessage());
    }

    @Test
    void shouldDeleteMessageWhenBothUsersDeleted() {
        Message message = new Message();
        message.setSenderDeleted(true);
        message.setRecipientDeleted(false);

        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));

        messageService.markMessageAsDeleted(1L, "recipient");

        assertTrue(message.isRecipientDeleted());
        verify(messageRepository).delete(message);
    }

    @Test
    void shouldUpdateMessageFolder() {
        Message message = new Message();
        message.setFolder("inbox");

        when(messageRepository.findById(2L)).thenReturn(Optional.of(message));

        messageService.changeDirtoTrash(2L);

        assertEquals("trash", message.getFolder());
        verify(messageRepository).save(message);
    }
}
