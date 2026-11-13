# CVTL Lab — site web

Site vitrine de **CVTL Lab**, studio numérique à Bordeaux / Gironde — <https://cvtllab.fr>.

HTML / CSS / JavaScript natifs, **zéro dépendance**, généré par un petit script Node.
Le dépôt GitHub est la **source de vérité** : tout ce qui est fusionné sur `main` est construit et déployé automatiquement par GitHub Actions (GitHub Pages).

## Démarrer

```bash
npm run dev      # build + serveur local http://localhost:8080 (rebuild auto)
npm run build    # génère dist/
npm run check    # vérifie liens, ancres, balises SEO et conformité CSP
```

Node ≥ 20 requis. Aucun `npm install` nécessaire.

## Structure

| Chemin | Rôle |
|---|---|
| `content/services.json` | Contenu des 6 pages de service (textes, FAQ, listes) |
| `content/legal.json` | Mentions légales et politique de confidentialité |
| `content/home.jsonld.json` | Données structurées de l'organisation (SEO) |
| `scripts/pages.mjs`, `templates.mjs` | Gabarits HTML (accueil, services, zone, légal…) |
| `scripts/build.mjs` | Build → `dist/` (+ sitemap daté automatiquement) |
| `src/css/main.css` | Design system (tokens, composants, responsive) |
| `src/js/boot.js` | Script minuscule en `<head>` : décide si l'intro joue (aucun flash) |
| `src/js/intro.js` | **Intro cinématique** du logo vectoriel (Web Animations API) |
| `src/js/fx.js` | Révélations, texte découpé, compteurs, spotlight, magnétisme, parallaxe |
| `src/js/ui.js` | Menu mobile, FAQ animée, formulaire, préchargement des pages |
| `public/` | Fichiers copiés tels quels (favicons, logo, `robots.txt`, `CNAME`, image de partage) |

Modifier un texte de service = éditer `content/services.json`. Modifier l'accueil = `scripts/pages.mjs`.

## Le logo

`public/logo.svg` est un vrai vecteur (3 faces + puce bleue `#0018FC`, viewBox `390×500`).
Il est injecté en SVG inline (`logo()` dans `templates.mjs`) : chaque forme est animable individuellement (tracé, assemblage, onde de choc, effet « éclaté » au survol du hero).

## Intro

- Joue **une fois par session** sur l'accueil (`sessionStorage`), jamais avec une ancre dans l'URL (`/#contact`) ni avec `prefers-reduced-motion`.
- Passable : bouton, `Entrée`, `Espace`, `Échap` ou clic.
- Forcer l'intro pour la démo : `https://cvtllab.fr/?intro=1`.

## Déploiement (GitHub Pages)

1. **Settings → Pages → Build and deployment → Source : GitHub Actions**.
2. Fusionner sur `main` → le workflow `.github/workflows/deploy.yml` construit, vérifie, publie.
3. **Settings → Pages → Custom domain : `cvtllab.fr`** (le fichier `public/CNAME` est déjà fourni) puis cocher *Enforce HTTPS*.
4. DNS (Cloudflare reste utilisable comme gestionnaire DNS uniquement) :
   - 4 enregistrements `A` sur `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` `www` → `<utilisateur>.github.io`
   - mettre ces enregistrements en **DNS only** (nuage gris) pendant la validation du certificat.
5. Une fois le site servi par GitHub, le Worker `cvtllab` de Cloudflare peut être supprimé.

## Sécurité

CSP stricte par `<meta>` : `script-src 'self'`, `style-src 'self'` (donc **aucun script ni `style=""` inline** — `npm run check` le vérifie), envoi du formulaire limité à FormSubmit.
