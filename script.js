gsap.registerPlugin(SplitText);
let sequence;
const media = gsap.matchMedia();

// Comme htmlspecialchars() en PHP : un texte reçu de l'API ne doit jamais être lu comme du HTML.
function echapper(texte) {
  if (texte === null || texte === undefined) return '';
  return String(texte)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// ── Configuration des sources de données ─────────────────────────
const sources = {
  json: 'chien.json',
  mysql: 'https://maeli.techniques-graphiques.be/api/api.php',
  sheet: 'https://opensheet.elk.sh/1jAKMJdp4WKDhi8oho2T0213etrJReWqQU7vrMuMs3R0/chiens',
};
const choix = new URLSearchParams(location.search).get('source') || 'mysql';
const urlSource = sources[choix] || sources.mysql;

// ── Normalisation des données Google Sheets ─────────────────────
// La feuille renvoie tout en texte : "4" au lieu de 4, "" au lieu de null.
// Cette fonction corrige chaque élément pour que l'affichage soit identique.
function normaliser(element) {
  const copie = { ...element };
  // Champs numériques : convertir la chaîne en nombre
  for (const champ of ['id', 'age', 'poids', 'annee', 'hauteur_cm']) {
    if (champ in copie) {
      copie[champ] = copie[champ] === '' ? null : Number(copie[champ]);
    }
  }
  // Chaîne vide → null (comme le null de l'API)
  for (const cle of Object.keys(copie)) {
    if (copie[cle] === '') copie[cle] = null;
  }
  return copie;
}

// ── État de la pagination ────────────────────────────────────────
let pageCourante = 1;
const PAR_PAGE = 6; // doit correspondre à $par_page dans api.php

// ── Références DOM ──────────────────────────────────────────────
const vueGalerie = document.getElementById('vue-galerie');
const vueDetail = document.getElementById('vue-detail');
const galerie = document.getElementById('galerie');
const btnRecharger = document.getElementById('btn-recharger');
const btnRetour = document.getElementById('btn-retour');
const detailImage = document.getElementById('detail-image');
const detailTitreDesk = document.getElementById('detail-titre-desktop');
const detailTitreMob = document.getElementById('detail-titre-mobile');
const detailArtisteDesk = document.getElementById('detail-artiste-desktop');
const detailArtisteMob = document.getElementById('detail-artiste-mobile');
const detailCategorie = document.getElementById('detail-categorie');
const detailAnnee = document.getElementById('detail-annee');
const detailHauteur = document.getElementById('detail-hauteur');
const compteur = document.getElementById('compteur');
const btnRalenti = document.getElementById('ralenti');
const paginationZone = document.getElementById('pagination');
const btnPrecedent = document.getElementById('btn-precedent');
const btnSuivant = document.getElementById('btn-suivant');
const infoPage = document.getElementById('info-page');

// ── Affichage de la vue détail ──────────────────────────────────
function ouvrirDetail(oeuvre) {
  const titre = oeuvre.nom || 'Sans titre';
  const artiste = oeuvre.race ? oeuvre.race : 'Race inconnue';

  detailImage.src = oeuvre.image || '';
  detailImage.alt = `Photo de ${titre}`;

  if (detailTitreDesk) detailTitreDesk.textContent = titre;
  if (detailTitreMob) detailTitreMob.textContent = titre;
  if (detailArtisteDesk) detailArtisteDesk.textContent = artiste;
  if (detailArtisteMob) detailArtisteMob.textContent = artiste;
  if (detailCategorie) detailCategorie.textContent = oeuvre.categorie || oeuvre.race || '—';
  if (detailAnnee) detailAnnee.textContent = (oeuvre.age !== null && oeuvre.age !== undefined) ? `${oeuvre.age} an${oeuvre.age > 1 ? 's' : ''}` : ((oeuvre.annee !== null && oeuvre.annee !== undefined) ? oeuvre.annee : '—');
  if (detailHauteur) detailHauteur.textContent = oeuvre.poids ? `${oeuvre.poids} kg` : (oeuvre.hauteur_cm ? `${oeuvre.hauteur_cm} cm` : '—');

  vueGalerie.classList.add('hidden');
  vueDetail.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fermerDetail() {
  vueDetail.classList.add('hidden');
  vueGalerie.classList.remove('hidden');
}

// ── Animations GSAP ─────────────────────────────────────────────
function ouverture() {
  const titre = SplitText.create(".entete__titre", { type: "chars, words" });
  sequence = gsap.timeline({ defaults: { duration: 0.8, ease: "power2.out" } });
  sequence
    .from(titre.chars, { y: 40, opacity: 0, duration: 0.6, stagger: 0.03, ease: "back.out(1.7)" })
    .from(".entete__texte", { opacity: 0, y: 20 }, "-=0.3")
    .from("#compteur", { textContent: 0, snap: { textContent: 1 }, duration: 1.2 }, "<")
    .from(".carte", { opacity: 0, y: 60, stagger: { each: 0.06, from: "center", grid: "auto" } }, "-=0.8");
}

function survol() {
  document.querySelectorAll(".carte").forEach((uneCarte) => {
    const pastille = uneCarte.querySelector(".pastille");
    uneCarte.addEventListener("mouseenter", () => {
      gsap.to(uneCarte, { y: -6, scale: 1.02, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      if (pastille) {
        gsap.fromTo(pastille, { scale: 0.95 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
      }
    });
    uneCarte.addEventListener("mouseleave", () => {
      gsap.to(uneCarte, { y: 0, scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
    });
  });
}

// ── Chargement des chiens (avec pagination) ─────────────────────
async function chargerOeuvres(page) {
  page = page || pageCourante;
  pageCourante = page;
  galerie.innerHTML = '';

  let oeuvres = [];
  let totalPages = 1;
  let totalChiens = 0;

  try {
    // Pour MySQL : l'API gère la pagination côté serveur avec ?page=N
    const url = choix === 'mysql' ? `${urlSource}?page=${page}` : urlSource;
    const reponse = await fetch(url);
    if (!reponse.ok) throw new Error(`Erreur HTTP : ${reponse.status}`);
    const donnees = await reponse.json();

    if (Array.isArray(donnees)) {
      // Google Sheets : tableau plat, on pagine côté JS
      const tout = donnees.map(normaliser);
      totalChiens = tout.length;
      totalPages = Math.ceil(totalChiens / PAR_PAGE);
      oeuvres = tout.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);
    } else {
      // MySQL / JSON : objet avec pagination et data
      const tout = donnees.data || [];
      if (donnees.pagination) {
        // MySQL : pagination serveur
        oeuvres = tout;
        totalPages = donnees.pagination.pages || 1;
        totalChiens = donnees.pagination.total || tout.length;
      } else {
        // JSON local : on pagine côté JS
        totalChiens = tout.length;
        totalPages = Math.ceil(totalChiens / PAR_PAGE);
        oeuvres = tout.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);
      }
    }
  } catch (erreur) {
    console.warn(`Erreur lors du chargement depuis "${choix}", bascule de secours sur chien.json :`, erreur);
    try {
      const reponseLocale = await fetch('chien.json');
      const donneesLocales = await reponseLocale.json();
      const tout = donneesLocales.data || [];
      totalChiens = tout.length;
      totalPages = Math.ceil(totalChiens / PAR_PAGE);
      oeuvres = tout.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);
    } catch (erreurLocale) {
      console.error('Erreur lors du chargement des données :', erreurLocale);
      galerie.innerHTML = `<p class="col-span-full text-center text-red-500 py-8">Impossible de charger les données.</p>`;
      return;
    }
  }

  for (const oeuvre of oeuvres) {
    const titre = oeuvre.nom || oeuvre.titre || 'Sans nom';
    const artiste = oeuvre.race || oeuvre.artiste || '';
    const image = oeuvre.image || '';

    // Carte : image plein cadre + titre et artiste en overlay haut-gauche
    const article = document.createElement('article');
    article.className = 'carte';

    article.innerHTML = `
      <img src="${image}"
           alt="${echapper(titre)}"
           class="block w-full aspect-square object-cover">
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
      <div class="absolute top-3 left-3 right-3 text-white drop-shadow pastille pointer-events-none">
        <span class="block font-semibold text-sm leading-tight">${echapper(titre)}</span>
        ${artiste ? `<span class="block text-xs text-white/80 mt-0.5">${echapper(artiste)}</span>` : ''}
      </div>
    `;

    article.addEventListener('click', () => ouvrirDetail(oeuvre));
    galerie.appendChild(article);
  }

  // Mise à jour du compteur et des boutons de pagination
  if (compteur) compteur.textContent = totalChiens;

  if (paginationZone) {
    // Masquer la pagination si tout tient sur une page
    paginationZone.style.display = totalPages <= 1 ? 'none' : 'flex';
    if (btnPrecedent) btnPrecedent.disabled = (page <= 1);
    if (btnSuivant)   btnSuivant.disabled   = (page >= totalPages);
    if (infoPage)     infoPage.textContent   = `Page ${page} / ${totalPages}`;
  }

  media.add("(prefers-reduced-motion: no-preference)", () => {
    ouverture();
    survol();
  });
}

// ── Événements ──────────────────────────────────────────────────
if (btnRecharger) btnRecharger.addEventListener('click', () => chargerOeuvres(1));
if (btnRetour)    btnRetour.addEventListener('click', fermerDetail);
if (btnPrecedent) btnPrecedent.addEventListener('click', () => chargerOeuvres(pageCourante - 1));
if (btnSuivant)   btnSuivant.addEventListener('click',   () => chargerOeuvres(pageCourante + 1));

if (btnRalenti) {
  btnRalenti.addEventListener('click', () => {
    if (sequence) {
      sequence.timeScale(0.25).restart();
    }
  });
}

// ── Lancement ───────────────────────────────────────────────────
chargerOeuvres(1);