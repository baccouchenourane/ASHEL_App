# Mise à jour du système de notifications - Signalements et Réclamations

## Fichier modifié
- `frontend/src/components/NotificationBell.jsx`

## Modifications apportées

### 1. **Fonction `getNotifMeta()` - Ajout des nouveaux types de notifications**

#### Notifications de Réclamation (type: 'RECLAMATION')
- **"clôturée"** → Icône CheckCircle (vert #10B981), label "Réclamation"
- **"traitement"** → Icône Clock (amber #F59E0B), label "Réclamation"
- **"acceptée"** → Icône CheckCircle (vert #10B981), label "Réclamation"
- **"examen"** → Icône Clock (amber #F59E0B), label "Réclamation"
- **Par défaut** → Icône FileText (bleu #0056D2), label "Réclamation"

#### Notifications de Signalement (type: 'SIGNALEMENT')
- **"résolu"** → Icône CheckCircle (vert #10B981), label "Signalement"
- **"traitement"** → Icône Clock (amber #F59E0B), label "Signalement"
- **"cours"** → Icône Clock (amber #F59E0B), label "Signalement"
- **"rejeté"** → Icône XCircle (gris #6B7280), label "Signalement"
- **Par défaut** → Icône AlertCircle (rouge #E70011), label "Signalement"

### 2. **Fonction `handleItemClick()` - Navigation améliorée**

Navigation basée sur le type de notification:
- **Type 'RECLAMATION'** → Redirige vers `/reclamation-list`
- **Type 'SIGNALEMENT'** → Redirige vers `/signalement-list`
- **Autres types** → Redirige vers `/home` (par défaut)

Marque automatiquement la notification comme lue avant la navigation.

## Structure des données de notification

Chaque notification doit avoir la structure suivante:
```javascript
{
  id: number,
  type: 'SIGNALEMENT' | 'RECLAMATION' | 'E_AMENDE' | 'E_ADMINISTRATION',
  message: string,
  statut: 'NON_LU' | 'LU',
  dateCreation: ISO8601 string,
  // ... autres champs
}
```

## Exemples de messages

### Signalements
- "Votre signalement #123 est en cours de traitement."
- "Votre signalement #456 a été résolu."
- "Votre signalement #789 a été rejeté."

### Réclamations
- "Votre réclamation #101 est en cours d'examen."
- "Votre réclamation #202 a été acceptée."
- "Votre réclamation #303 a été clôturée."

## Fonctionnalités conservées

✅ Compteur "X non lues" en haut du panneau
✅ Badge rouge sur les notifications non lues
✅ Chevron ">" à droite de chaque notification
✅ Même style visuel que les notifications existantes
✅ Fermeture du panneau au clic extérieur
✅ Bouton "Tout marquer comme lu"
✅ Affichage du temps écoulé (Il y a X min/h/j)

## Intégration avec le backend

Le backend doit créer des notifications avec:
- `type: 'SIGNALEMENT'` ou `type: 'RECLAMATION'`
- `message` contenant les mots-clés pour la détection du statut
- `statut: 'NON_LU'` pour les nouvelles notifications
- `dateCreation` en format ISO8601

Exemple d'appel backend (SignalementService):
```java
notificationService.createNotificationForSignalement(
    saved.getCin(),
    saved.getId(),
    "Votre signalement " + saved.getReference() + " est maintenant EN_COURS"
);
```

## Prochaines étapes

1. Vérifier que le backend crée les notifications avec les bons types et messages
2. Tester la navigation vers les listes de signalements et réclamations
3. Vérifier que le compteur de notifications non lues se met à jour correctement
4. Tester le marquage comme lu des notifications
