#!/usr/bin/env node

'use strict';

const dgram = require('dgram');

if(!process.argv[2]){
    console.log('Error: No blid supplied');
    process.exit(1);
}

const blid = process.argv[2];

getRobotIP();

function getRobotIP () {
    const server = dgram.createSocket('udp4');

  server.on('error', (err) => {
    console.log(new Error(err));
    server.close();
  });

  server.on('message', (msg) => {
    try {
      let parsedMsg = JSON.parse(msg);
      if (parsedMsg.hostname && parsedMsg.ip && ((parsedMsg.hostname.split('-')[0] === 'Roomba') || (parsedMsg.hostname.split('-')[0] === 'iRobot'))) {
        if(parsedMsg.hostname.split('-')[1] === blid){
            server.close();
            console.log(parsedMsg.ip);
            process.exit(0);
        }
      }
    } catch (e) {}
  });

  server.on('listening', () => {
    //console.log('Looking for robots...');
  });

  server.bind(5678, function () {
    const message = new Buffer.from('irobotmcs');
    server.setBroadcast(true);
    server.send(message, 0, message.length, 5678, '255.255.255.255');
  });
  /*
  const server = dgram.createSocket('udp4');

  server.on('error', (err) => {
    server.close();
    console.log(new Error(err));
    process.exit(1);
  });

  server.on('message', (msg) => {
    try {
      let parsedMsg = JSON.parse(msg);
      if (parsedMsg.hostname && parsedMsg.ip && ((parsedMsg.hostname.split('-')[0] === 'Roomba') || (parsedMsg.hostname.split('-')[0] === 'iRobot'))) {
        parsedMsg.blid = parsedMsg.hostname.split('-')[1];
        if(parsedMsg.blid === blid){
            server.close();
            console.log(parsedMsg.ip)
            process.exit(1);
        }
      }
    } catch (e) {}
  });

  server.bind(5678, function () {
    const message = new Buffer.from('irobotmcs');
    server.setBroadcast(true);
    server.send(message, 0, message.length, 5678, '255.255.255.255');
  });
  */
}