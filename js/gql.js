// var com = com || {};
//     com.strife = com.strife || {};

(function (scope, overwrite = false) {

  let version = 1.0003;
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
    get: function() {
      return this[0];
    }
  });

  // Read-Only last property to Array
  Object.defineProperty(Array.prototype, 'last', {
    enumerable: false,
    configurable: false,
    get: function() {
      return this[this.length - 1];
    }
  });

  Object.defineProperty(Array.prototype, 'isEmpty', {
    enumerable: false,
    configurable: false,
    get: function() {
      return this.length === 0;
    }
  });

  Object.defineProperty(Array.prototype, 'hasItems', {
    enumerable: false,
    configurable: false,
    get: function() {
      return this.length > 0;
    }
  });

  // Constructor
  let gQ = (selector, context = doc) => {
    return q.query(selector, context);
  }

  gQ.uniqueId = (prefix = '') => {
    let now  = new Date();
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
      js.onload = function() {
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
  })

  gQ.whenSomethingIn = (statement, callback) => {
    if (statement) callback();
  }

  gQ.whenSomethingNotIn = (statement, callback) => {
    if (!statement) callback();
  }

  gQ.isNot = (statement) => !(statement);

  // Rewrite code diretly to windows to be more clear
  // TODO : manage case windows is not the root
  window.isNot = gQ.isNot;
  window.whenSomethingIn = gQ.whenSomethingIn;
  window.whenSomethingNotIn = gQ.whenSomethingNotIn;

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
  if (!scope.gQ || (overwrite && scope.gQ.version && scope.gQ.version() < version)) {
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

  class QueryFacade {
    constructor(adapter) {
      this.adapter = adapter;
    }

    create(adapter, lib, context) {

    }

    query(selector, context) {
      return new QueryFacade(this.adapter.query(selector, context));
    }

    text(value) {
      this.adapter.text(value);
    }
  }

  class NativeQuery {
    
    constructor(lib, context = doc) {
      this.lib = lib;
      this.context = context;
    }

    // Private Methods
    _getText() {
      let innerText = (this.context[0].innerText === undefined) ? 'textContent' : 'innerText';
      return this.context.reduce( (result, value) => `${result}${value[innerText]}`, "");
    }

    _setText(value) {
      let innerText = (this.context[0].innerText === undefined) ? 'textContent' : 'innerText';
      this.context.forEach( (el) => { el[innerText] = value; });
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

  gQ.ready( () => {
    q = new NativeQuery(doc);

    gQ.start();

    if (isNot(false && q && q.query && q.query('html:first-of-type'))) {
      if (true && 'jQuery' in scope) {
        gQ.loadJs('js/jquery.min.js', () => {
          q = new JQueryAdapter(jQuery, doc);
        });  
      } 
      else {
        gQ.loadJs('js/sizzle.min.js', () => {
          q = new SizzleAdapter(Sizzle, doc);
        });
      }
    };
  });

} (window, true));

gQ.ready(() => {
  let elements = [4, 45, 32, 43, 234, 2];
  let test = gQ('article');
  console.log(test.text('elise'));
});
