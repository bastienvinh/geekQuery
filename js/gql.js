// var com = com || {};
//     com.strife = com.strife || {};

(function (scope, overwrite = false) {
  let version = 1.0003;
  let doc = scope.document;
  var q;
  var scriptQueues = new Array();
  var loadQueues = new Array();

  // Constructor
  let gQ = (selector, context = doc) => q.query(selector, context);

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
  })

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
      js.onload = callback;
      js.onload = function() {
        scriptQueues.removeValue(id);
        callback();
      }
    }

    // That will place our scripts in the queues
    scriptQueues.push(id);
    doc.body.insertBefore(js, doc.body.firstChild);
  }

  gQ.ready = (fun) => {
    function waitingReady() {
      if (scriptQueues.hasItems)
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

  class NativeQuery {
    query(selector, context = doc) {
      return context.querySelectorAll.call(context, selector);
    }
  }

  class SizzleAdapter {
    constructor(lib) {
      this.lib = lib;
    }
    query(selector, context = doc) {
      return this.lib(selector, context);
    }
  }


  class JQueryAdapter {
    constructor(lib) {
      this.lib = lib;
    }
    query(selector, context = doc) {
      return this.lib(selector, context).get();
    }
  }

  gQ.ready( () => {
    q = new NativeQuery();

    gQ.start();

    if (isNot(q && q.query && q.query('html:first-of-type'))) {
      if ('jQuery' in scope) {
        gQ.loadJs('js/jquery.min.js', () => {
          q = new JQueryAdapter(jQuery);
        });  
      } 
      else {
        gQ.loadJs('js/sizzle.min.js', () => {
          q = new SizzleAdapter(Sizzle);
        });
      }
    };
  });

  

} (window, true));

gQ.ready(() => {
  console.log(gQ('article', document.getElementsByClassName('articles')[0]));
});
