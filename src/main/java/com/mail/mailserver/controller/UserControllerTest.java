package com.mail.mailserver.controller;

import com.mail.mailserver.model.Uzytkownik;
import com.mail.mailserver.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    private final String userJson = "{ \"id\": 1, \"email\": \"test@example.com\", \"password\": \"password123\" }";

    private Uzytkownik createUser() {
        Uzytkownik user = new Uzytkownik();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        return user;
    }

    @Test
    void testRegisterUser() throws Exception {
        Uzytkownik user = createUser();
        when(userService.registerUser(Mockito.any(Uzytkownik.class))).thenReturn(user);

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void testFindByEmail_found() throws Exception {
        Uzytkownik user = createUser();
        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/users/findByEmail")
                        .param("email", "test@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void testFindByEmail_notFound() throws Exception {
        when(userService.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/findByEmail")
                        .param("email", "notfound@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().string(""));
    }

    @Test
    void testLogin_success() throws Exception {
        when(userService.loginUser("test@example.com", "password123")).thenReturn(true);

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isOk())
                .andExpect(content().string("Zalogowano pomyślnie!"));
    }

    @Test
    void testLogin_fail() throws Exception {
        when(userService.loginUser("test@example.com", "password123")).thenReturn(false);

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isOk())
                .andExpect(content().string("Nieprawidłowy e-mail lub hasło."));
    }

    @Test
    void testFindById() throws Exception {
        Uzytkownik user = createUser();
        when(userService.getUserById(1L)).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/users/findById")
                        .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void testFindAll() throws Exception {
        Uzytkownik user1 = createUser();
        Uzytkownik user2 = new Uzytkownik();
        user2.setEmail("second@example.com");
        user2.setPassword("abc");

        when(userService.getAllUsers()).thenReturn(List.of(user1, user2));

        mockMvc.perform(get("/api/users/findAll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[1].email").value("second@example.com"));
    }
}
