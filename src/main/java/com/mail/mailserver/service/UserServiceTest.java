package com.mail.mailserver.service;

import com.mail.mailserver.model.Uzytkownik;
import com.mail.mailserver.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;
import java.util.List;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private Uzytkownik testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testUser = new Uzytkownik();
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
    }

    @Test
    void registerUser_shouldHashPasswordAndSaveUser() {
        ArgumentCaptor<Uzytkownik> userCaptor = ArgumentCaptor.forClass(Uzytkownik.class);

        when(userRepository.save(any(Uzytkownik.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Uzytkownik savedUser = userService.registerUser(testUser);

        verify(userRepository).save(userCaptor.capture());
        String hashedPassword = userCaptor.getValue().getPassword();

        assertNotNull(savedUser);
        assertNotEquals("password123", hashedPassword);
        assertTrue(new BCryptPasswordEncoder().matches("password123", hashedPassword));
    }

    @Test
    void findByEmail_shouldReturnUserIfExists() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        Optional<Uzytkownik> result = userService.findByEmail("test@example.com");

        assertTrue(result.isPresent());
        assertEquals("test@example.com", result.get().getEmail());
    }

    @Test
    void loginUser_shouldReturnTrueIfPasswordMatches() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        testUser.setPassword(encoder.encode("password123"));

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        boolean success = userService.loginUser("test@example.com", "password123");

        assertTrue(success);
    }

    @Test
    void loginUser_shouldReturnFalseIfUserNotFound() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        boolean success = userService.loginUser("nonexistent@example.com", "any");

        assertFalse(success);
    }

    @Test
    void loginUser_shouldReturnFalseIfPasswordDoesNotMatch() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        testUser.setPassword(encoder.encode("correctPassword"));

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        boolean success = userService.loginUser("test@example.com", "wrongPassword");

        assertFalse(success);
    }

    @Test
    void userExists_shouldReturnTrueIfUserExists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertTrue(userService.userExists("test@example.com"));
    }


    @Test
    void getAllUsers_shouldReturnListOfUsers() {
        List<Uzytkownik> users = Arrays.asList(testUser, new Uzytkownik());
        when(userRepository.findAll()).thenReturn(users);

        List<Uzytkownik> result = userService.getAllUsers();

        assertEquals(2, result.size());
    }
}
