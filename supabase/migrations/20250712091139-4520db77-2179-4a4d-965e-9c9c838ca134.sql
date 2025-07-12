
-- Insérer des services d'exemple dans la base de données
INSERT INTO public.services (provider_id, title, description, category, price, duration, is_active) VALUES
-- Services pour différents prestataires (utilisant des UUIDs d'exemple)
('8006bcd1-e2c0-40d4-b3a4-d9b47aac159f', 'Cours de mathématiques niveau lycée', 'Cours particuliers de mathématiques pour élèves de seconde, première et terminale. Préparation au baccalauréat incluse.', 'education', 25.00, 60, true),
('8006bcd1-e2c0-40d4-b3a4-d9b47aac159f', 'Cours de physique-chimie', 'Soutien scolaire en physique et chimie, méthodes adaptées à chaque élève.', 'education', 28.00, 60, true),
('9779dc9b-9545-4ff1-998e-468a12208120', 'Développement site web React', 'Création de sites web modernes avec React, TypeScript et Tailwind CSS.', 'tech', 45.00, 120, true),
('9779dc9b-9545-4ff1-998e-468a12208120', 'Formation JavaScript', 'Formation complète en JavaScript moderne (ES6+) pour débutants et intermédiaires.', 'tech', 35.00, 90, true),
('8006bcd1-e2c0-40d4-b3a4-d9b47aac159f', 'Réparation ordinateur portable', 'Diagnostic et réparation de problèmes hardware et software sur PC portables.', 'repair', 40.00, 90, true),
('9779dc9b-9545-4ff1-998e-468a12208120', 'Design graphique logo', 'Création de logos professionnels et identité visuelle pour entreprises.', 'creative', 80.00, 180, true),
('8006bcd1-e2c0-40d4-b3a4-d9b47aac159f', 'Ménage à domicile', 'Service de ménage complet : aspirateur, sols, surfaces, salle de bain, cuisine.', 'home', 20.00, 120, true),
('9779dc9b-9545-4ff1-998e-468a12208120', 'Jardinage et entretien', 'Taille des haies, tonte pelouse, plantation et entretien général du jardin.', 'home', 22.00, 90, true),
('8006bcd1-e2c0-40d4-b3a4-d9b47aac159f', 'Massage relaxant', 'Massage thérapeutique et relaxant à domicile, techniques suédoises et deep tissue.', 'health', 50.00, 60, true),
('9779dc9b-9545-4ff1-998e-468a12208120', 'Cours de guitare', 'Cours de guitare acoustique et électrique, tous niveaux, solfège optionnel.', 'education', 30.00, 60, true);

-- Mettre à jour le user_type des utilisateurs qui ont des services pour qu'ils soient prestataires
UPDATE public.profiles 
SET user_type = 'provider' 
WHERE id IN ('8006bcd1-e2c0-40d4-b3a4-d9b47aac159f', '9779dc9b-9545-4ff1-998e-468a12208120');
