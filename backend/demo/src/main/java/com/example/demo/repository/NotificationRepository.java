package com.example.demo.repository;

import com.example.demo.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Fixed: Changed from citoyenId to cin (String)
    List<Notification> findByCinOrderByDateCreationDesc(String cin);

    // Fixed: Changed from citoyenId to cin
    long countByCinAndStatut(String cin, String statut);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.statut = 'LU' WHERE n.cin = :cin AND n.statut = 'NON_LU'")
    int markAllAsRead(@Param("cin") String cin);

}