import datetime
import os
from typing import Callable, Optional
import pandas as pd
from sklearn import preprocessing
import numpy as np
import time

start = time.time()

#read clean csv
path = '/Users/npatel/Downloads/clean_data_small.csv'
# path = '/common/users/shared/cs543_group4/clean_data/clean_data.csv'
# df = pd.read_csv(path, dtype={'bank_from':'category','bank_to':'category','currency_to':'category','currency_from':'category','payment_format':'category','is_laundering':'category','month':'category','year':'category','day':'category','hour':'category','minute':'category','unique_id_from':'category','unique_id_to':'category', 'amount_usd':np.float64})
df = pd.read_csv(path)

print('clean_data read in, size = %d rows' %len(df))

#label encode payment_format, currency_to, currency_from 
df['payment_format'] = preprocessing.LabelEncoder().fit_transform(df['payment_format'].astype(str))
df['currency_to'] = preprocessing.LabelEncoder().fit_transform(df['currency_to'].astype(str))
df['currency_from'] = preprocessing.LabelEncoder().fit_transform(df['currency_from'].astype(str))

print('label encoding done')

#use robust scaler to scale usd columns
df['amount_usd'] = preprocessing.RobustScaler().fit_transform(df[['amount_usd']])

print('usd scaled')

laundering_df = df[df['is_laundering'] == 1]

#get unique accounts to use as nodes
account_df_from = df[['unique_id_from', 'bank_from', 'is_laundering']]
account_df_from = account_df_from.rename(columns={'unique_id_from':'unique_id', 'bank_from':'bank'})
account_df_to = df[['unique_id_to', 'bank_to', 'is_laundering']]
account_df_to = account_df_to.rename(columns={'unique_id_to':'unique_id', 'bank_to':'bank'})
account_df = pd.concat([account_df_from,account_df_to])
account_df = account_df.drop_duplicates()

del account_df_from
del account_df_to

#convert unique_id to integers
int_df = account_df[['unique_id']]
int_df = int_df.sort_values(by='unique_id', ascending=False)
int_df = int_df.reset_index()
int_df = int_df.drop(columns = ['index'])
int_df = int_df.reset_index()
int_df = int_df.rename(columns={'index':'unique_id_int'})

account_df = pd.merge(account_df, int_df)
account_df = account_df[['unique_id_int', 'bank', 'is_laundering']]

print('account_df created')

df = pd.merge(df, int_df, left_on = 'unique_id_from', right_on = 'unique_id')
df = df.rename(columns={'unique_id_int':'unique_id_from_int'})
df = df.drop(columns=['unique_id_from', 'unique_id'])

df = pd.merge(df, int_df, left_on = 'unique_id_to', right_on = 'unique_id')
df = df.rename(columns={'unique_id_int':'unique_id_to_int'})
df = df.drop(columns=['unique_id_to', 'unique_id'])

#add transactions_from, transactions_to, total_usd_from, total_usd_to, avg_usd_from, avg_usd_to,total_currencies_from, total_currencies_to as node features
transactions_from = df.groupby('unique_id_from_int')['unique_id_from_int'].count()
account_df = account_df.merge(transactions_from, how='left', left_on='unique_id_int', right_index=True)
account_df = account_df.rename(columns={'unique_id_from_int': 'transactions_from'})
del transactions_from

transactions_to = df.groupby('unique_id_to_int')['unique_id_to_int'].count()
account_df = account_df.merge(transactions_to, how='left', left_on='unique_id_int', right_index=True)
account_df = account_df.rename(columns={'unique_id_to_int': 'transactions_to'})
del transactions_to

total_usd_from = df.groupby('unique_id_from_int')['amount_usd'].sum()
account_df = account_df.merge(total_usd_from, how='left', left_on='unique_id_int', right_index=True)
account_df = account_df.rename(columns={'amount_usd': 'total_usd_from'})
del total_usd_from

total_usd_to = df.groupby('unique_id_to_int')['amount_usd'].sum()
account_df = account_df.merge(total_usd_to, how='left', left_on='unique_id_int', right_index=True)
account_df = account_df.rename(columns={'amount_usd': 'total_usd_to'})
del total_usd_to

avg_usd_from = df.groupby('unique_id_from_int')['amount_usd'].mean()
account_df = account_df.merge(avg_usd_from, how='left', left_on='unique_id_int', right_index=True)
account_df = account_df.rename(columns={'amount_usd': 'avg_usd_from'})
del avg_usd_from

avg_usd_to = df.groupby('unique_id_to_int')['amount_usd'].mean()
account_df = account_df.merge(avg_usd_to, how='left', left_on='unique_id_int', right_index=True)
account_df = account_df.rename(columns={'amount_usd': 'avg_usd_to'})
del avg_usd_to

total_currencies_from = df.groupby('unique_id_from_int')['currency_from'].nunique()
account_df = account_df.merge(total_currencies_from, how='left', left_on='unique_id_int', right_index=True)
account_df = account_df.rename(columns={'currency_from': 'total_currencies_from'})
del total_currencies_from

total_currencies_to = df.groupby('unique_id_to_int')['currency_to'].nunique()
account_df = account_df.merge(total_currencies_to, how='left', left_on='unique_id_int', right_index=True)
account_df = account_df.rename(columns={'currency_to': 'total_currencies_to'})
del total_currencies_to

print('node features created')

#convert nan to 0
account_df = account_df.fillna(0)
df = df.fillna(0)

df.to_csv('/Users/npatel/Library/CloudStorage/Dropbox/Nish/Rutgers MSDS/3_2023F/Massive Data Storage/Project/NN Project 2/edges_small.csv', index = False, sep = ',')
account_df.to_csv('/Users/npatel/Library/CloudStorage/Dropbox/Nish/Rutgers MSDS/3_2023F/Massive Data Storage/Project/NN Project 2/nodes_small.csv', index = False, sep = ',')
int_df.to_csv('/Users/npatel/Library/CloudStorage/Dropbox/Nish/Rutgers MSDS/3_2023F/Massive Data Storage/Project/NN Project 2/node_lookup_small.csv', index = False, sep = ',')

# df.to_csv('/common/users/shared/cs543_group4/graph_csvs/edges.csv', index = False, sep = ',')
# account_df.to_csv('/common/users/shared/cs543_group4/graph_csvs/nodes.csv', index = False, sep = ',')
# int_df.to_csv('/common/users/shared/cs543_group4/graph_csvs/node_lookup.csv', index = False, sep = ',')

end = time.time()

print('csv printed, %s seconds' %(end-start))