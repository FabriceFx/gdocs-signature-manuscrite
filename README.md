# Module de signature manuscrite pour Google Docs

![License MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Google%20Apps%20Script-green)
![Runtime](https://img.shields.io/badge/Google%20Apps%20Script-V8-green)
![Author](https://img.shields.io/badge/Auteur-Fabrice%20Faucheux-orange)

Un script complet pour Google Docs permettant aux utilisateurs de dessiner, insérer et sauvegarder leur signature manuscrite directement dans leurs documents, sans passer par des outils tiers.

## 🚀 Fonctionnalités Clés

* **Intégration Native** : Menu dédié "✍️ Signature" directement dans l'interface Google Docs.
* **Interface de Dessin** : Utilisation de HTML5 Canvas pour un tracé fluide et précis (souris et tactile).
* **Persistance Intelligente** : 
    * Sauvegarde automatique de la signature sur le Google Drive de l'utilisateur (`user_signature_config.txt`).
    * Rechargement automatique de la signature lors de la prochaine utilisation.
* **Insertion Optimisée** :
    * Supporte le positionnement au curseur.
    * Redimensionnement automatique proportionnel (Largeur : 150px).
* **UX Soignée** : Design respectant les codes "Material Design" de Google.

## 🛠️ Installation et Configuration

### Prérequis
* Un compte Google.
* Un document Google Docs (ou un déploiement en tant qu'Add-on).

### Installation Manuelle (Bound Script)
1.  Ouvrez un Google Doc.
2.  Allez dans **Extensions** > **Apps Script**.
3.  **Fichier Code.gs** : Copiez le contenu de `Code.gs` fourni dans ce dépôt.
4.  **Fichier HTML** : 
    * Cliquez sur le `+` > HTML.
    * Nommez le fichier `Signature` (respectez la casse).
    * Copiez le contenu de `Signature.html`.
5.  Sauvegardez (`Ctrl+S`).
6.  Rechargez votre Google Doc.

## 🔒 Permissions

Lors de la première exécution, le script demandera les autorisations suivantes :
* **Voir et gérer vos documents Google Docs** : Pour insérer l'image.
* **Voir et gérer les fichiers Google Drive** : Pour lire et sauvegarder votre signature (fichier de config uniquement).
* **Afficher des boîtes de dialogue** : Pour l'interface de dessin.

## 📂 Structure du Projet

```text
├── Code.gs           # Logique Serveur (GAS, DriveApp, DocumentApp)
├── Signature.html    # Interface Client (HTML, CSS, JS Canvas Logic)
└── README.md         # Documentation
