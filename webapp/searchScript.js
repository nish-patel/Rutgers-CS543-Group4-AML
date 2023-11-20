//efeb5a6214865c59c9d769d5b37107fcfc9a473536519f31efa2486bc471fa49,fbe351a2b24e27e8478bb02be5e5f35b3fd639b15057b9c46282f270e860b719, launder: ca2c01c2227c6a6c37cbd18b5f29dd5ea91557c7f9bc44d38314f033f7ab9283
function performSearch() {
    // Retrieve user input values
    var fromDate = document.getElementById('fromDate').value;
    var toDate = document.getElementById('toDate').value;
    var isLaundering = document.getElementById('isLaundering').value;
    var accountIDInput = document.getElementById('accountID');
    var accountIDs = accountIDInput.value.split(',');
    var minAmount = document.getElementById('minAmount').value;
    var maxAmount = document.getElementById('maxAmount').value;

    // Retrieve badges
    var accountIDBadges = document.getElementById('accountIDBadges');
    var badgeCount = accountIDBadges.childElementCount;

    // Use a Set to store unique account IDs
    var uniqueAccountIDs = new Set();

    // Add entered account IDs to the Set
    accountIDs.forEach(id => uniqueAccountIDs.add(id.trim()));

    // If there are badges, add them to the accountIDs
    if (badgeCount > 0) {
        for (var i = 0; i < badgeCount; i++) {
            uniqueAccountIDs.add(accountIDBadges.children[i].textContent.trim());
        }
    }

    // Save unique account IDs in local storage
    localStorage.setItem('uniqueAccountIDs', JSON.stringify(Array.from(uniqueAccountIDs)))

    // Convert accountIDs to a string representation with single quotes
    var accountIDString = Array.from(uniqueAccountIDs).map(id => "'" + id + "'").join(',');

    // Convert date strings to Date objects
    var fromDate = parseLocalDate(fromDate);
    var toDate = parseLocalDate(toDate);

    // Build the Cypher query based on user input
    var cypherQuery = 'MATCH path = (root)-[rel*1..2]-(connected) WHERE root.accountID IN [' + accountIDString + '] AND root <> connected';
    
    // Initialize relation query
    var relQuery = ' AND ALL(r in rel WHERE '

    // Parse user input and add to relation query
    if (fromDate & toDate){
        // Extract year, month, and day components
        var fromYear = fromDate.getFullYear();
        var fromMonth = fromDate.getMonth() + 1; // Month is zero-based, so add 1
        var fromDay = fromDate.getDate();

        var toYear = toDate.getFullYear();
        var toMonth = toDate.getMonth() + 1;
        var toDay = toDate.getDate();

        localStorage.setItem('fromDate', fromMonth + '/' + fromDay + '/' + fromYear)
        localStorage.setItem('toDate', toMonth + '/' + toDay + '/' + toYear)

        relQuery += ' (date({year: r.year, month: r.month, day: r.day}) >= date({year: ' + fromYear+ ', month: ' + fromMonth + ', day: ' + fromDay + '}) and date({year: r.year, month: r.month, day: r.day}) <= date({year: ' + toYear + ', month: ' + toMonth + ', day: ' + toDay + '}))';
    }
    else if (fromDate){
        // Extract year, month, and day components
        var fromYear = fromDate.getFullYear();
        var fromMonth = fromDate.getMonth() + 1; // Month is zero-based, so add 1
        var fromDay = fromDate.getDate();

        localStorage.setItem('fromDate', fromMonth + '/' + fromDay + '/' + fromYear)

        relQuery += ' date({year: r.year, month: r.month, day: r.day}) >= date({year: ' + fromYear+ ', month: ' + fromMonth + ', day: ' + fromDay + '})';
    }
    else if (toDate){
        var toYear = toDate.getFullYear();
        var toMonth = toDate.getMonth() + 1;
        var toDay = toDate.getDate();

        localStorage.setItem('toDate', toMonth + '/' + toDay + '/' + toYear)

        if(relQuery != ' AND ALL(r in rel WHERE '){
            relQuery += ' AND'
        }

        relQuery += ' date({year: r.year, month: r.month, day: r.day}) <= date({year: ' + toYear + ', month: ' + toMonth + ', day: ' + toDay + '})';
    }
    else{
        localStorage.setItem('fromDate', '')
        localStorage.setItem('toDate', '')
    }
    
    if (isLaundering === 'true') {
        if(relQuery != ' AND ALL(r in rel WHERE '){
            relQuery += ' AND'
        }

        localStorage.setItem('txn_type', 'Only Laundering Transactions')
        
        relQuery += ' r.is_laundering = 1';
    } else if (isLaundering === 'false') {
        if(relQuery != ' AND ALL(r in rel WHERE '){
            relQuery += ' AND'
        }

        localStorage.setItem('txn_type', 'Only Non-Laundering Transactions')

        relQuery += ' r.is_laundering = 0';
    } else if (isLaundering === 'both') {
        localStorage.setItem('txn_type', 'All Transactions')
    }

    if (minAmount >0 & maxAmount > 0){
        if(relQuery != ' AND ALL(r in rel WHERE '){
            relQuery += ' AND'
        }

        localStorage.setItem('minAmount', minAmount)
        localStorage.setItem('maxAmount', maxAmount)

        relQuery += ' r.amount_usd <= ' + maxAmount + ') and (r.amount_usd >= ' + minAmount
    }
    else if (minAmount > 0){
        if(relQuery != ' AND ALL(r in rel WHERE '){
            relQuery += ' AND'
        }

        localStorage.setItem('minAmount', minAmount)

        relQuery += ' r.amount_usd >= ' + minAmount
    } else if (maxAmount > 0){
        if(relQuery != ' AND ALL(r in rel WHERE '){
            relQuery += ' AND'
        }

        localStorage.setItem('maxAmount', maxAmount)

        relQuery += ' r.amount_usd <= ' + maxAmount
    }
    else{
        localStorage.setItem('minAmount', '')
        localStorage.setItem('maxAmount', '')
    }


    // If we have any relation conditions, add to cypher query
    if(relQuery != ' AND ALL(r in rel WHERE '){
        relQuery += ')'
        cypherQuery += relQuery
    }

    // Add return to cypher query
    cypherQuery += ' RETURN DISTINCT root, connected, relationships(path) AS rels;';
           
    queryDB(cypherQuery, uniqueAccountIDs)
}

function parseLocalDate(dateString) {
    // Check if the input string is null or empty
    if (!dateString) {
        return null;
    }

    // Parse the input string as a local date
    var dateParts = dateString.split('-');
    var year = parseInt(dateParts[0]);
    var month = parseInt(dateParts[1]) - 1; // Month is zero-based, so subtract 1
    var day = parseInt(dateParts[2]);

    // Check if the parsed date is valid
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return null;
    }

    return new Date(year, month, day);
}

function queryDB(cypherQuery,) {
    
    
    // Encode the cypherQuery parameter
    var encodedQuery = encodeURIComponent(cypherQuery);

    // Store the encoded query in localStorage
    localStorage.setItem('encodedQuery', encodedQuery);
    
    // Redirect to the new HTML page with the graph visualization
    window.location.href = 'graph-visualization.html';
}
