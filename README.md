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


note: the following files are too large for github

	- HI-Large_Trans.csv and HI-Small_Trans.csv can be downloaded here: https://www.kaggle.com/datasets/ealtman2019/ibm-transactions-for-anti-money-laundering-aml
	- clean_data.csv and clean_data_small.csv need to be generated via data_preprocessing.ipynb
	- aml.txt needs to be generated via create_csvs_for_neo4j_import.py for use in graph city
	- edges.csv needs to be generated via NN Project 2/create_features_gcn.py (clean_data.csv is an input to this script so that needs to be generated first)