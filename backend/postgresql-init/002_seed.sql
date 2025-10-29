SET search_path = cat_network, public;

-- ==== USERS (12) ============================================================
INSERT INTO users (id, name, first_name, pseudonym, age, email, password, is_owner, is_veterinarian)
OVERRIDING SYSTEM VALUE VALUES
(1,  'Doe',      'John',   'jdoe',     31, 'john.doe@example.com',    'hashed_pw', true,  false),
(2,  'Smith',    'Jane',   'jsmith',   29, 'jane.smith@example.com',  'hashed_pw', true,  false),
(3,  'Martin',   'Alice',  'amartin',  35, 'alice.m@example.com',     'hashed_pw', true,  false),
(4,  'Leroy',    'Bob',    'bleroy',   41, 'bob.leroy@example.com',   'hashed_pw', true,  false),
(5,  'Dupont',   'Inès',   'idupont',  27, 'ines.dupont@example.com', 'hashed_pw', true,  false),
(6,  'Laurent',  'Téo',    'onyyx',    21, 'teo.laurent@example.com', 'hashed_pw', true,  false),
(7,  'Paws',     'Emma',   'drpaws',   34, 'emma.paws@example.com',   'hashed_pw', false, true),
(8,  'Claw',     'Victor', 'vclaw',    46, 'victor.claw@example.com', 'hashed_pw', false, true),
(9,  'Whisker',  'Chloe',  'cwhisker', 39, 'chloe.whisker@example.com','hashed_pw',false, true),
(10, 'Feline',   'Marc',   'mfeline',  50, 'marc.feline@example.com', 'hashed_pw', false, true),
(11, 'Connor',   'Sarah',  'sconnor',  33, 's.connor@example.com',    'hashed_pw', true,  false),
(12, 'Petit',    'Lucas',  'lpetit',   24, 'lucas.petit@example.com', 'hashed_pw', true,  false);

-- ==== BREEDS (10) ===========================================================
INSERT INTO breeds (id, name)
OVERRIDING SYSTEM VALUE VALUES
(1, 'British Shorthair'),
(2, 'Siamese'),
(3, 'Maine Coon'),
(4, 'Bengal'),
(5, 'Sphynx'),
(6, 'Ragdoll'),
(7, 'Persian'),
(8, 'Scottish Fold'),
(9, 'Norwegian Forest'),
(10,'Russian Blue');

-- ==== CLINICS (10) ==========================================================
INSERT INTO clinics (id, name, address)
OVERRIDING SYSTEM VALUE VALUES
(1,  'Purrfect Care',              '12 Rue des Chats, Bordeaux'),
(2,  'Feline Health Center',       '5 Avenue des Griffes, Paris'),
(3,  'Cat Clinic Bordeaux',        '18 Quai des Mousses, Bordeaux'),
(4,  'Whisker Wellness',           '44 Rue de la Litière, Lyon'),
(5,  'Nine Lives Veterinary',      '2 Allée des Ronrons, Marseille'),
(6,  'The Cat Hospital',           '101 Rue Minet, Lille'),
(7,  'Gentle Paws Clinic',         '73 Place des Croquettes, Toulouse'),
(8,  'Velvet Paw Vets',            '9 Boulevard du Poil, Nantes'),
(9,  'TabbyCare',                  '3 Rue des Coussinets, Rennes'),
(10, 'Calico & Co. Veterinary',    '27 Chemin des Minous, Nice');

-- ==== CLINIC_VETERINARIANS (12 links) ======================================
INSERT INTO clinic_veterinarians (clinic_id, vet_id) VALUES
(1, 7), (1, 8),
(2, 7), (2, 9),
(3, 8), (3,10),
(4, 9),
(5,10),
(6, 7),
(7, 8),
(8, 9),
(9,10);

-- ==== CATS (10) =============================================================
INSERT INTO cats (id, name, breed, owner, age, weight, main_clinic)
OVERRIDING SYSTEM VALUE VALUES
(1, 'Luna',   10, 1,  3,  3.90, 1),
(2, 'Simba',   3, 2,  5,  6.20, 2),
(3, 'Nala',    2, 3,  2,  3.10, 3),
(4, 'Milo',    4, 4,  4,  5.40, 4),
(5, 'Oliver',  1, 5,  1,  2.80, 5),
(6, 'Bella',   6, 6,  6,  4.95, 6),
(7, 'Leo',     5,11,  7,  5.70, 7),
(8, 'Chloe',   7,12, 10,  6.85, 8),
(9, 'Max',     8, 1,  8,  7.10, 9),
(10,'Lily',    9, 2, 12,  8.40,10);

-- ==== APPOINTMENTS (10) =====================================================
INSERT INTO appointments (id, cat, veterinarian, "date")
OVERRIDING SYSTEM VALUE VALUES
(1,  1,  7, '2025-11-03 09:00:00+01'),
(2,  2,  8, '2025-11-03 10:30:00+01'),
(3,  3,  9, '2025-11-04 11:00:00+01'),
(4,  4, 10, '2025-11-04 14:15:00+01'),
(5,  5,  7, '2025-11-05 09:45:00+01'),
(6,  6,  8, '2025-11-05 16:00:00+01'),
(7,  7,  9, '2025-11-06 13:30:00+01'),
(8,  8, 10, '2025-11-06 15:00:00+01'),
(9,  9,  7, '2025-11-07 10:00:00+01'),
(10,10,  8, '2025-11-07 11:30:00+01');

