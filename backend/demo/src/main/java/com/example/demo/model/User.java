package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 8)
    private String cin;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String password;

    @Column
    private String phone;

    // Constructors
    public User() {}

    public User(String cin, String nom, String password, String phone) {
        this.cin = cin;
        this.nom = nom;
        this.password = password;
        this.phone = phone;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
