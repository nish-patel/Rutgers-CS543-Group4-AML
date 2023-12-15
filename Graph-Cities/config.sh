#!/bin/sh
sed -i '1c export const strataAddress = "http://127.0.0.1:5001/"' fpViewer/localLib/strata.js
sed -i '2c node app.js temp=./temp port=5001' graph-strata/run.sh
sed -i '13c const localPort = 5000' Graph_City_Web/app_addon.js
sed -i '16c const strataAddress = "http://127.0.0.1:5001/"' Graph_City_Web/app_addon.js
sed -i '24c const hostAddress = "http://127.0.0.1:5000"' Graph_City_Web/scripts/main.js
sed -i '25c const localHost = `http://127.0.0.1:5000/`' Graph_City_Web/scripts/main.js
sed -i '8c const localHost = `http://127.0.0.1:5000/`' Graph_City_Web/scripts/dag_view_server.js
sed -i '9c const hostAddress = "http://127.0.0.1:5000"' Graph_City_Web/scripts/dag_view_server.js
sed -i '11c var PREFIX = "http://127.0.0.1:5001/"' Graph_City_Web/scripts/dag_view_server.js
