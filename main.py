from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import sqlite3
import uvicorn

class MySQL():
	def __init__(self, name):
		self.c = None
		self.req = None
		self.conn = sqlite3.connect(name,check_same_thread=False)
		self.c = self.conn.cursor()

	def __exit__(self, exc_type, exc_value, traceback):
		self.conn.close()

	def select(self,path):
		elem = path.split('/')
		if len(elem) == 2:
			req = "select * from %s" %(elem[1])
		else:
			req = "select %s from %s where id=%s" %(elem[3],elem[1],elem[2])
		return self.c.execute(req).fetchall()
	
	def select_full(self, table):
		req = "select * from %s" %(table)
		return self.c.execute(req).fetchall()


	def select_last_temperature(self):
		req = "SELECT valeur FROM Mesure WHERE id_capteur = 1 ORDER BY date_insertion DESC LIMIT 1"
		return self.c.execute(req).fetchall()[0][0]

	def select_factures_type_nb(self):
		req = "select type_facture, COUNT(type_facture) from Facture group by type_facture"
		return self.c.execute(req).fetchall()

	def select_factures_by_type(self, logement_id):
		req = f"select type_facture, montant, valeur_consommee, date from Facture WHERE id_logement = {logement_id} ORDER BY date ASC"
		return self.c.execute(req).fetchall()

	def select_unit_with_id(self, id):
		req = f"SELECT unite from Type_actionneur_capteur WHERE id = {id}"
		return self.c.execute(req).fetchall()


	def select_referenceport_with_id(self, id):
		req = f"SELECT reference, port FROM Actionneur_capteur WHERE id = {id}"
		return self.c.execute(req).fetchall()

	def select_mesures_with_id(self, id):
		req = f"SELECT valeur, date_insertion FROM Mesure WHERE id_capteur = {id} ORDER by date_insertion ASC"
		return self.c.execute(req).fetchall()

	def select_mesures_by_capteur(self):
		mesures_by_capteur = {}
		
		req = f"SELECT id FROM Actionneur_capteur"
		id_capteurs = self.c.execute(req).fetchall()
		for c_id in id_capteurs:
			mesures_list = self.select_mesures_with_id(c_id[0])
			c_ref = self.select_referenceport_with_id(c_id[0])
			if(mesures_list != []):
				mesures_by_capteur[f"{c_ref[0][0]}:{c_ref[0][1]}"] = mesures_list

		# req = f"SELECT valeur, date_insertion, id_capteur FROM Mesure ORDER by date_insertion ASC"
		return mesures_by_capteur
	
	def select_capteurs(self):
		req = f"SELECT reference, port, date_insertion from Actionneur_capteur"
		return self.c.execute(req).fetchall()

	def add_capteur_with_type(self, reference, port, unite, precision):
		req = f"INSERT INTO Type_actionneur_capteur (unite, precision) VALUES (?, ?)"
		row = [unite,precision]
		self.c.execute(req, row)
		self.conn.commit()
		req = f"SELECT id from Type_actionneur_capteur WHERE unite = '{unite}' AND precision = {precision}"
		id_type = self.c.execute(req).fetchone()[0]

		req = f"INSERT INTO Actionneur_capteur (reference, port, id_type) VALUES (?,?,?)"
		row = [reference,port, id_type]

		self.c.execute(req, row)


	def delete_capteur(self, reference, port, date_insertion):
		req = f"DELETE FROM Actionneur_capteur WHERE reference = '{reference}' AND date_insertion = '{date_insertion}' AND port = {port}"
		try: 
			self.c.execute(req)
			r_code = 0
		except sqlite3.OperationalError as e:
			print(e)
			r_code = 1
		finally:
			self.conn.commit()
			return r_code


	def delete_mesure(self, capteur, valeur, date):
		capteur_ref, capteur_port = capteur.split(":")
		req = f"DELETE FROM Mesure WHERE valeur = {valeur} AND date_insertion = '{date}' AND id_capteur = (SELECT id from Actionneur_capteur WHERE reference = '{capteur_ref}' AND port = {capteur_port})"
		try: 
			self.c.execute(req)
			r_code = 0
		except sqlite3.OperationalError as e:
			print(e)
			r_code = 1
		finally:
			self.conn.commit()
			return r_code


	def insert(self,table,query):
		print(table)
		print(query.keys(), query.values())
		keys = ', '.join(query.keys())
		values = ", ".join('"%s"' %v for v in query.values())
		print(keys, values)

		req = "insert into %s (%s) values (%s)" %(table, keys, values)
		print(req)
		self.c.execute(req)
		self.conn.commit()



mysql = MySQL('static/db/logement.db')
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/")
@app.get("/index")
async def index(request: Request):
		return templates.TemplateResponse("index.html", {"request": request})

