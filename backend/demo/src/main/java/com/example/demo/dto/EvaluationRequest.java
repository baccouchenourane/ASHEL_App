package com.example.demo.dto;

public class EvaluationRequest {
    private Integer note;
    private String commentaire;
    private String servicePublic;
    private String citoyenId; // Changed back to String to match CIN format

    // Constructors
    public EvaluationRequest() {}

    public EvaluationRequest(Integer note, String commentaire, String servicePublic, String citoyenId) {
        this.note = note;
        this.commentaire = commentaire;
        this.servicePublic = servicePublic;
        this.citoyenId = citoyenId;
    }

    // Getters and Setters
    public Integer getNote() {
        return note;
    }

    public void setNote(Integer note) {
        this.note = note;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public String getServicePublic() {
        return servicePublic;
    }

    public void setServicePublic(String servicePublic) {
        this.servicePublic = servicePublic;
    }

    public String getCitoyenId() {
        return citoyenId;
    }

    public void setCitoyenId(String citoyenId) {
        this.citoyenId = citoyenId;
    }
}
