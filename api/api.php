<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://api-chien.netlify.app');
require __DIR__ . '/connexion.php';

$colonnes = 'id, titre, artiste, annee, categorie, hauteur_cm, image';

// 1. Une seule oeuvre : api.php?id=12
$requete = $pdo->prepare("SELECT $colonnes FROM oeuvres WHERE id = :id");

$id = parametre('id');
if ($id !== '') {
    // Que des chiffres. Sinon MySQL lirait "12abc" comme 12, sans broncher.
    if (!ctype_digit($id)) {
        repondre(array('erreur' => 'id doit être un nombre entier'), 400);
    }
    $requete->execute(array('id' => $id));
    $oeuvre = $requete->fetch();
    if ($oeuvre === false) {
        repondre(array('erreur' => 'Aucune oeuvre avec cet id'), 404);
    } else {
        repondre(array('data' => mettre_en_forme($oeuvre)));
    }
}

// 2. La liste (exercice 6) : api.php, api.php?page=2, api.php?categorie=estampe
$par_page = 6;

// (int) transforme n'importe quel texte en nombre : ?page=abc donne 0
$page = (int) parametre('page');
if ($page < 1) {
    $page = 1;
}
// Un plafond : un numéro géant ferait déborder le calcul du décalage (étape 4)
if ($page > 1000) {
    $page = 1000;
}

// Le filtre est facultatif : la condition n'est ajoutée que s'il est donné
$categorie = parametre('categorie');
$condition = '';
$valeurs   = array();
if ($categorie !== '') {
    $condition = 'WHERE categorie = :categorie';
    $valeurs['categorie'] = $categorie;
}

// Combien d'oeuvres en tout, pour calculer le nombre de pages
$requete = $pdo->prepare("SELECT COUNT(*) FROM oeuvres $condition");
$requete->execute($valeurs);
$total = (int) $requete->fetchColumn();
$pages = (int) ceil($total / $par_page);

// Les oeuvres de la page demandée
$requete = $pdo->prepare("SELECT $colonnes FROM oeuvres $condition ORDER BY id LIMIT :limite OFFSET :decalage");
if ($categorie !== '') {
    $requete->bindValue('categorie', $categorie);
}
// PDO::PARAM_INT : LIMIT exige un nombre, et refuse '6' écrit entre guillemets
$requete->bindValue('limite', $par_page, PDO::PARAM_INT);
$requete->bindValue('decalage', ($page - 1) * $par_page, PDO::PARAM_INT);
$requete->execute();

$oeuvres = array();
foreach ($requete->fetchAll() as $ligne) {
    $oeuvres[] = mettre_en_forme($ligne);
}

// La réponse : les œuvres, et de quoi construire les boutons de pages
repondre(array(
    'pagination' => array(
        'total'    => $total,
        'par_page' => $par_page,
        'page'     => $page,
        'pages'    => $pages,
        'suivante' => $page < $pages ? $page + 1 : null,
    ),
    'data' => $oeuvres,
));

// Envoie un tableau PHP en JSON, avec un code HTTP, puis arrête le script.
function repondre($donnees, $code = 200)
{
    $json = json_encode($donnees, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    // Un texte mal encodé dans la base : json_encode renvoie false, et echo n'afficherait rien.
    if ($json === false) {
        $code = 500;
        $json = json_encode(array('erreur' => json_last_error_msg()));
    }
    http_response_code($code);
    echo $json;
    exit;
}

// Le contrat de votre API : le type de chaque champ, décidé ici.
function mettre_en_forme($ligne)
{
    return array(
        'id'         => (int) $ligne['id'],
        'titre'      => $ligne['titre'],
        'artiste'    => $ligne['artiste'],
        'annee'      => $ligne['annee'] === null ? null : (int) $ligne['annee'],
        'categorie'  => $ligne['categorie'],
        'image'      => $ligne['image'],
        'hauteur_cm' => $ligne['hauteur_cm'] === null ? null : (float) $ligne['hauteur_cm'],
    );
}

// Lit un paramètre de l'adresse, toujours sous forme de texte, '' s'il manque.
// Une adresse comme ?id[]=1 envoie un tableau au lieu d'un texte : on l'ignore.
function parametre($nom)
{
    return isset($_GET[$nom]) && is_string($_GET[$nom]) ? $_GET[$nom] : '';
}
