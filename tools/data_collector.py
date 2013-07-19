#!/bin/env python
#coding=utf-8
'''
Created on 2013-7-19
@author: zhaolin.huang
收集bitcoin的交易数据
'''
import MySQLdb
import urllib
import json
import threading
import time

cnnPool =[MySQLdb.connect(host="localhost", user="root", passwd="5527193", db="bitcoin"),MySQLdb.connect(host="jolinhuang.com", user="root", passwd="5527193", db="bitcoin"),MySQLdb.connect(host="jolinhuang.com", user="root", passwd="5527193", db="bitcoin")]
URL={"trade":"http://info.btc123.com/lib/jsonProxyEx.php?type=btcchinaTrade2","buyAndSell":"http://info.btc123.com/lib/jsonProxyEx.php?type=btcchinaDepth"}
class TradeData(object):
	"""docstring for TradeData"""
	datetime=""
	price=""
	num=""
	orignal=""
	trade_num=""
	trade_id=""
	def __init__(self, parameters):
		for key in dict(parameters).keys():
			self.__dict__[key]=dict(parameters).get(key)
	def insert_to_db(self,cnn):
		cnn.cursor().execute("insert into trade_data(datetime,price,num,orignal,trade_num,trade_id) values('%s',%s,%s,'%s',%s,%s)"%(self.datetime,self.price,self.num,self.orignal,self.trade_num,self.trade_id))
		cnn.commit()
class BaseData(object):
	"""docstring for BaseData"""
	datetime=""
	price=""
	num=""
	def __init__(self, parameters):
		for key in dict(parameters).keys():
			self.__dict__[key]=dict(parameters).get(key)
class BuyData(BaseData):
	"""docstring for BuyData"""
	def __init__(self, parameters):
		super(BuyData, self).__init__(parameters)
	def insert_to_db(self,cnn):
		cnn.cursor().execute("insert into buy_data(datetime,price,num) values('%s',%s,%s)"%(self.datetime,self.price,self.num))
		cnn.commit()
class SellData(object):
	"""docstring for SellData"""
	def __init__(self, parameters):
		super(BuyData, self).__init__(parameters)
	def insert_to_db(self,cnn):
		cnn.cursor().execute("insert into sell_data(datetime,price,num) values('%s',%s,%s)"%(self.datetime,self.price,self.num))
		cnn.commit()
class DataCollectorFactory(object):
	"""docstring for DataCollectorFactory"""
	data_url=None
	data_type=None
	cnn=None
	def __init__(self, data_url,data_type,cnn):
		data_url=data_url
		data_type=data_type
	def trade_data_handle(self,json_data):
		cursor.execute("select max(trade_id) from trade_data")
		max_trade_id=cursor.fetchone()[0]
		for data in json_data:
			tradeData=TradeData(zip(["datetime","price","num","orignal","trade_num","trade_id"],[time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(int(data["date"]))),data["price"],data["amount"],data["tid"]]))
			if max_trade_id < tradeData.trade_id:
				tradeData.insert_to_db(self.cnn)
	def buy_data_handle(self,json_data):
		for data in json_data:
			buyData=BuyData(zip(["datetime","price","num"],[time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time())),data[0],data[1]]))
			buyData.insert_to_db(self.cnn)
	def sell_data_handle(self,json_data):
		for data in json_data:
			buyData=BuyData(zip(["datetime","price","num"],[time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time())),data[0],data[1]]))
			buyData.insert_to_db(self.cnn)
	def collect_data(self):
		json_data=json.loads(list(urllib.urlopen(self.data_url))[0])
		if self.data_type == TradeData:
			self.trade_data_handle(json_data)
		if self.data_type == BuyData:
			self.buy_data_handle(json_data)
		if self.data_type==SellData:
			self.sell_data_handle(json_data)
if __name__ == "__main__":
	while True:
		threading.Thread(target=DataCollectorFactory(URL["trade"].collect_data(),TradeData,cnnPool[0])).start()
		threading.Thread(target=DataCollectorFactory(URL["trade"].collect_data(),TradeData,cnnPool[0])).start()
		threading.Thread(target=DataCollectorFactory(URL["trade"].collect_data(),TradeData,cnnPool[0])).start()
		time.sleep(20)