package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class HomeService {

    @Autowired
    private UserRepository userRepository;

    // ─── DASHBOARD COMPLET ───────────────────────────────────────────────────
    public Map<String, Object> getDashboard(String cin) {
        User user = userRepository.findByCin(cin)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("profil",               buildProfil(user));
        dashboard.put("identiteDigitale",     buildIdentiteDigitale());
        dashboard.put("documents",            buildDocuments(user));
        dashboard.put("notificationsServices", buildNotificationsServices());

        return dashboard;
    }

    // ─── PROFIL ──────────────────────────────────────────────────────────────
    private Map<String, Object> buildProfil(User user) {
        Map<String, Object> profil = new LinkedHashMap<>();
        profil.put("nom",       user.getNom());
        profil.put("nomComplet", user.getNom());
        profil.put("cinMasque", masquerCin(user.getCin()));
        return profil;
    }

    // ─── IDENTITÉ DIGITALE ───────────────────────────────────────────────────
    // Statique pour l'instant — à enrichir quand tu auras un champ statut dans User
    private Map<String, Object> buildIdentiteDigitale() {
        Map<String, Object> identite = new LinkedHashMap<>();
        identite.put("statut",  "ACTIF");
        identite.put("verifie", true);
        identite.put("label",   "ACTIF / VÉRIFIÉ");
        return identite;
    }

    // ─── DOCUMENTS ───────────────────────────────────────────────────────────
    // Simulés à partir du CIN de l'utilisateur
    // À remplacer par une vraie table Document quand tu l'auras créée
    private List<Map<String, Object>> buildDocuments(User user) {
        List<Map<String, Object>> docs = new ArrayList<>();

        docs.add(buildDoc("1", "CIN", "CIN",
                masquerCin(user.getCin()), "VALIDE", "14 Mars 2030"));

        docs.add(buildDoc("2", "PASSEPORT", "Passeport",
                "TN****43", "VALIDE", "31 Mai 2032"));

        docs.add(buildDoc("3", "PERMIS_CONDUIRE", "Permis",
                "****8PC", "VALIDE", "09 Sep 2028"));

        return docs;
    }

    private Map<String, Object> buildDoc(String id, String type, String label,
                                          String numeroMasque, String statut,
                                          String dateExpiration) {
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("id",            id);
        d.put("type",          type);
        d.put("label",         label);
        d.put("numeroMasque",  numeroMasque);
        d.put("statut",        statut);
        d.put("dateExpiration", dateExpiration);
        return d;
    }

    // ─── NOTIFICATIONS SERVICES ──────────────────────────────────────────────
    // Simulées — à remplacer par une vraie table Notification
    private List<Map<String, Object>> buildNotificationsServices() {
        List<Map<String, Object>> notifs = new ArrayList<>();

        Map<String, Object> amende = new LinkedHashMap<>();
        amende.put("id",           1);
        amende.put("type",         "AMENDE");
        amende.put("titre",        "E-Amende");
        amende.put("message",      "Vous avez 1 amende en attente (60 DT)");
        amende.put("estLu",        false);
        amende.put("routeCible",   "/e-amende");
        amende.put("montantFormate", "60.000 DT");
        notifs.add(amende);

        Map<String, Object> doc = new LinkedHashMap<>();
        doc.put("id",          2);
        doc.put("type",        "DOCUMENT_PRET");
        doc.put("titre",       "E-Administration");
        doc.put("message",     "Extrait de naissance disponible.");
        doc.put("estLu",       false);
        doc.put("routeCible",  "/e-admin");
        notifs.add(doc);

        return notifs;
    }

    // ─── LOGOUT ──────────────────────────────────────────────────────────────
    public void logout(String cin) {
        // Stateless — rien à faire côté serveur
        // Le frontend supprime le localStorage
    }

    // ─── HELPER : masquage CIN ───────────────────────────────────────────────
    private String masquerCin(String cin) {
        if (cin == null || cin.length() < 8) return cin;
        return cin.substring(0, 3) + "****" + cin.substring(7, 8);
    }
}