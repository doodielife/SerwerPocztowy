package com.mail.mailserver.controller;

import com.mail.mailserver.model.Uzytkownik;
import com.mail.mailserver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;


@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    //Endpoint do rejestracji użytkownika
    @PostMapping("/register")
    public Uzytkownik register(@RequestBody Uzytkownik user) {
        return userService.registerUser(user);
    }

    //Endpoint do pobrania użytkownika po mailu
    @GetMapping("/findByEmail")
    public Uzytkownik findByEmail(@RequestParam String email) {
        return userService.findByEmail(email).orElse(null);
    }

    //Endpoint logowania
    @PostMapping("/login")
    public String login(@RequestBody Uzytkownik user){
        boolean isLogged = userService.loginUser(user.getEmail(), user.getPassword());
        if(isLogged){
            return "Zalogowano pomyślnie!";
        } else {
            return "Nieprawidłowy e-mail lub hasło.";
        }
    }

    //Pobranie użytkownika po ID
    @GetMapping("/findById")
    public Optional<Uzytkownik> getUserById(@RequestParam Long id) {
        return userService.getUserById(id);
    }

    //pobranie wszystkich użytkowników
    @GetMapping("/findAll")
    public List<Uzytkownik> getAllUsers() {
        return userService.getAllUsers();
    }

}
