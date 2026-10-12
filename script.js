// Comme htmlspecialchars() en PHP : un texte reçu de l'API ne doit jamais être lu comme du HTML.
function echapper(texte) {
  return String(texte)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const url = 'https://dog.ceo/api/breeds/image/random/12';

// ── Références DOM ──────────────────────────────────────────────
const vueGalerie       = document.getElementById('vue-galerie');
const vueDetail        = document.getElementById('vue-detail');
const galerie          = document.getElementById('galerie');
const btnRecharger     = document.getElementById('btn-recharger');
const btnRetour        = document.getElementById('btn-retour');
const detailImage      = document.getElementById('detail-image');
const detailTitreDesk  = document.getElementById('detail-titre-desktop');
const detailTitreMob   = document.getElementById('detail-titre-mobile');

// ── Extraction du nom de race depuis l'URL ──────────────────────
function nomRace(imageUrl) {
  const segment = imageUrl.split('/')[4] || 'Chien';
  return segment
    .split('-')
    .reverse()
    .map(mot => mot.charAt(0).toUpperCase() + mot.slice(1))
    .join(' ');
}

// ── Affichage de la vue détail ──────────────────────────────────
function ouvrirDetail(imageUrl, race) {
  detailImage.src        = imageUrl;
  detailImage.alt        = `Photo de ${race}`;
  detailTitreDesk.textContent = race;
  detailTitreMob.textContent  = race;

  vueGalerie.classList.add('hidden');
  vueDetail.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fermerDetail() {
  vueDetail.classList.add('hidden');
  vueGalerie.classList.remove('hidden');
}

// ── Chargement des chiens ───────────────────────────────────────
async function chargerChiens() {
  galerie.innerHTML = ''; // vider avant rechargement

  const reponse = await fetch(url);
  const donnees = await reponse.json();
  const chiens  = donnees.message;

  for (const image of chiens) {
    const race = nomRace(image);

    // Carte : image plein cadre + titre en overlay haut-gauche
    const article = document.createElement('article');
    article.className = `
      relative rounded-2xl overflow-hidden cursor-pointer
      hover:scale-[1.02] hover:shadow-xl transition-all duration-200
    `.trim();

    article.innerHTML = `
      <img src="${image}"
           alt="Photo de ${echapper(race)}"
           class="block w-full aspect-square object-cover">
      <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent rounded-2xl"></div>
      <span class="absolute top-3 left-3 text-white font-semibold text-sm drop-shadow">${echapper(race)}</span>
    `;

    article.addEventListener('click', () => ouvrirDetail(image, race));
    galerie.appendChild(article);
  }
}

// ── Événements ──────────────────────────────────────────────────
btnRecharger.addEventListener('click', chargerChiens);
btnRetour.addEventListener('click', fermerDetail);

// ── Lancement ───────────────────────────────────────────────────
chargerChiens();
