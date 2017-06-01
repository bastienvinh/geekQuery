// var com = com || {};
//     com.strife = com.strife || {};

(function (scope, overwrite = false) {
  let version = 1.0003;
  let doc = window.document;
  let q;
  let qSingle;

  var gQ = (selector, context) => {
    return q.call(doc, selector);
  }

  gQ.loadJs = (path, callback) => {
    var js = doc.createElement('script');
        js.src = path;
        js.type = 'text/javascript';

    if (callback) {
      js.onload = callback;
      this.onload = this.onreadystatechange = null;
    }

    js.onreadystatechange = function () {
      if (this.readState == 'complete' && this.onload) {
        this.onload();
      }
    }

    doc.getElementsByTagName('head')[0].appendChild(js);
  }

  gQ.ready = (fun) => {
    var last = window.onload;
    var isReady = false;

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

  // qQ.isFunction = (name) => {
  //   return window.get('')
  // }

  let canSupportBrowserVersion = () => {
    // TODO : browser version sniffing
    return true;
  }

  let canSupport = () => {
    // TODO : verify that the code work with html 5 features and old browser are not here
    return canSupportBrowserVersion();
  }

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
    q = doc.querySelectorAll;
    qSingle = doc.querySelector;

    gQ.start();

    if (q && q.qSingle && q.qSingle.call(doc, 'html:first-of-type')) {
      //- ... TODO : load sizzle libs
    };
  });

  NativeQuery = function() {};
  NativeQuery.prototype.query = (selector, context) => {
    context = context || doc;

  }


} (window, true));

gQ.ready(() => {
  console.log(gQ('body'));
});

