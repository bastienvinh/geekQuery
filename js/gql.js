// var com = com || {};
//     com.strife = com.strife || {};
'use strict';

(function (scope, overwrite = false) {
  let version = 1.0005;

  class is {
    constructor() {
      throw new Error('Can\t instanciate instance. This is an utilities class.');
    }

    static function(obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    static array(value) {
      return Array.isArray(value);
    }

    static get version() {
      return version;
    }
  }

  // helper function which extracts params from arguments
  function getParams(args) {
    let params = [...args];
    let length = params.length;
    if (length === 1 && is.array(params[0])) {
      params = params[0];
    }
    return params;
  }

  // helper function which reverses the sense of predicate result
  function not(func) {
    return function () {
      return !func.apply(null, ...arguments);
    };
  }

  // helper function which call predicate function per parameter and return true if all pass
  function all(func) {
    return function () {
      let params = getParams(arguments);
      let length = params.length;
      for (let i = 0; i < length; i++) {
        if (!func.call(null, params[i])) {
          return false;
        }
      }

      return true;
    };
  }

  // helper function which call predicate function per parameter and return true if any pass
  function any(func) {
    return function () {
      let params = getParams(arguments);
      let length = params.length;
      for (let i = 0; i < length; i++) {
        if (func.call(null, params[i])) {
          return true;
        }
      }
      return false;
    };
  }

  // TODO : improve the wirting here
  function setInterfaces() {
    // TODO : improve it when ES7 will be released
    let options = ['array', 'function'];
    is.not = is.all = is.any = {};
    options.forEach((option) => {
      is.not[option] = not(is[option]);
      is.all[option] = all(is[option]);
      is.any[option] = any(is[option]);
    });
  }
  setInterfaces();

  if (!scope.is || (overwrite && scope.is.version && scope.is.version < version)) {
    scope.is = is;
    scope.not = not;
    scope.all = all;
    scope.any = any;
  }

}(window));

(function (scope, overwrite = false) {
  let version = 1.0005;
  class CallbackExecute {
    constructor(func) {
      if (!is.function(func))
        throw new Error('this is not a function');

      this.func = func;
      this.arguments = [];
    }

    static get version() {
      return version;
    }

    with() {
      this.arguments = [...arguments];
      return this;
    }

    if (statements) {
      if (!!(statements) === true && this.func != null) {
        console.log(this.arguments);
        this.func.call(null, ...this.arguments);
      }
    }

    ifNot(statements) {
      if (!!!(statements) === true && this.func != null) {
        this.func.call(null, ...this.arguments);
      }
    }
  }

  scope.execute = (func) => new CallbackExecute(func);

} (window));

(function (scope, overwrite = false) {

  let version = 1.0005;
  let doc = scope.document;
  var q;
  var scriptRegistry = new Array();

  // Array extensions
  // Remove the current Value in array
  Array.prototype.removeValue = function (value) {
    let indexOfElement = this.indexOf(value);
    this.splice(indexOfElement, 1);
    return this;
  }

  // Read-Only first property to Array
  Object.defineProperty(Array.prototype, 'first', {
    enumerable: false,
    configurable: false,
    get: function () {
      return this[0];
    }
  });

  // Read-Only last property to Array
  Object.defineProperty(Array.prototype, 'last', {
    enumerable: false,
    configurable: false,
    get: function () {
      return this[this.length - 1];
    }
  });

  Object.defineProperty(Array.prototype, 'isEmpty', {
    enumerable: false,
    configurable: false,
    get: function () {
      return this.length === 0;
    }
  });

  Object.defineProperty(Array.prototype, 'hasItems', {
    enumerable: false,
    configurable: false,
    get: function () {
      return this.length > 0;
    }
  });

  // Constructor
  let gQ = (selector, context = doc) => {
    return q.query(selector, context);
  }

  gQ.uniqueId = (prefix = '') => {
    let now = new Date();
    let months = now.getUTCMonth() < 10 ? `0${now.getUTCMonth()}` : now.geMonth().toString();
    let day = now.getDay() < 10 ? `0${now.getDay()}` : now.getDay().toString();
    let seconds = now.getSeconds();
    seconds = seconds < 10 ? `0${seconds}` : seconds.toString();
    let defaultNumber = Math.floor(Math.random(1, 100) * 100);
    return `${prefix}${now.getFullYear()}${months}${day}${seconds}${defaultNumber}`;
  }

  gQ.loadJs = (path, callback) => {
    let id = gQ.uniqueId('script-');
    let js = doc.createElement('script');
    js.src = path;
    js.type = 'text/javascript';
    js.defer = true;
    js.onload = js.onreadystatechange = null;
    js.dataset['identifier'] = id;

    if (callback) {
      // js.onload = callback;
      js.onload = function () {
        scriptRegistry.removeValue(id);
        callback();
      }
    }

    // That will place our scripts in the queues
    scriptRegistry.push(id);
    doc.body.insertBefore(js, doc.body.firstChild);
  }

  gQ.ready = (fun) => {
    function waitingReady() {
      if (scriptRegistry.hasItems)
        setTimeout(waitingReady, 1);
      else
        fun();
    }

    scope.addEventListener('load', waitingReady);
  }

  // Define a version properties for qQ (Read-only property)
  Object.defineProperty(gQ, 'version', {
    enumerable: false,
    configurable: false,
    get: () => version
  });

  class QueryFacade {
    constructor(adapter) {
      this.adapter = adapter;
    }

    query(selector, context) {
      return this.adapter.query(selector, context);
    }

    text(value) {
      return this.adapter.text(value);
    }

    static create(adapter, lib, context) {
      return new QueryFacade(new adapter(lib, context));
    }

    get dom() {
      return this.lib.context;
    }
  }

  /***********  Declaration Ticker ***********/
  var __instanceTicker;
  var _uniqSymbolInstanceTicker = Symbol('Ticker');
  class Ticker {
    constructor(symbol = null) {
      if (_uniqSymbolInstanceTicker != symbol)
        throw new Error('Forbidden new instance. Use Ticker.instance please.');
    }

    static get instance() {
      if (!__instanceTicker) __instanceTicker = new Ticker(_uniqSymbolInstanceTicker);
      return __instanceTicker;
    }
  }
  /***********  End Declaration Ticker ***********/

  let canSupportBrowserVersion = () => {
    // TODO : browser version sniffing
    return true;
  };

  let canSupport = () => {
    // TODO : verify that the code work with html 5 features and old browser are not here
    return canSupportBrowserVersion();
  };

  // Don't need to throw error
  // Load the code once or overwrite old version
  if (!scope.gQ || (overwrite && scope.gQ.version && scope.gQ.version < version)) {
    scope.gQ = gQ;
  }

  gQ.start = () => {
    // -- Nothing for now
    // TODO : create a event binding
  }

  // Convert into array
  // TODO : that's really bad, it's not using the single responsibility principle
  gQ.toArray = (item) => {
    var result = new Array();
    if (!item.length)
      return item;

    item.forEach((el) => {
      result.push(el);
    });

    return result;
  }

  class NativeQuery {

    constructor(lib, context = doc) {
      this.lib = lib;
      this.context = context;
    }

    // Private Methods
    _getText() {
      let innerText = (this.context[0].innerText === undefined) ? 'textContent' : 'innerText';
      return this.context.reduce((result, value) => `${result}${value[innerText]}`, "");
    }

    _setText(value) {
      let innerText = (this.context[0].innerText === undefined) ? 'textContent' : 'innerText';
      this.context.forEach((el) => { el[innerText] = value; });
      return value;
    }

    // Public methods

    query(selector, context = this.context) {
      return new NativeQuery(this.lib, gQ.toArray(context.querySelectorAll.call(context, selector)));
    }

    text(value) {
      return (value) ? this._setText(value) : this._getText();
    }
  }

  class SizzleAdapter extends NativeQuery {
    query(selector, context = doc) {
      return new SizzleAdapter(this.lib, gQ.toArray(this.lib(selector, context)));
    }
  }

  class JQueryAdapter extends NativeQuery {
    constructor(lib, context = doc) {
      super(lib, context);
      this.target = lib(context);
    }

    query(selector, context = this.context) {
      return new JQueryAdapter(this.lib, gQ.toArray(this.lib(selector, context).get()));
    }
  }

  gQ.ready(() => {
    // q = new NativeQuery(doc);
    q = QueryFacade.create(NativeQuery, null, doc);

    gQ.start();

    // TODO : modify to be readable
    if (!(false && q && q.query && q.query('html:first-of-type'))) {
      if (true && 'jQuery' in scope) {
        q = QueryFacade.create(JQueryAdapter, jQuery, doc);
      }
      else {
        gQ.loadJs('js/sizzle.min.js', () => {
          q = QueryFacade.create(SizzleAdapter, Sizzle, doc);
        });
      }
    };
  });

}(window, true));

gQ.ready(() => {
  let elements = [4, 45, 32, 43, 234, 2];
  let test = gQ('article');
  console.log(test.text('elise'));
});
