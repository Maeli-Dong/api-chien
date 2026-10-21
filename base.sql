-- Table « chiens » pour l'API MySQL (source 2)
-- 12 chiens DIFFÉRENTS de ceux du fichier JSON (source 1)
-- afin de voir clairement quelle source est utilisée.
--
-- À importer dans phpMyAdmin :
--   • En local : MAMP ou XAMPP → phpMyAdmin → votre base → onglet Importer
--   • En ligne : pma.techniques-graphiques.be → votre base → onglet Importer

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Structure de la table `chiens`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `chiens`;

CREATE TABLE `chiens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `race` varchar(100) DEFAULT NULL,
  `categorie` varchar(50) NOT NULL,
  `age` tinyint(3) UNSIGNED DEFAULT NULL,
  `poids` decimal(5,1) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `surnom` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Données : 12 chiens (Labrador, Caniche, Beagle, Dalmatien)
-- --------------------------------------------------------

INSERT INTO `chiens` (`id`, `nom`, `race`, `categorie`, `age`, `poids`, `image`, `surnom`) VALUES
(1,  'Rex',      'Labrador',   'retriever', 3,  30.0, 'https://images.dog.ceo/breeds/labrador/lab_young.jpg',           'Le Gourmand'),
(2,  'Nala',     'Labrador',   'retriever', 5,  27.5, 'https://images.dog.ceo/breeds/labrador/n02099712_7664.jpg',       NULL),
(3,  'Oscar',    'Labrador',   'retriever', 1,  24.0, 'https://images.dog.ceo/breeds/labrador/n02099712_2863.jpg',       'Le Chiot fou'),
(4,  'Fifi',     'Caniche',    'toy',       8,  5.0,  'https://images.dog.ceo/breeds/poodle-standard/n02113799_4458.jpg','La Diva'),
(5,  'Pompom',   'Caniche',    'toy',       4,  6.5,  'https://images.dog.ceo/breeds/poodle-standard/n02113799_4642.jpg', NULL),
(6,  'Titi',     'Caniche',    'toy',       2,  4.0,  'https://images.dog.ceo/breeds/poodle-standard/n02113799_3978.jpg','Boule de poils'),
(7,  'Bruno',    'Beagle',     'courant',   6,  14.0, 'https://images.dog.ceo/breeds/beagle/01-12brady.jpg.jpg',         'Le Pisteur'),
(8,  'Snoopy',   'Beagle',     'courant',   3,  12.0, 'https://images.dog.ceo/breeds/beagle/n02088364_3758.jpg',         NULL),
(9,  'Caramel',  'Beagle',     'courant',   4,  13.5, 'https://images.dog.ceo/breeds/beagle/n02088364_12303.jpg',        'Tête de mule'),
(10, 'Pongo',    'Corgi',      'berger',    5,  13.0, 'https://images.dog.ceo/breeds/corgi-cardigan/n02113186_11014.jpg', 'Le Court-sur-pattes'),
(11, 'Perdita',  'Corgi',      'berger',    3,  11.5, 'https://images.dog.ceo/breeds/corgi-cardigan/n02113186_13335.jpg', NULL),
(12, 'Lucky',    'Corgi',      'berger',    1,  10.0, 'https://images.dog.ceo/breeds/corgi-cardigan/n02113186_6415.jpg',  'Petit Joueur');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
