package com.mail.mailserver.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;


@Entity
public class Uzytkownik {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String imie;
    private String nazwisko;
    private LocalDate dataRejestracji;

    //Konstruktor bez argumentów
    public Uzytkownik() {}

    //Konstruktor z polami
    public Uzytkownik(String email, String password, String imie, String nazwisko, LocalDate dataRejestracji){
        this.email = email;
        this.password = password;
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.dataRejestracji = dataRejestracji;
    }

    //Gettery i settery
    public Long getID(){
        return id;
    }

    public void setID(Long id){
        this.id = id;
    }

    public String getEmail(){
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getImie() {
        return imie;
    }

    public void setImie(String imie) {
        this.imie = imie;
    }

    public String getNazwisko() {
        return nazwisko;
    }

    public void setNazwisko(String nazwisko) {
        this.nazwisko = nazwisko;
    }

    public LocalDate getDataRejestracji() {
        return dataRejestracji;
    }

    public void setDataRejestracji(LocalDate dataRejestracji) {
        this.dataRejestracji = dataRejestracji;
    }

}
