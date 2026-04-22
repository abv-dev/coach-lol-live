# Candor

> Coach factuel temps réel pour League of Legends. Zéro IA, zéro invention, tu gardes ton cerveau.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Release](https://img.shields.io/github/v/release/abv-dev/candor)](https://github.com/abv-dev/candor/releases/latest)
[![CI](https://github.com/abv-dev/candor/actions/workflows/ci.yml/badge.svg)](https://github.com/abv-dev/candor/actions)
[![Sponsor](https://img.shields.io/badge/♥-Sponsor-ec4899?logo=github-sponsors)](https://github.com/sponsors/abv-dev)

**Site** : [candorlol.vercel.app](https://candorlol.vercel.app) · **Téléchargement** Windows x64

## Principe

Candor lit l'**API Live Client Data officielle de Riot** (port local 2999) et affiche **les faits**. Rien n'est inventé, rien n'est extrapolé par un modèle. Pas de reco de build, pas de tier list, pas de "tu devrais push". Juste les chiffres, pour que tu décides.

- Items value calculée depuis `items_db.json` officiel Riot (patch 16.7.1)
- Objectifs (Drake, Baron, Herald, Grubs) timés avec les events du Live Client
- Comparaison par lane basée sur la position déclarée par Riot
- Soul prédite via `mapTerrain`, pas via hypothèse

## Features

### Dashboard
- Scoreboard broadcast 5v5 avec flèches gold par lane + team
- Stacks drake (0-4) et tours détruites par team
- PlayerGuide centré sur le joueur actif et son direct opposant (stats, HP/mana, items, next item probable, summoner spells)
- Live feed des events récents (kills, objectifs, tours)
- Écran fin de partie avec résumé

### Overlay micro
- Fenêtre transparente always-on-top (~300×240), always-on-top, non intrusive
- 5-6 infos clés : temps, HP%, gold, écart items team, objectif prio, alertes critiques
- S'affiche automatiquement dès qu'une partie Live est détectée
- Texte noir + halo blanc haut-contraste pour lisibilité sur n'importe quel fond LoL

### Audio
- Rappels vocaux FR/EN (TTS natif) pour Drake, Baron, Herald, Grubs
- "X dans 30 secondes" et "X disponible" à chaque spawn
- Rappel de despawn 1 min avant (Grubs à 13:00, Herald à 19:00)
- Prédiction de soul après 2 drakes killed
- Annonce "L'équipe X a tué [objectif]" avec type du drake si applicable
- Annonce de soul secured au 4ème drake d'une team
- Toggle par objectif + volume dans les settings

### Auto-update
Signature minisign, dialog natif au lancement. Pas de réinstallation manuelle, jamais.

## Installation

Télécharge le `.msi` depuis [candorlol.vercel.app](https://candorlol.vercel.app) ou [Releases](https://github.com/abv-dev/candor/releases/latest). Double-clique, installe, lance. Candor tourne à côté du client League — aucune modification du client de jeu.

**Windows 10/11 x64 requis.** Jouer en **fullscreen borderless** pour que l'overlay s'affiche (Windows bloque les overlays sur le fullscreen exclusif).

## Dev

```bash
npm install
npm run dev        # web-only, mode démo actif depuis la home
```

### Build Windows natif

Prérequis : Rust, Visual Studio Build Tools (C++ desktop), WebView2, Node.js 20 LTS.

```bash
npm run tauri:dev   # dev avec hot-reload + LoL
npm run tauri:build # .msi prod dans src-tauri/target/release/bundle/msi/
```

### Release

Bump `package.json` + `src-tauri/tauri.conf.json` + `CHANGELOG.md`, commit, tag `vX.Y.Z`, push. GitHub Actions build le MSI Windows signé et publie la release auto.

## Stack

- **Frontend** React 19 + Vite + TypeScript
- **Backend** Tauri 2 (Rust) — 2 fenêtres (main + overlay transparent)
- **Data** Live Client Data API (port 2999, pas de clé) + Data Dragon CDN
- **Tests** Vitest, 54 tests sur la logique pure

## Limites

- Pas de CD ennemi, pas de ward tracking, pas de wave state — l'API Live Client ne fournit pas ces infos
- Summoner's Rift uniquement (map 11)
- Windows uniquement (Tauri supporte macOS/Linux, mais LoL non)
- Fullscreen exclusif bloqué par Windows pour tout overlay

## Support

Si Candor te rend service, tu peux contribuer :

- ⭐ [Star le repo](https://github.com/abv-dev/candor) — ça aide pour la découverte
- 💖 [Sponsor via GitHub](https://github.com/sponsors/abv-dev) — ça finance le temps de maintenance
- 🐛 [Signaler un bug](https://github.com/abv-dev/candor/issues)
- 💬 Feedback sur r/leagueoflegends avec `#candor`

## License

MIT — voir [LICENSE](LICENSE). Projet indépendant, non affilié à Riot Games. League of Legends et assets associés sont propriété de Riot Games, Inc.
