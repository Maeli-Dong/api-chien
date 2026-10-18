gsap.registerPlugin(SplitText);let sequence;
const media = gsap.matchMedia();
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
const vueGalerie = document.getElementById('vue-galerie');
const vueDetail = document.getElementById('vue-detail');
const galerie = document.getElementById('galerie');
const btnRecharger = document.getElementById('btn-recharger');
const btnRetour = document.getElementById('btn-retour');
const detailImage = document.getElementById('detail-image');
const detailTitreDesk = document.getElementById('detail-titre-desktop');
const detailTitreMob = document.getElementById('detail-titre-mobile');

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
  detailImage.src = imageUrl;
  detailImage.alt = `Photo de ${race}`;
  detailTitreDesk.textContent = race;
  detailTitreMob.textContent = race;

  vueGalerie.classList.add('hidden');
  vueDetail.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fermerDetail() {
  vueDetail.classList.add('hidden');
  vueGalerie.classList.remove('hidden');
}

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
      gsap.fromTo(pastille, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
    });
    uneCarte.addEventListener("mouseleave", () => {
      gsap.to(uneCarte, { y: 0, scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
    });
  });
}
// ── Chargement des chiens ───────────────────────────────────────
async function chargerChiens() {
  galerie.innerHTML = '';
  const reponse = await fetch(url);
  const donnees = await reponse.json();
  const chiens = donnees.message;



  for (const image of chiens) {
    const race = nomRace(image);

    // Carte : image plein cadre + titre en overlay haut-gauche
    const article = document.createElement('article');
    article.className = 'carte';

    article.innerHTML = `
      <img src="${image}"
           alt="Photo de ${echapper(race)}"
           class="block w-full aspect-square object-cover">
      <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent rounded-2xl"></div>
      <span class="absolute top-3 left-3 text-white font-semibold text-sm drop-shadow pastille">${echapper(race)}</span>
    `;

    article.addEventListener('click', () => ouvrirDetail(image, race));
    galerie.appendChild(article);
  }

  document.querySelector("#compteur").textContent = chiens.length;
  media.add("(prefers-reduced-motion: no-preference)", () => {
    ouverture();
    survol();
  });
}


// ── Événements ──────────────────────────────────────────────────
btnRecharger.addEventListener('click', chargerChiens);
btnRetour.addEventListener('click', fermerDetail);

// ── Lancement ───────────────────────────────────────────────────
// Le tween du titre peut rester ici : l'élément existe dès le chargement de la page
//gsap.from(".entete__titre", { y: 40, opacity: 0, duration: 1 });

chargerChiens();

document.querySelector("#ralenti").addEventListener("click", () => {
  if (sequence) {
    sequence.timeScale(0.25).restart();
  }
});