# Galerie de Chiens — api-chien

Application web de galerie qui affiche des chiens depuis trois sources de données différentes.

---

## Devoir NT 10

### Adresses des sources

| Source | Adresse |
|--------|---------|
| **API MySQL (en ligne)** | `https://maeli.techniques-graphiques.be/api/api.php` |
| **Feuille Google Sheets** | `https://opensheet.elk.sh/1jAKMJdp4WKDhi8oho2T0213etrJReWqQU7vrMuMs3R0/chiens` |

---

### Cinq commandes curl sur l''API en ligne

#### 1. La liste (page 1, 6 chiens par page)

```
curl -i https://maeli.techniques-graphiques.be/api/api.php
```

Réponse :
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Access-Control-Allow-Origin: *

{
    pagination: { total: 12, par_page: 6, page: 1, pages: 2, suivante: 2 },
    data: [
        { id: 1, nom: Rex, race: Labrador, categorie: retriever, age: 3, poids: 30, image: https://images.dog.ceo/breeds/labrador/lab_young.jpg, surnom: Le Gourmand },
        { id: 2, nom: Nala, race: Labrador, categorie: retriever, age: 5, poids: 27.5, image: https://images.dog.ceo/breeds/labrador/n02099712_7664.jpg, surnom: null },
        ...
    ]
}
```

---

#### 2. Un seul élément (?id=4)

```
curl -i https://maeli.techniques-graphiques.be/api/api.php?id=4
```

Réponse :
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Access-Control-Allow-Origin: *

{
    data: {
        id: 4, nom: Fifi, race: Caniche, categorie: toy,
        age: 8, poids: 5, image: https://images.dog.ceo/breeds/poodle-standard/n02113799_4458.jpg,
        surnom: La Diva
    }
}
```

---

#### 3. Erreur 400 — id invalide (?id=abc)

```
curl -i https://maeli.techniques-graphiques.be/api/api.php?id=abc
```

Réponse :
```
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Access-Control-Allow-Origin: *

{ erreur: id doit être un nombre entier }
```

---

#### 4. Erreur 404 — id inexistant (?id=999)

```
curl -i https://maeli.techniques-graphiques.be/api/api.php?id=999
```

Réponse :
```
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Access-Control-Allow-Origin: *

{ erreur: Aucun chien avec cet id }
```

---

#### 5. Filtre par catégorie (?categorie=retriever)

```
curl -i https://maeli.techniques-graphiques.be/api/api.php?categorie=retriever
```

Réponse :
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Access-Control-Allow-Origin: *

{
    pagination: { total: 3, par_page: 6, page: 1, pages: 1, suivante: null },
    data: [
        { id: 1, nom: Rex, race: Labrador, categorie: retriever, age: 3, poids: 30, image: https://images.dog.ceo/breeds/labrador/lab_young.jpg, surnom: Le Gourmand },
        { id: 2, nom: Nala, race: Labrador, categorie: retriever, age: 5, poids: 27.5, image: https://images.dog.ceo/breeds/labrador/n02099712_7664.jpg, surnom: null },
        { id: 3, nom: Oscar, race: Labrador, categorie: retriever, age: 1, poids: 24, image: https://images.dog.ceo/breeds/labrador/n02099712_2863.jpg, surnom: Le Chiot fou }
    ]
}
```

---

### Access-Control-Allow-Origin — explication

`Access-Control-Allow-Origin` est un en-tête HTTP que le serveur envoie pour indiquer au navigateur quels sites ont le droit de lire la réponse. Sans lui, le navigateur bloquerait toute réponse venant d''un domaine différent du site qui fait la requête ; c''est la règle de sécurité appelée « Same-Origin Policy ».

Dans notre API nous avons mis `*` (toutes les origines autorisées) plutôt qu''une seule adresse, parce que le projet s''ouvre à la fois depuis Live Server en local (`http://127.0.0.1:5500`) et depuis le serveur en ligne, et que ces deux origines changent selon la machine. Si on n''avait qu''un seul site de production fixe, il vaudrait mieux mettre uniquement son adresse (par exemple `https://maeli.techniques-graphiques.be`) afin que personne d''autre ne puisse consommer l''API sans permission.

---

### Tableau comparatif des trois sources

| Critère | JSON (chien.json) | MySQL (api.php) | Google Sheets |
|---------|-------------------|-----------------|---------------|
| **Qui peut modifier les données ?** | Le développeur seulement, en éditant le fichier et en redéployant | L''administrateur via phpMyAdmin, ou via l''API si des routes d''écriture sont ajoutées | Toute personne ayant le lien de partage en édition |
| **Peut-on filtrer ?** | Non — JavaScript charge tout et filtre côté client | Oui — l''API accepte `?categorie=` et renvoie uniquement les lignes correspondantes côté serveur | Non — opensheet renvoie toujours toute la feuille |
| **Les types sont-ils respectés ?** | Oui — le JSON contient des nombres et des null corrects | Oui — PHP convertit chaque colonne avec (int) ou (float) avant de répondre | Non — tout arrive en texte (4 au lieu de 4, " au lieu de null) ; JavaScript doit normaliser |

---

## Structure du projet

```
api-chien/
├── index.html ← page principale
├── script.js ← logique JS + gestion des 3 sources
├── chien.json ← source 1 : fichier JSON local
├── base.sql ← script SQL pour créer et remplir la table
├── css/
│ └── style.css
└── api/
 ├── api.php ← API REST (liste, id, filtre, pagination)
 ├── connexion.php ← connexion PDO
 ├── identifiants.php ← identifiants MySQL (ne pas mettre sur GitHub)
 └── htaccess.txt ← règles de réécriture Apache
```

## Utilisation

| Paramètre URL | Source affichée |
|--------------|-----------------|
| `?source=json` | Fichier chien.json |
| `?source=mysql` | API PHP + MySQL en ligne |
| `?source=sheet` | Feuille Google Sheets |
| *(aucun paramètre)* | MySQL par défaut |
