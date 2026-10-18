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

// URL de l'API (peut être remplacée par 'donnees.json')
const url = 'https://maeli.techniques-graphiques.be/api/api.php';

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

// ── Affichage de la vue détail ──────────────────────────────────
function ouvrirDetail(oeuvre) {
  const titre = oeuvre.titre || 'Sans titre';
  const artiste = oeuvre.artiste ? oeuvre.artiste : 'Artiste inconnu';

  detailImage.src = oeuvre.image || '';
  detailImage.alt = `Photo de ${titre}`;

  if (detailTitreDesk) detailTitreDesk.textContent = titre;
  if (detailTitreMob) detailTitreMob.textContent = titre;
  if (detailArtisteDesk) detailArtisteDesk.textContent = artiste;
  if (detailArtisteMob) detailArtisteMob.textContent = artiste;
  if (detailCategorie) detailCategorie.textContent = oeuvre.categorie || '—';
  if (detailAnnee) detailAnnee.textContent = (oeuvre.annee !== null && oeuvre.annee !== undefined) ? oeuvre.annee : '—';
  if (detailHauteur) detailHauteur.textContent = oeuvre.hauteur_cm ? `${oeuvre.hauteur_cm} cm` : '—';

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

// ── Chargement des œuvres ───────────────────────────────────────
async function chargerOeuvres() {
  galerie.innerHTML = '';

  let donnees;
  try {
    const reponse = await fetch(url);
    if (!reponse.ok) throw new Error(`Erreur HTTP : ${reponse.status}`);
    donnees = await reponse.json();
  } catch (erreurAPI) {
    console.warn("Échec de connexion à l'API distante, bascule sur donnees.json :", erreurAPI);
    try {
      const reponseLocale = await fetch('donnees.json');
      donnees = await reponseLocale.json();
    } catch (erreurLocale) {
      console.error("Erreur lors du chargement des données :", erreurLocale);
      galerie.innerHTML = `<p class="col-span-full text-center text-red-500 py-8">Impossible de charger les données.</p>`;
      return;
    }
  }

  // Supporte la structure de la nouvelle API (donnees.data) ainsi que les listes directes
  const oeuvres = Array.isArray(donnees) ? donnees : (donnees.data || donnees.message || []);

  for (const oeuvre of oeuvres) {
    const titre = oeuvre.titre || 'Sans titre';
    const artiste = oeuvre.artiste || '';
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

  if (compteur) {
    compteur.textContent = oeuvres.length;
  }

  media.add("(prefers-reduced-motion: no-preference)", () => {
    ouverture();
    survol();
  });
}

// ── Événements ──────────────────────────────────────────────────
if (btnRecharger) btnRecharger.addEventListener('click', chargerOeuvres);
if (btnRetour) btnRetour.addEventListener('click', fermerDetail);

if (btnRalenti) {
  btnRalenti.addEventListener('click', () => {
    if (sequence) {
      sequence.timeScale(0.25).restart();
    }
  });
}

// ── Lancement ───────────────────────────────────────────────────
chargerOeuvres();