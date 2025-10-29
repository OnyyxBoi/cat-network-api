# cat-network-api

## Membres du groupe
Ladouche Téo,
Bouadil Inès

---

### 1. Présentation du Projet

Notre application est un réseau social de partage de contenu pour les amateurs de chats. L’objectif est de permettre aux utilisateurs de créer des posts, commenter et réagir aux publications des autres. L'application permet aussi de réserver des rendez-vous dans des cliniques vétérinaires.

### 2. Architecture PostgreSQL (Méthode Merise)

**MCD (Modèle Conceptuel de Données)**

```
// Insérer capture d'écran du MCD
```

**MLD (Modèle Logique de Données)**

```
// Insérer capture d'écran du MLD
```

**MPD (Modèle Physique de Données)**

```sql
-- Insérer script SQL de création des tables
```

### 3. Architecture MongoDB

```json

    {
    "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "authorId": "11111111-1111-1111-1111-111111111111",
    "author": { "pseudonym": "Onyyx" },
    "content": { "text": "Behold, the loaf.", "media": [] },
    "createdAt": "2025-10-29T10:17:26.268Z",
    "updatedAt": "2025-10-29T10:17:26.268Z",
    "parentPostId": null
    }
```

### 4. Justification des Choix Techniques

- **Répartition des données** : Quelles données en PostgreSQL ? Quelles données en MongoDB ? Pourquoi ?

toutes les données structurées liées à la clinique vétérinaire, par exemple : les utilisateurs, les chats, les rendez-vous. Ces données sont fortement normalisées, avec des relations claires (un client peut avoir plusieurs chats, un rendez-vous est lié à un animal et un vétérinaire), ce qui correspond parfaitement au modèle relationnel.
Toutes les données du réseau social (posts, commentaires, réactions) sont stockée dans une base mongo. Ces données sont semi-structurées, évolutives et souvent imbriquées (commentaires avec réponses, réactions sur posts ou commentaires), ce qui rend mongodb plus flexible pour ce type de données
- **Modélisation MongoDB** : Documents imbriqués ou références ? Justification

Nous avons utilisé principalement des références entre documents plutôt que de tout imbriquer. Par exemple, un post référence ses commentaires via postId et les réactions via subjectId. Les posts ou commentaires peuvent avoir un nombre varié de réactions ou réponses, et les imbriquer directement ferait grossir les documents. Les références permettent de conserver des documents plus légers, de gérer les agrégations via $lookup, et de maintenir l’intégrité des données tout en permettant des pipelines d’agrégation puissants pour construire, par exemple, l’arbre des commentaires ou calculer les top posts.
- **Relations inter-bases** : Comment les deux bases communiquent-elles ?

### 5. Exemples de Requêtes Complexes

**PostgreSQL**

```sql
-- Exemple de requête avec jointure et agrégat
```

**MongoDB**

Pipeline pour compter réactions et commentaires par post
```javascript
    db.posts.aggregate([
    {
        $lookup: {
        from: "reactions",
        localField: "_id",
        foreignField: "subjectId",
        as: "reactions"
        }
    },
    {
        $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments"
        }
    },
    {
        $addFields: {
        reactionsCount: { $size: "$reactions" },
        commentsCount: { $size: "$comments" }
        }
    },
    {
        $project: {
        content: 1,
        author: 1,
        createdAt: 1,
        updatedAt: 1,
        reactionsCount: 1,
        commentsCount: 1
        }
    }
    ]);

```

### 6. Stratégie de Sauvegarde
Pour cette partie, vous devez effectuer des recherches afin d'argumenter vos réponses.

- **PostgreSQL** : Méthode proposée (pg_dump, sauvegarde continue, etc.)
- **MongoDB** : Méthode proposée (mongodump, replica set, etc.)
- **Fréquence** : Complète, incrémentale, différentielle
- **Restauration** : Procédure en cas de perte de données