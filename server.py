#!/usr/bin/env python
#title           :application.py
#description     :A Flask server used to route HTTP requests to Airtime's Server
#author          :Joe Sangiorgio
#status          :Production
#date            :10-7-14
#version         :1.0
#usage           :python application.py
#=========================================================================

import flask
import socket
import urllib
import requests
import json
from flask.ext.cors import CORS
from flask import request

url = 'http://challenge2.airtime.com:7182'
headers = {'X-Labyrinth-Email': 'jsangio1@gmail.com'}

application = flask.Flask(__name__)
cors = CORS(application)

#Set application.debug=true to enable tracebacks on Beanstalk log output.
# application.debug=True

#routes for URL endpoints
START_ROUTE = "/start"
EXITS_ROUTE = "/exits"
MOVE_ROUTE = "/move"
WALL_ROUTE = "/wall"
REPORT_ROUTE = "/report"

#Get id for first room
@application.route(START_ROUTE)
def start():
    r = requests.get(url+START_ROUTE,headers=headers)
    return(r.text)

#Get exit information about current room
@application.route(EXITS_ROUTE)
def exits():
    roomId = request.args['roomId']
    r = requests.get(url+EXITS_ROUTE+"?roomId="+roomId,headers=headers)
    return(r.text)


#Get info about new room in specified direction
@application.route(MOVE_ROUTE)
def move():
    roomId = request.args['roomId']
    exit = request.args['exit']
    r = requests.get(url+MOVE_ROUTE+"?roomId="+roomId+"&exit="+exit,headers=headers)
    return(r.text)


#Get wall info properties
@application.route(WALL_ROUTE)
def wall():
    roomId = request.args['roomId']
    r = requests.get(url+WALL_ROUTE+"?roomId="+roomId,headers=headers)
    return(r.text)


#Route report JSON to POST endpoint
@application.route(REPORT_ROUTE, methods=["POST"])
def report():
    payload = {
        "roomIds": request.form.getlist('roomIds[]'),
        "challenge": request.form.get('challenge')
    }
    r = requests.post(url+REPORT_ROUTE,data=json.dumps(payload),headers=headers)
    return(r.text)

#start application
if __name__ == '__main__':
    application.run(host='0.0.0.0')
