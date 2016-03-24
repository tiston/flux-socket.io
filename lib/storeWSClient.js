/*
  Author: GASPARI Baptiste
  This class create a store client over socket.io websocket
  
  it bind store update stream from the flux ws server and dispatch changed state to the view
*/

'use strict'

import { EventEmitter } from 'events';
import invariant from 'fbjs/lib/invariant';
const CHANGE_EVENT = 'change event';

class storeWSClient extends EventEmitter {
  constructor(name, dispatcher) {
    super();
    this._data = {};
    this._storeName = name;
    this._dispatcher = dispatcher;
    this._dispatcher.dispatch('store connect', this._dispatcher.getClientID(), this._storeName);
    
    this._dispatcher.registerStore(this._storeName, (data) => {
      this._data = data;
      this.emitChange();
    });
  }
  
  getStoreName = () => {
    return this._storeName;
  }
  
  getStoreData = () => {
    return this._data;
  }
  
  emitChange = () => {
    this.emit(CHANGE_EVENT);
  }
  
  addChangeListener = (callback) => {
    this.on(CHANGE_EVENT, callback);
  }
  
  removeChangeListener = (callback) => {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

export default storeWSClient;