@app.get("/capteurs")
@app.get("/capteurs.html")
async def index(request: Request):
		# temperatures_select = mysql.select_mesures_with_id(1)
		# temperatures = []
		# temperatures.append([a for a,b in temperatures_select])
		# temperatures.append([b for a,b in temperatures_select])

		mesures_by_capteur = mysql.select_mesures_by_capteur()
		for k,v in mesures_by_capteur.items():
			v2 = [[a for a,b in v]]
			v2.append([b for a,b in v])
			mesures_by_capteur[k] = v2
		

		return templates.TemplateResponse("capteurs.html", {"request": request, "mesures_by_capteur": mesures_by_capteur})

@app.get("/consommation")
@app.get("/consommation.html")
async def index(request: Request):
		# temperatures_select = mysql.select_mesures_with_id(1)
		# temperatures = []
		# temperatures.append([a for a,b in temperatures_select])
		# temperatures.append([b for a,b in temperatures_select])

		factures_type_nb = mysql.select_factures_type_nb()
		factures_type_nb = [[a.title(),b] for a,b in factures_type_nb]

		factures_by_type_select = mysql.select_factures_by_type(1)
		factures_by_type = {"electricité":[[], [], []], "eau":[[], [], []], "gaz":[[], [], []]}
		for f in factures_by_type_select:
			factures_by_type[f[0]][0].append(f[1])
			factures_by_type[f[0]][1].append(f[2])
			factures_by_type[f[0]][2].append(f[3])

		factures_proportion = {}
		factures_proportion["consommation"] = [["Eau", factures_by_type["eau"][1][-1]],
										 ["Electricité", factures_by_type["electricité"][1][-1]],
										 ["Gaz", factures_by_type["gaz"][1][-1]]]
		factures_proportion["montant"] = [["Eau", factures_by_type["eau"][0][-1]],
										 ["Electricité", factures_by_type["electricité"][0][-1]],
										 ["Gaz", factures_by_type["gaz"][0][-1]]]

		# templates.env.globals["temperatures"] = temperatures
		return templates.TemplateResponse("consommation.html", {"request": request, "factures_type_nb": factures_type_nb, "factures_by_type": factures_by_type, "factures_proportion": factures_proportion})

@app.get("/configuration")
@app.get("/configuration.html")
async def configuration(request: Request):

	mesures_by_capteur = mysql.select_mesures_by_capteur()
	for k,v in mesures_by_capteur.items():
		v2 = [[a for a,b in v]]
		v2.append([b for a,b in v])
		mesures_by_capteur[k] = v2

	capteurs = mysql.select_capteurs()

	return templates.TemplateResponse("configuration.html", {"request": request, "mesures_by_capteur": mesures_by_capteur, "capteurs":capteurs})


@app.get("/users-profile")
async def index(request: Request):
		return templates.TemplateResponse("users-profile.html", {"request": request})


@app.get("/pages-faq/")
@app.get("/pages-faq.html/")
async def pagesfaq(request: Request):
	return templates.TemplateResponse("pages-faq.html", {"request":request})


class AddCapteurRequest(BaseModel):
    reference: str
    port: int
    unite: str
    precision: float


@app.post("/add_capteur")
def add_capteur(request: AddCapteurRequest):
	reference = request.reference
	port = request.port
	unite = request.unite
	precision = request.precision
	
	mysql.add_capteur_with_type(reference, port, unite, precision)
	
	return {"message": "Capteur added successfully"}


class DeleteCapteurRequest(BaseModel):
    reference: str
    port: int
    date_insertion: str

@app.delete("/delete_capteur")
def delete_capteur(request: DeleteCapteurRequest):
	reference = request.reference
	port = request.port
	date_insertion = request.date_insertion
	
	
	r_code = mysql.delete_capteur(reference, port, date_insertion)
	if(r_code == 0): 
		return {"message": "Capteur deleted successfully"}
	else:
		raise HTTPException(status_code=404, detail="Capteur not found")

class DeleteMesureRequest(BaseModel):
    capteur: str
    valeur: float
    date: str

@app.delete("/delete_mesure")
def delete_mesure(request: DeleteMesureRequest):
	capteur = request.capteur
	valeur = request.valeur
	date = request.date
	
	
	r_code = mysql.delete_mesure(capteur, valeur, date)
	if(r_code == 0): 
		return {"message": "Measurement deleted successfully"}
	else:
		raise HTTPException(status_code=404, detail="Measurement not found")

@app.get("/{table}/")
async def table(table : str):
	response = mysql.select_full(table)
	return response


@app.post("/{table}/")
async def table(table : str, request: Request):
	if table == "Mesure":
		query = request.query_params
		query_temperature = {"valeur":query["temperature"], "id_capteur":1}
		mysql.insert(table,query_temperature)
		query_humidity = {"valeur":query["humidity"], "id_capteur":2}
		mysql.insert(table,query_humidity)
	else:
		mysql.insert(table, request.query_params)


if __name__ == "__main__":
	uvicorn.run(app, host="0.0.0.0", port=8000)
