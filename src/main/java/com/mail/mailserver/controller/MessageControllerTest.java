package com.mail.mailserver.controller;

import com.mail.mailserver.model.Message;
import com.mail.mailserver.service.MessageService;
import com.mail.mailserver.service.AESUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@WebMvcTest(MessageController.class)
@AutoConfigureMockMvc(addFilters = false)
public class MessageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MessageService messageService;

    private Message exampleMessage;

    @BeforeEach
    public void setup() {
        exampleMessage = new Message();
        exampleMessage.setSenderEmail("sender@example.com");
        exampleMessage.setRecipientEmail("recipient@example.com");
        exampleMessage.setSubject("Test subject");
        exampleMessage.setContent(AESUtil.encrypt("Hello"));
        exampleMessage.setRead(false);
    }

    @Test
    public void testSendMessageWithAttachments_success() throws Exception {
        MockMultipartFile attachment = new MockMultipartFile(
                "attachments", "file.txt", MediaType.TEXT_PLAIN_VALUE, "Test content".getBytes());

        when(messageService.sendMessageWithAttachments(
                anyString(), anyString(), anyString(), anyString(), (org.springframework.web.multipart.MultipartFile[]) any()))
                .thenReturn(exampleMessage);

        mockMvc.perform(multipart("/api/messages/send")
                        .file(attachment)
                        .param("senderEmail", "sender@example.com")
                        .param("recipientEmail", "recipient@example.com")
                        .param("subject", "Hello")
                        .param("content", "Hello content"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.senderEmail").value("sender@example.com"));

        verify(messageService, times(1))
                .sendMessageWithAttachments(anyString(), anyString(), anyString(), anyString(), (org.springframework.web.multipart.MultipartFile[]) any());
    }

    @Test
    public void testSendMessageWithAttachments_failure() throws Exception {
        when(messageService.sendMessageWithAttachments(anyString(), anyString(), anyString(), anyString(), (org.springframework.web.multipart.MultipartFile[]) any()))
                .thenThrow(new RuntimeException("Error sending message"));

        mockMvc.perform(multipart("/api/messages/send")
                        .param("senderEmail", "sender@example.com")
                        .param("recipientEmail", "recipient@example.com")
                        .param("subject", "Hello")
                        .param("content", "Hello content"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Błąd podczas wysyłania wiadomości")));

        verify(messageService, times(1))
                .sendMessageWithAttachments(anyString(), anyString(), anyString(), anyString(), (org.springframework.web.multipart.MultipartFile[]) any());
    }

    @Test
    public void testGetMessagesForRecipient() throws Exception {
        when(messageService.getMessagesForRecipient("recipient@example.com"))
                .thenReturn(Collections.singletonList(exampleMessage));

        mockMvc.perform(get("/api/messages/inbox")
                        .param("recipientEmail", "recipient@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].recipientEmail").value("recipient@example.com"));

        verify(messageService, times(1)).getMessagesForRecipient("recipient@example.com");
    }

    @Test
    public void testGetMessagesFromSender() throws Exception {
        when(messageService.getMessagesFromSender("sender@example.com"))
                .thenReturn(Collections.singletonList(exampleMessage));

        mockMvc.perform(get("/api/messages/sent")
                        .param("senderEmail", "sender@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].senderEmail").value("sender@example.com"));

        verify(messageService, times(1)).getMessagesFromSender("sender@example.com");
    }


    @Test
    public void testDeleteMessage_success() throws Exception {
        doNothing().when(messageService).markMessageAsDeleted(1L, "sender");

        mockMvc.perform(put("/api/messages/1/delete")
                        .param("userType", "sender"))
                .andExpect(status().isOk());

        verify(messageService, times(1)).markMessageAsDeleted(1L, "sender");
    }

    @Test
    public void testDeleteMessage_badUserType() throws Exception {
        doThrow(new IllegalArgumentException("Invalid userType"))
                .when(messageService).markMessageAsDeleted(1L, "invalidType");

        mockMvc.perform(put("/api/messages/1/delete")
                        .param("userType", "invalidType"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid userType"));

        verify(messageService, times(1)).markMessageAsDeleted(1L, "invalidType");
    }

    @Test
    public void testDeleteMessage_notFound() throws Exception {
        doThrow(new RuntimeException("Not found"))
                .when(messageService).markMessageAsDeleted(1L, "sender");

        mockMvc.perform(put("/api/messages/1/delete")
                        .param("userType", "sender"))
                .andExpect(status().isNotFound());

        verify(messageService, times(1)).markMessageAsDeleted(1L, "sender");
    }

    @Test
    public void testMoveToTrash_success() throws Exception {
        doNothing().when(messageService).changeDirtoTrash(1L);

        mockMvc.perform(put("/api/messages/1/trash"))
                .andExpect(status().isOk());

        verify(messageService, times(1)).changeDirtoTrash(1L);
    }

    @Test
    public void testMoveToTrash_badRequest() throws Exception {
        doThrow(new IllegalArgumentException("Invalid message id"))
                .when(messageService).changeDirtoTrash(1L);

        mockMvc.perform(put("/api/messages/1/trash"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid message id"));

        verify(messageService, times(1)).changeDirtoTrash(1L);
    }

    @Test
    public void testMoveToTrash_notFound() throws Exception {
        doThrow(new RuntimeException("Not found"))
                .when(messageService).changeDirtoTrash(1L);

        mockMvc.perform(put("/api/messages/1/trash"))
                .andExpect(status().isNotFound());

        verify(messageService, times(1)).changeDirtoTrash(1L);
    }
}
