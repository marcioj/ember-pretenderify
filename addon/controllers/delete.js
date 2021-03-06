import { singularize } from '../utils/inflector';
import BaseController from './base';

/*
  Shorthands for DELETE requests.
*/
export default BaseController.extend({

  /*
    Remove the model from the store of type *type*.

    This would remove the user with id :id:
      Ex: this.stub('delete', '/contacts/:id', 'user');
  */
  stringHandler: function(type, store, request) {
    var id = this._getIdForRequest(request);
    var data = store.remove(type, id);

    return undefined;
  },

  /*
    Remove the model and child related models from the store.

    This would remove the contact with id `:id`, and well
    as this contact's addresses and phone numbers.
      Ex: this.stub('delete', '/contacts/:id', ['contact', 'addresses', 'numbers');
  */
  arrayHandler: function(array, store, request) {
    var id = this._getIdForRequest(request);
    var parentType = array[0];
    var types = array.slice(1);

    store.remove(parentType, id);

    var query = {};
    var parentIdKey = parentType + '_id';
    query[parentIdKey] = id;

    types.forEach(function(type) {
      store.removeQuery(type, query);
    });

    return undefined;
  },

  /*
    Remove the model from the store based on singular version
    of the last portion of the url.

    This would remove contact with id :id:
      Ex: this.stub('delete', '/contacts/:id');
  */
  undefinedHandler: function(undef, store, request) {
    var id = this._getIdForRequest(request);
    var url = this._getUrlForRequest(request);
    var urlNoId = id ? url.substr(0, url.lastIndexOf('/')) : url;
    var type = singularize(urlNoId.substr(urlNoId.lastIndexOf('/') + 1));

    var data = store.remove(type, id);

    return undefined;
  },
});
