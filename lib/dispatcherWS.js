/*
  Author: GASPARI Baptiste
  This class permit to dispatch action to the flux websocket server 
  and bind some callbacks to the socket.io stream.
*/

'use strict'

import io from 'socket.io-client';
import invariant from 'fbjs/lib/invariant';

class dispatcherWSClient {
  constructor(url) {
    this._client = io.connect(url, {reconnect: true});
    this._clientID = Date.now();
    this._client.emit('factory connect', this._clientID);
  };
  
  getClientID = () => {
    return this._clientID;
  }
  
  /*
    Bind callbacks to the socket.io stream
    callbacks have to be an object containing function.
    
    The callback key will be the event name of socket.io stream and the value is the callback function.
  */
  register = (callbacks) => {
    invariant(
      typeof callbacks === 'object',
      'The callback collection is not an object but given : ' + typeof callbacks
    );
    
    Object.keys(callbacks).map(key => {
      invariant(
        typeof callbacks[key] === 'function',
        'The callback is not a function but given : ' + typeof callbacks[key] + ' for key : ' + key
      );
      this._client.on(key, (data) => {
        callbacks[key](data);
      });
    });
  }
  
  /*
    Used to bind store flux update over socket.io
  */
  registerStore = (storeName, callback) => {
    invariant(
      typeof callback === 'function',
      'The store update callback is not a function but given : ' + typeof callback
    );
    
    invariant(
      typeof storeName === 'string',
      'The store name is not a string but given : ' + typeof storeName
    );
    
    this._client.on(storeName + 'Update', (data) => {
        callback(data);
      });
  }
  
  dispatch = (action, ...data) => {
    this._client.emit(action, ...data);
  }
}

export default dispatcherWSClient;