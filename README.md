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
    images_rendu\mcd.png
```

**MLD (Modèle Logique de Données)**

```
    images_rendu\mld.png
```

**MPD (Modèle Physique de Données)**

```sql
CREATE SCHEMA IF NOT EXISTS cat_network;
SET search_path = cat_network, public;

CREATE TABLE users (
  id               integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name             text        NOT NULL,
  first_name       text        NOT NULL,
  pseudonym        text        NOT NULL UNIQUE,
  age              integer     CHECK (age BETWEEN 0 AND 150),
  email            text        NOT NULL UNIQUE,
  password         text        NOT NULL,
  is_owner         boolean     NOT NULL DEFAULT false,
  is_veterinarian  boolean     NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE breeds (
  id     integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name   text NOT NULL UNIQUE
);

CREATE TABLE clinics (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text        NOT NULL,
  address    text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE clinic_veterinarians (
  clinic_id integer NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  vet_id    integer NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  PRIMARY KEY (clinic_id, vet_id)
);

CREATE TABLE cats (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text        NOT NULL,
  breed       integer     REFERENCES breeds(id),
  owner       integer     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  age         integer     CHECK (age BETWEEN 0 AND 40),
  weight      numeric(5,2) CHECK (weight > 0),
  main_clinic integer     REFERENCES clinics(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON cats (owner);
CREATE INDEX ON cats (breed);
CREATE INDEX ON cats (main_clinic);

CREATE TABLE appointments (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cat           integer NOT NULL REFERENCES cats(id)   ON DELETE CASCADE,
  veterinarian  integer NOT NULL REFERENCES users(id),
  date          timestamptz NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (veterinarian, date)
);

CREATE INDEX ON appointments (cat);
CREATE INDEX ON appointments (veterinarian);
CREATE INDEX ON appointments (date);

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

pg_dump permet d'effectuer des sauvegardes régulières en exportant la base sous forme d’un script SQL ou d’un archive. 

    - https://www.percona.com/blog/postgresql-backup-strategy-enterprise-grade-environment
    - https://www.postgresql.org/docs/current/backup.html

- **MongoDB** : Méthode proposée (mongodump, replica set, etc.)
Il est possible d'utiliser mongodump et la mettre en place d’un replica set. Mongodump permet de créer des fichiers de sauvegarde régulièrement contenant les collections ce qui rend les données facilement exportables et restaurables. --oplog peut être utilisé afin de prendre également les opérations du journal du replica set ce qui permet d’obtenir un instantané de la base même si des écritures ont lieu pendant la sauvegarde. Pour les environnements critiques ou les bases conséquentes, cette méthode peut être complétée avec des snapshots système ou des sauvegardes au niveau des volumes, garantissant une protection supplémentaire et la possibilité de restaurer rapidement un état complet de la base

    - https://www.percona.com/blog/mongodb-backup-best-practices/
    - https://www.mongodb.com/docs/database-tools/mongodump/
    - https://www.mongodb.com/docs/manual/tutorial/backup-and-restore-tools/
    - https://www.mongodb.com/community/forums/t/mongodb-replica-set-backups-recovery/268877

- **Fréquence** : Complète, incrémentale, différentielle

- **Restauration** : Procédure en cas de perte de données

Il suffit de restaurer le dernier dump