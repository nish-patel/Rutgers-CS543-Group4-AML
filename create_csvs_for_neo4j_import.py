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

t1 = time.time()

# Specify the path to your CSV file
csv_file_path = '/common/users/shared/cs543_group4/clean_data/clean_data.csv'

# Load CSV data into a Pandas DataFrame
df = pd.read_csv(csv_file_path)

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

#save csv files
output_path = '/common/home/nsp124'

account_df.to_csv(os.path.join(output_path, 'accounts.csv'), sep = ',', index = False, header = False)
t5 = time.time()
print('account csv printed, time = %d seconds' %(t5-t4))

transaction_df.to_csv(os.path.join(output_path, 'transactions.csv'), sep = ',', index = False, header = False)
t6 = time.time()
print('transaction csv printed, time = %d seconds' %(t6-t5))
print('script complete, time = %d seconds' %(t6-t1))