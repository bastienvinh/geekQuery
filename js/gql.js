// var com = com || {};
//     com.strife = com.strife || {};

(function (scope, overwrite = false) {
  let version = 1.0003;
  let doc = window.document;
  var q;

  let gQ = (selector, context = doc) => {
    return q.query(selector, context);
  }

  gQ.loadJs = (path, callback) => {
    var js = doc.createElement('script');
        js.src = path;
        js.type = 'text/javascript';
        js.defer = true;
        js.onload = js.onreadystatechange = null;

    if (callback) {
      js.onload = callback;
      
      js.onreadystatechange = function () {
        if (this.readState == 'complete' && this.onload) {
          this.onload();
        }
      }
    }

    

    // That will place the element after
    doc.body.insertBefore(js, doc.body.firstChild);
  }

  gQ.ready = (fun) => {
    let last = window.onload;
    let isReady = false;

    if (doc.addEventListener) {
      doc.addEventListener('DOMContentLoaded', function () {
        isReady = true;
      });
    }

    window.onload = function() {
      if (last) last();
      if (isReady) fun();
    }
  }

  /** Return version of the script */
  gQ.version = () => version;

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
  if (!window.gQ || (overwrite && window.gQ.version && window.gQ.version() < version)) {
    window.gQ = gQ;
  }

  gQ.start = () => {
    // -- Nothing for now
    // TODO : create a event binding
  }

  gQ.ready( () => {
    q = new NativeQuery();

    gQ.start();

    if (isNot(q && q.query && q.query('html:first-of-type'))) {
      //- ... TODO : load sizzle libs, it's not working because the script is loaded to late
      gQ.loadJs('js/sizzle.min.js', () => {
        q = new SizzleAdapter(Sizzle);
      });
    };
  });

  class NativeQuery {
    query(selector, context = doc) {
      // TODO : improve this code
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

} (window, true));

gQ.ready(() => {
  console.log(gQ('article', document.getElementsByClassName('articles')[0]));
});

