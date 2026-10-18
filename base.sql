-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 18 oct. 2026 à 23:42
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `musee`
--

-- --------------------------------------------------------

--
-- Structure de la table `oeuvres`
--

CREATE TABLE `oeuvres` (
  `id` int(11) NOT NULL,
  `titre` varchar(200) NOT NULL,
  `artiste` varchar(100) DEFAULT NULL,
  `annee` smallint(6) NOT NULL,
  `categorie` varchar(30) NOT NULL,
  `hauteur_cm` decimal(5,1) DEFAULT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `oeuvres`
--

INSERT INTO `oeuvres` (`id`, `titre`, `artiste`, `annee`, `categorie`, `hauteur_cm`, `image`) VALUES
(1, 'La Chambre', 'Vincent van Gogh', 1889, 'peinture', 73.6, 'https://www.artic.edu/iiif/2/6644829f-f292-c5c4-a73c-0356a6fdbf0d/full/843,/0/default.jpg'),
(2, 'Rue de Paris, temps de pluie', 'Gustave Caillebotte', 1877, 'peinture', 212.2, 'https://www.artic.edu/iiif/2/f8fd76e9-c396-5678-36ed-6a348c904d27/full/843,/0/default.jpg'),
(3, 'Un dimanche à la Grande Jatte', 'Georges Seurat', 1884, 'peinture', 207.5, 'https://www.artic.edu/iiif/2/2d484387-2509-5e8e-2c43-22f9981972eb/full/843,/0/default.jpg'),
(4, 'Sous la vague au large de Kanagawa', 'Katsushika Hokusai', 1830, 'estampe', 25.4, 'https://www.artic.edu/iiif/2/2fa24f36-cc26-41b6-4b49-12bba2a6c1c8/full/843,/0/default.jpg'),
(5, 'Bouddha Shakyamuni assis en méditation', NULL, 1100, 'sculpture', 160.0, 'https://www.artic.edu/iiif/2/0675f9a9-1a7b-c90a-3bb6-7f7be2afb678/full/843,/0/default.jpg'),
(6, 'Frederick Douglass', 'Samuel J. Miller', 1847, 'photographie', 14.0, 'https://www.artic.edu/iiif/2/68597cf9-01aa-7c1f-1179-d4b8811e1c05/full/843,/0/default.jpg'),
(7, 'Meules, fin de l\'été', 'Claude Monet', 1890, 'peinture', 60.0, 'https://www.artic.edu/iiif/2/a38e2828-ec6f-ece1-a30f-70243449197b/full/843,/0/default.jpg'),
(8, 'Nymphéas', 'Claude Monet', 1906, 'peinture', 89.9, 'https://www.artic.edu/iiif/2/3c27b499-af56-f0d5-93b5-a7f2f1ad5813/full/843,/0/default.jpg'),
(9, 'Pierre du couronnement de Moctezuma Xocoyotzin', 'Mexica (Aztèques)', 1503, 'sculpture', 67.4, 'https://www.artic.edu/iiif/2/ea8c5d62-6ce8-88e8-feb1-e0053cf534c5/full/843,/0/default.jpg'),
(10, 'L\'Enfant malade I', 'Edvard Munch', 1896, 'estampe', 42.0, 'https://www.artic.edu/iiif/2/d661b811-c78c-ac16-b39c-442cbd8c517f/full/843,/0/default.jpg'),
(11, 'Deux sœurs (sur la terrasse)', 'Pierre-Auguste Renoir', 1881, 'peinture', 100.4, 'https://www.artic.edu/iiif/2/3a608f55-d76e-fa96-d0b1-0789fbc48f1e/full/843,/0/default.jpg'),
(12, 'Autoportrait', 'Vincent van Gogh', 1887, 'peinture', 41.0, 'https://www.artic.edu/iiif/2/47c5bcb8-62ef-e5d7-55e7-f5121f409a30/full/843,/0/default.jpg'),
(13, 'Poteau de véranda (Òpó Ògògá)', 'Olowe d\'Ise', 1910, 'sculpture', 152.5, 'https://www.artic.edu/iiif/2/fec5d023-0b46-45df-eb57-cbf64e24121d/full/843,/0/default.jpg'),
(14, 'Georgia O\'Keeffe, mains et dé à coudre', 'Alfred Stieglitz', 1919, 'photographie', 24.4, 'https://www.artic.edu/iiif/2/62fdbcae-4491-91c3-6fdc-728e1cf4b547/full/843,/0/default.jpg'),
(15, 'L\'Assomption de la Vierge', 'Le Greco', 1577, 'peinture', 403.2, 'https://www.artic.edu/iiif/2/47fd1564-93f5-f30b-7786-013421133b4a/full/843,/0/default.jpg'),
(16, 'L\'acteur Bandō Mitsugorō II dans le rôle d\'Ishii Genzō', 'Tōshūsai Sharaku', 1794, 'estampe', 37.5, 'https://www.artic.edu/iiif/2/ea632771-07fe-0c80-a565-ef1624b28465/full/843,/0/default.jpg'),
(17, 'Shiva, seigneur de la danse (Nataraja)', NULL, 1000, 'sculpture', 69.3, 'https://www.artic.edu/iiif/2/cf50f037-5fb2-e197-0e56-3ae701edb3e2/full/843,/0/default.jpg'),
(18, 'Le Bain de l\'enfant', 'Mary Cassatt', 1893, 'peinture', 101.3, 'https://www.artic.edu/iiif/2/3b885ae0-4d46-5fe4-d70a-00474827f02c/full/843,/0/default.jpg'),
(19, 'Big River, vue de la Rancherie, Mendocino', 'Carleton Watkins', 1863, 'photographie', 40.0, 'https://www.artic.edu/iiif/2/0ac9663b-e17e-471d-e4e3-6c60fc800704/full/843,/0/default.jpg'),
(20, 'La Création d\'Adam', 'Giovanni Benedetto Castiglione', 1645, 'estampe', 30.3, 'https://www.artic.edu/iiif/2/413a9edf-ee27-ee07-5b51-88712143cb89/full/843,/0/default.jpg'),
(21, 'Improvisation n° 30 (Canons)', 'Vassily Kandinsky', 1913, 'peinture', 111.0, 'https://www.artic.edu/iiif/2/b5bc6b66-9e6e-fe57-dcec-fc49e820e904/full/843,/0/default.jpg'),
(22, 'Buste d\'un jeune homme (saint Jean-Baptiste)', 'Francesco Mochi', 1630, 'sculpture', 40.5, 'https://www.artic.edu/iiif/2/4e37b182-cc1e-ef86-3eb2-de7d5b9db717/full/843,/0/default.jpg'),
(23, 'Mrs Herbert Duckworth', 'Julia Margaret Cameron', 1867, 'photographie', 34.2, 'https://www.artic.edu/iiif/2/a50be06e-0072-24a5-9fa5-3e172c638fee/full/843,/0/default.jpg'),
(24, 'Souvenir d\'Italie', 'Camille Corot', 1866, 'estampe', 29.3, 'https://www.artic.edu/iiif/2/ab107179-7106-937e-7676-e0263b02e530/full/843,/0/default.jpg');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `oeuvres`
--
ALTER TABLE `oeuvres`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `oeuvres`
--
ALTER TABLE `oeuvres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
