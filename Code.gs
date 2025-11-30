/**
 * @file        Code.gs
 * @description Script serveur principal pour le module de signature manuscrite.
 * Gère l'interface utilisateur, la persistance sur Drive et
 * l'insertion d'images dans Google Docs.
 *
 * @author      Fabrice Faucheux
 * @version     2.0.0 (Avec persistance Drive)
 * @date        2025
 * @license     MIT
 *
 * @OnlyCurrentDoc
 */

// --- CONSTANTES DE CONFIGURATION ---
const NOM_MENU = '✍️ Signature';
const FICHIER_HTML_MODALE = 'Signature'; // Doit correspondre au nom du fichier HTML
const NOM_FICHIER_SAUVEGARDE = 'user_signature_config.txt'; // Fichier discret à la racine du Drive

/**
 * Déclencheur automatique à l'ouverture du Google Doc.
 * Crée le menu personnalisé.
 */
function onOpen(e) {
  DocumentApp.getUi()
    .createMenu(NOM_MENU)
    .addItem('Gérer ma signature', 'afficherModaleSignature')
    .addToUi();
}

/**
 * Prépare et affiche la modale HTML.
 * Injecte la signature existante (si trouvée) dans le template avant l'affichage.
 */
function afficherModaleSignature() {
  try {
    // 1. Création du template à partir du fichier HTML
    const template = HtmlService.createTemplateFromFile(FICHIER_HTML_MODALE);
    
    // 2. Récupération de la signature sauvegardée sur le Drive de l'utilisateur
    const signatureSauvegardee = recupererSignatureDepuisDrive();
    
    // 3. Injection de la variable vers le contexte client
    // Si aucune signature n'existe, on envoie une chaîne vide.
    template.donneesSignatureExistante = signatureSauvegardee || '';

    // 4. Finalisation et affichage
    const sortieHtml = template.evaluate()
      .setWidth(400)
      .setHeight(360) // Hauteur ajustée pour inclure la checkbox et les boutons
      .setTitle('Insérer votre signature');

    DocumentApp.getUi().showModalDialog(sortieHtml, ' '); // Titre vide pour un look plus propre
    
  } catch (erreur) {
    console.error(erreur);
    DocumentApp.getUi().alert(
      'Erreur Critique',
      `Impossible d'ouvrir le module : ${erreur.message}`,
      DocumentApp.getUi().ButtonSet.OK
    );
  }
}

/**
 * Fonction principale appelée par le client (HTML).
 * Gère l'insertion dans le document et la sauvegarde conditionnelle sur Drive.
 *
 * @param {string} donneesImage - La chaîne Base64 de l'image (data:image/png;base64,...).
 * @param {boolean} doitSauvegarder - Booléen indiquant si l'utilisateur veut mémoriser la signature.
 * @return {object} Un objet statut pour le client.
 */
function insererEtSauvegarderSignature(donneesImage, doitSauvegarder) {
  try {
    // Validation basique
    if (!donneesImage || !donneesImage.startsWith('data:image/png;base64,')) {
      throw new Error("Format d'image corrompu ou invalide.");
    }

    // 1. Gestion de la persistance (Sauvegarde)
    if (doitSauvegarder) {
      sauvegarderSignatureSurDrive(donneesImage);
    }

    // 2. Traitement de l'image
    const partieBase64 = donneesImage.split(',')[1];
    const objetBinaire = Utilities.newBlob(
      Utilities.base64Decode(partieBase64),
      'image/png', 
      'signature_manuscrite.png'
    );

    // 3. Insertion dans le Document Actif
    const doc = DocumentApp.getActiveDocument();
    const curseur = doc.getCursor();
    let imageInseree;

    if (curseur) {
      // Insertion à l'endroit précis du curseur
      imageInseree = curseur.insertInlineImage(objetBinaire);
    } else {
      // Fallback : Insertion à la fin du document si pas de curseur placé
      imageInseree = doc.getBody().appendImage(objetBinaire);
    }

    // 4. Redimensionnement intelligent (Ratio préservé)
    const largeurCible = 150; // Largeur standard pour une signature
    const ratio = largeurCible / imageInseree.getWidth();
    
    imageInseree.setWidth(largeurCible);
    imageInseree.setHeight(imageInseree.getHeight() * ratio);

    return { statut: 'succès' };

  } catch (erreur) {
    console.error(erreur);
    throw new Error(`Échec de l'opération : ${erreur.message}`);
  }
}

// --- FONCTIONS UTILITAIRES PRIVÉES (DRIVE) ---

/**
 * Recherche le fichier de configuration dans le Drive de l'utilisateur.
 * @return {string|null} Le contenu Base64 ou null.
 */
function recupererSignatureDepuisDrive() {
  try {
    const fichiers = DriveApp.getFilesByName(NOM_FICHIER_SAUVEGARDE);
    if (fichiers.hasNext()) {
      return fichiers.next().getBlob().getDataAsString();
    }
    return null;
  } catch (e) {
    // Si l'utilisateur n'a pas encore donné les droits Drive, on ignore silencieusement
    console.warn("Accès Drive impossible ou fichier inexistant : " + e.message);
    return null; 
  }
}

/**
 * Écrit la chaîne Base64 dans un fichier texte sur le Drive.
 * Écrase le fichier s'il existe déjà.
 */
function sauvegarderSignatureSurDrive(base64String) {
  const fichiers = DriveApp.getFilesByName(NOM_FICHIER_SAUVEGARDE);
  if (fichiers.hasNext()) {
    const fichier = fichiers.next();
    fichier.setContent(base64String);
  } else {
    DriveApp.createFile(NOM_FICHIER_SAUVEGARDE, base64String, MimeType.PLAIN_TEXT);
  }
}
