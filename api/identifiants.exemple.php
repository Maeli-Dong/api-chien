<?php
// Les identifiants de la base, seuls dans leur fichier.
//
// 1. Copiez ce fichier sous le nom identifiants.php, dans le même dossier.
// 2. Réglez les valeurs selon votre serveur :
//      XAMPP (Mac et Windows) : port 3306, mot de passe vide ''
//      MAMP sous Windows      : port 3306, mot de passe 'root'
//      MAMP sur Mac           : port 8889, mot de passe 'root'
//    Sur Mac, avec 'localhost', PHP passe par un socket et ignore le port.
//    En ligne, l'hébergeur vous donne les quatre valeurs.
//
// identifiants.php n'entre jamais dans Git (voir .gitignore) :
// le dépôt ne contient que ce modèle, sans mot de passe.
//
// Pas de balise de fermeture à la fin du fichier : un saut de ligne après elle
// partirait dans la réponse, avant le JSON.
$hote         = 'localhost';
$port         = '3306';
$base         = 'musee';
$utilisateur  = 'root';
$mot_de_passe = '';
