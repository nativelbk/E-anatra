import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = async (pwd: string) => bcrypt.hash(pwd, 10);

  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Administrateur',
      password: await hash('admin1234'),
      role: 'ADMIN',
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'prof@demo.com' },
    update: {},
    create: {
      email: 'prof@demo.com',
      name: 'Mr. Rakoto Jean',
      password: await hash('prof1234'),
      role: 'TEACHER',
      level: 'MIDDLE',
    },
  });

  await prisma.user.upsert({
    where: { email: 'eleve@demo.com' },
    update: {},
    create: {
      email: 'eleve@demo.com',
      name: 'Aicha Randrianarivelo',
      password: await hash('demo1234'),
      role: 'STUDENT',
      level: 'HIGH',
      points: 120,
    },
  });

  await prisma.course.deleteMany({ where: { authorId: teacher.id } });

const coursesData = [
  // ─────────────────────────────────────────────
  // MATH - PRIMARY
  // ─────────────────────────────────────────────
  {
    title: "Les nombres entiers et la numération",
    description: "Comprendre les nombres entiers, la valeur positionnelle et les opérations de base.",
    subject: 'MATH' as const,
    level: 'PRIMARY' as const,
    content: `# 🔢 Les nombres entiers et la numération

## 📌 Qu'est-ce qu'un nombre entier ?

Un **nombre entier** est un nombre sans virgule : 0, 1, 2, 3, 4, 5…

> 💡 **À retenir :** Les nombres entiers servent à **compter** et à **classer**.

---

## 📊 La valeur positionnelle

Chaque chiffre d'un nombre a une **valeur** selon sa position.

| Milliers | Centaines | Dizaines | Unités |
|:--------:|:---------:|:--------:|:------:|
|    3     |     4     |    7     |   2    |

✏️ Le nombre **3 472** se lit : *trois mille quatre cent soixante-douze*

> ➡️ Le **3** vaut 3 000, le **4** vaut 400, le **7** vaut 70, le **2** vaut 2.

---

## ➕➖✖️➗ Les opérations de base

### Addition
\`\`\`
  25
+ 13
────
  38
\`\`\`

### Soustraction
\`\`\`
  50
- 17
────
  33
\`\`\`

### Multiplication
\`\`\`
6 × 7 = 42
\`\`\`

### Division
\`\`\`
48 ÷ 6 = 8
\`\`\`

---

## ✅ Ce qu'il faut retenir

- Un nombre entier n'a **pas de virgule**.
- La **position** d'un chiffre détermine sa valeur (unités, dizaines, centaines…).
- Les 4 opérations de base : **+  −  ×  ÷**
`,
  },

  {
    title: "Les fractions et les nombres décimaux",
    description: "Comprendre les fractions simples et leur représentation décimale.",
    subject: 'MATH' as const,
    level: 'PRIMARY' as const,
    content: `# 🍕 Les fractions et les nombres décimaux

## 📌 Qu'est-ce qu'une fraction ?

Une **fraction** représente une **partie d'un tout**.

> **Exemple :** ¾ signifie *3 parties sur 4*.

\`\`\`
  3  ← numérateur  (nombre de parts prises)
 ───
  4  ← dénominateur (nombre total de parts)
\`\`\`

---

## 🔄 Passage fraction → décimal

| Fraction | Décimal |
|:--------:|:-------:|
|   1/2    |   0,5   |
|   1/4    |  0,25   |
|   3/4    |  0,75   |
|   1/5    |   0,2   |
|   1/10   |   0,1   |

> 💡 **Astuce :** Pour convertir, **divise le numérateur par le dénominateur**.
> Exemple : 3 ÷ 4 = **0,75**

---

## ➕✖️ Opérations sur les fractions

### Addition avec le même dénominateur
\`\`\`
2/5 + 1/5 = 3/5   ← on additionne seulement les numérateurs
\`\`\`

### Addition avec des dénominateurs différents
\`\`\`
1/3 + 1/4 = 4/12 + 3/12 = 7/12
            ↑ on réduit au même dénominateur (12)
\`\`\`

### Multiplication
\`\`\`
2/3 × 3/5 = (2×3)/(3×5) = 6/15 = 2/5
\`\`\`

---

## ✅ Ce qu'il faut retenir

- Une fraction = une **division** en parts égales.
- Pour additionner des fractions, il faut le **même dénominateur**.
- Pour multiplier : on multiplie **numérateur × numérateur** et **dénominateur × dénominateur**.
`,
  },

  // ─────────────────────────────────────────────
  // MATH - MIDDLE
  // ─────────────────────────────────────────────
  {
    title: "Proportionnalité et pourcentages",
    description: "Maîtriser les tableaux de proportionnalité et le calcul de pourcentages.",
    subject: 'MATH' as const,
    level: 'MIDDLE' as const,
    content: `# 📐 Proportionnalité et pourcentages

## 📌 Définition

Deux grandeurs sont **proportionnelles** si leur rapport est **constant** (toujours égal).

---

## 📊 Tableau de proportionnalité

| Quantité (kg) |  2  |  5  |  8  |
|:-------------:|:---:|:---:|:---:|
|  Prix (€)     |  6  | 15  | 24  |

🔑 **Coefficient de proportionnalité :** 6 ÷ 2 = 15 ÷ 5 = 24 ÷ 8 = **3**

> Pour trouver le prix, on **multiplie la quantité par 3**.

---

## 💯 Calculer un pourcentage

### Formule
\`\`\`
Valeur = Total × (Taux ÷ 100)
\`\`\`

### Exemples
| Opération | Calcul | Résultat |
|---|---|---|
| 20 % de 150 | 150 × 0,20 | **30** |
| Augmentation de 15 % | × 1,15 | + 15 % |
| Réduction de 10 % | × 0,90 | − 10 % |

> 💡 **Astuce :** une augmentation de 15 % → multiplier par **1,15** ; une réduction de 10 % → multiplier par **0,90**.

---

## 📏 La règle de trois

> *Si 4 cahiers coûtent 12 €, combien coûtent 7 cahiers ?*

\`\`\`
4 cahiers → 12 €
7 cahiers → ?

7 × 12 ÷ 4 = 21 €
\`\`\`

---

## ✅ Ce qu'il faut retenir

- Proportionnel = rapport **constant** entre deux grandeurs.
- Pourcentage : penser en **coefficient multiplicateur** (× 1,15 ; × 0,90…).
- Règle de trois : **produit en croix**.
`,
  },

  // ─────────────────────────────────────────────
  // MATH - HIGH
  // ─────────────────────────────────────────────
  {
    title: "Introduction aux équations du second degré",
    description: "Apprendre à résoudre les équations ax² + bx + c = 0 avec le discriminant.",
    subject: 'MATH' as const,
    level: 'HIGH' as const,
    content: `# 📈 Équations du second degré

## 📌 Forme générale

> **ax² + bx + c = 0**  avec  a ≠ 0

---

## 🔑 Le discriminant (Δ)

\`\`\`
Δ = b² − 4ac
\`\`\`

| Valeur de Δ | Nombre de solutions | Formule |
|:-----------:|:-------------------:|:-------:|
| Δ > 0 | **2 solutions réelles distinctes** | x₁ = (−b + √Δ) / 2a  et  x₂ = (−b − √Δ) / 2a |
| Δ = 0 | **1 solution double** | x = −b / 2a |
| Δ < 0 | **Pas de solution réelle** | — |

---

## 🧮 Exemple résolu

> Résoudre : **2x² − 5x + 3 = 0**

**Étape 1 – Identifier a, b, c**
\`\`\`
a = 2,  b = −5,  c = 3
\`\`\`

**Étape 2 – Calculer Δ**
\`\`\`
Δ = (−5)² − 4 × 2 × 3 = 25 − 24 = 1
\`\`\`
> Δ = 1 > 0 → deux solutions distinctes

**Étape 3 – Calculer les solutions**
\`\`\`
x₁ = (5 + 1) / 4 = 6/4 = 1,5
x₂ = (5 − 1) / 4 = 4/4 = 1
\`\`\`

✅ **Solutions : x₁ = 1,5  et  x₂ = 1**

---

## ✅ Ce qu'il faut retenir

1. Calculer **Δ = b² − 4ac** en premier.
2. Le signe de Δ détermine le **nombre de solutions**.
3. Les solutions s'obtiennent avec **x = (−b ± √Δ) / 2a**.
`,
  },

  {
    title: "Fonctions de référence et transformations",
    description: "Étude des fonctions affines, carrées et trigonométriques et de leurs transformations graphiques.",
    subject: 'MATH' as const,
    level: 'HIGH' as const,
    content: `# 📉 Fonctions de référence et transformations

## 📌 1. Fonction affine : f(x) = ax + b

| Paramètre | Rôle |
|:---------:|:----:|
| **a** | Pente (coefficient directeur) |
| **b** | Ordonnée à l'origine |

> - Si a > 0 : la droite **monte**.
> - Si a < 0 : la droite **descend**.
> - Si a = 0 : droite **horizontale**.

---

## 📌 2. Fonction carré : f(x) = x²

- Courbe en forme de **parabole**.
- Symétrique par rapport à l'**axe des ordonnées (y)**.
- Sommet en **(0 ; 0)**.
- Toujours **positive ou nulle**.

---

## 📌 3. Fonctions trigonométriques

| Fonction | Période | Amplitude | Particularité |
|:--------:|:-------:|:---------:|:-------------:|
| sin(x) | 2π | 1 | sin(0) = 0 |
| cos(x) | 2π | 1 | cos(0) = 1 |
| tan(x) | π | — | Non définie en π/2 + kπ |

---

## 🔄 Transformations graphiques

| Transformation | Effet sur le graphe |
|:---:|:---|
| f(x) **+ k** | Translation **verticale** de k (vers le haut si k > 0) |
| f(x **− h**) | Translation **horizontale** de h (vers la droite si h > 0) |
| **−**f(x) | Réflexion par rapport à l'axe **Ox** |
| **k·**f(x) | Dilatation/contraction **verticale** |

---

## ✅ Ce qu'il faut retenir

- Fonction affine → **droite** ; Fonction carré → **parabole**.
- Les transformations **ne changent pas la forme** de la courbe, seulement sa position.
- sin et cos ont une période de **2π** et varient entre **−1 et 1**.
`,
  },

  // ─────────────────────────────────────────────
  // MATH - UNIVERSITY
  // ─────────────────────────────────────────────
  {
    title: "Analyse réelle : limites et continuité",
    description: "Introduction formelle aux limites, continuité et théorèmes fondamentaux de l'analyse.",
    subject: 'MATH' as const,
    level: 'UNIVERSITY' as const,
    content: `# ∞ Analyse réelle : limites et continuité

## 📌 Limite d'une fonction

> **lim(x → a) f(x) = L**

Signifie que f(x) s'approche arbitrairement de **L** lorsque x tend vers **a**.

### Limites remarquables
\`\`\`
lim(x → 0)  sin(x)/x = 1
lim(x → ∞)  (1 + 1/x)^x = e
\`\`\`

---

## 📌 Continuité

f est **continue en a** si :
1. f(a) est défini.
2. lim(x → a) f(x) existe.
3. lim(x → a) f(x) = f(a).

### Théorème des valeurs intermédiaires (TVI)

> Si f est continue sur [a ; b] et f(a) < 0 < f(b),
> alors ∃ c ∈ ]a ; b[ tel que **f(c) = 0**.

---

## 📌 Dérivabilité

f est **dérivable en a** si la limite suivante existe :

\`\`\`
f'(a) = lim(h → 0)  [f(a+h) − f(a)] / h
\`\`\`

---

## 📋 Règles de dérivation

| f(x)    | f'(x)       |
|:-------:|:-----------:|
| xⁿ      | n·xⁿ⁻¹     |
| eˣ      | eˣ          |
| ln(x)   | 1/x         |
| sin(x)  | cos(x)      |
| cos(x)  | −sin(x)     |
| u·v     | u'v + uv'   |
| u/v     | (u'v − uv') / v² |

---

## ✅ Ce qu'il faut retenir

- La **limite** décrit le comportement de f **au voisinage** d'un point.
- La **continuité** est une condition nécessaire mais pas suffisante à la dérivabilité.
- La **dérivée** donne le **taux de variation instantané** de f.
`,
  },

  // ─────────────────────────────────────────────
  // SCIENCE - PRIMARY
  // ─────────────────────────────────────────────
  {
    title: "Les états de la matière",
    description: "Découvrir les trois états de la matière et les changements d'état.",
    subject: 'SCIENCE' as const,
    level: 'PRIMARY' as const,
    content: `# 🧊💧☁️ Les états de la matière

## 📌 Les trois états

| État | Forme | Volume | Exemple |
|:----:|:-----:|:------:|:-------:|
| **Solide** | Propre | Propre | Glaçon 🧊 |
| **Liquide** | Celle du récipient | Propre | Eau 💧 |
| **Gaz** | Aucune | Aucun | Vapeur ☁️ |

> 💡 **Astuce :** *Solide = rigide, Liquide = coule, Gaz = s'échappe*

---

## 🔄 Les changements d'état

\`\`\`
         Fusion (0°C)
  SOLIDE ──────────────→ LIQUIDE
  SOLIDE ←────────────── LIQUIDE
       Solidification

         Vaporisation (100°C)
  LIQUIDE ─────────────→ GAZ
  LIQUIDE ←───────────── GAZ
          Liquéfaction

         Sublimation
  SOLIDE ──────────────→ GAZ
\`\`\`

| Passage | Nom | Température (eau) |
|:-------:|:---:|:-----------------:|
| Solide → Liquide | **Fusion** | 0 °C |
| Liquide → Solide | **Solidification** | 0 °C |
| Liquide → Gaz | **Vaporisation** | 100 °C |
| Gaz → Liquide | **Liquéfaction** | 100 °C |
| Solide → Gaz | **Sublimation** | variable |

---

## ✅ Ce qu'il faut retenir

- La matière existe en **3 états** : solide, liquide, gaz.
- Le passage d'un état à l'autre s'appelle un **changement d'état**.
- L'eau **fond à 0 °C** et **bout à 100 °C** (pression normale).
`,
  },

  // ─────────────────────────────────────────────
  // SCIENCE - MIDDLE
  // ─────────────────────────────────────────────
  {
    title: "La cellule : unité du vivant",
    description: "Découvrez la structure et les fonctions de la cellule eucaryote.",
    subject: 'SCIENCE' as const,
    level: 'MIDDLE' as const,
    content: `# 🔬 La cellule : unité du vivant

## 📌 Définition

> La **cellule** est l'unité fondamentale de tout être vivant.
> Chaque organisme est composé d'une ou plusieurs cellules.

---

## 🏗️ Structure d'une cellule eucaryote

| Organite | Rôle |
|:--------:|:----:|
| **Membrane plasmique** | Enveloppe semi-perméable ; régule les échanges |
| **Cytoplasme** | Milieu intérieur gélatineux ; lieu des réactions |
| **Noyau** | Contient l'ADN ; centre de contrôle |
| **Mitochondries** | Produisent l'énergie (ATP) |
| **Réticulum endoplasmique** | Synthèse et transport des protéines |
| **Appareil de Golgi** | Tri, modification et expédition des protéines |
| **Ribosomes** | Fabrication des protéines |

---

## ⚖️ Cellule animale vs Cellule végétale

| Élément | Animale | Végétale |
|:-------:|:-------:|:--------:|
| Membrane | ✅ | ✅ |
| Noyau | ✅ | ✅ |
| Mitochondries | ✅ | ✅ |
| **Paroi cellulosique** | ❌ | ✅ |
| **Chloroplastes** | ❌ | ✅ |
| **Grande vacuole** | ❌ | ✅ |

> 💡 **Chloroplastes** = site de la photosynthèse (fabrication de sucres grâce à la lumière).

---

## ✅ Ce qu'il faut retenir

- La cellule = **brique de base** du vivant.
- Le **noyau** contrôle la cellule grâce à l'**ADN**.
- La cellule végétale se distingue par : **paroi + chloroplastes + vacuole**.
`,
  },

  // ─────────────────────────────────────────────
  // SCIENCE - HIGH
  // ─────────────────────────────────────────────
  {
    title: "La génétique et l'hérédité",
    description: "Comprendre l'ADN, les gènes, les allèles et les lois de Mendel.",
    subject: 'SCIENCE' as const,
    level: 'HIGH' as const,
    content: `# 🧬 Génétique et hérédité

## 📌 L'ADN

> L'**ADN** (acide désoxyribonucléique) est le **support de l'information génétique**.
> Il est organisé en **chromosomes** dans le noyau.

- Chez l'être humain : **46 chromosomes** (23 paires).
- L'ADN est une **double hélice** composée de 4 bases : A, T, G, C.

---

## 🔑 Vocabulaire essentiel

| Terme | Définition |
|:-----:|:----------:|
| **Gène** | Portion d'ADN codant pour un caractère (ex. couleur des yeux) |
| **Allèle** | Version différente d'un même gène |
| **Génotype** | Composition allélique d'un individu (ex. Aa) |
| **Phénotype** | Caractère observable (ex. yeux marrons) |
| **Dominant** | Allèle qui s'exprime même à l'état hétérozygote |
| **Récessif** | Allèle qui ne s'exprime qu'à l'état homozygote |

---

## 📜 Les lois de Mendel

### 1ère loi — Uniformité des hybrides F1
> Tous les hybrides de première génération (F1) issus de parents purs sont **identiques**.

### 2ème loi — Ségrégation des allèles
> Les allèles se **séparent** lors de la formation des gamètes.

---

## 🔬 Croisement test

> **Aa × aa**

| Gamètes | a | a |
|:-------:|:-:|:-:|
| **A** | Aa | Aa |
| **a** | aa | aa |

**Résultats :** 1/2 Aa (phénotype dominant) + 1/2 aa (phénotype récessif)

---

## ✅ Ce qu'il faut retenir

- L'ADN est organisé en **gènes**, eux-mêmes organisés en **chromosomes**.
- **Génotype** (ce qu'on a) ≠ **Phénotype** (ce qu'on voit).
- Les lois de Mendel prédisent la **transmission des caractères héréditaires**.
`,
  },

  // ─────────────────────────────────────────────
  // SCIENCE - UNIVERSITY
  // ─────────────────────────────────────────────
  {
    title: "Thermodynamique : chaleur et travail",
    description: "Premier et second principe de la thermodynamique, enthalpie, entropie.",
    subject: 'SCIENCE' as const,
    level: 'UNIVERSITY' as const,
    content: `# 🌡️ Thermodynamique : chaleur et travail

## 📌 Concepts fondamentaux

| Symbole | Grandeur | Signification |
|:-------:|:--------:|:-------------:|
| U | Énergie interne | Énergie totale du système |
| Q | Chaleur | Énergie échangée par transfert thermique |
| W | Travail | Énergie échangée par travail mécanique |
| H | Enthalpie | H = U + PV |
| S | Entropie | Mesure du désordre |
| G | Énergie de Gibbs | G = H − TS |

---

## ⚡ 1er Principe — Conservation de l'énergie

\`\`\`
ΔU = Q + W
\`\`\`

> L'énergie ne se crée pas et ne se détruit pas, elle se **transforme**.

---

## 🔥 Enthalpie

\`\`\`
H = U + PV
ΔH = Qp  (chaleur échangée à pression constante)
\`\`\`

> **Réaction exothermique :** ΔH < 0 (dégage de la chaleur)
> **Réaction endothermique :** ΔH > 0 (absorbe de la chaleur)

---

## 🌀 2ème Principe — Entropie

\`\`\`
ΔS ≥ 0  (pour un système isolé)
\`\`\`

> L'entropie d'un système isolé ne peut qu'**augmenter** ou rester constante.
> *(Le désordre tend à croître spontanément.)*

---

## ⚖️ Enthalpie libre de Gibbs

\`\`\`
G = H − T·S
\`\`\`

| ΔG | Spontanéité |
|:--:|:-----------:|
| ΔG < 0 | Réaction **spontanée** ✅ |
| ΔG = 0 | Système à l'**équilibre** ⚖️ |
| ΔG > 0 | Réaction **non spontanée** ❌ |

---

## ✅ Ce qu'il faut retenir

- **1er principe :** ΔU = Q + W → énergie **conservée**.
- **2ème principe :** ΔS ≥ 0 → le désordre **augmente spontanément**.
- **ΔG < 0** → la réaction est spontanée.
`,
  },

  // ─────────────────────────────────────────────
  // COMPUTER SCIENCE - PRIMARY
  // ─────────────────────────────────────────────
  {
    title: "Introduction à Scratch : mes premiers programmes",
    description: "Créer ses premiers programmes animés avec Scratch en apprenant les blocs de base.",
    subject: 'COMPUTER_SCIENCE' as const,
    level: 'PRIMARY' as const,
    content: `# 🐱 Scratch : mes premiers programmes

## 📌 Qu'est-ce que Scratch ?

**Scratch** est un langage de programmation **visuel** : on code en assemblant des **blocs colorés** comme des pièces de puzzle.

> 🌐 Disponible sur : [scratch.mit.edu](https://scratch.mit.edu)

---

## 🧩 Les catégories de blocs essentiels

| Catégorie | Couleur | Exemples |
|:---------:|:-------:|:--------:|
| **Mouvement** | Bleu | Avancer de 10 pas, Tourner de 15° |
| **Apparence** | Violet | Dire "Bonjour !", Changer de costume |
| **Son** | Rose | Jouer un son |
| **Contrôle** | Jaune | Répéter 10 fois, Si… alors… |
| **Événements** | Orange | Quand le drapeau vert est cliqué |
| **Capteurs** | Cyan | Toucher le bord ? |

---

## 💻 Mon premier projet : faire bouger un sprite

\`\`\`
Quand [drapeau vert] est cliqué
  Répéter sans fin
    Avancer de (10) pas
    Si le bord est atteint, rebondir
  Fin Répéter
\`\`\`

---

## 🌈 Idée de projet : chat multicolore

\`\`\`
Quand [drapeau vert] est cliqué
  Répéter sans fin
    Avancer de (10) pas
    Si le bord est atteint, rebondir
    Ajouter (25) à l'effet Couleur
  Fin Répéter
\`\`\`

---

## 🏆 Défis à relever

1. ✅ Fais bouger le sprite de droite à gauche.
2. ✅ Fais dire "Bonjour !" au sprite quand on clique dessus.
3. ⭐ Crée un labyrinthe avec plusieurs sprites.

---

## ✅ Ce qu'il faut retenir

- Scratch = programmer avec des **blocs** sans écrire de texte.
- Un programme commence toujours par un **événement** (ex. drapeau vert).
- **Répéter** permet de créer des **boucles** (actions qui se répètent).
`,
  },

  // ─────────────────────────────────────────────
  // COMPUTER SCIENCE - MIDDLE
  // ─────────────────────────────────────────────
  {
    title: "Développement web : HTML, CSS et JavaScript",
    description: "Créer des pages web interactives en maîtrisant les trois technologies fondamentales du web.",
    subject: 'COMPUTER_SCIENCE' as const,
    level: 'MIDDLE' as const,
    content: `# 🌐 Développement web : HTML, CSS et JavaScript

## 📌 Les 3 langages du web

| Langage | Rôle | Analogie |
|:-------:|:----:|:--------:|
| **HTML** | Structure | Le squelette |
| **CSS** | Style | La peau / les vêtements |
| **JavaScript** | Comportement | Les muscles / le cerveau |

---

## 🏗️ HTML — La structure

\`\`\`html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>Ma page</title>
  </head>
  <body>
    <h1>Bonjour le monde !</h1>
    <p>Mon premier paragraphe.</p>
    <a href="https://example.com">Un lien</a>
  </body>
</html>
\`\`\`

### Balises essentielles

| Balise | Rôle |
|:------:|:----:|
| \`<h1>\` … \`<h6>\` | Titres |
| \`<p>\` | Paragraphe |
| \`<a href="">\` | Lien |
| \`<img src="">\` | Image |
| \`<ul>\` / \`<li>\` | Liste |
| \`<div>\` | Conteneur générique |

---

## 🎨 CSS — Le style

\`\`\`css
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

h1 {
  color: #333;
  text-align: center;
  font-size: 2rem;
}

p {
  line-height: 1.6;
  color: #555;
}
\`\`\`

---

## ⚡ JavaScript — Le comportement

\`\`\`javascript
// Sélectionner un élément
const titre = document.querySelector('h1');

// Réagir à un clic
titre.addEventListener('click', () => {
  alert('Tu as cliqué sur le titre !');
  titre.style.color = 'red';
});
\`\`\`

---

## ✅ Ce qu'il faut retenir

- **HTML** = structure, **CSS** = style, **JS** = interactivité.
- Un fichier HTML s'ouvre avec n'importe quel navigateur.
- CSS utilise des **sélecteurs** pour cibler les éléments HTML.
- JavaScript manipule le **DOM** (Document Object Model) pour modifier la page.
`,
  },

  // ─────────────────────────────────────────────
  // COMPUTER SCIENCE - HIGH
  // ─────────────────────────────────────────────
  {
    title: "Algorithmique et structures de données",
    description: "Introduction aux algorithmes fondamentaux : tri, recherche, complexité.",
    subject: 'COMPUTER_SCIENCE' as const,
    level: 'HIGH' as const,
    content: `# 🧠 Algorithmique et structures de données

## 📌 Qu'est-ce qu'un algorithme ?

> Un **algorithme** est une suite finie et ordonnée d'instructions pour résoudre un problème.

---

## 🔢 Complexité algorithmique (notation Big O)

| Notation | Nom | Exemple |
|:--------:|:---:|:-------:|
| O(1) | Constante | Accès à un tableau par index |
| O(log n) | Logarithmique | Recherche dichotomique |
| O(n) | Linéaire | Parcours d'une liste |
| O(n²) | Quadratique | Tri à bulles |
| O(2ⁿ) | Exponentielle | Problème du sac à dos |

---

## 📦 Tri à bulles — O(n²)

\`\`\`python
def tri_bulles(liste):
    n = len(liste)
    for i in range(n):
        for j in range(0, n - i - 1):
            if liste[j] > liste[j + 1]:
                # Échange
                liste[j], liste[j + 1] = liste[j + 1], liste[j]
    return liste

# Exemple
print(tri_bulles([5, 3, 8, 1, 2]))
# → [1, 2, 3, 5, 8]
\`\`\`

> ⚠️ Peu efficace pour les grandes listes (complexité **O(n²)**).

---

## 🔍 Recherche dichotomique — O(log n)

> Fonctionne uniquement sur une **liste triée**.

\`\`\`python
def recherche_dicho(liste, cible):
    gauche, droite = 0, len(liste) - 1

    while gauche <= droite:
        milieu = (gauche + droite) // 2

        if liste[milieu] == cible:
            return milieu          # ✅ Trouvé !
        elif liste[milieu] < cible:
            gauche = milieu + 1    # Chercher à droite
        else:
            droite = milieu - 1    # Chercher à gauche

    return -1  # ❌ Non trouvé
\`\`\`

---

## 🗂️ Structures de données courantes

| Structure | Utilité |
|:---------:|:-------:|
| **Liste** | Séquence ordonnée d'éléments |
| **Pile (Stack)** | LIFO — dernier entré, premier sorti |
| **File (Queue)** | FIFO — premier entré, premier sorti |
| **Dictionnaire** | Paires clé → valeur |

---

## ✅ Ce qu'il faut retenir

- La **complexité** mesure l'efficacité d'un algorithme en fonction de la taille de l'entrée.
- Le **tri à bulles** est simple mais lent : **O(n²)**.
- La **recherche dichotomique** est très rapide : **O(log n)** — mais nécessite une liste triée.
`,
  },

  // ─────────────────────────────────────────────
  // COMPUTER SCIENCE - UNIVERSITY
  // ─────────────────────────────────────────────
  {
    title: "Systèmes d'exploitation et réseaux",
    description: "Comprendre le fonctionnement des OS, la gestion des processus et les protocoles réseaux.",
    subject: 'COMPUTER_SCIENCE' as const,
    level: 'UNIVERSITY' as const,
    content: `# 🖥️ Systèmes d'exploitation et réseaux

## 📌 Rôle du système d'exploitation (SE)

> Le SE est l'**intermédiaire** entre le matériel et les applications.
> Il gère : les processus, la mémoire, les fichiers et les périphériques.

---

## ⚙️ Gestion des processus

### États d'un processus
\`\`\`
   [Nouveau]
      ↓
   [Prêt] ←──────────────┐
      ↓                  |
   [En cours] ──────→ [Bloqué]
      ↓
   [Terminé]
\`\`\`

### Algorithmes d'ordonnancement

| Algorithme | Principe |
|:----------:|:--------:|
| **FIFO** | Premier arrivé, premier servi |
| **Round-Robin** | Chaque processus reçoit un quantum de temps |
| **Priorité** | Le processus de plus haute priorité s'exécute d'abord |

> ⚠️ **Interblocage (deadlock) :** situation où des processus s'attendent mutuellement indéfiniment (conditions de Coffman).

---

## 🗄️ Mémoire virtuelle

> Chaque processus dispose d'un **espace d'adressage virtuel**.
> La **pagination** traduit les adresses virtuelles en adresses physiques via la **table des pages**.

\`\`\`
Adresse virtuelle → [MMU] → Adresse physique en RAM
\`\`\`

---

## 🌐 Modèle OSI (7 couches)

| # | Couche | Protocoles |
|:-:|:------:|:----------:|
| 7 | **Application** | HTTP, FTP, DNS, SMTP |
| 6 | Présentation | SSL/TLS, JPEG |
| 5 | Session | NetBIOS |
| 4 | **Transport** | TCP, UDP |
| 3 | **Réseau** | IP, ICMP |
| 2 | Liaison | Ethernet, WiFi |
| 1 | Physique | Câbles, ondes |

---

## 🔄 TCP vs UDP

| Critère | TCP | UDP |
|:-------:|:---:|:---:|
| Connexion | Orienté connexion | Sans connexion |
| Fiabilité | ✅ Garantie | ❌ Non garantie |
| Vitesse | Plus lent | Plus rapide |
| Usage | HTTP, e-mail, FTP | Streaming, jeux, DNS |

---

## ✅ Ce qu'il faut retenir

- Le SE gère les **processus**, la **mémoire** et les **fichiers**.
- Le modèle OSI comporte **7 couches** ; les plus importantes : Application, Transport, Réseau.
- **TCP** = fiable mais lent ; **UDP** = rapide mais sans garantie.
`,
  },

  // ─────────────────────────────────────────────
  // FRENCH - PRIMARY
  // ─────────────────────────────────────────────
  {
    title: "Lire et écrire : les syllabes et les sons",
    description: "Maîtriser la correspondance graphème-phonème et former des syllabes simples.",
    subject: 'FRENCH' as const,
    level: 'PRIMARY' as const,
    content: `# 🔤 Les syllabes et les sons

## 📌 Les voyelles et les consonnes

### Voyelles (6)
> **a  e  i  o  u  y**

### Consonnes (20)
> b  c  d  f  g  h  j  k  l  m  n  p  q  r  s  t  v  w  x  z

---

## 🧩 Former des syllabes

> Une syllabe = une **consonne** + une **voyelle** (CV) — ou une voyelle seule.

| Consonne | …a | …e | …i | …o | …u |
|:--------:|:--:|:--:|:--:|:--:|:--:|
| **b** | ba | be | bi | bo | bu |
| **l** | la | le | li | lo | lu |
| **m** | ma | me | mi | mo | mu |
| **r** | ra | re | ri | ro | ru |

---

## 🎵 Sons complexes (graphèmes)

| Graphème | Son | Exemples |
|:--------:|:---:|:--------:|
| **ou** | [u] | loup, chou, roue |
| **on** | [õ] | maison, ballon |
| **an / en** | [ã] | dent, banc, enfant |
| **in / ain** | [ẽ] | pain, lapin, fin |
| **ch** | [ʃ] | chat, chocolat |
| **ou** | [u] | bouche, genou |

---

## ✏️ Exercice : lis ces mots à voix haute

\`\`\`
la-pin  |  ma-ma-n  |  pe-tit  |  ba-teau  |  so-leil
\`\`\`

---

## ✅ Ce qu'il faut retenir

- Les **voyelles** (a, e, i, o, u, y) sont au cœur de chaque syllabe.
- On forme une syllabe en combinant **consonne + voyelle**.
- Certains sons s'écrivent avec **deux lettres** (graphèmes complexes) : ou, on, an, in…
`,
  },

  // ─────────────────────────────────────────────
  // FRENCH - MIDDLE
  // ─────────────────────────────────────────────
  {
    title: "Grammaire : accord du verbe avec le sujet",
    description: "Comprendre et appliquer les règles d'accord du verbe avec son sujet.",
    subject: 'FRENCH' as const,
    level: 'MIDDLE' as const,
    content: `# ✍️ Accord du verbe avec le sujet

## 📌 Règle générale

> Le verbe s'accorde en **personne** (1ère, 2ème, 3ème) et en **nombre** (singulier/pluriel) avec son **sujet**.

---

## 📋 Conjugaison du présent : verbe « être »

| Pronom | Conjugaison |
|:------:|:-----------:|
| Je | **suis** |
| Tu | **es** |
| Il / Elle / On | **est** |
| Nous | **sommes** |
| Vous | **êtes** |
| Ils / Elles | **sont** |

---

## ⚠️ Cas particuliers

### 1. Plusieurs sujets coordonnés → pluriel
> Paul et Marie **sont** là.

### 2. Sujet collectif → accord avec le nom noyau
> Une foule de gens **criait** / **criaient**.
> *(Les deux sont acceptés selon le sens voulu.)*

### 3. Sujet inversé → trouver le vrai sujet
> Viennent ensuite **les résultats**.
> *(Sujet = "les résultats" → verbe au pluriel)*

### 4. Pronom relatif « qui » → accord avec l'antécédent
> C'est toi **qui as** raison.
> *(antécédent = "toi" → 2ème personne)*

---

## 🔎 Comment trouver le sujet ?

\`\`\`
Poser la question : "Qui est-ce qui + verbe ?"
Exemple : "Les élèves chantent."
→ Qui est-ce qui chante ? → Les élèves → sujet = les élèves (3ème personne du pluriel)
\`\`\`

---

## ✅ Ce qu'il faut retenir

- Toujours **identifier le sujet** avant d'accorder le verbe.
- Plusieurs sujets → verbe au **pluriel**.
- Méthode : "Qui est-ce qui + verbe ?"
`,
  },

  // ─────────────────────────────────────────────
  // FRENCH - HIGH
  // ─────────────────────────────────────────────
  {
    title: "Dissertation littéraire : méthode et plan",
    description: "Apprendre à construire une dissertation en trois parties avec arguments et exemples.",
    subject: 'FRENCH' as const,
    level: 'HIGH' as const,
    content: `# 📝 La dissertation littéraire

## 📌 Structure générale

\`\`\`
┌─────────────────────────────────────────────┐
│  INTRODUCTION                               │
│  • Accroche                                 │
│  • Présentation du sujet / contextualisation│
│  • Problématique                            │
│  • Annonce du plan                          │
├─────────────────────────────────────────────┤
│  DÉVELOPPEMENT  (3 parties)                 │
│  I.  Thèse (+ 2 ou 3 sous-parties)          │
│  II. Antithèse (+ 2 ou 3 sous-parties)      │
│  III. Synthèse (+ 2 ou 3 sous-parties)      │
├─────────────────────────────────────────────┤
│  CONCLUSION                                 │
│  • Synthèse des idées                       │
│  • Réponse à la problématique               │
│  • Ouverture                                │
└─────────────────────────────────────────────┘
\`\`\`

---

## 🧱 Construire un argument — Méthode T.A.E.C.

| Étape | Contenu |
|:-----:|:-------:|
| **T**hèse | L'idée principale que vous défendez |
| **A**rgument | La raison qui soutient la thèse |
| **E**xemple | Un texte ou œuvre qui illustre l'argument |
| **C**ommentaire | Ce que l'exemple prouve |

### Exemple rédigé
> Le romantisme exalte les sentiments personnels **(T)**.
> En effet, les poètes romantiques mettent en scène leur moi intime **(A)**.
> Ainsi, dans *Les Nuits* de Musset, le poète dialogue avec sa Muse **(E)**.
> Ce dispositif crée un effet de sincérité bouleversante **(C)**.

---

## 🔗 Connecteurs logiques indispensables

| Fonction | Connecteurs |
|:--------:|:-----------:|
| **Addition** | de plus, en outre, par ailleurs |
| **Opposition** | cependant, néanmoins, en revanche, or |
| **Illustration** | ainsi, par exemple, c'est le cas de |
| **Conséquence** | donc, ainsi, c'est pourquoi, dès lors |
| **Concession** | certes, il est vrai que, bien que |

---

## ✅ Ce qu'il faut retenir

- Une dissertation = **thèse + antithèse + synthèse**.
- Chaque argument suit la structure **T.A.E.C.**
- L'introduction doit toujours contenir une **problématique**.
- Utiliser des **connecteurs logiques** pour assurer la cohérence du propos.
`,
  },

  // ─────────────────────────────────────────────
  // FRENCH - UNIVERSITY
  // ─────────────────────────────────────────────
  {
    title: "Stylistique : figures de style et effets littéraires",
    description: "Identifier et analyser les principales figures de style dans les textes littéraires.",
    subject: 'FRENCH' as const,
    level: 'UNIVERSITY' as const,
    content: `# 🎭 Figures de style et effets littéraires

## 📌 Figures d'analogie

### Comparaison
> Rapproche deux réalités à l'aide d'un **outil comparatif** (comme, tel, ainsi que…).
> **Ex. :** *Il est fort **comme** un lion.*

### Métaphore
> Assimilation **sans outil comparatif** ; l'un est présenté comme l'autre.
> **Ex. :** *La vie est un long fleuve tranquille.*

### Personnification
> Attribue des **qualités humaines** à un inanimé ou un animal.
> **Ex. :** *La forêt murmure ses secrets.*

---

## 📌 Figures d'insistance

### Anaphore
> Répétition d'un même mot ou groupe en **début de phrase ou de vers**.
> **Ex. :** *Rome, l'unique objet de mon ressentiment ! Rome… à qui ton bras vient d'immoler ma sœur !*

### Hyperbole
> Exagération volontaire pour **amplifier** une idée ou un sentiment.
> **Ex. :** *Je t'ai dit mille fois de ranger ta chambre !*

### Gradation
> Énumération dont les termes sont classés par **ordre croissant ou décroissant d'intensité**.
> **Ex. :** *Un souffle, une ombre, un rien, tout lui donnait la fièvre.*

---

## 📌 Figures d'opposition

### Antithèse
> Oppose deux idées dans une même phrase pour les mettre en contraste.
> **Ex. :** *L'homme est à la fois grand et misérable.*

### Oxymore
> Alliance de deux termes **contradictoires** dans un même groupe.
> **Ex. :** *Cette obscure clarté qui tombe des étoiles.*

### Chiasme
> Structure croisée : A – B – B – A.
> **Ex. :** *Il faut manger pour vivre et non vivre pour manger.*

---

## 📊 Tableau récapitulatif

| Figure | Famille | Effet produit |
|:------:|:-------:|:-------------:|
| Comparaison | Analogie | Illustrer, clarifier |
| Métaphore | Analogie | Poétiser, suggérer |
| Anaphore | Insistance | Rythme, emphase |
| Hyperbole | Insistance | Dramatiser, exagérer |
| Antithèse | Opposition | Contraster, nuancer |
| Oxymore | Opposition | Créer la surprise, le paradoxe |

---

## ✅ Ce qu'il faut retenir

- Toujours **nommer** la figure, **citer** un exemple du texte, et **analyser son effet**.
- La **métaphore** = comparaison sans outil comparatif.
- L'**oxymore** = deux mots contradictoires accolés dans le même groupe nominal.
`,
  },

  // ─────────────────────────────────────────────
  // ENGLISH - PRIMARY
  // ─────────────────────────────────────────────
  {
    title: "English Basics: Alphabet and Simple Words",
    description: "Learn the English alphabet, basic greetings, numbers and common classroom words.",
    subject: 'ENGLISH' as const,
    level: 'PRIMARY' as const,
    content: `# 🇬🇧 English Basics: Alphabet and Simple Words

## 📌 The Alphabet (26 letters)

\`\`\`
A B C D E F G H I J K L M
N O P Q R S T U V W X Y Z
\`\`\`

> 🎵 **Tip:** Sing the Alphabet Song to remember the order!

---

## 👋 Greetings

| English | French |
|:-------:|:------:|
| Hello! | Bonjour ! |
| Good morning | Bonjour (matin) |
| Good afternoon | Bonjour (après-midi) |
| Good evening | Bonsoir |
| Goodbye / Bye! | Au revoir |
| How are you? | Comment vas-tu ? |
| I am fine, thank you! | Je vais bien, merci ! |
| My name is… | Je m'appelle… |

---

## 🔢 Numbers 1 to 20

| 1–10 | 11–20 |
|:----:|:-----:|
| one, two, three | eleven, twelve, thirteen |
| four, five, six | fourteen, fifteen, sixteen |
| seven, eight, nine | seventeen, eighteen, nineteen |
| ten | twenty |

---

## 🎒 Classroom Words

| Object | French |
|:------:|:------:|
| pen | stylo |
| pencil | crayon |
| book | livre |
| bag | sac |
| chair | chaise |
| table / desk | table / bureau |
| board | tableau |
| teacher | professeur |
| student | élève |

---

## ✅ What to remember

- The English alphabet has **26 letters**.
- Always say **"Hello"** or **"Good morning"** to greet someone.
- Numbers in English follow a pattern after 12 (thirteen, fourteen… **-teen** = + 10).
`,
  },

  // ─────────────────────────────────────────────
  // ENGLISH - MIDDLE
  // ─────────────────────────────────────────────
  {
    title: "English Grammar: Present Simple and Present Continuous",
    description: "Master the two most common tenses in English with rules, examples and exercises.",
    subject: 'ENGLISH' as const,
    level: 'MIDDLE' as const,
    content: `# ⏱️ Present Simple vs Present Continuous

## 📌 Quick Comparison

| | Present Simple | Present Continuous |
|:-:|:--------------:|:------------------:|
| **Usage** | Habits, facts, routines | Actions happening **right now** |
| **Structure** | Subject + verb (+ s) | Subject + am/is/are + verb**-ing** |
| **Example** | She **reads** every night. | She **is reading** right now. |

---

## 📘 Present Simple

### Form

| Subject | Verb (to work) |
|:-------:|:--------------:|
| I / You / We / They | work |
| He / She / It | work**s** |

> ⚠️ Add **-s** or **-es** for He / She / It!

### Negative
\`\`\`
I / You / We / They  do not (don't) + verb
He / She / It        does not (doesn't) + verb
\`\`\`

### Question
\`\`\`
Do you play football?
Does she like coffee?
\`\`\`

---

## 📗 Present Continuous

### Form
\`\`\`
Subject + am / is / are + verb-ing
\`\`\`

| Subject | Example |
|:-------:|:-------:|
| I | I **am studying**. |
| He / She / It | She **is watching** TV. |
| We / You / They | They **are playing** outside. |

### Spelling rules for -ing
| Rule | Example |
|:----:|:-------:|
| Most verbs | work → work**ing** |
| Verb ending in -e | write → writ**ing** |
| Short verb (CVC) | run → run**ning** |

---

## 🕐 Key Time Expressions

| Present Simple | Present Continuous |
|:--------------:|:------------------:|
| always, usually, often | **now**, at the moment |
| sometimes, never | currently, today, this week |
| every day / week | Look! Listen! |

---

## ✅ What to remember

- Present Simple → **habits and facts** (always, every day…).
- Present Continuous → **actions in progress now** (now, at the moment…).
- He/She/It + Present Simple → don't forget the **-s**!
`,
  },

  // ─────────────────────────────────────────────
  // ENGLISH - HIGH
  // ─────────────────────────────────────────────
  {
    title: "English Writing: Essays and Argumentative Texts",
    description: "Learn how to structure an argumentative essay, use formal language and develop ideas.",
    subject: 'ENGLISH' as const,
    level: 'HIGH' as const,
    content: `# ✍️ Writing Argumentative Essays

## 📌 Essay Structure

\`\`\`
┌──────────────────────────────────────────────────┐
│  INTRODUCTION                                    │
│  • Hook (surprising fact, question, quote)       │
│  • Background information                        │
│  • Thesis statement (your position)              │
├──────────────────────────────────────────────────┤
│  BODY PARAGRAPH (×2 or 3)                        │
│  • Topic sentence (main idea of the paragraph)   │
│  • Evidence / Example                            │
│  • Analysis / Explanation                        │
│  • Link back to thesis                           │
├──────────────────────────────────────────────────┤
│  CONCLUSION                                      │
│  • Restate thesis (different words)              │
│  • Summarise main points                         │
│  • Final thought / Call to action                │
└──────────────────────────────────────────────────┘
\`\`\`

---

## 🎯 Writing a Thesis Statement

| | Example |
|:-:|:-------:|
| ❌ **Weak** | Social media is popular. |
| ✅ **Strong** | Although social media connects people worldwide, it significantly reduces face-to-face interaction and contributes to declining mental health, especially among teenagers. |

> A strong thesis: **states your position + gives reasons**.

---

## 🔗 Linking Words

| Function | Connectors |
|:--------:|:----------:|
| **Addition** | Furthermore, In addition, Moreover, What is more |
| **Contrast** | However, Nevertheless, On the other hand, Yet |
| **Cause** | Because, Since, Due to, As a result of |
| **Effect** | Therefore, As a result, Consequently, Thus |
| **Concession** | Although, Even though, Despite, In spite of |

---

## 🎩 Formal vs Informal Language

| Informal | Formal |
|:--------:|:------:|
| kids | children |
| a lot of | a significant number of |
| I think | It can be argued that |
| bad | detrimental / harmful |
| good | beneficial / advantageous |
| but | however / nevertheless |

---

## ✅ What to remember

- Every paragraph = **one main idea** (topic sentence).
- A thesis statement = **position + reasons**.
- Academic essays use **formal vocabulary** and **linking words**.
- Always **cite evidence** and **analyse** it — don't just list facts.
`,
  },

  // ─────────────────────────────────────────────
  // ENGLISH - UNIVERSITY
  // ─────────────────────────────────────────────
  {
    title: "Academic English: Research Writing and Citation",
    description: "Write academic papers, cite sources correctly in APA or MLA and avoid plagiarism.",
    subject: 'ENGLISH' as const,
    level: 'UNIVERSITY' as const,
    content: `# 🎓 Academic English: Research Writing and Citation

## 📌 Research Paper Structure

| Section | Content | Length (approx.) |
|:-------:|:-------:|:----------------:|
| **Abstract** | Summary of the entire paper | 150–250 words |
| **Introduction** | Context, research gap, objectives | ~10% |
| **Literature Review** | Synthesis of existing research | ~20% |
| **Methodology** | How the research was conducted | ~15% |
| **Results** | What was found (data, findings) | ~15% |
| **Discussion** | Interpretation, implications, limits | ~25% |
| **Conclusion** | Summary, recommendations | ~10% |
| **References** | All cited sources | — |

---

## 📚 APA 7th Edition Citation

### In-text citation
\`\`\`
(Author, Year)          → narrative: Author (Year)
(Smith, 2020)           → (Smith, 2020, p. 45) for direct quotes
(Smith & Jones, 2020)   → two authors
(Smith et al., 2020)    → 3+ authors
\`\`\`

### Reference list format
\`\`\`
Book:
Smith, J. A. (2020). The impact of technology on education. Academic Press.

Journal article:
Brown, L., & Lee, M. (2021). Digital literacy in higher education.
Journal of Education, 15(3), 112–130. https://doi.org/xxxxx

Website:
World Health Organization. (2023, January 10). Mental health facts.
https://www.who.int/example
\`\`\`

---

## ⚠️ Avoiding Plagiarism

| Technique | Definition | Requires citation? |
|:---------:|:----------:|:-----------------:|
| **Direct quote** | Exact words in quotation marks | ✅ Yes |
| **Paraphrase** | Idea rewritten in your own words | ✅ Yes |
| **Summary** | Condensed version of the main ideas | ✅ Yes |
| **Common knowledge** | Facts known by everyone (e.g. Paris is the capital of France) | ❌ No |

---

## 🌫️ Hedging Language

> Use hedging to express **appropriate academic caution**.

| Too strong | Hedged version |
|:----------:|:--------------:|
| This proves that… | This suggests that… |
| X causes Y. | X may contribute to Y. |
| All students benefit. | Many students appear to benefit. |

**Common hedging expressions:**
- *It appears that…*
- *The results suggest…*
- *This could indicate…*
- *There is evidence to support…*

---

## ✅ What to remember

- Always cite: **quote, paraphrase and summary** all require attribution.
- APA in-text: **(Author, Year)** — and page number for direct quotes.
- **Hedging** shows academic rigour and intellectual honesty.
- The **abstract** is written last but placed first.
`,
  },

  // ─────────────────────────────────────────────
  // HISTORY - PRIMARY
  // ─────────────────────────────────────────────
  {
    title: "La préhistoire : des premiers hommes aux premières civilisations",
    description: "Découvrir l'évolution humaine, la vie au Paléolithique et la révolution néolithique.",
    subject: 'HISTORY' as const,
    level: 'PRIMARY' as const,
    content: `# 🦴 La Préhistoire

## 📌 Définition

> La **Préhistoire** est la période qui va de l'apparition des premiers humains (**~3 millions d'années**) jusqu'à l'invention de l'**écriture** (~3 000 av. J.-C.).

---

## ⏳ Les grandes périodes

| Période | Dates | Mode de vie |
|:-------:|:-----:|:-----------:|
| **Paléolithique** | −3 M ans → −10 000 | Chasse, cueillette, **nomades** |
| **Néolithique** | −10 000 → −3 000 | Agriculture, élevage, **sédentaires** |
| **Âge des métaux** | −3 000 → −800 | Bronze puis **fer** |

---

## 🦎 L'évolution humaine

\`\`\`
Homo habilis (~−2,5 M ans)
  → premiers outils en pierre (galets taillés)

Homo erectus (~−1,8 M ans)
  → maîtrise du feu
  → se répand hors d'Afrique

Homo sapiens (~−300 000 ans)
  → art rupestre (Lascaux, Chauvet)
  → langage et culture complexe
  → NOUS aujourd'hui
\`\`\`

---

## 🌾 La révolution néolithique (~10 000 av. J.-C.)

> Les humains passent d'une vie de **chasseurs-cueilleurs** à une vie d'**agriculteurs-éleveurs**.

**Changements majeurs :**

| Avant (Paléolithique) | Après (Néolithique) |
|:---------------------:|:-------------------:|
| Nomades | Sédentaires |
| Chasse et cueillette | Agriculture et élevage |
| Abris provisoires | Villages permanents |
| Outils en pierre | + Poterie et tissage |

**Animaux domestiqués :** chien 🐕, mouton 🐑, chèvre 🐐, bœuf 🐄, porc 🐖

---

## ✅ Ce qu'il faut retenir

- La Préhistoire se divise en **Paléolithique**, **Néolithique** et **Âge des métaux**.
- **Homo sapiens** est notre ancêtre direct.
- La **révolution néolithique** = passage à l'agriculture → début des villages et des civilisations.
`,
  },

  // ─────────────────────────────────────────────
  // HISTORY - MIDDLE
  // ─────────────────────────────────────────────
  {
    title: "La Révolution française (1789–1799)",
    description: "Causes, événements majeurs et conséquences de la Révolution française.",
    subject: 'HISTORY' as const,
    level: 'MIDDLE' as const,
    content: `# 🇫🇷 La Révolution française (1789–1799)

## 📌 Contexte

En 1789, la France est une **monarchie absolue** sous Louis XVI. La société est divisée en **3 ordres** très inégaux.

---

## ⚡ Les causes

| Type de crise | Détail |
|:-------------:|:------:|
| **Financière** | La France est endettée (guerres, aide aux États-Unis) |
| **Sociale** | Le Tiers-État (98 % de la population) paie tous les impôts |
| **Intellectuelle** | Les Lumières (Voltaire, Rousseau, Montesquieu) remettent en cause le pouvoir royal |
| **Alimentaire** | Mauvaises récoltes → famine et mécontentement populaire |

---

## 📅 Chronologie des événements clés

| Date | Événement |
|:----:|:---------:|
| Mai 1789 | Réunion des États généraux |
| 20 juin 1789 | Serment du Jeu de Paume |
| **14 juillet 1789** | **Prise de la Bastille** 🏰 |
| 4 août 1789 | Abolition des privilèges |
| 26 août 1789 | Déclaration des droits de l'homme et du citoyen |
| 1792 | Proclamation de la République |
| 1793–1794 | La Terreur (Robespierre, guillotine) |
| 1794 | Chute de Robespierre (Thermidor) |
| **9 nov. 1799** | **Coup d'État de Bonaparte (18 Brumaire)** |

---

## 🌍 Conséquences

- ❌ Fin de la **monarchie absolue** et des privilèges de la noblesse.
- ✅ Naissance de la **République** et des droits civiques.
- 🌐 Diffusion des idéaux de **Liberté, Égalité, Fraternité** dans toute l'Europe.
- ⚔️ Ouverture de l'ère **napoléonienne**.

---

## ✅ Ce qu'il faut retenir

- La Révolution a **3 grandes causes** : crise financière, injustices sociales, idées des Lumières.
- Date clé : **14 juillet 1789** = prise de la Bastille (symbole de la tyrannie).
- Elle aboutit à la fin de la monarchie et à la naissance de la **République française**.
`,
  },

  // ─────────────────────────────────────────────
  // HISTORY - HIGH
  // ─────────────────────────────────────────────
  {
    title: "La Seconde Guerre mondiale (1939–1945)",
    description: "Causes du conflit, grandes batailles, Shoah et bilan humain du conflit mondial.",
    subject: 'HISTORY' as const,
    level: 'HIGH' as const,
    content: `# 🌍 La Seconde Guerre mondiale (1939–1945)

## 📌 Causes du conflit

| Facteur | Explication |
|:-------:|:-----------:|
| **Montée des totalitarismes** | Nazisme (Hitler), Fascisme (Mussolini), Militarisme japonais |
| **Traité de Versailles (1919)** | Humiliation de l'Allemagne → terreau du ressentiment |
| **Politique d'apaisement** | Les démocraties laissent Hitler annexer (Munich, 1938) |
| **Crise de 1929** | Chômage → montée des extrémismes |

---

## ⏳ Grandes phases du conflit

\`\`\`
1939–1940 │ Blitzkrieg — Pologne, France. Armistice (22 juin 1940).
1941      │ Opération Barbarossa (URSS). Pearl Harbor → entrée des États-Unis.
1942–1943 │ Tournant : Stalingrad (2 fév. 1943), El-Alamein, Midway.
1944      │ Débarquement en Normandie — 6 juin 1944 (D-Day) 🛥️
1945      │ Capitulation Allemagne (8 mai). Bombes atomiques Hiroshima & Nagasaki.
          │ Capitulation Japon (2 sept. 1945). Fin de la guerre.
\`\`\`

---

## 💀 La Shoah

> **Génocide** de 6 millions de Juifs d'Europe par le régime nazi.

| Étape | Détail |
|:-----:|:------:|
| Lois de Nuremberg (1935) | Discrimination légale des Juifs |
| Nuit de Cristal (1938) | Pogroms organisés |
| Conférence de Wannsee (1942) | Planification de la « Solution finale » |
| Camps d'extermination | Auschwitz-Birkenau, Treblinka, Sobibor, Belzec… |

---

## 📊 Bilan

| Indicateur | Chiffre |
|:----------:|:-------:|
| Morts totaux | ~70 millions |
| Victimes civiles | ~35–40 millions |
| Victimes de la Shoah | ~6 millions |
| Pays impliqués | 30+ |

---

## 🌐 Conséquences

- Création de l'**ONU** (26 juin 1945).
- **Procès de Nuremberg** (1945–1946) : jugement des crimes contre l'humanité.
- Début de la **Guerre froide** (USA vs URSS).
- **Déclaration universelle des droits de l'homme** (1948).

---

## ✅ Ce qu'il faut retenir

- Déclenchée par l'**invasion de la Pologne** le 1er septembre 1939.
- Tournant décisif : **Stalingrad** (1943) et **D-Day** (6 juin 1944).
- La **Shoah** est un génocide planifié et industrialisé par les nazis.
- Bilan : ~**70 millions** de morts → conflit le plus meurtrier de l'Histoire.
`,
  },

  // ─────────────────────────────────────────────
  // HISTORY - UNIVERSITY
  // ─────────────────────────────────────────────
  {
    title: "Historiographie : méthodes et courants de pensée",
    description: "Étudier comment les historiens travaillent, de l'École des Annales au tournant culturel.",
    subject: 'HISTORY' as const,
    level: 'UNIVERSITY' as const,
    content: `# 📜 Historiographie : méthodes et courants de pensée

## 📌 Définition

> L'**historiographie** est l'histoire de la façon dont l'histoire est écrite :
> méthodes utilisées, sources mobilisées, interprétations proposées.

---

## 🏫 L'École des Annales (fondée en 1929)

> Fondée par **Marc Bloch** et **Lucien Febvre** (revue *Annales d'histoire économique et sociale*).

| Rupture avec l'histoire traditionnelle | Innovation des Annales |
|:--------------------------------------:|:----------------------:|
| Histoire événementielle (batailles, rois) | Histoire des **structures longues** |
| Faits politiques et diplomatiques | Histoire **économique et sociale** |
| Récit linéaire | **La longue durée** (Fernand Braudel) |

### Trois générations
1. **Bloch & Febvre** (1929–1940s) : fondateurs
2. **Braudel** (1950s–70s) : *La Méditerranée* ; géohistoire ; longue durée
3. **Nouvelle histoire** (1970s–80s) : Le Goff, Le Roy Ladurie → histoire des mentalités

---

## 🔄 Le tournant culturel (années 1980–1990)

| Courant | Représentants | Objets d'étude |
|:-------:|:-------------:|:--------------:|
| **Histoire des mentalités** | Le Goff | Croyances, imaginaires médiévaux |
| **Micro-histoire** | Ginzburg, Levi | Individus ordinaires, destins singuliers |
| **Histoire du genre** | Scott | Construction sociale du masculin/féminin |
| **Histoire de la mémoire** | Nora | *Lieux de mémoire*, mémoire collective |

---

## 🔍 Critique des sources (méthode historique)

\`\`\`
1. CRITIQUE EXTERNE
   → Authenticité du document : date, auteur, lieu de production
   → Est-ce un original ou une copie ?

2. CRITIQUE INTERNE
   → Fiabilité du contenu : biais, intentions de l'auteur
   → Comparer avec d'autres sources

3. CONTEXTUALISATION
   → Replacer le document dans son contexte historique de production
   → Comprendre ce qu'il signifiait pour ses contemporains
\`\`\`

---

## 🌐 Débats historiographiques actuels

| Courant | Enjeux |
|:-------:|:------:|
| **Histoire globale / connectée** | Dépasser les frontières nationales |
| **Histoire environnementale** | Rôle du climat et de la nature dans l'histoire humaine |
| **Postcolonial studies** | Réévaluation des récits impériaux |
| **Humanités numériques** | Big data, corpus numérisés, cartographie historique |

---

## ✅ Ce qu'il faut retenir

- L'historiographie étudie **comment** on écrit l'histoire, pas seulement **ce qui** s'est passé.
- Les **Annales** ont révolutionné l'histoire en la tournant vers les structures longues et la société.
- Toute source doit faire l'objet d'une **critique externe et interne**.
- L'histoire est un **champ en constante évolution** qui reflète les enjeux de son époque.
`,
  },

  // ─────────────────────────────────────────────
  // OTHER - MIDDLE
  // ─────────────────────────────────────────────
  {
    title: "Méthodes d'apprentissage et organisation scolaire",
    description: "Apprendre à apprendre : techniques de mémorisation, gestion du temps et prise de notes.",
    subject: 'OTHER' as const,
    level: 'MIDDLE' as const,
    content: `# 🧠 Méthodes d'apprentissage et organisation scolaire

## 📌 La courbe de l'oubli (Ebbinghaus)

> Sans révision, on oublie **70 % d'une leçon en 24 heures** !

La solution : la **révision espacée**.

\`\`\`
Cours ──→ J+1 (10 min) ──→ J+7 (5 min) ──→ J+30 (3 min) ──→ Mémorisé ✅
\`\`\`

---

## ⏱️ La technique Pomodoro

> Travaille par **cycles courts** pour rester concentré.

\`\`\`
① Choisir une tâche précise
② Travailler 25 minutes SANS interruption 🍅
③ Pause de 5 minutes (lever, s'étirer, boire)
④ Après 4 cycles → pause longue de 15 à 30 minutes
\`\`\`

> 💡 Éteins le téléphone pendant les 25 minutes !

---

## 📝 La prise de notes Cornell

Divise ta feuille en **3 zones** :

\`\`\`
┌───────────────────┬────────────────────────────────┐
│  QUESTIONS CLÉS   │     NOTES PRINCIPALES           │
│  (après le cours) │     (pendant le cours)          │
│                   │                                 │
│  - Pourquoi ?     │  → idées, définitions, schémas  │
│  - Comment ?      │  → exemples du prof             │
│  - Qu'est-ce que ?│                                 │
├───────────────────┴────────────────────────────────┤
│  RÉSUMÉ  (en 2–3 phrases, après le cours)          │
│  "Cette leçon explique que…"                       │
└────────────────────────────────────────────────────┘
\`\`\`

---

## 🔬 La méthode Feynman

> Si tu ne peux pas l'expliquer simplement, c'est que tu ne l'as pas vraiment compris.

\`\`\`
ÉTAPE 1 → Choisir un concept à apprendre
ÉTAPE 2 → L'expliquer comme à un enfant de 10 ans
ÉTAPE 3 → Identifier les lacunes (là où tu bloques)
ÉTAPE 4 → Revoir le cours sur ces points précis
ÉTAPE 5 → Simplifier et faire un schéma
\`\`\`

---

## 📅 Organiser son temps — Conseils pratiques

| Conseil | Pourquoi ? |
|:-------:|:----------:|
| Faire un **planning hebdomadaire** | Visualiser les deadlines et éviter le bachotage |
| Commencer par la tâche **la plus difficile** | Énergie maximale le matin |
| Supprimer les **distractions** | +40 % de productivité |
| Dormir **8 heures** | La mémoire se consolide pendant le sommeil |

---

## ✅ Ce qu'il faut retenir

- **Révision espacée** > bachotage (mémoire à long terme).
- **Pomodoro** : 25 min de travail + 5 min de pause.
- **Notes Cornell** : diviser la page en 3 zones.
- **Méthode Feynman** : expliquer = la meilleure façon d'apprendre.
`,
  },

  // ─────────────────────────────────────────────
  // OTHER - HIGH
  // ─────────────────────────────────────────────
  {
    title: "Citoyenneté et vie démocratique",
    description: "Comprendre les institutions de la démocratie, les droits et les devoirs du citoyen.",
    subject: 'OTHER' as const,
    level: 'HIGH' as const,
    content: `# 🗳️ Citoyenneté et vie démocratique

## 📌 Définition de la démocratie

> La **démocratie** (du grec *demos* = peuple, *kratos* = pouvoir) est un régime politique dans lequel le **pouvoir appartient au peuple**, exercé par ses représentants élus.

---

## ⚖️ Les piliers de la démocratie

### 1. La séparation des pouvoirs (Montesquieu)

\`\`\`
┌────────────────────────────────────────────────────────┐
│  POUVOIR LÉGISLATIF  │  POUVOIR EXÉCUTIF  │  JUDICIAIRE│
│  (Parlement)         │  (Gouvernement)    │  (Tribunaux)│
│  → Fait les lois     │  → Applique les    │  → Juge les │
│                      │    lois            │    infractions│
└────────────────────────────────────────────────────────┘
\`\`\`

### 2. Le suffrage universel
> Chaque citoyen majeur a **une voix égale** lors des élections.

### 3. Libertés fondamentales
> Liberté de la presse, liberté d'expression, pluralisme politique.

---

## 🏛️ Les institutions françaises

| Institution | Rôle |
|:-----------:|:----:|
| **Président de la République** | Chef de l'État, garant des institutions |
| **Premier ministre** | Chef du Gouvernement |
| **Assemblée nationale** | Vote les lois (577 députés) |
| **Sénat** | Chambre haute, révise les lois (348 sénateurs) |
| **Conseil constitutionnel** | Vérifie la conformité des lois à la Constitution |
| **Conseil d'État** | Juridiction administrative suprême |

---

## 🔒 Les droits fondamentaux

| Catégorie | Exemples |
|:---------:|:--------:|
| **Libertés civiles** | Liberté d'expression, de conscience, de mouvement |
| **Droits politiques** | Voter, se présenter aux élections |
| **Droits sociaux** | Droit à l'éducation, au logement, à la santé |
| **Droits économiques** | Droit au travail, à une rémunération équitable |

> 📜 Ces droits sont garantis par la **Constitution de 1958** et la **DDHC de 1789**.

---

## 📋 Les devoirs du citoyen

- ✅ Respecter les **lois** et la **Constitution**.
- ✅ **Voter** (un droit mais aussi un devoir civique).
- ✅ Payer ses **impôts** (financement des services publics).
- ✅ Respecter l'**environnement** et le bien commun.
- ✅ Défendre la **République** si nécessaire (service national).

---

## ✅ Ce qu'il faut retenir

- La démocratie repose sur la **séparation des pouvoirs** et le **suffrage universel**.
- En France : Président, Gouvernement, Parlement (Assemblée + Sénat).
- Être citoyen = avoir des **droits** ET des **devoirs**.
- La **Constitution** est la loi fondamentale qui encadre toutes les autres.
`,
  },
];

  for (const course of coursesData) {
    await prisma.course.create({ data: { ...course, authorId: teacher.id } });
  }

  console.log(`Seed termine avec succes ! ${coursesData.length} cours crees.`);
  console.log('   admin@demo.com  / admin1234');
  console.log('   prof@demo.com   / prof1234');
  console.log('   eleve@demo.com  / demo1234');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
