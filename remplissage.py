import sqlite3, random
from random import randint

# ouverture/initialisation de la base de donnee 
conn = sqlite3.connect('static/logement.db')
conn.row_factory = sqlite3.Row
c = conn.cursor()

def remplir_random_mesures(nb_random):
    ran_m = [(randint(10, 30),randint(1,2)) for i in range(nb_random)]
    c.executemany("""INSERT INTO Mesure (valeur, id_capteur) VALUES (?,?)""",ran_m)

def remplir_random_factures(nb_random):
    types_factures = ["electricité", "eau", "gaz"]
    ran_f = [(types_factures[randint(0,2)],randint(10,100),randint(120,2000),f"{str(randint(2000,2024))}-{str(randint(1,12))}-{str(randint(1,28))}",1) for i in range(nb_random)]
    c.executemany("""INSERT INTO Facture (type_facture, montant, valeur_consommee, date, id_logement) VALUES (?,?,?,?,?)""",ran_f)




remplir_random_mesures(20)
remplir_random_factures(100)

# fermeture
conn.commit()
conn.close()
