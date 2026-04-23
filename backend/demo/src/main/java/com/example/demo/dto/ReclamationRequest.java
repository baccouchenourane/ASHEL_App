package com.example.demo.dto;

public class ReclamationRequest {
    private String objet;
    private String contenu;
    private String citoyenId;

    // Constructors
    public ReclamationRequest() {}

    public ReclamationRequest(String objet, String contenu, String citoyenId) {
        this.objet = objet;
        this.contenu = contenu;
        this.citoyenId = citoyenId;
    }

    // Getters and Setters
    public String getObjet() {
        return objet;
    }

    public void setObjet(String objet) {
        this.objet = objet;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public String getCitoyenId() {
        return citoyenId;
    }

    public void setCitoyenId(String citoyenId) {
        this.citoyenId = citoyenId;
    }
}
