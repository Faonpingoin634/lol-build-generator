# 🏆 LoL Build Generator

Un générateur de builds aléatoires pour **League of Legends**, propulsé par les données officielles de Riot Games via l'API Data Dragon.

![Version](https://img.shields.io/badge/Patch-Dernier-gold)
![JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E)
![Architecture](https://img.shields.io/badge/Architecture-MVC-blue)
![CSS](https://img.shields.io/badge/CSS-Tailwind-38bdf8)
![Vercel](https://img.shields.io/badge/Déploiement-Vercel-black)

## 🎯 À propos du projet

Ce projet a été conçu pour offrir aux joueurs de LoL un moyen fun et imprévisible de choisir leur prochain champion et équipement. Que ce soit pour un défi entre amis ou pour casser la routine, ce générateur propose un build complet (Champion, Sorts, Runes, Objets) à chaque clic.

## 🚀 Technologies utilisées

- **HTML5 :** Structure sémantique (`<section>`, `<figure>`, `<figcaption>`).
- **Tailwind CSS (v3 via CDN Play) :** Intégralité du style via classes utilitaires, palette de couleurs personnalisée (`lol-gold`, `lol-card`, etc.). Le CSS custom résiduel se limite à 25 lignes (tooltip dynamique + balises spéciales Data Dragon).
- **JavaScript (ES6+) :** Fetch API, `async/await`, modules ES6, POO avec héritage, manipulation dynamique du DOM.
- **Riot Data Dragon :** API REST officielle de Riot Games pour des données toujours à jour.
- **html2canvas (v1.4.1) :** Librairie JS chargée via CDN pour capturer et télécharger le build en image PNG.
- **LocalStorage :** Persistance de l'historique des 5 derniers builds entre les sessions.

## ⚙️ Installation & Lancement

Ce projet est un site statique sans dépendances NPM. Il utilise les modules ES6 natifs du navigateur, ce qui nécessite un **serveur HTTP local** (les modules ne fonctionnent pas en `file://`).

### Option 1 — Extension VS Code (recommandé)

1. Installer l'extension **Live Server** dans VS Code.
2. Ouvrir le dossier du projet dans VS Code.
3. Clic droit sur `index.html` → **Open with Live Server**.

### Option 2 — Python

```bash
python -m http.server 8080
```
Puis ouvrir `http://localhost:8080` dans le navigateur.

### Option 3 — Node.js

```bash
npx serve .
```

## ✨ Fonctionnalités

### Générateur Classique (`/`)
- Build complet : champion, sorts d'invocateur, runes et objets.
- **Sélecteur de rôle** : Top, Jungle, Mid, ADC, Support ou Aléatoire — Châtiment forcé en Jungle, nombre d'objets ajusté pour l'ADC et le Support.
- **Filtre par type de champion** : Fighter, Tank, Mage, Assassin, Marksman, Support.
- **Tooltips** au survol : nom, prix et description de chaque icône.
- **Export image** : téléchargement du build en PNG via html2canvas.

### Générateur ARAM (`/aram/`)
- Page dédiée à l'Abîme Hurlant — sorts et objets filtrés sur la map ARAM (carte `"12"`).
- Filtre par type de champion disponible.
- Partage le même historique que le générateur Classique.

### Historique des builds
- Les **5 derniers builds** sont sauvegardés automatiquement dans le `localStorage`.
- Chaque carte affiche le champion et son rôle.
- **Cliquable** : déplie l'inventaire avec image, nom et prix de chaque objet.
- Navigation clavier supportée (`Enter` / `Space`) avec `aria-expanded`.

## 🏗️ Architecture

L'application suit le patron **MVC** en JavaScript Vanilla Orienté Objet :

```
js/
├── services/
│   └── RiotApiService.js     — Appels API Data Dragon, mise en cache, vérification HTTP
├── models/
│   └── BuildGenerator.js     — Logique de génération, filtrage et data cleaning
├── views/
│   └── BuildView.js          — Rendu DOM, tooltips, historique cliquable
├── controllers/
│   ├── BuildController.js    — Orchestration Classique, sauvegarde historique
│   └── AramController.js     — Hérite de BuildController, surcharge refreshBuild()
├── main.js                   — Point d'entrée Classique
└── main-aram.js              — Point d'entrée ARAM
```

**Héritage POO :** `AramController extends BuildController` — seule la méthode `refreshBuild()` est surchargée, tout le reste (démarrage, partage, historique) est hérité.

## 🛡️ Data Cleaning

La base de données Riot contient de nombreux "items fantômes". Pour garantir un build valide :

- **Filtrage par map** : `map["11"]` (Classique) ou `map["12"]` (ARAM).
- **Blacklist par ID** pour supprimer les doublons connus.
- **Anti-doublons par nom** dans l'inventaire généré.
- **Gestion des bottes** : une seule paire par build en mode Classique.
- **Vérification `response.ok`** sur chaque appel fetch avant de parser le JSON.
