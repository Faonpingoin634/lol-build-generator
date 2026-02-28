# 🏆 LoL Build Generator

Un générateur de builds aléatoires pour **League of Legends**, propulsé par les données officielles de Riot Games via l'API Data Dragon.

![Version](https://img.shields.io/badge/Patch-Dernier-gold)
![JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E)
![Architecture](https://img.shields.io/badge/Architecture-MVC-blue)
![Vercel](https://img.shields.io/badge/Déploiement-Vercel-black)

## 🎯 À propos du projet

Ce projet a été conçu pour offrir aux joueurs de LoL un moyen fun et imprévisible de choisir leur prochain champion et équipement. Que ce soit pour un défi entre amis ou pour casser la routine, ce générateur propose un build complet (Champion, Sorts, Runes, Objets) à chaque clic.

## 🛠️ Le défi technique : Data Cleaning & Algorithmique

Le principal défi de ce projet a été la manipulation de l'API **Data Dragon**. La base de données de Riot contient de nombreux "items fantômes" (anciens objets, doublons, objets de modes spéciaux comme Arena ou Essaim).

Pour offrir une expérience fluide, j'ai mis en place :

- **Filtrage Strict :** Seuls les objets achetables sur la Faille de l'Invocateur sont affichés.
- **Blacklist Dynamique :** Un système d'exclusion par ID pour supprimer les doublons (ex: Bouclier de roche en fusion, Épée du divin).
- **Anti-Doublons par Nom :** Un algorithme qui garantit qu'aucun objet n'apparaît deux fois dans l'inventaire, même sous un ID différent.
- **Gestion des Bottes :** Un système qui assure la présence d'une seule paire de bottes par build.

## ⚙️ Architecture & Performances

L'application a été entièrement développée en **JavaScript Vanilla Orienté Objet (POO)** en respectant le patron de conception **MVC (Modèle-Vue-Contrôleur)** :

- **Mise en cache API :** Les données ne sont téléchargées qu'une seule fois au chargement de la page, rendant la génération des builds instantanée.
- **Séparation des préoccupations :** La logique métier, la manipulation du DOM et les requêtes réseau sont strictement isolées.
- **Scores Lighthouse :** 95+ en Performance, 100 en SEO, et 90+ en Accessibilité.

## 🚀 Technologies utilisées

- **HTML5 / CSS3 :** Design responsive avec Flexbox et optimisation SEO.
- **JavaScript (ES6+) :** Fetch API, programmation asynchrone (async/await), et manipulation dynamique du DOM.
- **Riot Data Dragon :** Consommation de l'API officielle pour des données toujours à jour.

## 📸 Aperçu

Le site est entièrement **responsive** et propose une interface sombre inspirée du client officiel du jeu. Il inclut un système de **tooltips** pour afficher les détails des objets (statistiques, prix, descriptions) au survol.
