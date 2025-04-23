package com.mail.mailserver.controller;

import com.mail.mailserver.model.User;
import com.mail.mailserver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    //Endpoint do rejestracji użytkownika
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    //Endpoint do pobrania użytkownika po mailu
    @GetMapping("/findByEmail")
    public User findByEmail(@RequestParam String email) {
        return userService.findByEmail(email).orElse(null);
    }

}
