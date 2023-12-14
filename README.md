# Rutgers-CS543-Group4-AML

data_preprocessing.ipynb takes the raw data and converts it to clean_data.csv

create_csvs_for_neo4j_import.py converts clean_data.csv into the nodes and edges files required by neo4j as well as creates the files needed by graph cities

once accounts.csv and transactions.csv are created, they need to be included in neo4j-community-5.13.0/import

then you can create the neo4j database to import this data via ./bin/neo4j-admin database import full --nodes=import/accounts-header.csv,import/accounts.csv --relationships=import/transactions-header.csv,import/transactions.csv neo4j --overwrite-destination
	this will overwrite any data in your neo4j database
	importing data without this batch function took way too long and was aborted before finishing (it ran for over 12 hours without finishing before aborting)

you can start neo4j with ./bin/neo4j console

modified graph city code is also included and will link the graph city to the visualization application

once neo4j and graph cities are both running, search.html can be run either via a node server or locally via a web browser.