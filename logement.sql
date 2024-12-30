DROP TABLE IF EXISTS Adresse;
DROP TABLE IF EXISTS Logement;
DROP TABLE IF EXISTS Piece;
DROP TABLE IF EXISTS Type_actionneur_capteur;
DROP TABLE IF EXISTS Actionneur_capteur;
DROP TABLE IF EXISTS Mesure;
DROP TABLE IF EXISTS Facture;

CREATE TABLE Adresse (
    id  INTEGER PRIMARY KEY AUTOINCREMENT, 
    Numero INTEGER, 
    Voie TEXT NOT NULL, 
    Nom_voie TEXT NOT NULL, 
    Code INTEGER NOT NULL);

CREATE TABLE Logement (
    id  INTEGER PRIMARY KEY AUTOINCREMENT, 
    telephone TEXT, 
    adresse_ip TEXT, 
    date_insertion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_adresse INTEGER NOT NULL,
    FOREIGN KEY (id_adresse) REFERENCES Adresse(id)); 

CREATE TABLE Piece (
    id  INTEGER PRIMARY KEY AUTOINCREMENT,
    x INTEGER,
    y INTEGER,
    z INTEGER,
    id_logement INTEGER NOT NULL,
    FOREIGN KEY (id_logement) REFERENCES Logement(id));


CREATE TABLE Type_actionneur_capteur (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unite TEXT,
    precision FLOAT);

CREATE TABLE Actionneur_capteur (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference TEXT NOT NULL,
    port INTEGER,
    date_insertion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_type INTEGER,
    id_piece INTEGER,
    FOREIGN KEY (id_type) REFERENCES Type_actionneur_capteur(id),
    FOREIGN KEY (id_piece) REFERENCES Piece(id));

CREATE TABLE Mesure (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valeur FLOAT NOT NULL,
    date_insertion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_capteur INTEGER NOT NULL,
    FOREIGN KEY (id_capteur) REFERENCES Actionneur_capteur(id));

CREATE TABLE Facture (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type_facture TEXT,
    montant INTEGER NOT NULL,
    valeur_consommee INTEGER,
    date DATE,
    id_logement INTEGER NOT NULL,
    FOREIGN KEY (id_logement) REFERENCES Logement(id));

INSERT INTO Adresse (Numero, Voie, Nom_voie, Code) VALUES
    (1, "rue", "des Deux", 22222);

INSERT INTO Logement (telephone, adresse_ip, id_adresse) VALUES
    ("+331234567", "1.1.1.1", (SELECT id FROM Adresse WHERE (Numero, Voie, Nom_voie, Code) =  (1, "rue", "des Deux", 22222)));
INSERT INTO Piece (x, y, z, id_logement) VALUES
    (1, 1, 1, (SELECT id FROM Logement where adresse_ip = "1.1.1.1")),
    (1, 1, 2, (SELECT id FROM Logement where adresse_ip = "1.1.1.1")),
    (1, 1, 3, (SELECT id FROM Logement where adresse_ip = "1.1.1.1")),
    (1, 1, 4, (SELECT id FROM Logement where adresse_ip = "1.1.1.1"));

INSERT INTO Type_actionneur_capteur (unite, precision) VALUES
    ("kW", 0.01),
    ("°C", 0.1),
    ("Pa", 0.05),
    ("m.s^-2", 0.001);

INSERT INTO Actionneur_capteur (reference, port, id_type, id_piece) VALUES
    ("AKZK11E", 80, 1, (SELECT id FROM Piece WHERE (x, y, z, id_logement) = (1, 1, 1, (SELECT id FROM Logement where adresse_ip = "1.1.1.1")))),
    ("KIO23H", 42, 2, (SELECT id FROM Piece WHERE (x, y, z, id_logement) = (1, 1, 2, (SELECT id FROM Logement where adresse_ip = "1.1.1.1"))));

INSERT INTO Mesure (valeur, id_capteur) VALUES 
    (30, (SELECT id FROM Actionneur_capteur WHERE id = 1)),
    (12, (SELECT id FROM Actionneur_capteur WHERE id = 1)),
    (20, (SELECT id FROM Actionneur_capteur WHERE id = 2)),
    (18, (SELECT id FROM Actionneur_capteur WHERE id = 2));

INSERT INTO Facture (type_facture, montant, valeur_consommee, date, id_logement) VALUES
    ("electricité", 30, 124, '2024-11-20', (SELECT id FROM Logement where adresse_ip = "1.1.1.1")),
    ("eau", 25, 1000, '2024-11-20', (SELECT id FROM Logement where adresse_ip = "1.1.1.1")),
    ("electricité", 60, 200, '2024-12-20', (SELECT id FROM Logement where adresse_ip = "1.1.1.1")),
    ("eau", 50, 1800, '2024-12-20', (SELECT id FROM Logement where adresse_ip = "1.1.1.1")),
    ("gaz", 66, 133, '2024-02-01', (SELECT id FROM Logement where adresse_ip = "1.1.1.1")),
    ("gaz", 120, 200, '2024-03-01', (SELECT id FROM Logement where adresse_ip = "1.1.1.1"));