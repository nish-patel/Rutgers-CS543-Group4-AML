#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Title: create_csvs_for_neo4j_import.py
Description: Create transaction and account csv's for import into neo4j
Author: Nish Patel
Date: 11/11/23
Version:
    v1  (mm/dd/yyyy): initial script
"""

import pandas as pd
import os
import time
import numpy as np

print_neo4j = False
print_graphcity = True

t1 = time.time()

#clean data file path
csv_file_path = '/common/users/shared/cs543_group4/clean_data/clean_data.csv'
# csv_file_path = '/Users/npatel/Downloads/clean_data_small.csv'

#load csv (add dtypes as category to save memory)
df = pd.read_csv(csv_file_path, dtype={'bank_from':'category','bank_to':'category','currency_to':'category','currency_from':'category','payment_format':'category','is_laundering':'category','month':'category','year':'category','day':'category','hour':'category','minute':'category','unique_id_from':'category','unique_id_to':'category', 'amount_usd':np.float64})

t2 = time.time()
print('df read, time = %d seconds' %(t2-t1))

#create node df's
account_df_from = df[['unique_id_from', 'bank_from', 'is_laundering']]
account_df_from = account_df_from.rename(columns={'unique_id_from':'unique_id', 'bank_from':'bank'})
account_df_to = df[['unique_id_to', 'bank_to', 'is_laundering']]
account_df_to = account_df_to.rename(columns={'unique_id_to':'unique_id', 'bank_to':'bank'})

#concat dfs
account_df = pd.concat([account_df_from,account_df_to])

#sort account_df to make sure we keep the laundering = 1 when we drop duplicates
account_df = account_df.sort_values(by='is_laundering', ascending=False)

#drop duplicates with subset of unique_id and bank
account_df = account_df.drop_duplicates(subset=['unique_id', 'bank'], keep='first')

#add node label
account_df['label'] = 'account'

t3 = time.time()
print('accounts complete, time = %d seconds' %(t3-t2))

#create edge df's
transaction_df = df[['unique_id_from','unique_id_to','amount_usd', 'currency_from', 'currency_to', 'bank_from', 'bank_to','payment_format', 'is_laundering', 'year', 'month', 'day', 'hour', 'minute']]
transaction_df = transaction_df.drop_duplicates()

#add relationship type
transaction_df['type'] = 'transaction'

t4 = time.time()
print('transactions complete, time = %d seconds' %(t4-t3))



if print_neo4j:
    #save csv files
    output_path = '/common/users/shared/cs543_group4/neo4j_import'
    # output_path = '/Users/npatel/Downloads/'
    
    account_df.to_csv(os.path.join(output_path, 'accounts.csv'), sep = ',', index = False, header = False)
    t5 = time.time()
    print('account csv printed, time = %d seconds' %(t5-t4))

    transaction_df.to_csv(os.path.join(output_path, 'transactions.csv'), sep = ',', index = False, header = False)
    t6 = time.time()
    print('transaction csv printed, time = %d seconds' %(t6-t5))
else:
    t6 = t4

if print_graphcity:
    #define graph city output path
    output_path = '/common/users/shared/cs543_group4/graph_city_files'
    # output_path = '/Users/npatel/Downloads/'
    
    #get only accountID as a df for graph city label file
    account_graph_city_df = account_df[['unique_id']]

    #sort account_graph_city_df by accountID for indexing for graph city
    account_graph_city_df = account_graph_city_df.sort_values(by='unique_id', ascending=False)

    #convert index to column
    account_graph_city_df = account_graph_city_df.reset_index()
    
    #drop index as the index was not sorted
    account_graph_city_df = account_graph_city_df.drop(columns = ['index'])
    
    #reconvert index to column
    account_graph_city_df = account_graph_city_df.reset_index()
    
    #output label csv for graph city
    account_graph_city_df.to_csv(os.path.join(output_path, 'aml_label.csv'), header = False, index = False)
    
    t7 = time.time()
    print('account graph city csv printed, time = %d seconds' %(t7-t6))
    
    #take only account from and to
    txn_graph_city_df = transaction_df[['unique_id_from','unique_id_to']]

    #merge from with uniqueid
    txn_graph_city_df_merged = txn_graph_city_df.merge(account_graph_city_df, left_on='unique_id_from', right_on='unique_id')

    #rename and drop unneeded columns
    txn_graph_city_df_merged = txn_graph_city_df_merged.rename(columns={'index':'index_from'})
    txn_graph_city_df_merged = txn_graph_city_df_merged.drop(columns=['unique_id_from', 'unique_id'])
    
    #repeat for to
    txn_graph_city_df_merged = txn_graph_city_df_merged.merge(account_graph_city_df, left_on='unique_id_to', right_on='unique_id')
    txn_graph_city_df_merged = txn_graph_city_df_merged.rename(columns={'index':'index_to'})
    txn_graph_city_df_merged = txn_graph_city_df_merged.drop(columns=['unique_id_to', 'unique_id'])
    
    #output edge txt for graph city
    np.savetxt(os.path.join(output_path, 'aml.txt'), txn_graph_city_df_merged, fmt='%i', delimiter='\t')
    
    t8 = time.time()
    print('transaction graph city txt printed, time = %d seconds' %(t8-t7))
else:
    t8 = t6
print('script complete, time = %d seconds' %(t8-t1))