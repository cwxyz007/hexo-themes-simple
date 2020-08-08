(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	/* Zepto v1.2.0 - zepto event ajax form ie - zeptojs.com/license */

	(function (global, factory) {
	  factory(global);
	})(commonjsGlobal, function (window) {
	  var Zepto = function () {
	    var undefined$1,
	        key,
	        $,
	        classList,
	        emptyArray = [],
	        concat = emptyArray.concat,
	        filter = emptyArray.filter,
	        slice = emptyArray.slice,
	        document = window.document,
	        elementDisplay = {},
	        classCache = {},
	        cssNumber = {
	      'column-count': 1,
	      'columns': 1,
	      'font-weight': 1,
	      'line-height': 1,
	      'opacity': 1,
	      'z-index': 1,
	      'zoom': 1
	    },
	        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
	        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	        rootNodeRE = /^(?:body|html)$/i,
	        capitalRE = /([A-Z])/g,
	        // special attributes that should be get/set via method calls
	    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
	        adjacencyOperators = ['after', 'prepend', 'before', 'append'],
	        table = document.createElement('table'),
	        tableRow = document.createElement('tr'),
	        containers = {
	      'tr': document.createElement('tbody'),
	      'tbody': table,
	      'thead': table,
	      'tfoot': table,
	      'td': tableRow,
	      'th': tableRow,
	      '*': document.createElement('div')
	    },
	        readyRE = /complete|loaded|interactive/,
	        simpleSelectorRE = /^[\w-]*$/,
	        class2type = {},
	        toString = class2type.toString,
	        zepto = {},
	        camelize,
	        uniq,
	        tempParent = document.createElement('div'),
	        propMap = {
	      'tabindex': 'tabIndex',
	      'readonly': 'readOnly',
	      'for': 'htmlFor',
	      'class': 'className',
	      'maxlength': 'maxLength',
	      'cellspacing': 'cellSpacing',
	      'cellpadding': 'cellPadding',
	      'rowspan': 'rowSpan',
	      'colspan': 'colSpan',
	      'usemap': 'useMap',
	      'frameborder': 'frameBorder',
	      'contenteditable': 'contentEditable'
	    },
	        isArray = Array.isArray || function (object) {
	      return object instanceof Array;
	    };

	    zepto.matches = function (element, selector) {
	      if (!selector || !element || element.nodeType !== 1) return false;
	      var matchesSelector = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
	      if (matchesSelector) return matchesSelector.call(element, selector); // fall back to performing a selector:

	      var match,
	          parent = element.parentNode,
	          temp = !parent;
	      if (temp) (parent = tempParent).appendChild(element);
	      match = ~zepto.qsa(parent, selector).indexOf(element);
	      temp && tempParent.removeChild(element);
	      return match;
	    };

	    function type(obj) {
	      return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
	    }

	    function isFunction(value) {
	      return type(value) == "function";
	    }

	    function isWindow(obj) {
	      return obj != null && obj == obj.window;
	    }

	    function isDocument(obj) {
	      return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
	    }

	    function isObject(obj) {
	      return type(obj) == "object";
	    }

	    function isPlainObject(obj) {
	      return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
	    }

	    function likeArray(obj) {
	      var length = !!obj && 'length' in obj && obj.length,
	          type = $.type(obj);
	      return 'function' != type && !isWindow(obj) && ('array' == type || length === 0 || typeof length == 'number' && length > 0 && length - 1 in obj);
	    }

	    function compact(array) {
	      return filter.call(array, function (item) {
	        return item != null;
	      });
	    }

	    function flatten(array) {
	      return array.length > 0 ? $.fn.concat.apply([], array) : array;
	    }

	    camelize = function (str) {
	      return str.replace(/-+(.)?/g, function (match, chr) {
	        return chr ? chr.toUpperCase() : '';
	      });
	    };

	    function dasherize(str) {
	      return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/_/g, '-').toLowerCase();
	    }

	    uniq = function (array) {
	      return filter.call(array, function (item, idx) {
	        return array.indexOf(item) == idx;
	      });
	    };

	    function classRE(name) {
	      return name in classCache ? classCache[name] : classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)');
	    }

	    function maybeAddPx(name, value) {
	      return typeof value == "number" && !cssNumber[dasherize(name)] ? value + "px" : value;
	    }

	    function defaultDisplay(nodeName) {
	      var element, display;

	      if (!elementDisplay[nodeName]) {
	        element = document.createElement(nodeName);
	        document.body.appendChild(element);
	        display = getComputedStyle(element, '').getPropertyValue("display");
	        element.parentNode.removeChild(element);
	        display == "none" && (display = "block");
	        elementDisplay[nodeName] = display;
	      }

	      return elementDisplay[nodeName];
	    }

	    function children(element) {
	      return 'children' in element ? slice.call(element.children) : $.map(element.childNodes, function (node) {
	        if (node.nodeType == 1) return node;
	      });
	    }

	    function Z(dom, selector) {
	      var i,
	          len = dom ? dom.length : 0;

	      for (i = 0; i < len; i++) this[i] = dom[i];

	      this.length = len;
	      this.selector = selector || '';
	    } // `$.zepto.fragment` takes a html string and an optional tag name
	    // to generate DOM nodes from the given html string.
	    // The generated DOM nodes are returned as an array.
	    // This function can be overridden in plugins for example to make
	    // it compatible with browsers that don't support the DOM fully.


	    zepto.fragment = function (html, name, properties) {
	      var dom, nodes, container; // A special case optimization for a single tag

	      if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1));

	      if (!dom) {
	        if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
	        if (name === undefined$1) name = fragmentRE.test(html) && RegExp.$1;
	        if (!(name in containers)) name = '*';
	        container = containers[name];
	        container.innerHTML = '' + html;
	        dom = $.each(slice.call(container.childNodes), function () {
	          container.removeChild(this);
	        });
	      }

	      if (isPlainObject(properties)) {
	        nodes = $(dom);
	        $.each(properties, function (key, value) {
	          if (methodAttributes.indexOf(key) > -1) nodes[key](value);else nodes.attr(key, value);
	        });
	      }

	      return dom;
	    }; // `$.zepto.Z` swaps out the prototype of the given `dom` array
	    // of nodes with `$.fn` and thus supplying all the Zepto functions
	    // to the array. This method can be overridden in plugins.


	    zepto.Z = function (dom, selector) {
	      return new Z(dom, selector);
	    }; // `$.zepto.isZ` should return `true` if the given object is a Zepto
	    // collection. This method can be overridden in plugins.


	    zepto.isZ = function (object) {
	      return object instanceof zepto.Z;
	    }; // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
	    // takes a CSS selector and an optional context (and handles various
	    // special cases).
	    // This method can be overridden in plugins.


	    zepto.init = function (selector, context) {
	      var dom; // If nothing given, return an empty Zepto collection

	      if (!selector) return zepto.Z(); // Optimize for string selectors
	      else if (typeof selector == 'string') {
	          selector = selector.trim(); // If it's a html fragment, create nodes from it
	          // Note: In both Chrome 21 and Firefox 15, DOM error 12
	          // is thrown if the fragment doesn't begin with <

	          if (selector[0] == '<' && fragmentRE.test(selector)) dom = zepto.fragment(selector, RegExp.$1, context), selector = null; // If there's a context, create a collection on that context first, and select
	          // nodes from there
	          else if (context !== undefined$1) return $(context).find(selector); // If it's a CSS selector, use it to select nodes.
	            else dom = zepto.qsa(document, selector);
	        } // If a function is given, call it when the DOM is ready
	        else if (isFunction(selector)) return $(document).ready(selector); // If a Zepto collection is given, just return it
	          else if (zepto.isZ(selector)) return selector;else {
	              // normalize array if an array of nodes is given
	              if (isArray(selector)) dom = compact(selector); // Wrap DOM nodes.
	              else if (isObject(selector)) dom = [selector], selector = null; // If it's a html fragment, create nodes from it
	                else if (fragmentRE.test(selector)) dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null; // If there's a context, create a collection on that context first, and select
	                  // nodes from there
	                  else if (context !== undefined$1) return $(context).find(selector); // And last but no least, if it's a CSS selector, use it to select nodes.
	                    else dom = zepto.qsa(document, selector);
	            } // create a new Zepto collection from the nodes found

	      return zepto.Z(dom, selector);
	    }; // `$` will be the base `Zepto` object. When calling this
	    // function just call `$.zepto.init, which makes the implementation
	    // details of selecting nodes and creating Zepto collections
	    // patchable in plugins.


	    $ = function (selector, context) {
	      return zepto.init(selector, context);
	    };

	    function extend(target, source, deep) {
	      for (key in source) if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
	        if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {};
	        if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
	        extend(target[key], source[key], deep);
	      } else if (source[key] !== undefined$1) target[key] = source[key];
	    } // Copy all but undefined properties from one or more
	    // objects to the `target` object.


	    $.extend = function (target) {
	      var deep,
	          args = slice.call(arguments, 1);

	      if (typeof target == 'boolean') {
	        deep = target;
	        target = args.shift();
	      }

	      args.forEach(function (arg) {
	        extend(target, arg, deep);
	      });
	      return target;
	    }; // `$.zepto.qsa` is Zepto's CSS selector implementation which
	    // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
	    // This method can be overridden in plugins.


	    zepto.qsa = function (element, selector) {
	      var found,
	          maybeID = selector[0] == '#',
	          maybeClass = !maybeID && selector[0] == '.',
	          nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
	          // Ensure that a 1 char tag name still gets checked
	      isSimple = simpleSelectorRE.test(nameOnly);
	      return element.getElementById && isSimple && maybeID ? // Safari DocumentFragment doesn't have getElementById
	      (found = element.getElementById(nameOnly)) ? [found] : [] : element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11 ? [] : slice.call(isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
	      maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
	      element.getElementsByTagName(selector) : // Or a tag
	      element.querySelectorAll(selector) // Or it's not simple, and we need to query all
	      );
	    };

	    function filtered(nodes, selector) {
	      return selector == null ? $(nodes) : $(nodes).filter(selector);
	    }

	    $.contains = document.documentElement.contains ? function (parent, node) {
	      return parent !== node && parent.contains(node);
	    } : function (parent, node) {
	      while (node && (node = node.parentNode)) if (node === parent) return true;

	      return false;
	    };

	    function funcArg(context, arg, idx, payload) {
	      return isFunction(arg) ? arg.call(context, idx, payload) : arg;
	    }

	    function setAttribute(node, name, value) {
	      value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
	    } // access className property while respecting SVGAnimatedString


	    function className(node, value) {
	      var klass = node.className || '',
	          svg = klass && klass.baseVal !== undefined$1;
	      if (value === undefined$1) return svg ? klass.baseVal : klass;
	      svg ? klass.baseVal = value : node.className = value;
	    } // "true"  => true
	    // "false" => false
	    // "null"  => null
	    // "42"    => 42
	    // "42.5"  => 42.5
	    // "08"    => "08"
	    // JSON    => parse if valid
	    // String  => self


	    function deserializeValue(value) {
	      try {
	        return value ? value == "true" || (value == "false" ? false : value == "null" ? null : +value + "" == value ? +value : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
	      } catch (e) {
	        return value;
	      }
	    }

	    $.type = type;
	    $.isFunction = isFunction;
	    $.isWindow = isWindow;
	    $.isArray = isArray;
	    $.isPlainObject = isPlainObject;

	    $.isEmptyObject = function (obj) {
	      var name;

	      for (name in obj) return false;

	      return true;
	    };

	    $.isNumeric = function (val) {
	      var num = Number(val),
	          type = typeof val;
	      return val != null && type != 'boolean' && (type != 'string' || val.length) && !isNaN(num) && isFinite(num) || false;
	    };

	    $.inArray = function (elem, array, i) {
	      return emptyArray.indexOf.call(array, elem, i);
	    };

	    $.camelCase = camelize;

	    $.trim = function (str) {
	      return str == null ? "" : String.prototype.trim.call(str);
	    }; // plugin compatibility


	    $.uuid = 0;
	    $.support = {};
	    $.expr = {};

	    $.noop = function () {};

	    $.map = function (elements, callback) {
	      var value,
	          values = [],
	          i,
	          key;
	      if (likeArray(elements)) for (i = 0; i < elements.length; i++) {
	        value = callback(elements[i], i);
	        if (value != null) values.push(value);
	      } else for (key in elements) {
	        value = callback(elements[key], key);
	        if (value != null) values.push(value);
	      }
	      return flatten(values);
	    };

	    $.each = function (elements, callback) {
	      var i, key;

	      if (likeArray(elements)) {
	        for (i = 0; i < elements.length; i++) if (callback.call(elements[i], i, elements[i]) === false) return elements;
	      } else {
	        for (key in elements) if (callback.call(elements[key], key, elements[key]) === false) return elements;
	      }

	      return elements;
	    };

	    $.grep = function (elements, callback) {
	      return filter.call(elements, callback);
	    };

	    if (window.JSON) $.parseJSON = JSON.parse; // Populate the class2type map

	    $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
	      class2type["[object " + name + "]"] = name.toLowerCase();
	    }); // Define methods that will be available on all
	    // Zepto collections

	    $.fn = {
	      constructor: zepto.Z,
	      length: 0,
	      // Because a collection acts like an array
	      // copy over these useful array functions.
	      forEach: emptyArray.forEach,
	      reduce: emptyArray.reduce,
	      push: emptyArray.push,
	      sort: emptyArray.sort,
	      splice: emptyArray.splice,
	      indexOf: emptyArray.indexOf,
	      concat: function () {
	        var i,
	            value,
	            args = [];

	        for (i = 0; i < arguments.length; i++) {
	          value = arguments[i];
	          args[i] = zepto.isZ(value) ? value.toArray() : value;
	        }

	        return concat.apply(zepto.isZ(this) ? this.toArray() : this, args);
	      },
	      // `map` and `slice` in the jQuery API work differently
	      // from their array counterparts
	      map: function (fn) {
	        return $($.map(this, function (el, i) {
	          return fn.call(el, i, el);
	        }));
	      },
	      slice: function () {
	        return $(slice.apply(this, arguments));
	      },
	      ready: function (callback) {
	        // need to check if document.body exists for IE as that browser reports
	        // document ready when it hasn't yet created the body element
	        if (readyRE.test(document.readyState) && document.body) callback($);else document.addEventListener('DOMContentLoaded', function () {
	          callback($);
	        }, false);
	        return this;
	      },
	      get: function (idx) {
	        return idx === undefined$1 ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
	      },
	      toArray: function () {
	        return this.get();
	      },
	      size: function () {
	        return this.length;
	      },
	      remove: function () {
	        return this.each(function () {
	          if (this.parentNode != null) this.parentNode.removeChild(this);
	        });
	      },
	      each: function (callback) {
	        emptyArray.every.call(this, function (el, idx) {
	          return callback.call(el, idx, el) !== false;
	        });
	        return this;
	      },
	      filter: function (selector) {
	        if (isFunction(selector)) return this.not(this.not(selector));
	        return $(filter.call(this, function (element) {
	          return zepto.matches(element, selector);
	        }));
	      },
	      add: function (selector, context) {
	        return $(uniq(this.concat($(selector, context))));
	      },
	      is: function (selector) {
	        return this.length > 0 && zepto.matches(this[0], selector);
	      },
	      not: function (selector) {
	        var nodes = [];
	        if (isFunction(selector) && selector.call !== undefined$1) this.each(function (idx) {
	          if (!selector.call(this, idx)) nodes.push(this);
	        });else {
	          var excludes = typeof selector == 'string' ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
	          this.forEach(function (el) {
	            if (excludes.indexOf(el) < 0) nodes.push(el);
	          });
	        }
	        return $(nodes);
	      },
	      has: function (selector) {
	        return this.filter(function () {
	          return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
	        });
	      },
	      eq: function (idx) {
	        return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
	      },
	      first: function () {
	        var el = this[0];
	        return el && !isObject(el) ? el : $(el);
	      },
	      last: function () {
	        var el = this[this.length - 1];
	        return el && !isObject(el) ? el : $(el);
	      },
	      find: function (selector) {
	        var result,
	            $this = this;
	        if (!selector) result = $();else if (typeof selector == 'object') result = $(selector).filter(function () {
	          var node = this;
	          return emptyArray.some.call($this, function (parent) {
	            return $.contains(parent, node);
	          });
	        });else if (this.length == 1) result = $(zepto.qsa(this[0], selector));else result = this.map(function () {
	          return zepto.qsa(this, selector);
	        });
	        return result;
	      },
	      closest: function (selector, context) {
	        var nodes = [],
	            collection = typeof selector == 'object' && $(selector);
	        this.each(function (_, node) {
	          while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector))) node = node !== context && !isDocument(node) && node.parentNode;

	          if (node && nodes.indexOf(node) < 0) nodes.push(node);
	        });
	        return $(nodes);
	      },
	      parents: function (selector) {
	        var ancestors = [],
	            nodes = this;

	        while (nodes.length > 0) nodes = $.map(nodes, function (node) {
	          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
	            ancestors.push(node);
	            return node;
	          }
	        });

	        return filtered(ancestors, selector);
	      },
	      parent: function (selector) {
	        return filtered(uniq(this.pluck('parentNode')), selector);
	      },
	      children: function (selector) {
	        return filtered(this.map(function () {
	          return children(this);
	        }), selector);
	      },
	      contents: function () {
	        return this.map(function () {
	          return this.contentDocument || slice.call(this.childNodes);
	        });
	      },
	      siblings: function (selector) {
	        return filtered(this.map(function (i, el) {
	          return filter.call(children(el.parentNode), function (child) {
	            return child !== el;
	          });
	        }), selector);
	      },
	      empty: function () {
	        return this.each(function () {
	          this.innerHTML = '';
	        });
	      },
	      // `pluck` is borrowed from Prototype.js
	      pluck: function (property) {
	        return $.map(this, function (el) {
	          return el[property];
	        });
	      },
	      show: function () {
	        return this.each(function () {
	          this.style.display == "none" && (this.style.display = '');
	          if (getComputedStyle(this, '').getPropertyValue("display") == "none") this.style.display = defaultDisplay(this.nodeName);
	        });
	      },
	      replaceWith: function (newContent) {
	        return this.before(newContent).remove();
	      },
	      wrap: function (structure) {
	        var func = isFunction(structure);
	        if (this[0] && !func) var dom = $(structure).get(0),
	            clone = dom.parentNode || this.length > 1;
	        return this.each(function (index) {
	          $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom);
	        });
	      },
	      wrapAll: function (structure) {
	        if (this[0]) {
	          $(this[0]).before(structure = $(structure));
	          var children; // drill down to the inmost element

	          while ((children = structure.children()).length) structure = children.first();

	          $(structure).append(this);
	        }

	        return this;
	      },
	      wrapInner: function (structure) {
	        var func = isFunction(structure);
	        return this.each(function (index) {
	          var self = $(this),
	              contents = self.contents(),
	              dom = func ? structure.call(this, index) : structure;
	          contents.length ? contents.wrapAll(dom) : self.append(dom);
	        });
	      },
	      unwrap: function () {
	        this.parent().each(function () {
	          $(this).replaceWith($(this).children());
	        });
	        return this;
	      },
	      clone: function () {
	        return this.map(function () {
	          return this.cloneNode(true);
	        });
	      },
	      hide: function () {
	        return this.css("display", "none");
	      },
	      toggle: function (setting) {
	        return this.each(function () {
	          var el = $(this);
	          (setting === undefined$1 ? el.css("display") == "none" : setting) ? el.show() : el.hide();
	        });
	      },
	      prev: function (selector) {
	        return $(this.pluck('previousElementSibling')).filter(selector || '*');
	      },
	      next: function (selector) {
	        return $(this.pluck('nextElementSibling')).filter(selector || '*');
	      },
	      html: function (html) {
	        return 0 in arguments ? this.each(function (idx) {
	          var originHtml = this.innerHTML;
	          $(this).empty().append(funcArg(this, html, idx, originHtml));
	        }) : 0 in this ? this[0].innerHTML : null;
	      },
	      text: function (text) {
	        return 0 in arguments ? this.each(function (idx) {
	          var newText = funcArg(this, text, idx, this.textContent);
	          this.textContent = newText == null ? '' : '' + newText;
	        }) : 0 in this ? this.pluck('textContent').join("") : null;
	      },
	      attr: function (name, value) {
	        var result;
	        return typeof name == 'string' && !(1 in arguments) ? 0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined$1 : this.each(function (idx) {
	          if (this.nodeType !== 1) return;
	          if (isObject(name)) for (key in name) setAttribute(this, key, name[key]);else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
	        });
	      },
	      removeAttr: function (name) {
	        return this.each(function () {
	          this.nodeType === 1 && name.split(' ').forEach(function (attribute) {
	            setAttribute(this, attribute);
	          }, this);
	        });
	      },
	      prop: function (name, value) {
	        name = propMap[name] || name;
	        return 1 in arguments ? this.each(function (idx) {
	          this[name] = funcArg(this, value, idx, this[name]);
	        }) : this[0] && this[0][name];
	      },
	      removeProp: function (name) {
	        name = propMap[name] || name;
	        return this.each(function () {
	          delete this[name];
	        });
	      },
	      data: function (name, value) {
	        var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase();
	        var data = 1 in arguments ? this.attr(attrName, value) : this.attr(attrName);
	        return data !== null ? deserializeValue(data) : undefined$1;
	      },
	      val: function (value) {
	        if (0 in arguments) {
	          if (value == null) value = "";
	          return this.each(function (idx) {
	            this.value = funcArg(this, value, idx, this.value);
	          });
	        } else {
	          return this[0] && (this[0].multiple ? $(this[0]).find('option').filter(function () {
	            return this.selected;
	          }).pluck('value') : this[0].value);
	        }
	      },
	      offset: function (coordinates) {
	        if (coordinates) return this.each(function (index) {
	          var $this = $(this),
	              coords = funcArg(this, coordinates, index, $this.offset()),
	              parentOffset = $this.offsetParent().offset(),
	              props = {
	            top: coords.top - parentOffset.top,
	            left: coords.left - parentOffset.left
	          };
	          if ($this.css('position') == 'static') props['position'] = 'relative';
	          $this.css(props);
	        });
	        if (!this.length) return null;
	        if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0])) return {
	          top: 0,
	          left: 0
	        };
	        var obj = this[0].getBoundingClientRect();
	        return {
	          left: obj.left + window.pageXOffset,
	          top: obj.top + window.pageYOffset,
	          width: Math.round(obj.width),
	          height: Math.round(obj.height)
	        };
	      },
	      css: function (property, value) {
	        if (arguments.length < 2) {
	          var element = this[0];

	          if (typeof property == 'string') {
	            if (!element) return;
	            return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property);
	          } else if (isArray(property)) {
	            if (!element) return;
	            var props = {};
	            var computedStyle = getComputedStyle(element, '');
	            $.each(property, function (_, prop) {
	              props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop);
	            });
	            return props;
	          }
	        }

	        var css = '';

	        if (type(property) == 'string') {
	          if (!value && value !== 0) this.each(function () {
	            this.style.removeProperty(dasherize(property));
	          });else css = dasherize(property) + ":" + maybeAddPx(property, value);
	        } else {
	          for (key in property) if (!property[key] && property[key] !== 0) this.each(function () {
	            this.style.removeProperty(dasherize(key));
	          });else css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';
	        }

	        return this.each(function () {
	          this.style.cssText += ';' + css;
	        });
	      },
	      index: function (element) {
	        return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
	      },
	      hasClass: function (name) {
	        if (!name) return false;
	        return emptyArray.some.call(this, function (el) {
	          return this.test(className(el));
	        }, classRE(name));
	      },
	      addClass: function (name) {
	        if (!name) return this;
	        return this.each(function (idx) {
	          if (!('className' in this)) return;
	          classList = [];
	          var cls = className(this),
	              newName = funcArg(this, name, idx, cls);
	          newName.split(/\s+/g).forEach(function (klass) {
	            if (!$(this).hasClass(klass)) classList.push(klass);
	          }, this);
	          classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "));
	        });
	      },
	      removeClass: function (name) {
	        return this.each(function (idx) {
	          if (!('className' in this)) return;
	          if (name === undefined$1) return className(this, '');
	          classList = className(this);
	          funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
	            classList = classList.replace(classRE(klass), " ");
	          });
	          className(this, classList.trim());
	        });
	      },
	      toggleClass: function (name, when) {
	        if (!name) return this;
	        return this.each(function (idx) {
	          var $this = $(this),
	              names = funcArg(this, name, idx, className(this));
	          names.split(/\s+/g).forEach(function (klass) {
	            (when === undefined$1 ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass);
	          });
	        });
	      },
	      scrollTop: function (value) {
	        if (!this.length) return;
	        var hasScrollTop = ('scrollTop' in this[0]);
	        if (value === undefined$1) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
	        return this.each(hasScrollTop ? function () {
	          this.scrollTop = value;
	        } : function () {
	          this.scrollTo(this.scrollX, value);
	        });
	      },
	      scrollLeft: function (value) {
	        if (!this.length) return;
	        var hasScrollLeft = ('scrollLeft' in this[0]);
	        if (value === undefined$1) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
	        return this.each(hasScrollLeft ? function () {
	          this.scrollLeft = value;
	        } : function () {
	          this.scrollTo(value, this.scrollY);
	        });
	      },
	      position: function () {
	        if (!this.length) return;
	        var elem = this[0],
	            // Get *real* offsetParent
	        offsetParent = this.offsetParent(),
	            // Get correct offsets
	        offset = this.offset(),
	            parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
	          top: 0,
	          left: 0
	        } : offsetParent.offset(); // Subtract element margins
	        // note: when an element has margin: auto the offsetLeft and marginLeft
	        // are the same in Safari causing offset.left to incorrectly be 0

	        offset.top -= parseFloat($(elem).css('margin-top')) || 0;
	        offset.left -= parseFloat($(elem).css('margin-left')) || 0; // Add offsetParent borders

	        parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0;
	        parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0; // Subtract the two offsets

	        return {
	          top: offset.top - parentOffset.top,
	          left: offset.left - parentOffset.left
	        };
	      },
	      offsetParent: function () {
	        return this.map(function () {
	          var parent = this.offsetParent || document.body;

	          while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static") parent = parent.offsetParent;

	          return parent;
	        });
	      }
	    }; // for now

	    $.fn.detach = $.fn.remove // Generate the `width` and `height` functions
	    ;
	    ['width', 'height'].forEach(function (dimension) {
	      var dimensionProperty = dimension.replace(/./, function (m) {
	        return m[0].toUpperCase();
	      });

	      $.fn[dimension] = function (value) {
	        var offset,
	            el = this[0];
	        if (value === undefined$1) return isWindow(el) ? el['inner' + dimensionProperty] : isDocument(el) ? el.documentElement['scroll' + dimensionProperty] : (offset = this.offset()) && offset[dimension];else return this.each(function (idx) {
	          el = $(this);
	          el.css(dimension, funcArg(this, value, idx, el[dimension]()));
	        });
	      };
	    });

	    function traverseNode(node, fun) {
	      fun(node);

	      for (var i = 0, len = node.childNodes.length; i < len; i++) traverseNode(node.childNodes[i], fun);
	    } // Generate the `after`, `prepend`, `before`, `append`,
	    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.


	    adjacencyOperators.forEach(function (operator, operatorIndex) {
	      var inside = operatorIndex % 2; //=> prepend, append

	      $.fn[operator] = function () {
	        // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
	        var argType,
	            nodes = $.map(arguments, function (arg) {
	          var arr = [];
	          argType = type(arg);

	          if (argType == "array") {
	            arg.forEach(function (el) {
	              if (el.nodeType !== undefined$1) return arr.push(el);else if ($.zepto.isZ(el)) return arr = arr.concat(el.get());
	              arr = arr.concat(zepto.fragment(el));
	            });
	            return arr;
	          }

	          return argType == "object" || arg == null ? arg : zepto.fragment(arg);
	        }),
	            parent,
	            copyByClone = this.length > 1;
	        if (nodes.length < 1) return this;
	        return this.each(function (_, target) {
	          parent = inside ? target : target.parentNode; // convert all methods to a "before" operation

	          target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;
	          var parentInDocument = $.contains(document.documentElement, parent);
	          nodes.forEach(function (node) {
	            if (copyByClone) node = node.cloneNode(true);else if (!parent) return $(node).remove();
	            parent.insertBefore(node, target);
	            if (parentInDocument) traverseNode(node, function (el) {
	              if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' && (!el.type || el.type === 'text/javascript') && !el.src) {
	                var target = el.ownerDocument ? el.ownerDocument.defaultView : window;
	                target['eval'].call(target, el.innerHTML);
	              }
	            });
	          });
	        });
	      }; // after    => insertAfter
	      // prepend  => prependTo
	      // before   => insertBefore
	      // append   => appendTo


	      $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
	        $(html)[operator](this);
	        return this;
	      };
	    });
	    zepto.Z.prototype = Z.prototype = $.fn; // Export internal API functions in the `$.zepto` namespace

	    zepto.uniq = uniq;
	    zepto.deserializeValue = deserializeValue;
	    $.zepto = zepto;
	    return $;
	  }();

	  window.Zepto = Zepto;
	  window.$ === undefined && (window.$ = Zepto);

	  (function ($) {
	    var _zid = 1,
	        undefined$1,
	        slice = Array.prototype.slice,
	        isFunction = $.isFunction,
	        isString = function (obj) {
	      return typeof obj == 'string';
	    },
	        handlers = {},
	        specialEvents = {},
	        focusinSupported = ('onfocusin' in window),
	        focus = {
	      focus: 'focusin',
	      blur: 'focusout'
	    },
	        hover = {
	      mouseenter: 'mouseover',
	      mouseleave: 'mouseout'
	    };

	    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';

	    function zid(element) {
	      return element._zid || (element._zid = _zid++);
	    }

	    function findHandlers(element, event, fn, selector) {
	      event = parse(event);
	      if (event.ns) var matcher = matcherFor(event.ns);
	      return (handlers[zid(element)] || []).filter(function (handler) {
	        return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector);
	      });
	    }

	    function parse(event) {
	      var parts = ('' + event).split('.');
	      return {
	        e: parts[0],
	        ns: parts.slice(1).sort().join(' ')
	      };
	    }

	    function matcherFor(ns) {
	      return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
	    }

	    function eventCapture(handler, captureSetting) {
	      return handler.del && !focusinSupported && handler.e in focus || !!captureSetting;
	    }

	    function realEvent(type) {
	      return hover[type] || focusinSupported && focus[type] || type;
	    }

	    function add(element, events, fn, data, selector, delegator, capture) {
	      var id = zid(element),
	          set = handlers[id] || (handlers[id] = []);
	      events.split(/\s/).forEach(function (event) {
	        if (event == 'ready') return $(document).ready(fn);
	        var handler = parse(event);
	        handler.fn = fn;
	        handler.sel = selector; // emulate mouseenter, mouseleave

	        if (handler.e in hover) fn = function (e) {
	          var related = e.relatedTarget;
	          if (!related || related !== this && !$.contains(this, related)) return handler.fn.apply(this, arguments);
	        };
	        handler.del = delegator;
	        var callback = delegator || fn;

	        handler.proxy = function (e) {
	          e = compatible(e);
	          if (e.isImmediatePropagationStopped()) return;
	          e.data = data;
	          var result = callback.apply(element, e._args == undefined$1 ? [e] : [e].concat(e._args));
	          if (result === false) e.preventDefault(), e.stopPropagation();
	          return result;
	        };

	        handler.i = set.length;
	        set.push(handler);
	        if ('addEventListener' in element) element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
	      });
	    }

	    function remove(element, events, fn, selector, capture) {
	      var id = zid(element);
	      (events || '').split(/\s/).forEach(function (event) {
	        findHandlers(element, event, fn, selector).forEach(function (handler) {
	          delete handlers[id][handler.i];
	          if ('removeEventListener' in element) element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
	        });
	      });
	    }

	    $.event = {
	      add: add,
	      remove: remove
	    };

	    $.proxy = function (fn, context) {
	      var args = 2 in arguments && slice.call(arguments, 2);

	      if (isFunction(fn)) {
	        var proxyFn = function () {
	          return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments);
	        };

	        proxyFn._zid = zid(fn);
	        return proxyFn;
	      } else if (isString(context)) {
	        if (args) {
	          args.unshift(fn[context], fn);
	          return $.proxy.apply(null, args);
	        } else {
	          return $.proxy(fn[context], fn);
	        }
	      } else {
	        throw new TypeError("expected function");
	      }
	    };

	    $.fn.bind = function (event, data, callback) {
	      return this.on(event, data, callback);
	    };

	    $.fn.unbind = function (event, callback) {
	      return this.off(event, callback);
	    };

	    $.fn.one = function (event, selector, data, callback) {
	      return this.on(event, selector, data, callback, 1);
	    };

	    var returnTrue = function () {
	      return true;
	    },
	        returnFalse = function () {
	      return false;
	    },
	        ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
	        eventMethods = {
	      preventDefault: 'isDefaultPrevented',
	      stopImmediatePropagation: 'isImmediatePropagationStopped',
	      stopPropagation: 'isPropagationStopped'
	    };

	    function compatible(event, source) {
	      if (source || !event.isDefaultPrevented) {
	        source || (source = event);
	        $.each(eventMethods, function (name, predicate) {
	          var sourceMethod = source[name];

	          event[name] = function () {
	            this[predicate] = returnTrue;
	            return sourceMethod && sourceMethod.apply(source, arguments);
	          };

	          event[predicate] = returnFalse;
	        });
	        event.timeStamp || (event.timeStamp = Date.now());
	        if (source.defaultPrevented !== undefined$1 ? source.defaultPrevented : 'returnValue' in source ? source.returnValue === false : source.getPreventDefault && source.getPreventDefault()) event.isDefaultPrevented = returnTrue;
	      }

	      return event;
	    }

	    function createProxy(event) {
	      var key,
	          proxy = {
	        originalEvent: event
	      };

	      for (key in event) if (!ignoreProperties.test(key) && event[key] !== undefined$1) proxy[key] = event[key];

	      return compatible(proxy, event);
	    }

	    $.fn.delegate = function (selector, event, callback) {
	      return this.on(event, selector, callback);
	    };

	    $.fn.undelegate = function (selector, event, callback) {
	      return this.off(event, selector, callback);
	    };

	    $.fn.live = function (event, callback) {
	      $(document.body).delegate(this.selector, event, callback);
	      return this;
	    };

	    $.fn.die = function (event, callback) {
	      $(document.body).undelegate(this.selector, event, callback);
	      return this;
	    };

	    $.fn.on = function (event, selector, data, callback, one) {
	      var autoRemove,
	          delegator,
	          $this = this;

	      if (event && !isString(event)) {
	        $.each(event, function (type, fn) {
	          $this.on(type, selector, data, fn, one);
	        });
	        return $this;
	      }

	      if (!isString(selector) && !isFunction(callback) && callback !== false) callback = data, data = selector, selector = undefined$1;
	      if (callback === undefined$1 || data === false) callback = data, data = undefined$1;
	      if (callback === false) callback = returnFalse;
	      return $this.each(function (_, element) {
	        if (one) autoRemove = function (e) {
	          remove(element, e.type, callback);
	          return callback.apply(this, arguments);
	        };
	        if (selector) delegator = function (e) {
	          var evt,
	              match = $(e.target).closest(selector, element).get(0);

	          if (match && match !== element) {
	            evt = $.extend(createProxy(e), {
	              currentTarget: match,
	              liveFired: element
	            });
	            return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
	          }
	        };
	        add(element, event, callback, data, selector, delegator || autoRemove);
	      });
	    };

	    $.fn.off = function (event, selector, callback) {
	      var $this = this;

	      if (event && !isString(event)) {
	        $.each(event, function (type, fn) {
	          $this.off(type, selector, fn);
	        });
	        return $this;
	      }

	      if (!isString(selector) && !isFunction(callback) && callback !== false) callback = selector, selector = undefined$1;
	      if (callback === false) callback = returnFalse;
	      return $this.each(function () {
	        remove(this, event, callback, selector);
	      });
	    };

	    $.fn.trigger = function (event, args) {
	      event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event);
	      event._args = args;
	      return this.each(function () {
	        // handle focus(), blur() by calling them directly
	        if (event.type in focus && typeof this[event.type] == "function") this[event.type](); // items in the collection might not be DOM elements
	        else if ('dispatchEvent' in this) this.dispatchEvent(event);else $(this).triggerHandler(event, args);
	      });
	    }; // triggers event handlers on current element just as if an event occurred,
	    // doesn't trigger an actual event, doesn't bubble


	    $.fn.triggerHandler = function (event, args) {
	      var e, result;
	      this.each(function (i, element) {
	        e = createProxy(isString(event) ? $.Event(event) : event);
	        e._args = args;
	        e.target = element;
	        $.each(findHandlers(element, event.type || event), function (i, handler) {
	          result = handler.proxy(e);
	          if (e.isImmediatePropagationStopped()) return false;
	        });
	      });
	      return result;
	    } // shortcut methods for `.bind(event, fn)` for each event type
	    ;

	    ('focusin focusout focus blur load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select keydown keypress keyup error').split(' ').forEach(function (event) {
	      $.fn[event] = function (callback) {
	        return 0 in arguments ? this.bind(event, callback) : this.trigger(event);
	      };
	    });

	    $.Event = function (type, props) {
	      if (!isString(type)) props = type, type = props.type;
	      var event = document.createEvent(specialEvents[type] || 'Events'),
	          bubbles = true;
	      if (props) for (var name in props) name == 'bubbles' ? bubbles = !!props[name] : event[name] = props[name];
	      event.initEvent(type, bubbles, true);
	      return compatible(event);
	    };
	  })(Zepto);

	  (function ($) {
	    var jsonpID = +new Date(),
	        document = window.document,
	        key,
	        name,
	        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	        scriptTypeRE = /^(?:text|application)\/javascript/i,
	        xmlTypeRE = /^(?:text|application)\/xml/i,
	        jsonType = 'application/json',
	        htmlType = 'text/html',
	        blankRE = /^\s*$/,
	        originAnchor = document.createElement('a');
	    originAnchor.href = window.location.href; // trigger a custom event and return false if it was cancelled

	    function triggerAndReturn(context, eventName, data) {
	      var event = $.Event(eventName);
	      $(context).trigger(event, data);
	      return !event.isDefaultPrevented();
	    } // trigger an Ajax "global" event


	    function triggerGlobal(settings, context, eventName, data) {
	      if (settings.global) return triggerAndReturn(context || document, eventName, data);
	    } // Number of active Ajax requests


	    $.active = 0;

	    function ajaxStart(settings) {
	      if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart');
	    }

	    function ajaxStop(settings) {
	      if (settings.global && ! --$.active) triggerGlobal(settings, null, 'ajaxStop');
	    } // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable


	    function ajaxBeforeSend(xhr, settings) {
	      var context = settings.context;
	      if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false) return false;
	      triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
	    }

	    function ajaxSuccess(data, xhr, settings, deferred) {
	      var context = settings.context,
	          status = 'success';
	      settings.success.call(context, data, status, xhr);
	      if (deferred) deferred.resolveWith(context, [data, status, xhr]);
	      triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);
	      ajaxComplete(status, xhr, settings);
	    } // type: "timeout", "error", "abort", "parsererror"


	    function ajaxError(error, type, xhr, settings, deferred) {
	      var context = settings.context;
	      settings.error.call(context, xhr, type, error);
	      if (deferred) deferred.rejectWith(context, [xhr, type, error]);
	      triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type]);
	      ajaxComplete(type, xhr, settings);
	    } // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"


	    function ajaxComplete(status, xhr, settings) {
	      var context = settings.context;
	      settings.complete.call(context, xhr, status);
	      triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);
	      ajaxStop(settings);
	    }

	    function ajaxDataFilter(data, type, settings) {
	      if (settings.dataFilter == empty) return data;
	      var context = settings.context;
	      return settings.dataFilter.call(context, data, type);
	    } // Empty function, used as default callback


	    function empty() {}

	    $.ajaxJSONP = function (options, deferred) {
	      if (!('type' in options)) return $.ajax(options);

	      var _callbackName = options.jsonpCallback,
	          callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || 'Zepto' + jsonpID++,
	          script = document.createElement('script'),
	          originalCallback = window[callbackName],
	          responseData,
	          abort = function (errorType) {
	        $(script).triggerHandler('error', errorType || 'abort');
	      },
	          xhr = {
	        abort: abort
	      },
	          abortTimeout;

	      if (deferred) deferred.promise(xhr);
	      $(script).on('load error', function (e, errorType) {
	        clearTimeout(abortTimeout);
	        $(script).off().remove();

	        if (e.type == 'error' || !responseData) {
	          ajaxError(null, errorType || 'error', xhr, options, deferred);
	        } else {
	          ajaxSuccess(responseData[0], xhr, options, deferred);
	        }

	        window[callbackName] = originalCallback;
	        if (responseData && $.isFunction(originalCallback)) originalCallback(responseData[0]);
	        originalCallback = responseData = undefined;
	      });

	      if (ajaxBeforeSend(xhr, options) === false) {
	        abort('abort');
	        return xhr;
	      }

	      window[callbackName] = function () {
	        responseData = arguments;
	      };

	      script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName);
	      document.head.appendChild(script);
	      if (options.timeout > 0) abortTimeout = setTimeout(function () {
	        abort('timeout');
	      }, options.timeout);
	      return xhr;
	    };

	    $.ajaxSettings = {
	      // Default type of request
	      type: 'GET',
	      // Callback that is executed before request
	      beforeSend: empty,
	      // Callback that is executed if the request succeeds
	      success: empty,
	      // Callback that is executed the the server drops error
	      error: empty,
	      // Callback that is executed on request complete (both: error and success)
	      complete: empty,
	      // The context for the callbacks
	      context: null,
	      // Whether to trigger "global" Ajax events
	      global: true,
	      // Transport
	      xhr: function () {
	        return new window.XMLHttpRequest();
	      },
	      // MIME types mapping
	      // IIS returns Javascript as "application/x-javascript"
	      accepts: {
	        script: 'text/javascript, application/javascript, application/x-javascript',
	        json: jsonType,
	        xml: 'application/xml, text/xml',
	        html: htmlType,
	        text: 'text/plain'
	      },
	      // Whether the request is to another domain
	      crossDomain: false,
	      // Default timeout
	      timeout: 0,
	      // Whether data should be serialized to string
	      processData: true,
	      // Whether the browser should be allowed to cache GET responses
	      cache: true,
	      //Used to handle the raw response data of XMLHttpRequest.
	      //This is a pre-filtering function to sanitize the response.
	      //The sanitized response should be returned
	      dataFilter: empty
	    };

	    function mimeToDataType(mime) {
	      if (mime) mime = mime.split(';', 2)[0];
	      return mime && (mime == htmlType ? 'html' : mime == jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text';
	    }

	    function appendQuery(url, query) {
	      if (query == '') return url;
	      return (url + '&' + query).replace(/[&?]{1,2}/, '?');
	    } // serialize payload and append it to the URL for GET requests


	    function serializeData(options) {
	      if (options.processData && options.data && $.type(options.data) != "string") options.data = $.param(options.data, options.traditional);
	      if (options.data && (!options.type || options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType)) options.url = appendQuery(options.url, options.data), options.data = undefined;
	    }

	    $.ajax = function (options) {
	      var settings = $.extend({}, options || {}),
	          deferred = $.Deferred && $.Deferred(),
	          urlAnchor,
	          hashIndex;

	      for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];

	      ajaxStart(settings);

	      if (!settings.crossDomain) {
	        urlAnchor = document.createElement('a');
	        urlAnchor.href = settings.url; // cleans up URL for .href (IE only), see https://github.com/madrobby/zepto/pull/1049

	        urlAnchor.href = urlAnchor.href;
	        settings.crossDomain = originAnchor.protocol + '//' + originAnchor.host !== urlAnchor.protocol + '//' + urlAnchor.host;
	      }

	      if (!settings.url) settings.url = window.location.toString();
	      if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex);
	      serializeData(settings);
	      var dataType = settings.dataType,
	          hasPlaceholder = /\?.+=\?/.test(settings.url);
	      if (hasPlaceholder) dataType = 'jsonp';
	      if (settings.cache === false || (!options || options.cache !== true) && ('script' == dataType || 'jsonp' == dataType)) settings.url = appendQuery(settings.url, '_=' + Date.now());

	      if ('jsonp' == dataType) {
	        if (!hasPlaceholder) settings.url = appendQuery(settings.url, settings.jsonp ? settings.jsonp + '=?' : settings.jsonp === false ? '' : 'callback=?');
	        return $.ajaxJSONP(settings, deferred);
	      }

	      var mime = settings.accepts[dataType],
	          headers = {},
	          setHeader = function (name, value) {
	        headers[name.toLowerCase()] = [name, value];
	      },
	          protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
	          xhr = settings.xhr(),
	          nativeSetHeader = xhr.setRequestHeader,
	          abortTimeout;

	      if (deferred) deferred.promise(xhr);
	      if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest');
	      setHeader('Accept', mime || '*/*');

	      if (mime = settings.mimeType || mime) {
	        if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0];
	        xhr.overrideMimeType && xhr.overrideMimeType(mime);
	      }

	      if (settings.contentType || settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET') setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
	      if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name]);
	      xhr.setRequestHeader = setHeader;

	      xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	          xhr.onreadystatechange = empty;
	          clearTimeout(abortTimeout);
	          var result,
	              error = false;

	          if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == 'file:') {
	            dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));
	            if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob') result = xhr.response;else {
	              result = xhr.responseText;

	              try {
	                // http://perfectionkills.com/global-eval-what-are-the-options/
	                // sanitize response accordingly if data filter callback provided
	                result = ajaxDataFilter(result, dataType, settings);
	                if (dataType == 'script') (1, eval)(result);else if (dataType == 'xml') result = xhr.responseXML;else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result);
	              } catch (e) {
	                error = e;
	              }

	              if (error) return ajaxError(error, 'parsererror', xhr, settings, deferred);
	            }
	            ajaxSuccess(result, xhr, settings, deferred);
	          } else {
	            ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred);
	          }
	        }
	      };

	      if (ajaxBeforeSend(xhr, settings) === false) {
	        xhr.abort();
	        ajaxError(null, 'abort', xhr, settings, deferred);
	        return xhr;
	      }

	      var async = 'async' in settings ? settings.async : true;
	      xhr.open(settings.type, settings.url, async, settings.username, settings.password);
	      if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name];

	      for (name in headers) nativeSetHeader.apply(xhr, headers[name]);

	      if (settings.timeout > 0) abortTimeout = setTimeout(function () {
	        xhr.onreadystatechange = empty;
	        xhr.abort();
	        ajaxError(null, 'timeout', xhr, settings, deferred);
	      }, settings.timeout); // avoid sending empty string (#319)

	      xhr.send(settings.data ? settings.data : null);
	      return xhr;
	    }; // handle optional data/success arguments


	    function parseArguments(url, data, success, dataType) {
	      if ($.isFunction(data)) dataType = success, success = data, data = undefined;
	      if (!$.isFunction(success)) dataType = success, success = undefined;
	      return {
	        url: url,
	        data: data,
	        success: success,
	        dataType: dataType
	      };
	    }

	    $.get = function ()
	    /* url, data, success, dataType */
	    {
	      return $.ajax(parseArguments.apply(null, arguments));
	    };

	    $.post = function ()
	    /* url, data, success, dataType */
	    {
	      var options = parseArguments.apply(null, arguments);
	      options.type = 'POST';
	      return $.ajax(options);
	    };

	    $.getJSON = function ()
	    /* url, data, success */
	    {
	      var options = parseArguments.apply(null, arguments);
	      options.dataType = 'json';
	      return $.ajax(options);
	    };

	    $.fn.load = function (url, data, success) {
	      if (!this.length) return this;
	      var self = this,
	          parts = url.split(/\s/),
	          selector,
	          options = parseArguments(url, data, success),
	          callback = options.success;
	      if (parts.length > 1) options.url = parts[0], selector = parts[1];

	      options.success = function (response) {
	        self.html(selector ? $('<div>').html(response.replace(rscript, "")).find(selector) : response);
	        callback && callback.apply(self, arguments);
	      };

	      $.ajax(options);
	      return this;
	    };

	    var escape = encodeURIComponent;

	    function serialize(params, obj, traditional, scope) {
	      var type,
	          array = $.isArray(obj),
	          hash = $.isPlainObject(obj);
	      $.each(obj, function (key, value) {
	        type = $.type(value);
	        if (scope) key = traditional ? scope : scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'; // handle data in serializeArray() format

	        if (!scope && array) params.add(value.name, value.value); // recurse into nested objects
	        else if (type == "array" || !traditional && type == "object") serialize(params, value, traditional, key);else params.add(key, value);
	      });
	    }

	    $.param = function (obj, traditional) {
	      var params = [];

	      params.add = function (key, value) {
	        if ($.isFunction(value)) value = value();
	        if (value == null) value = "";
	        this.push(escape(key) + '=' + escape(value));
	      };

	      serialize(params, obj, traditional);
	      return params.join('&').replace(/%20/g, '+');
	    };
	  })(Zepto);

	  (function ($) {
	    $.fn.serializeArray = function () {
	      var name,
	          type,
	          result = [],
	          add = function (value) {
	        if (value.forEach) return value.forEach(add);
	        result.push({
	          name: name,
	          value: value
	        });
	      };

	      if (this[0]) $.each(this[0].elements, function (_, field) {
	        type = field.type, name = field.name;
	        if (name && field.nodeName.toLowerCase() != 'fieldset' && !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' && (type != 'radio' && type != 'checkbox' || field.checked)) add($(field).val());
	      });
	      return result;
	    };

	    $.fn.serialize = function () {
	      var result = [];
	      this.serializeArray().forEach(function (elm) {
	        result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
	      });
	      return result.join('&');
	    };

	    $.fn.submit = function (callback) {
	      if (0 in arguments) this.bind('submit', callback);else if (this.length) {
	        var event = $.Event('submit');
	        this.eq(0).trigger(event);
	        if (!event.isDefaultPrevented()) this.get(0).submit();
	      }
	      return this;
	    };
	  })(Zepto);

	  (function () {
	    // getComputedStyle shouldn't freak out when called
	    // without a valid element as argument
	    try {
	      getComputedStyle(undefined);
	    } catch (e) {
	      var nativeGetComputedStyle = getComputedStyle;

	      window.getComputedStyle = function (element, pseudoElement) {
	        try {
	          return nativeGetComputedStyle(element, pseudoElement);
	        } catch (e) {
	          return null;
	        }
	      };
	    }
	  })();

	  return Zepto;
	});

	($ => {
	  $.fn.fancyImg = function () {
	    this.each((index, ele) => {
	      const $ele = $(ele);
	      if (!$ele.attr('src')) return;
	      $ele.click(() => {
	        const $img = $ele.clone(false, false);
	        const $box = createFancyBox($img);
	        $('body').append($box);
	        $box.show();
	      });
	    });
	    return this;
	  };

	  $.message = function (message, buttons) {
	    createMessage(message, buttons);
	  };
	})($);

	function createMessage(message, buttons = []) {
	  const $msg = $(`
  <div class="message">
    <div class="message-title">
    ${message}
    </div>
    <div class="message-btns">
    </div>
  </div>`);
	  const $tool = {
	    close() {
	      $msg && $msg.removeClass('active');
	      setTimeout(() => {
	        $msg && $msg.remove();
	      }, 600);
	    },

	    show() {
	      setTimeout(() => {
	        $msg && $msg.addClass('active');
	      }, 1);
	    }

	  };
	  const $closeBtn = $(`
    <a class="message-closeBtn">
      <i class="fa fa-times-circle fa-2x"></i>
    </a>
  `);
	  $closeBtn.click(() => {
	    $tool.close();
	  });
	  $msg.append($closeBtn);
	  const $btnsBox = $msg.find('.message-btns');

	  for (const btn of buttons) {
	    const $btn = $(`<button class="message-btn message-btn-${btn.type || ''}">${btn.text}</button>`);

	    if (btn.click) {
	      $btn.click(e => btn.click(e, $tool));
	    }

	    $btnsBox.append($btn);
	  }

	  $(document.body).append($msg);
	  $tool.show();
	}

	function createFancyBox($img) {
	  const $box = $('<div class="z-fancy-box"> </div>'); // $box.on('scroll', (e) => e.preventDefault())
	  // $box.on('wheel', (e) => e.preventDefault())

	  const hideBox = () => {
	    $box.hide();
	    $box.remove();
	  };

	  $box.click(e => e.target !== $img[0] && hideBox());
	  $($img).addClass('z-fancy-img');
	  const $container = $(`<div class="z-fancy-container"></div>`);
	  $container.append($img);
	  $box.append($container);
	  return $box;
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	var isObject_1 = isObject;

	/** Detect free variable `global` from Node.js. */

	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
	var _freeGlobal = freeGlobal;

	/** Detect free variable `self`. */

	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
	/** Used as a reference to the global object. */

	var root = _freeGlobal || freeSelf || Function('return this')();
	var _root = root;

	/**
	 * Gets the timestamp of the number of milliseconds that have elapsed since
	 * the Unix epoch (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Date
	 * @returns {number} Returns the timestamp.
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => Logs the number of milliseconds it took for the deferred invocation.
	 */

	var now = function () {
	  return _root.Date.now();
	};

	var now_1 = now;

	/** Built-in value references. */

	var Symbol$1 = _root.Symbol;
	var _Symbol = Symbol$1;

	/** Used for built-in method references. */

	var objectProto = Object.prototype;
	/** Used to check objects for own properties. */

	var hasOwnProperty = objectProto.hasOwnProperty;
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */

	var nativeObjectToString = objectProto.toString;
	/** Built-in value references. */

	var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;
	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */

	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];

	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);

	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }

	  return result;
	}

	var _getRawTag = getRawTag;

	/** Used for built-in method references. */
	var objectProto$1 = Object.prototype;
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */

	var nativeObjectToString$1 = objectProto$1.toString;
	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */

	function objectToString(value) {
	  return nativeObjectToString$1.call(value);
	}

	var _objectToString = objectToString;

	/** `Object#toString` result references. */

	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';
	/** Built-in value references. */

	var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;
	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */

	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }

	  return symToStringTag$1 && symToStringTag$1 in Object(value) ? _getRawTag(value) : _objectToString(value);
	}

	var _baseGetTag = baseGetTag;

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	var isObjectLike_1 = isObjectLike;

	/** `Object#toString` result references. */

	var symbolTag = '[object Symbol]';
	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */

	function isSymbol(value) {
	  return typeof value == 'symbol' || isObjectLike_1(value) && _baseGetTag(value) == symbolTag;
	}

	var isSymbol_1 = isSymbol;

	/** Used as references for various `Number` constants. */

	var NAN = 0 / 0;
	/** Used to match leading and trailing whitespace. */

	var reTrim = /^\s+|\s+$/g;
	/** Used to detect bad signed hexadecimal string values. */

	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
	/** Used to detect binary string values. */

	var reIsBinary = /^0b[01]+$/i;
	/** Used to detect octal string values. */

	var reIsOctal = /^0o[0-7]+$/i;
	/** Built-in method references without a dependency on `root`. */

	var freeParseInt = parseInt;
	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */

	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }

	  if (isSymbol_1(value)) {
	    return NAN;
	  }

	  if (isObject_1(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject_1(other) ? other + '' : other;
	  }

	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }

	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
	}

	var toNumber_1 = toNumber;

	/** Error message constants. */

	var FUNC_ERROR_TEXT = 'Expected a function';
	/* Built-in method references for those with the same name as other `lodash` methods. */

	var nativeMax = Math.max,
	    nativeMin = Math.min;
	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed `func` invocations and a `flush` method to immediately invoke them.
	 * Provide `options` to indicate whether `func` should be invoked on the
	 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	 * with the last arguments provided to the debounced function. Subsequent
	 * calls to the debounced function return the result of the last `func`
	 * invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the debounced function
	 * is invoked more than once during the `wait` timeout.
	 *
	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=false]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {number} [options.maxWait]
	 *  The maximum time `func` is allowed to be delayed before it's invoked.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // Avoid costly calculations while the window size is in flux.
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
	 * jQuery(element).on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
	 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', debounced);
	 *
	 * // Cancel the trailing debounced invocation.
	 * jQuery(window).on('popstate', debounced.cancel);
	 */

	function debounce(func, wait, options) {
	  var lastArgs,
	      lastThis,
	      maxWait,
	      result,
	      timerId,
	      lastCallTime,
	      lastInvokeTime = 0,
	      leading = false,
	      maxing = false,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }

	  wait = toNumber_1(wait) || 0;

	  if (isObject_1(options)) {
	    leading = !!options.leading;
	    maxing = 'maxWait' in options;
	    maxWait = maxing ? nativeMax(toNumber_1(options.maxWait) || 0, wait) : maxWait;
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }

	  function invokeFunc(time) {
	    var args = lastArgs,
	        thisArg = lastThis;
	    lastArgs = lastThis = undefined;
	    lastInvokeTime = time;
	    result = func.apply(thisArg, args);
	    return result;
	  }

	  function leadingEdge(time) {
	    // Reset any `maxWait` timer.
	    lastInvokeTime = time; // Start the timer for the trailing edge.

	    timerId = setTimeout(timerExpired, wait); // Invoke the leading edge.

	    return leading ? invokeFunc(time) : result;
	  }

	  function remainingWait(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime,
	        timeWaiting = wait - timeSinceLastCall;
	    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
	  }

	  function shouldInvoke(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime; // Either this is the first call, activity has stopped and we're at the
	    // trailing edge, the system time has gone backwards and we're treating
	    // it as the trailing edge, or we've hit the `maxWait` limit.

	    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
	  }

	  function timerExpired() {
	    var time = now_1();

	    if (shouldInvoke(time)) {
	      return trailingEdge(time);
	    } // Restart the timer.


	    timerId = setTimeout(timerExpired, remainingWait(time));
	  }

	  function trailingEdge(time) {
	    timerId = undefined; // Only invoke if we have `lastArgs` which means `func` has been
	    // debounced at least once.

	    if (trailing && lastArgs) {
	      return invokeFunc(time);
	    }

	    lastArgs = lastThis = undefined;
	    return result;
	  }

	  function cancel() {
	    if (timerId !== undefined) {
	      clearTimeout(timerId);
	    }

	    lastInvokeTime = 0;
	    lastArgs = lastCallTime = lastThis = timerId = undefined;
	  }

	  function flush() {
	    return timerId === undefined ? result : trailingEdge(now_1());
	  }

	  function debounced() {
	    var time = now_1(),
	        isInvoking = shouldInvoke(time);
	    lastArgs = arguments;
	    lastThis = this;
	    lastCallTime = time;

	    if (isInvoking) {
	      if (timerId === undefined) {
	        return leadingEdge(lastCallTime);
	      }

	      if (maxing) {
	        // Handle invocations in a tight loop.
	        clearTimeout(timerId);
	        timerId = setTimeout(timerExpired, wait);
	        return invokeFunc(lastCallTime);
	      }
	    }

	    if (timerId === undefined) {
	      timerId = setTimeout(timerExpired, wait);
	    }

	    return result;
	  }

	  debounced.cancel = cancel;
	  debounced.flush = flush;
	  return debounced;
	}

	var debounce_1 = debounce;

	/** Error message constants. */

	var FUNC_ERROR_TEXT$1 = 'Expected a function';
	/**
	 * Creates a throttled function that only invokes `func` at most once per
	 * every `wait` milliseconds. The throttled function comes with a `cancel`
	 * method to cancel delayed `func` invocations and a `flush` method to
	 * immediately invoke them. Provide `options` to indicate whether `func`
	 * should be invoked on the leading and/or trailing edge of the `wait`
	 * timeout. The `func` is invoked with the last arguments provided to the
	 * throttled function. Subsequent calls to the throttled function return the
	 * result of the last `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the throttled function
	 * is invoked more than once during the `wait` timeout.
	 *
	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.throttle` and `_.debounce`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to throttle.
	 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=true]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
	 * @returns {Function} Returns the new throttled function.
	 * @example
	 *
	 * // Avoid excessively updating the position while scrolling.
	 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
	 *
	 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
	 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
	 * jQuery(element).on('click', throttled);
	 *
	 * // Cancel the trailing throttled invocation.
	 * jQuery(window).on('popstate', throttled.cancel);
	 */

	function throttle(func, wait, options) {
	  var leading = true,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT$1);
	  }

	  if (isObject_1(options)) {
	    leading = 'leading' in options ? !!options.leading : leading;
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }

	  return debounce_1(func, wait, {
	    'leading': leading,
	    'maxWait': wait,
	    'trailing': trailing
	  });
	}

	var throttle_1 = throttle;

	var name$1 = "simple";
	var version = "1.0.2";
	var description = "Hexo theme.";
	var scripts = {
		"generate:sw": "workbox generateSW",
		build: "rollup -c --environment NODE_ENV:production",
		dev: "rollup -c -w --environment NODE_ENV:development"
	};
	var author = "xliGem";
	var license = "MIT";
	var dependencies = {
		firement: "^0.0.5",
		lodash: "^4.17.15",
		pug: "^3.0.0",
		sass: "^1.26.8",
		zepto: "^1.2.0"
	};
	var devDependencies = {
		"@babel/core": "^7.10.2",
		"@babel/preset-env": "^7.10.2",
		"@rollup/plugin-commonjs": "^13.0.0",
		"@rollup/plugin-json": "^4.1.0",
		"@rollup/plugin-node-resolve": "^8.0.1",
		"@rollup/plugin-replace": "^2.3.3",
		rollup: "^2.16.1",
		"rollup-plugin-babel": "^4.4.0",
		"rollup-plugin-terser": "^6.1.0",
		"workbox-cli": "^5.1.3"
	};
	var pkg = {
		name: name$1,
		version: version,
		description: description,
		scripts: scripts,
		author: author,
		license: license,
		dependencies: dependencies,
		devDependencies: devDependencies
	};

	const configs = {
	  debug: "development" === 'development',
	  version: pkg.version
	};

	window.addEventListener('load', () => {
	  console.log(`${ 'Development' } ${configs.version}`);
	  $(window).scroll(throttle_1(() => {
	    const top = $(window).scrollTop();

	    if (top < 5) {
	      $('nav').removeClass('active');
	    } else {
	      $('nav').addClass('active');
	    }
	  }, 100));
	  $('.excerpt-link').click(function () {
	    document.location.href = $(this).attr('href');
	  });
	  const mediaQuery = queryDarkMode();
	  switchTheme(mediaQuery.matches);
	  mediaQuery.addEventListener('change', e => {
	    switchTheme(e.matches);
	  });
	});
	/**
	 * @returns {MediaQueryList}
	 */

	function queryDarkMode() {
	  const r = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
	  return r || {};
	}

	function createCss(isDark = false) {
	  const hljsCss = isDark ? 'https://cdn.bootcss.com/highlight.js/9.18.1/styles/atom-one-dark.min.css' : 'https://cdn.bootcss.com/highlight.js/9.18.1/styles/atom-one-light.min.css';
	  const $link = document.createElement('link');
	  $link.rel = 'stylesheet';
	  $link.type = 'text/css';
	  $link.href = hljsCss;
	  $link.media = 'all';

	  if (window.$themeLink) {
	    window.$themeLink.remove();
	  }

	  window.$themeLink = $link;
	  $('head').append($link);
	}

	function switchTheme(isDark = false) {
	  createCss(isDark);
	  document.documentElement.setAttribute('theme', isDark ? 'dark' : 'light');
	}

	$(document).ready(() => {
	  const pathname = window.location.pathname;

	  switch (pathname) {
	    case '/':
	      $('.menu').find('.home, .home a').addClass('hover');
	      break;

	    case '/archives/':
	      $('.menu').find('.archives, .archives a').addClass('hover');
	      break;

	    case '/tags/':
	      $('.menu').find('.tags, .tags a').addClass('hover');
	      break;
	  }
	});

	var firement=createCommonjsModule(function(module){var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:{};function e(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;}function n(t,e,n){return t(n={path:e,exports:{},require:function(t,e){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");}/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */(null==e&&n.path);}},n.exports),n.exports;}var r=function(t,e){return (r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(t,e);};var i=function(){return (i=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t;}).apply(this,arguments);};function o(t){var e="function"==typeof Symbol&&Symbol.iterator,n=e&&t[e],r=0;if(n)return n.call(t);if(t&&"number"==typeof t.length)return {next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t};}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.");}function s(t,e){var n="function"==typeof Symbol&&t[Symbol.iterator];if(!n)return t;var r,i,o=n.call(t),s=[];try{for(;(void 0===e||e-->0)&&!(r=o.next()).done;)s.push(r.value);}catch(t){i={error:t};}finally{try{r&&!r.done&&(n=o.return)&&n.call(o);}finally{if(i)throw i.error;}}return s;}function a(t){return this instanceof a?(this.v=t,this):new a(t);}var u=Object.freeze({__proto__:null,__extends:function(t,e){function n(){this.constructor=t;}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n());},get __assign(){return i;},__rest:function(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(t);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(t,r[i])&&(n[r[i]]=t[r[i]]);}return n;},__decorate:function(t,e,n,r){var i,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,n,r);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(s=(o<3?i(s):o>3?i(e,n,s):i(e,n))||s);return o>3&&s&&Object.defineProperty(e,n,s),s;},__param:function(t,e){return function(n,r){e(n,r,t);};},__metadata:function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e);},__awaiter:function(t,e,n,r){return new(n||(n=Promise))(function(i,o){function s(t){try{u(r.next(t));}catch(t){o(t);}}function a(t){try{u(r.throw(t));}catch(t){o(t);}}function u(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n(function(t){t(e);})).then(s,a);}u((r=r.apply(t,e||[])).next());});},__generator:function(t,e){var n,r,i,o,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1];},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this;}),o;function a(o){return function(a){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;s;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return s.label++,{value:o[1],done:!1};case 5:s.label++,r=o[1],o=[0];continue;case 7:o=s.ops.pop(),s.trys.pop();continue;default:if(!(i=s.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){s=0;continue;}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){s.label=o[1];break;}if(6===o[0]&&s.label<i[1]){s.label=i[1],i=o;break;}if(i&&s.label<i[2]){s.label=i[2],s.ops.push(o);break;}i[2]&&s.ops.pop(),s.trys.pop();continue;}o=e.call(t,s);}catch(t){o=[6,t],r=0;}finally{n=i=0;}if(5&o[0])throw o[1];return {value:o[0]?o[1]:void 0,done:!0};}([o,a]);};}},__exportStar:function(t,e){for(var n in t)e.hasOwnProperty(n)||(e[n]=t[n]);},__values:o,__read:s,__spread:function(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(s(arguments[e]));return t;},__spreadArrays:function(){for(var t=0,e=0,n=arguments.length;e<n;e++)t+=arguments[e].length;var r=Array(t),i=0;for(e=0;e<n;e++)for(var o=arguments[e],s=0,a=o.length;s<a;s++,i++)r[i]=o[s];return r;},__await:a,__asyncGenerator:function(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r,i=n.apply(t,e||[]),o=[];return r={},s("next"),s("throw"),s("return"),r[Symbol.asyncIterator]=function(){return this;},r;function s(t){i[t]&&(r[t]=function(e){return new Promise(function(n,r){o.push([t,e,n,r])>1||u(t,e);});});}function u(t,e){try{!function(t){t.value instanceof a?Promise.resolve(t.value.v).then(c,h):l(o[0][2],t);}(i[t](e));}catch(t){l(o[0][3],t);}}function c(t){u("next",t);}function h(t){u("throw",t);}function l(t,e){t(e),o.shift(),o.length&&u(o[0][0],o[0][1]);}},__asyncDelegator:function(t){var e,n;return e={},r("next"),r("throw",function(t){throw t;}),r("return"),e[Symbol.iterator]=function(){return this;},e;function r(r,i){e[r]=t[r]?function(e){return (n=!n)?{value:a(t[r](e)),done:"return"===r}:i?i(e):e;}:i;}},__asyncValues:function(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,n=t[Symbol.asyncIterator];return n?n.call(t):(t=o(t),e={},r("next"),r("throw"),r("return"),e[Symbol.asyncIterator]=function(){return this;},e);function r(n){e[n]=t[n]&&function(e){return new Promise(function(r,i){(function(t,e,n,r){Promise.resolve(r).then(function(e){t({value:e,done:n});},e);})(r,i,(e=t[n](e)).done,e.value);});};}},__makeTemplateObject:function(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t;},__importStar:function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e;},__importDefault:function(t){return t&&t.__esModule?t:{default:t};},__classPrivateFieldGet:function(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return e.get(t);},__classPrivateFieldSet:function(t,e,n){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");return e.set(t,n),n;}}),c=n(function(e,n){Object.defineProperty(n,"__esModule",{value:!0});/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var r={NODE_CLIENT:!1,NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"},i=function(t,e){if(!t)throw o(e);},o=function(t){return new Error("Firebase Database ("+r.SDK_VERSION+") INTERNAL ASSERT FAILED: "+t);},s=function(t){for(var e=[],n=0,r=0;r<t.length;r++){var i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=63&i|128):55296==(64512&i)&&r+1<t.length&&56320==(64512&t.charCodeAt(r+1))?(i=65536+((1023&i)<<10)+(1023&t.charCodeAt(++r)),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=63&i|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=63&i|128);}return e;},a={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/=";},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_.";},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray:function(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();for(var n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[],i=0;i<t.length;i+=3){var o=t[i],s=i+1<t.length,a=s?t[i+1]:0,u=i+2<t.length,c=u?t[i+2]:0,h=o>>2,l=(3&o)<<4|a>>4,f=(15&a)<<2|c>>6,p=63&c;u||(p=64,s||(f=64)),r.push(n[h],n[l],n[f],n[p]);}return r.join("");},encodeString:function(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(s(t),e);},decodeString:function(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):function(t){for(var e=[],n=0,r=0;n<t.length;){var i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){var o=t[n++];e[r++]=String.fromCharCode((31&i)<<6|63&o);}else if(i>239&&i<365){var s=((7&i)<<18|(63&(o=t[n++]))<<12|(63&(a=t[n++]))<<6|63&t[n++])-65536;e[r++]=String.fromCharCode(55296+(s>>10)),e[r++]=String.fromCharCode(56320+(1023&s));}else {o=t[n++];var a=t[n++];e[r++]=String.fromCharCode((15&i)<<12|(63&o)<<6|63&a);}}return e.join("");}(this.decodeStringToByteArray(t,e));},decodeStringToByteArray:function(t,e){this.init_();for(var n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[],i=0;i<t.length;){var o=n[t.charAt(i++)],s=i<t.length?n[t.charAt(i)]:0,a=++i<t.length?n[t.charAt(i)]:64,u=++i<t.length?n[t.charAt(i)]:64;if(++i,null==o||null==s||null==a||null==u)throw Error();var c=o<<2|s>>4;if(r.push(c),64!==a){var h=s<<4&240|a>>2;if(r.push(h),64!==u){var l=a<<6&192|u;r.push(l);}}}return r;},init_:function(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(var t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t);}}},c=function(t){try{return a.decodeString(t,!0);}catch(t){console.error("base64Decode failed: ",t);}return null;};/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function h(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:return new Date(e.getTime());case Object:void 0===t&&(t={});break;case Array:t=[];break;default:return e;}for(var n in e)e.hasOwnProperty(n)&&(t[n]=h(t[n],e[n]));return t;}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var l=function(){function t(){var t=this;this.reject=function(){},this.resolve=function(){},this.promise=new Promise(function(e,n){t.resolve=e,t.reject=n;});}return t.prototype.wrapCallback=function(t){var e=this;return function(n,r){n?e.reject(n):e.resolve(r),"function"==typeof t&&(e.promise.catch(function(){}),1===t.length?t(n):t(n,r));};},t;}();/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function f(){return "undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:"";}function p(){try{return "[object process]"===Object.prototype.toString.call(t.process);}catch(t){return !1;}}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var d=function(t){function e(n,r){var i=t.call(this,r)||this;return i.code=n,i.name="FirebaseError",Object.setPrototypeOf(i,e.prototype),Error.captureStackTrace&&Error.captureStackTrace(i,v.prototype.create),i;}return u.__extends(e,t),e;}(Error),v=function(){function t(t,e,n){this.service=t,this.serviceName=e,this.errors=n;}return t.prototype.create=function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];for(var r=e[0]||{},i=this.service+"/"+t,o=this.errors[t],s=o?y(o,r):"Error",a=this.serviceName+": "+s+" ("+i+").",u=new d(i,a),c=0,h=Object.keys(r);c<h.length;c++){var l=h[c];"_"!==l.slice(-1)&&(l in u&&console.warn('Overwriting FirebaseError base field "'+l+'" can cause unexpected behavior.'),u[l]=r[l]);}return u;},t;}();function y(t,e){return t.replace(m,function(t,n){var r=e[n];return null!=r?r.toString():"<"+n+"?>";});}var m=/\{\$([^}]+)}/g;/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function g(t){return JSON.parse(t);}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var b=function(t){var e={},n={},r={},i="";try{var o=t.split(".");e=g(c(o[0])||""),n=g(c(o[1])||""),i=o[2],r=n.d||{},delete n.d;}catch(t){}return {header:e,claims:n,data:r,signature:i};};/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var w=function(){function t(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=64,this.pad_[0]=128;for(var t=1;t<this.blockSize;++t)this.pad_[t]=0;this.reset();}return t.prototype.reset=function(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0;},t.prototype.compress_=function(t,e){e||(e=0);var n=this.W_;if("string"==typeof t)for(var r=0;r<16;r++)n[r]=t.charCodeAt(e)<<24|t.charCodeAt(e+1)<<16|t.charCodeAt(e+2)<<8|t.charCodeAt(e+3),e+=4;else for(r=0;r<16;r++)n[r]=t[e]<<24|t[e+1]<<16|t[e+2]<<8|t[e+3],e+=4;for(r=16;r<80;r++){var i=n[r-3]^n[r-8]^n[r-14]^n[r-16];n[r]=4294967295&(i<<1|i>>>31);}var o,s,a=this.chain_[0],u=this.chain_[1],c=this.chain_[2],h=this.chain_[3],l=this.chain_[4];for(r=0;r<80;r++){r<40?r<20?(o=h^u&(c^h),s=1518500249):(o=u^c^h,s=1859775393):r<60?(o=u&c|h&(u|c),s=2400959708):(o=u^c^h,s=3395469782);i=(a<<5|a>>>27)+o+l+s+n[r]&4294967295;l=h,h=c,c=4294967295&(u<<30|u>>>2),u=a,a=i;}this.chain_[0]=this.chain_[0]+a&4294967295,this.chain_[1]=this.chain_[1]+u&4294967295,this.chain_[2]=this.chain_[2]+c&4294967295,this.chain_[3]=this.chain_[3]+h&4294967295,this.chain_[4]=this.chain_[4]+l&4294967295;},t.prototype.update=function(t,e){if(null!=t){void 0===e&&(e=t.length);for(var n=e-this.blockSize,r=0,i=this.buf_,o=this.inbuf_;r<e;){if(0===o)for(;r<=n;)this.compress_(t,r),r+=this.blockSize;if("string"==typeof t){for(;r<e;)if(i[o]=t.charCodeAt(r),++r,++o===this.blockSize){this.compress_(i),o=0;break;}}else for(;r<e;)if(i[o]=t[r],++r,++o===this.blockSize){this.compress_(i),o=0;break;}}this.inbuf_=o,this.total_+=e;}},t.prototype.digest=function(){var t=[],e=8*this.total_;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(var n=this.blockSize-1;n>=56;n--)this.buf_[n]=255&e,e/=256;this.compress_(this.buf_);var r=0;for(n=0;n<5;n++)for(var i=24;i>=0;i-=8)t[r]=this.chain_[n]>>i&255,++r;return t;},t;}();var _=function(){function t(t,e){var n=this;this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(function(){t(n);}).catch(function(t){n.error(t);});}return t.prototype.next=function(t){this.forEachObserver(function(e){e.next(t);});},t.prototype.error=function(t){this.forEachObserver(function(e){e.error(t);}),this.close(t);},t.prototype.complete=function(){this.forEachObserver(function(t){t.complete();}),this.close();},t.prototype.subscribe=function(t,e,n){var r,i=this;if(void 0===t&&void 0===e&&void 0===n)throw new Error("Missing Observer.");void 0===(r=function(t,e){if("object"!=typeof t||null===t)return !1;for(var n=0,r=e;n<r.length;n++){var i=r[n];if(i in t&&"function"==typeof t[i])return !0;}return !1;}(t,["next","error","complete"])?t:{next:t,error:e,complete:n}).next&&(r.next=E),void 0===r.error&&(r.error=E),void 0===r.complete&&(r.complete=E);var o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(function(){try{i.finalError?r.error(i.finalError):r.complete();}catch(t){}}),this.observers.push(r),o;},t.prototype.unsubscribeOne=function(t){void 0!==this.observers&&void 0!==this.observers[t]&&(delete this.observers[t],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this));},t.prototype.forEachObserver=function(t){if(!this.finalized)for(var e=0;e<this.observers.length;e++)this.sendOne(e,t);},t.prototype.sendOne=function(t,e){var n=this;this.task.then(function(){if(void 0!==n.observers&&void 0!==n.observers[t])try{e(n.observers[t]);}catch(t){"undefined"!=typeof console&&console.error&&console.error(t);}});},t.prototype.close=function(t){var e=this;this.finalized||(this.finalized=!0,void 0!==t&&(this.finalError=t),this.task.then(function(){e.observers=void 0,e.onNoObservers=void 0;}));},t;}();function E(){}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function I(t,e,n){var r="";switch(e){case 1:r=n?"first":"First";break;case 2:r=n?"second":"Second";break;case 3:r=n?"third":"Third";break;case 4:r=n?"fourth":"Fourth";break;default:throw new Error("errorPrefix called with argumentNumber > 4.  Need to update it?");}var i=t+" failed: ";return i+=r+" argument ";}n.CONSTANTS=r,n.Deferred=l,n.ErrorFactory=v,n.FirebaseError=d,n.Sha1=w,n.assert=i,n.assertionError=o,n.async=function(t,e){return function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];Promise.resolve(!0).then(function(){t.apply(void 0,n);}).catch(function(t){e&&e(t);});};},n.base64=a,n.base64Decode=c,n.base64Encode=function(t){var e=s(t);return a.encodeByteArray(e,!0);},n.contains=/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function(t,e){return Object.prototype.hasOwnProperty.call(t,e);},n.createSubscribe=function(t,e){var n=new _(t,e);return n.subscribe.bind(n);},n.decode=b,n.deepCopy=/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function(t){return h(void 0,t);},n.deepExtend=h,n.errorPrefix=I,n.getUA=f,n.isAdmin=function(t){var e=b(t).claims;return "object"==typeof e&&!0===e.admin;},n.isBrowser=function(){return "object"==typeof self&&self.self===self;},n.isBrowserExtension=function(){var t="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return "object"==typeof t&&void 0!==t.id;},n.isElectron=function(){return f().indexOf("Electron/")>=0;},n.isEmpty=function(t){for(var e in t)if(Object.prototype.hasOwnProperty.call(t,e))return !1;return !0;},n.isIE=function(){var t=f();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0;},n.isMobileCordova=function(){return "undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(f());},n.isNode=p,n.isNodeSdk=function(){return !0===r.NODE_CLIENT||!0===r.NODE_ADMIN;},n.isReactNative=function(){return "object"==typeof navigator&&"ReactNative"===navigator.product;},n.isSafari=function(){return !p()&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome");},n.isUWP=function(){return f().indexOf("MSAppHost/")>=0;},n.isValidFormat=function(t){var e=b(t).claims;return !!e&&"object"==typeof e&&e.hasOwnProperty("iat");},n.isValidTimestamp=function(t){var e=b(t).claims,n=Math.floor(new Date().getTime()/1e3),r=0,i=0;return "object"==typeof e&&(e.hasOwnProperty("nbf")?r=e.nbf:e.hasOwnProperty("iat")&&(r=e.iat),i=e.hasOwnProperty("exp")?e.exp:r+86400),!!n&&!!r&&!!i&&n>=r&&n<=i;},n.issuedAtTime=function(t){var e=b(t).claims;return "object"==typeof e&&e.hasOwnProperty("iat")?e.iat:null;},n.jsonEval=g,n.map=function(t,e,n){var r={};for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(r[i]=e.call(n,t[i],i,t));return r;}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */,n.querystring=function(t){for(var e=[],n=function(t,n){Array.isArray(n)?n.forEach(function(n){e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));},r=0,i=Object.entries(t);r<i.length;r++){var o=i[r];n(o[0],o[1]);}return e.length?"&"+e.join("&"):"";},n.querystringDecode=function(t){var e={};return t.replace(/^\?/,"").split("&").forEach(function(t){if(t){var n=t.split("=");e[n[0]]=n[1];}}),e;},n.safeGet=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)?t[e]:void 0;},n.stringLength=function(t){for(var e=0,n=0;n<t.length;n++){var r=t.charCodeAt(n);r<128?e++:r<2048?e+=2:r>=55296&&r<=56319?(e+=4,n++):e+=3;}return e;},n.stringToByteArray=function(t){for(var e=[],n=0,r=0;r<t.length;r++){var o=t.charCodeAt(r);if(o>=55296&&o<=56319){var s=o-55296;r++,i(r<t.length,"Surrogate pair missing trail surrogate."),o=65536+(s<<10)+(t.charCodeAt(r)-56320);}o<128?e[n++]=o:o<2048?(e[n++]=o>>6|192,e[n++]=63&o|128):o<65536?(e[n++]=o>>12|224,e[n++]=o>>6&63|128,e[n++]=63&o|128):(e[n++]=o>>18|240,e[n++]=o>>12&63|128,e[n++]=o>>6&63|128,e[n++]=63&o|128);}return e;},n.stringify=function(t){return JSON.stringify(t);},n.validateArgCount=function(t,e,n,r){var i;if(r<e?i="at least "+e:r>n&&(i=0===n?"none":"no more than "+n),i)throw new Error(t+" failed: Was called with "+r+(1===r?" argument.":" arguments.")+" Expects "+i+".");},n.validateCallback=function(t,e,n,r){if((!r||n)&&"function"!=typeof n)throw new Error(I(t,e,r)+"must be a valid function.");},n.validateContextObject=function(t,e,n,r){if((!r||n)&&("object"!=typeof n||null===n))throw new Error(I(t,e,r)+"must be a valid context object.");}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */,n.validateNamespace=function(t,e,n,r){if((!r||n)&&"string"!=typeof n)throw new Error(I(t,e,r)+"must be a valid firebase namespace.");};});e(c);c.CONSTANTS,c.Deferred,c.ErrorFactory,c.FirebaseError,c.Sha1,c.assert,c.assertionError,c.async,c.base64,c.base64Decode,c.base64Encode,c.contains,c.createSubscribe,c.decode,c.deepCopy,c.deepExtend,c.errorPrefix,c.getUA,c.isAdmin,c.isBrowser,c.isBrowserExtension,c.isElectron,c.isEmpty,c.isIE,c.isMobileCordova,c.isNode,c.isNodeSdk,c.isReactNative,c.isSafari,c.isUWP,c.isValidFormat,c.isValidTimestamp,c.issuedAtTime,c.jsonEval,c.map,c.querystring,c.querystringDecode,c.safeGet,c.stringLength,c.stringToByteArray,c.stringify,c.validateArgCount,c.validateCallback,c.validateContextObject,c.validateNamespace;var l=n(function(t,e){Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(t,e,n){this.name=t,this.instanceFactory=e,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY";}return t.prototype.setInstantiationMode=function(t){return this.instantiationMode=t,this;},t.prototype.setMultipleInstances=function(t){return this.multipleInstances=t,this;},t.prototype.setServiceProps=function(t){return this.serviceProps=t,this;},t;}(),r=function(){function t(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map(),this.instancesDeferred=new Map();}return t.prototype.get=function(t){void 0===t&&(t="[DEFAULT]");var e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){var n=new c.Deferred();this.instancesDeferred.set(e,n);try{var r=this.getOrInitializeService(e);r&&n.resolve(r);}catch(t){}}return this.instancesDeferred.get(e).promise;},t.prototype.getImmediate=function(t){var e=u.__assign({identifier:"[DEFAULT]",optional:!1},t),n=e.identifier,r=e.optional,i=this.normalizeInstanceIdentifier(n);try{var o=this.getOrInitializeService(i);if(!o){if(r)return null;throw Error("Service "+this.name+" is not available");}return o;}catch(t){if(r)return null;throw t;}},t.prototype.getComponent=function(){return this.component;},t.prototype.setComponent=function(t){var e,n;if(t.name!==this.name)throw Error("Mismatching Component "+t.name+" for Provider "+this.name+".");if(this.component)throw Error("Component for "+this.name+" has already been provided");if(this.component=t,function(t){return "EAGER"===t.instantiationMode;}/**
	 * @license
	 * Copyright 2019 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */(t))try{this.getOrInitializeService("[DEFAULT]");}catch(t){}try{for(var r=u.__values(this.instancesDeferred.entries()),i=r.next();!i.done;i=r.next()){var o=u.__read(i.value,2),s=o[0],a=o[1],c=this.normalizeInstanceIdentifier(s);try{var h=this.getOrInitializeService(c);a.resolve(h);}catch(t){}}}catch(t){e={error:t};}finally{try{i&&!i.done&&(n=r.return)&&n.call(r);}finally{if(e)throw e.error;}}},t.prototype.clearInstance=function(t){void 0===t&&(t="[DEFAULT]"),this.instancesDeferred.delete(t),this.instances.delete(t);},t.prototype.delete=function(){return u.__awaiter(this,void 0,void 0,function(){var t;return u.__generator(this,function(e){switch(e.label){case 0:return t=Array.from(this.instances.values()),[4,Promise.all(t.filter(function(t){return "INTERNAL"in t;}).map(function(t){return t.INTERNAL.delete();}))];case 1:return e.sent(),[2];}});});},t.prototype.isComponentSet=function(){return null!=this.component;},t.prototype.getOrInitializeService=function(t){var e=this.instances.get(t);return !e&&this.component&&(e=this.component.instanceFactory(this.container,function(t){return "[DEFAULT]"===t?void 0:t;}(t)),this.instances.set(t,e)),e||null;},t.prototype.normalizeInstanceIdentifier=function(t){return this.component?this.component.multipleInstances?t:"[DEFAULT]":t;},t;}();/**
	 * @license
	 * Copyright 2019 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var i=function(){function t(t){this.name=t,this.providers=new Map();}return t.prototype.addComponent=function(t){var e=this.getProvider(t.name);if(e.isComponentSet())throw new Error("Component "+t.name+" has already been registered with "+this.name);e.setComponent(t);},t.prototype.addOrOverwriteComponent=function(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t);},t.prototype.getProvider=function(t){if(this.providers.has(t))return this.providers.get(t);var e=new r(t,this);return this.providers.set(t,e),e;},t.prototype.getProviders=function(){return Array.from(this.providers.values());},t;}();e.Component=n,e.ComponentContainer=i,e.Provider=r;});e(l);var f;l.Component,l.ComponentContainer,l.Provider;/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */function p(){for(var t=0,e=0,n=arguments.length;e<n;e++)t+=arguments[e].length;var r=Array(t),i=0;for(e=0;e<n;e++)for(var o=arguments[e],s=0,a=o.length;s<a;s++,i++)r[i]=o[s];return r;}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var d,v=[];!function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT";}(d||(d={}));var y={debug:d.DEBUG,verbose:d.VERBOSE,info:d.INFO,warn:d.WARN,error:d.ERROR,silent:d.SILENT},m=d.INFO,g=((f={})[d.DEBUG]="log",f[d.VERBOSE]="log",f[d.INFO]="info",f[d.WARN]="warn",f[d.ERROR]="error",f),b=function(t,e){for(var n=[],r=2;r<arguments.length;r++)n[r-2]=arguments[r];if(!(e<t.logLevel)){var i=new Date().toISOString(),o=g[e];if(!o)throw new Error("Attempted to log a message with an invalid logType (value: "+e+")");console[o].apply(console,p(["["+i+"]  "+t.name+":"],n));}},w=function(){function t(t){this.name=t,this._logLevel=m,this._logHandler=b,this._userLogHandler=null,v.push(this);}return Object.defineProperty(t.prototype,"logLevel",{get:function(){return this._logLevel;},set:function(t){if(!(t in d))throw new TypeError('Invalid value "'+t+'" assigned to `logLevel`');this._logLevel=t;},enumerable:!0,configurable:!0}),t.prototype.setLogLevel=function(t){this._logLevel="string"==typeof t?y[t]:t;},Object.defineProperty(t.prototype,"logHandler",{get:function(){return this._logHandler;},set:function(t){if("function"!=typeof t)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t;},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"userLogHandler",{get:function(){return this._userLogHandler;},set:function(t){this._userLogHandler=t;},enumerable:!0,configurable:!0}),t.prototype.debug=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this._userLogHandler&&this._userLogHandler.apply(this,p([this,d.DEBUG],t)),this._logHandler.apply(this,p([this,d.DEBUG],t));},t.prototype.log=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this._userLogHandler&&this._userLogHandler.apply(this,p([this,d.VERBOSE],t)),this._logHandler.apply(this,p([this,d.VERBOSE],t));},t.prototype.info=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this._userLogHandler&&this._userLogHandler.apply(this,p([this,d.INFO],t)),this._logHandler.apply(this,p([this,d.INFO],t));},t.prototype.warn=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this._userLogHandler&&this._userLogHandler.apply(this,p([this,d.WARN],t)),this._logHandler.apply(this,p([this,d.WARN],t));},t.prototype.error=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this._userLogHandler&&this._userLogHandler.apply(this,p([this,d.ERROR],t)),this._logHandler.apply(this,p([this,d.ERROR],t));},t;}();var _=Object.freeze({__proto__:null,get LogLevel(){return d;},Logger:w,setLogLevel:function(t){v.forEach(function(e){e.setLogLevel(t);});},setUserLogHandler:function(t,e){for(var n=function(n){var r=null;e&&e.level&&(r=y[e.level]),n.userLogHandler=null===t?null:function(e,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];var s=i.map(function(t){if(null==t)return null;if("string"==typeof t)return t;if("number"==typeof t||"boolean"==typeof t)return t.toString();if(t instanceof Error)return t.message;try{return JSON.stringify(t);}catch(t){return null;}}).filter(function(t){return t;}).join(" ");n>=(null!=r?r:e.logLevel)&&t({level:d[n].toLowerCase(),message:s,args:i,type:e.name});};},r=0,i=v;r<i.length;r++){n(i[r]);}}}),E=n(function(t,e){/**
	 * @license
	 * Copyright 2019 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var n;Object.defineProperty(e,"__esModule",{value:!0});var r,i=((n={})["no-app"]="No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",n["bad-app-name"]="Illegal App name: '{$appName}",n["duplicate-app"]="Firebase App named '{$appName}' already exists",n["app-deleted"]="Firebase App named '{$appName}' already deleted",n["invalid-app-argument"]="firebase.{$appName}() takes either no argument or a Firebase App instance.",n["invalid-log-argument"]="First argument to `onLog` must be null or a function.",n),o=new c.ErrorFactory("app","Firebase",i),s=((r={})["@firebase/app"]="fire-core",r["@firebase/analytics"]="fire-analytics",r["@firebase/auth"]="fire-auth",r["@firebase/database"]="fire-rtdb",r["@firebase/functions"]="fire-fn",r["@firebase/installations"]="fire-iid",r["@firebase/messaging"]="fire-fcm",r["@firebase/performance"]="fire-perf",r["@firebase/remote-config"]="fire-rc",r["@firebase/storage"]="fire-gcs",r["@firebase/firestore"]="fire-fst",r["fire-js"]="fire-js",r["firebase-wrapper"]="fire-js-all",r),a=new _.Logger("@firebase/app"),h=function(){function t(t,e,n){var r,i,o=this;this.firebase_=n,this.isDeleted_=!1,this.name_=e.name,this.automaticDataCollectionEnabled_=e.automaticDataCollectionEnabled||!1,this.options_=c.deepCopy(t),this.container=new l.ComponentContainer(e.name),this._addComponent(new l.Component("app",function(){return o;},"PUBLIC"));try{for(var s=u.__values(this.firebase_.INTERNAL.components.values()),a=s.next();!a.done;a=s.next()){var h=a.value;this._addComponent(h);}}catch(t){r={error:t};}finally{try{a&&!a.done&&(i=s.return)&&i.call(s);}finally{if(r)throw r.error;}}}return Object.defineProperty(t.prototype,"automaticDataCollectionEnabled",{get:function(){return this.checkDestroyed_(),this.automaticDataCollectionEnabled_;},set:function(t){this.checkDestroyed_(),this.automaticDataCollectionEnabled_=t;},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"name",{get:function(){return this.checkDestroyed_(),this.name_;},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"options",{get:function(){return this.checkDestroyed_(),this.options_;},enumerable:!0,configurable:!0}),t.prototype.delete=function(){var t=this;return new Promise(function(e){t.checkDestroyed_(),e();}).then(function(){return t.firebase_.INTERNAL.removeApp(t.name_),Promise.all(t.container.getProviders().map(function(t){return t.delete();}));}).then(function(){t.isDeleted_=!0;});},t.prototype._getService=function(t,e){return void 0===e&&(e="[DEFAULT]"),this.checkDestroyed_(),this.container.getProvider(t).getImmediate({identifier:e});},t.prototype._removeServiceInstance=function(t,e){void 0===e&&(e="[DEFAULT]"),this.container.getProvider(t).clearInstance(e);},t.prototype._addComponent=function(t){try{this.container.addComponent(t);}catch(e){a.debug("Component "+t.name+" failed to register with FirebaseApp "+this.name,e);}},t.prototype._addOrOverwriteComponent=function(t){this.container.addOrOverwriteComponent(t);},t.prototype.checkDestroyed_=function(){if(this.isDeleted_)throw o.create("app-deleted",{appName:this.name_});},t;}();h.prototype.name&&h.prototype.options||h.prototype.delete||console.log("dc");var f=/**
	 * @license
	 * Copyright 2019 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function t(){var e=/**
	 * @license
	 * Copyright 2019 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function(t){var e={},n=new Map(),r={__esModule:!0,initializeApp:function(n,i){void 0===i&&(i={});if("object"!=typeof i||null===i){i={name:i};}var s=i;void 0===s.name&&(s.name="[DEFAULT]");var a=s.name;if("string"!=typeof a||!a)throw o.create("bad-app-name",{appName:String(a)});if(c.contains(e,a))throw o.create("duplicate-app",{appName:a});var u=new t(n,s,r);return e[a]=u,u;},app:i,registerVersion:function(t,e,n){var r,i=null!==(r=s[t])&&void 0!==r?r:t;n&&(i+="-"+n);var o=i.match(/\s|\//),u=e.match(/\s|\//);if(o||u){var c=['Unable to register library "'+i+'" with version "'+e+'":'];return o&&c.push('library name "'+i+'" contains illegal characters (whitespace or "/")'),o&&u&&c.push("and"),u&&c.push('version name "'+e+'" contains illegal characters (whitespace or "/")'),void a.warn(c.join(" "));}h(new l.Component(i+"-version",function(){return {library:i,version:e};},"VERSION"));},setLogLevel:_.setLogLevel,onLog:function(t,e){if(null!==t&&"function"!=typeof t)throw o.create("invalid-log-argument",{appName:name});_.setUserLogHandler(t,e);},apps:null,SDK_VERSION:"7.15.0",INTERNAL:{registerComponent:h,removeApp:function(t){delete e[t];},components:n,useAsService:function(t,e){if("serverAuth"===e)return null;return e;}}};function i(t){if(t=t||"[DEFAULT]",!c.contains(e,t))throw o.create("no-app",{appName:t});return e[t];}function h(s){var h,l,f=s.name;if(n.has(f))return a.debug("There were multiple attempts to register component "+f+"."),"PUBLIC"===s.type?r[f]:null;if(n.set(f,s),"PUBLIC"===s.type){var p=function(t){if(void 0===t&&(t=i()),"function"!=typeof t[f])throw o.create("invalid-app-argument",{appName:f});return t[f]();};void 0!==s.serviceProps&&c.deepExtend(p,s.serviceProps),r[f]=p,t.prototype[f]=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=this._getService.bind(this,f);return n.apply(this,s.multipleInstances?t:[]);};}try{for(var d=u.__values(Object.keys(e)),v=d.next();!v.done;v=d.next()){var y=v.value;e[y]._addComponent(s);}}catch(t){h={error:t};}finally{try{v&&!v.done&&(l=d.return)&&l.call(d);}finally{if(h)throw h.error;}}return "PUBLIC"===s.type?r[f]:null;}return r.default=r,Object.defineProperty(r,"apps",{get:function(){return Object.keys(e).map(function(t){return e[t];});}}),i.App=t,r;}(h);return e.INTERNAL=u.__assign(u.__assign({},e.INTERNAL),{createFirebaseNamespace:t,extendNamespace:function(t){c.deepExtend(e,t);},createSubscribe:c.createSubscribe,ErrorFactory:c.ErrorFactory,deepExtend:c.deepExtend}),e;}(),p=function(){function t(t){this.container=t;}return t.prototype.getPlatformInfoString=function(){return this.container.getProviders().map(function(t){if(function(t){var e=t.getComponent();return "VERSION"===(null==e?void 0:e.type);}/**
	 * @license
	 * Copyright 2019 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */(t)){var e=t.getImmediate();return e.library+"/"+e.version;}return null;}).filter(function(t){return t;}).join(" ");},t;}();/**
	 * @license
	 * Copyright 2019 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */ /**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */if(c.isBrowser()&&void 0!==self.firebase){a.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");var d=self.firebase.SDK_VERSION;d&&d.indexOf("LITE")>=0&&a.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");}var v=f.initializeApp;f.initializeApp=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return c.isNode()&&a.warn('\n      Warning: This is a browser-targeted Firebase bundle but it appears it is being\n      run in a Node environment.  If running in a Node environment, make sure you\n      are using the bundle specified by the "main" field in package.json.\n      \n      If you are using Webpack, you can specify "main" as the first item in\n      "resolve.mainFields":\n      https://webpack.js.org/configuration/resolve/#resolvemainfields\n      \n      If using Rollup, use the rollup-plugin-node-resolve plugin and specify "main"\n      as the first item in "mainFields", e.g. [\'main\', \'module\'].\n      https://github.com/rollup/rollup-plugin-node-resolve\n      '),v.apply(void 0,t);};var y=f;!function(t,e){t.INTERNAL.registerComponent(new l.Component("platform-logger",function(t){return new p(t);},"PRIVATE")),t.registerVersion("@firebase/app","0.6.5",e),t.registerVersion("fire-js","");}(y),e.default=y,e.firebase=y;}),I=e(E);E.firebase;/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */function T(t){var e="function"==typeof Symbol&&Symbol.iterator,n=e&&t[e],r=0;if(n)return n.call(t);if(t&&"number"==typeof t.length)return {next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t};}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.");}(function(){var t,e="function"==typeof Object.defineProperties?Object.defineProperty:function(t,e,n){t!=Array.prototype&&t!=Object.prototype&&(t[e]=n.value);};var n=function(t){t=["object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof commonjsGlobal&&commonjsGlobal,t];for(var e=0;e<t.length;++e){var n=t[e];if(n&&n.Math==Math)return n;}return globalThis;}(this);function r(t){var e=0;return function(){return e<t.length?{done:!1,value:t[e++]}:{done:!0};};}function i(t){var e="undefined"!=typeof Symbol&&Symbol.iterator&&t[Symbol.iterator];return e?e.call(t):{next:r(t)};}!function(t,r){if(r){var i=n;t=t.split(".");for(var o=0;o<t.length-1;o++){var s=t[o];s in i||(i[s]={}),i=i[s];}(r=r(o=i[t=t[t.length-1]]))!=o&&null!=r&&e(i,t,{configurable:!0,writable:!0,value:r});}}("Promise",function(t){function e(t){this.b=0,this.c=void 0,this.a=[];var e=this.f();try{t(e.resolve,e.reject);}catch(t){e.reject(t);}}function r(){this.a=null;}function o(t){return t instanceof e?t:new e(function(e){e(t);});}if(t)return t;r.prototype.b=function(t){if(null==this.a){this.a=[];var e=this;this.c(function(){e.g();});}this.a.push(t);};var s=n.setTimeout;r.prototype.c=function(t){s(t,0);},r.prototype.g=function(){for(;this.a&&this.a.length;){var t=this.a;this.a=[];for(var e=0;e<t.length;++e){var n=t[e];t[e]=null;try{n();}catch(t){this.f(t);}}}this.a=null;},r.prototype.f=function(t){this.c(function(){throw t;});},e.prototype.f=function(){function t(t){return function(r){n||(n=!0,t.call(e,r));};}var e=this,n=!1;return {resolve:t(this.m),reject:t(this.g)};},e.prototype.m=function(t){if(t===this)this.g(new TypeError("A Promise cannot resolve to itself"));else if(t instanceof e)this.s(t);else {t:switch(typeof t){case"object":var n=null!=t;break t;case"function":n=!0;break t;default:n=!1;}n?this.u(t):this.h(t);}},e.prototype.u=function(t){var e=void 0;try{e=t.then;}catch(t){return void this.g(t);}"function"==typeof e?this.w(e,t):this.h(t);},e.prototype.g=function(t){this.i(2,t);},e.prototype.h=function(t){this.i(1,t);},e.prototype.i=function(t,e){if(0!=this.b)throw Error("Cannot settle("+t+", "+e+"): Promise already settled in state"+this.b);this.b=t,this.c=e,this.l();},e.prototype.l=function(){if(null!=this.a){for(var t=0;t<this.a.length;++t)a.b(this.a[t]);this.a=null;}};var a=new r();return e.prototype.s=function(t){var e=this.f();t.Oa(e.resolve,e.reject);},e.prototype.w=function(t,e){var n=this.f();try{t.call(e,n.resolve,n.reject);}catch(t){n.reject(t);}},e.prototype.then=function(t,n){function r(t,e){return "function"==typeof t?function(e){try{i(t(e));}catch(t){o(t);}}:e;}var i,o,s=new e(function(t,e){i=t,o=e;});return this.Oa(r(t,i),r(n,o)),s;},e.prototype.catch=function(t){return this.then(void 0,t);},e.prototype.Oa=function(t,e){function n(){switch(r.b){case 1:t(r.c);break;case 2:e(r.c);break;default:throw Error("Unexpected state: "+r.b);}}var r=this;null==this.a?a.b(n):this.a.push(n);},e.resolve=o,e.reject=function(t){return new e(function(e,n){n(t);});},e.race=function(t){return new e(function(e,n){for(var r=i(t),s=r.next();!s.done;s=r.next())o(s.value).Oa(e,n);});},e.all=function(t){var n=i(t),r=n.next();return r.done?o([]):new e(function(t,e){function i(e){return function(n){s[e]=n,0==--a&&t(s);};}var s=[],a=0;do{s.push(void 0),a++,o(r.value).Oa(i(s.length-1),e),r=n.next();}while(!r.done);});},e;});var o=o||{},s=this||self,a=/^[\w+/_-]+[=]{0,2}$/,u=null;function c(){}function h(t){var e=typeof t;if("object"==e){if(!t)return "null";if(t instanceof Array)return "array";if(t instanceof Object)return e;var n=Object.prototype.toString.call(t);if("[object Window]"==n)return "object";if("[object Array]"==n||"number"==typeof t.length&&void 0!==t.splice&&void 0!==t.propertyIsEnumerable&&!t.propertyIsEnumerable("splice"))return "array";if("[object Function]"==n||void 0!==t.call&&void 0!==t.propertyIsEnumerable&&!t.propertyIsEnumerable("call"))return "function";}else if("function"==e&&void 0===t.call)return "object";return e;}function l(t){var e=h(t);return "array"==e||"object"==e&&"number"==typeof t.length;}function f(t){return "function"==h(t);}function p(t){var e=typeof t;return "object"==e&&null!=t||"function"==e;}var d="closure_uid_"+(1e9*Math.random()>>>0),v=0;function y(t,e,n){return t.call.apply(t.bind,arguments);}function m(t,e,n){if(!t)throw Error();if(2<arguments.length){var r=Array.prototype.slice.call(arguments,2);return function(){var n=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(n,r),t.apply(e,n);};}return function(){return t.apply(e,arguments);};}function g(t,e,n){return (g=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?y:m).apply(null,arguments);}function b(t,e){var n=Array.prototype.slice.call(arguments,1);return function(){var e=n.slice();return e.push.apply(e,arguments),t.apply(this,e);};}var w=Date.now||function(){return +new Date();};function _(t,e){function n(){}n.prototype=e.prototype,t.Za=e.prototype,t.prototype=new n(),t.prototype.constructor=t;}function E(t,e,n){this.code=k+t,this.message=e||N[t]||"",this.a=n||null;}function T(t){var e=t&&t.code;return e?new E(e.substring(k.length),t.message,t.serverResponse):null;}_(E,Error),E.prototype.v=function(){var t={code:this.code,message:this.message};return this.a&&(t.serverResponse=this.a),t;},E.prototype.toJSON=function(){return this.v();};var A,k="auth/",N={"admin-restricted-operation":"This operation is restricted to administrators only.","argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","app-not-installed":"The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.","captcha-check-failed":"The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.","code-expired":"The SMS code has expired. Please re-send the verification code to try again.","cordova-not-ready":"Cordova framework is not ready.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.","requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.","dynamic-link-not-activated":"Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.","email-change-needs-verification":"Multi-factor users must always have a verified email.","email-already-in-use":"The email address is already in use by another account.","expired-action-code":"The action code has expired. ","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.","internal-error":"An internal error has occurred.","invalid-app-credential":"The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.","invalid-app-id":"The mobile app identifier is not registed for the current project.","invalid-user-token":"This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.","invalid-auth-event":"An internal error has occurred.","invalid-verification-code":"The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure use the verification code provided by the user.","invalid-continue-uri":"The continue URL provided in the request is invalid.","invalid-cordova-configuration":"The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.","invalid-custom-token":"The custom token format is incorrect. Please check the documentation.","invalid-dynamic-link-domain":"The provided dynamic link domain is not configured or authorized for the current project.","invalid-email":"The email address is badly formatted.","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.","invalid-cert-hash":"The SHA-1 certificate hash provided is invalid.","invalid-credential":"The supplied auth credential is malformed or has expired.","invalid-message-payload":"The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-multi-factor-session":"The request does not contain a valid proof of first factor successful sign-in.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","invalid-oauth-client-id":"The OAuth client ID provided is either invalid or does not match the specified API key.","unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.","invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","invalid-persistence-type":"The specified persistence type is invalid. It can only be local, session or none.","invalid-phone-number":"The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].","invalid-provider-id":"The specified provider ID is invalid.","invalid-recipient-email":"The email corresponding to this action failed to send as the provided recipient email address is invalid.","invalid-sender":"The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-verification-id":"The verification ID used to create the phone auth credential is invalid.","invalid-tenant-id":"The Auth instance's tenant ID is invalid.","multi-factor-info-not-found":"The user does not have a second factor matching the identifier provided.","multi-factor-auth-required":"Proof of ownership of a second factor is required to complete sign-in.","missing-android-pkg-name":"An Android Package Name must be provided if the Android App is required to be installed.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","missing-app-credential":"The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.","missing-verification-code":"The phone auth credential was created with an empty SMS verification code.","missing-continue-uri":"A continue URL must be provided in the request.","missing-iframe-start":"An internal error has occurred.","missing-ios-bundle-id":"An iOS Bundle ID must be provided if an App Store ID is provided.","missing-multi-factor-info":"No second factor identifier is provided.","missing-multi-factor-session":"The request is missing proof of first factor successful sign-in.","missing-or-invalid-nonce":"The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.","missing-phone-number":"To send verification codes, provide a phone number for the recipient.","missing-verification-id":"The phone auth credential was created with an empty verification ID.","app-deleted":"This instance of FirebaseApp has been deleted.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.","network-request-failed":"A network error (such as timeout, interrupted connection or unreachable host) has occurred.","no-auth-event":"An internal error has occurred.","no-such-provider":"User was not linked to an account with the given provider.","null-user":"A null user object was provided as the argument for an operation which requires a non-null user object.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',"popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.","quota-exceeded":"The project's quota for this operation has been exceeded.","redirect-cancelled-by-user":"The redirect operation has been cancelled by the user before finalizing.","redirect-operation-pending":"A redirect sign-in operation is already pending.","rejected-credential":"The request contains malformed or mismatching credentials.","second-factor-already-in-use":"The second factor is already enrolled on this account.","maximum-second-factor-count-exceeded":"The maximum allowed number of second factors on a user has been exceeded.","tenant-id-mismatch":"The provided tenant ID does not match the Auth instance's tenant ID",timeout:"The operation has timed out.","user-token-expired":"The user's credential is no longer valid. The user must sign in again.","too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.","unauthorized-continue-uri":"The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.","unsupported-first-factor":"Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.","unsupported-persistence-type":"The current environment does not support the specified persistence type.","unsupported-tenant-operation":"This operation is not supported in a multi-tenant context.","unverified-email":"The operation requires a verified email.","user-cancelled":"The user did not grant your application the permissions it requested.","user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.","user-signed-out":"","weak-password":"The password must be 6 characters long or more.","web-storage-unsupported":"This browser is not supported or 3rd party cookies and data may be disabled."},S={hd:{Ra:"https://staging-identitytoolkit.sandbox.googleapis.com/identitytoolkit/v3/relyingparty/",Xa:"https://staging-securetoken.sandbox.googleapis.com/v1/token",Ua:"https://staging-identitytoolkit.sandbox.googleapis.com/v2/",id:"b"},pd:{Ra:"https://www.googleapis.com/identitytoolkit/v3/relyingparty/",Xa:"https://securetoken.googleapis.com/v1/token",Ua:"https://identitytoolkit.googleapis.com/v2/",id:"p"},rd:{Ra:"https://staging-www.sandbox.googleapis.com/identitytoolkit/v3/relyingparty/",Xa:"https://staging-securetoken.sandbox.googleapis.com/v1/token",Ua:"https://staging-identitytoolkit.sandbox.googleapis.com/v2/",id:"s"},sd:{Ra:"https://www-googleapis-test.sandbox.google.com/identitytoolkit/v3/relyingparty/",Xa:"https://test-securetoken.sandbox.googleapis.com/v1/token",Ua:"https://test-identitytoolkit.sandbox.googleapis.com/v2/",id:"t"}};function x(t){for(var e in S)if(S[e].id===t)return {firebaseEndpoint:(t=S[e]).Ra,secureTokenEndpoint:t.Xa,identityPlatformEndpoint:t.Ua};return null;}function O(t){if(!t)return !1;try{return !!t.$goog_Thenable;}catch(t){return !1;}}function D(t){if(Error.captureStackTrace)Error.captureStackTrace(this,D);else {var e=Error().stack;e&&(this.stack=e);}t&&(this.message=String(t));}function R(t,e){for(var n="",r=(t=t.split("%s")).length-1,i=0;i<r;i++)n+=t[i]+(i<e.length?e[i]:"%s");D.call(this,n+t[r]);}function C(t,e){throw new R("Failure"+(t?": "+t:""),Array.prototype.slice.call(arguments,1));}function P(t,e){this.c=t,this.f=e,this.b=0,this.a=null;}function L(t,e){t.f(e),100>t.b&&(t.b++,e.next=t.a,t.a=e);}function M(){this.b=this.a=null;}A=x("__EID__")?"__EID__":void 0,_(D,Error),D.prototype.name="CustomError",_(R,D),R.prototype.name="AssertionError",P.prototype.get=function(){if(0<this.b){this.b--;var t=this.a;this.a=t.next,t.next=null;}else t=this.c();return t;};var j=new P(function(){return new U();},function(t){t.reset();});function V(){var t=ve,e=null;return t.a&&(e=t.a,t.a=t.a.next,t.a||(t.b=null),e.next=null),e;}function U(){this.next=this.b=this.a=null;}M.prototype.add=function(t,e){var n=j.get();n.set(t,e),this.b?this.b.next=n:this.a=n,this.b=n;},U.prototype.set=function(t,e){this.a=t,this.b=e,this.next=null;},U.prototype.reset=function(){this.next=this.b=this.a=null;};var F=Array.prototype.indexOf?function(t,e){return Array.prototype.indexOf.call(t,e,void 0);}:function(t,e){if("string"==typeof t)return "string"!=typeof e||1!=e.length?-1:t.indexOf(e,0);for(var n=0;n<t.length;n++)if(n in t&&t[n]===e)return n;return -1;},q=Array.prototype.forEach?function(t,e,n){Array.prototype.forEach.call(t,e,n);}:function(t,e,n){for(var r=t.length,i="string"==typeof t?t.split(""):t,o=0;o<r;o++)o in i&&e.call(n,i[o],o,t);};var B=Array.prototype.filter?function(t,e){return Array.prototype.filter.call(t,e,void 0);}:function(t,e){for(var n=t.length,r=[],i=0,o="string"==typeof t?t.split(""):t,s=0;s<n;s++)if(s in o){var a=o[s];e.call(void 0,a,s,t)&&(r[i++]=a);}return r;},z=Array.prototype.map?function(t,e){return Array.prototype.map.call(t,e,void 0);}:function(t,e){for(var n=t.length,r=Array(n),i="string"==typeof t?t.split(""):t,o=0;o<n;o++)o in i&&(r[o]=e.call(void 0,i[o],o,t));return r;},G=Array.prototype.some?function(t,e){return Array.prototype.some.call(t,e,void 0);}:function(t,e){for(var n=t.length,r="string"==typeof t?t.split(""):t,i=0;i<n;i++)if(i in r&&e.call(void 0,r[i],i,t))return !0;return !1;};function W(t,e){return 0<=F(t,e);}function H(t,e){var n;return (n=0<=(e=F(t,e)))&&Array.prototype.splice.call(t,e,1),n;}function K(t,e){!function(t,e){for(var n="string"==typeof t?t.split(""):t,r=t.length-1;0<=r;--r)r in n&&e.call(void 0,n[r],r,t);}(t,function(n,r){e.call(void 0,n,r,t)&&1==Array.prototype.splice.call(t,r,1).length&&0;});}function Y(t){return Array.prototype.concat.apply([],arguments);}function X(t){var e=t.length;if(0<e){for(var n=Array(e),r=0;r<e;r++)n[r]=t[r];return n;}return [];}var Q,J=String.prototype.trim?function(t){return t.trim();}:function(t){return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(t)[1];},$=/&/g,Z=/</g,tt=/>/g,et=/"/g,nt=/'/g,rt=/\x00/g,it=/[\x00&<>"']/;function ot(t,e){return -1!=t.indexOf(e);}function st(t,e){return t<e?-1:t>e?1:0;}t:{var at=s.navigator;if(at){var ut=at.userAgent;if(ut){Q=ut;break t;}}Q="";}function ct(t){return ot(Q,t);}function ht(t,e){for(var n in t)e.call(void 0,t[n],n,t);}function lt(t){for(var e in t)return !1;return !0;}function ft(t){var e,n={};for(e in t)n[e]=t[e];return n;}var pt="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function dt(t,e){for(var n,r,i=1;i<arguments.length;i++){for(n in r=arguments[i])t[n]=r[n];for(var o=0;o<pt.length;o++)n=pt[o],Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n]);}}function vt(t,e){t:{try{var n=t&&t.ownerDocument,r=n&&(n.defaultView||n.parentWindow);if((r=r||s).Element&&r.Location){var i=r;break t;}}catch(t){}i=null;}if(i&&void 0!==i[e]&&(!t||!(t instanceof i[e])&&(t instanceof i.Location||t instanceof i.Element))){if(p(t))try{var o=t.constructor.displayName||t.constructor.name||Object.prototype.toString.call(t);}catch(t){o="<object could not be stringified>";}else o=void 0===t?"undefined":null===t?"null":typeof t;C("Argument is not a %s (or a non-Element, non-Location mock); got: %s",e,o);}}function yt(t,e){this.a=t===bt&&e||"",this.b=gt;}function mt(t){return t instanceof yt&&t.constructor===yt&&t.b===gt?t.a:(C("expected object of type Const, got '"+t+"'"),"type_error:Const");}yt.prototype.ra=!0,yt.prototype.qa=function(){return this.a;},yt.prototype.toString=function(){return "Const{"+this.a+"}";};var gt={},bt={},wt=new yt(bt,"");function _t(t,e){this.a=t===Nt&&e||"",this.b=kt;}function Et(t){return t instanceof _t&&t.constructor===_t&&t.b===kt?t.a:(C("expected object of type TrustedResourceUrl, got '"+t+"' of type "+h(t)),"type_error:TrustedResourceUrl");}function It(t,e){var n=mt(t);if(!At.test(n))throw Error("Invalid TrustedResourceUrl format: "+n);return t=n.replace(Tt,function(t,r){if(!Object.prototype.hasOwnProperty.call(e,r))throw Error('Found marker, "'+r+'", in format string, "'+n+'", but no valid label mapping found in args: '+JSON.stringify(e));return (t=e[r])instanceof yt?mt(t):encodeURIComponent(String(t));}),new _t(Nt,t);}_t.prototype.ra=!0,_t.prototype.qa=function(){return this.a.toString();},_t.prototype.toString=function(){return "TrustedResourceUrl{"+this.a+"}";};var Tt=/%{(\w+)}/g,At=/^((https:)?\/\/[0-9a-z.:[\]-]+\/|\/[^/\\]|[^:/\\%]+\/|[^:/\\%]*[?#]|about:blank#)/i,kt={},Nt={};function St(t,e){this.a=t===Ct&&e||"",this.b=Rt;}function xt(t){return t instanceof St&&t.constructor===St&&t.b===Rt?t.a:(C("expected object of type SafeUrl, got '"+t+"' of type "+h(t)),"type_error:SafeUrl");}St.prototype.ra=!0,St.prototype.qa=function(){return this.a.toString();},St.prototype.toString=function(){return "SafeUrl{"+this.a+"}";};var Ot=/^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;function Dt(t){return t instanceof St?t:(t="object"==typeof t&&t.ra?t.qa():String(t),Ot.test(t)||(t="about:invalid#zClosurez"),new St(Ct,t));}var Rt={},Ct={};function Pt(){this.a="",this.b=Mt;}function Lt(t){return t instanceof Pt&&t.constructor===Pt&&t.b===Mt?t.a:(C("expected object of type SafeHtml, got '"+t+"' of type "+h(t)),"type_error:SafeHtml");}Pt.prototype.ra=!0,Pt.prototype.qa=function(){return this.a.toString();},Pt.prototype.toString=function(){return "SafeHtml{"+this.a+"}";};var Mt={};function jt(t){var e=new Pt();return e.a=t,e;}jt("<!DOCTYPE html>");var Vt=jt("");function Ut(t,e){for(var n=t.split("%s"),r="",i=Array.prototype.slice.call(arguments,1);i.length&&1<n.length;)r+=n.shift()+i.shift();return r+n.join("%s");}function Ft(t){return it.test(t)&&(-1!=t.indexOf("&")&&(t=t.replace($,"&amp;")),-1!=t.indexOf("<")&&(t=t.replace(Z,"&lt;")),-1!=t.indexOf(">")&&(t=t.replace(tt,"&gt;")),-1!=t.indexOf('"')&&(t=t.replace(et,"&quot;")),-1!=t.indexOf("'")&&(t=t.replace(nt,"&#39;")),-1!=t.indexOf("\0")&&(t=t.replace(rt,"&#0;"))),t;}function qt(t){return qt[" "](t),t;}jt("<br>"),qt[" "]=c;var Bt,zt=ct("Opera"),Gt=ct("Trident")||ct("MSIE"),Wt=ct("Edge"),Ht=Wt||Gt,Kt=ct("Gecko")&&!(ot(Q.toLowerCase(),"webkit")&&!ct("Edge"))&&!(ct("Trident")||ct("MSIE"))&&!ct("Edge"),Yt=ot(Q.toLowerCase(),"webkit")&&!ct("Edge");function Xt(){var t=s.document;return t?t.documentMode:void 0;}t:{var Qt="",Jt=function(){var t=Q;return Kt?/rv:([^\);]+)(\)|;)/.exec(t):Wt?/Edge\/([\d\.]+)/.exec(t):Gt?/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(t):Yt?/WebKit\/(\S+)/.exec(t):zt?/(?:Version)[ \/]?(\S+)/.exec(t):void 0;}();if(Jt&&(Qt=Jt?Jt[1]:""),Gt){var $t=Xt();if(null!=$t&&$t>parseFloat(Qt)){Bt=String($t);break t;}}Bt=Qt;}var Zt,te={};function ee(t){return function(t,e){var n=te;return Object.prototype.hasOwnProperty.call(n,t)?n[t]:n[t]=e(t);}(t,function(){for(var e=0,n=J(String(Bt)).split("."),r=J(String(t)).split("."),i=Math.max(n.length,r.length),o=0;0==e&&o<i;o++){var s=n[o]||"",a=r[o]||"";do{if(s=/(\d*)(\D*)(.*)/.exec(s)||["","","",""],a=/(\d*)(\D*)(.*)/.exec(a)||["","","",""],0==s[0].length&&0==a[0].length)break;e=st(0==s[1].length?0:parseInt(s[1],10),0==a[1].length?0:parseInt(a[1],10))||st(0==s[2].length,0==a[2].length)||st(s[2],a[2]),s=s[3],a=a[3];}while(0==e);}return 0<=e;});}Zt=s.document&&Gt?Xt():void 0;try{new self.OffscreenCanvas(0,0).getContext("2d");}catch(t){}var ne=!Gt||9<=Number(Zt);function re(t){var e=document;return "string"==typeof t?e.getElementById(t):t;}function ie(t,e){ht(e,function(e,n){e&&"object"==typeof e&&e.ra&&(e=e.qa()),"style"==n?t.style.cssText=e:"class"==n?t.className=e:"for"==n?t.htmlFor=e:ae.hasOwnProperty(n)?t.setAttribute(ae[n],e):0==n.lastIndexOf("aria-",0)||0==n.lastIndexOf("data-",0)?t.setAttribute(n,e):t[n]=e;});}var oe,se,ae={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",nonce:"nonce",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"};function ue(t,e,n){function r(n){n&&e.appendChild("string"==typeof n?t.createTextNode(n):n);}for(var i=2;i<n.length;i++){var o=n[i];!l(o)||p(o)&&0<o.nodeType?r(o):q(he(o)?X(o):o,r);}}function ce(t,e){return e=String(e),"application/xhtml+xml"===t.contentType&&(e=e.toLowerCase()),t.createElement(e);}function he(t){if(t&&"number"==typeof t.length){if(p(t))return "function"==typeof t.item||"string"==typeof t.item;if(f(t))return "function"==typeof t.item;}return !1;}function le(t){s.setTimeout(function(){throw t;},0);}function fe(){var t=s.MessageChannel;if(void 0===t&&"undefined"!=typeof window&&window.postMessage&&window.addEventListener&&!ct("Presto")&&(t=function(){var t=ce(document,"IFRAME");t.style.display="none",function(t){var e=new _t(Nt,mt(wt));vt(t,"HTMLIFrameElement"),t.src=Et(e).toString();}(t),document.documentElement.appendChild(t);var e=t.contentWindow;(t=e.document).open(),t.write(Lt(Vt)),t.close();var n="callImmediate"+Math.random(),r="file:"==e.location.protocol?"*":e.location.protocol+"//"+e.location.host;t=g(function(t){"*"!=r&&t.origin!=r||t.data!=n||this.port1.onmessage();},this),e.addEventListener("message",t,!1),this.port1={},this.port2={postMessage:function(){e.postMessage(n,r);}};}),void 0!==t&&!ct("Trident")&&!ct("MSIE")){var e=new t(),n={},r=n;return e.port1.onmessage=function(){if(void 0!==n.next){var t=(n=n.next).Db;n.Db=null,t();}},function(t){r.next={Db:t},r=r.next,e.port2.postMessage(0);};}return function(t){s.setTimeout(t,0);};}function pe(t,e){se||function(){if(s.Promise&&s.Promise.resolve){var t=s.Promise.resolve(void 0);se=function(){t.then(ye);};}else se=function(){var t=ye;!f(s.setImmediate)||s.Window&&s.Window.prototype&&!ct("Edge")&&s.Window.prototype.setImmediate==s.setImmediate?(oe||(oe=fe()),oe(t)):s.setImmediate(t);};}(),de||(se(),de=!0),ve.add(t,e);}var de=!1,ve=new M();function ye(){for(var t;t=V();){try{t.a.call(t.b);}catch(t){le(t);}L(j,t);}de=!1;}function me(t,e){if(this.a=ge,this.i=void 0,this.f=this.b=this.c=null,this.g=this.h=!1,t!=c)try{var n=this;t.call(e,function(t){Oe(n,be,t);},function(t){if(!(t instanceof je))try{if(t instanceof Error)throw t;throw Error("Promise rejected.");}catch(t){}Oe(n,we,t);});}catch(t){Oe(this,we,t);}}var ge=0,be=2,we=3;function _e(){this.next=this.f=this.b=this.g=this.a=null,this.c=!1;}_e.prototype.reset=function(){this.f=this.b=this.g=this.a=null,this.c=!1;};var Ee=new P(function(){return new _e();},function(t){t.reset();});function Ie(t,e,n){var r=Ee.get();return r.g=t,r.b=e,r.f=n,r;}function Te(t){if(t instanceof me)return t;var e=new me(c);return Oe(e,be,t),e;}function Ae(t){return new me(function(e,n){n(t);});}function ke(t,e,n){De(t,e,n,null)||pe(b(e,t));}function Ne(t){return new me(function(e){var n=t.length,r=[];if(n)for(var i=function(t,i,o){n--,r[t]=i?{Mb:!0,value:o}:{Mb:!1,reason:o},0==n&&e(r);},o=0;o<t.length;o++)ke(t[o],b(i,o,!0),b(i,o,!1));else e(r);});}function Se(t,e){t.b||t.a!=be&&t.a!=we||Re(t),t.f?t.f.next=e:t.b=e,t.f=e;}function xe(t,e,n,r){var i=Ie(null,null,null);return i.a=new me(function(t,o){i.g=e?function(n){try{var i=e.call(r,n);t(i);}catch(t){o(t);}}:t,i.b=n?function(e){try{var i=n.call(r,e);void 0===i&&e instanceof je?o(e):t(i);}catch(t){o(t);}}:o;}),i.a.c=t,Se(t,i),i.a;}function Oe(t,e,n){t.a==ge&&(t===n&&(e=we,n=new TypeError("Promise cannot resolve to itself")),t.a=1,De(n,t.Yc,t.Zc,t)||(t.i=n,t.a=e,t.c=null,Re(t),e!=we||n instanceof je||function(t,e){t.g=!0,pe(function(){t.g&&Me.call(null,e);});}(t,n)));}function De(t,e,n,r){if(t instanceof me)return Se(t,Ie(e||c,n||null,r)),!0;if(O(t))return t.then(e,n,r),!0;if(p(t))try{var i=t.then;if(f(i))return function(t,e,n,r,i){function o(t){s||(s=!0,r.call(i,t));}var s=!1;try{e.call(t,function(t){s||(s=!0,n.call(i,t));},o);}catch(t){o(t);}}(t,i,e,n,r),!0;}catch(t){return n.call(r,t),!0;}return !1;}function Re(t){t.h||(t.h=!0,pe(t.ec,t));}function Ce(t){var e=null;return t.b&&(e=t.b,t.b=e.next,e.next=null),t.b||(t.f=null),e;}function Pe(t,e,n,r){if(n==we&&e.b&&!e.c)for(;t&&t.g;t=t.c)t.g=!1;if(e.a)e.a.c=null,Le(e,n,r);else try{e.c?e.g.call(e.f):Le(e,n,r);}catch(t){Me.call(null,t);}L(Ee,e);}function Le(t,e,n){e==be?t.g.call(t.f,n):t.b&&t.b.call(t.f,n);}me.prototype.then=function(t,e,n){return xe(this,f(t)?t:null,f(e)?e:null,n);},me.prototype.$goog_Thenable=!0,(t=me.prototype).ma=function(t,e){return (t=Ie(t,t,e)).c=!0,Se(this,t),this;},t.o=function(t,e){return xe(this,null,t,e);},t.cancel=function(t){if(this.a==ge){var e=new je(t);pe(function(){!function t(e,n){if(e.a==ge)if(e.c){var r=e.c;if(r.b){for(var i=0,o=null,s=null,a=r.b;a&&(a.c||(i++,a.a==e&&(o=a),!(o&&1<i)));a=a.next)o||(s=a);o&&(r.a==ge&&1==i?t(r,n):(s?((i=s).next==r.f&&(r.f=i),i.next=i.next.next):Ce(r),Pe(r,o,we,n)));}e.c=null;}else Oe(e,we,n);}(this,e);},this);}},t.Yc=function(t){this.a=ge,Oe(this,be,t);},t.Zc=function(t){this.a=ge,Oe(this,we,t);},t.ec=function(){for(var t;t=Ce(this);)Pe(this,t,this.a,this.i);this.h=!1;};var Me=le;function je(t){D.call(this,t);}function Ve(){this.wa=this.wa,this.na=this.na;}_(je,D),je.prototype.name="cancel";function Ue(t){if(!t.wa&&(t.wa=!0,t.Ba(),0))(function(t){Object.prototype.hasOwnProperty.call(t,d)&&t[d]||(t[d]=++v);})(t);}Ve.prototype.wa=!1,Ve.prototype.Ba=function(){if(this.na)for(;this.na.length;)this.na.shift()();};var Fe=Object.freeze||function(t){return t;},qe=!Gt||9<=Number(Zt),Be=Gt&&!ee("9"),ze=function(){if(!s.addEventListener||!Object.defineProperty)return !1;var t=!1,e=Object.defineProperty({},"passive",{get:function(){t=!0;}});try{s.addEventListener("test",c,e),s.removeEventListener("test",c,e);}catch(t){}return t;}();function Ge(t,e){this.type=t,this.b=this.target=e,this.defaultPrevented=!1;}function We(t,e){if(Ge.call(this,t?t.type:""),this.relatedTarget=this.b=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.pointerId=0,this.pointerType="",this.a=null,t){var n=this.type=t.type,r=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:null;if(this.target=t.target||t.srcElement,this.b=e,e=t.relatedTarget){if(Kt){t:{try{qt(e.nodeName);var i=!0;break t;}catch(t){}i=!1;}i||(e=null);}}else "mouseover"==n?e=t.fromElement:"mouseout"==n&&(e=t.toElement);this.relatedTarget=e,r?(this.clientX=void 0!==r.clientX?r.clientX:r.pageX,this.clientY=void 0!==r.clientY?r.clientY:r.pageY,this.screenX=r.screenX||0,this.screenY=r.screenY||0):(this.clientX=void 0!==t.clientX?t.clientX:t.pageX,this.clientY=void 0!==t.clientY?t.clientY:t.pageY,this.screenX=t.screenX||0,this.screenY=t.screenY||0),this.button=t.button,this.key=t.key||"",this.ctrlKey=t.ctrlKey,this.altKey=t.altKey,this.shiftKey=t.shiftKey,this.metaKey=t.metaKey,this.pointerId=t.pointerId||0,this.pointerType="string"==typeof t.pointerType?t.pointerType:He[t.pointerType]||"",this.a=t,t.defaultPrevented&&this.preventDefault();}}Ge.prototype.preventDefault=function(){this.defaultPrevented=!0;},_(We,Ge);var He=Fe({2:"touch",3:"pen",4:"mouse"});We.prototype.preventDefault=function(){We.Za.preventDefault.call(this);var t=this.a;if(t.preventDefault)t.preventDefault();else if(t.returnValue=!1,Be)try{(t.ctrlKey||112<=t.keyCode&&123>=t.keyCode)&&(t.keyCode=-1);}catch(t){}},We.prototype.f=function(){return this.a;};var Ke="closure_listenable_"+(1e6*Math.random()|0),Ye=0;function Xe(t,e,n,r,i){this.listener=t,this.proxy=null,this.src=e,this.type=n,this.capture=!!r,this.Ta=i,this.key=++Ye,this.ua=this.Na=!1;}function Qe(t){t.ua=!0,t.listener=null,t.proxy=null,t.src=null,t.Ta=null;}function Je(t){this.src=t,this.a={},this.b=0;}function $e(t,e){var n=e.type;n in t.a&&H(t.a[n],e)&&(Qe(e),0==t.a[n].length&&(delete t.a[n],t.b--));}function Ze(t,e,n,r){for(var i=0;i<t.length;++i){var o=t[i];if(!o.ua&&o.listener==e&&o.capture==!!n&&o.Ta==r)return i;}return -1;}Je.prototype.add=function(t,e,n,r,i){var o=t.toString();(t=this.a[o])||(t=this.a[o]=[],this.b++);var s=Ze(t,e,r,i);return -1<s?(e=t[s],n||(e.Na=!1)):((e=new Xe(e,this.src,o,!!r,i)).Na=n,t.push(e)),e;};var tn="closure_lm_"+(1e6*Math.random()|0),en={};function nn(t,e,n,r,i){if(r&&r.once)on(t,e,n,r,i);else if(Array.isArray(e))for(var o=0;o<e.length;o++)nn(t,e[o],n,r,i);else n=dn(n),t&&t[Ke]?yn(t,e,n,p(r)?!!r.capture:!!r,i):rn(t,e,n,!1,r,i);}function rn(t,e,n,r,i,o){if(!e)throw Error("Invalid event type");var s=p(i)?!!i.capture:!!i,a=fn(t);if(a||(t[tn]=a=new Je(t)),!(n=a.add(e,n,r,s,o)).proxy)if(r=function(){var t=ln,e=qe?function(n){return t.call(e.src,e.listener,n);}:function(n){if(!(n=t.call(e.src,e.listener,n)))return n;};return e;}(),n.proxy=r,r.src=t,r.listener=n,t.addEventListener)ze||(i=s),void 0===i&&(i=!1),t.addEventListener(e.toString(),r,i);else if(t.attachEvent)t.attachEvent(un(e.toString()),r);else {if(!t.addListener||!t.removeListener)throw Error("addEventListener and attachEvent are unavailable.");t.addListener(r);}}function on(t,e,n,r,i){if(Array.isArray(e))for(var o=0;o<e.length;o++)on(t,e[o],n,r,i);else n=dn(n),t&&t[Ke]?mn(t,e,n,p(r)?!!r.capture:!!r,i):rn(t,e,n,!0,r,i);}function sn(t,e,n,r,i){if(Array.isArray(e))for(var o=0;o<e.length;o++)sn(t,e[o],n,r,i);else r=p(r)?!!r.capture:!!r,n=dn(n),t&&t[Ke]?(t=t.u,(e=String(e).toString())in t.a&&-1<(n=Ze(o=t.a[e],n,r,i))&&(Qe(o[n]),Array.prototype.splice.call(o,n,1),0==o.length&&(delete t.a[e],t.b--))):t&&(t=fn(t))&&(e=t.a[e.toString()],t=-1,e&&(t=Ze(e,n,r,i)),(n=-1<t?e[t]:null)&&an(n));}function an(t){if("number"!=typeof t&&t&&!t.ua){var e=t.src;if(e&&e[Ke])$e(e.u,t);else {var n=t.type,r=t.proxy;e.removeEventListener?e.removeEventListener(n,r,t.capture):e.detachEvent?e.detachEvent(un(n),r):e.addListener&&e.removeListener&&e.removeListener(r),(n=fn(e))?($e(n,t),0==n.b&&(n.src=null,e[tn]=null)):Qe(t);}}}function un(t){return t in en?en[t]:en[t]="on"+t;}function cn(t,e,n,r){var i=!0;if((t=fn(t))&&(e=t.a[e.toString()]))for(e=e.concat(),t=0;t<e.length;t++){var o=e[t];o&&o.capture==n&&!o.ua&&(o=hn(o,r),i=i&&!1!==o);}return i;}function hn(t,e){var n=t.listener,r=t.Ta||t.src;return t.Na&&an(t),n.call(r,e);}function ln(t,e){if(t.ua)return !0;if(!qe){if(!e)t:{e=["window","event"];for(var n=s,r=0;r<e.length;r++)if(null==(n=n[e[r]])){e=null;break t;}e=n;}if(e=new We(r=e,this),n=!0,!(0>r.keyCode||null!=r.returnValue)){t:{var i=!1;if(0==r.keyCode)try{r.keyCode=-1;break t;}catch(t){i=!0;}(i||null==r.returnValue)&&(r.returnValue=!0);}for(r=[],i=e.b;i;i=i.parentNode)r.push(i);for(t=t.type,i=r.length-1;0<=i;i--){e.b=r[i];var o=cn(r[i],t,!0,e);n=n&&o;}for(i=0;i<r.length;i++)e.b=r[i],o=cn(r[i],t,!1,e),n=n&&o;}return n;}return hn(t,new We(e,this));}function fn(t){return (t=t[tn])instanceof Je?t:null;}var pn="__closure_events_fn_"+(1e9*Math.random()>>>0);function dn(t){return f(t)?t:(t[pn]||(t[pn]=function(e){return t.handleEvent(e);}),t[pn]);}function vn(){Ve.call(this),this.u=new Je(this),this.Yb=this,this.eb=null;}function yn(t,e,n,r,i){t.u.add(String(e),n,!1,r,i);}function mn(t,e,n,r,i){t.u.add(String(e),n,!0,r,i);}function gn(t,e,n,r){if(!(e=t.u.a[String(e)]))return !0;e=e.concat();for(var i=!0,o=0;o<e.length;++o){var s=e[o];if(s&&!s.ua&&s.capture==n){var a=s.listener,u=s.Ta||s.src;s.Na&&$e(t.u,s),i=!1!==a.call(u,r)&&i;}}return i&&!r.defaultPrevented;}function bn(t,e,n){if(f(t))n&&(t=g(t,n));else {if(!t||"function"!=typeof t.handleEvent)throw Error("Invalid listener argument");t=g(t.handleEvent,t);}return 2147483647<Number(e)?-1:s.setTimeout(t,e||0);}function wn(t){var e=null;return new me(function(n,r){-1==(e=bn(function(){n(void 0);},t))&&r(Error("Failed to schedule timer."));}).o(function(t){throw s.clearTimeout(e),t;});}function _n(t){if(t.V&&"function"==typeof t.V)return t.V();if("string"==typeof t)return t.split("");if(l(t)){for(var e=[],n=t.length,r=0;r<n;r++)e.push(t[r]);return e;}for(r in e=[],n=0,t)e[n++]=t[r];return e;}function En(t){if(t.X&&"function"==typeof t.X)return t.X();if(!t.V||"function"!=typeof t.V){if(l(t)||"string"==typeof t){var e=[];t=t.length;for(var n=0;n<t;n++)e.push(n);return e;}for(var r in e=[],n=0,t)e[n++]=r;return e;}}function In(t,e){this.b={},this.a=[],this.c=0;var n=arguments.length;if(1<n){if(n%2)throw Error("Uneven number of arguments");for(var r=0;r<n;r+=2)this.set(arguments[r],arguments[r+1]);}else if(t)if(t instanceof In)for(n=t.X(),r=0;r<n.length;r++)this.set(n[r],t.get(n[r]));else for(r in t)this.set(r,t[r]);}function Tn(t){if(t.c!=t.a.length){for(var e=0,n=0;e<t.a.length;){var r=t.a[e];An(t.b,r)&&(t.a[n++]=r),e++;}t.a.length=n;}if(t.c!=t.a.length){var i={};for(n=e=0;e<t.a.length;)An(i,r=t.a[e])||(t.a[n++]=r,i[r]=1),e++;t.a.length=n;}}function An(t,e){return Object.prototype.hasOwnProperty.call(t,e);}_(vn,Ve),vn.prototype[Ke]=!0,vn.prototype.addEventListener=function(t,e,n,r){nn(this,t,e,n,r);},vn.prototype.removeEventListener=function(t,e,n,r){sn(this,t,e,n,r);},vn.prototype.dispatchEvent=function(t){var e,n=this.eb;if(n)for(e=[];n;n=n.eb)e.push(n);n=this.Yb;var r=t.type||t;if("string"==typeof t)t=new Ge(t,n);else if(t instanceof Ge)t.target=t.target||n;else {var i=t;dt(t=new Ge(r,n),i);}if(i=!0,e)for(var o=e.length-1;0<=o;o--){var s=t.b=e[o];i=gn(s,r,!0,t)&&i;}if(i=gn(s=t.b=n,r,!0,t)&&i,i=gn(s,r,!1,t)&&i,e)for(o=0;o<e.length;o++)i=gn(s=t.b=e[o],r,!1,t)&&i;return i;},vn.prototype.Ba=function(){if(vn.Za.Ba.call(this),this.u){var t,e=this.u;for(t in e.a){for(var n=e.a[t],r=0;r<n.length;r++)Qe(n[r]);delete e.a[t],e.b--;}}this.eb=null;},(t=In.prototype).V=function(){Tn(this);for(var t=[],e=0;e<this.a.length;e++)t.push(this.b[this.a[e]]);return t;},t.X=function(){return Tn(this),this.a.concat();},t.clear=function(){this.b={},this.c=this.a.length=0;},t.get=function(t,e){return An(this.b,t)?this.b[t]:e;},t.set=function(t,e){An(this.b,t)||(this.c++,this.a.push(t)),this.b[t]=e;},t.forEach=function(t,e){for(var n=this.X(),r=0;r<n.length;r++){var i=n[r],o=this.get(i);t.call(e,o,i,this);}};var kn=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/\\#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;function Nn(t,e){var n;this.b=this.i=this.f="",this.l=null,this.g=this.c="",this.h=!1,t instanceof Nn?(this.h=void 0!==e?e:t.h,Sn(this,t.f),this.i=t.i,this.b=t.b,xn(this,t.l),this.c=t.c,On(this,Xn(t.a)),this.g=t.g):t&&(n=String(t).match(kn))?(this.h=!!e,Sn(this,n[1]||"",!0),this.i=Ln(n[2]||""),this.b=Ln(n[3]||"",!0),xn(this,n[4]),this.c=Ln(n[5]||"",!0),On(this,n[6]||"",!0),this.g=Ln(n[7]||"")):(this.h=!!e,this.a=new zn(null,this.h));}function Sn(t,e,n){t.f=n?Ln(e,!0):e,t.f&&(t.f=t.f.replace(/:$/,""));}function xn(t,e){if(e){if(e=Number(e),isNaN(e)||0>e)throw Error("Bad port number "+e);t.l=e;}else t.l=null;}function On(t,e,n){e instanceof zn?(t.a=e,function(t,e){e&&!t.f&&(Gn(t),t.c=null,t.a.forEach(function(t,e){var n=e.toLowerCase();e!=n&&(Hn(this,e),Yn(this,n,t));},t)),t.f=e;}(t.a,t.h)):(n||(e=Mn(e,qn)),t.a=new zn(e,t.h));}function Dn(t,e,n){t.a.set(e,n);}function Rn(t,e){return t.a.get(e);}function Cn(t){return t instanceof Nn?new Nn(t):new Nn(t,void 0);}function Pn(t,e){var n=new Nn(null,void 0);return Sn(n,"https"),t&&(n.b=t),e&&(n.c=e),n;}function Ln(t,e){return t?e?decodeURI(t.replace(/%25/g,"%2525")):decodeURIComponent(t):"";}function Mn(t,e,n){return "string"==typeof t?(t=encodeURI(t).replace(e,jn),n&&(t=t.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),t):null;}function jn(t){return "%"+((t=t.charCodeAt(0))>>4&15).toString(16)+(15&t).toString(16);}Nn.prototype.toString=function(){var t=[],e=this.f;e&&t.push(Mn(e,Vn,!0),":");var n=this.b;return (n||"file"==e)&&(t.push("//"),(e=this.i)&&t.push(Mn(e,Vn,!0),"@"),t.push(encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(n=this.l)&&t.push(":",String(n))),(n=this.c)&&(this.b&&"/"!=n.charAt(0)&&t.push("/"),t.push(Mn(n,"/"==n.charAt(0)?Fn:Un,!0))),(n=this.a.toString())&&t.push("?",n),(n=this.g)&&t.push("#",Mn(n,Bn)),t.join("");},Nn.prototype.resolve=function(t){var e=new Nn(this),n=!!t.f;n?Sn(e,t.f):n=!!t.i,n?e.i=t.i:n=!!t.b,n?e.b=t.b:n=null!=t.l;var r=t.c;if(n)xn(e,t.l);else if(n=!!t.c){if("/"!=r.charAt(0))if(this.b&&!this.c)r="/"+r;else {var i=e.c.lastIndexOf("/");-1!=i&&(r=e.c.substr(0,i+1)+r);}if(".."==(i=r)||"."==i)r="";else if(ot(i,"./")||ot(i,"/.")){r=0==i.lastIndexOf("/",0),i=i.split("/");for(var o=[],s=0;s<i.length;){var a=i[s++];"."==a?r&&s==i.length&&o.push(""):".."==a?((1<o.length||1==o.length&&""!=o[0])&&o.pop(),r&&s==i.length&&o.push("")):(o.push(a),r=!0);}r=o.join("/");}else r=i;}return n?e.c=r:n=""!==t.a.toString(),n?On(e,Xn(t.a)):n=!!t.g,n&&(e.g=t.g),e;};var Vn=/[#\/\?@]/g,Un=/[#\?:]/g,Fn=/[#\?]/g,qn=/[#\?@]/g,Bn=/#/g;function zn(t,e){this.b=this.a=null,this.c=t||null,this.f=!!e;}function Gn(t){t.a||(t.a=new In(),t.b=0,t.c&&function(t,e){if(t){t=t.split("&");for(var n=0;n<t.length;n++){var r=t[n].indexOf("="),i=null;if(0<=r){var o=t[n].substring(0,r);i=t[n].substring(r+1);}else o=t[n];e(o,i?decodeURIComponent(i.replace(/\+/g," ")):"");}}}(t.c,function(e,n){t.add(decodeURIComponent(e.replace(/\+/g," ")),n);}));}function Wn(t){var e=En(t);if(void 0===e)throw Error("Keys are undefined");var n=new zn(null,void 0);t=_n(t);for(var r=0;r<e.length;r++){var i=e[r],o=t[r];Array.isArray(o)?Yn(n,i,o):n.add(i,o);}return n;}function Hn(t,e){Gn(t),e=Qn(t,e),An(t.a.b,e)&&(t.c=null,t.b-=t.a.get(e).length,An((t=t.a).b,e)&&(delete t.b[e],t.c--,t.a.length>2*t.c&&Tn(t)));}function Kn(t,e){return Gn(t),e=Qn(t,e),An(t.a.b,e);}function Yn(t,e,n){Hn(t,e),0<n.length&&(t.c=null,t.a.set(Qn(t,e),X(n)),t.b+=n.length);}function Xn(t){var e=new zn();return e.c=t.c,t.a&&(e.a=new In(t.a),e.b=t.b),e;}function Qn(t,e){return e=String(e),t.f&&(e=e.toLowerCase()),e;}function Jn(t){var e=[];return function t(e,n,r){if(null==n)r.push("null");else {if("object"==typeof n){if(Array.isArray(n)){var i=n;n=i.length,r.push("[");for(var o="",s=0;s<n;s++)r.push(o),t(e,i[s],r),o=",";return void r.push("]");}if(!(n instanceof String||n instanceof Number||n instanceof Boolean)){for(i in r.push("{"),o="",n)Object.prototype.hasOwnProperty.call(n,i)&&"function"!=typeof(s=n[i])&&(r.push(o),er(i,r),r.push(":"),t(e,s,r),o=",");return void r.push("}");}n=n.valueOf();}switch(typeof n){case"string":er(n,r);break;case"number":r.push(isFinite(n)&&!isNaN(n)?String(n):"null");break;case"boolean":r.push(String(n));break;case"function":r.push("null");break;default:throw Error("Unknown type: "+typeof n);}}}(new $n(),t,e),e.join("");}function $n(){}(t=zn.prototype).add=function(t,e){Gn(this),this.c=null,t=Qn(this,t);var n=this.a.get(t);return n||this.a.set(t,n=[]),n.push(e),this.b+=1,this;},t.clear=function(){this.a=this.c=null,this.b=0;},t.forEach=function(t,e){Gn(this),this.a.forEach(function(n,r){q(n,function(n){t.call(e,n,r,this);},this);},this);},t.X=function(){Gn(this);for(var t=this.a.V(),e=this.a.X(),n=[],r=0;r<e.length;r++)for(var i=t[r],o=0;o<i.length;o++)n.push(e[r]);return n;},t.V=function(t){Gn(this);var e=[];if("string"==typeof t)Kn(this,t)&&(e=Y(e,this.a.get(Qn(this,t))));else {t=this.a.V();for(var n=0;n<t.length;n++)e=Y(e,t[n]);}return e;},t.set=function(t,e){return Gn(this),this.c=null,Kn(this,t=Qn(this,t))&&(this.b-=this.a.get(t).length),this.a.set(t,[e]),this.b+=1,this;},t.get=function(t,e){return t&&0<(t=this.V(t)).length?String(t[0]):e;},t.toString=function(){if(this.c)return this.c;if(!this.a)return "";for(var t=[],e=this.a.X(),n=0;n<e.length;n++){var r=e[n],i=encodeURIComponent(String(r));r=this.V(r);for(var o=0;o<r.length;o++){var s=i;""!==r[o]&&(s+="="+encodeURIComponent(String(r[o]))),t.push(s);}}return this.c=t.join("&");};var Zn={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\v":"\\u000b"},tr=/\uffff/.test("￿")?/[\\"\x00-\x1f\x7f-\uffff]/g:/[\\"\x00-\x1f\x7f-\xff]/g;function er(t,e){e.push('"',t.replace(tr,function(t){var e=Zn[t];return e||(e="\\u"+(65536|t.charCodeAt(0)).toString(16).substr(1),Zn[t]=e),e;}),'"');}function nr(){var t=_r();return Gt&&!!Zt&&11==Zt||/Edge\/\d+/.test(t);}function rr(){return s.window&&s.window.location.href||self&&self.location&&self.location.href||"";}function ir(t,e){e=e||s.window;var n="about:blank";t&&(n=xt(Dt(t))),e.location.href=n;}function or(t){return !!((t=(t||_r()).toLowerCase()).match(/android/)||t.match(/webos/)||t.match(/iphone|ipad|ipod/)||t.match(/blackberry/)||t.match(/windows phone/)||t.match(/iemobile/));}function sr(t){t=t||s.window;try{t.close();}catch(t){}}function ar(t,e,n){var r=Math.floor(1e9*Math.random()).toString();e=e||500,n=n||600;var i=(window.screen.availHeight-n)/2,o=(window.screen.availWidth-e)/2;for(s in e={width:e,height:n,top:0<i?i:0,left:0<o?o:0,location:!0,resizable:!0,statusbar:!0,toolbar:!1},n=_r().toLowerCase(),r&&(e.target=r,ot(n,"crios/")&&(e.target="_blank")),gr(_r())==yr&&(t=t||"http://localhost",e.scrollbars=!0),n=t||"",(t=e)||(t={}),r=window,e=n instanceof St?n:Dt(void 0!==n.href?n.href:String(n)),n=t.target||n.target,i=[],t)switch(s){case"width":case"height":case"top":case"left":i.push(s+"="+t[s]);break;case"target":case"noopener":case"noreferrer":break;default:i.push(s+"="+(t[s]?1:0));}var s=i.join(",");if((ct("iPhone")&&!ct("iPod")&&!ct("iPad")||ct("iPad")||ct("iPod"))&&r.navigator&&r.navigator.standalone&&n&&"_self"!=n?(vt(s=ce(document,"A"),"HTMLAnchorElement"),e instanceof St||e instanceof St||(e="object"==typeof e&&e.ra?e.qa():String(e),Ot.test(e)||(e="about:invalid#zClosurez"),e=new St(Ct,e)),s.href=xt(e),s.setAttribute("target",n),t.noreferrer&&s.setAttribute("rel","noreferrer"),(t=document.createEvent("MouseEvent")).initMouseEvent("click",!0,!0,r,1),s.dispatchEvent(t),s={}):t.noreferrer?(s=r.open("",n,s),t=xt(e),s&&(Ht&&ot(t,";")&&(t="'"+t.replace(/'/g,"%27")+"'"),s.opener=null,t=jt('<meta name="referrer" content="no-referrer"><meta http-equiv="refresh" content="0; url='+Ft(t)+'">'),r=s.document)&&(r.write(Lt(t)),r.close())):(s=r.open(xt(e),n,s))&&t.noopener&&(s.opener=null),s)try{s.focus();}catch(t){}return s;}var ur=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,cr=/^[^@]+@[^@]+$/;function hr(){var t=null;return new me(function(e){"complete"==s.document.readyState?e():(t=function(){e();},on(window,"load",t));}).o(function(e){throw sn(window,"load",t),e;});}function lr(t){return t=t||_r(),!("file:"!==kr()&&"ionic:"!==kr()||!t.toLowerCase().match(/iphone|ipad|ipod|android/));}function fr(){var t=s.window;try{return !(!t||t==t.top);}catch(t){return !1;}}function pr(){return void 0!==s.WorkerGlobalScope&&"function"==typeof s.importScripts;}function dr(){return I.INTERNAL.hasOwnProperty("reactNative")?"ReactNative":I.INTERNAL.hasOwnProperty("node")?"Node":pr()?"Worker":"Browser";}function vr(){var t=dr();return "ReactNative"===t||"Node"===t;}var yr="Firefox",mr="Chrome";function gr(t){var e=t.toLowerCase();return ot(e,"opera/")||ot(e,"opr/")||ot(e,"opios/")?"Opera":ot(e,"iemobile")?"IEMobile":ot(e,"msie")||ot(e,"trident/")?"IE":ot(e,"edge/")?"Edge":ot(e,"firefox/")?yr:ot(e,"silk/")?"Silk":ot(e,"blackberry")?"Blackberry":ot(e,"webos")?"Webos":!ot(e,"safari/")||ot(e,"chrome/")||ot(e,"crios/")||ot(e,"android")?!ot(e,"chrome/")&&!ot(e,"crios/")||ot(e,"edge/")?ot(e,"android")?"Android":(t=t.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/))&&2==t.length?t[1]:"Other":mr:"Safari";}var br={jd:"FirebaseCore-web",ld:"FirebaseUI-web"};function wr(t,e){e=e||[];var n,r=[],i={};for(n in br)i[br[n]]=!0;for(n=0;n<e.length;n++)void 0!==i[e[n]]&&(delete i[e[n]],r.push(e[n]));return r.sort(),(e=r).length||(e=["FirebaseCore-web"]),"Browser"===(r=dr())?r=gr(i=_r()):"Worker"===r&&(r=gr(i=_r())+"-"+r),r+"/JsCore/"+t+"/"+e.join(",");}function _r(){return s.navigator&&s.navigator.userAgent||"";}function Er(t,e){t=t.split("."),e=e||s;for(var n=0;n<t.length&&"object"==typeof e&&null!=e;n++)e=e[t[n]];return n!=t.length&&(e=void 0),e;}function Ir(){try{var t=s.localStorage,e=Dr();if(t)return t.setItem(e,"1"),t.removeItem(e),!nr()||!!s.indexedDB;}catch(t){return pr()&&!!s.indexedDB;}return !1;}function Tr(){return (Ar()||"chrome-extension:"===kr()||lr())&&!vr()&&Ir()&&!pr();}function Ar(){return "http:"===kr()||"https:"===kr();}function kr(){return s.location&&s.location.protocol||null;}function Nr(t){return !or(t=t||_r())&&gr(t)!=yr;}function Sr(t){return void 0===t?null:Jn(t);}function xr(t){var e,n={};for(e in t)t.hasOwnProperty(e)&&null!==t[e]&&void 0!==t[e]&&(n[e]=t[e]);return n;}function Or(t){if(null!==t)return JSON.parse(t);}function Dr(t){return t||Math.floor(1e9*Math.random()).toString();}function Rr(t){return "Safari"!=gr(t=t||_r())&&!t.toLowerCase().match(/iphone|ipad|ipod/);}function Cr(){var t=s.___jsl;if(t&&t.H)for(var e in t.H)if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=t.H[e].L.concat(),t.CP)for(var n=0;n<t.CP.length;n++)t.CP[n]=null;}function Pr(t,e){if(t>e)throw Error("Short delay should be less than long delay!");this.a=t,this.c=e,t=_r(),e=dr(),this.b=or(t)||"ReactNative"===e;}function Lr(){var t=s.document;return !t||void 0===t.visibilityState||"visible"==t.visibilityState;}function Mr(t){try{var e=new Date(parseInt(t,10));if(!isNaN(e.getTime())&&!/[^0-9]/.test(t))return e.toUTCString();}catch(t){}return null;}function jr(){return !(!Er("fireauth.oauthhelper",s)&&!Er("fireauth.iframe",s));}Pr.prototype.get=function(){var t=s.navigator;return !t||"boolean"!=typeof t.onLine||!Ar()&&"chrome-extension:"!==kr()&&void 0===t.connection||t.onLine?this.b?this.c:this.a:Math.min(5e3,this.a);};var Vr,Ur={};function Fr(t){Ur[t]||(Ur[t]=!0,"undefined"!=typeof console&&"function"==typeof console.warn&&console.warn(t));}try{var qr={};Object.defineProperty(qr,"abcd",{configurable:!0,enumerable:!0,value:1}),Object.defineProperty(qr,"abcd",{configurable:!0,enumerable:!0,value:2}),Vr=2==qr.abcd;}catch(t){Vr=!1;}function Br(t,e,n){Vr?Object.defineProperty(t,e,{configurable:!0,enumerable:!0,value:n}):t[e]=n;}function zr(t,e){if(e)for(var n in e)e.hasOwnProperty(n)&&Br(t,n,e[n]);}function Gr(t){var e={};return zr(e,t),e;}function Wr(t){var e=t;if("object"==typeof t&&null!=t)for(var n in e="length"in t?[]:{},t)Br(e,n,Wr(t[n]));return e;}function Hr(t){var e=t&&(t[Jr]?"phone":null);if(!(e&&t&&t[Qr]))throw new E("internal-error","Internal assert: invalid MultiFactorInfo object");Br(this,"uid",t[Qr]),Br(this,"displayName",t[Yr]||null);var n=null;t[Xr]&&(n=new Date(t[Xr]).toUTCString()),Br(this,"enrollmentTime",n),Br(this,"factorId",e);}function Kr(t){try{var e=new $r(t);}catch(t){e=null;}return e;}Hr.prototype.v=function(){return {uid:this.uid,displayName:this.displayName,factorId:this.factorId,enrollmentTime:this.enrollmentTime};};var Yr="displayName",Xr="enrolledAt",Qr="mfaEnrollmentId",Jr="phoneInfo";function $r(t){Hr.call(this,t),Br(this,"phoneNumber",t[Jr]);}function Zr(t){var e={},n=t[ri],r=t[oi],i=t[si];if(t=Kr(t[ii]),!i||i!=ei&&i!=ni&&!n||i==ni&&!r||i==ti&&!t)throw Error("Invalid checkActionCode response!");i==ni?(e[ui]=n||null,e[hi]=n||null,e[ai]=r):(e[ui]=r||null,e[hi]=r||null,e[ai]=n||null),e[ci]=t||null,Br(this,fi,i),Br(this,li,Wr(e));}_($r,Hr),$r.prototype.v=function(){var t=$r.Za.v.call(this);return t.phoneNumber=this.phoneNumber,t;};var ti="REVERT_SECOND_FACTOR_ADDITION",ei="EMAIL_SIGNIN",ni="VERIFY_AND_CHANGE_EMAIL",ri="email",ii="mfaInfo",oi="newEmail",si="requestType",ai="email",ui="fromEmail",ci="multiFactorInfo",hi="previousEmail",li="data",fi="operation";function pi(t){var e=Rn(t=Cn(t),di)||null,n=Rn(t,vi)||null,r=Rn(t,gi)||null;if(r=r&&wi[r]||null,!e||!n||!r)throw new E("argument-error",di+", "+vi+"and "+gi+" are required in a valid action code URL.");zr(this,{apiKey:e,operation:r,code:n,continueUrl:Rn(t,yi)||null,languageCode:Rn(t,mi)||null,tenantId:Rn(t,bi)||null});}var di="apiKey",vi="oobCode",yi="continueUrl",mi="languageCode",gi="mode",bi="tenantId",wi={recoverEmail:"RECOVER_EMAIL",resetPassword:"PASSWORD_RESET",revertSecondFactorAddition:ti,signIn:ei,verifyAndChangeEmail:ni,verifyEmail:"VERIFY_EMAIL"};function _i(t){try{return new pi(t);}catch(t){return null;}}function Ei(t){var e=t[Ni];if(void 0===e)throw new E("missing-continue-uri");if("string"!=typeof e||"string"==typeof e&&!e.length)throw new E("invalid-continue-uri");this.h=e,this.b=this.a=null,this.g=!1;var n=t[Ii];if(n&&"object"==typeof n){e=n[Oi];var r=n[Si];if(n=n[xi],"string"==typeof e&&e.length){if(this.a=e,void 0!==r&&"boolean"!=typeof r)throw new E("argument-error",Si+" property must be a boolean when specified.");if(this.g=!!r,void 0!==n&&("string"!=typeof n||"string"==typeof n&&!n.length))throw new E("argument-error",xi+" property must be a non empty string when specified.");this.b=n||null;}else {if(void 0!==e)throw new E("argument-error",Oi+" property must be a non empty string when specified.");if(void 0!==r||void 0!==n)throw new E("missing-android-pkg-name");}}else if(void 0!==n)throw new E("argument-error",Ii+" property must be a non null object when specified.");if(this.f=null,(e=t[ki])&&"object"==typeof e){if("string"==typeof(e=e[Di])&&e.length)this.f=e;else if(void 0!==e)throw new E("argument-error",Di+" property must be a non empty string when specified.");}else if(void 0!==e)throw new E("argument-error",ki+" property must be a non null object when specified.");if(void 0!==(e=t[Ai])&&"boolean"!=typeof e)throw new E("argument-error",Ai+" property must be a boolean when specified.");if(this.c=!!e,void 0!==(t=t[Ti])&&("string"!=typeof t||"string"==typeof t&&!t.length))throw new E("argument-error",Ti+" property must be a non empty string when specified.");this.i=t||null;}var Ii="android",Ti="dynamicLinkDomain",Ai="handleCodeInApp",ki="iOS",Ni="url",Si="installApp",xi="minimumVersion",Oi="packageName",Di="bundleId";function Ri(t){var e={};for(var n in e.continueUrl=t.h,e.canHandleCodeInApp=t.c,(e.androidPackageName=t.a)&&(e.androidMinimumVersion=t.b,e.androidInstallApp=t.g),e.iOSBundleId=t.f,e.dynamicLinkDomain=t.i,e)null===e[n]&&delete e[n];return e;}var Ci=null;function Pi(t){var e="";return function(t,e){function n(e){for(;r<t.length;){var n=t.charAt(r++),i=Ci[n];if(null!=i)return i;if(!/^[\s\xa0]*$/.test(n))throw Error("Unknown base64 encoding at char: "+n);}return e;}!function(){if(!Ci){Ci={};for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),e=["+/=","+/","-_=","-_.","-_"],n=0;5>n;n++)for(var r=t.concat(e[n].split("")),i=0;i<r.length;i++){var o=r[i];void 0===Ci[o]&&(Ci[o]=i);}}}();for(var r=0;;){var i=n(-1),o=n(0),s=n(64),a=n(64);if(64===a&&-1===i)break;e(i<<2|o>>4),64!=s&&(e(o<<4&240|s>>2),64!=a&&e(s<<6&192|a));}}(t,function(t){e+=String.fromCharCode(t);}),e;}function Li(t){var e=ji(t);if(!(e&&e.sub&&e.iss&&e.aud&&e.exp))throw Error("Invalid JWT");this.g=t,this.c=e.exp,this.h=e.sub,this.a=e.provider_id||e.firebase&&e.firebase.sign_in_provider||null,this.f=e.firebase&&e.firebase.tenant||null,this.b=!!e.is_anonymous||"anonymous"==this.a;}function Mi(t){try{return new Li(t);}catch(t){return null;}}function ji(t){if(!t)return null;if(3!=(t=t.split(".")).length)return null;for(var e=(4-(t=t[1]).length%4)%4,n=0;n<e;n++)t+=".";try{return JSON.parse(Pi(t));}catch(t){}return null;}Li.prototype.S=function(){return this.f;},Li.prototype.i=function(){return this.b;},Li.prototype.toString=function(){return this.g;};var Vi="oauth_consumer_key oauth_nonce oauth_signature oauth_signature_method oauth_timestamp oauth_token oauth_version".split(" "),Ui=["client_id","response_type","scope","redirect_uri","state"],Fi={kd:{Ha:"locale",ta:700,sa:600,ea:"facebook.com",Va:Ui},md:{Ha:null,ta:500,sa:750,ea:"github.com",Va:Ui},nd:{Ha:"hl",ta:515,sa:680,ea:"google.com",Va:Ui},td:{Ha:"lang",ta:485,sa:705,ea:"twitter.com",Va:Vi},gd:{Ha:"locale",ta:640,sa:600,ea:"apple.com",Va:[]}};function qi(t){for(var e in Fi)if(Fi[e].ea==t)return Fi[e];return null;}function Bi(t){var e={};e["facebook.com"]=Ki,e["google.com"]=Xi,e["github.com"]=Yi,e["twitter.com"]=Qi;var n=t&&t[Gi];try{if(n)return e[n]?new e[n](t):new Hi(t);if(void 0!==t[zi])return new Wi(t);}catch(t){}return null;}var zi="idToken",Gi="providerId";function Wi(t){var e=t[Gi];if(!e&&t[zi]){var n=Mi(t[zi]);n&&n.a&&(e=n.a);}if(!e)throw Error("Invalid additional user info!");"anonymous"!=e&&"custom"!=e||(e=null),n=!1,void 0!==t.isNewUser?n=!!t.isNewUser:"identitytoolkit#SignupNewUserResponse"===t.kind&&(n=!0),Br(this,"providerId",e),Br(this,"isNewUser",n);}function Hi(t){Wi.call(this,t),Br(this,"profile",Wr((t=Or(t.rawUserInfo||"{}"))||{}));}function Ki(t){if(Hi.call(this,t),"facebook.com"!=this.providerId)throw Error("Invalid provider ID!");}function Yi(t){if(Hi.call(this,t),"github.com"!=this.providerId)throw Error("Invalid provider ID!");Br(this,"username",this.profile&&this.profile.login||null);}function Xi(t){if(Hi.call(this,t),"google.com"!=this.providerId)throw Error("Invalid provider ID!");}function Qi(t){if(Hi.call(this,t),"twitter.com"!=this.providerId)throw Error("Invalid provider ID!");Br(this,"username",t.screenName||null);}function Ji(t){var e=Cn(t),n=Rn(e,"link"),r=Rn(Cn(n),"link");return e=Rn(e,"deep_link_id"),Rn(Cn(e),"link")||e||r||n||t;}function $i(t,e){if(!t&&!e)throw new E("internal-error","Internal assert: no raw session string available");if(t&&e)throw new E("internal-error","Internal assert: unable to determine the session type");this.a=t||null,this.b=e||null,this.type=this.a?Zi:to;}_(Hi,Wi),_(Ki,Hi),_(Yi,Hi),_(Xi,Hi),_(Qi,Hi);var Zi="enroll",to="signin";function eo(){}function no(t,e){return t.then(function(t){if(t[Gs]){var n=Mi(t[Gs]);if(!n||e!=n.h)throw new E("user-mismatch");return t;}throw new E("user-mismatch");}).o(function(t){throw t&&t.code&&t.code==k+"user-not-found"?new E("user-mismatch"):t;});}function ro(t,e){if(!e)throw new E("internal-error","failed to construct a credential");this.a=e,Br(this,"providerId",t),Br(this,"signInMethod",t);}function io(t){return {pendingToken:t.a,requestUri:"http://localhost"};}function oo(t){if(t&&t.providerId&&t.signInMethod&&0==t.providerId.indexOf("saml.")&&t.pendingToken)try{return new ro(t.providerId,t.pendingToken);}catch(t){}return null;}function so(t,e,n){if(this.a=null,e.idToken||e.accessToken)e.idToken&&Br(this,"idToken",e.idToken),e.accessToken&&Br(this,"accessToken",e.accessToken),e.nonce&&!e.pendingToken&&Br(this,"nonce",e.nonce),e.pendingToken&&(this.a=e.pendingToken);else {if(!e.oauthToken||!e.oauthTokenSecret)throw new E("internal-error","failed to construct a credential");Br(this,"accessToken",e.oauthToken),Br(this,"secret",e.oauthTokenSecret);}Br(this,"providerId",t),Br(this,"signInMethod",n);}function ao(t){var e={};return t.idToken&&(e.id_token=t.idToken),t.accessToken&&(e.access_token=t.accessToken),t.secret&&(e.oauth_token_secret=t.secret),e.providerId=t.providerId,t.nonce&&!t.a&&(e.nonce=t.nonce),e={postBody:Wn(e).toString(),requestUri:"http://localhost"},t.a&&(delete e.postBody,e.pendingToken=t.a),e;}function uo(t){if(t&&t.providerId&&t.signInMethod){var e={idToken:t.oauthIdToken,accessToken:t.oauthTokenSecret?null:t.oauthAccessToken,oauthTokenSecret:t.oauthTokenSecret,oauthToken:t.oauthTokenSecret&&t.oauthAccessToken,nonce:t.nonce,pendingToken:t.pendingToken};try{return new so(t.providerId,e,t.signInMethod);}catch(t){}}return null;}function co(t,e){this.Oc=e||[],zr(this,{providerId:t,isOAuthProvider:!0}),this.Fb={},this.lb=(qi(t)||{}).Ha||null,this.kb=null;}function ho(t){if("string"!=typeof t||0!=t.indexOf("saml."))throw new E("argument-error",'SAML provider IDs must be prefixed with "saml."');co.call(this,t,[]);}function lo(t){co.call(this,t,Ui),this.a=[];}function fo(){lo.call(this,"facebook.com");}function po(t){if(!t)throw new E("argument-error","credential failed: expected 1 argument (the OAuth access token).");var e=t;return p(t)&&(e=t.accessToken),new fo().credential({accessToken:e});}function vo(){lo.call(this,"github.com");}function yo(t){if(!t)throw new E("argument-error","credential failed: expected 1 argument (the OAuth access token).");var e=t;return p(t)&&(e=t.accessToken),new vo().credential({accessToken:e});}function mo(){lo.call(this,"google.com"),this.Aa("profile");}function go(t,e){var n=t;return p(t)&&(n=t.idToken,e=t.accessToken),new mo().credential({idToken:n,accessToken:e});}function bo(){co.call(this,"twitter.com",Vi);}function wo(t,e){var n=t;if(p(n)||(n={oauthToken:t,oauthTokenSecret:e}),!n.oauthToken||!n.oauthTokenSecret)throw new E("argument-error","credential failed: expected 2 arguments (the OAuth access token and secret).");return new so("twitter.com",n,"twitter.com");}function _o(t,e,n){this.a=t,this.f=e,Br(this,"providerId","password"),Br(this,"signInMethod",n===Io.EMAIL_LINK_SIGN_IN_METHOD?Io.EMAIL_LINK_SIGN_IN_METHOD:Io.EMAIL_PASSWORD_SIGN_IN_METHOD);}function Eo(t){return t&&t.email&&t.password?new _o(t.email,t.password,t.signInMethod):null;}function Io(){zr(this,{providerId:"password",isOAuthProvider:!1});}function To(t,e){if(!(e=Ao(e)))throw new E("argument-error","Invalid email link!");return new _o(t,e.code,Io.EMAIL_LINK_SIGN_IN_METHOD);}function Ao(t){return (t=_i(t=Ji(t)))&&t.operation===ei?t:null;}function ko(t){if(!(t.bb&&t.ab||t.Ja&&t.da))throw new E("internal-error");this.a=t,Br(this,"providerId","phone"),this.ea="phone",Br(this,"signInMethod","phone");}function No(t){if(t&&"phone"===t.providerId&&(t.verificationId&&t.verificationCode||t.temporaryProof&&t.phoneNumber)){var e={};return q(["verificationId","verificationCode","temporaryProof","phoneNumber"],function(n){t[n]&&(e[n]=t[n]);}),new ko(e);}return null;}function So(t){return t.a.Ja&&t.a.da?{temporaryProof:t.a.Ja,phoneNumber:t.a.da}:{sessionInfo:t.a.bb,code:t.a.ab};}function xo(t){try{this.a=t||I.auth();}catch(t){throw new E("argument-error","Either an instance of firebase.auth.Auth must be passed as an argument to the firebase.auth.PhoneAuthProvider constructor, or the default firebase App instance must be initialized via firebase.initializeApp().");}zr(this,{providerId:"phone",isOAuthProvider:!1});}function Oo(t,e){if(!t)throw new E("missing-verification-id");if(!e)throw new E("missing-verification-code");return new ko({bb:t,ab:e});}function Do(t){if(t.temporaryProof&&t.phoneNumber)return new ko({Ja:t.temporaryProof,da:t.phoneNumber});var e=t&&t.providerId;if(!e||"password"===e)return null;var n=t&&t.oauthAccessToken,r=t&&t.oauthTokenSecret,i=t&&t.nonce,o=t&&t.oauthIdToken,s=t&&t.pendingToken;try{switch(e){case"google.com":return go(o,n);case"facebook.com":return po(n);case"github.com":return yo(n);case"twitter.com":return wo(n,r);default:return n||r||o||s?s?0==e.indexOf("saml.")?new ro(e,s):new so(e,{pendingToken:s,idToken:t.oauthIdToken,accessToken:t.oauthAccessToken},e):new lo(e).credential({idToken:o,accessToken:n,rawNonce:i}):null;}}catch(t){return null;}}function Ro(t){if(!t.isOAuthProvider)throw new E("invalid-oauth-provider");}function Co(t,e,n,r,i,o,s){if(this.c=t,this.b=e||null,this.g=n||null,this.f=r||null,this.i=o||null,this.h=s||null,this.a=i||null,!this.g&&!this.a)throw new E("invalid-auth-event");if(this.g&&this.a)throw new E("invalid-auth-event");if(this.g&&!this.f)throw new E("invalid-auth-event");}function Po(t){return (t=t||{}).type?new Co(t.type,t.eventId,t.urlResponse,t.sessionId,t.error&&T(t.error),t.postBody,t.tenantId):null;}function Lo(){this.b=null,this.a=[];}$i.prototype.Fa=function(){return this.a?Te(this.a):Te(this.b);},$i.prototype.v=function(){return this.type==Zi?{multiFactorSession:{idToken:this.a}}:{multiFactorSession:{pendingCredential:this.b}};},eo.prototype.ia=function(){},eo.prototype.b=function(){},eo.prototype.c=function(){},eo.prototype.v=function(){},ro.prototype.ia=function(t){return ha(t,io(this));},ro.prototype.b=function(t,e){var n=io(this);return n.idToken=e,la(t,n);},ro.prototype.c=function(t,e){return no(fa(t,io(this)),e);},ro.prototype.v=function(){return {providerId:this.providerId,signInMethod:this.signInMethod,pendingToken:this.a};},so.prototype.ia=function(t){return ha(t,ao(this));},so.prototype.b=function(t,e){var n=ao(this);return n.idToken=e,la(t,n);},so.prototype.c=function(t,e){return no(fa(t,ao(this)),e);},so.prototype.v=function(){var t={providerId:this.providerId,signInMethod:this.signInMethod};return this.idToken&&(t.oauthIdToken=this.idToken),this.accessToken&&(t.oauthAccessToken=this.accessToken),this.secret&&(t.oauthTokenSecret=this.secret),this.nonce&&(t.nonce=this.nonce),this.a&&(t.pendingToken=this.a),t;},co.prototype.Ia=function(t){return this.Fb=ft(t),this;},_(ho,co),_(lo,co),lo.prototype.Aa=function(t){return W(this.a,t)||this.a.push(t),this;},lo.prototype.Nb=function(){return X(this.a);},lo.prototype.credential=function(t,e){var n;if(!(n=p(t)?{idToken:t.idToken||null,accessToken:t.accessToken||null,nonce:t.rawNonce||null}:{idToken:t||null,accessToken:e||null}).idToken&&!n.accessToken)throw new E("argument-error","credential failed: must provide the ID token and/or the access token.");return new so(this.providerId,n,this.providerId);},_(fo,lo),Br(fo,"PROVIDER_ID","facebook.com"),Br(fo,"FACEBOOK_SIGN_IN_METHOD","facebook.com"),_(vo,lo),Br(vo,"PROVIDER_ID","github.com"),Br(vo,"GITHUB_SIGN_IN_METHOD","github.com"),_(mo,lo),Br(mo,"PROVIDER_ID","google.com"),Br(mo,"GOOGLE_SIGN_IN_METHOD","google.com"),_(bo,co),Br(bo,"PROVIDER_ID","twitter.com"),Br(bo,"TWITTER_SIGN_IN_METHOD","twitter.com"),_o.prototype.ia=function(t){return this.signInMethod==Io.EMAIL_LINK_SIGN_IN_METHOD?Ka(t,wa,{email:this.a,oobCode:this.f}):Ka(t,Ba,{email:this.a,password:this.f});},_o.prototype.b=function(t,e){return this.signInMethod==Io.EMAIL_LINK_SIGN_IN_METHOD?Ka(t,_a,{idToken:e,email:this.a,oobCode:this.f}):Ka(t,Pa,{idToken:e,email:this.a,password:this.f});},_o.prototype.c=function(t,e){return no(this.ia(t),e);},_o.prototype.v=function(){return {email:this.a,password:this.f,signInMethod:this.signInMethod};},zr(Io,{PROVIDER_ID:"password"}),zr(Io,{EMAIL_LINK_SIGN_IN_METHOD:"emailLink"}),zr(Io,{EMAIL_PASSWORD_SIGN_IN_METHOD:"password"}),ko.prototype.ia=function(t){return t.cb(So(this));},ko.prototype.b=function(t,e){var n=So(this);return n.idToken=e,Ka(t,Ga,n);},ko.prototype.c=function(t,e){var n=So(this);return n.operation="REAUTH",no(t=Ka(t,Wa,n),e);},ko.prototype.v=function(){var t={providerId:"phone"};return this.a.bb&&(t.verificationId=this.a.bb),this.a.ab&&(t.verificationCode=this.a.ab),this.a.Ja&&(t.temporaryProof=this.a.Ja),this.a.da&&(t.phoneNumber=this.a.da),t;},xo.prototype.cb=function(t,e){var n=this.a.b;return Te(e.verify()).then(function(r){if("string"!=typeof r)throw new E("argument-error","An implementation of firebase.auth.ApplicationVerifier.prototype.verify() must return a firebase.Promise that resolves with a string.");switch(e.type){case"recaptcha":var i=p(t)?t.session:null,o=p(t)?t.phoneNumber:t;return (i&&i.type==Zi?i.Fa().then(function(t){return function(t,e){return Ka(t,Ma,e).then(function(t){return t.phoneSessionInfo.sessionInfo;});}(n,{idToken:t,phoneEnrollmentInfo:{phoneNumber:o,recaptchaToken:r}});}):i&&i.type==to?i.Fa().then(function(e){return function(t,e){return Ka(t,ja,e).then(function(t){return t.phoneResponseInfo.sessionInfo;});}(n,{mfaPendingCredential:e,mfaEnrollmentId:t.multiFactorHint&&t.multiFactorHint.uid||t.multiFactorUid,phoneSignInInfo:{recaptchaToken:r}});}):function(t,e){return Ka(t,Ra,e);}(n,{phoneNumber:o,recaptchaToken:r})).then(function(t){return "function"==typeof e.reset&&e.reset(),t;},function(t){throw "function"==typeof e.reset&&e.reset(),t;});default:throw new E("argument-error",'Only firebase.auth.ApplicationVerifiers with type="recaptcha" are currently supported.');}});},zr(xo,{PROVIDER_ID:"phone"}),zr(xo,{PHONE_SIGN_IN_METHOD:"phone"}),Co.prototype.getUid=function(){var t=[];return t.push(this.c),this.b&&t.push(this.b),this.f&&t.push(this.f),this.h&&t.push(this.h),t.join("-");},Co.prototype.S=function(){return this.h;},Co.prototype.v=function(){return {type:this.c,eventId:this.b,urlResponse:this.g,sessionId:this.f,postBody:this.i,tenantId:this.h,error:this.a&&this.a.v()};};var Mo,jo=null;function Vo(t){var e="unauthorized-domain",n=void 0,r=Cn(t);t=r.b,"chrome-extension"==(r=r.f)?n=Ut("This chrome extension ID (chrome-extension://%s) is not authorized to run this operation. Add it to the OAuth redirect domains list in the Firebase console -> Auth section -> Sign in method tab.",t):"http"==r||"https"==r?n=Ut("This domain (%s) is not authorized to run this operation. Add it to the OAuth redirect domains list in the Firebase console -> Auth section -> Sign in method tab.",t):e="operation-not-supported-in-this-environment",E.call(this,e,n);}function Uo(t,e,n){E.call(this,t,n),(t=e||{}).Gb&&Br(this,"email",t.Gb),t.da&&Br(this,"phoneNumber",t.da),t.credential&&Br(this,"credential",t.credential),t.Wb&&Br(this,"tenantId",t.Wb);}function Fo(t){if(t.code){var e=t.code||"";0==e.indexOf(k)&&(e=e.substring(k.length));var n={credential:Do(t),Wb:t.tenantId};if(t.email)n.Gb=t.email;else if(t.phoneNumber)n.da=t.phoneNumber;else if(!n.credential)return new E(e,t.message||void 0);return new Uo(e,n,t.message);}return null;}function qo(){}function Bo(t){return t.c||(t.c=t.b());}function zo(){}function Go(t){if(!t.f&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var e=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],n=0;n<e.length;n++){var r=e[n];try{return new ActiveXObject(r),t.f=r;}catch(t){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return t.f;}function Wo(){}function Ho(){this.a=new XDomainRequest(),this.readyState=0,this.onreadystatechange=null,this.responseType=this.responseText=this.response="",this.status=-1,this.statusText="",this.a.onload=g(this.oc,this),this.a.onerror=g(this.Pb,this),this.a.onprogress=g(this.pc,this),this.a.ontimeout=g(this.tc,this);}function Ko(t,e){t.readyState=e,t.onreadystatechange&&t.onreadystatechange();}function Yo(t,e,n){this.reset(t,e,n,void 0,void 0);}function Xo(t){this.f=t,this.b=this.c=this.a=null;}function Qo(t,e){this.name=t,this.value=e;}_(Vo,E),_(Uo,E),Uo.prototype.v=function(){var t={code:this.code,message:this.message};this.email&&(t.email=this.email),this.phoneNumber&&(t.phoneNumber=this.phoneNumber),this.tenantId&&(t.tenantId=this.tenantId);var e=this.credential&&this.credential.v();return e&&dt(t,e),t;},Uo.prototype.toJSON=function(){return this.v();},qo.prototype.c=null,_(zo,qo),zo.prototype.a=function(){var t=Go(this);return t?new ActiveXObject(t):new XMLHttpRequest();},zo.prototype.b=function(){var t={};return Go(this)&&(t[0]=!0,t[1]=!0),t;},Mo=new zo(),_(Wo,qo),Wo.prototype.a=function(){var t=new XMLHttpRequest();if("withCredentials"in t)return t;if("undefined"!=typeof XDomainRequest)return new Ho();throw Error("Unsupported browser");},Wo.prototype.b=function(){return {};},(t=Ho.prototype).open=function(t,e,n){if(null!=n&&!n)throw Error("Only async requests are supported.");this.a.open(t,e);},t.send=function(t){if(t){if("string"!=typeof t)throw Error("Only string data is supported");this.a.send(t);}else this.a.send();},t.abort=function(){this.a.abort();},t.setRequestHeader=function(){},t.getResponseHeader=function(t){return "content-type"==t.toLowerCase()?this.a.contentType:"";},t.oc=function(){this.status=200,this.response=this.responseText=this.a.responseText,Ko(this,4);},t.Pb=function(){this.status=500,this.response=this.responseText="",Ko(this,4);},t.tc=function(){this.Pb();},t.pc=function(){this.status=200,Ko(this,1);},t.getAllResponseHeaders=function(){return "content-type: "+this.a.contentType;},Yo.prototype.a=null,Yo.prototype.reset=function(t,e,n,r,i){delete this.a;},Qo.prototype.toString=function(){return this.name;};var Jo=new Qo("SEVERE",1e3),$o=new Qo("WARNING",900),Zo=new Qo("CONFIG",700),ts=new Qo("FINE",500);Xo.prototype.log=function(t,e,n){if(t.value>=function t(e){return e.c?e.c:e.a?t(e.a):(C("Root logger has no level set."),null);}(this).value)for(f(e)&&(e=e()),t=new Yo(t,String(e),this.f),n&&(t.a=n),n=this;n;)n=n.a;};var es={},ns=null;function rs(t){var e;if(ns||(ns=new Xo(""),es[""]=ns,ns.c=Zo),!(e=es[t])){e=new Xo(t);var n=t.lastIndexOf("."),r=t.substr(n+1);(n=rs(t.substr(0,n))).b||(n.b={}),n.b[r]=e,e.a=n,es[t]=e;}return e;}function is(t,e){t&&t.log(ts,e,void 0);}function os(t){this.f=t;}function ss(t){vn.call(this),this.s=t,this.readyState=as,this.status=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.i=new Headers(),this.b=null,this.m="GET",this.g="",this.a=!1,this.h=rs("goog.net.FetchXmlHttp"),this.l=this.c=this.f=null;}_(os,qo),os.prototype.a=function(){return new ss(this.f);},os.prototype.b=function(t){return function(){return t;};}({}),_(ss,vn);var as=0;function us(t){t.c.read().then(t.nc.bind(t)).catch(t.Sa.bind(t));}function cs(t,e){e&&t.f&&(t.status=t.f.status,t.statusText=t.f.statusText),t.readyState=4,t.f=null,t.c=null,t.l=null,hs(t);}function hs(t){t.onreadystatechange&&t.onreadystatechange.call(t);}function ls(t){vn.call(this),this.headers=new In(),this.D=t||null,this.c=!1,this.B=this.a=null,this.h=this.P=this.l="",this.f=this.O=this.i=this.N=!1,this.g=0,this.s=null,this.m=fs,this.w=this.R=!1;}(t=ss.prototype).open=function(t,e){if(this.readyState!=as)throw this.abort(),Error("Error reopening a connection");this.m=t,this.g=e,this.readyState=1,hs(this);},t.send=function(t){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");this.a=!0;var e={headers:this.i,method:this.m,credentials:void 0,cache:void 0};t&&(e.body=t),this.s.fetch(new Request(this.g,e)).then(this.sc.bind(this),this.Sa.bind(this));},t.abort=function(){this.response=this.responseText="",this.i=new Headers(),this.status=0,this.c&&this.c.cancel("Request was aborted."),1<=this.readyState&&this.a&&4!=this.readyState&&(this.a=!1,cs(this,!1)),this.readyState=as;},t.sc=function(t){this.a&&(this.f=t,this.b||(this.b=t.headers,this.readyState=2,hs(this)),this.a&&(this.readyState=3,hs(this),this.a&&("arraybuffer"===this.responseType?t.arrayBuffer().then(this.qc.bind(this),this.Sa.bind(this)):void 0!==s.ReadableStream&&"body"in t?(this.response=this.responseText="",this.c=t.body.getReader(),this.l=new TextDecoder(),us(this)):t.text().then(this.rc.bind(this),this.Sa.bind(this)))));},t.nc=function(t){if(this.a){var e=this.l.decode(t.value?t.value:new Uint8Array(0),{stream:!t.done});e&&(this.response=this.responseText+=e),t.done?cs(this,!0):hs(this),3==this.readyState&&us(this);}},t.rc=function(t){this.a&&(this.response=this.responseText=t,cs(this,!0));},t.qc=function(t){this.a&&(this.response=t,cs(this,!0));},t.Sa=function(t){var e=this.h;e&&e.log($o,"Failed to fetch url "+this.g,t instanceof Error?t:Error(t)),this.a&&cs(this,!0);},t.setRequestHeader=function(t,e){this.i.append(t,e);},t.getResponseHeader=function(t){return this.b?this.b.get(t.toLowerCase())||"":((t=this.h)&&t.log($o,"Attempting to get response header but no headers have been received for url: "+this.g,void 0),"");},t.getAllResponseHeaders=function(){if(!this.b){var t=this.h;return t&&t.log($o,"Attempting to get all response headers but no headers have been received for url: "+this.g,void 0),"";}t=[];for(var e=this.b.entries(),n=e.next();!n.done;)n=n.value,t.push(n[0]+": "+n[1]),n=e.next();return t.join("\r\n");},_(ls,vn);var fs="";ls.prototype.b=rs("goog.net.XhrIo");var ps=/^https?$/i,ds=["POST","PUT"];function vs(t,e,n,r,i){if(t.a)throw Error("[goog.net.XhrIo] Object is active with another request="+t.l+"; newUri="+e);n=n?n.toUpperCase():"GET",t.l=e,t.h="",t.P=n,t.N=!1,t.c=!0,t.a=t.D?t.D.a():Mo.a(),t.B=t.D?Bo(t.D):Bo(Mo),t.a.onreadystatechange=g(t.Sb,t);try{is(t.b,Ts(t,"Opening Xhr")),t.O=!0,t.a.open(n,String(e),!0),t.O=!1;}catch(e){return is(t.b,Ts(t,"Error opening Xhr: "+e.message)),void ms(t,e);}e=r||"";var o=new In(t.headers);i&&function(t,e){if(t.forEach&&"function"==typeof t.forEach)t.forEach(e,void 0);else if(l(t)||"string"==typeof t)q(t,e,void 0);else for(var n=En(t),r=_n(t),i=r.length,o=0;o<i;o++)e.call(void 0,r[o],n&&n[o],t);}(i,function(t,e){o.set(e,t);}),i=function(t){t:{for(var e=ys,n=t.length,r="string"==typeof t?t.split(""):t,i=0;i<n;i++)if(i in r&&e.call(void 0,r[i],i,t)){e=i;break t;}e=-1;}return 0>e?null:"string"==typeof t?t.charAt(e):t[e];}(o.X()),r=s.FormData&&e instanceof s.FormData,!W(ds,n)||i||r||o.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8"),o.forEach(function(t,e){this.a.setRequestHeader(e,t);},t),t.m&&(t.a.responseType=t.m),"withCredentials"in t.a&&t.a.withCredentials!==t.R&&(t.a.withCredentials=t.R);try{_s(t),0<t.g&&(t.w=function(t){return Gt&&ee(9)&&"number"==typeof t.timeout&&void 0!==t.ontimeout;}(t.a),is(t.b,Ts(t,"Will abort after "+t.g+"ms if incomplete, xhr2 "+t.w)),t.w?(t.a.timeout=t.g,t.a.ontimeout=g(t.Ka,t)):t.s=bn(t.Ka,t.g,t)),is(t.b,Ts(t,"Sending request")),t.i=!0,t.a.send(e),t.i=!1;}catch(e){is(t.b,Ts(t,"Send error: "+e.message)),ms(t,e);}}function ys(t){return "content-type"==t.toLowerCase();}function ms(t,e){t.c=!1,t.a&&(t.f=!0,t.a.abort(),t.f=!1),t.h=e,gs(t),ws(t);}function gs(t){t.N||(t.N=!0,t.dispatchEvent("complete"),t.dispatchEvent("error"));}function bs(t){if(t.c&&void 0!==o)if(t.B[1]&&4==Es(t)&&2==Is(t))is(t.b,Ts(t,"Local request error detected and ignored"));else if(t.i&&4==Es(t))bn(t.Sb,0,t);else if(t.dispatchEvent("readystatechange"),4==Es(t)){is(t.b,Ts(t,"Request complete")),t.c=!1;try{var e,n=Is(t);t:switch(n){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var r=!0;break t;default:r=!1;}if(!(e=r)){var i;if(i=0===n){var a=String(t.l).match(kn)[1]||null;if(!a&&s.self&&s.self.location){var u=s.self.location.protocol;a=u.substr(0,u.length-1);}i=!ps.test(a?a.toLowerCase():"");}e=i;}if(e)t.dispatchEvent("complete"),t.dispatchEvent("success");else {try{var c=2<Es(t)?t.a.statusText:"";}catch(e){is(t.b,"Can not get status: "+e.message),c="";}t.h=c+" ["+Is(t)+"]",gs(t);}}finally{ws(t);}}}function ws(t,e){if(t.a){_s(t);var n=t.a,r=t.B[0]?c:null;t.a=null,t.B=null,e||t.dispatchEvent("ready");try{n.onreadystatechange=r;}catch(e){(t=t.b)&&t.log(Jo,"Problem encountered resetting onreadystatechange: "+e.message,void 0);}}}function _s(t){t.a&&t.w&&(t.a.ontimeout=null),t.s&&(s.clearTimeout(t.s),t.s=null);}function Es(t){return t.a?t.a.readyState:0;}function Is(t){try{return 2<Es(t)?t.a.status:-1;}catch(t){return -1;}}function Ts(t,e){return e+" ["+t.P+" "+t.l+" "+Is(t)+"]";}function As(t){var e=Ms;this.g=[],this.w=e,this.s=t||null,this.f=this.a=!1,this.c=void 0,this.u=this.B=this.i=!1,this.h=0,this.b=null,this.l=0;}function ks(t,e,n){t.a=!0,t.c=n,t.f=!e,Os(t);}function Ns(t){if(t.a){if(!t.u)throw new Ds(t);t.u=!1;}}function Ss(t,e,n,r){t.g.push([e,n,r]),t.a&&Os(t);}function xs(t){return G(t.g,function(t){return f(t[1]);});}function Os(t){if(t.h&&t.a&&xs(t)){var e=t.h,n=Ps[e];n&&(s.clearTimeout(n.a),delete Ps[e]),t.h=0;}t.b&&(t.b.l--,delete t.b),e=t.c;for(var r=n=!1;t.g.length&&!t.i;){var i=t.g.shift(),o=i[0],a=i[1];if(i=i[2],o=t.f?a:o)try{var u=o.call(i||t.s,e);void 0!==u&&(t.f=t.f&&(u==e||u instanceof Error),t.c=e=u),(O(e)||"function"==typeof s.Promise&&e instanceof s.Promise)&&(r=!0,t.i=!0);}catch(r){e=r,t.f=!0,xs(t)||(n=!0);}}t.c=e,r&&(u=g(t.m,t,!0),r=g(t.m,t,!1),e instanceof As?(Ss(e,u,r),e.B=!0):e.then(u,r)),n&&(e=new Cs(e),Ps[e.a]=e,t.h=e.a);}function Ds(){D.call(this);}function Rs(){D.call(this);}function Cs(t){this.a=s.setTimeout(g(this.c,this),0),this.b=t;}(t=ls.prototype).Ka=function(){void 0!==o&&this.a&&(this.h="Timed out after "+this.g+"ms, aborting",is(this.b,Ts(this,this.h)),this.dispatchEvent("timeout"),this.abort(8));},t.abort=function(){this.a&&this.c&&(is(this.b,Ts(this,"Aborting")),this.c=!1,this.f=!0,this.a.abort(),this.f=!1,this.dispatchEvent("complete"),this.dispatchEvent("abort"),ws(this));},t.Ba=function(){this.a&&(this.c&&(this.c=!1,this.f=!0,this.a.abort(),this.f=!1),ws(this,!0)),ls.Za.Ba.call(this);},t.Sb=function(){this.wa||(this.O||this.i||this.f?bs(this):this.Hc());},t.Hc=function(){bs(this);},t.getResponse=function(){try{if(!this.a)return null;if("response"in this.a)return this.a.response;switch(this.m){case fs:case"text":return this.a.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in this.a)return this.a.mozResponseArrayBuffer;}var t=this.b;return t&&t.log(Jo,"Response type "+this.m+" is not supported on this browser",void 0),null;}catch(t){return is(this.b,"Can not get response: "+t.message),null;}},As.prototype.cancel=function(t){if(this.a)this.c instanceof As&&this.c.cancel();else {if(this.b){var e=this.b;delete this.b,t?e.cancel(t):(e.l--,0>=e.l&&e.cancel());}this.w?this.w.call(this.s,this):this.u=!0,this.a||(t=new Rs(this),Ns(this),ks(this,!1,t));}},As.prototype.m=function(t,e){this.i=!1,ks(this,t,e);},As.prototype.then=function(t,e,n){var r,i,o=new me(function(t,e){r=t,i=e;});return Ss(this,r,function(t){t instanceof Rs?o.cancel():i(t);}),o.then(t,e,n);},As.prototype.$goog_Thenable=!0,_(Ds,D),Ds.prototype.message="Deferred has already fired",Ds.prototype.name="AlreadyCalledError",_(Rs,D),Rs.prototype.message="Deferred was canceled",Rs.prototype.name="CanceledError",Cs.prototype.c=function(){throw delete Ps[this.a],this.b;};var Ps={};function Ls(t){var e,n=document,r=Et(t).toString(),i=ce(document,"SCRIPT"),o={Tb:i,Ka:void 0},c=new As(o);return e=window.setTimeout(function(){js(i,!0);var t=new Fs(Us,"Timeout reached for loading script "+r);Ns(c),ks(c,!1,t);},5e3),o.Ka=e,i.onload=i.onreadystatechange=function(){i.readyState&&"loaded"!=i.readyState&&"complete"!=i.readyState||(js(i,!1,e),Ns(c),ks(c,!0,null));},i.onerror=function(){js(i,!0,e);var t=new Fs(Vs,"Error while loading script "+r);Ns(c),ks(c,!1,t);},dt(o={},{type:"text/javascript",charset:"UTF-8"}),ie(i,o),function(t,e){vt(t,"HTMLScriptElement"),t.src=Et(e),null===u&&(u=(e=(e=s.document).querySelector&&e.querySelector("script[nonce]"))&&(e=e.nonce||e.getAttribute("nonce"))&&a.test(e)?e:""),(e=u)&&t.setAttribute("nonce",e);}(i,t),function(t){var e;return (e=(t||document).getElementsByTagName("HEAD"))&&0!=e.length?e[0]:t.documentElement;}(n).appendChild(i),c;}function Ms(){if(this&&this.Tb){var t=this.Tb;t&&"SCRIPT"==t.tagName&&js(t,!0,this.Ka);}}function js(t,e,n){null!=n&&s.clearTimeout(n),t.onload=c,t.onerror=c,t.onreadystatechange=c,e&&window.setTimeout(function(){t&&t.parentNode&&t.parentNode.removeChild(t);},0);}var Vs=0,Us=1;function Fs(t,e){var n="Jsloader error (code #"+t+")";e&&(n+=": "+e),D.call(this,n),this.code=t;}function qs(t){this.f=t;}function Bs(t,e,n){if(this.c=t,t=e||{},this.u=t.secureTokenEndpoint||"https://securetoken.googleapis.com/v1/token",this.m=t.secureTokenTimeout||Ws,this.g=ft(t.secureTokenHeaders||Hs),this.h=t.firebaseEndpoint||"https://www.googleapis.com/identitytoolkit/v3/relyingparty/",this.l=t.identityPlatformEndpoint||"https://identitytoolkit.googleapis.com/v2/",this.i=t.firebaseTimeout||Ks,this.a=ft(t.firebaseHeaders||Ys),n&&(this.a["X-Client-Version"]=n,this.g["X-Client-Version"]=n),n="Node"==dr(),!(n=s.XMLHttpRequest||n&&I.INTERNAL.node&&I.INTERNAL.node.XMLHttpRequest)&&!pr())throw new E("internal-error","The XMLHttpRequest compatibility library was not found.");this.f=void 0,pr()?this.f=new os(self):vr()?this.f=new qs(n):this.f=new Wo(),this.b=null;}_(Fs,D),_(qs,qo),qs.prototype.a=function(){return new this.f();},qs.prototype.b=function(){return {};};var zs,Gs="idToken",Ws=new Pr(3e4,6e4),Hs={"Content-Type":"application/x-www-form-urlencoded"},Ks=new Pr(3e4,6e4),Ys={"Content-Type":"application/json"};function Xs(t,e){e?t.a["X-Firebase-Locale"]=e:delete t.a["X-Firebase-Locale"];}function Qs(t,e){e?(t.a["X-Client-Version"]=e,t.g["X-Client-Version"]=e):(delete t.a["X-Client-Version"],delete t.g["X-Client-Version"]);}function Js(t,e,n,r,i,o,a){(function(){var t=_r();return !((t=gr(t)!=mr?null:(t=t.match(/\sChrome\/(\d+)/i))&&2==t.length?parseInt(t[1],10):null)&&30>t)&&(!Gt||!Zt||9<Zt);})()||pr()?t=g(t.w,t):(zs||(zs=new me(function(t,e){!function(t,e){if(((window.gapi||{}).client||{}).request)t();else {s[Zs]=function(){((window.gapi||{}).client||{}).request?t():e(Error("CORS_UNSUPPORTED"));},function(t,e){Ss(t,null,e,void 0);}(Ls(It($s,{onload:Zs})),function(){e(Error("CORS_UNSUPPORTED"));});}}(t,e);})),t=g(t.s,t)),t(e,n,r,i,o,a);}Bs.prototype.S=function(){return this.b;},Bs.prototype.w=function(t,e,n,r,i,o){if(pr()&&(void 0===s.fetch||void 0===s.Headers||void 0===s.Request))throw new E("operation-not-supported-in-this-environment","fetch, Headers and Request native APIs or equivalent Polyfills must be available to support HTTP requests from a Worker environment.");var a=new ls(this.f);if(o){a.g=Math.max(0,o);var u=setTimeout(function(){a.dispatchEvent("timeout");},o);}yn(a,"complete",function(){u&&clearTimeout(u);var t=null;try{t=JSON.parse(function(t){try{return t.a?t.a.responseText:"";}catch(e){return is(t.b,"Can not get responseText: "+e.message),"";}}(this))||null;}catch(e){t=null;}e&&e(t);}),mn(a,"ready",function(){u&&clearTimeout(u),Ue(this);}),mn(a,"timeout",function(){u&&clearTimeout(u),Ue(this),e&&e(null);}),vs(a,t,n,r,i);};var $s=new yt(bt,"https://apis.google.com/js/client.js?onload=%{onload}"),Zs="__fcb"+Math.floor(1e6*Math.random()).toString();function ta(t,e,n,r,i,o,s){var a=Cn(e+n);Dn(a,"key",t.c),s&&Dn(a,"cb",w().toString());var u="GET"==r;if(u)for(var c in i)i.hasOwnProperty(c)&&Dn(a,c,i[c]);return new me(function(e,n){Js(t,a.toString(),function(t){t?t.error?n(Xa(t,o||{})):e(t):n(new E("network-request-failed"));},r,u?void 0:Jn(xr(i)),t.a,t.i.get());});}function ea(t){if("string"!=typeof(t=t.email)||!cr.test(t))throw new E("invalid-email");}function na(t){"email"in t&&ea(t);}function ra(t){if(!t[Gs]){if(t.mfaPendingCredential)throw new E("multi-factor-auth-required",null,ft(t));throw new E("internal-error");}}function ia(t){if(t.phoneNumber||t.temporaryProof){if(!t.phoneNumber||!t.temporaryProof)throw new E("internal-error");}else {if(!t.sessionInfo)throw new E("missing-verification-id");if(!t.code)throw new E("missing-verification-code");}}Bs.prototype.s=function(t,e,n,r,i){var o=this;zs.then(function(){window.gapi.client.setApiKey(o.c);var s=window.gapi.auth.getToken();window.gapi.auth.setToken(null),window.gapi.client.request({path:t,method:n,body:r,headers:i,authType:"none",callback:function(t){window.gapi.auth.setToken(s),e&&e(t);}});}).o(function(t){e&&e({error:{message:t&&t.message||"CORS_UNSUPPORTED"}});});},Bs.prototype.vb=function(){return Ka(this,La,{});},Bs.prototype.xb=function(t,e){return Ka(this,Ca,{idToken:t,email:e});},Bs.prototype.yb=function(t,e){return Ka(this,Pa,{idToken:t,password:e});};var oa={displayName:"DISPLAY_NAME",photoUrl:"PHOTO_URL"};function sa(t){if(!t.phoneVerificationInfo)throw new E("internal-error");if(!t.phoneVerificationInfo.sessionInfo)throw new E("missing-verification-id");if(!t.phoneVerificationInfo.code)throw new E("missing-verification-code");}function aa(t){if(!t.requestUri||!t.sessionId&&!t.postBody&&!t.pendingToken)throw new E("internal-error");}function ua(t,e){return e.oauthIdToken&&e.providerId&&0==e.providerId.indexOf("oidc.")&&!e.pendingToken&&(t.sessionId?e.nonce=t.sessionId:t.postBody&&Kn(t=new zn(t.postBody),"nonce")&&(e.nonce=t.get("nonce"))),e;}function ca(t){var e=null;if(t.needConfirmation?(t.code="account-exists-with-different-credential",e=Fo(t)):"FEDERATED_USER_ID_ALREADY_LINKED"==t.errorMessage?(t.code="credential-already-in-use",e=Fo(t)):"EMAIL_EXISTS"==t.errorMessage?(t.code="email-already-in-use",e=Fo(t)):t.errorMessage&&(e=Ya(t.errorMessage)),e)throw e;ra(t);}function ha(t,e){return e.returnIdpCredential=!0,Ka(t,Va,e);}function la(t,e){return e.returnIdpCredential=!0,Ka(t,Fa,e);}function fa(t,e){return e.returnIdpCredential=!0,e.autoCreate=!1,Ka(t,Ua,e);}function pa(t){if(!t.oobCode)throw new E("invalid-action-code");}(t=Bs.prototype).zb=function(t,e){var n={idToken:t},r=[];return ht(oa,function(t,i){var o=e[i];null===o?r.push(t):i in e&&(n[i]=o);}),r.length&&(n.deleteAttribute=r),Ka(this,Ca,n);},t.rb=function(t,e){return dt(t={requestType:"PASSWORD_RESET",email:t},e),Ka(this,Sa,t);},t.sb=function(t,e){return dt(t={requestType:"EMAIL_SIGNIN",email:t},e),Ka(this,Aa,t);},t.qb=function(t,e){return dt(t={requestType:"VERIFY_EMAIL",idToken:t},e),Ka(this,ka,t);},t.Ab=function(t,e,n){return dt(t={requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:t,newEmail:e},n),Ka(this,Na,t);},t.cb=function(t){return Ka(this,za,t);},t.jb=function(t,e){return Ka(this,Da,{oobCode:t,newPassword:e});},t.Pa=function(t){return Ka(this,va,{oobCode:t});},t.fb=function(t){return Ka(this,da,{oobCode:t});};var da={endpoint:"setAccountInfo",A:pa,Y:"email",C:!0},va={endpoint:"resetPassword",A:pa,G:function(t){var e=t.requestType;if(!e||!t.email&&"EMAIL_SIGNIN"!=e&&"VERIFY_AND_CHANGE_EMAIL"!=e)throw new E("internal-error");},C:!0},ya={endpoint:"signupNewUser",A:function(t){if(ea(t),!t.password)throw new E("weak-password");},G:ra,U:!0,C:!0},ma={endpoint:"createAuthUri",C:!0},ga={endpoint:"deleteAccount",M:["idToken"]},ba={endpoint:"setAccountInfo",M:["idToken","deleteProvider"],A:function(t){if("array"!=h(t.deleteProvider))throw new E("internal-error");}},wa={endpoint:"emailLinkSignin",M:["email","oobCode"],A:ea,G:ra,U:!0,C:!0},_a={endpoint:"emailLinkSignin",M:["idToken","email","oobCode"],A:ea,G:ra,U:!0},Ea={endpoint:"accounts/mfaEnrollment:finalize",M:["idToken","phoneVerificationInfo"],A:sa,G:ra,C:!0,La:!0},Ia={endpoint:"accounts/mfaSignIn:finalize",M:["mfaPendingCredential","phoneVerificationInfo"],A:sa,G:ra,C:!0,La:!0},Ta={endpoint:"getAccountInfo"},Aa={endpoint:"getOobConfirmationCode",M:["requestType"],A:function(t){if("EMAIL_SIGNIN"!=t.requestType)throw new E("internal-error");ea(t);},Y:"email",C:!0},ka={endpoint:"getOobConfirmationCode",M:["idToken","requestType"],A:function(t){if("VERIFY_EMAIL"!=t.requestType)throw new E("internal-error");},Y:"email",C:!0},Na={endpoint:"getOobConfirmationCode",M:["idToken","newEmail","requestType"],A:function(t){if("VERIFY_AND_CHANGE_EMAIL"!=t.requestType)throw new E("internal-error");},Y:"email",C:!0},Sa={endpoint:"getOobConfirmationCode",M:["requestType"],A:function(t){if("PASSWORD_RESET"!=t.requestType)throw new E("internal-error");ea(t);},Y:"email",C:!0},xa={hb:!0,endpoint:"getProjectConfig",Rb:"GET"},Oa={hb:!0,endpoint:"getRecaptchaParam",Rb:"GET",G:function(t){if(!t.recaptchaSiteKey)throw new E("internal-error");}},Da={endpoint:"resetPassword",A:pa,Y:"email",C:!0},Ra={endpoint:"sendVerificationCode",M:["phoneNumber","recaptchaToken"],Y:"sessionInfo",C:!0},Ca={endpoint:"setAccountInfo",M:["idToken"],A:na,U:!0},Pa={endpoint:"setAccountInfo",M:["idToken"],A:function(t){if(na(t),!t.password)throw new E("weak-password");},G:ra,U:!0},La={endpoint:"signupNewUser",G:ra,U:!0,C:!0},Ma={endpoint:"accounts/mfaEnrollment:start",M:["idToken","phoneEnrollmentInfo"],A:function(t){if(!t.phoneEnrollmentInfo)throw new E("internal-error");if(!t.phoneEnrollmentInfo.phoneNumber)throw new E("missing-phone-number");if(!t.phoneEnrollmentInfo.recaptchaToken)throw new E("missing-app-credential");},G:function(t){if(!t.phoneSessionInfo||!t.phoneSessionInfo.sessionInfo)throw new E("internal-error");},C:!0,La:!0},ja={endpoint:"accounts/mfaSignIn:start",M:["mfaPendingCredential","mfaEnrollmentId","phoneSignInInfo"],A:function(t){if(!t.phoneSignInInfo||!t.phoneSignInInfo.recaptchaToken)throw new E("missing-app-credential");},G:function(t){if(!t.phoneResponseInfo||!t.phoneResponseInfo.sessionInfo)throw new E("internal-error");},C:!0,La:!0},Va={endpoint:"verifyAssertion",A:aa,Wa:ua,G:ca,U:!0,C:!0},Ua={endpoint:"verifyAssertion",A:aa,Wa:ua,G:function(t){if(t.errorMessage&&"USER_NOT_FOUND"==t.errorMessage)throw new E("user-not-found");if(t.errorMessage)throw Ya(t.errorMessage);ra(t);},U:!0,C:!0},Fa={endpoint:"verifyAssertion",A:function(t){if(aa(t),!t.idToken)throw new E("internal-error");},Wa:ua,G:ca,U:!0},qa={endpoint:"verifyCustomToken",A:function(t){if(!t.token)throw new E("invalid-custom-token");},G:ra,U:!0,C:!0},Ba={endpoint:"verifyPassword",A:function(t){if(ea(t),!t.password)throw new E("wrong-password");},G:ra,U:!0,C:!0},za={endpoint:"verifyPhoneNumber",A:ia,G:ra,C:!0},Ga={endpoint:"verifyPhoneNumber",A:function(t){if(!t.idToken)throw new E("internal-error");ia(t);},G:function(t){if(t.temporaryProof)throw t.code="credential-already-in-use",Fo(t);ra(t);}},Wa={Eb:{USER_NOT_FOUND:"user-not-found"},endpoint:"verifyPhoneNumber",A:ia,G:ra,C:!0},Ha={endpoint:"accounts/mfaEnrollment:withdraw",M:["idToken","mfaEnrollmentId"],G:function(t){if(!!t[Gs]^!!t.refreshToken)throw new E("internal-error");},C:!0,La:!0};function Ka(t,e,n){if(!function(t,e){if(!e||!e.length)return !0;if(!t)return !1;for(var n=0;n<e.length;n++){var r=t[e[n]];if(null==r||""===r)return !1;}return !0;}(n,e.M))return Ae(new E("internal-error"));var r,i=!!e.La,o=e.Rb||"POST";return Te(n).then(e.A).then(function(){return e.U&&(n.returnSecureToken=!0),e.C&&t.b&&void 0===n.tenantId&&(n.tenantId=t.b),ta(t,i?t.l:t.h,e.endpoint,o,n,e.Eb,e.hb||!1);}).then(function(t){return r=t,e.Wa?e.Wa(n,r):r;}).then(e.G).then(function(){if(!e.Y)return r;if(!(e.Y in r))throw new E("internal-error");return r[e.Y];});}function Ya(t){return Xa({error:{errors:[{message:t}],code:400,message:t}});}function Xa(t,e){var n=(t.error&&t.error.errors&&t.error.errors[0]||{}).reason||"",r={keyInvalid:"invalid-api-key",ipRefererBlocked:"app-not-authorized"};if(n=r[n]?new E(r[n]):null)return n;for(var i in n=t.error&&t.error.message||"",dt(r={INVALID_CUSTOM_TOKEN:"invalid-custom-token",CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_EMAIL:"invalid-email",INVALID_PASSWORD:"wrong-password",USER_DISABLED:"user-disabled",MISSING_PASSWORD:"internal-error",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_OR_INVALID_NONCE:"missing-or-invalid-nonce",INVALID_MESSAGE_PAYLOAD:"invalid-message-payload",INVALID_RECIPIENT_EMAIL:"invalid-recipient-email",INVALID_SENDER:"invalid-sender",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",INVALID_PROVIDER_ID:"invalid-provider-id",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",CORS_UNSUPPORTED:"cors-unsupported",DYNAMIC_LINK_NOT_ACTIVATED:"dynamic-link-not-activated",INVALID_APP_ID:"invalid-app-id",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",WEAK_PASSWORD:"weak-password",OPERATION_NOT_ALLOWED:"operation-not-allowed",USER_CANCELLED:"user-cancelled",CAPTCHA_CHECK_FAILED:"captcha-check-failed",INVALID_APP_CREDENTIAL:"invalid-app-credential",INVALID_CODE:"invalid-verification-code",INVALID_PHONE_NUMBER:"invalid-phone-number",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_APP_CREDENTIAL:"missing-app-credential",MISSING_CODE:"missing-verification-code",MISSING_PHONE_NUMBER:"missing-phone-number",MISSING_SESSION_INFO:"missing-verification-id",QUOTA_EXCEEDED:"quota-exceeded",SESSION_EXPIRED:"code-expired",REJECTED_CREDENTIAL:"rejected-credential",INVALID_CONTINUE_URI:"invalid-continue-uri",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",MISSING_IOS_BUNDLE_ID:"missing-ios-bundle-id",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_DYNAMIC_LINK_DOMAIN:"invalid-dynamic-link-domain",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",INVALID_CERT_HASH:"invalid-cert-hash",UNSUPPORTED_TENANT_OPERATION:"unsupported-tenant-operation",INVALID_TENANT_ID:"invalid-tenant-id",TENANT_ID_MISMATCH:"tenant-id-mismatch",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",EMAIL_CHANGE_NEEDS_VERIFICATION:"email-change-needs-verification",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",UNSUPPORTED_FIRST_FACTOR:"unsupported-first-factor",UNVERIFIED_EMAIL:"unverified-email"},e||{}),e=(e=n.match(/^[^\s]+\s*:\s*([\s\S]*)$/))&&1<e.length?e[1]:void 0,r)if(0===n.indexOf(i))return new E(r[i],e);return !e&&t&&(e=Sr(t)),new E("internal-error",e);}function Qa(t){this.b=t,this.a=null,this.nb=function(t){return (tu||(tu=new me(function(t,e){function n(){Cr(),Er("gapi.load")("gapi.iframes",{callback:t,ontimeout:function(){Cr(),e(Error("Network Error"));},timeout:$a.get()});}if(Er("gapi.iframes.Iframe"))t();else if(Er("gapi.load"))n();else {var r="__iframefcb"+Math.floor(1e6*Math.random()).toString();s[r]=function(){Er("gapi.load")?n():e(Error("Network Error"));},Te(Ls(r=It(Ja,{onload:r}))).o(function(){e(Error("Network Error"));});}}).o(function(t){throw tu=null,t;}))).then(function(){return new me(function(e,n){Er("gapi.iframes.getContext")().open({where:document.body,url:t.b,messageHandlersFilter:Er("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"),attributes:{style:{position:"absolute",top:"-100px",width:"1px",height:"1px"}},dontclear:!0},function(r){function i(){clearTimeout(o),e();}t.a=r,t.a.restyle({setHideOnLeave:!1});var o=setTimeout(function(){n(Error("Network Error"));},Za.get());r.ping(i).then(i,function(){n(Error("Network Error"));});});});});}(this);}var Ja=new yt(bt,"https://apis.google.com/js/api.js?onload=%{onload}"),$a=new Pr(3e4,6e4),Za=new Pr(5e3,15e3),tu=null;function eu(t,e,n){this.i=t,this.g=e,this.h=n,this.f=null,this.a=Pn(this.i,"/__/auth/iframe"),Dn(this.a,"apiKey",this.g),Dn(this.a,"appName",this.h),this.b=null,this.c=[];}function nu(t,e,n,r,i){this.s=t,this.m=e,this.c=n,this.u=r,this.i=this.g=this.l=null,this.a=i,this.h=this.f=null;}function ru(t){try{return I.app(t).auth().Ea();}catch(t){return [];}}function iu(t,e,n,r,i){this.u=t,this.f=e,this.b=n,this.c=r||null,this.h=i||null,this.m=this.s=this.w=null,this.g=[],this.l=this.a=null;}function ou(t){var e=rr();return function(t){return Ka(t,xa,{}).then(function(t){return t.authorizedDomains||[];});}(t).then(function(t){t:{var n=Cn(e),r=n.f;n=n.b;for(var i=0;i<t.length;i++){var o=t[i],s=n,a=r;if(0==o.indexOf("chrome-extension://")?s=Cn(o).b==s&&"chrome-extension"==a:"http"!=a&&"https"!=a?s=!1:ur.test(o)?s=s==o:(o=o.split(".").join("\\."),s=new RegExp("^(.+\\."+o+"|"+o+")$","i").test(s)),s){t=!0;break t;}}t=!1;}if(!t)throw new Vo(rr());});}function su(t){return t.l||(t.l=hr().then(function(){if(!t.s){var e=t.c,n=t.h,r=ru(t.b),i=new eu(t.u,t.f,t.b);i.f=e,i.b=n,i.c=X(r||[]),t.s=i.toString();}t.i=new Qa(t.s),function(t){if(!t.i)throw Error("IfcHandler must be initialized!");!function(t,e){t.nb.then(function(){t.a.register("authEvent",e,Er("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"));});}(t.i,function(e){var n={};if(e&&e.authEvent){var r=!1;for(e=Po(e.authEvent),n=0;n<t.g.length;n++)r=t.g[n](e)||r;return (n={}).status=r?"ACK":"ERROR",Te(n);}return n.status="ERROR",Te(n);});}(t);})),t.l;}function au(t){return t.m||(t.w=t.c?wr(t.c,ru(t.b)):null,t.m=new Bs(t.f,x(t.h),t.w)),t.m;}function uu(t,e,n,r,i,o,s,a,u,c,h){return (t=new nu(t,e,n,r,i)).l=o,t.g=s,t.i=a,t.b=ft(u||null),t.f=c,t.ub(h).toString();}function cu(t){if(this.a=t||I.INTERNAL.reactNative&&I.INTERNAL.reactNative.AsyncStorage,!this.a)throw new E("internal-error","The React Native compatibility library was not found.");this.type="asyncStorage";}function hu(t){this.b=t,this.a={},this.f=g(this.c,this);}eu.prototype.toString=function(){return this.f?Dn(this.a,"v",this.f):Hn(this.a.a,"v"),this.b?Dn(this.a,"eid",this.b):Hn(this.a.a,"eid"),this.c.length?Dn(this.a,"fw",this.c.join(",")):Hn(this.a.a,"fw"),this.a.toString();},nu.prototype.ub=function(t){return this.h=t,this;},nu.prototype.toString=function(){var t=Pn(this.s,"/__/auth/handler");if(Dn(t,"apiKey",this.m),Dn(t,"appName",this.c),Dn(t,"authType",this.u),this.a.isOAuthProvider){var e=this.a;try{var n=I.app(this.c).auth().ja();}catch(t){n=null;}for(var r in e.kb=n,Dn(t,"providerId",this.a.providerId),n=xr((e=this.a).Fb))n[r]=n[r].toString();r=e.Oc,n=ft(n);for(var i=0;i<r.length;i++){var o=r[i];o in n&&delete n[o];}e.lb&&e.kb&&!n[e.lb]&&(n[e.lb]=e.kb),lt(n)||Dn(t,"customParameters",Sr(n));}if("function"==typeof this.a.Nb&&(e=this.a.Nb()).length&&Dn(t,"scopes",e.join(",")),this.l?Dn(t,"redirectUrl",this.l):Hn(t.a,"redirectUrl"),this.g?Dn(t,"eventId",this.g):Hn(t.a,"eventId"),this.i?Dn(t,"v",this.i):Hn(t.a,"v"),this.b)for(var s in this.b)this.b.hasOwnProperty(s)&&!Rn(t,s)&&Dn(t,s,this.b[s]);return this.h?Dn(t,"tid",this.h):Hn(t.a,"tid"),this.f?Dn(t,"eid",this.f):Hn(t.a,"eid"),(s=ru(this.c)).length&&Dn(t,"fw",s.join(",")),t.toString();},(t=iu.prototype).Lb=function(t,e,n){var r=new E("popup-closed-by-user"),i=new E("web-storage-unsupported"),o=this,s=!1;return this.ka().then(function(){(function(t){var e={type:"webStorageSupport"};return su(t).then(function(){return function(t,e){return t.nb.then(function(){return new me(function(n){t.a.send(e.type,e,n,Er("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"));});});}(t.i,e);}).then(function(t){if(t&&t.length&&void 0!==t[0].webStorageSupport)return t[0].webStorageSupport;throw Error();});})(o).then(function(n){n||(t&&sr(t),e(i),s=!0);});}).o(function(){}).then(function(){if(!s)return function(t){return new me(function(e){return function n(){wn(2e3).then(function(){if(t&&!t.closed)return n();e();});}();});}(t);}).then(function(){if(!s)return wn(n).then(function(){e(r);});});},t.Ub=function(){var t=_r();return !Nr(t)&&!Rr(t);},t.Qb=function(){return !1;},t.Jb=function(t,e,n,r,i,o,s,a){if(!t)return Ae(new E("popup-blocked"));if(s&&!Nr())return this.ka().o(function(e){sr(t),i(e);}),r(),Te();this.a||(this.a=ou(au(this)));var u=this;return this.a.then(function(){var e=u.ka().o(function(e){throw sr(t),i(e),e;});return r(),e;}).then(function(){(Ro(n),s)||ir(uu(u.u,u.f,u.b,e,n,null,o,u.c,void 0,u.h,a),t);}).o(function(t){throw "auth/network-request-failed"==t.code&&(u.a=null),t;});},t.Kb=function(t,e,n,r){this.a||(this.a=ou(au(this)));var i=this;return this.a.then(function(){Ro(e),ir(uu(i.u,i.f,i.b,t,e,rr(),n,i.c,void 0,i.h,r));}).o(function(t){throw "auth/network-request-failed"==t.code&&(i.a=null),t;});},t.ka=function(){var t=this;return su(this).then(function(){return t.i.nb;}).o(function(){throw t.a=null,new E("network-request-failed");});},t.Xb=function(){return !0;},t.Ca=function(t){this.g.push(t);},t.Qa=function(t){K(this.g,function(e){return e==t;});},(t=cu.prototype).get=function(t){return Te(this.a.getItem(t)).then(function(t){return t&&Or(t);});},t.set=function(t,e){return Te(this.a.setItem(t,Sr(e)));},t.T=function(t){return Te(this.a.removeItem(t));},t.ba=function(){},t.ha=function(){};var lu,fu=[];function pu(t,e,n){lt(t.a)&&t.b.addEventListener("message",t.f),void 0===t.a[e]&&(t.a[e]=[]),t.a[e].push(n);}function du(t){this.a=t;}function vu(t){this.c=t,this.b=!1,this.a=[];}function yu(t,e,n,r){var i,o,s,a,u=n||{},c=null;if(t.b)return Ae(Error("connection_unavailable"));var h=r?800:50,l="undefined"!=typeof MessageChannel?new MessageChannel():null;return new me(function(n,r){l?(i=Math.floor(Math.random()*Math.pow(10,20)).toString(),l.port1.start(),s=setTimeout(function(){r(Error("unsupported_event"));},h),c={messageChannel:l,onMessage:o=function(t){t.data.eventId===i&&("ack"===t.data.status?(clearTimeout(s),a=setTimeout(function(){r(Error("timeout"));},3e3)):"done"===t.data.status?(clearTimeout(a),void 0!==t.data.response?n(t.data.response):r(Error("unknown_error"))):(clearTimeout(s),clearTimeout(a),r(Error("invalid_response"))));}},t.a.push(c),l.port1.addEventListener("message",o),t.c.postMessage({eventType:e,eventId:i,data:u},[l.port2])):r(Error("connection_unavailable"));}).then(function(e){return mu(t,c),e;}).o(function(e){throw mu(t,c),e;});}function mu(t,e){if(e){var n=e.messageChannel,r=e.onMessage;n&&(n.port1.removeEventListener("message",r),n.port1.close()),K(t.a,function(t){return t==e;});}}function gu(){if(!_u())throw new E("web-storage-unsupported");this.c={},this.a=[],this.b=0,this.u=s.indexedDB,this.type="indexedDB",this.g=this.l=this.f=this.i=null,this.s=!1,this.h=null;var t=this;pr()&&self?(this.l=function(){var t=pr()?self:null;if(q(fu,function(n){n.b==t&&(e=n);}),!e){var e=new hu(t);fu.push(e);}return e;}(),pu(this.l,"keyChanged",function(e,n){return ku(t).then(function(e){return 0<e.length&&q(t.a,function(t){t(e);}),{keyProcessed:W(e,n.key)};});}),pu(this.l,"ping",function(){return Te(["keyChanged"]);})):function(){var t=s.navigator;return t&&t.serviceWorker?Te().then(function(){return t.serviceWorker.ready;}).then(function(t){return t.active||null;}).o(function(){return null;}):Te(null);}().then(function(e){(t.h=e)&&(t.g=new vu(new du(e)),yu(t.g,"ping",null,!0).then(function(e){e[0].fulfilled&&W(e[0].value,"keyChanged")&&(t.s=!0);}).o(function(){}));});}function bu(t){return new me(function(e,n){var r=t.u.open("firebaseLocalStorageDb",1);r.onerror=function(t){try{t.preventDefault();}catch(t){}n(Error(t.target.error));},r.onupgradeneeded=function(t){t=t.target.result;try{t.createObjectStore("firebaseLocalStorage",{keyPath:"fbase_key"});}catch(t){n(t);}},r.onsuccess=function(r){(r=r.target.result).objectStoreNames.contains("firebaseLocalStorage")?e(r):function(t){return new me(function(e,n){var r=t.u.deleteDatabase("firebaseLocalStorageDb");r.onsuccess=function(){e();},r.onerror=function(t){n(Error(t.target.error));};});}(t).then(function(){return bu(t);}).then(function(t){e(t);}).o(function(t){n(t);});};});}function wu(t){return t.m||(t.m=bu(t)),t.m;}function _u(){try{return !!s.indexedDB;}catch(t){return !1;}}function Eu(t){return t.objectStore("firebaseLocalStorage");}function Iu(t,e){return t.transaction(["firebaseLocalStorage"],e?"readwrite":"readonly");}function Tu(t){return new me(function(e,n){t.onsuccess=function(t){t&&t.target?e(t.target.result):e();},t.onerror=function(t){n(t.target.error);};});}function Au(t,e){return t.g&&t.h&&function(){var t=s.navigator;return t&&t.serviceWorker&&t.serviceWorker.controller||null;}()===t.h?yu(t.g,"keyChanged",{key:e},t.s).then(function(){}).o(function(){}):Te();}function ku(t){return wu(t).then(function(t){var e=Eu(Iu(t,!1));return e.getAll?Tu(e.getAll()):new me(function(t,n){var r=[],i=e.openCursor();i.onsuccess=function(e){(e=e.target.result)?(r.push(e.value),e.continue()):t(r);},i.onerror=function(t){n(t.target.error);};});}).then(function(e){var n={},r=[];if(0==t.b){for(r=0;r<e.length;r++)n[e[r].fbase_key]=e[r].value;r=function t(e,n){var r,i=[];for(r in e)r in n?typeof e[r]!=typeof n[r]?i.push(r):"object"==typeof e[r]&&null!=e[r]&&null!=n[r]?0<t(e[r],n[r]).length&&i.push(r):e[r]!==n[r]&&i.push(r):i.push(r);for(r in n)r in e||i.push(r);return i;}(t.c,n),t.c=n;}return r;});}function Nu(t){t.i&&t.i.cancel("STOP_EVENT"),t.f&&(clearTimeout(t.f),t.f=null);}function Su(t){var e=this,n=null;this.a=[],this.type="indexedDB",this.c=t,this.b=Te().then(function(){if(_u()){var t=Dr(),r="__sak"+t;return lu||(lu=new gu()),(n=lu).set(r,t).then(function(){return n.get(r);}).then(function(e){if(e!==t)throw Error("indexedDB not supported!");return n.T(r);}).then(function(){return n;}).o(function(){return e.c;});}return e.c;}).then(function(t){return e.type=t.type,t.ba(function(t){q(e.a,function(e){e(t);});}),t;});}function xu(){this.a={},this.type="inMemory";}function Ou(){if(!function(){var t="Node"==dr();if(!(t=Du()||t&&I.INTERNAL.node&&I.INTERNAL.node.localStorage))return !1;try{return t.setItem("__sak","1"),t.removeItem("__sak"),!0;}catch(t){return !1;}}()){if("Node"==dr())throw new E("internal-error","The LocalStorage compatibility library was not found.");throw new E("web-storage-unsupported");}this.a=Du()||I.INTERNAL.node.localStorage,this.type="localStorage";}function Du(){try{var t=s.localStorage,e=Dr();return t&&(t.setItem(e,"1"),t.removeItem(e)),t;}catch(t){return null;}}function Ru(){this.type="nullStorage";}function Cu(){if(!function(){var t="Node"==dr();if(!(t=Pu()||t&&I.INTERNAL.node&&I.INTERNAL.node.sessionStorage))return !1;try{return t.setItem("__sak","1"),t.removeItem("__sak"),!0;}catch(t){return !1;}}()){if("Node"==dr())throw new E("internal-error","The SessionStorage compatibility library was not found.");throw new E("web-storage-unsupported");}this.a=Pu()||I.INTERNAL.node.sessionStorage,this.type="sessionStorage";}function Pu(){try{var t=s.sessionStorage,e=Dr();return t&&(t.setItem(e,"1"),t.removeItem(e)),t;}catch(t){return null;}}function Lu(){var t={};t.Browser=Vu,t.Node=Uu,t.ReactNative=Fu,t.Worker=qu,this.a=t[dr()];}hu.prototype.c=function(t){var e=t.data.eventType,n=t.data.eventId,r=this.a[e];if(r&&0<r.length){t.ports[0].postMessage({status:"ack",eventId:n,eventType:e,response:null});var i=[];q(r,function(e){i.push(Te().then(function(){return e(t.origin,t.data.data);}));}),Ne(i).then(function(r){var i=[];q(r,function(t){i.push({fulfilled:t.Mb,value:t.value,reason:t.reason?t.reason.message:void 0});}),q(i,function(t){for(var e in t)void 0===t[e]&&delete t[e];}),t.ports[0].postMessage({status:"done",eventId:n,eventType:e,response:i});});}},du.prototype.postMessage=function(t,e){this.a.postMessage(t,e);},vu.prototype.close=function(){for(;0<this.a.length;)mu(this,this.a[0]);this.b=!0;},(t=gu.prototype).set=function(t,e){var n,r=!1,i=this;return wu(this).then(function(e){return Tu((e=Eu(Iu(n=e,!0))).get(t));}).then(function(o){var s=Eu(Iu(n,!0));return o?(o.value=e,Tu(s.put(o))):(i.b++,r=!0,(o={}).fbase_key=t,o.value=e,Tu(s.add(o)));}).then(function(){return i.c[t]=e,Au(i,t);}).ma(function(){r&&i.b--;});},t.get=function(t){return wu(this).then(function(e){return Tu(Eu(Iu(e,!1)).get(t));}).then(function(t){return t&&t.value;});},t.T=function(t){var e=!1,n=this;return wu(this).then(function(r){return e=!0,n.b++,Tu(Eu(Iu(r,!0)).delete(t));}).then(function(){return delete n.c[t],Au(n,t);}).ma(function(){e&&n.b--;});},t.ba=function(t){0==this.a.length&&function(t){Nu(t),function e(){t.f=setTimeout(function(){t.i=ku(t).then(function(e){0<e.length&&q(t.a,function(t){t(e);});}).then(function(){e();}).o(function(t){"STOP_EVENT"!=t.message&&e();});},800);}();}(this),this.a.push(t);},t.ha=function(t){K(this.a,function(e){return e==t;}),0==this.a.length&&Nu(this);},(t=Su.prototype).get=function(t){return this.b.then(function(e){return e.get(t);});},t.set=function(t,e){return this.b.then(function(n){return n.set(t,e);});},t.T=function(t){return this.b.then(function(e){return e.T(t);});},t.ba=function(t){this.a.push(t);},t.ha=function(t){K(this.a,function(e){return e==t;});},(t=xu.prototype).get=function(t){return Te(this.a[t]);},t.set=function(t,e){return this.a[t]=e,Te();},t.T=function(t){return delete this.a[t],Te();},t.ba=function(){},t.ha=function(){},(t=Ou.prototype).get=function(t){var e=this;return Te().then(function(){return Or(e.a.getItem(t));});},t.set=function(t,e){var n=this;return Te().then(function(){var r=Sr(e);null===r?n.T(t):n.a.setItem(t,r);});},t.T=function(t){var e=this;return Te().then(function(){e.a.removeItem(t);});},t.ba=function(t){s.window&&nn(s.window,"storage",t);},t.ha=function(t){s.window&&sn(s.window,"storage",t);},(t=Ru.prototype).get=function(){return Te(null);},t.set=function(){return Te();},t.T=function(){return Te();},t.ba=function(){},t.ha=function(){},(t=Cu.prototype).get=function(t){var e=this;return Te().then(function(){return Or(e.a.getItem(t));});},t.set=function(t,e){var n=this;return Te().then(function(){var r=Sr(e);null===r?n.T(t):n.a.setItem(t,r);});},t.T=function(t){var e=this;return Te().then(function(){e.a.removeItem(t);});},t.ba=function(){},t.ha=function(){};var Mu,ju,Vu={F:Ou,$a:Cu},Uu={F:Ou,$a:Cu},Fu={F:cu,$a:Ru},qu={F:Ou,$a:Ru},Bu={od:"local",NONE:"none",qd:"session"};function zu(){var t=!(Rr(_r())||!fr()),e=Nr(),n=Ir();this.m=t,this.h=e,this.l=n,this.a={},Mu||(Mu=new Lu()),t=Mu;try{this.g=!nr()&&jr()||!s.indexedDB?new t.a.F():new Su(pr()?new xu():new t.a.F());}catch(t){this.g=new xu(),this.h=!0;}try{this.i=new t.a.$a();}catch(t){this.i=new xu();}this.u=new xu(),this.f=g(this.Vb,this),this.b={};}function Gu(){return ju||(ju=new zu()),ju;}function Wu(t,e){switch(e){case"session":return t.i;case"none":return t.u;default:return t.g;}}function Hu(t,e){return "firebase:"+t.name+(e?":"+e:"");}function Ku(t,e,n){return n=Hu(e,n),"local"==e.F&&(t.b[n]=null),Wu(t,e.F).T(n);}function Yu(t){t.c&&(clearInterval(t.c),t.c=null);}function Xu(t){this.a=t,this.b=Gu();}(t=zu.prototype).get=function(t,e){return Wu(this,t.F).get(Hu(t,e));},t.set=function(t,e,n){var r=Hu(t,n),i=this,o=Wu(this,t.F);return o.set(r,e).then(function(){return o.get(r);}).then(function(e){"local"==t.F&&(i.b[r]=e);});},t.addListener=function(t,e,n){t=Hu(t,e),this.l&&(this.b[t]=s.localStorage.getItem(t)),lt(this.a)&&(Wu(this,"local").ba(this.f),this.h||(nr()||!jr())&&s.indexedDB||!this.l||function(t){Yu(t),t.c=setInterval(function(){for(var e in t.a){var n=s.localStorage.getItem(e),r=t.b[e];n!=r&&(t.b[e]=n,n=new We({type:"storage",key:e,target:window,oldValue:r,newValue:n,a:!0}),t.Vb(n));}},1e3);}(this)),this.a[t]||(this.a[t]=[]),this.a[t].push(n);},t.removeListener=function(t,e,n){t=Hu(t,e),this.a[t]&&(K(this.a[t],function(t){return t==n;}),0==this.a[t].length&&delete this.a[t]),lt(this.a)&&(Wu(this,"local").ha(this.f),Yu(this));},t.Vb=function(t){if(t&&t.f){var e=t.a.key;if(null==e)for(var n in this.a){var r=this.b[n];void 0===r&&(r=null);var i=s.localStorage.getItem(n);i!==r&&(this.b[n]=i,this.ib(n));}else if(0==e.indexOf("firebase:")&&this.a[e]){if(void 0!==t.a.a?Wu(this,"local").ha(this.f):Yu(this),this.m)if(n=s.localStorage.getItem(e),(r=t.a.newValue)!==n)null!==r?s.localStorage.setItem(e,r):s.localStorage.removeItem(e);else if(this.b[e]===r&&void 0===t.a.a)return;var o=this;n=function(){void 0===t.a.a&&o.b[e]===s.localStorage.getItem(e)||(o.b[e]=s.localStorage.getItem(e),o.ib(e));},Gt&&Zt&&10==Zt&&s.localStorage.getItem(e)!==t.a.newValue&&t.a.newValue!==t.a.oldValue?setTimeout(n,10):n();}}else q(t,g(this.ib,this));},t.ib=function(t){this.a[t]&&q(this.a[t],function(t){t();});};var Qu,Ju={name:"authEvent",F:"local"};function $u(){this.a=Gu();}function Zu(t,e){this.b=tc,this.f=s.Uint8Array?new Uint8Array(this.b):Array(this.b),this.g=this.c=0,this.a=[],this.i=t,this.h=e,this.l=s.Int32Array?new Int32Array(64):Array(64),void 0===Qu&&(Qu=s.Int32Array?new Int32Array(ac):ac),this.reset();}_(Zu,function(){this.b=-1;});for(var tc=64,ec=tc-1,nc=[],rc=0;rc<ec;rc++)nc[rc]=0;var ic=Y(128,nc);function oc(t){for(var e=t.f,n=t.l,r=0,i=0;i<e.length;)n[r++]=e[i]<<24|e[i+1]<<16|e[i+2]<<8|e[i+3],i=4*r;for(e=16;64>e;e++){i=0|n[e-15],r=0|n[e-2];var o=(0|n[e-16])+((i>>>7|i<<25)^(i>>>18|i<<14)^i>>>3)|0,s=(0|n[e-7])+((r>>>17|r<<15)^(r>>>19|r<<13)^r>>>10)|0;n[e]=o+s|0;}r=0|t.a[0],i=0|t.a[1];var a=0|t.a[2],u=0|t.a[3],c=0|t.a[4],h=0|t.a[5],l=0|t.a[6];for(o=0|t.a[7],e=0;64>e;e++){var f=((r>>>2|r<<30)^(r>>>13|r<<19)^(r>>>22|r<<10))+(r&i^r&a^i&a)|0;s=(o=o+((c>>>6|c<<26)^(c>>>11|c<<21)^(c>>>25|c<<7))|0)+((s=(s=c&h^~c&l)+(0|Qu[e])|0)+(0|n[e])|0)|0,o=l,l=h,h=c,c=u+s|0,u=a,a=i,i=r,r=s+f|0;}t.a[0]=t.a[0]+r|0,t.a[1]=t.a[1]+i|0,t.a[2]=t.a[2]+a|0,t.a[3]=t.a[3]+u|0,t.a[4]=t.a[4]+c|0,t.a[5]=t.a[5]+h|0,t.a[6]=t.a[6]+l|0,t.a[7]=t.a[7]+o|0;}function sc(t,e,n){void 0===n&&(n=e.length);var r=0,i=t.c;if("string"==typeof e)for(;r<n;)t.f[i++]=e.charCodeAt(r++),i==t.b&&(oc(t),i=0);else {if(!l(e))throw Error("message must be string or array");for(;r<n;){var o=e[r++];if(!("number"==typeof o&&0<=o&&255>=o&&o==(0|o)))throw Error("message must be a byte array");t.f[i++]=o,i==t.b&&(oc(t),i=0);}}t.c=i,t.g+=n;}Zu.prototype.reset=function(){this.g=this.c=0,this.a=s.Int32Array?new Int32Array(this.h):X(this.h);};var ac=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];function uc(){Zu.call(this,8,cc);}_(uc,Zu);var cc=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];function hc(t,e,n,r,i){this.u=t,this.i=e,this.l=n,this.m=r||null,this.s=i||null,this.h=e+":"+n,this.w=new $u(),this.g=new Xu(this.h),this.f=null,this.b=[],this.a=this.c=null;}function lc(t){return new E("invalid-cordova-configuration",t);}function fc(t){var e=new uc();sc(e,t),t=[];var n=8*e.g;56>e.c?sc(e,ic,56-e.c):sc(e,ic,e.b-(e.c-56));for(var r=63;56<=r;r--)e.f[r]=255&n,n/=256;for(oc(e),r=n=0;r<e.i;r++)for(var i=24;0<=i;i-=8)t[n++]=e.a[r]>>i&255;return function(t){return z(t,function(t){return 1<(t=t.toString(16)).length?t:"0"+t;}).join("");}(t);}function pc(t,e){for(var n=0;n<t.b.length;n++)try{t.b[n](e);}catch(t){}}function dc(t){return t.f||(t.f=t.ka().then(function(){return new me(function(e){t.Ca(function n(r){return e(r),t.Qa(n),!1;}),function(t){function e(e){r=!0,i&&i.cancel(),vc(t).then(function(r){var i=n;if(r&&e&&e.url){var o=null;-1!=(i=Ji(e.url)).indexOf("/__/auth/callback")&&(o=(o="object"==typeof(o=Or(Rn(o=Cn(i),"firebaseError")||null))?T(o):null)?new Co(r.c,r.b,null,null,o,null,r.S()):new Co(r.c,r.b,i,r.f,null,null,r.S())),i=o||n;}pc(t,i);});}var n=new Co("unknown",null,null,null,new E("no-auth-event")),r=!1,i=wn(500).then(function(){return vc(t).then(function(){r||pc(t,n);});}),o=s.handleOpenURL;s.handleOpenURL=function(t){if(0==t.toLowerCase().indexOf(Er("BuildInfo.packageName",s).toLowerCase()+"://")&&e({url:t}),"function"==typeof o)try{o(t);}catch(t){console.error(t);}},jo||(jo=new Lo()),function(t){var e=jo;e.a.push(t),e.b||(e.b=function(t){for(var n=0;n<e.a.length;n++)e.a[n](t);},"function"==typeof(t=Er("universalLinks.subscribe",s))&&t(null,e.b));}(e);}(t);});})),t.f;}function vc(t){var e=null;return function(t){return t.b.get(Ju,t.a).then(function(t){return Po(t);});}(t.g).then(function(n){return e=n,Ku((n=t.g).b,Ju,n.a);}).then(function(){return e;});}function yc(t){this.a=t,this.b=Gu();}(t=hc.prototype).ka=function(){return this.Ga?this.Ga:this.Ga=(lr(void 0)?hr().then(function(){return new me(function(t,e){var n=s.document,r=setTimeout(function(){e(Error("Cordova framework is not ready."));},1e3);n.addEventListener("deviceready",function(){clearTimeout(r),t();},!1);});}):Ae(Error("Cordova must run in an Android or iOS file scheme."))).then(function(){if("function"!=typeof Er("universalLinks.subscribe",s))throw lc("cordova-universal-links-plugin-fix is not installed");if(void 0===Er("BuildInfo.packageName",s))throw lc("cordova-plugin-buildinfo is not installed");if("function"!=typeof Er("cordova.plugins.browsertab.openUrl",s))throw lc("cordova-plugin-browsertab is not installed");if("function"!=typeof Er("cordova.InAppBrowser.open",s))throw lc("cordova-plugin-inappbrowser is not installed");},function(){throw new E("cordova-not-ready");});},t.Lb=function(t,e){return e(new E("operation-not-supported-in-this-environment")),Te();},t.Jb=function(){return Ae(new E("operation-not-supported-in-this-environment"));},t.Xb=function(){return !1;},t.Ub=function(){return !0;},t.Qb=function(){return !0;},t.Kb=function(t,e,n,r){if(this.c)return Ae(new E("redirect-operation-pending"));var i=this,o=s.document,a=null,u=null,c=null,h=null;return this.c=Te().then(function(){return Ro(e),dc(i);}).then(function(){return function(t,e,n,r,i){var o=function(){for(var t=20,e=[];0<t;)e.push("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(62*Math.random()))),t--;return e.join("");}(),a=new Co(e,r,null,o,new E("no-auth-event"),null,i),u=Er("BuildInfo.packageName",s);if("string"!=typeof u)throw new E("invalid-cordova-configuration");var c=Er("BuildInfo.displayName",s),h={};if(_r().toLowerCase().match(/iphone|ipad|ipod/))h.ibi=u;else {if(!_r().toLowerCase().match(/android/))return Ae(new E("operation-not-supported-in-this-environment"));h.apn=u;}c&&(h.appDisplayName=c),o=fc(o),h.sessionId=o;var l=uu(t.u,t.i,t.l,e,n,null,r,t.m,h,t.s,i);return t.ka().then(function(){var e=t.h;return t.w.a.set(Ju,a.v(),e);}).then(function(){var e=Er("cordova.plugins.browsertab.isAvailable",s);if("function"!=typeof e)throw new E("invalid-cordova-configuration");var n=null;e(function(e){if(e){if("function"!=typeof(n=Er("cordova.plugins.browsertab.openUrl",s)))throw new E("invalid-cordova-configuration");n(l);}else {if("function"!=typeof(n=Er("cordova.InAppBrowser.open",s)))throw new E("invalid-cordova-configuration");e=_r(),t.a=n(l,e.match(/(iPad|iPhone|iPod).*OS 7_\d/i)||e.match(/(iPad|iPhone|iPod).*OS 8_\d/i)?"_blank":"_system","location=yes");}});});}(i,t,e,n,r);}).then(function(){return new me(function(t,e){u=function(){var e=Er("cordova.plugins.browsertab.close",s);return t(),"function"==typeof e&&e(),i.a&&"function"==typeof i.a.close&&(i.a.close(),i.a=null),!1;},i.Ca(u),c=function(){a||(a=wn(2e3).then(function(){e(new E("redirect-cancelled-by-user"));}));},h=function(){Lr()&&c();},o.addEventListener("resume",c,!1),_r().toLowerCase().match(/android/)||o.addEventListener("visibilitychange",h,!1);}).o(function(t){return vc(i).then(function(){throw t;});});}).ma(function(){c&&o.removeEventListener("resume",c,!1),h&&o.removeEventListener("visibilitychange",h,!1),a&&a.cancel(),u&&i.Qa(u),i.c=null;});},t.Ca=function(t){this.b.push(t),dc(this).o(function(e){"auth/invalid-cordova-configuration"===e.code&&(e=new Co("unknown",null,null,null,new E("no-auth-event")),t(e));});},t.Qa=function(t){K(this.b,function(e){return e==t;});};var mc={name:"pendingRedirect",F:"session"};function gc(t){return Ku(t.b,mc,t.a);}function bc(t,e,n){this.i={},this.w=0,this.D=t,this.u=e,this.m=n,this.h=[],this.f=!1,this.l=g(this.s,this),this.b=new Cc(),this.B=new Vc(),this.g=new yc(this.u+":"+this.m),this.c={},this.c.unknown=this.b,this.c.signInViaRedirect=this.b,this.c.linkViaRedirect=this.b,this.c.reauthViaRedirect=this.b,this.c.signInViaPopup=this.B,this.c.linkViaPopup=this.B,this.c.reauthViaPopup=this.B,this.a=wc(this.D,this.u,this.m,A);}function wc(t,e,n,r){var i=I.SDK_VERSION||null;return lr()?new hc(t,e,n,i,r):new iu(t,e,n,i,r);}function _c(t){t.f||(t.f=!0,t.a.Ca(t.l));var e=t.a;return t.a.ka().o(function(n){throw t.a==e&&t.reset(),n;});}function Ec(t){t.a.Ub()&&_c(t).o(function(e){var n=new Co("unknown",null,null,null,new E("operation-not-supported-in-this-environment"));Sc(e)&&t.s(n);}),t.a.Qb()||Pc(t.b);}function Ic(t,e){W(t.h,e)||t.h.push(e),t.f||function(t){return t.b.get(mc,t.a).then(function(t){return "pending"==t;});}(t.g).then(function(e){e?gc(t.g).then(function(){_c(t).o(function(e){var n=new Co("unknown",null,null,null,new E("operation-not-supported-in-this-environment"));Sc(e)&&t.s(n);});}):Ec(t);}).o(function(){Ec(t);});}function Tc(t,e){K(t.h,function(t){return t==e;});}bc.prototype.reset=function(){this.f=!1,this.a.Qa(this.l),this.a=wc(this.D,this.u,this.m),this.i={};},bc.prototype.s=function(t){if(!t)throw new E("invalid-auth-event");if(6e5<=w()-this.w&&(this.i={},this.w=0),t&&t.getUid()&&this.i.hasOwnProperty(t.getUid()))return !1;for(var e=!1,n=0;n<this.h.length;n++){var r=this.h[n];if(r.Cb(t.c,t.b)){(e=this.c[t.c])&&(e.h(t,r),t&&(t.f||t.b)&&(this.i[t.getUid()]=!0,this.w=w())),e=!0;break;}}return Pc(this.b),e;};var Ac=new Pr(2e3,1e4),kc=new Pr(3e4,6e4);function Nc(t,e,n,r,i,o,s){return t.a.Jb(e,n,r,function(){t.f||(t.f=!0,t.a.Ca(t.l));},function(){t.reset();},i,o,s);}function Sc(t){return !(!t||"auth/cordova-not-ready"!=t.code);}function xc(t,e,n,r,i){var o;return function(t){return t.b.set(mc,"pending",t.a);}(t.g).then(function(){return t.a.Kb(e,n,r,i).o(function(e){if(Sc(e))throw new E("operation-not-supported-in-this-environment");return o=e,gc(t.g).then(function(){throw o;});}).then(function(){return t.a.Xb()?new me(function(){}):gc(t.g).then(function(){return t.pa();}).then(function(){}).o(function(){});});});}function Oc(t,e,n,r,i){return t.a.Lb(r,function(t){e.la(n,null,t,i);},Ac.get());}bc.prototype.pa=function(){return this.b.pa();};var Dc={};function Rc(t,e,n){var r=e+":"+n;return Dc[r]||(Dc[r]=new bc(t,e,n)),Dc[r];}function Cc(){this.b=null,this.f=[],this.c=[],this.a=null,this.i=this.g=!1;}function Pc(t){t.g||(t.g=!0,jc(t,!1,null,null));}function Lc(t){t.g&&!t.i&&jc(t,!1,null,null);}function Mc(t,e){if(t.b=function(){return Te(e);},t.f.length)for(var n=0;n<t.f.length;n++)t.f[n](e);}function jc(t,e,n,r){e?r?function(t,e){if(t.b=function(){return Ae(e);},t.c.length)for(var n=0;n<t.c.length;n++)t.c[n](e);}(t,r):Mc(t,n):Mc(t,{user:null}),t.f=[],t.c=[];}function Vc(){}function Uc(){this.Bb=!1,Object.defineProperty(this,"appVerificationDisabled",{get:function(){return this.Bb;},set:function(t){this.Bb=t;},enumerable:!1});}function Fc(t,e){this.a=e,Br(this,"verificationId",t);}function qc(t,e,n,r){return new xo(t).cb(e,n).then(function(t){return new Fc(t,r);});}function Bc(t){var e=ji(t);if(!(e&&e.exp&&e.auth_time&&e.iat))throw new E("internal-error","An internal error occurred. The token obtained by Firebase appears to be malformed. Please retry the operation.");zr(this,{token:t,expirationTime:Mr(1e3*e.exp),authTime:Mr(1e3*e.auth_time),issuedAtTime:Mr(1e3*e.iat),signInProvider:e.firebase&&e.firebase.sign_in_provider?e.firebase.sign_in_provider:null,signInSecondFactor:e.firebase&&e.firebase.sign_in_second_factor?e.firebase.sign_in_second_factor:null,claims:e});}function zc(t,e,n){var r=e&&e[Wc];if(!r)throw new E("argument-error","Internal assert: Invalid MultiFactorResolver");this.a=t,this.f=ft(e),this.g=n,this.c=new $i(null,r),this.b=[];var i=this;q(e[Gc]||[],function(t){(t=Kr(t))&&i.b.push(t);}),Br(this,"auth",this.a),Br(this,"session",this.c),Br(this,"hints",this.b);}Cc.prototype.reset=function(){this.b=null,this.a&&(this.a.cancel(),this.a=null);},Cc.prototype.h=function(t,e){if(t){this.reset(),this.g=!0;var n=t.c,r=t.b,i=t.a&&"auth/web-storage-unsupported"==t.a.code,o=t.a&&"auth/operation-not-supported-in-this-environment"==t.a.code;this.i=!(!i&&!o),"unknown"!=n||i||o?t.a?(jc(this,!0,null,t.a),Te()):e.Da(n,r)?function(t,e,n){n=n.Da(e.c,e.b);var r=e.g,i=e.f,o=e.i,s=e.S(),a=!!e.c.match(/Redirect$/);n(r,i,s,o).then(function(e){jc(t,a,e,null);}).o(function(e){jc(t,a,null,e);});}(this,t,e):Ae(new E("invalid-auth-event")):(jc(this,!1,null,null),Te());}else Ae(new E("invalid-auth-event"));},Cc.prototype.pa=function(){var t=this;return new me(function(e,n){t.b?t.b().then(e,n):(t.f.push(e),t.c.push(n),function(t){var e=new E("timeout");t.a&&t.a.cancel(),t.a=wn(kc.get()).then(function(){t.b||(t.g=!0,jc(t,!0,null,e));});}(t));});},Vc.prototype.h=function(t,e){if(t){var n=t.c,r=t.b;t.a?(e.la(t.c,null,t.a,t.b),Te()):e.Da(n,r)?function(t,e){var n=t.b,r=t.c;e.Da(r,n)(t.g,t.f,t.S(),t.i).then(function(t){e.la(r,t,null,n);}).o(function(t){e.la(r,null,t,n);});}(t,e):Ae(new E("invalid-auth-event"));}else Ae(new E("invalid-auth-event"));},Fc.prototype.confirm=function(t){return t=Oo(this.verificationId,t),this.a(t);};var Gc="mfaInfo",Wc="mfaPendingCredential";function Hc(t,e,n,r){E.call(this,"multi-factor-auth-required",r,e),this.b=new zc(t,e,n),Br(this,"resolver",this.b);}function Kc(t,e,n){if(t&&p(t.serverResponse)&&"auth/multi-factor-auth-required"===t.code)try{return new Hc(e,t.serverResponse,n,t.message);}catch(t){}return null;}function Yc(){}function Xc(t){Br(this,"factorId",t.ea),this.a=t;}function Qc(t){if(Xc.call(this,t),this.a.ea!=xo.PROVIDER_ID)throw new E("argument-error","firebase.auth.PhoneMultiFactorAssertion requires a valid firebase.auth.PhoneAuthCredential");}function Jc(t,e){for(var n in Ge.call(this,t),e)this[n]=e[n];}function $c(t,e){this.a=t,this.b=[],this.c=g(this.wc,this),nn(this.a,"userReloaded",this.c);var n=[];e&&e.multiFactor&&e.multiFactor.enrolledFactors&&q(e.multiFactor.enrolledFactors,function(t){var e=null,r={};if(t){t.uid&&(r[Qr]=t.uid),t.displayName&&(r[Yr]=t.displayName),t.enrollmentTime&&(r[Xr]=new Date(t.enrollmentTime).toISOString()),t.phoneNumber&&(r[Jr]=t.phoneNumber);try{e=new $r(r);}catch(t){}t=e;}else t=null;t&&n.push(t);}),Zc(this,n);}function Zc(t,e){t.b=e,Br(t,"enrolledFactors",e);}function th(t,e,n){if(this.h=t,this.i=e,this.g=n,this.c=3e4,this.f=96e4,this.b=null,this.a=this.c,this.f<this.c)throw Error("Proactive refresh lower bound greater than upper bound!");}function eh(t){this.c=t,this.b=this.a=null;}function nh(t){return t.b&&1e3*t.b.c||0;}function rh(t,e){var n=e.refreshToken;t.b=Mi(e[Gs]||""),t.a=n;}function ih(t,e){return function(t,e){return new me(function(n,r){"refresh_token"==e.grant_type&&e.refresh_token||"authorization_code"==e.grant_type&&e.code?Js(t,t.u+"?key="+encodeURIComponent(t.c),function(t){t?t.error?r(Xa(t)):t.access_token&&t.refresh_token?n(t):r(new E("internal-error")):r(new E("network-request-failed"));},"POST",Wn(e).toString(),t.g,t.m.get()):r(new E("internal-error"));});}(t.c,e).then(function(e){return t.b=Mi(e.access_token),t.a=e.refresh_token,{accessToken:t.b.toString(),refreshToken:t.a};}).o(function(e){throw "auth/user-token-expired"==e.code&&(t.a=null),e;});}function oh(t,e){this.a=t||null,this.b=e||null,zr(this,{lastSignInTime:Mr(e||null),creationTime:Mr(t||null)});}function sh(t,e,n,r,i,o){zr(this,{uid:t,displayName:r||null,photoURL:i||null,email:n||null,phoneNumber:o||null,providerId:e});}function ah(t,e,n){this.N=[],this.l=t.apiKey,this.m=t.appName,this.s=t.authDomain||null,t=I.SDK_VERSION?wr(I.SDK_VERSION):null,this.a=new Bs(this.l,x(A),t),this.b=new eh(this.a),dh(this,e[Gs]),rh(this.b,e),Br(this,"refreshToken",this.b.a),mh(this,n||{}),vn.call(this),this.P=!1,this.s&&Tr()&&(this.i=Rc(this.s,this.l,this.m)),this.R=[],this.h=null,this.B=function(t){return new th(function(){return t.I(!0);},function(t){return !(!t||"auth/network-request-failed"!=t.code);},function(){var e=nh(t.b)-w()-3e5;return 0<e?e:0;});}(this),this.Z=g(this.Ma,this);var r=this;this.oa=null,this.za=function(t){r.va(t.g);},this.aa=null,this.W=[],this.ya=function(t){ch(r,t.c);},this.$=null,this.O=new $c(this,n),Br(this,"multiFactor",this.O);}function uh(t,e){t.aa&&sn(t.aa,"languageCodeChanged",t.za),(t.aa=e)&&nn(e,"languageCodeChanged",t.za);}function ch(t,e){t.W=e,Qs(t.a,I.SDK_VERSION?wr(I.SDK_VERSION,t.W):null);}function hh(t,e){t.$&&sn(t.$,"frameworkChanged",t.ya),(t.$=e)&&nn(e,"frameworkChanged",t.ya);}function lh(t){try{return I.app(t.m).auth();}catch(e){throw new E("internal-error","No firebase.auth.Auth instance is available for the Firebase App '"+t.m+"'!");}}function fh(t){t.D||t.B.b||(t.B.start(),sn(t,"tokenChanged",t.Z),nn(t,"tokenChanged",t.Z));}function ph(t){sn(t,"tokenChanged",t.Z),t.B.stop();}function dh(t,e){t.xa=e,Br(t,"_lat",e);}function vh(t){for(var e=[],n=0;n<t.R.length;n++)e.push(t.R[n](t));return Ne(e).then(function(){return t;});}function yh(t){t.i&&!t.P&&(t.P=!0,Ic(t.i,t));}function mh(t,e){zr(t,{uid:e.uid,displayName:e.displayName||null,photoURL:e.photoURL||null,email:e.email||null,emailVerified:e.emailVerified||!1,phoneNumber:e.phoneNumber||null,isAnonymous:e.isAnonymous||!1,tenantId:e.tenantId||null,metadata:new oh(e.createdAt,e.lastLoginAt),providerData:[]}),t.a.b=t.tenantId;}function gh(){}function bh(t){return Te().then(function(){if(t.D)throw new E("app-deleted");});}function wh(t){return z(t.providerData,function(t){return t.providerId;});}function _h(t,e){e&&(Eh(t,e.providerId),t.providerData.push(e));}function Eh(t,e){K(t.providerData,function(t){return t.providerId==e;});}function Ih(t,e,n){("uid"!=e||n)&&t.hasOwnProperty(e)&&Br(t,e,n);}function Th(t,e){t!=e&&(zr(t,{uid:e.uid,displayName:e.displayName,photoURL:e.photoURL,email:e.email,emailVerified:e.emailVerified,phoneNumber:e.phoneNumber,isAnonymous:e.isAnonymous,tenantId:e.tenantId,providerData:[]}),e.metadata?Br(t,"metadata",function(t){return new oh(t.a,t.b);}(e.metadata)):Br(t,"metadata",new oh()),q(e.providerData,function(e){_h(t,e);}),function(t,e){t.b=e.b,t.a=e.a;}(t.b,e.b),Br(t,"refreshToken",t.b.a),Zc(t.O,e.O.b));}function Ah(t){return t.I().then(function(e){var n=t.isAnonymous;return function(t,e){return Ka(t.a,Ta,{idToken:e}).then(g(t.Ic,t));}(t,e).then(function(){return n||Ih(t,"isAnonymous",!1),e;});});}function kh(t,e){e[Gs]&&t.xa!=e[Gs]&&(rh(t.b,e),t.dispatchEvent(new Jc("tokenChanged")),dh(t,e[Gs]),Ih(t,"refreshToken",t.b.a));}function Nh(t,e){return Ah(t).then(function(){if(W(wh(t),e))return vh(t).then(function(){throw new E("provider-already-linked");});});}function Sh(t,e,n){return Gr({user:t,credential:Do(e),additionalUserInfo:e=Bi(e),operationType:n});}function xh(t,e){return kh(t,e),t.reload().then(function(){return t;});}function Oh(t,e,n,r,i){if(!Tr())return Ae(new E("operation-not-supported-in-this-environment"));if(t.h&&!i)return Ae(t.h);var o=qi(n.providerId),s=Dr(t.uid+":::"),a=null;(!Nr()||fr())&&t.s&&n.isOAuthProvider&&(a=uu(t.s,t.l,t.m,e,n,null,s,I.SDK_VERSION||null,null,null,t.tenantId));var u=ar(a,o&&o.ta,o&&o.sa);return r=r().then(function(){if(Rh(t),!i)return t.I().then(function(){});}).then(function(){return Nc(t.i,u,e,n,s,!!a,t.tenantId);}).then(function(){return new me(function(n,r){t.la(e,null,new E("cancelled-popup-request"),t.g||null),t.f=n,t.w=r,t.g=s,t.c=Oc(t.i,t,e,u,s);});}).then(function(t){return u&&sr(u),t?Gr(t):null;}).o(function(t){throw u&&sr(u),t;}),Ch(t,r,i);}function Dh(t,e,n,r,i){if(!Tr())return Ae(new E("operation-not-supported-in-this-environment"));if(t.h&&!i)return Ae(t.h);var o=null,s=Dr(t.uid+":::");return r=r().then(function(){if(Rh(t),!i)return t.I().then(function(){});}).then(function(){return t.fa=s,vh(t);}).then(function(e){return t.ga&&(e=(e=t.ga).b.set(Mh,t.v(),e.a)),e;}).then(function(){return xc(t.i,e,n,s,t.tenantId);}).o(function(e){if(o=e,t.ga)return jh(t.ga);throw o;}).then(function(){if(o)throw o;}),Ch(t,r,i);}function Rh(t){if(!t.i||!t.P){if(t.i&&!t.P)throw new E("internal-error");throw new E("auth-domain-config-required");}}function Ch(t,e,n){var r=function(t,e,n){return t.h&&!n?(e.cancel(),Ae(t.h)):e.o(function(e){throw !e||"auth/user-disabled"!=e.code&&"auth/user-token-expired"!=e.code||(t.h||t.dispatchEvent(new Jc("userInvalidated")),t.h=e),e;});}(t,e,n);return t.N.push(r),r.ma(function(){H(t.N,r);}),r.o(function(e){var n=null;throw e&&"auth/multi-factor-auth-required"===e.code&&(n=Kc(e.v(),lh(t),g(t.hc,t))),n||e;});}function Ph(t){if(!t.apiKey)return null;var e={apiKey:t.apiKey,authDomain:t.authDomain,appName:t.appName},n={};if(!t.stsTokenManager||!t.stsTokenManager.accessToken)return null;n[Gs]=t.stsTokenManager.accessToken,n.refreshToken=t.stsTokenManager.refreshToken||null;var r=new ah(e,n,t);return t.providerData&&q(t.providerData,function(t){t&&_h(r,Gr(t));}),t.redirectEventId&&(r.fa=t.redirectEventId),r;}function Lh(t){this.a=t,this.b=Gu();}zc.prototype.Pc=function(t){var e=this;return t.ob(this.a.b,this.c).then(function(t){var n=ft(e.f);return delete n[Gc],delete n[Wc],dt(n,t),e.g(n);});},_(Hc,E),Yc.prototype.ob=function(t,e,n){return e.type==Zi?function(t,e,n,r){return n.Fa().then(function(n){return n={idToken:n},void 0!==r&&(n.displayName=r),dt(n,{phoneVerificationInfo:So(t.a)}),Ka(e,Ea,n);});}(this,t,e,n):function(t,e,n){return n.Fa().then(function(n){return dt(n={mfaPendingCredential:n},{phoneVerificationInfo:So(t.a)}),Ka(e,Ia,n);});}(this,t,e);},_(Xc,Yc),_(Qc,Xc),_(Jc,Ge),(t=$c.prototype).wc=function(t){Zc(this,function(t){var e=[];return q(t.mfaInfo||[],function(t){(t=Kr(t))&&e.push(t);}),e;}(t.ed));},t.Ob=function(){return this.a.I().then(function(t){return new $i(t,null);});},t.dc=function(t,e){var n=this,r=this.a.a;return this.Ob().then(function(n){return t.ob(r,n,e);}).then(function(t){return kh(n.a,t),n.a.reload();});},t.$c=function(t){var e=this,n="string"==typeof t?t:t.uid,r=this.a.a;return this.a.I().then(function(t){return Ka(r,Ha,{idToken:t,mfaEnrollmentId:n});}).then(function(t){var r=B(e.b,function(t){return t.uid!=n;});return Zc(e,r),kh(e.a,t),e.a.reload().o(function(t){if("auth/user-token-expired"!=t.code)throw t;});});},t.v=function(){return {multiFactor:{enrolledFactors:z(this.b,function(t){return t.v();})}};},th.prototype.start=function(){this.a=this.c,function t(e,n){e.stop(),e.b=wn(function(t,e){return e?(t.a=t.c,t.g()):(e=t.a,t.a*=2,t.a>t.f&&(t.a=t.f),e);}(e,n)).then(function(){return function(){var t=s.document,e=null;return Lr()||!t?Te():new me(function(n){e=function(){Lr()&&(t.removeEventListener("visibilitychange",e,!1),n());},t.addEventListener("visibilitychange",e,!1);}).o(function(n){throw t.removeEventListener("visibilitychange",e,!1),n;});}();}).then(function(){return e.h();}).then(function(){t(e,!0);}).o(function(n){e.i(n)&&t(e,!1);});}(this,!0);},th.prototype.stop=function(){this.b&&(this.b.cancel(),this.b=null);},eh.prototype.v=function(){return {apiKey:this.c.c,refreshToken:this.a,accessToken:this.b&&this.b.toString(),expirationTime:nh(this)};},eh.prototype.getToken=function(t){return t=!!t,this.b&&!this.a?Ae(new E("user-token-expired")):t||!this.b||w()>nh(this)-3e4?this.a?ih(this,{grant_type:"refresh_token",refresh_token:this.a}):Te(null):Te({accessToken:this.b.toString(),refreshToken:this.a});},oh.prototype.v=function(){return {lastLoginAt:this.b,createdAt:this.a};},_(ah,vn),ah.prototype.va=function(t){this.oa=t,Xs(this.a,t);},ah.prototype.ja=function(){return this.oa;},ah.prototype.Ea=function(){return X(this.W);},ah.prototype.Ma=function(){this.B.b&&(this.B.stop(),this.B.start());},Br(ah.prototype,"providerId","firebase"),(t=ah.prototype).reload=function(){var t=this;return Ch(this,bh(this).then(function(){return Ah(t).then(function(){return vh(t);}).then(gh);}));},t.mc=function(t){return this.I(t).then(function(t){return new Bc(t);});},t.I=function(t){var e=this;return Ch(this,bh(this).then(function(){return e.b.getToken(t);}).then(function(t){if(!t)throw new E("internal-error");return t.accessToken!=e.xa&&(dh(e,t.accessToken),e.dispatchEvent(new Jc("tokenChanged"))),Ih(e,"refreshToken",t.refreshToken),t.accessToken;}));},t.Ic=function(t){if(!(t=t.users)||!t.length)throw new E("internal-error");mh(this,{uid:(t=t[0]).localId,displayName:t.displayName,photoURL:t.photoUrl,email:t.email,emailVerified:!!t.emailVerified,phoneNumber:t.phoneNumber,lastLoginAt:t.lastLoginAt,createdAt:t.createdAt,tenantId:t.tenantId});for(var e=function(t){return (t=t.providerUserInfo)&&t.length?z(t,function(t){return new sh(t.rawId,t.providerId,t.email,t.displayName,t.photoUrl,t.phoneNumber);}):[];}(t),n=0;n<e.length;n++)_h(this,e[n]);Ih(this,"isAnonymous",!(this.email&&t.passwordHash||this.providerData&&this.providerData.length)),this.dispatchEvent(new Jc("userReloaded",{ed:t}));},t.Jc=function(t){return Fr("firebase.User.prototype.reauthenticateAndRetrieveDataWithCredential is deprecated. Please use firebase.User.prototype.reauthenticateWithCredential instead."),this.pb(t);},t.pb=function(t){var e=this,n=null;return Ch(this,t.c(this.a,this.uid).then(function(t){return kh(e,t),n=Sh(e,t,"reauthenticate"),e.h=null,e.reload();}).then(function(){return n;}),!0);},t.Ac=function(t){return Fr("firebase.User.prototype.linkAndRetrieveDataWithCredential is deprecated. Please use firebase.User.prototype.linkWithCredential instead."),this.mb(t);},t.mb=function(t){var e=this,n=null;return Ch(this,Nh(this,t.providerId).then(function(){return e.I();}).then(function(n){return t.b(e.a,n);}).then(function(t){return n=Sh(e,t,"link"),xh(e,t);}).then(function(){return n;}));},t.Bc=function(t,e){var n=this;return Ch(this,Nh(this,"phone").then(function(){return qc(lh(n),t,e,g(n.mb,n));}));},t.Kc=function(t,e){var n=this;return Ch(this,Te().then(function(){return qc(lh(n),t,e,g(n.pb,n));}),!0);},t.xb=function(t){var e=this;return Ch(this,this.I().then(function(n){return e.a.xb(n,t);}).then(function(t){return kh(e,t),e.reload();}));},t.cd=function(t){var e=this;return Ch(this,this.I().then(function(n){return t.b(e.a,n);}).then(function(t){return kh(e,t),e.reload();}));},t.yb=function(t){var e=this;return Ch(this,this.I().then(function(n){return e.a.yb(n,t);}).then(function(t){return kh(e,t),e.reload();}));},t.zb=function(t){if(void 0===t.displayName&&void 0===t.photoURL)return bh(this);var e=this;return Ch(this,this.I().then(function(n){return e.a.zb(n,{displayName:t.displayName,photoUrl:t.photoURL});}).then(function(t){return kh(e,t),Ih(e,"displayName",t.displayName||null),Ih(e,"photoURL",t.photoUrl||null),q(e.providerData,function(t){"password"===t.providerId&&(Br(t,"displayName",e.displayName),Br(t,"photoURL",e.photoURL));}),vh(e);}).then(gh));},t.ad=function(t){var e=this;return Ch(this,Ah(this).then(function(n){return W(wh(e),t)?function(t,e,n){return Ka(t,ba,{idToken:e,deleteProvider:n});}(e.a,n,[t]).then(function(t){var n={};return q(t.providerUserInfo||[],function(t){n[t.providerId]=!0;}),q(wh(e),function(t){n[t]||Eh(e,t);}),n[xo.PROVIDER_ID]||Br(e,"phoneNumber",null),vh(e);}):vh(e).then(function(){throw new E("no-such-provider");});}));},t.delete=function(){var t=this;return Ch(this,this.I().then(function(e){return Ka(t.a,ga,{idToken:e});}).then(function(){t.dispatchEvent(new Jc("userDeleted"));})).then(function(){for(var e=0;e<t.N.length;e++)t.N[e].cancel("app-deleted");uh(t,null),hh(t,null),t.N=[],t.D=!0,ph(t),Br(t,"refreshToken",null),t.i&&Tc(t.i,t);});},t.Cb=function(t,e){return !!("linkViaPopup"==t&&(this.g||null)==e&&this.f||"reauthViaPopup"==t&&(this.g||null)==e&&this.f||"linkViaRedirect"==t&&(this.fa||null)==e||"reauthViaRedirect"==t&&(this.fa||null)==e);},t.la=function(t,e,n,r){"linkViaPopup"!=t&&"reauthViaPopup"!=t||r!=(this.g||null)||(n&&this.w?this.w(n):e&&!n&&this.f&&this.f(e),this.c&&(this.c.cancel(),this.c=null),delete this.f,delete this.w);},t.Da=function(t,e){return "linkViaPopup"==t&&e==(this.g||null)?g(this.Hb,this):"reauthViaPopup"==t&&e==(this.g||null)?g(this.Ib,this):"linkViaRedirect"==t&&(this.fa||null)==e?g(this.Hb,this):"reauthViaRedirect"==t&&(this.fa||null)==e?g(this.Ib,this):null;},t.Cc=function(t){var e=this;return Oh(this,"linkViaPopup",t,function(){return Nh(e,t.providerId).then(function(){return vh(e);});},!1);},t.Lc=function(t){return Oh(this,"reauthViaPopup",t,function(){return Te();},!0);},t.Dc=function(t){var e=this;return Dh(this,"linkViaRedirect",t,function(){return Nh(e,t.providerId);},!1);},t.Mc=function(t){return Dh(this,"reauthViaRedirect",t,function(){return Te();},!0);},t.Hb=function(t,e,n,r){var i=this;this.c&&(this.c.cancel(),this.c=null);var o=null;return Ch(this,this.I().then(function(n){return la(i.a,{requestUri:t,postBody:r,sessionId:e,idToken:n});}).then(function(t){return o=Sh(i,t,"link"),xh(i,t);}).then(function(){return o;}));},t.Ib=function(t,e,n,r){var i=this;this.c&&(this.c.cancel(),this.c=null);var o=null;return Ch(this,Te().then(function(){return no(fa(i.a,{requestUri:t,sessionId:e,postBody:r,tenantId:n}),i.uid);}).then(function(t){return o=Sh(i,t,"reauthenticate"),kh(i,t),i.h=null,i.reload();}).then(function(){return o;}),!0);},t.qb=function(t){var e=this,n=null;return Ch(this,this.I().then(function(e){return n=e,void 0===t||lt(t)?{}:Ri(new Ei(t));}).then(function(t){return e.a.qb(n,t);}).then(function(t){if(e.email!=t)return e.reload();}).then(function(){}));},t.Ab=function(t,e){var n=this,r=null;return Ch(this,this.I().then(function(t){return r=t,void 0===e||lt(e)?{}:Ri(new Ei(e));}).then(function(e){return n.a.Ab(r,t,e);}).then(function(t){if(n.email!=t)return n.reload();}).then(function(){}));},t.hc=function(t){var e=null,n=this;return Ch(this,t=no(Te(t),n.uid).then(function(t){return e=Sh(n,t,"reauthenticate"),kh(n,t),n.h=null,n.reload();}).then(function(){return e;}),!0);},t.toJSON=function(){return this.v();},t.v=function(){var t={uid:this.uid,displayName:this.displayName,photoURL:this.photoURL,email:this.email,emailVerified:this.emailVerified,phoneNumber:this.phoneNumber,isAnonymous:this.isAnonymous,tenantId:this.tenantId,providerData:[],apiKey:this.l,appName:this.m,authDomain:this.s,stsTokenManager:this.b.v(),redirectEventId:this.fa||null};return this.metadata&&dt(t,this.metadata.v()),q(this.providerData,function(e){t.providerData.push(function(t){var e,n={};for(e in t)t.hasOwnProperty(e)&&(n[e]=t[e]);return n;}(e));}),dt(t,this.O.v()),t;};var Mh={name:"redirectUser",F:"session"};function jh(t){return Ku(t.b,Mh,t.a);}function Vh(t){this.a=t,this.b=Gu(),this.c=null,this.f=function(t){var e=qh("local"),n=qh("session"),r=qh("none");return function(t,e,n){var r=Hu(e,n),i=Wu(t,e.F);return t.get(e,n).then(function(o){var a=null;try{a=Or(s.localStorage.getItem(r));}catch(t){}if(a&&!o)return s.localStorage.removeItem(r),t.set(e,a,n);a&&o&&"localStorage"!=i.type&&s.localStorage.removeItem(r);});}(t.b,e,t.a).then(function(){return t.b.get(n,t.a);}).then(function(i){return i?n:t.b.get(r,t.a).then(function(n){return n?r:t.b.get(e,t.a).then(function(n){return n?e:t.b.get(Fh,t.a).then(function(t){return t?qh(t):e;});});});}).then(function(e){return t.c=e,Uh(t,e.F);}).o(function(){t.c||(t.c=e);});}(this),this.b.addListener(qh("local"),this.a,g(this.g,this));}function Uh(t,e){var n,r=[];for(n in Bu)Bu[n]!==e&&r.push(Ku(t.b,qh(Bu[n]),t.a));return r.push(Ku(t.b,Fh,t.a)),function(t){return new me(function(e,n){var r=t.length,i=[];if(r)for(var o=function(t,n){r--,i[t]=n,0==r&&e(i);},s=function(t){n(t);},a=0;a<t.length;a++)ke(t[a],b(o,a),s);else e(i);});}(r);}Vh.prototype.g=function(){var t=this,e=qh("local");Wh(this,function(){return Te().then(function(){return t.c&&"local"!=t.c.F?t.b.get(e,t.a):null;}).then(function(n){if(n)return Uh(t,"local").then(function(){t.c=e;});});});};var Fh={name:"persistence",F:"session"};function qh(t){return {name:"authUser",F:t};}function Bh(t,e){return Wh(t,function(){return t.b.set(t.c,e.v(),t.a);});}function zh(t){return Wh(t,function(){return Ku(t.b,t.c,t.a);});}function Gh(t,e){return Wh(t,function(){return t.b.get(t.c,t.a).then(function(t){return t&&e&&(t.authDomain=e),Ph(t||{});});});}function Wh(t,e){return t.f=t.f.then(e,e),t.f;}function Hh(t){if(this.l=!1,Br(this,"settings",new Uc()),Br(this,"app",t),!tl(this).options||!tl(this).options.apiKey)throw new E("invalid-api-key");t=I.SDK_VERSION?wr(I.SDK_VERSION):null,this.b=new Bs(tl(this).options&&tl(this).options.apiKey,x(A),t),this.P=[],this.m=[],this.O=[],this.$b=I.INTERNAL.createSubscribe(g(this.xc,this)),this.W=void 0,this.ac=I.INTERNAL.createSubscribe(g(this.yc,this)),$h(this,null),this.i=new Vh(tl(this).options.apiKey+":"+tl(this).name),this.B=new Lh(tl(this).options.apiKey+":"+tl(this).name),this.Z=il(this,function(t){var e=tl(t).options.authDomain,n=function(t){var e=function(t,e){return t.b.get(Mh,t.a).then(function(t){return t&&e&&(t.authDomain=e),Ph(t||{});});}(t.B,tl(t).options.authDomain).then(function(e){return (t.D=e)&&(e.ga=t.B),jh(t.B);});return il(t,e);}(t).then(function(){return Gh(t.i,e);}).then(function(e){return e?(e.ga=t.B,t.D&&(t.D.fa||null)==(e.fa||null)?e:e.reload().then(function(){return Bh(t.i,e).then(function(){return e;});}).o(function(n){return "auth/network-request-failed"==n.code?e:zh(t.i);})):null;}).then(function(e){$h(t,e||null);});return il(t,n);}(this)),this.h=il(this,function(t){return t.Z.then(function(){return Qh(t);}).o(function(){}).then(function(){if(!t.l)return t.oa();}).o(function(){}).then(function(){if(!t.l){t.aa=!0;var e=t.i;e.b.addListener(qh("local"),e.a,t.oa);}});}(this)),this.aa=!1,this.oa=g(this.Xc,this),this.Ma=g(this.ca,this),this.xa=g(this.jc,this),this.ya=g(this.uc,this),this.za=g(this.vc,this),this.a=null,function(t){var e=tl(t).options.authDomain,n=tl(t).options.apiKey;e&&Tr()&&(t.Zb=t.Z.then(function(){if(!t.l){if(t.a=Rc(e,n,tl(t).name),Ic(t.a,t),el(t)&&yh(el(t)),t.D){yh(t.D);var r=t.D;r.va(t.ja()),uh(r,t),ch(r=t.D,t.N),hh(r,t),t.D=null;}return t.a;}}));}(this),this.INTERNAL={},this.INTERNAL.delete=g(this.delete,this),this.INTERNAL.logFramework=g(this.Ec,this),this.s=0,vn.call(this),function(t){Object.defineProperty(t,"lc",{get:function(){return this.ja();},set:function(t){this.va(t);},enumerable:!1}),t.$=null,Object.defineProperty(t,"ti",{get:function(){return this.S();},set:function(t){this.ub(t);},enumerable:!1}),t.R=null;}(this),this.N=[];}function Kh(t){Ge.call(this,"languageCodeChanged"),this.g=t;}function Yh(t){Ge.call(this,"frameworkChanged"),this.c=t;}function Xh(t){return t.Zb||Ae(new E("auth-domain-config-required"));}function Qh(t){if(!Tr())return Ae(new E("operation-not-supported-in-this-environment"));var e=Xh(t).then(function(){return t.a.pa();}).then(function(t){return t?Gr(t):null;});return il(t,e);}function Jh(t,e){var n={};return n.apiKey=tl(t).options.apiKey,n.authDomain=tl(t).options.authDomain,n.appName=tl(t).name,t.Z.then(function(){return function(t,e,n,r){var i=new ah(t,e);return n&&(i.ga=n),r&&ch(i,r),i.reload().then(function(){return i;});}(n,e,t.B,t.Ea());}).then(function(e){return el(t)&&e.uid==el(t).uid?(Th(el(t),e),t.ca(e)):($h(t,e),yh(e),t.ca(e));}).then(function(){rl(t);});}function $h(t,e){el(t)&&(function(t,e){K(t.R,function(t){return t==e;});}(el(t),t.Ma),sn(el(t),"tokenChanged",t.xa),sn(el(t),"userDeleted",t.ya),sn(el(t),"userInvalidated",t.za),ph(el(t))),e&&(e.R.push(t.Ma),nn(e,"tokenChanged",t.xa),nn(e,"userDeleted",t.ya),nn(e,"userInvalidated",t.za),0<t.s&&fh(e)),Br(t,"currentUser",e),e&&(e.va(t.ja()),uh(e,t),ch(e,t.N),hh(e,t));}function Zh(t,e){var n=null,r=null;return il(t,e.then(function(e){return n=Do(e),r=Bi(e),Jh(t,e);},function(e){var n=null;throw e&&"auth/multi-factor-auth-required"===e.code&&(n=Kc(e.v(),t,g(t.ic,t))),n||e;}).then(function(){return Gr({user:el(t),credential:n,additionalUserInfo:r,operationType:"signIn"});}));}function tl(t){return t.app;}function el(t){return t.currentUser;}function nl(t){return el(t)&&el(t)._lat||null;}function rl(t){if(t.aa){for(var e=0;e<t.m.length;e++)t.m[e]&&t.m[e](nl(t));if(t.W!==t.getUid()&&t.O.length)for(t.W=t.getUid(),e=0;e<t.O.length;e++)t.O[e]&&t.O[e](nl(t));}}function il(t,e){return t.P.push(e),e.ma(function(){H(t.P,e);}),e;}function ol(){}function sl(){this.a={},this.b=1e12;}Vh.prototype.tb=function(t){var e=null,n=this;return function(t){var e=new E("invalid-persistence-type"),n=new E("unsupported-persistence-type");t:{for(r in Bu)if(Bu[r]==t){var r=!0;break t;}r=!1;}if(!r||"string"!=typeof t)throw e;switch(dr()){case"ReactNative":if("session"===t)throw n;break;case"Node":if("none"!==t)throw n;break;case"Worker":if("session"===t||!_u()&&"none"!==t)throw n;break;default:if(!Ir()&&"none"!==t)throw n;}}(t),Wh(this,function(){return t!=n.c.F?n.b.get(n.c,n.a).then(function(r){return e=r,Uh(n,t);}).then(function(){if(n.c=qh(t),e)return n.b.set(n.c,e,n.a);}):Te();});},_(Hh,vn),_(Kh,Ge),_(Yh,Ge),(t=Hh.prototype).tb=function(t){return il(this,t=this.i.tb(t));},t.va=function(t){this.$===t||this.l||(this.$=t,Xs(this.b,this.$),this.dispatchEvent(new Kh(this.ja())));},t.ja=function(){return this.$;},t.dd=function(){var t=s.navigator;this.va(t&&(t.languages&&t.languages[0]||t.language||t.userLanguage)||null);},t.Ec=function(t){this.N.push(t),Qs(this.b,I.SDK_VERSION?wr(I.SDK_VERSION,this.N):null),this.dispatchEvent(new Yh(this.N));},t.Ea=function(){return X(this.N);},t.ub=function(t){this.R===t||this.l||(this.R=t,this.b.b=this.R);},t.S=function(){return this.R;},t.toJSON=function(){return {apiKey:tl(this).options.apiKey,authDomain:tl(this).options.authDomain,appName:tl(this).name,currentUser:el(this)&&el(this).v()};},t.Cb=function(t,e){switch(t){case"unknown":case"signInViaRedirect":return !0;case"signInViaPopup":return this.g==e&&!!this.f;default:return !1;}},t.la=function(t,e,n,r){"signInViaPopup"==t&&this.g==r&&(n&&this.w?this.w(n):e&&!n&&this.f&&this.f(e),this.c&&(this.c.cancel(),this.c=null),delete this.f,delete this.w);},t.Da=function(t,e){return "signInViaRedirect"==t||"signInViaPopup"==t&&this.g==e&&this.f?g(this.gc,this):null;},t.gc=function(t,e,n,r){var i=this,o={requestUri:t,postBody:r,sessionId:e,tenantId:n};return this.c&&(this.c.cancel(),this.c=null),i.Z.then(function(){return Zh(i,ha(i.b,o));});},t.Vc=function(t){if(!Tr())return Ae(new E("operation-not-supported-in-this-environment"));var e=this,n=qi(t.providerId),r=Dr(),i=null;(!Nr()||fr())&&tl(this).options.authDomain&&t.isOAuthProvider&&(i=uu(tl(this).options.authDomain,tl(this).options.apiKey,tl(this).name,"signInViaPopup",t,null,r,I.SDK_VERSION||null,null,null,this.S()));var o=ar(i,n&&n.ta,n&&n.sa);return il(this,n=Xh(this).then(function(n){return Nc(n,o,"signInViaPopup",t,r,!!i,e.S());}).then(function(){return new me(function(t,n){e.la("signInViaPopup",null,new E("cancelled-popup-request"),e.g),e.f=t,e.w=n,e.g=r,e.c=Oc(e.a,e,"signInViaPopup",o,r);});}).then(function(t){return o&&sr(o),t?Gr(t):null;}).o(function(t){throw o&&sr(o),t;}));},t.Wc=function(t){if(!Tr())return Ae(new E("operation-not-supported-in-this-environment"));var e=this;return il(this,Xh(this).then(function(){return function(t){return Wh(t,function(){return t.b.set(Fh,t.c.F,t.a);});}(e.i);}).then(function(){return xc(e.a,"signInViaRedirect",t,void 0,e.S());}));},t.pa=function(){var t=this;return Qh(this).then(function(e){return t.a&&Lc(t.a.b),e;}).o(function(e){throw t.a&&Lc(t.a.b),e;});},t.bd=function(t){if(!t)return Ae(new E("null-user"));if(this.R!=t.tenantId)return Ae(new E("tenant-id-mismatch"));var e=this,n={};n.apiKey=tl(this).options.apiKey,n.authDomain=tl(this).options.authDomain,n.appName=tl(this).name;var r=function(t,e,n,r){var i=t.b,o={};return o[Gs]=i.b&&i.b.toString(),o.refreshToken=i.a,e=new ah(e||{apiKey:t.l,authDomain:t.s,appName:t.m},o),n&&(e.ga=n),r&&ch(e,r),Th(e,t),e;}(t,n,e.B,e.Ea());return il(this,this.h.then(function(){if(tl(e).options.apiKey!=t.l)return r.reload();}).then(function(){return el(e)&&t.uid==el(e).uid?(Th(el(e),t),e.ca(t)):($h(e,r),yh(r),e.ca(r));}).then(function(){rl(e);}));},t.wb=function(){var t=this;return il(this,this.h.then(function(){return t.a&&Lc(t.a.b),el(t)?($h(t,null),zh(t.i).then(function(){rl(t);})):Te();}));},t.Xc=function(){var t=this;return Gh(this.i,tl(this).options.authDomain).then(function(e){if(!t.l){var n;if(n=el(t)&&e){n=el(t).uid;var r=e.uid;n=null!=n&&""!==n&&null!=r&&""!==r&&n==r;}if(n)return Th(el(t),e),el(t).I();(el(t)||e)&&($h(t,e),e&&(yh(e),e.ga=t.B),t.a&&Ic(t.a,t),rl(t));}});},t.ca=function(t){return Bh(this.i,t);},t.jc=function(){rl(this),this.ca(el(this));},t.uc=function(){this.wb();},t.vc=function(){this.wb();},t.ic=function(t){var e=this;return this.h.then(function(){return Zh(e,Te(t));});},t.xc=function(t){var e=this;this.addAuthTokenListener(function(){t.next(el(e));});},t.yc=function(t){var e=this;!function(t,e){t.O.push(e),il(t,t.h.then(function(){!t.l&&W(t.O,e)&&t.W!==t.getUid()&&(t.W=t.getUid(),e(nl(t)));}));}(this,function(){t.next(el(e));});},t.Gc=function(t,e,n){var r=this;return this.aa&&Promise.resolve().then(function(){f(t)?t(el(r)):f(t.next)&&t.next(el(r));}),this.$b(t,e,n);},t.Fc=function(t,e,n){var r=this;return this.aa&&Promise.resolve().then(function(){r.W=r.getUid(),f(t)?t(el(r)):f(t.next)&&t.next(el(r));}),this.ac(t,e,n);},t.kc=function(t){var e=this;return il(this,this.h.then(function(){return el(e)?el(e).I(t).then(function(t){return {accessToken:t};}):null;}));},t.Rc=function(t){var e=this;return this.h.then(function(){return Zh(e,Ka(e.b,qa,{token:t}));}).then(function(t){var n=t.user;return Ih(n,"isAnonymous",!1),e.ca(n),t;});},t.Sc=function(t,e){var n=this;return this.h.then(function(){return Zh(n,Ka(n.b,Ba,{email:t,password:e}));});},t.cc=function(t,e){var n=this;return this.h.then(function(){return Zh(n,Ka(n.b,ya,{email:t,password:e}));});},t.Ya=function(t){var e=this;return this.h.then(function(){return Zh(e,t.ia(e.b));});},t.Qc=function(t){return Fr("firebase.auth.Auth.prototype.signInAndRetrieveDataWithCredential is deprecated. Please use firebase.auth.Auth.prototype.signInWithCredential instead."),this.Ya(t);},t.vb=function(){var t=this;return this.h.then(function(){var e=el(t);if(e&&e.isAnonymous){var n=Gr({providerId:null,isNewUser:!1});return Gr({user:e,credential:null,additionalUserInfo:n,operationType:"signIn"});}return Zh(t,t.b.vb()).then(function(e){var n=e.user;return Ih(n,"isAnonymous",!0),t.ca(n),e;});});},t.getUid=function(){return el(this)&&el(this).uid||null;},t.bc=function(t){this.addAuthTokenListener(t),this.s++,0<this.s&&el(this)&&fh(el(this));},t.Nc=function(t){var e=this;q(this.m,function(n){n==t&&e.s--;}),0>this.s&&(this.s=0),0==this.s&&el(this)&&ph(el(this)),this.removeAuthTokenListener(t);},t.addAuthTokenListener=function(t){var e=this;this.m.push(t),il(this,this.h.then(function(){e.l||W(e.m,t)&&t(nl(e));}));},t.removeAuthTokenListener=function(t){K(this.m,function(e){return e==t;});},t.delete=function(){this.l=!0;for(var t=0;t<this.P.length;t++)this.P[t].cancel("app-deleted");return this.P=[],this.i&&(t=this.i).b.removeListener(qh("local"),t.a,this.oa),this.a&&(Tc(this.a,this),Lc(this.a.b)),Promise.resolve();},t.fc=function(t){return il(this,function(t,e){return Ka(t,ma,{identifier:e,continueUri:Ar()?rr():"http://localhost"}).then(function(t){return t.signinMethods||[];});}(this.b,t));},t.zc=function(t){return !!Ao(t);},t.sb=function(t,e){var n=this;return il(this,Te().then(function(){var t=new Ei(e);if(!t.c)throw new E("argument-error",Ai+" must be true when sending sign in link to email");return Ri(t);}).then(function(e){return n.b.sb(t,e);}).then(function(){}));},t.fd=function(t){return this.Pa(t).then(function(t){return t.data.email;});},t.jb=function(t,e){return il(this,this.b.jb(t,e).then(function(){}));},t.Pa=function(t){return il(this,this.b.Pa(t).then(function(t){return new Zr(t);}));},t.fb=function(t){return il(this,this.b.fb(t).then(function(){}));},t.rb=function(t,e){var n=this;return il(this,Te().then(function(){return void 0===e||lt(e)?{}:Ri(new Ei(e));}).then(function(e){return n.b.rb(t,e);}).then(function(){}));},t.Uc=function(t,e){return il(this,qc(this,t,e,g(this.Ya,this)));},t.Tc=function(t,e){var n=this;return il(this,Te().then(function(){var r=e||rr(),i=To(t,r);if(!(r=Ao(r)))throw new E("argument-error","Invalid email link!");if(r.tenantId!==n.S())throw new E("tenant-id-mismatch");return n.Ya(i);}));},ol.prototype.render=function(){},ol.prototype.reset=function(){},ol.prototype.getResponse=function(){},ol.prototype.execute=function(){};var al=null;function ul(t,e){return (e=cl(e))&&t.a[e]||null;}function cl(t){return (t=void 0===t?1e12:t)?t.toString():null;}function hl(t,e){this.g=!1,this.c=e,this.a=this.b=null,this.h="invisible"!==this.c.size,this.f=re(t);var n=this;this.i=function(){n.execute();},this.h?this.execute():nn(this.f,"click",this.i);}function ll(t){if(t.g)throw Error("reCAPTCHA mock was already deleted!");}function fl(){}function pl(){}sl.prototype.render=function(t,e){return this.a[this.b.toString()]=new hl(t,e),this.b++;},sl.prototype.reset=function(t){var e=ul(this,t);t=cl(t),e&&t&&(e.delete(),delete this.a[t]);},sl.prototype.getResponse=function(t){return (t=ul(this,t))?t.getResponse():null;},sl.prototype.execute=function(t){(t=ul(this,t))&&t.execute();},hl.prototype.getResponse=function(){return ll(this),this.b;},hl.prototype.execute=function(){ll(this);var t=this;this.a||(this.a=setTimeout(function(){t.b=function(){for(var t=50,e=[];0<t;)e.push("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(62*Math.random()))),t--;return e.join("");}();var e=t.c.callback,n=t.c["expired-callback"];if(e)try{e(t.b);}catch(t){}t.a=setTimeout(function(){if(t.a=null,t.b=null,n)try{n();}catch(t){}t.h&&t.execute();},6e4);},500));},hl.prototype.delete=function(){ll(this),this.g=!0,clearTimeout(this.a),this.a=null,sn(this.f,"click",this.i);},Br(fl,"FACTOR_ID","phone"),pl.prototype.g=function(){return al||(al=new sl()),Te(al);},pl.prototype.c=function(){};var dl=null;function vl(){this.b=s.grecaptcha?1/0:0,this.f=null,this.a="__rcb"+Math.floor(1e6*Math.random()).toString();}var yl=new yt(bt,"https://www.google.com/recaptcha/api.js?onload=%{onload}&render=explicit&hl=%{hl}"),ml=new Pr(3e4,6e4);vl.prototype.g=function(t){var e=this;return new me(function(n,r){var i=setTimeout(function(){r(new E("network-request-failed"));},ml.get());!s.grecaptcha||t!==e.f&&!e.b?(s[e.a]=function(){if(s.grecaptcha){e.f=t;var o=s.grecaptcha.render;s.grecaptcha.render=function(t,n){return t=o(t,n),e.b++,t;},clearTimeout(i),n(s.grecaptcha);}else clearTimeout(i),r(new E("internal-error"));delete s[e.a];},Te(Ls(It(yl,{onload:e.a,hl:t||""}))).o(function(){clearTimeout(i),r(new E("internal-error","Unable to load external reCAPTCHA dependencies!"));})):(clearTimeout(i),n(s.grecaptcha));});},vl.prototype.c=function(){this.b--;};var gl=null;function bl(t,e,n,r,i,o,a){if(Br(this,"type","recaptcha"),this.c=this.f=null,this.D=!1,this.u=e,this.g=null,a?(dl||(dl=new pl()),a=dl):(gl||(gl=new vl()),a=gl),this.m=a,this.a=n||{theme:"light",type:"image"},this.h=[],this.a[El])throw new E("argument-error","sitekey should not be provided for reCAPTCHA as one is automatically provisioned for the current project.");if(this.i="invisible"===this.a[Il],!s.document)throw new E("operation-not-supported-in-this-environment","RecaptchaVerifier is only supported in a browser HTTP/HTTPS environment with DOM support.");if(!re(e)||!this.i&&re(e).hasChildNodes())throw new E("argument-error","reCAPTCHA container is either not found or already contains inner elements!");this.s=new Bs(t,o||null,i||null),this.w=r||function(){return null;};var u=this;this.l=[];var c=this.a[wl];this.a[wl]=function(t){if(Tl(u,t),"function"==typeof c)c(t);else if("string"==typeof c){var e=Er(c,s);"function"==typeof e&&e(t);}};var h=this.a[_l];this.a[_l]=function(){if(Tl(u,null),"function"==typeof h)h();else if("string"==typeof h){var t=Er(h,s);"function"==typeof t&&t();}};}var wl="callback",_l="expired-callback",El="sitekey",Il="size";function Tl(t,e){for(var n=0;n<t.l.length;n++)try{t.l[n](e);}catch(t){}}function Al(t,e){return t.h.push(e),e.ma(function(){H(t.h,e);}),e;}function kl(t){if(t.D)throw new E("internal-error","RecaptchaVerifier instance has been destroyed.");}function Nl(t,e,n){var r=!1;try{this.b=n||I.app();}catch(t){throw new E("argument-error","No firebase.app.App instance is currently initialized.");}if(!this.b.options||!this.b.options.apiKey)throw new E("invalid-api-key");n=this.b.options.apiKey;var i=this,o=null;try{o=this.b.auth().Ea();}catch(t){}try{r=this.b.auth().settings.appVerificationDisabledForTesting;}catch(t){}o=I.SDK_VERSION?wr(I.SDK_VERSION,o):null,bl.call(this,n,t,e,function(){try{var t=i.b.auth().ja();}catch(e){t=null;}return t;},o,x(A),r);}function Sl(t,e,n,r){t:{n=Array.prototype.slice.call(n);for(var i=0,o=!1,s=0;s<e.length;s++)if(e[s].optional)o=!0;else {if(o)throw new E("internal-error","Argument validator encountered a required argument after an optional argument.");i++;}if(o=e.length,n.length<i||o<n.length)r="Expected "+(i==o?1==i?"1 argument":i+" arguments":i+"-"+o+" arguments")+" but got "+n.length+".";else {for(i=0;i<n.length;i++)if(o=e[i].optional&&void 0===n[i],!e[i].K(n[i])&&!o){if(e=e[i],0>i||i>=xl.length)throw new E("internal-error","Argument validator received an unsupported number of arguments.");n=xl[i],r=(r?"":n+" argument ")+(e.name?'"'+e.name+'" ':"")+"must be "+e.J+".";break t;}r=null;}}if(r)throw new E("argument-error",t+" failed: "+r);}(t=bl.prototype).Ga=function(){var t=this;return this.f?this.f:this.f=Al(this,Te().then(function(){if(Ar()&&!pr())return hr();throw new E("operation-not-supported-in-this-environment","RecaptchaVerifier is only supported in a browser HTTP/HTTPS environment.");}).then(function(){return t.m.g(t.w());}).then(function(e){return t.g=e,Ka(t.s,Oa,{});}).then(function(e){t.a[El]=e.recaptchaSiteKey;}).o(function(e){throw t.f=null,e;}));},t.render=function(){kl(this);var t=this;return Al(this,this.Ga().then(function(){if(null===t.c){var e=t.u;if(!t.i){var n=re(e);e=function(t,e,n){var r=arguments,i=document,o=String(r[0]),s=r[1];if(!ne&&s&&(s.name||s.type)){if(o=["<",o],s.name&&o.push(' name="',Ft(s.name),'"'),s.type){o.push(' type="',Ft(s.type),'"');var a={};dt(a,s),delete a.type,s=a;}o.push(">"),o=o.join("");}return o=ce(i,o),s&&("string"==typeof s?o.className=s:Array.isArray(s)?o.className=s.join(" "):ie(o,s)),2<r.length&&ue(i,o,r),o;}("DIV"),n.appendChild(e);}t.c=t.g.render(e,t.a);}return t.c;}));},t.verify=function(){kl(this);var t=this;return Al(this,this.render().then(function(e){return new me(function(n){var r=t.g.getResponse(e);if(r)n(r);else {var i=function(e){e&&(function(t,e){K(t.l,function(t){return t==e;});}(t,i),n(e));};t.l.push(i),t.i&&t.g.execute(t.c);}});}));},t.reset=function(){kl(this),null!==this.c&&this.g.reset(this.c);},t.clear=function(){kl(this),this.D=!0,this.m.c();for(var t=0;t<this.h.length;t++)this.h[t].cancel("RecaptchaVerifier instance has been destroyed.");if(!this.i){t=re(this.u);for(var e;e=t.firstChild;)t.removeChild(e);}},_(Nl,bl);var xl="First Second Third Fourth Fifth Sixth Seventh Eighth Ninth".split(" ");function Ol(t,e){return {name:t||"",J:"a valid string",optional:!!e,K:function(t){return "string"==typeof t;}};}function Dl(t,e){return {name:t||"",J:"a boolean",optional:!!e,K:function(t){return "boolean"==typeof t;}};}function Rl(t,e){return {name:t||"",J:"a valid object",optional:!!e,K:p};}function Cl(t,e){return {name:t||"",J:"a function",optional:!!e,K:f};}function Pl(t,e){return {name:t||"",J:"null",optional:!!e,K:function(t){return null===t;}};}function Ll(t){return {name:t?t+"Credential":"credential",J:t?"a valid "+t+" credential":"a valid credential",optional:!1,K:function(e){if(!e)return !1;var n=!t||e.providerId===t;return !(!e.ia||!n);}};}function Ml(t,e){return p(t)&&"string"==typeof t.type&&t.type===e&&f(t.Fa);}function jl(t){return p(t)&&"string"==typeof t.uid;}function Vl(){return {name:"applicationVerifier",J:"an implementation of firebase.auth.ApplicationVerifier",optional:!1,K:function(t){return !(!t||"string"!=typeof t.type||!f(t.verify));}};}function Ul(t,e,n,r){return {name:n||"",J:t.J+" or "+e.J,optional:!!r,K:function(n){return t.K(n)||e.K(n);}};}function Fl(t,e){for(var n in e){var r=e[n].name;t[r]=zl(r,t[n],e[n].j);}}function ql(t,e){for(var n in e){var r=e[n].name;r!==n&&Object.defineProperty(t,r,{get:b(function(t){return this[t];},n),set:b(function(t,e,n,r){Sl(t,[n],[r],!0),this[e]=r;},r,n,e[n].gb),enumerable:!0});}}function Bl(t,e,n,r){t[e]=zl(e,n,r);}function zl(t,e,n){function r(){var t=Array.prototype.slice.call(arguments);return Sl(o,n,t),e.apply(this,t);}if(!n)return e;var i,o=function(t){return (t=t.split("."))[t.length-1];}(t);for(i in e)r[i]=e[i];for(i in e.prototype)r.prototype[i]=e.prototype[i];return r;}Fl(Hh.prototype,{fb:{name:"applyActionCode",j:[Ol("code")]},Pa:{name:"checkActionCode",j:[Ol("code")]},jb:{name:"confirmPasswordReset",j:[Ol("code"),Ol("newPassword")]},cc:{name:"createUserWithEmailAndPassword",j:[Ol("email"),Ol("password")]},fc:{name:"fetchSignInMethodsForEmail",j:[Ol("email")]},pa:{name:"getRedirectResult",j:[]},zc:{name:"isSignInWithEmailLink",j:[Ol("emailLink")]},Fc:{name:"onAuthStateChanged",j:[Ul(Rl(),Cl(),"nextOrObserver"),Cl("opt_error",!0),Cl("opt_completed",!0)]},Gc:{name:"onIdTokenChanged",j:[Ul(Rl(),Cl(),"nextOrObserver"),Cl("opt_error",!0),Cl("opt_completed",!0)]},rb:{name:"sendPasswordResetEmail",j:[Ol("email"),Ul(Rl("opt_actionCodeSettings",!0),Pl(null,!0),"opt_actionCodeSettings",!0)]},sb:{name:"sendSignInLinkToEmail",j:[Ol("email"),Rl("actionCodeSettings")]},tb:{name:"setPersistence",j:[Ol("persistence")]},Qc:{name:"signInAndRetrieveDataWithCredential",j:[Ll()]},vb:{name:"signInAnonymously",j:[]},Ya:{name:"signInWithCredential",j:[Ll()]},Rc:{name:"signInWithCustomToken",j:[Ol("token")]},Sc:{name:"signInWithEmailAndPassword",j:[Ol("email"),Ol("password")]},Tc:{name:"signInWithEmailLink",j:[Ol("email"),Ol("emailLink",!0)]},Uc:{name:"signInWithPhoneNumber",j:[Ol("phoneNumber"),Vl()]},Vc:{name:"signInWithPopup",j:[{name:"authProvider",J:"a valid Auth provider",optional:!1,K:function(t){return !!(t&&t.providerId&&t.hasOwnProperty&&t.hasOwnProperty("isOAuthProvider"));}}]},Wc:{name:"signInWithRedirect",j:[{name:"authProvider",J:"a valid Auth provider",optional:!1,K:function(t){return !!(t&&t.providerId&&t.hasOwnProperty&&t.hasOwnProperty("isOAuthProvider"));}}]},bd:{name:"updateCurrentUser",j:[Ul({name:"user",J:"an instance of Firebase User",optional:!1,K:function(t){return !!(t&&t instanceof ah);}},Pl(),"user")]},wb:{name:"signOut",j:[]},toJSON:{name:"toJSON",j:[Ol(null,!0)]},dd:{name:"useDeviceLanguage",j:[]},fd:{name:"verifyPasswordResetCode",j:[Ol("code")]}}),ql(Hh.prototype,{lc:{name:"languageCode",gb:Ul(Ol(),Pl(),"languageCode")},ti:{name:"tenantId",gb:Ul(Ol(),Pl(),"tenantId")}}),Hh.Persistence=Bu,Hh.Persistence.LOCAL="local",Hh.Persistence.SESSION="session",Hh.Persistence.NONE="none",Fl(ah.prototype,{delete:{name:"delete",j:[]},mc:{name:"getIdTokenResult",j:[Dl("opt_forceRefresh",!0)]},I:{name:"getIdToken",j:[Dl("opt_forceRefresh",!0)]},Ac:{name:"linkAndRetrieveDataWithCredential",j:[Ll()]},mb:{name:"linkWithCredential",j:[Ll()]},Bc:{name:"linkWithPhoneNumber",j:[Ol("phoneNumber"),Vl()]},Cc:{name:"linkWithPopup",j:[{name:"authProvider",J:"a valid Auth provider",optional:!1,K:function(t){return !!(t&&t.providerId&&t.hasOwnProperty&&t.hasOwnProperty("isOAuthProvider"));}}]},Dc:{name:"linkWithRedirect",j:[{name:"authProvider",J:"a valid Auth provider",optional:!1,K:function(t){return !!(t&&t.providerId&&t.hasOwnProperty&&t.hasOwnProperty("isOAuthProvider"));}}]},Jc:{name:"reauthenticateAndRetrieveDataWithCredential",j:[Ll()]},pb:{name:"reauthenticateWithCredential",j:[Ll()]},Kc:{name:"reauthenticateWithPhoneNumber",j:[Ol("phoneNumber"),Vl()]},Lc:{name:"reauthenticateWithPopup",j:[{name:"authProvider",J:"a valid Auth provider",optional:!1,K:function(t){return !!(t&&t.providerId&&t.hasOwnProperty&&t.hasOwnProperty("isOAuthProvider"));}}]},Mc:{name:"reauthenticateWithRedirect",j:[{name:"authProvider",J:"a valid Auth provider",optional:!1,K:function(t){return !!(t&&t.providerId&&t.hasOwnProperty&&t.hasOwnProperty("isOAuthProvider"));}}]},reload:{name:"reload",j:[]},qb:{name:"sendEmailVerification",j:[Ul(Rl("opt_actionCodeSettings",!0),Pl(null,!0),"opt_actionCodeSettings",!0)]},toJSON:{name:"toJSON",j:[Ol(null,!0)]},ad:{name:"unlink",j:[Ol("provider")]},xb:{name:"updateEmail",j:[Ol("email")]},yb:{name:"updatePassword",j:[Ol("password")]},cd:{name:"updatePhoneNumber",j:[Ll("phone")]},zb:{name:"updateProfile",j:[Rl("profile")]},Ab:{name:"verifyBeforeUpdateEmail",j:[Ol("email"),Ul(Rl("opt_actionCodeSettings",!0),Pl(null,!0),"opt_actionCodeSettings",!0)]}}),Fl(sl.prototype,{execute:{name:"execute"},render:{name:"render"},reset:{name:"reset"},getResponse:{name:"getResponse"}}),Fl(ol.prototype,{execute:{name:"execute"},render:{name:"render"},reset:{name:"reset"},getResponse:{name:"getResponse"}}),Fl(me.prototype,{ma:{name:"finally"},o:{name:"catch"},then:{name:"then"}}),ql(Uc.prototype,{appVerificationDisabled:{name:"appVerificationDisabledForTesting",gb:Dl("appVerificationDisabledForTesting")}}),Fl(Fc.prototype,{confirm:{name:"confirm",j:[Ol("verificationCode")]}}),Bl(eo,"fromJSON",function(t){t="string"==typeof t?JSON.parse(t):t;for(var e,n=[uo,Eo,No,oo],r=0;r<n.length;r++)if(e=n[r](t))return e;return null;},[Ul(Ol(),Rl(),"json")]),Bl(Io,"credential",function(t,e){return new _o(t,e);},[Ol("email"),Ol("password")]),Fl(_o.prototype,{v:{name:"toJSON",j:[Ol(null,!0)]}}),Fl(fo.prototype,{Aa:{name:"addScope",j:[Ol("scope")]},Ia:{name:"setCustomParameters",j:[Rl("customOAuthParameters")]}}),Bl(fo,"credential",po,[Ul(Ol(),Rl(),"token")]),Bl(Io,"credentialWithLink",To,[Ol("email"),Ol("emailLink")]),Fl(vo.prototype,{Aa:{name:"addScope",j:[Ol("scope")]},Ia:{name:"setCustomParameters",j:[Rl("customOAuthParameters")]}}),Bl(vo,"credential",yo,[Ul(Ol(),Rl(),"token")]),Fl(mo.prototype,{Aa:{name:"addScope",j:[Ol("scope")]},Ia:{name:"setCustomParameters",j:[Rl("customOAuthParameters")]}}),Bl(mo,"credential",go,[Ul(Ol(),Ul(Rl(),Pl()),"idToken"),Ul(Ol(),Pl(),"accessToken",!0)]),Fl(bo.prototype,{Ia:{name:"setCustomParameters",j:[Rl("customOAuthParameters")]}}),Bl(bo,"credential",wo,[Ul(Ol(),Rl(),"token"),Ol("secret",!0)]),Fl(lo.prototype,{Aa:{name:"addScope",j:[Ol("scope")]},credential:{name:"credential",j:[Ul(Ol(),Ul(Rl(),Pl()),"optionsOrIdToken"),Ul(Ol(),Pl(),"accessToken",!0)]},Ia:{name:"setCustomParameters",j:[Rl("customOAuthParameters")]}}),Fl(so.prototype,{v:{name:"toJSON",j:[Ol(null,!0)]}}),Fl(ro.prototype,{v:{name:"toJSON",j:[Ol(null,!0)]}}),Bl(xo,"credential",Oo,[Ol("verificationId"),Ol("verificationCode")]),Fl(xo.prototype,{cb:{name:"verifyPhoneNumber",j:[Ul(Ol(),{name:"phoneInfoOptions",J:"valid phone info options",optional:!1,K:function(t){return !!t&&(t.session&&t.phoneNumber?Ml(t.session,Zi)&&"string"==typeof t.phoneNumber:t.session&&t.multiFactorHint?Ml(t.session,to)&&jl(t.multiFactorHint):t.session&&t.multiFactorUid?Ml(t.session,to)&&"string"==typeof t.multiFactorUid:!!t.phoneNumber&&"string"==typeof t.phoneNumber);}},"phoneInfoOptions"),Vl()]}}),Fl(ko.prototype,{v:{name:"toJSON",j:[Ol(null,!0)]}}),Fl(E.prototype,{toJSON:{name:"toJSON",j:[Ol(null,!0)]}}),Fl(Uo.prototype,{toJSON:{name:"toJSON",j:[Ol(null,!0)]}}),Fl(Vo.prototype,{toJSON:{name:"toJSON",j:[Ol(null,!0)]}}),Fl(Hc.prototype,{toJSON:{name:"toJSON",j:[Ol(null,!0)]}}),Fl(zc.prototype,{Pc:{name:"resolveSignIn",j:[{name:"multiFactorAssertion",J:"a valid multiFactorAssertion",optional:!1,K:function(t){return !!t&&!!t.ob;}}]}}),Fl($c.prototype,{Ob:{name:"getSession",j:[]},dc:{name:"enroll",j:[{name:"multiFactorAssertion",J:"a valid multiFactorAssertion",optional:!1,K:function(t){return !!t&&!!t.ob;}},Ol("displayName",!0)]},$c:{name:"unenroll",j:[Ul({name:"multiFactorInfo",J:"a valid multiFactorInfo",optional:!1,K:jl},Ol(),"multiFactorInfoIdentifier")]}}),Fl(Nl.prototype,{clear:{name:"clear",j:[]},render:{name:"render",j:[]},verify:{name:"verify",j:[]}}),Bl(pi,"parseLink",_i,[Ol("link")]),Bl(fl,"assertion",function(t){return new Qc(t);},[Ll("phone")]),function(){if(void 0===I||!I.INTERNAL||!I.INTERNAL.registerComponent)throw Error("Cannot find the firebase namespace; be sure to include firebase-app.js before this library.");var t={ActionCodeInfo:{Operation:{EMAIL_SIGNIN:ei,PASSWORD_RESET:"PASSWORD_RESET",RECOVER_EMAIL:"RECOVER_EMAIL",REVERT_SECOND_FACTOR_ADDITION:ti,VERIFY_AND_CHANGE_EMAIL:ni,VERIFY_EMAIL:"VERIFY_EMAIL"}},Auth:Hh,AuthCredential:eo,Error:E};Bl(t,"EmailAuthProvider",Io,[]),Bl(t,"FacebookAuthProvider",fo,[]),Bl(t,"GithubAuthProvider",vo,[]),Bl(t,"GoogleAuthProvider",mo,[]),Bl(t,"TwitterAuthProvider",bo,[]),Bl(t,"OAuthProvider",lo,[Ol("providerId")]),Bl(t,"SAMLAuthProvider",ho,[Ol("providerId")]),Bl(t,"PhoneAuthProvider",xo,[{name:"auth",J:"an instance of Firebase Auth",optional:!0,K:function(t){return !!(t&&t instanceof Hh);}}]),Bl(t,"RecaptchaVerifier",Nl,[Ul(Ol(),{name:"",J:"an HTML element",optional:!1,K:function(t){return !!(t&&t instanceof Element);}},"recaptchaContainer"),Rl("recaptchaParameters",!0),{name:"app",J:"an instance of Firebase App",optional:!0,K:function(t){return !!(t&&t instanceof I.app.App);}}]),Bl(t,"ActionCodeURL",pi,[]),Bl(t,"PhoneMultiFactorGenerator",fl,[]),I.INTERNAL.registerComponent({name:"auth",instanceFactory:function(t){return new Hh(t=t.getProvider("app").getImmediate());},multipleInstances:!1,serviceProps:t,instantiationMode:"LAZY",type:"PUBLIC"}),I.INTERNAL.registerComponent({name:"auth-internal",instanceFactory:function(t){return {getUid:g((t=t.getProvider("auth").getImmediate()).getUid,t),getToken:g(t.kc,t),addAuthTokenListener:g(t.bc,t),removeAuthTokenListener:g(t.Nc,t)};},multipleInstances:!1,instantiationMode:"LAZY",type:"PRIVATE"}),I.registerVersion("@firebase/auth","0.14.6"),I.INTERNAL.extendNamespace({User:ah});}();}).apply("undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var A,k="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:{},N=N||{},S=k||self;function x(){}function O(t){var e=typeof t;if("object"==e){if(!t)return "null";if(t instanceof Array)return "array";if(t instanceof Object)return e;var n=Object.prototype.toString.call(t);if("[object Window]"==n)return "object";if("[object Array]"==n||"number"==typeof t.length&&void 0!==t.splice&&void 0!==t.propertyIsEnumerable&&!t.propertyIsEnumerable("splice"))return "array";if("[object Function]"==n||void 0!==t.call&&void 0!==t.propertyIsEnumerable&&!t.propertyIsEnumerable("call"))return "function";}else if("function"==e&&void 0===t.call)return "object";return e;}function D(t){var e=O(t);return "array"==e||"object"==e&&"number"==typeof t.length;}function R(t){var e=typeof t;return "object"==e&&null!=t||"function"==e;}var C="closure_uid_"+(1e9*Math.random()>>>0),P=0;function L(t,e,n){return t.call.apply(t.bind,arguments);}function M(t,e,n){if(!t)throw Error();if(2<arguments.length){var r=Array.prototype.slice.call(arguments,2);return function(){var n=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(n,r),t.apply(e,n);};}return function(){return t.apply(e,arguments);};}function j(t,e,n){return (j=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?L:M).apply(null,arguments);}function V(t,e){var n=Array.prototype.slice.call(arguments,1);return function(){var e=n.slice();return e.push.apply(e,arguments),t.apply(this,e);};}var U=Date.now||function(){return +new Date();};function F(t,e){function n(){}n.prototype=e.prototype,t.M=e.prototype,t.prototype=new n(),t.prototype.constructor=t;}function q(){this.j=this.j,this.i=this.i;}q.prototype.j=!1,q.prototype.da=function(){if(!this.j&&(this.j=!0,this.C(),0))(function(t){Object.prototype.hasOwnProperty.call(t,C)&&t[C]||(t[C]=++P);})(this);},q.prototype.C=function(){if(this.i)for(;this.i.length;)this.i.shift()();};var B=Array.prototype.indexOf?function(t,e){return Array.prototype.indexOf.call(t,e,void 0);}:function(t,e){if("string"==typeof t)return "string"!=typeof e||1!=e.length?-1:t.indexOf(e,0);for(var n=0;n<t.length;n++)if(n in t&&t[n]===e)return n;return -1;},z=Array.prototype.forEach?function(t,e,n){Array.prototype.forEach.call(t,e,n);}:function(t,e,n){for(var r=t.length,i="string"==typeof t?t.split(""):t,o=0;o<r;o++)o in i&&e.call(n,i[o],o,t);};function G(t){return Array.prototype.concat.apply([],arguments);}function W(t){var e=t.length;if(0<e){for(var n=Array(e),r=0;r<e;r++)n[r]=t[r];return n;}return [];}function H(t){return /^[\s\xa0]*$/.test(t);}var K,Y=String.prototype.trim?function(t){return t.trim();}:function(t){return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(t)[1];};function X(t,e){return -1!=t.indexOf(e);}function Q(t,e){return t<e?-1:t>e?1:0;}t:{var J=S.navigator;if(J){var $=J.userAgent;if($){K=$;break t;}}K="";}function Z(t,e,n){for(var r in t)e.call(n,t[r],r,t);}function tt(t){var e={};for(var n in t)e[n]=t[n];return e;}var et="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function nt(t,e){for(var n,r,i=1;i<arguments.length;i++){for(n in r=arguments[i])t[n]=r[n];for(var o=0;o<et.length;o++)n=et[o],Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n]);}}function rt(t){return rt[" "](t),t;}rt[" "]=x;var it,ot=X(K,"Opera"),st=X(K,"Trident")||X(K,"MSIE"),at=X(K,"Edge"),ut=at||st,ct=X(K,"Gecko")&&!(X(K.toLowerCase(),"webkit")&&!X(K,"Edge"))&&!(X(K,"Trident")||X(K,"MSIE"))&&!X(K,"Edge"),ht=X(K.toLowerCase(),"webkit")&&!X(K,"Edge");function lt(){var t=S.document;return t?t.documentMode:void 0;}t:{var ft="",pt=function(){var t=K;return ct?/rv:([^\);]+)(\)|;)/.exec(t):at?/Edge\/([\d\.]+)/.exec(t):st?/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(t):ht?/WebKit\/(\S+)/.exec(t):ot?/(?:Version)[ \/]?(\S+)/.exec(t):void 0;}();if(pt&&(ft=pt?pt[1]:""),st){var dt=lt();if(null!=dt&&dt>parseFloat(ft)){it=String(dt);break t;}}it=ft;}var vt,yt={};function mt(t){return function(t,e){var n=yt;return Object.prototype.hasOwnProperty.call(n,t)?n[t]:n[t]=e(t);}(t,function(){for(var e=0,n=Y(String(it)).split("."),r=Y(String(t)).split("."),i=Math.max(n.length,r.length),o=0;0==e&&o<i;o++){var s=n[o]||"",a=r[o]||"";do{if(s=/(\d*)(\D*)(.*)/.exec(s)||["","","",""],a=/(\d*)(\D*)(.*)/.exec(a)||["","","",""],0==s[0].length&&0==a[0].length)break;e=Q(0==s[1].length?0:parseInt(s[1],10),0==a[1].length?0:parseInt(a[1],10))||Q(0==s[2].length,0==a[2].length)||Q(s[2],a[2]),s=s[3],a=a[3];}while(0==e);}return 0<=e;});}if(S.document&&st){var gt=lt();vt=gt||parseInt(it,10)||void 0;}else vt=void 0;var bt=vt,wt=!st||9<=Number(bt),_t=st&&!mt("9"),Et=function(){if(!S.addEventListener||!Object.defineProperty)return !1;var t=!1,e=Object.defineProperty({},"passive",{get:function(){t=!0;}});try{S.addEventListener("test",x,e),S.removeEventListener("test",x,e);}catch(t){}return t;}();function It(t,e){this.type=t,this.a=this.target=e,this.defaultPrevented=!1;}function Tt(t,e){if(It.call(this,t?t.type:""),this.relatedTarget=this.a=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.pointerId=0,this.pointerType="",this.c=null,t){var n=this.type=t.type,r=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:null;if(this.target=t.target||t.srcElement,this.a=e,e=t.relatedTarget){if(ct){t:{try{rt(e.nodeName);var i=!0;break t;}catch(t){}i=!1;}i||(e=null);}}else "mouseover"==n?e=t.fromElement:"mouseout"==n&&(e=t.toElement);this.relatedTarget=e,r?(this.clientX=void 0!==r.clientX?r.clientX:r.pageX,this.clientY=void 0!==r.clientY?r.clientY:r.pageY,this.screenX=r.screenX||0,this.screenY=r.screenY||0):(this.clientX=void 0!==t.clientX?t.clientX:t.pageX,this.clientY=void 0!==t.clientY?t.clientY:t.pageY,this.screenX=t.screenX||0,this.screenY=t.screenY||0),this.button=t.button,this.key=t.key||"",this.ctrlKey=t.ctrlKey,this.altKey=t.altKey,this.shiftKey=t.shiftKey,this.metaKey=t.metaKey,this.pointerId=t.pointerId||0,this.pointerType="string"==typeof t.pointerType?t.pointerType:At[t.pointerType]||"",this.c=t,t.defaultPrevented&&this.b();}}It.prototype.b=function(){this.defaultPrevented=!0;},F(Tt,It);var At={2:"touch",3:"pen",4:"mouse"};Tt.prototype.b=function(){Tt.M.b.call(this);var t=this.c;if(t.preventDefault)t.preventDefault();else if(t.returnValue=!1,_t)try{(t.ctrlKey||112<=t.keyCode&&123>=t.keyCode)&&(t.keyCode=-1);}catch(t){}};var kt="closure_listenable_"+(1e6*Math.random()|0),Nt=0;function St(t,e,n,r,i){this.listener=t,this.proxy=null,this.src=e,this.type=n,this.capture=!!r,this.aa=i,this.key=++Nt,this.V=this.X=!1;}function xt(t){t.V=!0,t.listener=null,t.proxy=null,t.src=null,t.aa=null;}function Ot(t){this.src=t,this.a={},this.b=0;}function Dt(t,e){var n=e.type;if(n in t.a){var r,i=t.a[n],o=B(i,e);(r=0<=o)&&Array.prototype.splice.call(i,o,1),r&&(xt(e),0==t.a[n].length&&(delete t.a[n],t.b--));}}function Rt(t,e,n,r){for(var i=0;i<t.length;++i){var o=t[i];if(!o.V&&o.listener==e&&o.capture==!!n&&o.aa==r)return i;}return -1;}Ot.prototype.add=function(t,e,n,r,i){var o=t.toString();(t=this.a[o])||(t=this.a[o]=[],this.b++);var s=Rt(t,e,r,i);return -1<s?(e=t[s],n||(e.X=!1)):((e=new St(e,this.src,o,!!r,i)).X=n,t.push(e)),e;};var Ct="closure_lm_"+(1e6*Math.random()|0),Pt={};function Lt(t,e,n,r,i){if(r&&r.once)return function t(e,n,r,i,o){if(Array.isArray(n)){for(var s=0;s<n.length;s++)t(e,n[s],r,i,o);return null;}return r=zt(r),e&&e[kt]?e.sa(n,r,R(i)?!!i.capture:!!i,o):Mt(e,n,r,!0,i,o);}(t,e,n,r,i);if(Array.isArray(e)){for(var o=0;o<e.length;o++)Lt(t,e[o],n,r,i);return null;}return n=zt(n),t&&t[kt]?t.ra(e,n,R(r)?!!r.capture:!!r,i):Mt(t,e,n,!1,r,i);}function Mt(t,e,n,r,i,o){if(!e)throw Error("Invalid event type");var s=R(i)?!!i.capture:!!i;if(s&&!wt)return null;var a=qt(t);if(a||(t[Ct]=a=new Ot(t)),(n=a.add(e,n,r,s,o)).proxy)return n;if(r=function(){var t=Ft,e=wt?function(n){return t.call(e.src,e.listener,n);}:function(n){if(!(n=t.call(e.src,e.listener,n)))return n;};return e;}(),n.proxy=r,r.src=t,r.listener=n,t.addEventListener)Et||(i=s),void 0===i&&(i=!1),t.addEventListener(e.toString(),r,i);else if(t.attachEvent)t.attachEvent(Vt(e.toString()),r);else {if(!t.addListener||!t.removeListener)throw Error("addEventListener and attachEvent are unavailable.");t.addListener(r);}return n;}function jt(t){if("number"!=typeof t&&t&&!t.V){var e=t.src;if(e&&e[kt])Dt(e.c,t);else {var n=t.type,r=t.proxy;e.removeEventListener?e.removeEventListener(n,r,t.capture):e.detachEvent?e.detachEvent(Vt(n),r):e.addListener&&e.removeListener&&e.removeListener(r),(n=qt(e))?(Dt(n,t),0==n.b&&(n.src=null,e[Ct]=null)):xt(t);}}}function Vt(t){return t in Pt?Pt[t]:Pt[t]="on"+t;}function Ut(t,e){var n=t.listener,r=t.aa||t.src;return t.X&&jt(t),n.call(r,e);}function Ft(t,e){if(t.V)return !0;if(!wt){if(!e)t:{e=["window","event"];for(var n=S,r=0;r<e.length;r++)if(null==(n=n[e[r]])){e=null;break t;}e=n;}return Ut(t,e=new Tt(e,this));}return Ut(t,new Tt(e,this));}function qt(t){return (t=t[Ct])instanceof Ot?t:null;}var Bt="__closure_events_fn_"+(1e9*Math.random()>>>0);function zt(t){return "function"==O(t)?t:(t[Bt]||(t[Bt]=function(e){return t.handleEvent(e);}),t[Bt]);}function Gt(){q.call(this),this.c=new Ot(this),this.J=this,this.A=null;}function Wt(t,e,n,r){if(!(e=t.c.a[String(e)]))return !0;e=e.concat();for(var i=!0,o=0;o<e.length;++o){var s=e[o];if(s&&!s.V&&s.capture==n){var a=s.listener,u=s.aa||s.src;s.X&&Dt(t.c,s),i=!1!==a.call(u,r)&&i;}}return i&&!r.defaultPrevented;}F(Gt,q),Gt.prototype[kt]=!0,(A=Gt.prototype).addEventListener=function(t,e,n,r){Lt(this,t,e,n,r);},A.removeEventListener=function(t,e,n,r){!function t(e,n,r,i,o){if(Array.isArray(n))for(var s=0;s<n.length;s++)t(e,n[s],r,i,o);else i=R(i)?!!i.capture:!!i,r=zt(r),e&&e[kt]?(e=e.c,(n=String(n).toString())in e.a&&-1<(r=Rt(s=e.a[n],r,i,o))&&(xt(s[r]),Array.prototype.splice.call(s,r,1),0==s.length&&(delete e.a[n],e.b--))):e&&(e=qt(e))&&(n=e.a[n.toString()],e=-1,n&&(e=Rt(n,r,i,o)),(r=-1<e?n[e]:null)&&jt(r));}(this,t,e,n,r);},A.dispatchEvent=function(t){var e,n=this.A;if(n)for(e=[];n;n=n.A)e.push(n);n=this.J;var r=t.type||t;if("string"==typeof t)t=new It(t,n);else if(t instanceof It)t.target=t.target||n;else {var i=t;nt(t=new It(r,n),i);}if(i=!0,e)for(var o=e.length-1;0<=o;o--){var s=t.a=e[o];i=Wt(s,r,!0,t)&&i;}if(i=Wt(s=t.a=n,r,!0,t)&&i,i=Wt(s,r,!1,t)&&i,e)for(o=0;o<e.length;o++)i=Wt(s=t.a=e[o],r,!1,t)&&i;return i;},A.C=function(){if(Gt.M.C.call(this),this.c){var t,e=this.c;for(t in e.a){for(var n=e.a[t],r=0;r<n.length;r++)xt(n[r]);delete e.a[t],e.b--;}}this.A=null;},A.ra=function(t,e,n,r){return this.c.add(String(t),e,!1,n,r);},A.sa=function(t,e,n,r){return this.c.add(String(t),e,!0,n,r);};var Ht=S.JSON.stringify;function Kt(){this.b=this.a=null;}var Yt,Xt=new(function(){function t(t,e,n){this.f=n,this.c=t,this.g=e,this.b=0,this.a=null;}return t.prototype.get=function(){var t;return 0<this.b?(this.b--,t=this.a,this.a=t.next,t.next=null):t=this.c(),t;},t;}())(function(){return new Jt();},function(t){t.reset();},100);function Qt(){var t=ee,e=null;return t.a&&(e=t.a,t.a=t.a.next,t.a||(t.b=null),e.next=null),e;}function Jt(){this.next=this.b=this.a=null;}function $t(t){S.setTimeout(function(){throw t;},0);}function Zt(t,e){Yt||function(){var t=S.Promise.resolve(void 0);Yt=function(){t.then(ne);};}(),te||(Yt(),te=!0),ee.add(t,e);}Kt.prototype.add=function(t,e){var n=Xt.get();n.set(t,e),this.b?this.b.next=n:this.a=n,this.b=n;},Jt.prototype.set=function(t,e){this.a=t,this.b=e,this.next=null;},Jt.prototype.reset=function(){this.next=this.b=this.a=null;};var te=!1,ee=new Kt();function ne(){for(var t;t=Qt();){try{t.a.call(t.b);}catch(t){$t(t);}var e=Xt;e.g(t),e.b<e.f&&(e.b++,t.next=e.a,e.a=t);}te=!1;}function re(t,e){Gt.call(this),this.b=t||1,this.a=e||S,this.f=j(this.Ua,this),this.g=U();}function ie(t){t.Z=!1,t.L&&(t.a.clearTimeout(t.L),t.L=null);}function oe(t,e,n){if("function"==O(t))n&&(t=j(t,n));else {if(!t||"function"!=typeof t.handleEvent)throw Error("Invalid listener argument");t=j(t.handleEvent,t);}return 2147483647<Number(e)?-1:S.setTimeout(t,e||0);}function se(t,e,n){q.call(this),this.f=null!=n?j(t,n):t,this.c=e,this.b=j(this.Pa,this),this.a=[];}function ae(t){t.T=oe(t.b,t.c),t.f.apply(null,t.a);}function ue(t){q.call(this),this.b=t,this.a={};}F(re,Gt),(A=re.prototype).Z=!1,A.L=null,A.Ua=function(){if(this.Z){var t=U()-this.g;0<t&&t<.8*this.b?this.L=this.a.setTimeout(this.f,this.b-t):(this.L&&(this.a.clearTimeout(this.L),this.L=null),this.dispatchEvent("tick"),this.Z&&(ie(this),this.start()));}},A.start=function(){this.Z=!0,this.L||(this.L=this.a.setTimeout(this.f,this.b),this.g=U());},A.C=function(){re.M.C.call(this),ie(this),delete this.a;},F(se,q),(A=se.prototype).ba=!1,A.T=null,A.Ia=function(t){this.a=arguments,this.T?this.ba=!0:ae(this);},A.C=function(){se.M.C.call(this),this.T&&(S.clearTimeout(this.T),this.T=null,this.ba=!1,this.a=[]);},A.Pa=function(){this.T=null,this.ba&&(this.ba=!1,ae(this));},F(ue,q);var ce=[];function he(t,e,n,r){Array.isArray(n)||(n&&(ce[0]=n.toString()),n=ce);for(var i=0;i<n.length;i++){var o=Lt(e,n[i],r||t.handleEvent,!1,t.b||t);if(!o)break;t.a[o.key]=o;}}function le(t){Z(t.a,function(t,e){this.a.hasOwnProperty(e)&&jt(t);},t),t.a={};}function fe(){}ue.prototype.C=function(){ue.M.C.call(this),le(this);},ue.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented");};var pe=null;function de(){return pe=pe||new Gt();}function ve(t){It.call(this,"serverreachability",t);}function ye(t){var e=de();e.dispatchEvent(new ve(e,t));}function me(t){It.call(this,"statevent",t);}function ge(t){var e=de();e.dispatchEvent(new me(e,t));}function be(t){It.call(this,"timingevent",t);}function we(t,e){if("function"!=O(t))throw Error("Fn must not be null and must be a function");return S.setTimeout(function(){t();},e);}F(ve,It),F(me,It),F(be,It);var _e={NO_ERROR:0,Va:1,bb:2,ab:3,Ya:4,$a:5,cb:6,za:7,TIMEOUT:8,gb:9},Ee={Xa:"complete",kb:"success",Aa:"error",za:"abort",ib:"ready",jb:"readystatechange",TIMEOUT:"timeout",eb:"incrementaldata",hb:"progress",Za:"downloadprogress",lb:"uploadprogress"};function Ie(){}function Te(t){var e;return (e=t.a)||(e=t.a={}),e;}function Ae(){}Ie.prototype.a=null;var ke,Ne={OPEN:"a",Wa:"b",Aa:"c",fb:"d"};function Se(){It.call(this,"d");}function xe(){It.call(this,"c");}function Oe(){}function De(t,e,n){this.g=t,this.W=e,this.U=n||1,this.G=new ue(this),this.N=Re,t=ut?125:void 0,this.O=new re(t),this.m=null,this.b=!1,this.j=this.A=this.f=this.B=this.s=this.P=this.h=null,this.i=[],this.a=null,this.w=0,this.c=this.v=null,this.H=-1,this.l=!1,this.J=0,this.D=null,this.o=this.R=this.F=!1;}F(Se,It),F(xe,It),F(Oe,Ie),ke=new Oe();var Re=45e3,Ce={},Pe={};function Le(t,e,n){t.B=1,t.f=rn(Je(e)),t.j=n,t.F=!0,Me(t,null);}function Me(t,e){t.s=U(),Ue(t),t.A=Je(t.f);var n=t.A,r=t.U;Array.isArray(r)||(r=[String(r)]),mn(n.b,"t",r),t.w=0,t.a=ur(t.g,t.g.w?e:null),0<t.J&&(t.D=new se(j(t.ya,t,t.a),t.J)),he(t.G,t.a,"readystatechange",t.Sa),e=t.m?tt(t.m):{},t.j?(t.v||(t.v="POST"),e["Content-Type"]="application/x-www-form-urlencoded",t.a.$(t.A,t.v,t.j,e)):(t.v="GET",t.a.$(t.A,t.v,null,e)),ye(1);}function je(t,e,n){for(var r=!0;!t.l&&t.w<n.length;){var i=Ve(t,n);if(i==Pe){4==e&&(t.c=4,ge(14),r=!1);break;}if(i==Ce){t.c=4,ge(15),r=!1;break;}Ge(t,i);}4==e&&0==n.length&&(t.c=1,ge(16),r=!1),t.b=t.b&&r,r||(ze(t),Be(t));}function Ve(t,e){var n=t.w,r=e.indexOf("\n",n);return -1==r?Pe:(n=Number(e.substring(n,r)),isNaN(n)?Ce:(r+=1)+n>e.length?Pe:(e=e.substr(r,n),t.w=r+n,e));}function Ue(t){t.P=U()+t.N,Fe(t,t.N);}function Fe(t,e){if(null!=t.h)throw Error("WatchDog timer not null");t.h=we(j(t.Qa,t),e);}function qe(t){t.h&&(S.clearTimeout(t.h),t.h=null);}function Be(t){0==t.g.u||t.l||rr(t.g,t);}function ze(t){qe(t);var e=t.D;e&&"function"==typeof e.da&&e.da(),t.D=null,ie(t.O),le(t.G),t.a&&(e=t.a,t.a=null,e.abort(),e.da());}function Ge(t,e){try{var n=t.g;if(0!=n.u&&(n.a==t||Tn(n.b,t)))if(n.A=t.H,!t.o&&Tn(n.b,t)&&3==n.u){try{var r=n.ja.a.parse(e);}catch(t){r=null;}if(Array.isArray(r)&&3==r.length){var i=r;if(0==i[0]){t:if(!n.i){if(n.a){if(!(n.a.s+3e3<t.s))break t;nr(n),n.a.cancel(),n.a=null;}er(n),ge(18);}}else n.ia=i[1],0<n.ia-n.G&&37500>i[2]&&n.U&&0==n.m&&!n.l&&(n.l=we(j(n.Na,n),6e3));if(1>=In(n.b)&&n.O){try{n.O();}catch(t){}n.O=void 0;}}else or(n,11);}else if((t.o||n.a==t)&&nr(n),!H(e))for(e=r=n.ja.a.parse(e),r=0;r<e.length;r++)if(i=e[r],n.G=i[0],i=i[1],2==n.u){if("c"==i[0]){n.B=i[1],n.R=i[2];var o=i[3];null!=o&&(n.oa=o);var s=i[5];null!=s&&"number"==typeof s&&0<s&&(n.D=1.5*s);var a=n,u=t.a;if(u){var c=u.a?u.a.getResponseHeader("X-Client-Wire-Protocol"):null;if(c){var h=a.b;!h.a&&(X(c,"spdy")||X(c,"quic")||X(c,"h2"))&&(h.f=h.g,h.a=new Set(),h.b&&(An(h,h.b),h.b=null));}if(a.s){var l=u.a?u.a.getResponseHeader("X-HTTP-Session-Id"):null;l&&(a.ha=l,nn(a.v,a.s,l));}}n.u=3,n.c&&n.c.na();var f=t;if((a=n).ea=ar(a,a.w?a.R:null,a.P),f.o){kn(a.b,f);var p=f,d=a.D;d&&p.setTimeout(d),p.h&&(qe(p),Ue(p)),a.a=f;}else tr(a);0<n.f.length&&Qn(n);}else "stop"!=i[0]&&"close"!=i[0]||or(n,7);}else 3==n.u&&("stop"==i[0]||"close"==i[0]?"stop"==i[0]?or(n,7):Kn(n):"noop"!=i[0]&&n.c&&n.c.ma(i),n.m=0);ye(4);}catch(t){}}function We(t,e){if(t.forEach&&"function"==typeof t.forEach)t.forEach(e,void 0);else if(D(t)||"string"==typeof t)z(t,e,void 0);else {if(t.K&&"function"==typeof t.K)var n=t.K();else if(t.I&&"function"==typeof t.I)n=void 0;else if(D(t)||"string"==typeof t){n=[];for(var r=t.length,i=0;i<r;i++)n.push(i);}else for(i in n=[],r=0,t)n[r++]=i;i=(r=function(t){if(t.I&&"function"==typeof t.I)return t.I();if("string"==typeof t)return t.split("");if(D(t)){for(var e=[],n=t.length,r=0;r<n;r++)e.push(t[r]);return e;}for(r in e=[],n=0,t)e[n++]=t[r];return e;}(t)).length;for(var o=0;o<i;o++)e.call(void 0,r[o],n&&n[o],t);}}function He(t,e){this.b={},this.a=[],this.c=0;var n=arguments.length;if(1<n){if(n%2)throw Error("Uneven number of arguments");for(var r=0;r<n;r+=2)this.set(arguments[r],arguments[r+1]);}else if(t)if(t instanceof He)for(n=t.K(),r=0;r<n.length;r++)this.set(n[r],t.get(n[r]));else for(r in t)this.set(r,t[r]);}function Ke(t){if(t.c!=t.a.length){for(var e=0,n=0;e<t.a.length;){var r=t.a[e];Ye(t.b,r)&&(t.a[n++]=r),e++;}t.a.length=n;}if(t.c!=t.a.length){var i={};for(n=e=0;e<t.a.length;)Ye(i,r=t.a[e])||(t.a[n++]=r,i[r]=1),e++;t.a.length=n;}}function Ye(t,e){return Object.prototype.hasOwnProperty.call(t,e);}(A=De.prototype).setTimeout=function(t){this.N=t;},A.Sa=function(t){t=t.target;var e=this.D;e&&3==zn(t)?e.Ia():this.ya(t);},A.ya=function(t){try{if(t==this.a)t:{var e=zn(this.a),n=this.a.qa(),r=this.a.S();if(!(3>e||3==e&&!ut&&!this.a.Y())){this.l||4!=e||7==n||ye(8==n||0>=r?3:2),qe(this);var i=this.a.S();this.H=i;var o=this.a.Y();if(this.b=200==i){if(this.R&&!this.o){e:{if(this.a){var s,a=this.a;if((s=a.a?a.a.getResponseHeader("X-HTTP-Initial-Response"):null)&&!H(s)){var u=s;break e;}}u=null;}if(!u){this.b=!1,this.c=3,ge(12),ze(this),Be(this);break t;}this.o=!0,Ge(this,u);}this.F?(je(this,e,o),ut&&this.b&&3==e&&(he(this.G,this.O,"tick",this.Ra),this.O.start())):Ge(this,o),4==e&&ze(this),this.b&&!this.l&&(4==e?rr(this.g,this):(this.b=!1,Ue(this)));}else 400==i&&0<o.indexOf("Unknown SID")?(this.c=3,ge(12)):(this.c=0,ge(13)),ze(this),Be(this);}}}catch(t){}},A.Ra=function(){if(this.a){var t=zn(this.a),e=this.a.Y();this.w<e.length&&(qe(this),je(this,t,e),this.b&&4!=t&&Ue(this));}},A.cancel=function(){this.l=!0,ze(this);},A.Qa=function(){this.h=null;var t=U();0<=t-this.P?(2!=this.B&&(ye(3),ge(17)),ze(this),this.c=2,Be(this)):Fe(this,this.P-t);},(A=He.prototype).I=function(){Ke(this);for(var t=[],e=0;e<this.a.length;e++)t.push(this.b[this.a[e]]);return t;},A.K=function(){return Ke(this),this.a.concat();},A.get=function(t,e){return Ye(this.b,t)?this.b[t]:e;},A.set=function(t,e){Ye(this.b,t)||(this.c++,this.a.push(t)),this.b[t]=e;},A.forEach=function(t,e){for(var n=this.K(),r=0;r<n.length;r++){var i=n[r],o=this.get(i);t.call(e,o,i,this);}};var Xe=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^\\/?#]*)@)?([^\\/?#]*?)(?::([0-9]+))?(?=[\\/?#]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;function Qe(t,e){if(this.c=this.j=this.f="",this.h=null,this.i=this.g="",this.a=!1,t instanceof Qe){this.a=void 0!==e?e:t.a,$e(this,t.f),this.j=t.j,Ze(this,t.c),tn(this,t.h),this.g=t.g,e=t.b;var n=new pn();n.c=e.c,e.a&&(n.a=new He(e.a),n.b=e.b),en(this,n),this.i=t.i;}else t&&(n=String(t).match(Xe))?(this.a=!!e,$e(this,n[1]||"",!0),this.j=on(n[2]||""),Ze(this,n[3]||"",!0),tn(this,n[4]),this.g=on(n[5]||"",!0),en(this,n[6]||"",!0),this.i=on(n[7]||"")):(this.a=!!e,this.b=new pn(null,this.a));}function Je(t){return new Qe(t);}function $e(t,e,n){t.f=n?on(e,!0):e,t.f&&(t.f=t.f.replace(/:$/,""));}function Ze(t,e,n){t.c=n?on(e,!0):e;}function tn(t,e){if(e){if(e=Number(e),isNaN(e)||0>e)throw Error("Bad port number "+e);t.h=e;}else t.h=null;}function en(t,e,n){e instanceof pn?(t.b=e,function(t,e){e&&!t.f&&(dn(t),t.c=null,t.a.forEach(function(t,e){var n=e.toLowerCase();e!=n&&(vn(this,e),mn(this,n,t));},t)),t.f=e;}(t.b,t.a)):(n||(e=sn(e,ln)),t.b=new pn(e,t.a));}function nn(t,e,n){t.b.set(e,n);}function rn(t){return nn(t,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^U()).toString(36)),t;}function on(t,e){return t?e?decodeURI(t.replace(/%25/g,"%2525")):decodeURIComponent(t):"";}function sn(t,e,n){return "string"==typeof t?(t=encodeURI(t).replace(e,an),n&&(t=t.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),t):null;}function an(t){return "%"+((t=t.charCodeAt(0))>>4&15).toString(16)+(15&t).toString(16);}Qe.prototype.toString=function(){var t=[],e=this.f;e&&t.push(sn(e,un,!0),":");var n=this.c;return (n||"file"==e)&&(t.push("//"),(e=this.j)&&t.push(sn(e,un,!0),"@"),t.push(encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(n=this.h)&&t.push(":",String(n))),(n=this.g)&&(this.c&&"/"!=n.charAt(0)&&t.push("/"),t.push(sn(n,"/"==n.charAt(0)?hn:cn,!0))),(n=this.b.toString())&&t.push("?",n),(n=this.i)&&t.push("#",sn(n,fn)),t.join("");};var un=/[#\/\?@]/g,cn=/[#\?:]/g,hn=/[#\?]/g,ln=/[#\?@]/g,fn=/#/g;function pn(t,e){this.b=this.a=null,this.c=t||null,this.f=!!e;}function dn(t){t.a||(t.a=new He(),t.b=0,t.c&&function(t,e){if(t){t=t.split("&");for(var n=0;n<t.length;n++){var r=t[n].indexOf("="),i=null;if(0<=r){var o=t[n].substring(0,r);i=t[n].substring(r+1);}else o=t[n];e(o,i?decodeURIComponent(i.replace(/\+/g," ")):"");}}}(t.c,function(e,n){t.add(decodeURIComponent(e.replace(/\+/g," ")),n);}));}function vn(t,e){dn(t),e=gn(t,e),Ye(t.a.b,e)&&(t.c=null,t.b-=t.a.get(e).length,Ye((t=t.a).b,e)&&(delete t.b[e],t.c--,t.a.length>2*t.c&&Ke(t)));}function yn(t,e){return dn(t),e=gn(t,e),Ye(t.a.b,e);}function mn(t,e,n){vn(t,e),0<n.length&&(t.c=null,t.a.set(gn(t,e),W(n)),t.b+=n.length);}function gn(t,e){return e=String(e),t.f&&(e=e.toLowerCase()),e;}function bn(t,e){this.b=t,this.a=e;}function wn(t){this.g=t||_n,S.PerformanceNavigationTiming?t=0<(t=S.performance.getEntriesByType("navigation")).length&&("hq"==t[0].nextHopProtocol||"h2"==t[0].nextHopProtocol):t=!!(S.ca&&S.ca.ua&&S.ca.ua()&&S.ca.ua().mb),this.f=t?this.g:1,this.a=null,1<this.f&&(this.a=new Set()),this.b=null,this.c=[];}(A=pn.prototype).add=function(t,e){dn(this),this.c=null,t=gn(this,t);var n=this.a.get(t);return n||this.a.set(t,n=[]),n.push(e),this.b+=1,this;},A.forEach=function(t,e){dn(this),this.a.forEach(function(n,r){z(n,function(n){t.call(e,n,r,this);},this);},this);},A.K=function(){dn(this);for(var t=this.a.I(),e=this.a.K(),n=[],r=0;r<e.length;r++)for(var i=t[r],o=0;o<i.length;o++)n.push(e[r]);return n;},A.I=function(t){dn(this);var e=[];if("string"==typeof t)yn(this,t)&&(e=G(e,this.a.get(gn(this,t))));else {t=this.a.I();for(var n=0;n<t.length;n++)e=G(e,t[n]);}return e;},A.set=function(t,e){return dn(this),this.c=null,yn(this,t=gn(this,t))&&(this.b-=this.a.get(t).length),this.a.set(t,[e]),this.b+=1,this;},A.get=function(t,e){return t&&0<(t=this.I(t)).length?String(t[0]):e;},A.toString=function(){if(this.c)return this.c;if(!this.a)return "";for(var t=[],e=this.a.K(),n=0;n<e.length;n++){var r=e[n],i=encodeURIComponent(String(r));r=this.I(r);for(var o=0;o<r.length;o++){var s=i;""!==r[o]&&(s+="="+encodeURIComponent(String(r[o]))),t.push(s);}}return this.c=t.join("&");};var _n=10;function En(t){return !!t.b||!!t.a&&t.a.size>=t.f;}function In(t){return t.b?1:t.a?t.a.size:0;}function Tn(t,e){return t.b?t.b==e:!!t.a&&t.a.has(e);}function An(t,e){t.a?t.a.add(e):t.b=e;}function kn(t,e){t.b&&t.b==e?t.b=null:t.a&&t.a.has(e)&&t.a.delete(e);}function Nn(t){var e,n;if(null!=t.b)return t.c.concat(t.b.i);if(null!=t.a&&0!==t.a.size){var r=t.c;try{for(var i=T(t.a.values()),o=i.next();!o.done;o=i.next()){var s=o.value;r=r.concat(s.i);}}catch(t){e={error:t};}finally{try{o&&!o.done&&(n=i.return)&&n.call(i);}finally{if(e)throw e.error;}}return r;}return W(t.c);}function Sn(){}function xn(){this.a=new Sn();}function On(t,e,n){var r=n||"";try{We(t,function(t,n){var i=t;R(t)&&(i=Ht(t)),e.push(r+n+"="+encodeURIComponent(i));});}catch(t){throw e.push(r+"type="+encodeURIComponent("_badmap")),t;}}function Dn(t,e,n,r,i){try{e.onload=null,e.onerror=null,e.onabort=null,e.ontimeout=null,i(r);}catch(t){}}wn.prototype.cancel=function(){var t,e;if(this.c=Nn(this),this.b)this.b.cancel(),this.b=null;else if(this.a&&0!==this.a.size){try{for(var n=T(this.a.values()),r=n.next();!r.done;r=n.next()){r.value.cancel();}}catch(e){t={error:e};}finally{try{r&&!r.done&&(e=n.return)&&e.call(n);}finally{if(t)throw t.error;}}this.a.clear();}},Sn.prototype.stringify=function(t){return S.JSON.stringify(t,void 0);},Sn.prototype.parse=function(t){return S.JSON.parse(t,void 0);};var Rn=S.JSON.parse;function Cn(t){Gt.call(this),this.headers=new He(),this.G=t||null,this.b=!1,this.s=this.a=null,this.D="",this.h=0,this.f="",this.g=this.w=this.l=this.v=!1,this.o=0,this.m=null,this.H=Pn,this.B=this.F=!1;}F(Cn,Gt);var Pn="",Ln=/^https?$/i,Mn=["POST","PUT"];function jn(t){return "content-type"==t.toLowerCase();}function Vn(t,e){t.b=!1,t.a&&(t.g=!0,t.a.abort(),t.g=!1),t.f=e,t.h=5,Un(t),qn(t);}function Un(t){t.v||(t.v=!0,t.dispatchEvent("complete"),t.dispatchEvent("error"));}function Fn(t){if(t.b&&void 0!==N&&(!t.s[1]||4!=zn(t)||2!=t.S()))if(t.l&&4==zn(t))oe(t.va,0,t);else if(t.dispatchEvent("readystatechange"),4==zn(t)){t.b=!1;try{var e,n=t.S();t:switch(n){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var r=!0;break t;default:r=!1;}if(!(e=r)){var i;if(i=0===n){var o=String(t.D).match(Xe)[1]||null;if(!o&&S.self&&S.self.location){var s=S.self.location.protocol;o=s.substr(0,s.length-1);}i=!Ln.test(o?o.toLowerCase():"");}e=i;}if(e)t.dispatchEvent("complete"),t.dispatchEvent("success");else {t.h=6;try{var a=2<zn(t)?t.a.statusText:"";}catch(t){a="";}t.f=a+" ["+t.S()+"]",Un(t);}}finally{qn(t);}}}function qn(t,e){if(t.a){Bn(t);var n=t.a,r=t.s[0]?x:null;t.a=null,t.s=null,e||t.dispatchEvent("ready");try{n.onreadystatechange=r;}catch(t){}}}function Bn(t){t.a&&t.B&&(t.a.ontimeout=null),t.m&&(S.clearTimeout(t.m),t.m=null);}function zn(t){return t.a?t.a.readyState:0;}function Gn(t,e,n){t:{for(r in n){var r=!1;break t;}r=!0;}r||(n=function(t){var e="";return Z(t,function(t,n){e+=n,e+=":",e+=t,e+="\r\n";}),e;}(n),"string"==typeof t?null!=n&&encodeURIComponent(String(n)):nn(t,e,n));}function Wn(t,e,n){return n&&n.internalChannelParams&&n.internalChannelParams[t]||e;}function Hn(t){this.f=[],this.R=this.ea=this.v=this.P=this.a=this.ha=this.s=this.N=this.h=this.F=this.j=null,this.Fa=this.H=0,this.Ca=Wn("failFast",!1,t),this.U=this.l=this.i=this.g=this.c=null,this.W=!0,this.A=this.ia=this.G=-1,this.J=this.m=this.o=0,this.Ba=Wn("baseRetryDelayMs",5e3,t),this.Ga=Wn("retryDelaySeedMs",1e4,t),this.Da=Wn("forwardChannelMaxRetries",2,t),this.ga=Wn("forwardChannelRequestTimeoutMs",2e4,t),this.Ea=t&&t.nb||void 0,this.D=void 0,this.w=t&&t.supportsCrossDomainXhr||!1,this.B="",this.b=new wn(t&&t.concurrentRequestLimit),this.ja=new xn(),this.fa=t&&t.fastHandshake||!1,t&&t.forceLongPolling&&(this.W=!1),this.O=void 0;}function Kn(t){if(Yn(t),3==t.u){var e=t.H++,n=Je(t.v);nn(n,"SID",t.B),nn(n,"RID",e),nn(n,"TYPE","terminate"),$n(t,n),(e=new De(t,e,void 0)).B=2,e.f=rn(Je(n)),n=!1,S.navigator&&S.navigator.sendBeacon&&(n=S.navigator.sendBeacon(e.f.toString(),"")),!n&&S.Image&&(new Image().src=e.f,n=!0),n||(e.a=ur(e.g,null),e.a.$(e.f)),e.s=U(),Ue(e);}sr(t);}function Yn(t){t.a&&(t.a.cancel(),t.a=null),t.i&&(S.clearTimeout(t.i),t.i=null),nr(t),t.b.cancel(),t.g&&("number"==typeof t.g&&S.clearTimeout(t.g),t.g=null);}function Xn(t,e){t.f.push(new bn(t.Fa++,e)),3==t.u&&Qn(t);}function Qn(t){En(t.b)||t.g||(t.g=!0,Zt(t.xa,t),t.o=0);}function Jn(t,e){var n;n=e?e.W:t.H++;var r=Je(t.v);nn(r,"SID",t.B),nn(r,"RID",n),nn(r,"AID",t.G),$n(t,r),t.h&&t.j&&Gn(r,t.h,t.j),n=new De(t,n,t.o+1),null===t.h&&(n.m=t.j),e&&(t.f=e.i.concat(t.f)),e=Zn(t,n,1e3),n.setTimeout(Math.round(.5*t.ga)+Math.round(.5*t.ga*Math.random())),An(t.b,n),Le(n,r,e);}function $n(t,e){t.c&&We({},function(t,n){nn(e,n,t);});}function Zn(t,e,n){n=Math.min(t.f.length,n);var r=t.c?j(t.c.Ha,t.c,t):null;t:for(var i=t.f,o=-1;;){var s=["count="+n];-1==o?0<n?(o=i[0].b,s.push("ofs="+o)):o=0:s.push("ofs="+o);for(var a=!0,u=0;u<n;u++){var c=i[u].b,h=i[u].a;if(0>(c-=o))o=Math.max(0,i[u].b-100),a=!1;else try{On(h,s,"req"+c+"_");}catch(t){r&&r(h);}}if(a){r=s.join("&");break t;}}return t=t.f.splice(0,n),e.i=t,r;}function tr(t){t.a||t.i||(t.J=1,Zt(t.wa,t),t.m=0);}function er(t){return !(t.a||t.i||3<=t.m)&&(t.J++,t.i=we(j(t.wa,t),ir(t,t.m)),t.m++,!0);}function nr(t){null!=t.l&&(S.clearTimeout(t.l),t.l=null);}function rr(t,e){var n=null;if(t.a==e){nr(t),t.a=null;var r=2;}else {if(!Tn(t.b,e))return;n=e.i,kn(t.b,e),r=1;}if(t.A=e.H,0!=t.u)if(e.b){if(1==r){n=e.j?e.j.length:0,e=U()-e.s;var i=t.o;(r=de()).dispatchEvent(new be(r,n,e,i)),Qn(t);}else tr(t);}else if(3==(i=e.c)||0==i&&0<t.A||!(1==r&&function(t,e){return !(In(t.b)>=t.b.f-(t.g?1:0))&&(t.g?(t.f=e.i.concat(t.f),!0):!(1==t.u||2==t.u||t.o>=(t.Ca?0:t.Da))&&(t.g=we(j(t.xa,t,e),ir(t,t.o)),t.o++,!0));}(t,e)||2==r&&er(t)))switch(n&&0<n.length&&(e=t.b,e.c=e.c.concat(n)),i){case 1:or(t,5);break;case 4:or(t,10);break;case 3:or(t,6);break;default:or(t,2);}}function ir(t,e){var n=t.Ba+Math.floor(Math.random()*t.Ga);return t.c||(n*=2),n*e;}function or(t,e){if(2==e){var n=null;t.c&&(n=null);var r=j(t.Ta,t);n||(n=new Qe("//www.google.com/images/cleardot.gif"),S.location&&"http"==S.location.protocol||$e(n,"https"),rn(n)),function(t,e){var n=new fe();if(S.Image){var r=new Image();r.onload=V(Dn,n,r,"TestLoadImage: loaded",!0,e),r.onerror=V(Dn,n,r,"TestLoadImage: error",!1,e),r.onabort=V(Dn,n,r,"TestLoadImage: abort",!1,e),r.ontimeout=V(Dn,n,r,"TestLoadImage: timeout",!1,e),S.setTimeout(function(){r.ontimeout&&r.ontimeout();},1e4),r.src=t;}else e(!1);}(n.toString(),r);}else ge(2);t.u=0,t.c&&t.c.la(e),sr(t),Yn(t);}function sr(t){t.u=0,t.A=-1,t.c&&(0==Nn(t.b).length&&0==t.f.length||(t.b.c.length=0,W(t.f),t.f.length=0),t.c.ka());}function ar(t,e,n){var r=function(t){return t instanceof Qe?Je(t):new Qe(t,void 0);}(n);if(""!=r.c)e&&Ze(r,e+"."+r.c),tn(r,r.h);else {var i=S.location;r=function(t,e,n,r){var i=new Qe(null,void 0);return t&&$e(i,t),e&&Ze(i,e),n&&tn(i,n),r&&(i.g=r),i;}(i.protocol,e?e+"."+i.hostname:i.hostname,+i.port,n);}return t.N&&Z(t.N,function(t,e){nn(r,e,t);}),e=t.s,n=t.ha,e&&n&&nn(r,e,n),nn(r,"VER",t.oa),$n(t,r),r;}function ur(t,e){if(e&&!t.w)throw Error("Can't create secondary domain capable XhrIo object.");return (e=new Cn(t.Ea)).F=t.w,e;}function cr(){}function hr(){if(st&&!(10<=Number(bt)))throw Error("Environmental error: no available transport.");}function lr(t,e){Gt.call(this),this.a=new Hn(e),this.l=t,this.b=e&&e.messageUrlParams||null,t=e&&e.messageHeaders||null,e&&e.clientProtocolHeaderRequired&&(t?t["X-Client-Protocol"]="webchannel":t={"X-Client-Protocol":"webchannel"}),this.a.j=t,t=e&&e.initMessageHeaders||null,e&&e.messageContentType&&(t?t["X-WebChannel-Content-Type"]=e.messageContentType:t={"X-WebChannel-Content-Type":e.messageContentType}),e&&e.pa&&(t?t["X-WebChannel-Client-Profile"]=e.pa:t={"X-WebChannel-Client-Profile":e.pa}),this.a.F=t,(t=e&&e.httpHeadersOverwriteParam)&&!H(t)&&(this.a.h=t),this.h=e&&e.supportsCrossDomainXhr||!1,this.g=e&&e.sendRawJson||!1,(e=e&&e.httpSessionIdParam)&&!H(e)&&(this.a.s=e,null!==(t=this.b)&&e in t&&e in(t=this.b)&&delete t[e]),this.f=new dr(this);}function fr(t){Se.call(this);var e=t.__sm__;if(e){t:{for(var n in e){t=n;break t;}t=void 0;}(this.c=t)?(t=this.c,this.data=null!==e&&t in e?e[t]:void 0):this.data=e;}else this.data=t;}function pr(){xe.call(this),this.status=1;}function dr(t){this.a=t;}(A=Cn.prototype).$=function(t,e,n,r){if(this.a)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+t);e=e?e.toUpperCase():"GET",this.D=t,this.f="",this.h=0,this.v=!1,this.b=!0,this.a=new XMLHttpRequest(),this.s=this.G?Te(this.G):Te(ke),this.a.onreadystatechange=j(this.va,this);try{this.w=!0,this.a.open(e,String(t),!0),this.w=!1;}catch(t){return void Vn(this,t);}t=n||"";var i=new He(this.headers);r&&We(r,function(t,e){i.set(e,t);}),r=function(t){t:{for(var e=jn,n=t.length,r="string"==typeof t?t.split(""):t,i=0;i<n;i++)if(i in r&&e.call(void 0,r[i],i,t)){e=i;break t;}e=-1;}return 0>e?null:"string"==typeof t?t.charAt(e):t[e];}(i.K()),n=S.FormData&&t instanceof S.FormData,!(0<=B(Mn,e))||r||n||i.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8"),i.forEach(function(t,e){this.a.setRequestHeader(e,t);},this),this.H&&(this.a.responseType=this.H),"withCredentials"in this.a&&this.a.withCredentials!==this.F&&(this.a.withCredentials=this.F);try{Bn(this),0<this.o&&((this.B=function(t){return st&&mt(9)&&"number"==typeof t.timeout&&void 0!==t.ontimeout;}(this.a))?(this.a.timeout=this.o,this.a.ontimeout=j(this.ta,this)):this.m=oe(this.ta,this.o,this)),this.l=!0,this.a.send(t),this.l=!1;}catch(t){Vn(this,t);}},A.ta=function(){void 0!==N&&this.a&&(this.f="Timed out after "+this.o+"ms, aborting",this.h=8,this.dispatchEvent("timeout"),this.abort(8));},A.abort=function(t){this.a&&this.b&&(this.b=!1,this.g=!0,this.a.abort(),this.g=!1,this.h=t||7,this.dispatchEvent("complete"),this.dispatchEvent("abort"),qn(this));},A.C=function(){this.a&&(this.b&&(this.b=!1,this.g=!0,this.a.abort(),this.g=!1),qn(this,!0)),Cn.M.C.call(this);},A.va=function(){this.j||(this.w||this.l||this.g?Fn(this):this.Oa());},A.Oa=function(){Fn(this);},A.S=function(){try{return 2<zn(this)?this.a.status:-1;}catch(t){return -1;}},A.Y=function(){try{return this.a?this.a.responseText:"";}catch(t){return "";}},A.Ja=function(t){if(this.a){var e=this.a.responseText;return t&&0==e.indexOf(t)&&(e=e.substring(t.length)),Rn(e);}},A.qa=function(){return this.h;},A.Ma=function(){return "string"==typeof this.f?this.f:String(this.f);},(A=Hn.prototype).oa=8,A.u=1,A.xa=function(t){if(this.g)if(this.g=null,1==this.u){if(!t){this.H=Math.floor(1e5*Math.random());var e,n=new De(this,t=this.H++,void 0),r=this.j;if(this.F&&(r?nt(r=tt(r),this.F):r=this.F),null===this.h&&(n.m=r),this.fa)t:{for(var i=e=0;i<this.f.length;i++){var o=this.f[i];if(void 0===(o="__data__"in o.a&&"string"==typeof(o=o.a.__data__)?o.length:void 0))break;if(4096<(e+=o)){e=i;break t;}if(4096===e||i===this.f.length-1){e=i+1;break t;}}e=1e3;}else e=1e3;e=Zn(this,n,e),nn(i=Je(this.v),"RID",t),nn(i,"CVER",22),this.s&&nn(i,"X-HTTP-Session-Id",this.s),$n(this,i),this.h&&r&&Gn(i,this.h,r),An(this.b,n),this.fa?(nn(i,"$req",e),nn(i,"SID","null"),n.R=!0,Le(n,i,null)):Le(n,i,e),this.u=2;}}else 3==this.u&&(t?Jn(this,t):0==this.f.length||En(this.b)||Jn(this));},A.wa=function(){this.i=null,this.a=new De(this,"rpc",this.J),null===this.h&&(this.a.m=this.j),this.a.J=0;var t=Je(this.ea);nn(t,"RID","rpc"),nn(t,"SID",this.B),nn(t,"CI",this.U?"0":"1"),nn(t,"AID",this.G),$n(this,t),nn(t,"TYPE","xmlhttp"),this.h&&this.j&&Gn(t,this.h,this.j),this.D&&this.a.setTimeout(this.D);var e=this.a,n=this.R;e.B=1,e.f=rn(Je(t)),e.j=null,e.F=!0,Me(e,n);},A.Na=function(){null!=this.l&&(this.l=null,this.a.cancel(),this.a=null,er(this),ge(19));},A.Ta=function(t){ge(t?2:1);},(A=cr.prototype).na=function(){},A.ma=function(){},A.la=function(){},A.ka=function(){},A.Ha=function(){},hr.prototype.a=function(t,e){return new lr(t,e);},F(lr,Gt),(A=lr.prototype).addEventListener=function(t,e,n,r){lr.M.addEventListener.call(this,t,e,n,r);},A.removeEventListener=function(t,e,n,r){lr.M.removeEventListener.call(this,t,e,n,r);},A.Ka=function(){this.a.c=this.f,this.h&&(this.a.w=!0);var t=this.a,e=this.l,n=this.b||void 0;ge(0),t.P=e,t.N=n||{},t.U=t.W,t.v=ar(t,null,t.P),Qn(t);},A.close=function(){Kn(this.a);},A.La=function(t){if("string"==typeof t){var e={};e.__data__=t,Xn(this.a,e);}else this.g?((e={}).__data__=Ht(t),Xn(this.a,e)):Xn(this.a,t);},A.C=function(){this.a.c=null,delete this.f,Kn(this.a),delete this.a,lr.M.C.call(this);},F(fr,Se),F(pr,xe),F(dr,cr),dr.prototype.na=function(){this.a.dispatchEvent("a");},dr.prototype.ma=function(t){this.a.dispatchEvent(new fr(t));},dr.prototype.la=function(t){this.a.dispatchEvent(new pr(t));},dr.prototype.ka=function(){this.a.dispatchEvent("b");},hr.prototype.createWebChannel=hr.prototype.a,lr.prototype.send=lr.prototype.La,lr.prototype.open=lr.prototype.Ka,lr.prototype.close=lr.prototype.close,_e.NO_ERROR=0,_e.TIMEOUT=8,_e.HTTP_ERROR=6,Ee.COMPLETE="complete",Ae.EventType=Ne,Ne.OPEN="a",Ne.CLOSE="b",Ne.ERROR="c",Ne.MESSAGE="d",Gt.prototype.listen=Gt.prototype.ra,Cn.prototype.listenOnce=Cn.prototype.sa,Cn.prototype.getLastError=Cn.prototype.Ma,Cn.prototype.getLastErrorCode=Cn.prototype.qa,Cn.prototype.getStatus=Cn.prototype.S,Cn.prototype.getResponseJson=Cn.prototype.Ja,Cn.prototype.getResponseText=Cn.prototype.Y,Cn.prototype.send=Cn.prototype.$;var vr={createWebChannelTransport:function(){return new hr();},ErrorCode:_e,EventType:Ee,WebChannel:Ae,XhrIo:Cn},yr=n(function(t,e){Object.defineProperty(e,"__esModule",{value:!0});var n,r=u,i=(n=E)&&"object"==typeof n&&"default"in n?n.default:n,o=_,s=c,a=l,h=vr,f=i.SDK_VERSION,p=function(){function t(t){this.uid=t;}return t.prototype.t=function(){return null!=this.uid;},t.prototype.s=function(){return this.t()?"uid:"+this.uid:"anonymous-user";},t.prototype.isEqual=function(t){return t.uid===this.uid;},t;}();p.UNAUTHENTICATED=new p(null),p.i=new p("google-credentials-uid"),p.h=new p("first-party-uid");/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var d={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"},v=function(t){function e(e,n){var r=this;return (r=t.call(this,n)||this).code=e,r.message=n,r.name="FirebaseError",r.toString=function(){return r.name+": [code="+r.code+"]: "+r.message;},r;}return r.__extends(e,t),e;}(Error),y=function(t,e){this.user=e,this.type="OAuth",this.o={},this.o.Authorization="Bearer "+t;},m=function(){function t(){this.u=null;}return t.prototype.getToken=function(){return Promise.resolve(null);},t.prototype._=function(){},t.prototype.l=function(t){this.u=t,t(p.UNAUTHENTICATED);},t.prototype.T=function(){this.u=null;},t;}(),g=function(){function t(t){var e=this;this.I=null,this.currentUser=p.UNAUTHENTICATED,this.R=!1,this.A=0,this.u=null,this.forceRefresh=!1,this.I=function(){e.A++,e.currentUser=e.m(),e.R=!0,e.u&&e.u(e.currentUser);},this.A=0,this.auth=t.getImmediate({optional:!0}),this.auth?this.auth.addAuthTokenListener(this.I):(this.I(null),t.get().then(function(t){e.auth=t,e.I&&e.auth.addAuthTokenListener(e.I);},function(){}));}return t.prototype.getToken=function(){var t=this,e=this.A,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(function(n){if(t.A!==e)throw new v(d.ABORTED,"getToken aborted due to token change.");return n?(Ie("string"==typeof n.accessToken),new y(n.accessToken,t.currentUser)):null;}):Promise.resolve(null);},t.prototype._=function(){this.forceRefresh=!0;},t.prototype.l=function(t){this.u=t,this.R&&t(this.currentUser);},t.prototype.T=function(){this.auth&&this.auth.removeAuthTokenListener(this.I),this.I=null,this.u=null;},t.prototype.m=function(){var t=this.auth&&this.auth.getUid();return Ie(null===t||"string"==typeof t),new p(t);},t;}(),b=function(){function t(t,e){this.P=t,this.V=e,this.type="FirstParty",this.user=p.h;}return Object.defineProperty(t.prototype,"o",{get:function(){var t={"X-Goog-AuthUser":this.V},e=this.P.auth.g([]);return e&&(t.Authorization=e),t;},enumerable:!0,configurable:!0}),t;}(),w=function(){function t(t,e){this.P=t,this.V=e;}return t.prototype.getToken=function(){return Promise.resolve(new b(this.P,this.V));},t.prototype.l=function(t){t(p.h);},t.prototype.T=function(){},t.prototype._=function(){},t;}(),I=function(){function t(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new v(d.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new v(d.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<-62135596800)throw new v(d.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new v(d.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);}return t.now=function(){return t.fromMillis(Date.now());},t.fromDate=function(e){return t.fromMillis(e.getTime());},t.fromMillis=function(e){var n=Math.floor(e/1e3);return new t(n,1e6*(e-1e3*n));},t.prototype.toDate=function(){return new Date(this.toMillis());},t.prototype.toMillis=function(){return 1e3*this.seconds+this.nanoseconds/1e6;},t.prototype.p=function(t){return this.seconds===t.seconds?ke(this.nanoseconds,t.nanoseconds):ke(this.seconds,t.seconds);},t.prototype.isEqual=function(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds;},t.prototype.toString=function(){return "Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")";},t.prototype.valueOf=function(){var t=this.seconds- -62135596800;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0");},t;}(),T=function(){function t(t){this.timestamp=t;}return t.v=function(e){return new t(e);},t.min=function(){return new t(new I(0,0));},t.prototype.S=function(t){return this.timestamp.p(t.timestamp);},t.prototype.isEqual=function(t){return this.timestamp.isEqual(t.timestamp);},t.prototype.D=function(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3;},t.prototype.toString=function(){return "SnapshotVersion("+this.timestamp.toString()+")";},t.prototype.C=function(){return this.timestamp;},t;}(),A=function(){function t(t,e,n){void 0===e?e=0:e>t.length&&Ee(),void 0===n?n=t.length-e:n>t.length-e&&Ee(),this.segments=t,this.offset=e,this.F=n;}return Object.defineProperty(t.prototype,"length",{get:function(){return this.F;},enumerable:!0,configurable:!0}),t.prototype.isEqual=function(e){return 0===t.N(this,e);},t.prototype.child=function(e){var n=this.segments.slice(this.offset,this.limit());return e instanceof t?e.forEach(function(t){n.push(t);}):n.push(e),this.$(n);},t.prototype.limit=function(){return this.offset+this.length;},t.prototype.k=function(t){return t=void 0===t?1:t,this.$(this.segments,this.offset+t,this.length-t);},t.prototype.M=function(){return this.$(this.segments,this.offset,this.length-1);},t.prototype.L=function(){return this.segments[this.offset];},t.prototype.O=function(){return this.get(this.length-1);},t.prototype.get=function(t){return this.segments[this.offset+t];},t.prototype.B=function(){return 0===this.length;},t.prototype.q=function(t){if(t.length<this.length)return !1;for(var e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return !1;return !0;},t.prototype.U=function(t){if(this.length+1!==t.length)return !1;for(var e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return !1;return !0;},t.prototype.forEach=function(t){for(var e=this.offset,n=this.limit();e<n;e++)t(this.segments[e]);},t.prototype.W=function(){return this.segments.slice(this.offset,this.limit());},t.N=function(t,e){for(var n=Math.min(t.length,e.length),r=0;r<n;r++){var i=t.get(r),o=e.get(r);if(i<o)return -1;if(i>o)return 1;}return t.length<e.length?-1:t.length>e.length?1:0;},t;}(),k=function(t){function e(){return null!==t&&t.apply(this,arguments)||this;}return r.__extends(e,t),e.prototype.$=function(t,n,r){return new e(t,n,r);},e.prototype.j=function(){return this.W().join("/");},e.prototype.toString=function(){return this.j();},e.K=function(t){if(t.indexOf("//")>=0)throw new v(d.INVALID_ARGUMENT,"Invalid path ("+t+"). Paths must not contain // in them.");return new e(t.split("/").filter(function(t){return t.length>0;}));},e;}(A);k.G=new k([]);var N=/^[_a-zA-Z][_a-zA-Z0-9]*$/,S=function(t){function e(){return null!==t&&t.apply(this,arguments)||this;}return r.__extends(e,t),e.prototype.$=function(t,n,r){return new e(t,n,r);},e.H=function(t){return N.test(t);},e.prototype.j=function(){return this.W().map(function(t){return t=t.replace("\\","\\\\").replace("`","\\`"),e.H(t)||(t="`"+t+"`"),t;}).join(".");},e.prototype.toString=function(){return this.j();},e.prototype.Y=function(){return 1===this.length&&"__name__"===this.get(0);},e.J=function(){return new e(["__name__"]);},e.X=function(t){for(var n=[],r="",i=0,o=function(){if(0===r.length)throw new v(d.INVALID_ARGUMENT,"Invalid field path ("+t+"). Paths must not be empty, begin with '.', end with '.', or contain '..'");n.push(r),r="";},s=!1;i<t.length;){var a=t[i];if("\\"===a){if(i+1===t.length)throw new v(d.INVALID_ARGUMENT,"Path has trailing escape character: "+t);var u=t[i+1];if("\\"!==u&&"."!==u&&"`"!==u)throw new v(d.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);r+=u,i+=2;}else "`"===a?(s=!s,i++):"."!==a||s?(r+=a,i++):(o(),i++);}if(o(),s)throw new v(d.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new e(n);},e;}(A);S.G=new S([]);/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var x=function(){function t(t){this.path=t;}return t.Z=function(e){return new t(k.K(e).k(5));},t.prototype.tt=function(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t;},t.prototype.isEqual=function(t){return null!==t&&0===k.N(this.path,t.path);},t.prototype.toString=function(){return this.path.toString();},t.N=function(t,e){return k.N(t.path,e.path);},t.et=function(t){return t.length%2==0;},t.st=function(e){return new t(new k(e.slice()));},t;}();/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function O(t){var e=0;for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e;}function D(t,e){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n]);}function R(t){for(var e in t)if(Object.prototype.hasOwnProperty.call(t,e))return !1;return !0;}/**
	 * @license
	 * Copyright 2020 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */x.EMPTY=new x(new k([]));var C=function(){function t(t){this.it=t;}return t.fromBase64String=function(e){return new t(ye.nt().atob(e));},t.fromUint8Array=function(e){return new t(function(t){for(var e="",n=0;n<t.length;++n)e+=String.fromCharCode(t[n]);return e;}(e));},t.prototype.toBase64=function(){return ye.nt().btoa(this.it);},t.prototype.toUint8Array=function(){return function(t){for(var e=new Uint8Array(t.length),n=0;n<t.length;n++)e[n]=t.charCodeAt(n);return e;}(this.it);},t.prototype.rt=function(){return 2*this.it.length;},t.prototype.S=function(t){return ke(this.it,t.it);},t.prototype.isEqual=function(t){return this.it===t.it;},t;}();function P(t){return null==t;}function L(t){return -0===t&&1/t==-1/0;}function M(t){return "number"==typeof t&&Number.isInteger(t)&&!L(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER;}/**
	 * @license
	 * Copyright 2020 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function j(t){var e,n;return "server_timestamp"===(null===(n=((null===(e=null==t?void 0:t.mapValue)||void 0===e?void 0:e.fields)||{}).__type__)||void 0===n?void 0:n.stringValue);}function V(t){var e=H(t.mapValue.fields.__local_write_time__.timestampValue);return new I(e.seconds,e.nanos);}/**
	 * @license
	 * Copyright 2020 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */C.ht=new C("");var U=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function F(t){return "nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?j(t)?4:10:Ee();}function q(t,e){var n=F(t);if(n!==F(e))return !1;switch(n){case 0:return !0;case 1:return t.booleanValue===e.booleanValue;case 4:return V(t).isEqual(V(e));case 3:return function(t,e){if("string"==typeof t.timestampValue&&"string"==typeof e.timestampValue&&t.timestampValue.length===e.timestampValue.length)return t.timestampValue===e.timestampValue;var n=H(t.timestampValue),r=H(e.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos;}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(t,e){return Y(t.bytesValue).isEqual(Y(e.bytesValue));}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(t,e){return K(t.geoPointValue.latitude)===K(e.geoPointValue.latitude)&&K(t.geoPointValue.longitude)===K(e.geoPointValue.longitude);}(t,e);case 2:return function(t,e){if("integerValue"in t&&"integerValue"in e)return K(t.integerValue)===K(e.integerValue);if("doubleValue"in t&&"doubleValue"in e){var n=K(t.doubleValue),r=K(e.doubleValue);return n===r?L(n)===L(r):isNaN(n)&&isNaN(r);}return !1;}(t,e);case 9:return Ne(t.arrayValue.values||[],e.arrayValue.values||[],q);case 10:return function(t,e){var n=t.mapValue.fields||{},r=e.mapValue.fields||{};if(O(n)!==O(r))return !1;for(var i in n)if(n.hasOwnProperty(i)&&(void 0===r[i]||!q(n[i],r[i])))return !1;return !0;}(t,e);default:return Ee();}}function B(t,e){return void 0!==(t.values||[]).find(function(t){return q(t,e);});}function z(t,e){var n=F(t),r=F(e);if(n!==r)return ke(n,r);switch(n){case 0:return 0;case 1:return ke(t.booleanValue,e.booleanValue);case 2:return function(t,e){var n=K(t.integerValue||t.doubleValue),r=K(e.integerValue||e.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1;}(t,e);case 3:return G(t.timestampValue,e.timestampValue);case 4:return G(V(t),V(e));case 5:return ke(t.stringValue,e.stringValue);case 6:return function(t,e){var n=Y(t),r=Y(e);return n.S(r);}(t.bytesValue,e.bytesValue);case 7:return function(t,e){for(var n=t.split("/"),r=e.split("/"),i=0;i<n.length&&i<r.length;i++){var o=ke(n[i],r[i]);if(0!==o)return o;}return ke(n.length,r.length);}(t.referenceValue,e.referenceValue);case 8:return function(t,e){var n=ke(K(t.latitude),K(e.latitude));return 0!==n?n:ke(K(t.longitude),K(e.longitude));}(t.geoPointValue,e.geoPointValue);case 9:return function(t,e){for(var n=t.values||[],r=e.values||[],i=0;i<n.length&&i<r.length;++i){var o=z(n[i],r[i]);if(o)return o;}return ke(n.length,r.length);}(t.arrayValue,e.arrayValue);case 10:return function(t,e){var n=t.fields||{},r=Object.keys(n),i=e.fields||{},o=Object.keys(i);r.sort(),o.sort();for(var s=0;s<r.length&&s<o.length;++s){var a=ke(r[s],o[s]);if(0!==a)return a;var u=z(n[r[s]],i[o[s]]);if(0!==u)return u;}return ke(r.length,o.length);}(t.mapValue,e.mapValue);default:throw Ee();}}function G(t,e){if("string"==typeof t&&"string"==typeof e&&t.length===e.length)return ke(t,e);var n=H(t),r=H(e),i=ke(n.seconds,r.seconds);return 0!==i?i:ke(n.nanos,r.nanos);}function W(t){return function t(e){return "nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(t){var e=H(t);return "time("+e.seconds+","+e.nanos+")";}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?Y(e.bytesValue).toBase64():"referenceValue"in e?(r=e.referenceValue,x.Z(r).toString()):"geoPointValue"in e?"geo("+(n=e.geoPointValue).latitude+","+n.longitude+")":"arrayValue"in e?function(e){for(var n="[",r=!0,i=0,o=e.values||[];i<o.length;i++){var s=o[i];r?r=!1:n+=",",n+=t(s);}return n+"]";}(e.arrayValue):"mapValue"in e?function(e){for(var n="{",r=!0,i=0,o=Object.keys(e.fields||{}).sort();i<o.length;i++){var s=o[i];r?r=!1:n+=",",n+=s+":"+t(e.fields[s]);}return n+"}";}(e.mapValue):Ee();var n,r;}(t);}function H(t){if(Ie(!!t),"string"==typeof t){var e=0,n=U.exec(t);if(Ie(!!n),n[1]){var r=n[1];r=(r+"000000000").substr(0,9),e=Number(r);}var i=new Date(t);return {seconds:Math.floor(i.getTime()/1e3),nanos:e};}return {seconds:K(t.seconds),nanos:K(t.nanos)};}function K(t){return "number"==typeof t?t:"string"==typeof t?Number(t):0;}function Y(t){return "string"==typeof t?C.fromBase64String(t):C.fromUint8Array(t);}function X(t,e){return {referenceValue:"projects/"+t.projectId+"/databases/"+t.database+"/documents/"+e.path.j()};}function Q(t){return !!t&&"integerValue"in t;}function J(t){return !!t&&"arrayValue"in t;}function $(t){return !!t&&"nullValue"in t;}function Z(t){return !!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue));}function tt(t){return !!t&&"mapValue"in t;}/**
	 * @license
	 * Copyright 2018 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var et=function(){function t(){}return t.prototype.ot=function(t,e){return function(t,e){var n={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:t.seconds,nanos:t.nanoseconds}}}};return e&&(n.fields.__previous_value__=e),{mapValue:n};}(e,t);},t.prototype.at=function(t,e){return e;},t.prototype.ut=function(t){return null;},t.prototype.isEqual=function(e){return e instanceof t;},t;}();et.instance=new et();var nt=function(){function t(t){this.elements=t;}return t.prototype.ot=function(t,e){return this.apply(t);},t.prototype.at=function(t,e){return this.apply(t);},t.prototype.apply=function(t){for(var e=ot(t),n=function(t){e.some(function(e){return q(e,t);})||e.push(t);},r=0,i=this.elements;r<i.length;r++)n(i[r]);return {arrayValue:{values:e}};},t.prototype.ut=function(t){return null;},t.prototype.isEqual=function(e){return e instanceof t&&Ne(this.elements,e.elements,q);},t;}(),rt=function(){function t(t){this.elements=t;}return t.prototype.ot=function(t,e){return this.apply(t);},t.prototype.at=function(t,e){return this.apply(t);},t.prototype.apply=function(t){for(var e=ot(t),n=function(t){e=e.filter(function(e){return !q(e,t);});},r=0,i=this.elements;r<i.length;r++)n(i[r]);return {arrayValue:{values:e}};},t.prototype.ut=function(t){return null;},t.prototype.isEqual=function(e){return e instanceof t&&Ne(this.elements,e.elements,q);},t;}(),it=function(){function t(t,e){this.serializer=t,this.ct=e;}return t.prototype.ot=function(t,e){var n=this.ut(t),r=this.asNumber(n)+this.asNumber(this.ct);return Q(n)&&Q(this.ct)?this.serializer._t(r):this.serializer.lt(r);},t.prototype.at=function(t,e){return e;},t.prototype.ut=function(t){return Q(e=t)||function(t){return !!t&&"doubleValue"in t;}(e)?t:{integerValue:0};var e;},t.prototype.isEqual=function(e){return e instanceof t&&q(this.ct,e.ct);},t.prototype.asNumber=function(t){return K(t.integerValue||t.doubleValue);},t;}();function ot(t){return J(t)&&t.arrayValue.values?t.arrayValue.values.slice():[];}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var st=function(){function t(t){this.fields=t,t.sort(S.N);}return t.prototype.dt=function(t){for(var e=0,n=this.fields;e<n.length;e++)if(n[e].q(t))return !0;return !1;},t.prototype.isEqual=function(t){return Ne(this.fields,t.fields,function(t,e){return t.isEqual(e);});},t;}(),at=function(){function t(t,e){this.field=t,this.transform=e;}return t.prototype.isEqual=function(t){return this.field.isEqual(t.field)&&this.transform.isEqual(t.transform);},t;}(),ut=function(t,e){this.version=t,this.transformResults=e;},ct=function(){function t(t,e){this.updateTime=t,this.exists=e;}return t.ft=function(){return new t();},t.exists=function(e){return new t(void 0,e);},t.updateTime=function(e){return new t(e);},Object.defineProperty(t.prototype,"Tt",{get:function(){return void 0===this.updateTime&&void 0===this.exists;},enumerable:!0,configurable:!0}),t.prototype.Et=function(t){return void 0!==this.updateTime?t instanceof Et&&t.version.isEqual(this.updateTime):void 0===this.exists||this.exists===t instanceof Et;},t.prototype.isEqual=function(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime);},t;}(),ht=function(){function t(){}return t.prototype.wt=function(t){},t.It=function(t){return t instanceof Et?t.version:T.min();},t;}(),lt=function(t){function e(e,n,r){var i=this;return (i=t.call(this)||this).key=e,i.value=n,i.Rt=r,i.type=0,i;}return r.__extends(e,t),e.prototype.at=function(t,e){this.wt(t);var n=e.version;return new Et(this.key,n,this.value,{hasCommittedMutations:!0});},e.prototype.ot=function(t,e,n){if(this.wt(t),!this.Rt.Et(t))return t;var r=ht.It(t);return new Et(this.key,r,this.value,{At:!0});},e.prototype.Pt=function(t){return null;},e.prototype.isEqual=function(t){return t instanceof e&&this.key.isEqual(t.key)&&this.value.isEqual(t.value)&&this.Rt.isEqual(t.Rt);},e;}(ht),ft=function(t){function e(e,n,r,i){var o=this;return (o=t.call(this)||this).key=e,o.data=n,o.Vt=r,o.Rt=i,o.type=1,o;}return r.__extends(e,t),e.prototype.at=function(t,e){if(this.wt(t),!this.Rt.Et(t))return new Tt(this.key,e.version);var n=this.gt(t);return new Et(this.key,e.version,n,{hasCommittedMutations:!0});},e.prototype.ot=function(t,e,n){if(this.wt(t),!this.Rt.Et(t))return t;var r=ht.It(t),i=this.gt(t);return new Et(this.key,r,i,{At:!0});},e.prototype.Pt=function(t){return null;},e.prototype.isEqual=function(t){return t instanceof e&&this.key.isEqual(t.key)&&this.Vt.isEqual(t.Vt)&&this.Rt.isEqual(t.Rt);},e.prototype.gt=function(t){var e;return e=t instanceof Et?t.data():yt.empty(),this.pt(e);},e.prototype.pt=function(t){var e=this,n=new mt(t);return this.Vt.fields.forEach(function(t){if(!t.B()){var r=e.data.field(t);null!==r?n.set(t,r):n.delete(t);}}),n.yt();},e;}(ht),pt=function(t){function e(e,n){var r=this;return (r=t.call(this)||this).key=e,r.fieldTransforms=n,r.type=2,r.Rt=ct.exists(!0),r;}return r.__extends(e,t),e.prototype.at=function(t,e){if(this.wt(t),Ie(null!=e.transformResults),!this.Rt.Et(t))return new Tt(this.key,e.version);var n=this.bt(t),r=this.vt(t,e.transformResults),i=e.version,o=this.St(n.data(),r);return new Et(this.key,i,o,{hasCommittedMutations:!0});},e.prototype.ot=function(t,e,n){if(this.wt(t),!this.Rt.Et(t))return t;var r=this.bt(t),i=this.Dt(n,t,e),o=this.St(r.data(),i);return new Et(this.key,r.version,o,{At:!0});},e.prototype.Pt=function(t){for(var e=null,n=0,r=this.fieldTransforms;n<r.length;n++){var i=r[n],o=t instanceof Et?t.field(i.field):void 0,s=i.transform.ut(o||null);null!=s&&(e=null==e?new mt().set(i.field,s):e.set(i.field,s));}return e?e.yt():null;},e.prototype.isEqual=function(t){return t instanceof e&&this.key.isEqual(t.key)&&Ne(this.fieldTransforms,t.fieldTransforms,function(t,e){return t.isEqual(e);})&&this.Rt.isEqual(t.Rt);},e.prototype.bt=function(t){return t;},e.prototype.vt=function(t,e){var n=[];Ie(this.fieldTransforms.length===e.length);for(var r=0;r<e.length;r++){var i=this.fieldTransforms[r],o=i.transform,s=null;t instanceof Et&&(s=t.field(i.field)),n.push(o.at(s,e[r]));}return n;},e.prototype.Dt=function(t,e,n){for(var r=[],i=0,o=this.fieldTransforms;i<o.length;i++){var s=o[i],a=s.transform,u=null;e instanceof Et&&(u=e.field(s.field)),null===u&&n instanceof Et&&(u=n.field(s.field)),r.push(a.ot(u,t));}return r;},e.prototype.St=function(t,e){for(var n=new mt(t),r=0;r<this.fieldTransforms.length;r++){var i=this.fieldTransforms[r].field;n.set(i,e[r]);}return n.yt();},e;}(ht),dt=function(t){function e(e,n){var r=this;return (r=t.call(this)||this).key=e,r.Rt=n,r.type=3,r;}return r.__extends(e,t),e.prototype.at=function(t,e){return this.wt(t),new It(this.key,e.version,{hasCommittedMutations:!0});},e.prototype.ot=function(t,e,n){return this.wt(t),this.Rt.Et(t)?new It(this.key,T.min()):t;},e.prototype.Pt=function(t){return null;},e.prototype.isEqual=function(t){return t instanceof e&&this.key.isEqual(t.key)&&this.Rt.isEqual(t.Rt);},e;}(ht),vt=function(t){function e(e,n){var r=this;return (r=t.call(this)||this).key=e,r.Rt=n,r.type=4,r;}return r.__extends(e,t),e.prototype.at=function(t,e){Ee();},e.prototype.ot=function(t,e,n){Ee();},e.prototype.Pt=function(t){Ee();},e.prototype.isEqual=function(t){return t instanceof e&&this.key.isEqual(t.key)&&this.Rt.isEqual(t.Rt);},e;}(ht),yt=function(){function t(t){this.proto=t;}return t.empty=function(){return new t({mapValue:{}});},t.prototype.field=function(t){if(t.B())return this.proto;for(var e=this.proto,n=0;n<t.length-1;++n){if(!e.mapValue.fields)return null;if(!tt(e=e.mapValue.fields[t.get(n)]))return null;}return (e=(e.mapValue.fields||{})[t.O()])||null;},t.prototype.isEqual=function(t){return q(this.proto,t.proto);},t;}(),mt=function(){function t(t){void 0===t&&(t=yt.empty()),this.Ct=t,this.Ft=new Map();}return t.prototype.set=function(t,e){return this.Nt(t,e),this;},t.prototype.delete=function(t){return this.Nt(t,null),this;},t.prototype.Nt=function(t,e){for(var n=this.Ft,r=0;r<t.length-1;++r){var i=t.get(r),o=n.get(i);o instanceof Map?n=o:o&&10===F(o)?(o=new Map(Object.entries(o.mapValue.fields||{})),n.set(i,o),n=o):(o=new Map(),n.set(i,o),n=o);}n.set(t.O(),e);},t.prototype.yt=function(){var t=this.$t(S.G,this.Ft);return null!=t?new yt(t):this.Ct;},t.prototype.$t=function(t,e){var n=this,r=!1,i=this.Ct.field(t),o=tt(i)?Object.assign({},i.mapValue.fields):{};return e.forEach(function(e,i){if(e instanceof Map){var s=n.$t(t.child(i),e);null!=s&&(o[i]=s,r=!0);}else null!==e?(o[i]=e,r=!0):o.hasOwnProperty(i)&&(delete o[i],r=!0);}),r?{mapValue:{fields:o}}:null;},t;}();function gt(t){var e=[];return D(t.fields||{},function(t,n){var r=new S([t]);if(tt(n)){var i=gt(n.mapValue).fields;if(0===i.length)e.push(r);else for(var o=0,s=i;o<s.length;o++){var a=s[o];e.push(r.child(a));}}else e.push(r);}),new st(e);/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */}var bt,wt,_t=function(t,e){this.key=t,this.version=e;},Et=function(t){function e(e,n,r,i){var o=this;return (o=t.call(this,e,n)||this).kt=r,o.At=!!i.At,o.hasCommittedMutations=!!i.hasCommittedMutations,o;}return r.__extends(e,t),e.prototype.field=function(t){return this.kt.field(t);},e.prototype.data=function(){return this.kt;},e.prototype.Mt=function(){return this.kt.proto;},e.prototype.isEqual=function(t){return t instanceof e&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.At===t.At&&this.hasCommittedMutations===t.hasCommittedMutations&&this.kt.isEqual(t.kt);},e.prototype.toString=function(){return "Document("+this.key+", "+this.version+", "+this.kt.toString()+", {hasLocalMutations: "+this.At+"}), {hasCommittedMutations: "+this.hasCommittedMutations+"})";},Object.defineProperty(e.prototype,"hasPendingWrites",{get:function(){return this.At||this.hasCommittedMutations;},enumerable:!0,configurable:!0}),e;}(_t),It=function(t){function e(e,n,r){var i=this;return (i=t.call(this,e,n)||this).hasCommittedMutations=!(!r||!r.hasCommittedMutations),i;}return r.__extends(e,t),e.prototype.toString=function(){return "NoDocument("+this.key+", "+this.version+")";},Object.defineProperty(e.prototype,"hasPendingWrites",{get:function(){return this.hasCommittedMutations;},enumerable:!0,configurable:!0}),e.prototype.isEqual=function(t){return t instanceof e&&t.hasCommittedMutations===this.hasCommittedMutations&&t.version.isEqual(this.version)&&t.key.isEqual(this.key);},e;}(_t),Tt=function(t){function e(){return null!==t&&t.apply(this,arguments)||this;}return r.__extends(e,t),e.prototype.toString=function(){return "UnknownDocument("+this.key+", "+this.version+")";},Object.defineProperty(e.prototype,"hasPendingWrites",{get:function(){return !0;},enumerable:!0,configurable:!0}),e.prototype.isEqual=function(t){return t instanceof e&&t.version.isEqual(this.version)&&t.key.isEqual(this.key);},e;}(_t),At=function(){function t(t,e,n,r,i,o,s){void 0===e&&(e=null),void 0===n&&(n=[]),void 0===r&&(r=[]),void 0===i&&(i=null),void 0===o&&(o=null),void 0===s&&(s=null),this.path=t,this.collectionGroup=e,this.orderBy=n,this.filters=r,this.limit=i,this.startAt=o,this.endAt=s,this.xt=null;}return t.prototype.canonicalId=function(){if(null===this.xt){var t=this.path.j();null!==this.collectionGroup&&(t+="|cg:"+this.collectionGroup),t+="|f:",t+=this.filters.map(function(t){return t.canonicalId();}).join(","),t+="|ob:",t+=this.orderBy.map(function(t){return t.canonicalId();}).join(","),P(this.limit)||(t+="|l:",t+=this.limit),this.startAt&&(t+="|lb:",t+=this.startAt.canonicalId()),this.endAt&&(t+="|ub:",t+=this.endAt.canonicalId()),this.xt=t;}return this.xt;},t.prototype.toString=function(){var t=this.path.j();return null!==this.collectionGroup&&(t+=" collectionGroup="+this.collectionGroup),this.filters.length>0&&(t+=", filters: ["+this.filters.join(", ")+"]"),P(this.limit)||(t+=", limit: "+this.limit),this.orderBy.length>0&&(t+=", orderBy: ["+this.orderBy.join(", ")+"]"),this.startAt&&(t+=", startAt: "+this.startAt.canonicalId()),this.endAt&&(t+=", endAt: "+this.endAt.canonicalId()),"Target("+t+")";},t.prototype.isEqual=function(t){if(this.limit!==t.limit)return !1;if(this.orderBy.length!==t.orderBy.length)return !1;for(var e=0;e<this.orderBy.length;e++)if(!this.orderBy[e].isEqual(t.orderBy[e]))return !1;if(this.filters.length!==t.filters.length)return !1;for(var n=0;n<this.filters.length;n++)if(!this.filters[n].isEqual(t.filters[n]))return !1;return this.collectionGroup===t.collectionGroup&&!!this.path.isEqual(t.path)&&!!(null!==this.startAt?this.startAt.isEqual(t.startAt):null===t.startAt)&&(null!==this.endAt?this.endAt.isEqual(t.endAt):null===t.endAt);},t.prototype.Lt=function(){return x.et(this.path)&&null===this.collectionGroup&&0===this.filters.length;},t;}(),kt=function(){function t(t,e,n,r,i,o,s,a){void 0===e&&(e=null),void 0===n&&(n=[]),void 0===r&&(r=[]),void 0===i&&(i=null),void 0===o&&(o="F"),void 0===s&&(s=null),void 0===a&&(a=null),this.path=t,this.collectionGroup=e,this.Ot=n,this.filters=r,this.limit=i,this.Bt=o,this.startAt=s,this.endAt=a,this.qt=null,this.Ut=null,this.startAt&&this.Qt(this.startAt),this.endAt&&this.Qt(this.endAt);}return t.Wt=function(e){return new t(e);},Object.defineProperty(t.prototype,"orderBy",{get:function(){if(null===this.qt){this.qt=[];var t=this.jt(),e=this.Kt();if(null!==t&&null===e)t.Y()||this.qt.push(new Pt(t)),this.qt.push(new Pt(S.J(),"asc"));else {for(var n=!1,r=0,i=this.Ot;r<i.length;r++){var o=i[r];this.qt.push(o),o.field.Y()&&(n=!0);}if(!n){var s=this.Ot.length>0?this.Ot[this.Ot.length-1].dir:"asc";this.qt.push(new Pt(S.J(),s));}}}return this.qt;},enumerable:!0,configurable:!0}),t.prototype.Gt=function(e){var n=this.filters.concat([e]);return new t(this.path,this.collectionGroup,this.Ot.slice(),n,this.limit,this.Bt,this.startAt,this.endAt);},t.prototype.zt=function(e){var n=this.Ot.concat([e]);return new t(this.path,this.collectionGroup,n,this.filters.slice(),this.limit,this.Bt,this.startAt,this.endAt);},t.prototype.Ht=function(e){return new t(this.path,this.collectionGroup,this.Ot.slice(),this.filters.slice(),e,"F",this.startAt,this.endAt);},t.prototype.Yt=function(e){return new t(this.path,this.collectionGroup,this.Ot.slice(),this.filters.slice(),e,"L",this.startAt,this.endAt);},t.prototype.Jt=function(e){return new t(this.path,this.collectionGroup,this.Ot.slice(),this.filters.slice(),this.limit,this.Bt,e,this.endAt);},t.prototype.Xt=function(e){return new t(this.path,this.collectionGroup,this.Ot.slice(),this.filters.slice(),this.limit,this.Bt,this.startAt,e);},t.prototype.Zt=function(e){return new t(e,null,this.Ot.slice(),this.filters.slice(),this.limit,this.Bt,this.startAt,this.endAt);},t.prototype.te=function(){return 0===this.filters.length&&null===this.limit&&null==this.startAt&&null==this.endAt&&(0===this.Ot.length||1===this.Ot.length&&this.Ot[0].field.Y());},t.prototype.canonicalId=function(){return this.ee().canonicalId()+"|lt:"+this.Bt;},t.prototype.toString=function(){return "Query(target="+this.ee().toString()+"; limitType="+this.Bt+")";},t.prototype.isEqual=function(t){return this.ee().isEqual(t.ee())&&this.Bt===t.Bt;},t.prototype.se=function(t,e){for(var n=!1,r=0,i=this.orderBy;r<i.length;r++){var o=i[r],s=o.compare(t,e);if(0!==s)return s;n=n||o.field.Y();}return 0;},t.prototype.matches=function(t){return this.ie(t)&&this.ne(t)&&this.re(t)&&this.he(t);},t.prototype.oe=function(){return !P(this.limit)&&"F"===this.Bt;},t.prototype.ae=function(){return !P(this.limit)&&"L"===this.Bt;},t.prototype.Kt=function(){return this.Ot.length>0?this.Ot[0].field:null;},t.prototype.jt=function(){for(var t=0,e=this.filters;t<e.length;t++){var n=e[t];if(n instanceof Nt&&n.ue())return n.field;}return null;},t.prototype.ce=function(t){for(var e=0,n=this.filters;e<n.length;e++){var r=n[e];if(r instanceof Nt&&t.indexOf(r.op)>=0)return r.op;}return null;},t.prototype.Lt=function(){return this.ee().Lt();},t.prototype._e=function(){return null!==this.collectionGroup;},t.prototype.ee=function(){if(!this.Ut)if("F"===this.Bt)this.Ut=new At(this.path,this.collectionGroup,this.orderBy,this.filters,this.limit,this.startAt,this.endAt);else {for(var t=[],e=0,n=this.orderBy;e<n.length;e++){var r=n[e],i="desc"===r.dir?"asc":"desc";t.push(new Pt(r.field,i));}var o=this.endAt?new Ct(this.endAt.position,!this.endAt.before):null,s=this.startAt?new Ct(this.startAt.position,!this.startAt.before):null;this.Ut=new At(this.path,this.collectionGroup,t,this.filters,this.limit,o,s);}return this.Ut;},t.prototype.ie=function(t){var e=t.key.path;return null!==this.collectionGroup?t.key.tt(this.collectionGroup)&&this.path.q(e):x.et(this.path)?this.path.isEqual(e):this.path.U(e);},t.prototype.ne=function(t){for(var e=0,n=this.Ot;e<n.length;e++){var r=n[e];if(!r.field.Y()&&null===t.field(r.field))return !1;}return !0;},t.prototype.re=function(t){for(var e=0,n=this.filters;e<n.length;e++)if(!n[e].matches(t))return !1;return !0;},t.prototype.he=function(t){return !(this.startAt&&!this.startAt.le(this.orderBy,t)||this.endAt&&this.endAt.le(this.orderBy,t));},t.prototype.Qt=function(t){},t;}(),Nt=function(t){function e(e,n,r){var i=this;return (i=t.call(this)||this).field=e,i.op=n,i.value=r,i;}return r.__extends(e,t),e.create=function(t,n,r){if(t.Y())return "in"===n?new xt(t,r):new St(t,n,r);if($(r)){if("=="!==n)throw new v(d.INVALID_ARGUMENT,"Invalid query. Null supports only equality comparisons.");return new e(t,n,r);}if(Z(r)){if("=="!==n)throw new v(d.INVALID_ARGUMENT,"Invalid query. NaN supports only equality comparisons.");return new e(t,n,r);}return "array-contains"===n?new Ot(t,r):"in"===n?new Dt(t,r):"array-contains-any"===n?new Rt(t,r):new e(t,n,r);},e.prototype.matches=function(t){var e=t.field(this.field);return null!==e&&F(this.value)===F(e)&&this.de(z(e,this.value));},e.prototype.de=function(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return 0===t;case">":return t>0;case">=":return t>=0;default:return Ee();}},e.prototype.ue=function(){return ["<","<=",">",">="].indexOf(this.op)>=0;},e.prototype.canonicalId=function(){return this.field.j()+this.op.toString()+W(this.value);},e.prototype.isEqual=function(t){return t instanceof e&&this.op===t.op&&this.field.isEqual(t.field)&&q(this.value,t.value);},e.prototype.toString=function(){return this.field.j()+" "+this.op+" "+W(this.value);},e;}(function(){}),St=function(t){function e(e,n,r){var i=this;return (i=t.call(this,e,n,r)||this).key=x.Z(r.referenceValue),i;}return r.__extends(e,t),e.prototype.matches=function(t){var e=x.N(t.key,this.key);return this.de(e);},e;}(Nt),xt=function(t){function e(e,n){var r=this;return (r=t.call(this,e,"in",n)||this).keys=(n.arrayValue.values||[]).map(function(t){return x.Z(t.referenceValue);}),r;}return r.__extends(e,t),e.prototype.matches=function(t){return this.keys.some(function(e){return e.isEqual(t.key);});},e;}(Nt),Ot=function(t){function e(e,n){return t.call(this,e,"array-contains",n)||this;}return r.__extends(e,t),e.prototype.matches=function(t){var e=t.field(this.field);return J(e)&&B(e.arrayValue,this.value);},e;}(Nt),Dt=function(t){function e(e,n){return t.call(this,e,"in",n)||this;}return r.__extends(e,t),e.prototype.matches=function(t){var e=t.field(this.field);return null!==e&&B(this.value.arrayValue,e);},e;}(Nt),Rt=function(t){function e(e,n){return t.call(this,e,"array-contains-any",n)||this;}return r.__extends(e,t),e.prototype.matches=function(t){var e=this,n=t.field(this.field);return !(!J(n)||!n.arrayValue.values)&&n.arrayValue.values.some(function(t){return B(e.value.arrayValue,t);});},e;}(Nt),Ct=function(){function t(t,e){this.position=t,this.before=e;}return t.prototype.canonicalId=function(){return (this.before?"b":"a")+":"+this.position.map(function(t){return W(t);}).join(",");},t.prototype.le=function(t,e){for(var n=0,r=0;r<this.position.length;r++){var i=t[r],o=this.position[r];if(n=i.field.Y()?x.N(x.Z(o.referenceValue),e.key):z(o,e.field(i.field)),"desc"===i.dir&&(n*=-1),0!==n)break;}return this.before?n<=0:n<0;},t.prototype.isEqual=function(t){if(null===t)return !1;if(this.before!==t.before||this.position.length!==t.position.length)return !1;for(var e=0;e<this.position.length;e++)if(!q(this.position[e],t.position[e]))return !1;return !0;},t;}(),Pt=function(){function t(t,e){this.field=t,void 0===e&&(e="asc"),this.dir=e,this.fe=t.Y();}return t.prototype.compare=function(t,e){var n=this.fe?x.N(t.key,e.key):function(t,e,n){var r=e.field(t),i=n.field(t);return null!==r&&null!==i?z(r,i):Ee();}(this.field,t,e);switch(this.dir){case"asc":return n;case"desc":return -1*n;default:return Ee();}},t.prototype.canonicalId=function(){return this.field.j()+this.dir.toString();},t.prototype.toString=function(){return this.field.j()+" ("+this.dir+")";},t.prototype.isEqual=function(t){return this.dir===t.dir&&this.field.isEqual(t.field);},t;}(),Lt=function(){function t(t,e,n,r,i,o,s){void 0===i&&(i=T.min()),void 0===o&&(o=T.min()),void 0===s&&(s=C.ht),this.target=t,this.targetId=e,this.Te=n,this.sequenceNumber=r,this.Ee=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=s;}return t.prototype.we=function(e){return new t(this.target,this.targetId,this.Te,e,this.Ee,this.lastLimboFreeSnapshotVersion,this.resumeToken);},t.prototype.Ie=function(e,n){return new t(this.target,this.targetId,this.Te,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e);},t.prototype.Re=function(e){return new t(this.target,this.targetId,this.Te,this.sequenceNumber,this.Ee,e,this.resumeToken);},t;}(),Mt=function(t){this.count=t;};function jt(t){switch(t){case d.OK:return Ee();case d.CANCELLED:case d.UNKNOWN:case d.DEADLINE_EXCEEDED:case d.RESOURCE_EXHAUSTED:case d.INTERNAL:case d.UNAVAILABLE:case d.UNAUTHENTICATED:return !1;case d.INVALID_ARGUMENT:case d.NOT_FOUND:case d.ALREADY_EXISTS:case d.PERMISSION_DENIED:case d.FAILED_PRECONDITION:case d.ABORTED:case d.OUT_OF_RANGE:case d.UNIMPLEMENTED:case d.DATA_LOSS:return !0;default:return Ee();}}function Vt(t){if(void 0===t)return we("GRPC error has no .code"),d.UNKNOWN;switch(t){case bt.OK:return d.OK;case bt.CANCELLED:return d.CANCELLED;case bt.UNKNOWN:return d.UNKNOWN;case bt.DEADLINE_EXCEEDED:return d.DEADLINE_EXCEEDED;case bt.RESOURCE_EXHAUSTED:return d.RESOURCE_EXHAUSTED;case bt.INTERNAL:return d.INTERNAL;case bt.UNAVAILABLE:return d.UNAVAILABLE;case bt.UNAUTHENTICATED:return d.UNAUTHENTICATED;case bt.INVALID_ARGUMENT:return d.INVALID_ARGUMENT;case bt.NOT_FOUND:return d.NOT_FOUND;case bt.ALREADY_EXISTS:return d.ALREADY_EXISTS;case bt.PERMISSION_DENIED:return d.PERMISSION_DENIED;case bt.FAILED_PRECONDITION:return d.FAILED_PRECONDITION;case bt.ABORTED:return d.ABORTED;case bt.OUT_OF_RANGE:return d.OUT_OF_RANGE;case bt.UNIMPLEMENTED:return d.UNIMPLEMENTED;case bt.DATA_LOSS:return d.DATA_LOSS;default:return Ee();}}(wt=bt||(bt={}))[wt.OK=0]="OK",wt[wt.CANCELLED=1]="CANCELLED",wt[wt.UNKNOWN=2]="UNKNOWN",wt[wt.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",wt[wt.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",wt[wt.NOT_FOUND=5]="NOT_FOUND",wt[wt.ALREADY_EXISTS=6]="ALREADY_EXISTS",wt[wt.PERMISSION_DENIED=7]="PERMISSION_DENIED",wt[wt.UNAUTHENTICATED=16]="UNAUTHENTICATED",wt[wt.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",wt[wt.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",wt[wt.ABORTED=10]="ABORTED",wt[wt.OUT_OF_RANGE=11]="OUT_OF_RANGE",wt[wt.UNIMPLEMENTED=12]="UNIMPLEMENTED",wt[wt.INTERNAL=13]="INTERNAL",wt[wt.UNAVAILABLE=14]="UNAVAILABLE",wt[wt.DATA_LOSS=15]="DATA_LOSS";/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var Ut=function(){function t(t,e){this.N=t,this.root=e||qt.EMPTY;}return t.prototype.Ae=function(e,n){return new t(this.N,this.root.Ae(e,n,this.N).me(null,null,qt.Pe,null,null));},t.prototype.remove=function(e){return new t(this.N,this.root.remove(e,this.N).me(null,null,qt.Pe,null,null));},t.prototype.get=function(t){for(var e=this.root;!e.B();){var n=this.N(t,e.key);if(0===n)return e.value;n<0?e=e.left:n>0&&(e=e.right);}return null;},t.prototype.indexOf=function(t){for(var e=0,n=this.root;!n.B();){var r=this.N(t,n.key);if(0===r)return e+n.left.size;r<0?n=n.left:(e+=n.left.size+1,n=n.right);}return -1;},t.prototype.B=function(){return this.root.B();},Object.defineProperty(t.prototype,"size",{get:function(){return this.root.size;},enumerable:!0,configurable:!0}),t.prototype.Ve=function(){return this.root.Ve();},t.prototype.ge=function(){return this.root.ge();},t.prototype.pe=function(t){return this.root.pe(t);},t.prototype.forEach=function(t){this.pe(function(e,n){return t(e,n),!1;});},t.prototype.toString=function(){var t=[];return this.pe(function(e,n){return t.push(e+":"+n),!1;}),"{"+t.join(", ")+"}";},t.prototype.ye=function(t){return this.root.ye(t);},t.prototype.be=function(){return new Ft(this.root,null,this.N,!1);},t.prototype.ve=function(t){return new Ft(this.root,t,this.N,!1);},t.prototype.Se=function(){return new Ft(this.root,null,this.N,!0);},t.prototype.De=function(t){return new Ft(this.root,t,this.N,!0);},t;}(),Ft=function(){function t(t,e,n,r){this.Ce=r,this.Fe=[];for(var i=1;!t.B();)if(i=e?n(t.key,e):1,r&&(i*=-1),i<0)t=this.Ce?t.left:t.right;else {if(0===i){this.Fe.push(t);break;}this.Fe.push(t),t=this.Ce?t.right:t.left;}}return t.prototype.Ne=function(){var t=this.Fe.pop(),e={key:t.key,value:t.value};if(this.Ce)for(t=t.left;!t.B();)this.Fe.push(t),t=t.right;else for(t=t.right;!t.B();)this.Fe.push(t),t=t.left;return e;},t.prototype.$e=function(){return this.Fe.length>0;},t.prototype.ke=function(){if(0===this.Fe.length)return null;var t=this.Fe[this.Fe.length-1];return {key:t.key,value:t.value};},t;}(),qt=function(){function t(e,n,r,i,o){this.key=e,this.value=n,this.color=null!=r?r:t.RED,this.left=null!=i?i:t.EMPTY,this.right=null!=o?o:t.EMPTY,this.size=this.left.size+1+this.right.size;}return t.prototype.me=function(e,n,r,i,o){return new t(null!=e?e:this.key,null!=n?n:this.value,null!=r?r:this.color,null!=i?i:this.left,null!=o?o:this.right);},t.prototype.B=function(){return !1;},t.prototype.pe=function(t){return this.left.pe(t)||t(this.key,this.value)||this.right.pe(t);},t.prototype.ye=function(t){return this.right.ye(t)||t(this.key,this.value)||this.left.ye(t);},t.prototype.min=function(){return this.left.B()?this:this.left.min();},t.prototype.Ve=function(){return this.min().key;},t.prototype.ge=function(){return this.right.B()?this.key:this.right.ge();},t.prototype.Ae=function(t,e,n){var r=this,i=n(t,r.key);return (r=i<0?r.me(null,null,null,r.left.Ae(t,e,n),null):0===i?r.me(null,e,null,null,null):r.me(null,null,null,null,r.right.Ae(t,e,n))).Me();},t.prototype.xe=function(){if(this.left.B())return t.EMPTY;var e=this;return e.left.Le()||e.left.left.Le()||(e=e.Oe()),(e=e.me(null,null,null,e.left.xe(),null)).Me();},t.prototype.remove=function(e,n){var r,i=this;if(n(e,i.key)<0)i.left.B()||i.left.Le()||i.left.left.Le()||(i=i.Oe()),i=i.me(null,null,null,i.left.remove(e,n),null);else {if(i.left.Le()&&(i=i.Be()),i.right.B()||i.right.Le()||i.right.left.Le()||(i=i.qe()),0===n(e,i.key)){if(i.right.B())return t.EMPTY;r=i.right.min(),i=i.me(r.key,r.value,null,null,i.right.xe());}i=i.me(null,null,null,null,i.right.remove(e,n));}return i.Me();},t.prototype.Le=function(){return this.color;},t.prototype.Me=function(){var t=this;return t.right.Le()&&!t.left.Le()&&(t=t.Ue()),t.left.Le()&&t.left.left.Le()&&(t=t.Be()),t.left.Le()&&t.right.Le()&&(t=t.Qe()),t;},t.prototype.Oe=function(){var t=this.Qe();return t.right.left.Le()&&(t=(t=(t=t.me(null,null,null,null,t.right.Be())).Ue()).Qe()),t;},t.prototype.qe=function(){var t=this.Qe();return t.left.left.Le()&&(t=(t=t.Be()).Qe()),t;},t.prototype.Ue=function(){var e=this.me(null,null,t.RED,null,this.right.left);return this.right.me(null,null,this.color,e,null);},t.prototype.Be=function(){var e=this.me(null,null,t.RED,this.left.right,null);return this.left.me(null,null,this.color,null,e);},t.prototype.Qe=function(){var t=this.left.me(null,null,!this.left.color,null,null),e=this.right.me(null,null,!this.right.color,null,null);return this.me(null,null,!this.color,t,e);},t.prototype.We=function(){var t=this.je();return Math.pow(2,t)<=this.size+1;},t.prototype.je=function(){if(this.Le()&&this.left.Le())throw Ee();if(this.right.Le())throw Ee();var t=this.left.je();if(t!==this.right.je())throw Ee();return t+(this.Le()?0:1);},t;}();qt.EMPTY=null,qt.RED=!0,qt.Pe=!1,qt.EMPTY=new(function(){function t(){this.size=0;}return Object.defineProperty(t.prototype,"key",{get:function(){throw Ee();},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"value",{get:function(){throw Ee();},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"color",{get:function(){throw Ee();},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"left",{get:function(){throw Ee();},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"right",{get:function(){throw Ee();},enumerable:!0,configurable:!0}),t.prototype.me=function(t,e,n,r,i){return this;},t.prototype.Ae=function(t,e,n){return new qt(t,e);},t.prototype.remove=function(t,e){return this;},t.prototype.B=function(){return !0;},t.prototype.pe=function(t){return !1;},t.prototype.ye=function(t){return !1;},t.prototype.Ve=function(){return null;},t.prototype.ge=function(){return null;},t.prototype.Le=function(){return !1;},t.prototype.We=function(){return !0;},t.prototype.je=function(){return 0;},t;}())();/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var Bt=function(){function t(t){this.N=t,this.data=new Ut(this.N);}return t.prototype.has=function(t){return null!==this.data.get(t);},t.prototype.first=function(){return this.data.Ve();},t.prototype.last=function(){return this.data.ge();},Object.defineProperty(t.prototype,"size",{get:function(){return this.data.size;},enumerable:!0,configurable:!0}),t.prototype.indexOf=function(t){return this.data.indexOf(t);},t.prototype.forEach=function(t){this.data.pe(function(e,n){return t(e),!1;});},t.prototype.Ke=function(t,e){for(var n=this.data.ve(t[0]);n.$e();){var r=n.Ne();if(this.N(r.key,t[1])>=0)return;e(r.key);}},t.prototype.Ge=function(t,e){var n;for(n=void 0!==e?this.data.ve(e):this.data.be();n.$e();)if(!t(n.Ne().key))return;},t.prototype.ze=function(t){var e=this.data.ve(t);return e.$e()?e.Ne().key:null;},t.prototype.be=function(){return new zt(this.data.be());},t.prototype.ve=function(t){return new zt(this.data.ve(t));},t.prototype.add=function(t){return this.me(this.data.remove(t).Ae(t,!0));},t.prototype.delete=function(t){return this.has(t)?this.me(this.data.remove(t)):this;},t.prototype.B=function(){return this.data.B();},t.prototype.He=function(t){var e=this;return e.size<t.size&&(e=t,t=this),t.forEach(function(t){e=e.add(t);}),e;},t.prototype.isEqual=function(e){if(!(e instanceof t))return !1;if(this.size!==e.size)return !1;for(var n=this.data.be(),r=e.data.be();n.$e();){var i=n.Ne().key,o=r.Ne().key;if(0!==this.N(i,o))return !1;}return !0;},t.prototype.W=function(){var t=[];return this.forEach(function(e){t.push(e);}),t;},t.prototype.toString=function(){var t=[];return this.forEach(function(e){return t.push(e);}),"SortedSet("+t.toString()+")";},t.prototype.me=function(e){var n=new t(this.N);return n.data=e,n;},t;}(),zt=function(){function t(t){this.Ye=t;}return t.prototype.Ne=function(){return this.Ye.Ne().key;},t.prototype.$e=function(){return this.Ye.$e();},t;}(),Gt=new Ut(x.N);function Wt(){return Gt;}function Ht(){return Wt();}var Kt=new Ut(x.N);function Yt(){return Kt;}var Xt=new Ut(x.N),Qt=new Bt(x.N);function Jt(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];for(var n=Qt,r=0,i=t;r<i.length;r++){var o=i[r];n=n.add(o);}return n;}var $t=new Bt(ke);function Zt(){return $t;}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var te=function(){function t(t){this.N=t?function(e,n){return t(e,n)||x.N(e.key,n.key);}:function(t,e){return x.N(t.key,e.key);},this.Je=Yt(),this.Xe=new Ut(this.N);}return t.Ze=function(e){return new t(e.N);},t.prototype.has=function(t){return null!=this.Je.get(t);},t.prototype.get=function(t){return this.Je.get(t);},t.prototype.first=function(){return this.Xe.Ve();},t.prototype.last=function(){return this.Xe.ge();},t.prototype.B=function(){return this.Xe.B();},t.prototype.indexOf=function(t){var e=this.Je.get(t);return e?this.Xe.indexOf(e):-1;},Object.defineProperty(t.prototype,"size",{get:function(){return this.Xe.size;},enumerable:!0,configurable:!0}),t.prototype.forEach=function(t){this.Xe.pe(function(e,n){return t(e),!1;});},t.prototype.add=function(t){var e=this.delete(t.key);return e.me(e.Je.Ae(t.key,t),e.Xe.Ae(t,null));},t.prototype.delete=function(t){var e=this.get(t);return e?this.me(this.Je.remove(t),this.Xe.remove(e)):this;},t.prototype.isEqual=function(e){if(!(e instanceof t))return !1;if(this.size!==e.size)return !1;for(var n=this.Xe.be(),r=e.Xe.be();n.$e();){var i=n.Ne().key,o=r.Ne().key;if(!i.isEqual(o))return !1;}return !0;},t.prototype.toString=function(){var t=[];return this.forEach(function(e){t.push(e.toString());}),0===t.length?"DocumentSet ()":"DocumentSet (\n  "+t.join("  \n")+"\n)";},t.prototype.me=function(e,n){var r=new t();return r.N=this.N,r.Je=e,r.Xe=n,r;},t;}(),ee=function(){function t(){this.ts=new Ut(x.N);}return t.prototype.track=function(t){var e=t.doc.key,n=this.ts.get(e);n?0!==t.type&&3===n.type?this.ts=this.ts.Ae(e,t):3===t.type&&1!==n.type?this.ts=this.ts.Ae(e,{type:n.type,doc:t.doc}):2===t.type&&2===n.type?this.ts=this.ts.Ae(e,{type:2,doc:t.doc}):2===t.type&&0===n.type?this.ts=this.ts.Ae(e,{type:0,doc:t.doc}):1===t.type&&0===n.type?this.ts=this.ts.remove(e):1===t.type&&2===n.type?this.ts=this.ts.Ae(e,{type:1,doc:n.doc}):0===t.type&&1===n.type?this.ts=this.ts.Ae(e,{type:2,doc:t.doc}):Ee():this.ts=this.ts.Ae(e,t);},t.prototype.es=function(){var t=[];return this.ts.pe(function(e,n){t.push(n);}),t;},t;}(),ne=function(){function t(t,e,n,r,i,o,s,a){this.query=t,this.docs=e,this.ss=n,this.docChanges=r,this.ns=i,this.fromCache=o,this.rs=s,this.hs=a;}return t.os=function(e,n,r,i){var o=[];return n.forEach(function(t){o.push({type:0,doc:t});}),new t(e,n,te.Ze(n),o,r,i,!0,!1);},Object.defineProperty(t.prototype,"hasPendingWrites",{get:function(){return !this.ns.B();},enumerable:!0,configurable:!0}),t.prototype.isEqual=function(t){if(!(this.fromCache===t.fromCache&&this.rs===t.rs&&this.ns.isEqual(t.ns)&&this.query.isEqual(t.query)&&this.docs.isEqual(t.docs)&&this.ss.isEqual(t.ss)))return !1;var e=this.docChanges,n=t.docChanges;if(e.length!==n.length)return !1;for(var r=0;r<e.length;r++)if(e[r].type!==n[r].type||!e[r].doc.isEqual(n[r].doc))return !1;return !0;},t;}(),re=function(){function t(t,e,n,r,i){this.Ee=t,this.as=e,this.us=n,this.cs=r,this._s=i;}return t.ls=function(e,n){var r=new Map();return r.set(e,ie.ds(e,n)),new t(T.min(),r,Zt(),Wt(),Jt());},t;}(),ie=function(){function t(t,e,n,r,i){this.resumeToken=t,this.fs=e,this.Ts=n,this.Es=r,this.ws=i;}return t.ds=function(e,n){return new t(C.ht,n,Jt(),Jt(),Jt());},t;}(),oe=function(t,e,n,r){this.Is=t,this.removedTargetIds=e,this.key=n,this.Rs=r;},se=function(t,e){this.targetId=t,this.As=e;},ae=function(t,e,n,r){void 0===n&&(n=C.ht),void 0===r&&(r=null),this.state=t,this.targetIds=e,this.resumeToken=n,this.cause=r;},ue=function(){function t(){this.ms=0,this.Ps=le(),this.Vs=C.ht,this.gs=!1,this.ps=!0;}return Object.defineProperty(t.prototype,"fs",{get:function(){return this.gs;},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"resumeToken",{get:function(){return this.Vs;},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"ys",{get:function(){return 0!==this.ms;},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"bs",{get:function(){return this.ps;},enumerable:!0,configurable:!0}),t.prototype.vs=function(t){t.rt()>0&&(this.ps=!0,this.Vs=t);},t.prototype.Ss=function(){var t=Jt(),e=Jt(),n=Jt();return this.Ps.forEach(function(r,i){switch(i){case 0:t=t.add(r);break;case 2:e=e.add(r);break;case 1:n=n.add(r);break;default:Ee();}}),new ie(this.Vs,this.gs,t,e,n);},t.prototype.Ds=function(){this.ps=!1,this.Ps=le();},t.prototype.Cs=function(t,e){this.ps=!0,this.Ps=this.Ps.Ae(t,e);},t.prototype.Fs=function(t){this.ps=!0,this.Ps=this.Ps.remove(t);},t.prototype.Ns=function(){this.ms+=1;},t.prototype.$s=function(){this.ms-=1;},t.prototype.ks=function(){this.ps=!0,this.gs=!0;},t;}(),ce=function(){function t(t){this.Ms=t,this.xs=new Map(),this.Ls=Wt(),this.Os=he(),this.Bs=new Bt(ke);}return t.prototype.qs=function(t){for(var e=0,n=t.Is;e<n.length;e++){var r=n[e];t.Rs instanceof Et?this.Us(r,t.Rs):t.Rs instanceof It&&this.Qs(r,t.key,t.Rs);}for(var i=0,o=t.removedTargetIds;i<o.length;i++){var s=o[i];this.Qs(s,t.key,t.Rs);}},t.prototype.Ws=function(t){var e=this;this.js(t,function(n){var r=e.Ks(n);switch(t.state){case 0:e.Gs(n)&&r.vs(t.resumeToken);break;case 1:r.$s(),r.ys||r.Ds(),r.vs(t.resumeToken);break;case 2:r.$s(),r.ys||e.removeTarget(n);break;case 3:e.Gs(n)&&(r.ks(),r.vs(t.resumeToken));break;case 4:e.Gs(n)&&(e.zs(n),r.vs(t.resumeToken));break;default:Ee();}});},t.prototype.js=function(t,e){var n=this;t.targetIds.length>0?t.targetIds.forEach(e):this.xs.forEach(function(t,r){n.Gs(r)&&e(r);});},t.prototype.Hs=function(t){var e=t.targetId,n=t.As.count,r=this.Ys(e);if(r){var i=r.target;if(i.Lt()){if(0===n){var o=new x(i.path);this.Qs(e,o,new It(o,T.min()));}else Ie(1===n);}else this.Js(e)!==n&&(this.zs(e),this.Bs=this.Bs.add(e));}},t.prototype.Xs=function(t){var e=this,n=new Map();this.xs.forEach(function(r,i){var o=e.Ys(i);if(o){if(r.fs&&o.target.Lt()){var s=new x(o.target.path);null!==e.Ls.get(s)||e.Zs(i,s)||e.Qs(i,s,new It(s,t));}r.bs&&(n.set(i,r.Ss()),r.Ds());}});var r=Jt();this.Os.forEach(function(t,n){var i=!0;n.Ge(function(t){var n=e.Ys(t);return !n||2===n.Te||(i=!1,!1);}),i&&(r=r.add(t));});var i=new re(t,n,this.Bs,this.Ls,r);return this.Ls=Wt(),this.Os=he(),this.Bs=new Bt(ke),i;},t.prototype.Us=function(t,e){if(this.Gs(t)){var n=this.Zs(t,e.key)?2:0;this.Ks(t).Cs(e.key,n),this.Ls=this.Ls.Ae(e.key,e),this.Os=this.Os.Ae(e.key,this.ti(e.key).add(t));}},t.prototype.Qs=function(t,e,n){if(this.Gs(t)){var r=this.Ks(t);this.Zs(t,e)?r.Cs(e,1):r.Fs(e),this.Os=this.Os.Ae(e,this.ti(e).delete(t)),n&&(this.Ls=this.Ls.Ae(e,n));}},t.prototype.removeTarget=function(t){this.xs.delete(t);},t.prototype.Js=function(t){var e=this.Ks(t).Ss();return this.Ms.ei(t).size+e.Ts.size-e.ws.size;},t.prototype.Ns=function(t){this.Ks(t).Ns();},t.prototype.Ks=function(t){var e=this.xs.get(t);return e||(e=new ue(),this.xs.set(t,e)),e;},t.prototype.ti=function(t){var e=this.Os.get(t);return e||(e=new Bt(ke),this.Os=this.Os.Ae(t,e)),e;},t.prototype.Gs=function(t){var e=null!==this.Ys(t);return e||be("WatchChangeAggregator","Detected inactive target",t),e;},t.prototype.Ys=function(t){var e=this.xs.get(t);return e&&e.ys?null:this.Ms.si(t);},t.prototype.zs=function(t){var e=this;this.xs.set(t,new ue()),this.Ms.ei(t).forEach(function(n){e.Qs(t,n,null);});},t.prototype.Zs=function(t,e){return this.Ms.ei(t).has(e);},t;}();/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function he(){return new Ut(x.N);}function le(){return new Ut(x.N);}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var fe={asc:"ASCENDING",desc:"DESCENDING"},pe={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","array-contains-any":"ARRAY_CONTAINS_ANY"},de=function(){function t(t,e){this.ii=t,this.options=e;}return t.prototype.ni=function(t){var e=void 0===t.code?d.UNKNOWN:Vt(t.code);return new v(e,t.message||"");},t.prototype.ri=function(t){return this.options.hi||P(t)?t:{value:t};},t.prototype.oi=function(t){var e;return P(e="object"==typeof t?t.value:t)?null:e;},t.prototype._t=function(t){return {integerValue:""+t};},t.prototype.lt=function(t){if(this.options.hi){if(isNaN(t))return {doubleValue:"NaN"};if(t===1/0)return {doubleValue:"Infinity"};if(t===-1/0)return {doubleValue:"-Infinity"};}return {doubleValue:L(t)?"-0":t};},t.prototype.ai=function(t){return M(t)?this._t(t):this.lt(t);},t.prototype.C=function(t){return this.options.hi?new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")+"."+("000000000"+t.nanoseconds).slice(-9)+"Z":{seconds:""+t.seconds,nanos:t.nanoseconds};},t.prototype.v=function(t){var e=H(t);return new I(e.seconds,e.nanos);},t.prototype.ui=function(t){return this.options.hi?t.toBase64():t.toUint8Array();},t.prototype.ci=function(t){return this.options.hi?(Ie(void 0===t||"string"==typeof t),C.fromBase64String(t||"")):(Ie(void 0===t||t instanceof Uint8Array),C.fromUint8Array(t||new Uint8Array()));},t.prototype.toVersion=function(t){return this.C(t.C());},t.prototype.fromVersion=function(t){return Ie(!!t),T.v(this.v(t));},t.prototype._i=function(t,e){return this.li(e||this.ii).child("documents").child(t).j();},t.prototype.di=function(t){var e=k.K(t);return Ie(ve(e)),e;},t.prototype.fi=function(t){return this._i(t.path);},t.prototype.Z=function(t){var e=this.di(t);return Ie(e.get(1)===this.ii.projectId),Ie(!e.get(3)&&!this.ii.database||e.get(3)===this.ii.database),new x(this.Ti(e));},t.prototype.Ei=function(t){return this._i(t);},t.prototype.wi=function(t){var e=this.di(t);return 4===e.length?k.G:this.Ti(e);},Object.defineProperty(t.prototype,"Ii",{get:function(){return new k(["projects",this.ii.projectId,"databases",this.ii.database]).j();},enumerable:!0,configurable:!0}),t.prototype.li=function(t){return new k(["projects",t.projectId,"databases",t.database]);},t.prototype.Ti=function(t){return Ie(t.length>4&&"documents"===t.get(4)),t.k(5);},t.prototype.Ri=function(t,e){return {name:this.fi(t),fields:e.proto.mapValue.fields};},t.prototype.Ai=function(t){return {name:this.fi(t.key),fields:t.Mt().mapValue.fields,updateTime:this.C(t.version.C())};},t.prototype.mi=function(t,e){var n=this.Z(t.name),r=this.fromVersion(t.updateTime),i=new yt({mapValue:{fields:t.fields}});return new Et(n,r,i,{hasCommittedMutations:!!e});},t.prototype.Pi=function(t){Ie(!!t.found),t.found.name,t.found.updateTime;var e=this.Z(t.found.name),n=this.fromVersion(t.found.updateTime),r=new yt({mapValue:{fields:t.found.fields}});return new Et(e,n,r,{});},t.prototype.Vi=function(t){Ie(!!t.missing),Ie(!!t.readTime);var e=this.Z(t.missing),n=this.fromVersion(t.readTime);return new It(e,n);},t.prototype.gi=function(t){return "found"in t?this.Pi(t):"missing"in t?this.Vi(t):Ee();},t.prototype.pi=function(t){var e;if("targetChange"in t){t.targetChange;var n=this.yi(t.targetChange.targetChangeType||"NO_CHANGE"),r=t.targetChange.targetIds||[],i=this.ci(t.targetChange.resumeToken),o=t.targetChange.cause,s=o&&this.ni(o);e=new ae(n,r,i,s||null);}else if("documentChange"in t){t.documentChange;var a=t.documentChange;a.document,a.document.name,a.document.updateTime;var u=this.Z(a.document.name),c=this.fromVersion(a.document.updateTime),h=new yt({mapValue:{fields:a.document.fields}}),l=new Et(u,c,h,{}),f=a.targetIds||[],p=a.removedTargetIds||[];e=new oe(f,p,l.key,l);}else if("documentDelete"in t){t.documentDelete;var d=t.documentDelete;d.document;var v=this.Z(d.document),y=d.readTime?this.fromVersion(d.readTime):T.min(),m=new It(v,y),g=d.removedTargetIds||[];e=new oe([],g,m.key,m);}else if("documentRemove"in t){t.documentRemove;var b=t.documentRemove;b.document;var w=this.Z(b.document),_=b.removedTargetIds||[];e=new oe([],_,w,null);}else {if(!("filter"in t))return Ee();t.filter;var E=t.filter;E.targetId;var I=E.count||0,A=new Mt(I),k=E.targetId;e=new se(k,A);}return e;},t.prototype.yi=function(t){return "NO_CHANGE"===t?0:"ADD"===t?1:"REMOVE"===t?2:"CURRENT"===t?3:"RESET"===t?4:Ee();},t.prototype.bi=function(t){if(!("targetChange"in t))return T.min();var e=t.targetChange;return e.targetIds&&e.targetIds.length?T.min():e.readTime?this.fromVersion(e.readTime):T.min();},t.prototype.vi=function(t){var e,n=this;if(t instanceof lt)e={update:this.Ri(t.key,t.value)};else if(t instanceof dt)e={delete:this.fi(t.key)};else if(t instanceof ft)e={update:this.Ri(t.key,t.data),updateMask:this.Si(t.Vt)};else if(t instanceof pt)e={transform:{document:this.fi(t.key),fieldTransforms:t.fieldTransforms.map(function(t){return n.Di(t);})}};else {if(!(t instanceof vt))return Ee();e={verify:this.fi(t.key)};}return t.Rt.Tt||(e.currentDocument=this.Ci(t.Rt)),e;},t.prototype.Fi=function(t){var e=this,n=t.currentDocument?this.Ni(t.currentDocument):ct.ft();if(t.update){t.update.name;var r=this.Z(t.update.name),i=new yt({mapValue:{fields:t.update.fields}});if(t.updateMask){var o=this.$i(t.updateMask);return new ft(r,i,o,n);}return new lt(r,i,n);}if(t.delete){var s=this.Z(t.delete);return new dt(s,n);}if(t.transform){var a=this.Z(t.transform.document),u=t.transform.fieldTransforms.map(function(t){return e.ki(t);});return Ie(!0===n.exists),new pt(a,u);}if(t.verify){var c=this.Z(t.verify);return new vt(c,n);}return Ee();},t.prototype.Ci=function(t){return void 0!==t.updateTime?{updateTime:this.toVersion(t.updateTime)}:void 0!==t.exists?{exists:t.exists}:Ee();},t.prototype.Ni=function(t){return void 0!==t.updateTime?ct.updateTime(this.fromVersion(t.updateTime)):void 0!==t.exists?ct.exists(t.exists):ct.ft();},t.prototype.Mi=function(t,e){var n=t.updateTime?this.fromVersion(t.updateTime):this.fromVersion(e);n.isEqual(T.min())&&(n=this.fromVersion(e));var r=null;return t.transformResults&&t.transformResults.length>0&&(r=t.transformResults),new ut(n,r);},t.prototype.xi=function(t,e){var n=this;return t&&t.length>0?(Ie(void 0!==e),t.map(function(t){return n.Mi(t,e);})):[];},t.prototype.Di=function(t){var e=t.transform;if(e instanceof et)return {fieldPath:t.field.j(),setToServerValue:"REQUEST_TIME"};if(e instanceof nt)return {fieldPath:t.field.j(),appendMissingElements:{values:e.elements}};if(e instanceof rt)return {fieldPath:t.field.j(),removeAllFromArray:{values:e.elements}};if(e instanceof it)return {fieldPath:t.field.j(),increment:e.ct};throw Ee();},t.prototype.ki=function(t){var e=null;if("setToServerValue"in t)Ie("REQUEST_TIME"===t.setToServerValue),e=et.instance;else if("appendMissingElements"in t){var n=t.appendMissingElements.values||[];e=new nt(n);}else if("removeAllFromArray"in t){var r=t.removeAllFromArray.values||[];e=new rt(r);}else "increment"in t?e=new it(this,t.increment):Ee();var i=S.X(t.fieldPath);return new at(i,e);},t.prototype.Li=function(t){return {documents:[this.Ei(t.path)]};},t.prototype.Oi=function(t){Ie(1===t.documents.length);var e=t.documents[0];return kt.Wt(this.wi(e)).ee();},t.prototype.Bi=function(t){var e={structuredQuery:{}},n=t.path;null!==t.collectionGroup?(e.parent=this.Ei(n),e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(e.parent=this.Ei(n.M()),e.structuredQuery.from=[{collectionId:n.O()}]);var r=this.qi(t.filters);r&&(e.structuredQuery.where=r);var i=this.Ui(t.orderBy);i&&(e.structuredQuery.orderBy=i);var o=this.ri(t.limit);return null!==o&&(e.structuredQuery.limit=o),t.startAt&&(e.structuredQuery.startAt=this.Qi(t.startAt)),t.endAt&&(e.structuredQuery.endAt=this.Qi(t.endAt)),e;},t.prototype.Wi=function(t){var e=this.wi(t.parent),n=t.structuredQuery,r=n.from?n.from.length:0,i=null;if(r>0){Ie(1===r);var o=n.from[0];o.allDescendants?i=o.collectionId:e=e.child(o.collectionId);}var s=[];n.where&&(s=this.ji(n.where));var a=[];n.orderBy&&(a=this.Ki(n.orderBy));var u=null;n.limit&&(u=this.oi(n.limit));var c=null;n.startAt&&(c=this.Gi(n.startAt));var h=null;return n.endAt&&(h=this.Gi(n.endAt)),new kt(e,i,a,s,u,"F",c,h).ee();},t.prototype.zi=function(t){var e=this.Hi(t.Te);return null==e?null:{"goog-listen-tags":e};},t.prototype.Hi=function(t){switch(t){case 0:return null;case 1:return "existence-filter-mismatch";case 2:return "limbo-document";default:return Ee();}},t.prototype.ee=function(t){var e,n=t.target;return (e=n.Lt()?{documents:this.Li(n)}:{query:this.Bi(n)}).targetId=t.targetId,t.resumeToken.rt()>0&&(e.resumeToken=this.ui(t.resumeToken)),e;},t.prototype.qi=function(t){var e=this;if(0!==t.length){var n=t.map(function(t){return t instanceof Nt?e.Yi(t):Ee();});return 1===n.length?n[0]:{compositeFilter:{op:"AND",filters:n}};}},t.prototype.ji=function(t){var e=this;return t?void 0!==t.unaryFilter?[this.Ji(t)]:void 0!==t.fieldFilter?[this.Xi(t)]:void 0!==t.compositeFilter?t.compositeFilter.filters.map(function(t){return e.ji(t);}).reduce(function(t,e){return t.concat(e);}):Ee():[];},t.prototype.Ui=function(t){var e=this;if(0!==t.length)return t.map(function(t){return e.Zi(t);});},t.prototype.Ki=function(t){var e=this;return t.map(function(t){return e.tn(t);});},t.prototype.Qi=function(t){return {before:t.before,values:t.position};},t.prototype.Gi=function(t){var e=!!t.before,n=t.values||[];return new Ct(n,e);},t.prototype.en=function(t){return fe[t];},t.prototype.sn=function(t){switch(t){case"ASCENDING":return "asc";case"DESCENDING":return "desc";default:return;}},t.prototype.nn=function(t){return pe[t];},t.prototype.rn=function(t){switch(t){case"EQUAL":return "==";case"GREATER_THAN":return ">";case"GREATER_THAN_OR_EQUAL":return ">=";case"LESS_THAN":return "<";case"LESS_THAN_OR_EQUAL":return "<=";case"ARRAY_CONTAINS":return "array-contains";case"IN":return "in";case"ARRAY_CONTAINS_ANY":return "array-contains-any";case"OPERATOR_UNSPECIFIED":default:return Ee();}},t.prototype.hn=function(t){return {fieldPath:t.j()};},t.prototype.on=function(t){return S.X(t.fieldPath);},t.prototype.Zi=function(t){return {field:this.hn(t.field),direction:this.en(t.dir)};},t.prototype.tn=function(t){return new Pt(this.on(t.field),this.sn(t.direction));},t.prototype.Xi=function(t){return Nt.create(this.on(t.fieldFilter.field),this.rn(t.fieldFilter.op),t.fieldFilter.value);},t.prototype.Yi=function(t){if("=="===t.op){if(Z(t.value))return {unaryFilter:{field:this.hn(t.field),op:"IS_NAN"}};if($(t.value))return {unaryFilter:{field:this.hn(t.field),op:"IS_NULL"}};}return {fieldFilter:{field:this.hn(t.field),op:this.nn(t.op),value:t.value}};},t.prototype.Ji=function(t){switch(t.unaryFilter.op){case"IS_NAN":var e=this.on(t.unaryFilter.field);return Nt.create(e,"==",{doubleValue:NaN});case"IS_NULL":var n=this.on(t.unaryFilter.field);return Nt.create(n,"==",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":default:return Ee();}},t.prototype.Si=function(t){var e=[];return t.fields.forEach(function(t){return e.push(t.j());}),{fieldPaths:e};},t.prototype.$i=function(t){var e=t.fieldPaths||[];return new st(e.map(function(t){return S.X(t);}));},t;}();function ve(t){return t.length>=4&&"projects"===t.get(0)&&"databases"===t.get(2);}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var ye=function(){function t(){}return t.an=function(e){t.platform&&Ee(),t.platform=e;},t.nt=function(){return t.platform||Ee(),t.platform;},t;}(),me=new o.Logger("@firebase/firestore");/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function ge(){return me.logLevel;}function be(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];if(me.logLevel<=o.LogLevel.DEBUG){var i=e.map(_e);me.debug.apply(me,r.__spreadArrays(["Firestore ("+f+"): "+t],i));}}function we(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];if(me.logLevel<=o.LogLevel.ERROR){var i=e.map(_e);me.error.apply(me,r.__spreadArrays(["Firestore ("+f+"): "+t],i));}}function _e(t){if("string"==typeof t)return t;var e=ye.nt();try{return e.un(t);}catch(e){return t;}}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function Ee(t){void 0===t&&(t="Unexpected state");var e="FIRESTORE ("+f+") INTERNAL ASSERTION FAILED: "+t;throw we(e),new Error(e);}function Ie(t,e){t||Ee();}function Te(t,e){return t;}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var Ae=function(){function t(){}return t.cn=function(){for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=Math.floor(256/t.length)*t.length,n="";n.length<20;)for(var r=ye.nt()._n(40),i=0;i<r.length;++i)n.length<20&&r[i]<e&&(n+=t.charAt(r[i]%t.length));return n;},t;}();function ke(t,e){return t<e?-1:t>e?1:0;}function Ne(t,e,n){return t.length===e.length&&t.every(function(t,r){return n(t,e[r]);});}function Se(t){return t+"\0";}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var xe=function(t,e,n,r,i){this.ii=t,this.persistenceKey=e,this.host=n,this.ssl=r,this.forceLongPolling=i;},Oe=function(){function t(t,e){this.projectId=t,this.database=e||"(default)";}return Object.defineProperty(t.prototype,"ln",{get:function(){return "(default)"===this.database;},enumerable:!0,configurable:!0}),t.prototype.isEqual=function(e){return e instanceof t&&e.projectId===this.projectId&&e.database===this.database;},t.prototype.S=function(t){return ke(this.projectId,t.projectId)||ke(this.database,t.database);},t;}(),De=function(){function t(t){this.dn=t,this.fn={};}return t.prototype.get=function(t){var e=this.dn(t),n=this.fn[e];if(void 0!==n)for(var r=0,i=n;r<i.length;r++){var o=i[r],s=o[0],a=o[1];if(s.isEqual(t))return a;}},t.prototype.has=function(t){return void 0!==this.get(t);},t.prototype.set=function(t,e){var n=this.dn(t),r=this.fn[n];if(void 0!==r){for(var i=0;i<r.length;i++)if(r[i][0].isEqual(t))return void(r[i]=[t,e]);r.push([t,e]);}else this.fn[n]=[[t,e]];},t.prototype.delete=function(t){var e=this.dn(t),n=this.fn[e];if(void 0===n)return !1;for(var r=0;r<n.length;r++)if(n[r][0].isEqual(t))return 1===n.length?delete this.fn[e]:n.splice(r,1),!0;return !1;},t.prototype.forEach=function(t){D(this.fn,function(e,n){for(var r=0,i=n;r<i.length;r++){var o=i[r],s=o[0],a=o[1];t(s,a);}});},t.prototype.B=function(){return R(this.fn);},t;}(),Re=function(){function t(t,e,n,r){this.batchId=t,this.Tn=e,this.baseMutations=n,this.mutations=r;}return t.prototype.at=function(t,e,n){for(var r=n.En,i=0;i<this.mutations.length;i++){var o=this.mutations[i];if(o.key.isEqual(t)){var s=r[i];e=o.at(e,s);}}return e;},t.prototype.ot=function(t,e){for(var n=0,r=this.baseMutations;n<r.length;n++){var i=r[n];i.key.isEqual(t)&&(e=i.ot(e,e,this.Tn));}for(var o=e,s=0,a=this.mutations;s<a.length;s++){var u=a[s];u.key.isEqual(t)&&(e=u.ot(e,o,this.Tn));}return e;},t.prototype.wn=function(t){var e=this,n=t;return this.mutations.forEach(function(r){var i=e.ot(r.key,t.get(r.key));i&&(n=n.Ae(r.key,i));}),n;},t.prototype.keys=function(){return this.mutations.reduce(function(t,e){return t.add(e.key);},Jt());},t.prototype.isEqual=function(t){return this.batchId===t.batchId&&Ne(this.mutations,t.mutations,function(t,e){return t.isEqual(e);})&&Ne(this.baseMutations,t.baseMutations,function(t,e){return t.isEqual(e);});},t;}(),Ce=function(){function t(t,e,n,r){this.batch=t,this.In=e,this.En=n,this.Rn=r;}return t.from=function(e,n,r){Ie(e.mutations.length===r.length);for(var i=Xt,o=e.mutations,s=0;s<o.length;s++)i=i.Ae(o[s].key,r[s].version);return new t(e,n,r,i);},t;}(),Pe=function(){function t(t){var e=this;this.An=null,this.mn=null,this.result=void 0,this.error=void 0,this.Pn=!1,this.Vn=!1,t(function(t){e.Pn=!0,e.result=t,e.An&&e.An(t);},function(t){e.Pn=!0,e.error=t,e.mn&&e.mn(t);});}return t.prototype.catch=function(t){return this.next(void 0,t);},t.prototype.next=function(e,n){var r=this;return this.Vn&&Ee(),this.Vn=!0,this.Pn?this.error?this.gn(n,this.error):this.pn(e,this.result):new t(function(t,i){r.An=function(n){r.pn(e,n).next(t,i);},r.mn=function(e){r.gn(n,e).next(t,i);};});},t.prototype.yn=function(){var t=this;return new Promise(function(e,n){t.next(e,n);});},t.prototype.bn=function(e){try{var n=e();return n instanceof t?n:t.resolve(n);}catch(e){return t.reject(e);}},t.prototype.pn=function(e,n){return e?this.bn(function(){return e(n);}):t.resolve(n);},t.prototype.gn=function(e,n){return e?this.bn(function(){return e(n);}):t.reject(n);},t.resolve=function(e){return new t(function(t,n){t(e);});},t.reject=function(e){return new t(function(t,n){n(e);});},t.vn=function(e){return new t(function(t,n){var r=0,i=0,o=!1;e.forEach(function(e){++r,e.next(function(){++i,o&&i===r&&t();},function(t){return n(t);});}),o=!0,i===r&&t();});},t.Sn=function(e){for(var n=t.resolve(!1),r=function(e){n=n.next(function(n){return n?t.resolve(n):e();});},i=0,o=e;i<o.length;i++)r(o[i]);return n;},t.forEach=function(t,e){var n=this,r=[];return t.forEach(function(t,i){r.push(e.call(n,t,i));}),this.vn(r);},t;}(),Le=function(){function t(){this.Dn=new De(function(t){return t.toString();}),this.Cn=!1;}return Object.defineProperty(t.prototype,"readTime",{get:function(){return this.Fn;},set:function(t){this.Fn=t;},enumerable:!0,configurable:!0}),t.prototype.Nn=function(t,e){this.$n(),this.readTime=e,this.Dn.set(t.key,t);},t.prototype.kn=function(t,e){this.$n(),e&&(this.readTime=e),this.Dn.set(t,null);},t.prototype.Mn=function(t,e){this.$n();var n=this.Dn.get(e);return void 0!==n?Pe.resolve(n):this.xn(t,e);},t.prototype.getEntries=function(t,e){return this.Ln(t,e);},t.prototype.apply=function(t){return this.$n(),this.Cn=!0,this.On(t);},t.prototype.$n=function(){},t;}(),Me="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.",je=function(){function t(){this.Bn=[];}return t.prototype.qn=function(t){this.Bn.push(t);},t.prototype.Un=function(){this.Bn.forEach(function(t){return t();});},t;}(),Ve=function(){function t(t,e,n){this.Qn=t,this.Wn=e,this.jn=n;}return t.prototype.Kn=function(t,e){var n=this;return this.Wn.Gn(t,e).next(function(r){return n.zn(t,e,r);});},t.prototype.zn=function(t,e,n){return this.Qn.Mn(t,e).next(function(t){for(var r=0,i=n;r<i.length;r++)t=i[r].ot(e,t);return t;});},t.prototype.Hn=function(t,e,n){var r=Ht();return e.forEach(function(t,e){for(var i=0,o=n;i<o.length;i++)e=o[i].ot(t,e);r=r.Ae(t,e);}),r;},t.prototype.Yn=function(t,e){var n=this;return this.Qn.getEntries(t,e).next(function(e){return n.Jn(t,e);});},t.prototype.Jn=function(t,e){var n=this;return this.Wn.Xn(t,e).next(function(r){var i=n.Hn(t,e,r),o=Wt();return i.forEach(function(t,e){e||(e=new It(t,T.min())),o=o.Ae(t,e);}),o;});},t.prototype.Zn=function(t,e,n){return e.Lt()?this.tr(t,e.path):e._e()?this.er(t,e,n):this.sr(t,e,n);},t.prototype.tr=function(t,e){return this.Kn(t,new x(e)).next(function(t){var e=Yt();return t instanceof Et&&(e=e.Ae(t.key,t)),e;});},t.prototype.er=function(t,e,n){var r=this,i=e.collectionGroup,o=Yt();return this.jn.ir(t,i).next(function(s){return Pe.forEach(s,function(s){var a=e.Zt(s.child(i));return r.sr(t,a,n).next(function(t){t.forEach(function(t,e){o=o.Ae(t,e);});});}).next(function(){return o;});});},t.prototype.sr=function(t,e,n){var r,i,o=this;return this.Qn.Zn(t,e,n).next(function(n){return r=n,o.Wn.nr(t,e);}).next(function(e){return i=e,o.rr(t,i,r).next(function(t){r=t;for(var e=0,n=i;e<n.length;e++)for(var o=n[e],s=0,a=o.mutations;s<a.length;s++){var u=a[s],c=u.key,h=r.get(c),l=u.ot(h,h,o.Tn);r=l instanceof Et?r.Ae(c,l):r.remove(c);}});}).next(function(){return r.forEach(function(t,n){e.matches(n)||(r=r.remove(t));}),r;});},t.prototype.rr=function(t,e,n){for(var r=Jt(),i=0,o=e;i<o.length;i++)for(var s=0,a=o[i].mutations;s<a.length;s++){var u=a[s];u instanceof ft&&null===n.get(u.key)&&(r=r.add(u.key));}var c=n;return this.Qn.getEntries(t,r).next(function(t){return t.forEach(function(t,e){null!==e&&e instanceof Et&&(c=c.Ae(t,e));}),c;});},t;}(),Ue=function(){function t(t,e,n,r){this.targetId=t,this.fromCache=e,this.hr=n,this.or=r;}return t.ar=function(e,n){for(var r=Jt(),i=Jt(),o=0,s=n.docChanges;o<s.length;o++){var a=s[o];switch(a.type){case 0:r=r.add(a.doc.key);break;case 1:i=i.add(a.doc.key);}}return new t(e,n.fromCache,r,i);},t;}(),Fe=function(){function t(t,e){var n=this;this.previousValue=t,e&&(e.ur=function(t){return n.cr(t);},this._r=function(t){return e.lr(t);});}return t.prototype.cr=function(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue;},t.prototype.next=function(){var t=++this.previousValue;return this._r&&this._r(t),t;},t;}();Fe.dr=-1;/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var qe=function(){var t=this;this.promise=new Promise(function(e,n){t.resolve=e,t.reject=n;});},Be=function(){function t(t,e,n,r,i){void 0===n&&(n=1e3),void 0===r&&(r=1.5),void 0===i&&(i=6e4),this.Tr=t,this.Er=e,this.wr=n,this.Ir=r,this.Rr=i,this.Ar=0,this.mr=null,this.Pr=Date.now(),this.reset();}return t.prototype.reset=function(){this.Ar=0;},t.prototype.Vr=function(){this.Ar=this.Rr;},t.prototype.gr=function(t){var e=this;this.cancel();var n=Math.floor(this.Ar+this.pr()),r=Math.max(0,Date.now()-this.Pr),i=Math.max(0,n-r);i>0&&be("ExponentialBackoff","Backing off for "+i+" ms (base delay: "+this.Ar+" ms, delay with jitter: "+n+" ms, last attempt: "+r+" ms ago)"),this.mr=this.Tr.yr(this.Er,i,function(){return e.Pr=Date.now(),t();}),this.Ar*=this.Ir,this.Ar<this.wr&&(this.Ar=this.wr),this.Ar>this.Rr&&(this.Ar=this.Rr);},t.prototype.br=function(){null!==this.mr&&(this.mr.vr(),this.mr=null);},t.prototype.cancel=function(){null!==this.mr&&(this.mr.cancel(),this.mr=null);},t.prototype.pr=function(){return (Math.random()-.5)*this.Ar;},t;}();/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */ /**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function ze(t){for(var e="",n=0;n<t.length;n++)e.length>0&&(e=We(e)),e=Ge(t.get(n),e);return We(e);}function Ge(t,e){for(var n=e,r=t.length,i=0;i<r;i++){var o=t.charAt(i);switch(o){case"\0":n+="";break;case"":n+="";break;default:n+=o;}}return n;}function We(t){return t+"";}function He(t){var e=t.length;if(Ie(e>=2),2===e)return Ie(""===t.charAt(0)&&""===t.charAt(1)),k.G;for(var n=e-2,r=[],i="",o=0;o<e;){var s=t.indexOf("",o);switch((s<0||s>n)&&Ee(),t.charAt(s+1)){case"":var a=t.substring(o,s),u=void 0;0===i.length?u=a:(u=i+=a,i=""),r.push(u);break;case"":i+=t.substring(o,s),i+="\0";break;case"":i+=t.substring(o,s+1);break;default:Ee();}o=s+2;}return new k(r);}/**
	 * @license
	 * Copyright 2019 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var Ke=function(){function t(){this.Sr=new Ye();}return t.prototype.Dr=function(t,e){return this.Sr.add(e),Pe.resolve();},t.prototype.ir=function(t,e){return Pe.resolve(this.Sr.getEntries(e));},t;}(),Ye=function(){function t(){this.index={};}return t.prototype.add=function(t){var e=t.O(),n=t.M(),r=this.index[e]||new Bt(k.N),i=!r.has(n);return this.index[e]=r.add(n),i;},t.prototype.has=function(t){var e=t.O(),n=t.M(),r=this.index[e];return r&&r.has(n);},t.prototype.getEntries=function(t){return (this.index[t]||new Bt(k.N)).W();},t;}(),Xe=function(){function t(){this.Cr=new Ye();}return t.prototype.Dr=function(t,e){var n=this;if(!this.Cr.has(e)){var r=e.O(),i=e.M();t.qn(function(){n.Cr.add(e);});var o={collectionId:r,parent:ze(i)};return Qe(t).put(o);}return Pe.resolve();},t.prototype.ir=function(t,e){var n=[],r=IDBKeyRange.bound([e,""],[Se(e),""],!1,!0);return Qe(t).Fr(r).next(function(t){for(var r=0,i=t;r<i.length;r++){var o=i[r];if(o.collectionId!==e)break;n.push(He(o.parent));}return n;});},t;}();function Qe(t){return ln.Nr(t,Mn.store);}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var Je=function(){function t(t,e){this.serializer=t,this.jn=e;}return t.prototype.Nn=function(t,e,n){return Ze(t).put(tn(e),n);},t.prototype.kn=function(t,e){var n=Ze(t),r=tn(e);return n.delete(r);},t.prototype.updateMetadata=function(t,e){var n=this;return this.getMetadata(t).next(function(r){return r.byteSize+=e,n.$r(t,r);});},t.prototype.Mn=function(t,e){var n=this;return Ze(t).get(tn(e)).next(function(t){return n.kr(t);});},t.prototype.Mr=function(t,e){var n=this;return Ze(t).get(tn(e)).next(function(t){var e=n.kr(t);return e?{xr:e,size:en(t)}:null;});},t.prototype.getEntries=function(t,e){var n=this,r=Ht();return this.Lr(t,e,function(t,e){var i=n.kr(e);r=r.Ae(t,i);}).next(function(){return r;});},t.prototype.Or=function(t,e){var n=this,r=Ht(),i=new Ut(x.N);return this.Lr(t,e,function(t,e){var o=n.kr(e);o?(r=r.Ae(t,o),i=i.Ae(t,en(e))):(r=r.Ae(t,null),i=i.Ae(t,0));}).next(function(){return {Br:r,qr:i};});},t.prototype.Lr=function(t,e,n){if(e.B())return Pe.resolve();var r=IDBKeyRange.bound(e.first().path.W(),e.last().path.W()),i=e.be(),o=i.Ne();return Ze(t).Ur({range:r},function(t,e,r){for(var s=x.st(t);o&&x.N(o,s)<0;)n(o,null),o=i.Ne();o&&o.isEqual(s)&&(n(o,e),o=i.$e()?i.Ne():null),o?r.Qr(o.path.W()):r.done();}).next(function(){for(;o;)n(o,null),o=i.$e()?i.Ne():null;});},t.prototype.Zn=function(t,e,n){var r=this,i=Yt(),o=e.path.length+1,s={};if(n.isEqual(T.min())){var a=e.path.W();s.range=IDBKeyRange.lowerBound(a);}else {var u=e.path.W(),c=this.serializer.Wr(n);s.range=IDBKeyRange.lowerBound([u,c],!0),s.index=Dn.collectionReadTimeIndex;}return Ze(t).Ur(s,function(t,n,s){if(t.length===o){var a=r.serializer.jr(n);e.path.q(a.key.path)?a instanceof Et&&e.matches(a)&&(i=i.Ae(a.key,a)):s.done();}}).next(function(){return i;});},t.prototype.Kr=function(t,e){var n=this,r=Wt(),i=this.serializer.Wr(e),o=Ze(t),s=IDBKeyRange.lowerBound(i,!0);return o.Ur({index:Dn.readTimeIndex,range:s},function(t,e){var o=n.serializer.jr(e);r=r.Ae(o.key,o),i=e.readTime;}).next(function(){return {Gr:r,readTime:n.serializer.zr(i)};});},t.prototype.Hr=function(t){var e=this,n=Ze(t),r=T.min();return n.Ur({index:Dn.readTimeIndex,reverse:!0},function(t,n,i){n.readTime&&(r=e.serializer.zr(n.readTime)),i.done();}).next(function(){return r;});},t.prototype.Yr=function(e){return new t.Jr(this,!!e&&e.Xr);},t.prototype.Zr=function(t){return this.getMetadata(t).next(function(t){return t.byteSize;});},t.prototype.getMetadata=function(t){return $e(t).get(Rn.key).next(function(t){return Ie(!!t),t;});},t.prototype.$r=function(t,e){return $e(t).put(Rn.key,e);},t.prototype.kr=function(t){if(t){var e=this.serializer.jr(t);return e instanceof It&&e.version.isEqual(T.min())?null:e;}return null;},t;}();function $e(t){return ln.Nr(t,Rn.store);}function Ze(t){return ln.Nr(t,Dn.store);}function tn(t){return t.path.W();}function en(t){var e;if(t.document)e=t.document;else if(t.unknownDocument)e=t.unknownDocument;else {if(!t.noDocument)throw Ee();e=t.noDocument;}return JSON.stringify(e).length;}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */Je.Jr=function(t){function e(e,n){var r=this;return (r=t.call(this)||this).th=e,r.Xr=n,r.eh=new De(function(t){return t.toString();}),r;}return r.__extends(e,t),e.prototype.On=function(t){var e=this,n=[],r=0,i=new Bt(function(t,e){return ke(t.j(),e.j());});return this.Dn.forEach(function(o,s){var a=e.eh.get(o);if(s){var u=e.th.serializer.sh(s,e.readTime);i=i.add(o.path.M());var c=en(u);r+=c-a,n.push(e.th.Nn(t,o,u));}else if(r-=a,e.Xr){var h=e.th.serializer.sh(new It(o,T.min()),e.readTime);n.push(e.th.Nn(t,o,h));}else n.push(e.th.kn(t,o));}),i.forEach(function(r){n.push(e.th.jn.Dr(t,r));}),n.push(this.th.updateMetadata(t,r)),Pe.vn(n);},e.prototype.xn=function(t,e){var n=this;return this.th.Mr(t,e).next(function(t){return null===t?(n.eh.set(e,0),null):(n.eh.set(e,t.size),t.xr);});},e.prototype.Ln=function(t,e){var n=this;return this.th.Or(t,e).next(function(t){var e=t.Br;return t.qr.forEach(function(t,e){n.eh.set(t,e);}),e;});},e;}(Le);var nn=function(){function t(t){this.ih=t;}return t.prototype.next=function(){return this.ih+=2,this.ih;},t.nh=function(){return new t(0);},t.rh=function(){return new t(-1);},t;}(),rn=function(){function t(t,e){this.hh=t,this.serializer=e;}return t.prototype.oh=function(t){var e=this;return this.ah(t).next(function(n){var r=new nn(n.highestTargetId);return n.highestTargetId=r.next(),e.uh(t,n).next(function(){return n.highestTargetId;});});},t.prototype._h=function(t){return this.ah(t).next(function(t){return T.v(new I(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds));});},t.prototype.lh=function(t){return this.ah(t).next(function(t){return t.highestListenSequenceNumber;});},t.prototype.dh=function(t,e,n){var r=this;return this.ah(t).next(function(i){return i.highestListenSequenceNumber=e,n&&(i.lastRemoteSnapshotVersion=n.C()),e>i.highestListenSequenceNumber&&(i.highestListenSequenceNumber=e),r.uh(t,i);});},t.prototype.fh=function(t,e){var n=this;return this.Th(t,e).next(function(){return n.ah(t).next(function(r){return r.targetCount+=1,n.Eh(e,r),n.uh(t,r);});});},t.prototype.wh=function(t,e){return this.Th(t,e);},t.prototype.Ih=function(t,e){var n=this;return this.Rh(t,e.targetId).next(function(){return on(t).delete(e.targetId);}).next(function(){return n.ah(t);}).next(function(e){return Ie(e.targetCount>0),e.targetCount-=1,n.uh(t,e);});},t.prototype.Ah=function(t,e,n){var r=this,i=0,o=[];return on(t).Ur(function(s,a){var u=r.serializer.mh(a);u.sequenceNumber<=e&&null===n.get(u.targetId)&&(i++,o.push(r.Ih(t,u)));}).next(function(){return Pe.vn(o);}).next(function(){return i;});},t.prototype.js=function(t,e){var n=this;return on(t).Ur(function(t,r){var i=n.serializer.mh(r);e(i);});},t.prototype.ah=function(t){return sn(t).get(Ln.key).next(function(t){return Ie(null!==t),t;});},t.prototype.uh=function(t,e){return sn(t).put(Ln.key,e);},t.prototype.Th=function(t,e){return on(t).put(this.serializer.Ph(e));},t.prototype.Eh=function(t,e){var n=!1;return t.targetId>e.highestTargetId&&(e.highestTargetId=t.targetId,n=!0),t.sequenceNumber>e.highestListenSequenceNumber&&(e.highestListenSequenceNumber=t.sequenceNumber,n=!0),n;},t.prototype.Vh=function(t){return this.ah(t).next(function(t){return t.targetCount;});},t.prototype.gh=function(t,e){var n=this,r=e.canonicalId(),i=IDBKeyRange.bound([r,Number.NEGATIVE_INFINITY],[r,Number.POSITIVE_INFINITY]),o=null;return on(t).Ur({range:i,index:Cn.queryTargetsIndexName},function(t,r,i){var s=n.serializer.mh(r);e.isEqual(s.target)&&(o=s,i.done());}).next(function(){return o;});},t.prototype.ph=function(t,e,n){var r=this,i=[],o=an(t);return e.forEach(function(e){var s=ze(e.path);i.push(o.put(new Pn(n,s))),i.push(r.hh.yh(t,n,e));}),Pe.vn(i);},t.prototype.bh=function(t,e,n){var r=this,i=an(t);return Pe.forEach(e,function(e){var o=ze(e.path);return Pe.vn([i.delete([n,o]),r.hh.vh(t,n,e)]);});},t.prototype.Rh=function(t,e){var n=an(t),r=IDBKeyRange.bound([e],[e+1],!1,!0);return n.delete(r);},t.prototype.Sh=function(t,e){var n=IDBKeyRange.bound([e],[e+1],!1,!0),r=an(t),i=Jt();return r.Ur({range:n,Dh:!0},function(t,e,n){var r=He(t[1]),o=new x(r);i=i.add(o);}).next(function(){return i;});},t.prototype.Ch=function(t,e){var n=ze(e.path),r=IDBKeyRange.bound([n],[Se(n)],!1,!0),i=0;return an(t).Ur({index:Pn.documentTargetsIndex,Dh:!0,range:r},function(t,e,n){var r=t[0];t[1],0!==r&&(i++,n.done());}).next(function(){return i>0;});},t.prototype.si=function(t,e){var n=this;return on(t).get(e).next(function(t){return t?n.serializer.mh(t):null;});},t;}();/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function on(t){return ln.Nr(t,Cn.store);}function sn(t){return ln.Nr(t,Ln.store);}function an(t){return ln.Nr(t,Pn.store);}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var un=function(){function t(t){this.Fh=t;}return t.prototype.jr=function(t){if(t.document)return this.Fh.mi(t.document,!!t.hasCommittedMutations);if(t.noDocument){var e=x.st(t.noDocument.path),n=this.Nh(t.noDocument.readTime);return new It(e,n,{hasCommittedMutations:!!t.hasCommittedMutations});}if(t.unknownDocument){var r=x.st(t.unknownDocument.path),i=this.Nh(t.unknownDocument.version);return new Tt(r,i);}return Ee();},t.prototype.sh=function(t,e){var n=this.Wr(e),r=t.key.path.M().W();if(t instanceof Et){var i=this.Fh.Ai(t),o=t.hasCommittedMutations;return new Dn(null,null,i,o,n,r);}if(t instanceof It){var s=t.key.path.W(),a=this.$h(t.version),u=t.hasCommittedMutations;return new Dn(null,new xn(s,a),null,u,n,r);}if(t instanceof Tt){var c=t.key.path.W(),h=this.$h(t.version);return new Dn(new On(c,h),null,null,!0,n,r);}return Ee();},t.prototype.Wr=function(t){var e=t.C();return [e.seconds,e.nanoseconds];},t.prototype.zr=function(t){var e=new I(t[0],t[1]);return T.v(e);},t.prototype.$h=function(t){var e=t.C();return new Tn(e.seconds,e.nanoseconds);},t.prototype.Nh=function(t){var e=new I(t.seconds,t.nanoseconds);return T.v(e);},t.prototype.kh=function(t,e){var n=this,r=e.baseMutations.map(function(t){return n.Fh.vi(t);}),i=e.mutations.map(function(t){return n.Fh.vi(t);});return new Nn(t,e.batchId,e.Tn.toMillis(),r,i);},t.prototype.Mh=function(t){var e=this,n=(t.baseMutations||[]).map(function(t){return e.Fh.Fi(t);}),r=t.mutations.map(function(t){return e.Fh.Fi(t);}),i=I.fromMillis(t.localWriteTimeMs);return new Re(t.batchId,i,n,r);},t.prototype.mh=function(t){var e,n=this.Nh(t.readTime),r=void 0!==t.lastLimboFreeSnapshotVersion?this.Nh(t.lastLimboFreeSnapshotVersion):T.min();return e=void 0!==t.query.documents?this.Fh.Oi(t.query):this.Fh.Wi(t.query),new Lt(e,t.targetId,0,t.lastListenSequenceNumber,n,r,C.fromBase64String(t.resumeToken));},t.prototype.Ph=function(t){var e,n=this.$h(t.Ee),r=this.$h(t.lastLimboFreeSnapshotVersion);e=t.target.Lt()?this.Fh.Li(t.target):this.Fh.Bi(t.target);var i=t.resumeToken.toBase64();return new Cn(t.targetId,t.target.canonicalId(),n,i,t.sequenceNumber,r,e);},t;}(),cn="Failed to obtain exclusive access to the persistence layer. To allow shared access, make sure to invoke `enablePersistence()` with `synchronizeTabs:true` in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",hn=function(t){function e(e,n){var r=this;return (r=t.call(this)||this).xh=e,r.Lh=n,r;}return r.__extends(e,t),e;}(je),ln=function(){function t(e,n,r,i,o,s,a,u,c){if(this.allowTabSynchronization=e,this.persistenceKey=n,this.clientId=r,this.Tr=s,this.Oh=u,this.Bh=c,this.qh=null,this.Uh=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Qh=null,this.inForeground=!1,this.Wh=null,this.jh=null,this.Kh=Number.NEGATIVE_INFINITY,this.Gh=function(t){return Promise.resolve();},!t.zh())throw new v(d.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.hh=new dn(this,o),this.Hh=n+t.Yh,this.serializer=new un(a),this.document=i.document,this.Jh=new rn(this.hh,this.serializer),this.jn=new Xe(),this.Qn=new Je(this.serializer,this.jn),this.window=i.window,i.window&&i.window.localStorage?this.Xh=i.window.localStorage:(this.Xh=null,!1===c&&we("IndexedDbPersistence","LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."));}return t.Nr=function(t,e){if(t instanceof hn)return Fn.Nr(t.xh,e);throw Ee();},t.prototype.start=function(){var t=this;return Fn.Zh(this.Hh,En,new In(this.serializer)).then(function(e){return t.to=e,t.eo(t.Bh);}).then(function(){if(!t.isPrimary&&!t.allowTabSynchronization)throw new v(d.FAILED_PRECONDITION,cn);return t.so(),t.io(),t.no(),t.runTransaction("getHighestListenSequenceNumber","readonly",function(e){return t.Jh.lh(e);});}).then(function(e){t.qh=new Fe(e,t.Oh);}).then(function(){t.Uh=!0;}).catch(function(e){return t.to&&t.to.close(),Promise.reject(e);});},t.prototype.ro=function(t){var e=this;return this.Gh=function(n){return r.__awaiter(e,void 0,void 0,function(){return r.__generator(this,function(e){return this.ho?[2,t(n)]:[2];});});},t(this.isPrimary);},t.prototype.oo=function(t){var e=this;this.to.ao(function(n){return r.__awaiter(e,void 0,void 0,function(){return r.__generator(this,function(e){switch(e.label){case 0:return null===n.newVersion?[4,t()]:[3,2];case 1:e.sent(),e.label=2;case 2:return [2];}});});});},t.prototype.uo=function(t){var e=this;this.networkEnabled!==t&&(this.networkEnabled=t,this.Tr.co(function(){return r.__awaiter(e,void 0,void 0,function(){return r.__generator(this,function(t){switch(t.label){case 0:return this.ho?[4,this.eo()]:[3,2];case 1:t.sent(),t.label=2;case 2:return [2];}});});}));},t.prototype.eo=function(t){var e=this;return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",function(t){return pn(t).put(new Vn(e.clientId,Date.now(),e.networkEnabled,e.inForeground)).next(function(){if(e.isPrimary)return e._o(t).next(function(t){t||(e.isPrimary=!1,e.Tr.lo(function(){return e.Gh(!1);}));});}).next(function(){return e.do(t);}).next(function(n){return e.isPrimary&&!n?e.fo(t).next(function(){return !1;}):!!n&&e.To(t).next(function(){return !0;});});}).catch(function(t){if(!e.allowTabSynchronization){if(zn(t))return be("IndexedDbPersistence","Failed to extend owner lease: ",t),e.isPrimary;throw t;}return be("IndexedDbPersistence","Releasing owner lease after error during lease refresh",t),!1;}).then(function(t){e.isPrimary!==t&&e.Tr.lo(function(){return e.Gh(t);}),e.isPrimary=t;});},t.prototype._o=function(t){var e=this;return fn(t).get(An.key).next(function(t){return Pe.resolve(e.Eo(t));});},t.prototype.wo=function(t){return pn(t).delete(this.clientId);},t.prototype.Io=function(){return r.__awaiter(this,void 0,void 0,function(){var e,n,i,o,s=this;return r.__generator(this,function(r){switch(r.label){case 0:return !this.isPrimary||this.Ro(this.Kh,18e5)?[3,2]:(this.Kh=Date.now(),[4,this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",function(e){var n=t.Nr(e,Vn.store);return n.Fr().next(function(t){var e=s.Ao(t,18e5),r=t.filter(function(t){return -1===e.indexOf(t);});return Pe.forEach(r,function(t){return n.delete(t.clientId);}).next(function(){return r;});});}).catch(function(){return [];})]);case 1:if(e=r.sent(),this.Xh)for(n=0,i=e;n<i.length;n++)o=i[n],this.Xh.removeItem(this.mo(o.clientId));r.label=2;case 2:return [2];}});});},t.prototype.no=function(){var t=this;this.jh=this.Tr.yr("client_metadata_refresh",4e3,function(){return t.eo().then(function(){return t.Io();}).then(function(){return t.no();});});},t.prototype.Eo=function(t){return !!t&&t.ownerId===this.clientId;},t.prototype.do=function(t){var e=this;return this.Bh?Pe.resolve(!0):fn(t).get(An.key).next(function(n){if(null!==n&&e.Ro(n.leaseTimestampMs,5e3)&&!e.Po(n.ownerId)){if(e.Eo(n)&&e.networkEnabled)return !0;if(!e.Eo(n)){if(!n.allowTabSynchronization)throw new v(d.FAILED_PRECONDITION,cn);return !1;}}return !(!e.networkEnabled||!e.inForeground)||pn(t).Fr().next(function(t){return void 0===e.Ao(t,5e3).find(function(t){if(e.clientId!==t.clientId){var n=!e.networkEnabled&&t.networkEnabled,r=!e.inForeground&&t.inForeground,i=e.networkEnabled===t.networkEnabled;if(n||r&&i)return !0;}return !1;});});}).next(function(t){return e.isPrimary!==t&&be("IndexedDbPersistence","Client "+(t?"is":"is not")+" eligible for a primary lease."),t;});},t.prototype.Vo=function(){return r.__awaiter(this,void 0,void 0,function(){var t=this;return r.__generator(this,function(e){switch(e.label){case 0:return this.Uh=!1,this.po(),this.jh&&(this.jh.cancel(),this.jh=null),this.yo(),this.bo(),[4,this.runTransaction("shutdown","readwrite",function(e){return t.fo(e).next(function(){return t.wo(e);});}).catch(function(t){be("IndexedDbPersistence","Proceeding with shutdown despite failure: ",t);})];case 1:return e.sent(),this.to.close(),this.vo(),[2];}});});},t.prototype.Ao=function(t,e){var n=this;return t.filter(function(t){return n.Ro(t.updateTimeMs,e)&&!n.Po(t.clientId);});},t.prototype.So=function(){var t=this;return this.runTransaction("getActiveClients","readonly",function(e){return pn(e).Fr().next(function(e){return t.Ao(e,18e5).map(function(t){return t.clientId;});});});},t.clearPersistence=function(e){return r.__awaiter(this,void 0,void 0,function(){var n;return r.__generator(this,function(r){switch(r.label){case 0:return t.zh()?(n=e+t.Yh,[4,Fn.delete(n)]):[2,Promise.resolve()];case 1:return r.sent(),[2];}});});},Object.defineProperty(t.prototype,"ho",{get:function(){return this.Uh;},enumerable:!0,configurable:!0}),t.prototype.Do=function(t){return yn.Co(t,this.serializer,this.jn,this.hh);},t.prototype.Fo=function(){return this.Jh;},t.prototype.No=function(){return this.Qn;},t.prototype.$o=function(){return this.jn;},t.prototype.runTransaction=function(t,e,n){var r=this;be("IndexedDbPersistence","Starting transaction:",t);var i,o="readonly"===e?"readonly":"readwrite";return this.to.runTransaction(o,Un,function(o){return i=new hn(o,r.qh?r.qh.next():Fe.dr),"readwrite-primary"===e?r._o(i).next(function(t){return !!t||r.do(i);}).next(function(e){if(!e)throw we("Failed to obtain primary lease for action '"+t+"'."),r.isPrimary=!1,r.Tr.lo(function(){return r.Gh(!1);}),new v(d.FAILED_PRECONDITION,Me);return n(i);}).next(function(t){return r.To(i).next(function(){return t;});}):r.ko(i).next(function(){return n(i);});}).then(function(t){return i.Un(),t;});},t.prototype.ko=function(t){var e=this;return fn(t).get(An.key).next(function(t){if(null!==t&&e.Ro(t.leaseTimestampMs,5e3)&&!e.Po(t.ownerId)&&!e.Eo(t)&&!(e.Bh||e.allowTabSynchronization&&t.allowTabSynchronization))throw new v(d.FAILED_PRECONDITION,cn);});},t.prototype.To=function(t){var e=new An(this.clientId,this.allowTabSynchronization,Date.now());return fn(t).put(An.key,e);},t.zh=function(){return Fn.zh();},t.Mo=function(t){var e=t.ii.projectId;return t.ii.ln||(e+="."+t.ii.database),"firestore/"+t.persistenceKey+"/"+e+"/";},t.prototype.fo=function(t){var e=this,n=fn(t);return n.get(An.key).next(function(t){return e.Eo(t)?(be("IndexedDbPersistence","Releasing primary lease."),n.delete(An.key)):Pe.resolve();});},t.prototype.Ro=function(t,e){var n=Date.now();return !(t<n-e||t>n&&(we("Detected an update time that is in the future: "+t+" > "+n),1));},t.prototype.so=function(){var t=this;null!==this.document&&"function"==typeof this.document.addEventListener&&(this.Wh=function(){t.Tr.co(function(){return t.inForeground="visible"===t.document.visibilityState,t.eo();});},this.document.addEventListener("visibilitychange",this.Wh),this.inForeground="visible"===this.document.visibilityState);},t.prototype.yo=function(){this.Wh&&(this.document.removeEventListener("visibilitychange",this.Wh),this.Wh=null);},t.prototype.io=function(){var t,e=this;"function"==typeof(null===(t=this.window)||void 0===t?void 0:t.addEventListener)&&(this.Qh=function(){e.po(),e.Tr.co(function(){return e.Vo();});},this.window.addEventListener("unload",this.Qh));},t.prototype.bo=function(){this.Qh&&(this.window.removeEventListener("unload",this.Qh),this.Qh=null);},t.prototype.Po=function(t){var e;try{var n=null!==(null===(e=this.Xh)||void 0===e?void 0:e.getItem(this.mo(t)));return be("IndexedDbPersistence","Client '"+t+"' "+(n?"is":"is not")+" zombied in LocalStorage"),n;}catch(t){return we("IndexedDbPersistence","Failed to get zombied client id.",t),!1;}},t.prototype.po=function(){if(this.Xh)try{this.Xh.setItem(this.mo(this.clientId),String(Date.now()));}catch(t){we("Failed to set zombie client id.",t);}},t.prototype.vo=function(){if(this.Xh)try{this.Xh.removeItem(this.mo(this.clientId));}catch(t){}},t.prototype.mo=function(t){return "firestore_zombie_"+this.persistenceKey+"_"+t;},t;}();/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function fn(t){return ln.Nr(t,An.store);}function pn(t){return ln.Nr(t,Vn.store);}ln.Yh="main";var dn=function(){function t(t,e){this.db=t,this.xo=new rr(this,e);}return t.prototype.Lo=function(t){var e=this.Oo(t);return this.db.Fo().Vh(t).next(function(t){return e.next(function(e){return t+e;});});},t.prototype.Oo=function(t){var e=0;return this.Bo(t,function(t){e++;}).next(function(){return e;});},t.prototype.js=function(t,e){return this.db.Fo().js(t,e);},t.prototype.Bo=function(t,e){return this.qo(t,function(t,n){return e(n);});},t.prototype.yh=function(t,e,n){return vn(t,n);},t.prototype.vh=function(t,e,n){return vn(t,n);},t.prototype.Ah=function(t,e,n){return this.db.Fo().Ah(t,e,n);},t.prototype.Uo=function(t,e){return vn(t,e);},t.prototype.Qo=function(t,e){return function(t,e){var n=!1;return _n(t).Wo(function(r){return mn(t,r,e).next(function(t){return t&&(n=!0),Pe.resolve(!t);});}).next(function(){return n;});}(t,e);},t.prototype.jo=function(t,e){var n=this,r=this.db.No().Yr(),i=[],o=0;return this.qo(t,function(s,a){if(a<=e){var u=n.Qo(t,s).next(function(e){if(!e)return o++,r.Mn(t,s).next(function(){return r.kn(s),an(t).delete([0,ze(s.path)]);});});i.push(u);}}).next(function(){return Pe.vn(i);}).next(function(){return r.apply(t);}).next(function(){return o;});},t.prototype.removeTarget=function(t,e){var n=e.we(t.Lh);return this.db.Fo().wh(t,n);},t.prototype.Ko=function(t,e){return vn(t,e);},t.prototype.qo=function(t,e){var n,r=an(t),i=Fe.dr;return r.Ur({index:Pn.documentTargetsIndex},function(t,r){var o=t[0],s=(t[1],r.path),a=r.sequenceNumber;0===o?(i!==Fe.dr&&e(new x(He(n)),i),i=a,n=s):i=Fe.dr;}).next(function(){i!==Fe.dr&&e(new x(He(n)),i);});},t.prototype.Go=function(t){return this.db.No().Zr(t);},t;}();function vn(t,e){return an(t).put(function(t,e){return new Pn(0,ze(t.path),e);}(e,t.Lh));}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var yn=function(){function t(t,e,n,r){this.userId=t,this.serializer=e,this.jn=n,this.hh=r,this.zo={};}return t.Co=function(e,n,r,i){return Ie(""!==e.uid),new t(e.t()?e.uid:"",n,r,i);},t.prototype.Ho=function(t){var e=!0,n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return bn(t).Ur({index:Nn.userMutationsIndex,range:n},function(t,n,r){e=!1,r.done();}).next(function(){return e;});},t.prototype.Yo=function(t,e,n,r){var i=this,o=wn(t),s=bn(t);return s.add({}).next(function(a){Ie("number"==typeof a);for(var u=new Re(a,e,n,r),c=i.serializer.kh(i.userId,u),h=[],l=new Bt(function(t,e){return ke(t.j(),e.j());}),f=0,p=r;f<p.length;f++){var d=p[f],v=Sn.key(i.userId,d.key.path,a);l=l.add(d.key.path.M()),h.push(s.put(c)),h.push(o.put(v,Sn.PLACEHOLDER));}return l.forEach(function(e){h.push(i.jn.Dr(t,e));}),t.qn(function(){i.zo[a]=u.keys();}),Pe.vn(h).next(function(){return u;});});},t.prototype.Jo=function(t,e){var n=this;return bn(t).get(e).next(function(t){return t?(Ie(t.userId===n.userId),n.serializer.Mh(t)):null;});},t.prototype.Xo=function(t,e){var n=this;return this.zo[e]?Pe.resolve(this.zo[e]):this.Jo(t,e).next(function(t){if(t){var r=t.keys();return n.zo[e]=r,r;}return null;});},t.prototype.Zo=function(t,e){var n=this,r=e+1,i=IDBKeyRange.lowerBound([this.userId,r]),o=null;return bn(t).Ur({index:Nn.userMutationsIndex,range:i},function(t,e,i){e.userId===n.userId&&(Ie(e.batchId>=r),o=n.serializer.Mh(e)),i.done();}).next(function(){return o;});},t.prototype.ta=function(t){var e=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]),n=-1;return bn(t).Ur({index:Nn.userMutationsIndex,range:e,reverse:!0},function(t,e,r){n=e.batchId,r.done();}).next(function(){return n;});},t.prototype.ea=function(t){var e=this,n=IDBKeyRange.bound([this.userId,-1],[this.userId,Number.POSITIVE_INFINITY]);return bn(t).Fr(Nn.userMutationsIndex,n).next(function(t){return t.map(function(t){return e.serializer.Mh(t);});});},t.prototype.Gn=function(t,e){var n=this,r=Sn.prefixForPath(this.userId,e.path),i=IDBKeyRange.lowerBound(r),o=[];return wn(t).Ur({range:i},function(r,i,s){var a=r[0],u=r[1],c=r[2],h=He(u);if(a===n.userId&&e.path.isEqual(h))return bn(t).get(c).next(function(t){if(!t)throw Ee();Ie(t.userId===n.userId),o.push(n.serializer.Mh(t));});s.done();}).next(function(){return o;});},t.prototype.Xn=function(t,e){var n=this,r=new Bt(ke),i=[];return e.forEach(function(e){var o=Sn.prefixForPath(n.userId,e.path),s=IDBKeyRange.lowerBound(o),a=wn(t).Ur({range:s},function(t,i,o){var s=t[0],a=t[1],u=t[2],c=He(a);s===n.userId&&e.path.isEqual(c)?r=r.add(u):o.done();});i.push(a);}),Pe.vn(i).next(function(){return n.sa(t,r);});},t.prototype.nr=function(t,e){var n=this,r=e.path,i=r.length+1,o=Sn.prefixForPath(this.userId,r),s=IDBKeyRange.lowerBound(o),a=new Bt(ke);return wn(t).Ur({range:s},function(t,e,o){var s=t[0],u=t[1],c=t[2],h=He(u);s===n.userId&&r.q(h)?h.length===i&&(a=a.add(c)):o.done();}).next(function(){return n.sa(t,a);});},t.prototype.sa=function(t,e){var n=this,r=[],i=[];return e.forEach(function(e){i.push(bn(t).get(e).next(function(t){if(null===t)throw Ee();Ie(t.userId===n.userId),r.push(n.serializer.Mh(t));}));}),Pe.vn(i).next(function(){return r;});},t.prototype.ia=function(t,e){var n=this;return gn(t.xh,this.userId,e).next(function(r){return t.qn(function(){n.na(e.batchId);}),Pe.forEach(r,function(e){return n.hh.Uo(t,e);});});},t.prototype.na=function(t){delete this.zo[t];},t.prototype.ra=function(t){var e=this;return this.Ho(t).next(function(n){if(!n)return Pe.resolve();var r=IDBKeyRange.lowerBound(Sn.prefixForUser(e.userId)),i=[];return wn(t).Ur({range:r},function(t,n,r){if(t[0]===e.userId){var o=He(t[1]);i.push(o);}else r.done();}).next(function(){Ie(0===i.length);});});},t.prototype.Ch=function(t,e){return mn(t,this.userId,e);},t.prototype.ha=function(t){var e=this;return _n(t).get(this.userId).next(function(t){return t||new kn(e.userId,-1,"");});},t;}();function mn(t,e,n){var r=Sn.prefixForPath(e,n.path),i=r[1],o=IDBKeyRange.lowerBound(r),s=!1;return wn(t).Ur({range:o,Dh:!0},function(t,n,r){var o=t[0],a=t[1];t[2],o===e&&a===i&&(s=!0),r.done();}).next(function(){return s;});}function gn(t,e,n){var r=t.store(Nn.store),i=t.store(Sn.store),o=[],s=IDBKeyRange.only(n.batchId),a=0,u=r.Ur({range:s},function(t,e,n){return a++,n.delete();});o.push(u.next(function(){Ie(1===a);}));for(var c=[],h=0,l=n.mutations;h<l.length;h++){var f=l[h],p=Sn.key(e,f.key.path,n.batchId);o.push(i.delete(p)),c.push(f.key);}return Pe.vn(o).next(function(){return c;});}function bn(t){return ln.Nr(t,Nn.store);}function wn(t){return ln.Nr(t,Sn.store);}function _n(t){return ln.Nr(t,kn.store);}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var En=10,In=function(){function t(t){this.serializer=t;}return t.prototype.createOrUpgrade=function(t,e,n,r){var i=this;Ie(n<r&&n>=0&&r<=En);var o=new Gn(e);n<1&&r>=1&&(function(t){t.createObjectStore(An.store);}(t),function(t){t.createObjectStore(kn.store,{keyPath:kn.keyPath}),t.createObjectStore(Nn.store,{keyPath:Nn.keyPath,autoIncrement:!0}).createIndex(Nn.userMutationsIndex,Nn.userMutationsKeyPath,{unique:!0}),t.createObjectStore(Sn.store);}(t),jn(t),function(t){t.createObjectStore(Dn.store);}(t));var s=Pe.resolve();return n<3&&r>=3&&(0!==n&&(function(t){t.deleteObjectStore(Pn.store),t.deleteObjectStore(Cn.store),t.deleteObjectStore(Ln.store);}(t),jn(t)),s=s.next(function(){return function(t){var e=t.store(Ln.store),n=new Ln(0,0,T.min().C(),0);return e.put(Ln.key,n);}(o);})),n<4&&r>=4&&(0!==n&&(s=s.next(function(){return function(t,e){return e.store(Nn.store).Fr().next(function(n){t.deleteObjectStore(Nn.store),t.createObjectStore(Nn.store,{keyPath:Nn.keyPath,autoIncrement:!0}).createIndex(Nn.userMutationsIndex,Nn.userMutationsKeyPath,{unique:!0});var r=e.store(Nn.store),i=n.map(function(t){return r.put(t);});return Pe.vn(i);});}(t,o);})),s=s.next(function(){!function(t){t.createObjectStore(Vn.store,{keyPath:Vn.keyPath});}(t);})),n<5&&r>=5&&(s=s.next(function(){return i.removeAcknowledgedMutations(o);})),n<6&&r>=6&&(s=s.next(function(){return function(t){t.createObjectStore(Rn.store);}(t),i.addDocumentGlobal(o);})),n<7&&r>=7&&(s=s.next(function(){return i.ensureSequenceNumbers(o);})),n<8&&r>=8&&(s=s.next(function(){return i.createCollectionParentIndex(t,o);})),n<9&&r>=9&&(s=s.next(function(){!function(t){t.objectStoreNames.contains("remoteDocumentChanges")&&t.deleteObjectStore("remoteDocumentChanges");}(t),function(t){var e=t.objectStore(Dn.store);e.createIndex(Dn.readTimeIndex,Dn.readTimeIndexPath,{unique:!1}),e.createIndex(Dn.collectionReadTimeIndex,Dn.collectionReadTimeIndexPath,{unique:!1});}(e);})),n<10&&r>=10&&(s=s.next(function(){return i.rewriteCanonicalIds(o);})),s;},t.prototype.addDocumentGlobal=function(t){var e=0;return t.store(Dn.store).Ur(function(t,n){e+=en(n);}).next(function(){var n=new Rn(e);return t.store(Rn.store).put(Rn.key,n);});},t.prototype.removeAcknowledgedMutations=function(t){var e=this,n=t.store(kn.store),r=t.store(Nn.store);return n.Fr().next(function(n){return Pe.forEach(n,function(n){var i=IDBKeyRange.bound([n.userId,-1],[n.userId,n.lastAcknowledgedBatchId]);return r.Fr(Nn.userMutationsIndex,i).next(function(r){return Pe.forEach(r,function(r){Ie(r.userId===n.userId);var i=e.serializer.Mh(r);return gn(t,n.userId,i).next(function(){});});});});});},t.prototype.ensureSequenceNumbers=function(t){var e=t.store(Pn.store),n=t.store(Dn.store);return t.store(Ln.store).get(Ln.key).next(function(t){var r=[];return n.Ur(function(n,i){var o=new k(n),s=function(t){return [0,ze(t)];}(o);r.push(e.get(s).next(function(n){return n?Pe.resolve():function(n){return e.put(new Pn(0,ze(n),t.highestListenSequenceNumber));}(o);}));}).next(function(){return Pe.vn(r);});});},t.prototype.createCollectionParentIndex=function(t,e){t.createObjectStore(Mn.store,{keyPath:Mn.keyPath});var n=e.store(Mn.store),r=new Ye(),i=function(t){if(r.add(t)){var e=t.O(),i=t.M();return n.put({collectionId:e,parent:ze(i)});}};return e.store(Dn.store).Ur({Dh:!0},function(t,e){var n=new k(t);return i(n.M());}).next(function(){return e.store(Sn.store).Ur({Dh:!0},function(t,e){t[0];var n=t[1],r=(t[2],He(n));return i(r.M());});});},t.prototype.rewriteCanonicalIds=function(t){var e=this,n=t.store(Cn.store);return n.Ur(function(t,r){var i=e.serializer.mh(r),o=e.serializer.Ph(i);return n.put(o);});},t;}(),Tn=function(t,e){this.seconds=t,this.nanoseconds=e;},An=function(t,e,n){this.ownerId=t,this.allowTabSynchronization=e,this.leaseTimestampMs=n;};An.store="owner",An.key="owner";var kn=function(t,e,n){this.userId=t,this.lastAcknowledgedBatchId=e,this.lastStreamToken=n;};kn.store="mutationQueues",kn.keyPath="userId";var Nn=function(t,e,n,r,i){this.userId=t,this.batchId=e,this.localWriteTimeMs=n,this.baseMutations=r,this.mutations=i;};Nn.store="mutations",Nn.keyPath="batchId",Nn.userMutationsIndex="userMutationsIndex",Nn.userMutationsKeyPath=["userId","batchId"];var Sn=function(){function t(){}return t.prefixForUser=function(t){return [t];},t.prefixForPath=function(t,e){return [t,ze(e)];},t.key=function(t,e,n){return [t,ze(e),n];},t;}();Sn.store="documentMutations",Sn.PLACEHOLDER=new Sn();var xn=function(t,e){this.path=t,this.readTime=e;},On=function(t,e){this.path=t,this.version=e;},Dn=function(t,e,n,r,i,o){this.unknownDocument=t,this.noDocument=e,this.document=n,this.hasCommittedMutations=r,this.readTime=i,this.parentPath=o;};Dn.store="remoteDocuments",Dn.readTimeIndex="readTimeIndex",Dn.readTimeIndexPath="readTime",Dn.collectionReadTimeIndex="collectionReadTimeIndex",Dn.collectionReadTimeIndexPath=["parentPath","readTime"];var Rn=function(t){this.byteSize=t;};Rn.store="remoteDocumentGlobal",Rn.key="remoteDocumentGlobalKey";var Cn=function(t,e,n,r,i,o,s){this.targetId=t,this.canonicalId=e,this.readTime=n,this.resumeToken=r,this.lastListenSequenceNumber=i,this.lastLimboFreeSnapshotVersion=o,this.query=s;};Cn.store="targets",Cn.keyPath="targetId",Cn.queryTargetsIndexName="queryTargetsIndex",Cn.queryTargetsKeyPath=["canonicalId","targetId"];var Pn=function(t,e,n){this.targetId=t,this.path=e,this.sequenceNumber=n;};Pn.store="targetDocuments",Pn.keyPath=["targetId","path"],Pn.documentTargetsIndex="documentTargetsIndex",Pn.documentTargetsKeyPath=["path","targetId"];var Ln=function(t,e,n,r){this.highestTargetId=t,this.highestListenSequenceNumber=e,this.lastRemoteSnapshotVersion=n,this.targetCount=r;};Ln.key="targetGlobalKey",Ln.store="targetGlobal";var Mn=function(t,e){this.collectionId=t,this.parent=e;};function jn(t){t.createObjectStore(Pn.store,{keyPath:Pn.keyPath}).createIndex(Pn.documentTargetsIndex,Pn.documentTargetsKeyPath,{unique:!0}),t.createObjectStore(Cn.store,{keyPath:Cn.keyPath}).createIndex(Cn.queryTargetsIndexName,Cn.queryTargetsKeyPath,{unique:!0}),t.createObjectStore(Ln.store);}Mn.store="collectionParents",Mn.keyPath=["collectionId","parent"];var Vn=function(t,e,n,r){this.clientId=t,this.updateTimeMs=e,this.networkEnabled=n,this.inForeground=r;};Vn.store="clientMetadata",Vn.keyPath="clientId";var Un=r.__spreadArrays(r.__spreadArrays(r.__spreadArrays([kn.store,Nn.store,Sn.store,Dn.store,Cn.store,An.store,Ln.store,Pn.store],[Vn.store]),[Rn.store]),[Mn.store]),Fn=function(){function t(e){this.db=e,12.2===t.oa(s.getUA())&&we("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");}return t.Zh=function(e,n,r){return be("SimpleDb","Opening database:",e),new Pe(function(i,o){var s=indexedDB.open(e,n);s.onsuccess=function(e){var n=e.target.result;i(new t(n));},s.onblocked=function(){o(new v(d.FAILED_PRECONDITION,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));},s.onerror=function(t){var e=t.target.error;"VersionError"===e.name?o(new v(d.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o(e);},s.onupgradeneeded=function(t){be("SimpleDb",'Database "'+e+'" requires upgrade from version:',t.oldVersion);var n=t.target.result;r.createOrUpgrade(n,s.transaction,t.oldVersion,En).next(function(){be("SimpleDb","Database upgrade to version "+En+" complete");});};}).yn();},t.delete=function(t){return be("SimpleDb","Removing database:",t),Hn(window.indexedDB.deleteDatabase(t)).yn();},t.zh=function(){if("undefined"==typeof indexedDB)return !1;if(t.aa())return !0;var e=s.getUA(),n=t.oa(e),r=0<n&&n<10,i=t.ua(e),o=0<i&&i<4.5;return !(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||r||o);},t.aa=function(){var t;return "undefined"!=typeof __PRIVATE_process&&"YES"===(null===(t=__PRIVATE_process.__PRIVATE_env)||void 0===t?void 0:t.ca);},t.Nr=function(t,e){return t.store(e);},t.oa=function(t){var e=t.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=e?e[1].split("_").slice(0,2).join("."):"-1";return Number(n);},t.ua=function(t){var e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n);},t.prototype.ao=function(t){this.db.onversionchange=function(e){return t(e);};},t.prototype.runTransaction=function(t,e,n){return r.__awaiter(this,void 0,void 0,function(){var i,o,s,a,u;return r.__generator(this,function(c){switch(c.label){case 0:i="readonly"===t,o=0,s=function(){var t,s,u,c,h;return r.__generator(this,function(r){switch(r.label){case 0:++o,t=Gn.open(a.db,i?"readonly":"readwrite",e),r.label=1;case 1:return r.trys.push([1,3,,4]),s=n(t).catch(function(e){return t.abort(e),Pe.reject(e);}).yn(),u={},s.catch(function(){}),[4,t._a];case 2:return [2,(u.value=(r.sent(),s),u)];case 3:return c=r.sent(),h="FirebaseError"!==c.name&&o<3,be("SimpleDb","Transaction failed with error: %s. Retrying: %s.",c.message,h),h?[3,4]:[2,{value:Promise.reject(c)}];case 4:return [2];}});},a=this,c.label=1;case 1:return [5,s()];case 2:if("object"==typeof(u=c.sent()))return [2,u.value];c.label=3;case 3:return [3,1];case 4:return [2];}});});},t.prototype.close=function(){this.db.close();},t;}(),qn=function(){function t(t){this.la=t,this.da=!1,this.fa=null;}return Object.defineProperty(t.prototype,"Pn",{get:function(){return this.da;},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"Ta",{get:function(){return this.fa;},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"cursor",{set:function(t){this.la=t;},enumerable:!0,configurable:!0}),t.prototype.done=function(){this.da=!0;},t.prototype.Qr=function(t){this.fa=t;},t.prototype.delete=function(){return Hn(this.la.delete());},t;}(),Bn=function(t){function e(e){var n=this;return (n=t.call(this,d.UNAVAILABLE,"IndexedDB transaction failed: "+e)||this).name="IndexedDbTransactionError",n;}return r.__extends(e,t),e;}(v);function zn(t){return "IndexedDbTransactionError"===t.name;}var Gn=function(){function t(t){var e=this;this.transaction=t,this.aborted=!1,this.Ea=new qe(),this.transaction.oncomplete=function(){e.Ea.resolve();},this.transaction.onabort=function(){t.error?e.Ea.reject(new Bn(t.error)):e.Ea.resolve();},this.transaction.onerror=function(t){var n=Yn(t.target.error);e.Ea.reject(new Bn(n));};}return t.open=function(e,n,r){return new t(e.transaction(r,n));},Object.defineProperty(t.prototype,"_a",{get:function(){return this.Ea.promise;},enumerable:!0,configurable:!0}),t.prototype.abort=function(t){t&&this.Ea.reject(t),this.aborted||(be("SimpleDb","Aborting transaction:",t?t.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort());},t.prototype.store=function(t){var e=this.transaction.objectStore(t);return new Wn(e);},t;}(),Wn=function(){function t(t){this.store=t;}return t.prototype.put=function(t,e){var n;return void 0!==e?(be("SimpleDb","PUT",this.store.name,t,e),n=this.store.put(e,t)):(be("SimpleDb","PUT",this.store.name,"<auto-key>",t),n=this.store.put(t)),Hn(n);},t.prototype.add=function(t){return be("SimpleDb","ADD",this.store.name,t,t),Hn(this.store.add(t));},t.prototype.get=function(t){var e=this;return Hn(this.store.get(t)).next(function(n){return void 0===n&&(n=null),be("SimpleDb","GET",e.store.name,t,n),n;});},t.prototype.delete=function(t){return be("SimpleDb","DELETE",this.store.name,t),Hn(this.store.delete(t));},t.prototype.count=function(){return be("SimpleDb","COUNT",this.store.name),Hn(this.store.count());},t.prototype.Fr=function(t,e){var n=this.cursor(this.options(t,e)),r=[];return this.wa(n,function(t,e){r.push(e);}).next(function(){return r;});},t.prototype.Ia=function(t,e){be("SimpleDb","DELETE ALL",this.store.name);var n=this.options(t,e);n.Dh=!1;var r=this.cursor(n);return this.wa(r,function(t,e,n){return n.delete();});},t.prototype.Ur=function(t,e){var n;e?n=t:(n={},e=t);var r=this.cursor(n);return this.wa(r,e);},t.prototype.Wo=function(t){var e=this.cursor({});return new Pe(function(n,r){e.onerror=function(t){var e=Yn(t.target.error);r(e);},e.onsuccess=function(e){var r=e.target.result;r?t(r.primaryKey,r.value).next(function(t){t?r.continue():n();}):n();};});},t.prototype.wa=function(t,e){var n=[];return new Pe(function(r,i){t.onerror=function(t){i(t.target.error);},t.onsuccess=function(t){var i=t.target.result;if(i){var o=new qn(i),s=e(i.primaryKey,i.value,o);if(s instanceof Pe){var a=s.catch(function(t){return o.done(),Pe.reject(t);});n.push(a);}o.Pn?r():null===o.Ta?i.continue():i.continue(o.Ta);}else r();};}).next(function(){return Pe.vn(n);});},t.prototype.options=function(t,e){var n=void 0;return void 0!==t&&("string"==typeof t?n=t:e=t),{index:n,range:e};},t.prototype.cursor=function(t){var e="next";if(t.reverse&&(e="prev"),t.index){var n=this.store.index(t.index);return t.Dh?n.openKeyCursor(t.range,e):n.openCursor(t.range,e);}return this.store.openCursor(t.range,e);},t;}();function Hn(t){return new Pe(function(e,n){t.onsuccess=function(t){var n=t.target.result;e(n);},t.onerror=function(t){var e=Yn(t.target.error);n(e);};});}var Kn=!1;function Yn(t){var e=Fn.oa(s.getUA());if(e>=12.2&&e<13){var n="An internal error was encountered in the Indexed Database server";if(t.message.indexOf(n)>=0){var r=new v("internal","IOS_INDEXEDDB_BUG1: IndexedDb has thrown '"+n+"'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");return Kn||(Kn=!0,setTimeout(function(){throw r;},0)),r;}}return t;}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var Xn=function(){function t(t,e,n,r,i){this.Ra=t,this.Er=e,this.Aa=n,this.op=r,this.ma=i,this.Pa=new qe(),this.then=this.Pa.promise.then.bind(this.Pa.promise),this.Pa.promise.catch(function(t){});}return t.Va=function(e,n,r,i,o){var s=new t(e,n,Date.now()+r,i,o);return s.start(r),s;},t.prototype.start=function(t){var e=this;this.ga=setTimeout(function(){return e.pa();},t);},t.prototype.vr=function(){return this.pa();},t.prototype.cancel=function(t){null!==this.ga&&(this.clearTimeout(),this.Pa.reject(new v(d.CANCELLED,"Operation cancelled"+(t?": "+t:""))));},t.prototype.pa=function(){var t=this;this.Ra.co(function(){return null!==t.ga?(t.clearTimeout(),t.op().then(function(e){return t.Pa.resolve(e);})):Promise.resolve();});},t.prototype.clearTimeout=function(){null!==this.ga&&(this.ma(this),clearTimeout(this.ga),this.ga=null);},t;}(),Qn=function(){function t(){var t=this;this.ya=Promise.resolve(),this.ba=Promise.resolve(),this.va=!1,this.Sa=[],this.Da=null,this.Ca=!1,this.Fa=[],this.Na=new Be(this,"async_queue_retry"),this.$a=function(){return t.Na.br();};var e=ye.nt().window;e&&"function"==typeof e.addEventListener&&e.addEventListener("visibilitychange",this.$a);}return Object.defineProperty(t.prototype,"ka",{get:function(){return this.va;},enumerable:!0,configurable:!0}),t.prototype.co=function(t){this.enqueue(t);},t.prototype.Ma=function(t){this.xa(),this.La(t);},t.prototype.Oa=function(t){return this.xa(),this.La(t);},t.prototype.Ba=function(t){return r.__awaiter(this,void 0,void 0,function(){var e;return r.__generator(this,function(n){switch(n.label){case 0:return this.xa(),this.va?[3,2]:(this.va=!0,(e=ye.nt().window)&&e.removeEventListener("visibilitychange",this.$a),[4,this.Oa(t)]);case 1:n.sent(),n.label=2;case 2:return [2];}});});},t.prototype.enqueue=function(t){return this.xa(),this.va?new Promise(function(t){}):this.La(t);},t.prototype.lo=function(t){var e=this;this.xa(),this.va||(this.ba=this.ba.then(function(){var n=new qe(),i=function(){return r.__awaiter(e,void 0,void 0,function(){var e;return r.__generator(this,function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),[4,t()];case 1:return r.sent(),n.resolve(),this.Na.reset(),[3,3];case 2:if(!zn(e=r.sent()))throw n.resolve(),e;return be("AsyncQueue","Operation failed with retryable error: "+e),this.Na.gr(i),[3,3];case 3:return [2];}});});};return e.co(i),n.promise;}));},t.prototype.La=function(t){var e=this,n=this.ya.then(function(){return e.Ca=!0,t().catch(function(t){throw e.Da=t,e.Ca=!1,we("INTERNAL UNHANDLED ERROR: ",function(t){var e=t.message||"";return t.stack&&(e=t.stack.includes(t.message)?t.stack:t.message+"\n"+t.stack),e;}(t)),t;}).then(function(t){return e.Ca=!1,t;});});return this.ya=n,n;},t.prototype.yr=function(t,e,n){var r=this;this.xa(),this.Fa.indexOf(t)>-1&&(e=0);var i=Xn.Va(this,t,e,n,function(t){return r.qa(t);});return this.Sa.push(i),i;},t.prototype.xa=function(){this.Da&&Ee();},t.prototype.Ua=function(){},t.prototype.Qa=function(){return r.__awaiter(this,void 0,void 0,function(){var t;return r.__generator(this,function(e){switch(e.label){case 0:return [4,t=this.ya];case 1:e.sent(),e.label=2;case 2:if(t!==this.ya)return [3,0];e.label=3;case 3:return [2];}});});},t.prototype.Wa=function(t){for(var e=0,n=this.Sa;e<n.length;e++)if(n[e].Er===t)return !0;return !1;},t.prototype.ja=function(t){var e=this;return this.Qa().then(function(){e.Sa.sort(function(t,e){return t.Aa-e.Aa;});for(var n=0,r=e.Sa;n<r.length;n++){var i=r[n];if(i.vr(),"all"!==t&&i.Er===t)break;}return e.Qa();});},t.prototype.Ka=function(t){this.Fa.push(t);},t.prototype.qa=function(t){var e=this.Sa.indexOf(t);this.Sa.splice(e,1);},t;}();function Jn(t,e){if(we("AsyncQueue",e+": "+t),zn(t))return new v(d.UNAVAILABLE,e+": "+t);throw t;}function $n(t,e){var n=t[0],r=t[1],i=e[0],o=e[1],s=ke(n,i);return 0===s?ke(r,o):s;}var Zn=function(){function t(t){this.Ga=t,this.buffer=new Bt($n),this.za=0;}return t.prototype.Ha=function(){return ++this.za;},t.prototype.Ya=function(t){var e=[t,this.Ha()];if(this.buffer.size<this.Ga)this.buffer=this.buffer.add(e);else {var n=this.buffer.last();$n(e,n)<0&&(this.buffer=this.buffer.delete(n).add(e));}},Object.defineProperty(t.prototype,"maxValue",{get:function(){return this.buffer.last()[0];},enumerable:!0,configurable:!0}),t;}(),tr={Ja:!1,Xa:0,Za:0,tu:0},er=function(){function t(t,e,n){this.eu=t,this.su=e,this.iu=n;}return t.nu=function(e){return new t(e,t.ru,t.hu);},t;}();er.ou=-1,er.au=1048576,er.uu=41943040,er.ru=10,er.hu=1e3,er.cu=new er(er.uu,er.ru,er.hu),er.DISABLED=new er(er.ou,0,0);var nr=function(){function t(t,e){this.xo=t,this.Ra=e,this._u=!1,this.lu=null;}return t.prototype.start=function(t){this.xo.du.eu!==er.ou&&this.fu(t);},t.prototype.stop=function(){this.lu&&(this.lu.cancel(),this.lu=null);},Object.defineProperty(t.prototype,"ho",{get:function(){return null!==this.lu;},enumerable:!0,configurable:!0}),t.prototype.fu=function(t){var e=this,n=this._u?3e5:6e4;be("LruGarbageCollector","Garbage collection scheduled in "+n+"ms"),this.lu=this.Ra.yr("lru_garbage_collection",n,function(){return r.__awaiter(e,void 0,void 0,function(){var e;return r.__generator(this,function(n){switch(n.label){case 0:this.lu=null,this._u=!0,n.label=1;case 1:return n.trys.push([1,3,,7]),[4,t.Tu(this.xo)];case 2:return n.sent(),[3,7];case 3:return zn(e=n.sent())?(be("LruGarbageCollector","Ignoring IndexedDB error during garbage collection: ",e),[3,6]):[3,4];case 4:return [4,sr(e)];case 5:n.sent(),n.label=6;case 6:return [3,7];case 7:return [4,this.fu(t)];case 8:return n.sent(),[2];}});});});},t;}(),rr=function(){function t(t,e){this.Eu=t,this.du=e;}return t.prototype.wu=function(t,e){return this.Eu.Lo(t).next(function(t){return Math.floor(e/100*t);});},t.prototype.Iu=function(t,e){var n=this;if(0===e)return Pe.resolve(Fe.dr);var r=new Zn(e);return this.Eu.js(t,function(t){return r.Ya(t.sequenceNumber);}).next(function(){return n.Eu.Bo(t,function(t){return r.Ya(t);});}).next(function(){return r.maxValue;});},t.prototype.Ah=function(t,e,n){return this.Eu.Ah(t,e,n);},t.prototype.jo=function(t,e){return this.Eu.jo(t,e);},t.prototype.Ru=function(t,e){var n=this;return this.du.eu===er.ou?(be("LruGarbageCollector","Garbage collection skipped; disabled"),Pe.resolve(tr)):this.Go(t).next(function(r){return r<n.du.eu?(be("LruGarbageCollector","Garbage collection skipped; Cache size "+r+" is lower than threshold "+n.du.eu),tr):n.Au(t,e);});},t.prototype.Go=function(t){return this.Eu.Go(t);},t.prototype.Au=function(t,e){var n,r,i,s,a,u,c,h=this,l=Date.now();return this.wu(t,this.du.su).next(function(e){return e>h.du.iu?(be("LruGarbageCollector","Capping sequence numbers to collect down to the maximum of "+h.du.iu+" from "+e),r=h.du.iu):r=e,s=Date.now(),h.Iu(t,r);}).next(function(r){return n=r,a=Date.now(),h.Ah(t,n,e);}).next(function(e){return i=e,u=Date.now(),h.jo(t,n);}).next(function(t){return c=Date.now(),ge()<=o.LogLevel.DEBUG&&be("LruGarbageCollector","LRU Garbage Collection\n\tCounted targets in "+(s-l)+"ms\n\tDetermined least recently used "+r+" in "+(a-s)+"ms\n\tRemoved "+i+" targets in "+(u-a)+"ms\n\tRemoved "+t+" documents in "+(c-u)+"ms\nTotal Duration: "+(c-l)+"ms"),Pe.resolve({Ja:!0,Xa:r,Za:i,tu:t});});},t;}(),ir=function(){function t(t,e,n){this.persistence=t,this.mu=e,this.Pu=new Ut(ke),this.Vu=new De(function(t){return t.canonicalId();}),this.gu=T.min(),this.Wn=t.Do(n),this.pu=t.No(),this.Jh=t.Fo(),this.yu=new Ve(this.pu,this.Wn,this.persistence.$o()),this.mu.bu(this.yu);}return t.prototype.start=function(){return Promise.resolve();},t.prototype.vu=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n,i,o=this;return r.__generator(this,function(r){switch(r.label){case 0:return e=this.Wn,n=this.yu,[4,this.persistence.runTransaction("Handle user change","readonly",function(r){var i;return o.Wn.ea(r).next(function(s){return i=s,e=o.persistence.Do(t),n=new Ve(o.pu,e,o.persistence.$o()),e.ea(r);}).next(function(t){for(var e=[],o=[],s=Jt(),a=0,u=i;a<u.length;a++){var c=u[a];e.push(c.batchId);for(var h=0,l=c.mutations;h<l.length;h++){var f=l[h];s=s.add(f.key);}}for(var p=0,d=t;p<d.length;p++){var v=d[p];o.push(v.batchId);for(var y=0,m=v.mutations;y<m.length;y++){var g=m[y];s=s.add(g.key);}}return n.Yn(r,s).next(function(t){return {Su:t,Du:e,Cu:o};});});})];case 1:return i=r.sent(),[2,(this.Wn=e,this.yu=n,this.mu.bu(this.yu),i)];}});});},t.prototype.Fu=function(t){var e,n=this,r=I.now(),i=t.reduce(function(t,e){return t.add(e.key);},Jt());return this.persistence.runTransaction("Locally write mutations","readwrite",function(o){return n.yu.Yn(o,i).next(function(i){e=i;for(var s=[],a=0,u=t;a<u.length;a++){var c=u[a],h=c.Pt(e.get(c.key));null!=h&&s.push(new ft(c.key,h,gt(h.proto.mapValue),ct.exists(!0)));}return n.Wn.Yo(o,r,s,t);});}).then(function(t){var n=t.wn(e);return {batchId:t.batchId,Dn:n};});},t.prototype.Nu=function(t){var e=this;return this.persistence.runTransaction("Acknowledge batch","readwrite-primary",function(n){var r=t.batch.keys(),i=e.pu.Yr({Xr:!0});return e.$u(n,t,i).next(function(){return i.apply(n);}).next(function(){return e.Wn.ra(n);}).next(function(){return e.yu.Yn(n,r);});});},t.prototype.ku=function(t){var e=this;return this.persistence.runTransaction("Reject batch","readwrite-primary",function(n){var r;return e.Wn.Jo(n,t).next(function(t){return Ie(null!==t),r=t.keys(),e.Wn.ia(n,t);}).next(function(){return e.Wn.ra(n);}).next(function(){return e.yu.Yn(n,r);});});},t.prototype.ta=function(){var t=this;return this.persistence.runTransaction("Get highest unacknowledged batch id","readonly",function(e){return t.Wn.ta(e);});},t.prototype._h=function(){var t=this;return this.persistence.runTransaction("Get last remote snapshot version","readonly",function(e){return t.Jh._h(e);});},t.prototype.Mu=function(e){var n=this,r=e.Ee,i=this.Pu;return this.persistence.runTransaction("Apply remote event","readwrite-primary",function(o){var s=n.pu.Yr({Xr:!0});i=n.Pu;var a=[];e.as.forEach(function(e,s){var u=i.get(s);if(u){a.push(n.Jh.bh(o,e.ws,s).next(function(){return n.Jh.ph(o,e.Ts,s);}));var c=e.resumeToken;if(c.rt()>0){var h=u.Ie(c,r).we(o.Lh);i=i.Ae(s,h),t.xu(u,h,e)&&a.push(n.Jh.wh(o,h));}}});var u=Wt(),c=Jt();if(e.cs.forEach(function(t,e){c=c.add(t);}),a.push(s.getEntries(o,c).next(function(t){e.cs.forEach(function(i,c){var h=t.get(i);c instanceof It&&c.version.isEqual(T.min())?(s.kn(i,r),u=u.Ae(i,c)):null==h||c.version.S(h.version)>0||0===c.version.S(h.version)&&h.hasPendingWrites?(s.Nn(c,r),u=u.Ae(i,c)):be("LocalStore","Ignoring outdated watch update for ",i,". Current version:",h.version," Watch version:",c.version),e._s.has(i)&&a.push(n.persistence.hh.Ko(o,i));});})),!r.isEqual(T.min())){var h=n.Jh._h(o).next(function(t){return n.Jh.dh(o,o.Lh,r);});a.push(h);}return Pe.vn(a).next(function(){return s.apply(o);}).next(function(){return n.yu.Jn(o,u);});}).then(function(t){return n.Pu=i,t;});},t.xu=function(t,e,n){return Ie(e.resumeToken.rt()>0),0===t.resumeToken.rt()||e.Ee.D()-t.Ee.D()>=this.Lu||n.Ts.size+n.Es.size+n.ws.size>0;},t.prototype.Ou=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n,i,o,s,a,u,c,h=this;return r.__generator(this,function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),[4,this.persistence.runTransaction("notifyLocalViewChanges","readwrite",function(e){return Pe.forEach(t,function(t){return Pe.forEach(t.hr,function(n){return h.persistence.hh.yh(e,t.targetId,n);}).next(function(){return Pe.forEach(t.or,function(n){return h.persistence.hh.vh(e,t.targetId,n);});});});})];case 1:return r.sent(),[3,3];case 2:if(!zn(e=r.sent()))throw e;return be("LocalStore","Failed to update sequence numbers: "+e),[3,3];case 3:for(n=0,i=t;n<i.length;n++)o=i[n],s=o.targetId,o.fromCache||(a=this.Pu.get(s),u=a.Ee,c=a.Re(u),this.Pu=this.Pu.Ae(s,c));return [2];}});});},t.prototype.Bu=function(t){var e=this;return this.persistence.runTransaction("Get next mutation batch","readonly",function(n){return void 0===t&&(t=-1),e.Wn.Zo(n,t);});},t.prototype.qu=function(t){var e=this;return this.persistence.runTransaction("read document","readonly",function(n){return e.yu.Kn(n,t);});},t.prototype.Uu=function(t){var e=this;return this.persistence.runTransaction("Allocate target","readwrite",function(n){var r;return e.Jh.gh(n,t).next(function(i){return i?(r=i,Pe.resolve(r)):e.Jh.oh(n).next(function(i){return r=new Lt(t,i,0,n.Lh),e.Jh.fh(n,r).next(function(){return r;});});});}).then(function(n){var r=e.Pu.get(n.targetId);return (null===r||n.Ee.S(r.Ee)>0)&&(e.Pu=e.Pu.Ae(n.targetId,n),e.Vu.set(t,n.targetId)),n;});},t.prototype.gh=function(t,e){var n=this.Vu.get(e);return void 0!==n?Pe.resolve(this.Pu.get(n)):this.Jh.gh(t,e);},t.prototype.Qu=function(t,e){var n=this,r=this.Pu.get(t),i=e?"readwrite":"readwrite-primary";return this.persistence.runTransaction("Release target",i,function(t){return e?Pe.resolve():n.persistence.hh.removeTarget(t,r);}).then(function(){n.Pu=n.Pu.remove(t),n.Vu.delete(r.target);});},t.prototype.Wu=function(t,e){var n=this,r=T.min(),i=Jt();return this.persistence.runTransaction("Execute query","readonly",function(o){return n.gh(o,t.ee()).next(function(t){if(t)return r=t.lastLimboFreeSnapshotVersion,n.Jh.Sh(o,t.targetId).next(function(t){i=t;});}).next(function(){return n.mu.Zn(o,t,e?r:T.min(),e?i:Jt());}).next(function(t){return {documents:t,ju:i};});});},t.prototype.$u=function(t,e,n){var r=this,i=e.batch,o=i.keys(),s=Pe.resolve();return o.forEach(function(r){s=s.next(function(){return n.Mn(t,r);}).next(function(t){var o=t,s=e.Rn.get(r);Ie(null!==s),(!o||o.version.S(s)<0)&&(o=i.at(r,o,e))&&n.Nn(o,e.In);});}),s.next(function(){return r.Wn.ia(t,i);});},t.prototype.Tu=function(t){var e=this;return this.persistence.runTransaction("Collect garbage","readwrite-primary",function(n){return t.Ru(n,e.Pu);});},t;}();ir.Lu=3e8;var or=function(t){function e(e,n,r){var i=this;return (i=t.call(this,e,n,r)||this).persistence=e,i.Wn=e.Do(r),i.pu=e.No(),i.Jh=e.Fo(),i;}return r.__extends(e,t),e.prototype.start=function(){return this.Ku();},e.prototype.Gu=function(t){var e=this;return this.persistence.runTransaction("Lookup mutation documents","readonly",function(n){return e.Wn.Xo(n,t).next(function(t){return t?e.yu.Yn(n,t):Pe.resolve(null);});});},e.prototype.zu=function(t){this.Wn.na(t);},e.prototype.uo=function(t){this.persistence.uo(t);},e.prototype.So=function(){return this.persistence.So();},e.prototype.Hu=function(t){var e=this,n=this.Pu.get(t);return n?Promise.resolve(n.target):this.persistence.runTransaction("Get target data","readonly",function(n){return e.Jh.si(n,t).next(function(t){return t?t.target:null;});});},e.prototype.Kr=function(){var t=this;return this.persistence.runTransaction("Get new document changes","readonly",function(e){return t.pu.Kr(e,t.gu);}).then(function(e){var n=e.Gr,r=e.readTime;return t.gu=r,n;});},e.prototype.Ku=function(){return r.__awaiter(this,void 0,void 0,function(){var t,e=this;return r.__generator(this,function(n){switch(n.label){case 0:return t=this,[4,this.persistence.runTransaction("Synchronize last document change read time","readonly",function(t){return e.pu.Hr(t);})];case 1:return t.gu=n.sent(),[2];}});});},e;}(ir);function sr(t){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(e){if(t.code!==d.FAILED_PRECONDITION||t.message!==Me)throw t;return be("LocalStore","Unexpectedly lost primary lease"),[2];});});}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var ar=function(){function t(){this.Yu=new Bt(ur.Ju),this.Xu=new Bt(ur.Zu);}return t.prototype.B=function(){return this.Yu.B();},t.prototype.yh=function(t,e){var n=new ur(t,e);this.Yu=this.Yu.add(n),this.Xu=this.Xu.add(n);},t.prototype.tc=function(t,e){var n=this;t.forEach(function(t){return n.yh(t,e);});},t.prototype.vh=function(t,e){this.ec(new ur(t,e));},t.prototype.sc=function(t,e){var n=this;t.forEach(function(t){return n.vh(t,e);});},t.prototype.ic=function(t){var e=this,n=x.EMPTY,r=new ur(n,t),i=new ur(n,t+1),o=[];return this.Xu.Ke([r,i],function(t){e.ec(t),o.push(t.key);}),o;},t.prototype.nc=function(){var t=this;this.Yu.forEach(function(e){return t.ec(e);});},t.prototype.ec=function(t){this.Yu=this.Yu.delete(t),this.Xu=this.Xu.delete(t);},t.prototype.rc=function(t){var e=x.EMPTY,n=new ur(e,t),r=new ur(e,t+1),i=Jt();return this.Xu.Ke([n,r],function(t){i=i.add(t.key);}),i;},t.prototype.Ch=function(t){var e=new ur(t,0),n=this.Yu.ze(e);return null!==n&&t.isEqual(n.key);},t;}(),ur=function(){function t(t,e){this.key=t,this.hc=e;}return t.Ju=function(t,e){return x.N(t.key,e.key)||ke(t.hc,e.hc);},t.Zu=function(t,e){return ke(t.hc,e.hc)||x.N(t.key,e.key);},t;}();/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function cr(t,e){if(0!==e.length)throw new v(d.INVALID_ARGUMENT,"Function "+t+"() does not support arguments, but was called with "+Sr(e.length,"argument")+".");}function hr(t,e,n){if(e.length!==n)throw new v(d.INVALID_ARGUMENT,"Function "+t+"() requires "+Sr(n,"argument")+", but was called with "+Sr(e.length,"argument")+".");}function lr(t,e,n){if(e.length<n)throw new v(d.INVALID_ARGUMENT,"Function "+t+"() requires at least "+Sr(n,"argument")+", but was called with "+Sr(e.length,"argument")+".");}function fr(t,e,n,r){if(e.length<n||e.length>r)throw new v(d.INVALID_ARGUMENT,"Function "+t+"() requires between "+n+" and "+r+" arguments, but was called with "+Sr(e.length,"argument")+".");}function pr(t,e,n,r){wr(t,e,Nr(n)+" argument",r);}function dr(t,e,n,r){void 0!==r&&pr(t,e,n,r);}function yr(t,e,n,r){wr(t,e,n+" option",r);}function mr(t,e,n,r){void 0!==r&&yr(t,e,n,r);}function gr(t,e,n,r,i){void 0!==r&&function(t,e,n,r,i){for(var o=[],s=0,a=i;s<a.length;s++){var u=a[s];if(u===r)return;o.push(Er(u));}var c=Er(r);throw new v(d.INVALID_ARGUMENT,"Invalid value "+c+" provided to function "+t+'() for option "'+n+'". Acceptable values: '+o.join(", "));}(t,0,n,r,i);}function br(t,e,n,r){if(!e.some(function(t){return t===r;}))throw new v(d.INVALID_ARGUMENT,"Invalid value "+Er(r)+" provided to function "+t+"() for its "+Nr(n)+" argument. Acceptable values: "+e.join(", "));return r;}function wr(t,e,n,r){if(!("object"===e?_r(r):"non-empty string"===e?"string"==typeof r&&""!==r:typeof r===e)){var i=Er(r);throw new v(d.INVALID_ARGUMENT,"Function "+t+"() requires its "+n+" to be of type "+e+", but it was: "+i);}}function _r(t){return "object"==typeof t&&null!==t&&(Object.getPrototypeOf(t)===Object.prototype||null===Object.getPrototypeOf(t));}function Er(t){if(void 0===t)return "undefined";if(null===t)return "null";if("string"==typeof t)return t.length>20&&(t=t.substring(0,20)+"..."),JSON.stringify(t);if("number"==typeof t||"boolean"==typeof t)return ""+t;if("object"==typeof t){if(t instanceof Array)return "an array";var e=function(t){if(t.constructor){var e=/function\s+([^\s(]+)\s*\(/.exec(t.constructor.toString());if(e&&e.length>1)return e[1];}return null;}(t);return e?"a custom "+e+" object":"an object";}return "function"==typeof t?"a function":Ee();}function Ir(t,e,n){if(void 0===n)throw new v(d.INVALID_ARGUMENT,"Function "+t+"() requires a valid "+Nr(e)+" argument, but it was undefined.");}function Tr(t,e,n){D(e,function(e,r){if(n.indexOf(e)<0)throw new v(d.INVALID_ARGUMENT,"Unknown option '"+e+"' passed to function "+t+"(). Available options: "+n.join(", "));});}function Ar(t,e,n,r){var i=Er(r);return new v(d.INVALID_ARGUMENT,"Function "+t+"() requires its "+Nr(n)+" argument to be a "+e+", but it was: "+i);}function kr(t,e,n){if(n<=0)throw new v(d.INVALID_ARGUMENT,"Function "+t+"() requires its "+Nr(e)+" argument to be a positive number, but it was: "+n+".");}function Nr(t){switch(t){case 1:return "first";case 2:return "second";case 3:return "third";default:return t+"th";}}function Sr(t,e){return t+" "+e+(1===t?"":"s");}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function xr(){if("undefined"==typeof Uint8Array)throw new v(d.UNIMPLEMENTED,"Uint8Arrays are not available in this environment.");}function Or(){if(!ye.nt().oc)throw new v(d.UNIMPLEMENTED,"Blobs are unavailable in Firestore in this environment.");}var Dr=function(){function t(t){Or(),this.ac=t;}return t.fromBase64String=function(e){hr("Blob.fromBase64String",arguments,1),pr("Blob.fromBase64String","string",1,e),Or();try{return new t(C.fromBase64String(e));}catch(e){throw new v(d.INVALID_ARGUMENT,"Failed to construct Blob from Base64 string: "+e);}},t.fromUint8Array=function(e){if(hr("Blob.fromUint8Array",arguments,1),xr(),!(e instanceof Uint8Array))throw Ar("Blob.fromUint8Array","Uint8Array",1,e);return new t(C.fromUint8Array(e));},t.prototype.toBase64=function(){return hr("Blob.toBase64",arguments,0),Or(),this.ac.toBase64();},t.prototype.toUint8Array=function(){return hr("Blob.toUint8Array",arguments,0),xr(),this.ac.toUint8Array();},t.prototype.toString=function(){return "Blob(base64: "+this.toBase64()+")";},t.prototype.isEqual=function(t){return this.ac.isEqual(t.ac);},t;}(),Rr=function(){function t(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];!function(t,e,n,r){if(!(e instanceof Array)||e.length<1)throw new v(d.INVALID_ARGUMENT,"Function FieldPath() requires its fieldNames argument to be an array with at least "+Sr(1,"element")+".");}(0,t);for(var n=0;n<t.length;++n)if(pr("FieldPath","string",n,t[n]),0===t[n].length)throw new v(d.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this.uc=new S(t);}return t.documentId=function(){return t.cc;},t.prototype.isEqual=function(e){if(!(e instanceof t))throw Ar("isEqual","FieldPath",1,e);return this.uc.isEqual(e.uc);},t;}();/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */Rr.cc=new Rr(S.J().j());var Cr=new RegExp("[~\\*/\\[\\]]"),Pr=function(){this._c=this;},Lr=function(t){function e(e){var n=this;return (n=t.call(this)||this).lc=e,n;}return r.__extends(e,t),e.prototype.dc=function(t){if(2!==t.fc)throw 1===t.fc?t.Tc(this.lc+"() can only appear at the top level of your update data"):t.Tc(this.lc+"() cannot be used with set() unless you pass {merge:true}");return t.Vt.push(t.path),null;},e.prototype.isEqual=function(t){return t instanceof e;},e;}(Pr),Mr=function(t){function e(e){var n=this;return (n=t.call(this)||this).lc=e,n;}return r.__extends(e,t),e.prototype.dc=function(t){return new at(t.path,et.instance);},e.prototype.isEqual=function(t){return t instanceof e;},e;}(Pr),jr=function(t){function e(e,n){var r=this;return (r=t.call(this)||this).lc=e,r.Ec=n,r;}return r.__extends(e,t),e.prototype.dc=function(t){var e=new Yr({fc:3,methodName:this.lc,wc:!0},t.ii,t.serializer,t.ignoreUndefinedProperties),n=this.Ec.map(function(t){return Qr(t,e);}),r=new nt(n);return new at(t.path,r);},e.prototype.isEqual=function(t){return this===t;},e;}(Pr),Vr=function(t){function e(e,n){var r=this;return (r=t.call(this)||this).lc=e,r.Ec=n,r;}return r.__extends(e,t),e.prototype.dc=function(t){var e=new Yr({fc:3,methodName:this.lc,wc:!0},t.ii,t.serializer,t.ignoreUndefinedProperties),n=this.Ec.map(function(t){return Qr(t,e);}),r=new rt(n);return new at(t.path,r);},e.prototype.isEqual=function(t){return this===t;},e;}(Pr),Ur=function(t){function e(e,n){var r=this;return (r=t.call(this)||this).lc=e,r.Ic=n,r;}return r.__extends(e,t),e.prototype.dc=function(t){var e=new Yr({fc:3,methodName:this.lc},t.ii,t.serializer,t.ignoreUndefinedProperties),n=Qr(this.Ic,e),r=new it(t.serializer,n);return new at(t.path,r);},e.prototype.isEqual=function(t){return this===t;},e;}(Pr),Fr=function(t){function e(){return null!==t&&t.apply(this,arguments)||this;}return r.__extends(e,t),e.delete=function(){return cr("FieldValue.delete",arguments),new qr(new Lr("FieldValue.delete"));},e.serverTimestamp=function(){return cr("FieldValue.serverTimestamp",arguments),new qr(new Mr("FieldValue.serverTimestamp"));},e.arrayUnion=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return lr("FieldValue.arrayUnion",arguments,1),new qr(new jr("FieldValue.arrayUnion",t));},e.arrayRemove=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return lr("FieldValue.arrayRemove",arguments,1),new qr(new Vr("FieldValue.arrayRemove",t));},e.increment=function(t){return pr("FieldValue.increment","number",1,t),hr("FieldValue.increment",arguments,1),new qr(new Ur("FieldValue.increment",t));},e;}(Pr),qr=function(t){function e(e){var n=this;return (n=t.call(this)||this)._c=e,n.lc=e.lc,n;}return r.__extends(e,t),e.prototype.dc=function(t){return this._c.dc(t);},e.prototype.isEqual=function(t){return t instanceof e&&this._c.isEqual(t._c);},e;}(Fr),Br=function(){function t(t,e){if(hr("GeoPoint",arguments,2),pr("GeoPoint","number",1,t),pr("GeoPoint","number",2,e),!isFinite(t)||t<-90||t>90)throw new v(d.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new v(d.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this.Rc=t,this.Ac=e;}return Object.defineProperty(t.prototype,"latitude",{get:function(){return this.Rc;},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"longitude",{get:function(){return this.Ac;},enumerable:!0,configurable:!0}),t.prototype.isEqual=function(t){return this.Rc===t.Rc&&this.Ac===t.Ac;},t.prototype.p=function(t){return ke(this.Rc,t.Rc)||ke(this.Ac,t.Ac);},t;}(),zr=/^__.*__$/,Gr=function(t,e,n){this.mc=t,this.Pc=e,this.Vc=n;},Wr=function(){function t(t,e,n){this.data=t,this.Vt=e,this.fieldTransforms=n;}return t.prototype.gc=function(t,e){var n=[];return null!==this.Vt?n.push(new ft(t,this.data,this.Vt,e)):n.push(new lt(t,this.data,e)),this.fieldTransforms.length>0&&n.push(new pt(t,this.fieldTransforms)),n;},t;}(),Hr=function(){function t(t,e,n){this.data=t,this.Vt=e,this.fieldTransforms=n;}return t.prototype.gc=function(t,e){var n=[new ft(t,this.data,this.Vt,e)];return this.fieldTransforms.length>0&&n.push(new pt(t,this.fieldTransforms)),n;},t;}();/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function Kr(t){switch(t){case 0:case 2:case 1:return !0;case 3:case 4:return !1;default:throw Ee();}}var Yr=function(){function t(t,e,n,r,i,o){this.settings=t,this.ii=e,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===i&&this.pc(),this.fieldTransforms=i||[],this.Vt=o||[];}return Object.defineProperty(t.prototype,"path",{get:function(){return this.settings.path;},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"fc",{get:function(){return this.settings.fc;},enumerable:!0,configurable:!0}),t.prototype.yc=function(e){return new t(Object.assign(Object.assign({},this.settings),e),this.ii,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.Vt);},t.prototype.bc=function(t){var e,n=null===(e=this.path)||void 0===e?void 0:e.child(t),r=this.yc({path:n,wc:!1});return r.vc(t),r;},t.prototype.Sc=function(t){var e,n=null===(e=this.path)||void 0===e?void 0:e.child(t),r=this.yc({path:n,wc:!1});return r.pc(),r;},t.prototype.Dc=function(t){return this.yc({path:void 0,wc:!0});},t.prototype.Tc=function(t){var e=!this.path||this.path.B()?"":" (found in field "+this.path.toString()+")";return new v(d.INVALID_ARGUMENT,"Function "+this.settings.methodName+"() called with invalid data. "+t+e);},t.prototype.contains=function(t){return void 0!==this.Vt.find(function(e){return t.q(e);})||void 0!==this.fieldTransforms.find(function(e){return t.q(e.field);});},t.prototype.pc=function(){if(this.path)for(var t=0;t<this.path.length;t++)this.vc(this.path.get(t));},t.prototype.vc=function(t){if(0===t.length)throw this.Tc("Document fields must not be empty");if(Kr(this.fc)&&zr.test(t))throw this.Tc('Document fields cannot begin and end with "__"');},t;}(),Xr=function(){function t(t,e,n){this.ii=t,this.ignoreUndefinedProperties=e,this.serializer=n||ye.nt().Cc(t);}return t.prototype.Fc=function(t,e){var n=this.Nc(0,t);Zr("Data must be an object, but it was:",n,e);var r=Jr(e,n);return new Wr(new yt(r),null,n.fieldTransforms);},t.prototype.$c=function(t,e,n){var r=this.Nc(2,t);Zr("Data must be an object, but it was:",r,e);var i,o,s=Jr(e,r);if(n){for(var a=[],u=0,c=n;u<c.length;u++){var h=c[u],l=void 0;if(h instanceof Rr)l=h.uc;else {if("string"!=typeof h)throw Ee();l=ei(t,h);}if(!r.contains(l))throw new v(d.INVALID_ARGUMENT,"Field '"+l+"' is specified in your field mask but missing from your input data.");ni(a,l)||a.push(l);}i=new st(a),o=r.fieldTransforms.filter(function(t){return i.dt(t.field);});}else i=new st(r.Vt),o=r.fieldTransforms;return new Wr(new yt(s),i,o);},t.prototype.kc=function(t,e){var n=this.Nc(1,t);Zr("Data must be an object, but it was:",n,e);var r=[],i=new mt();D(e,function(e,o){var s=ei(t,e),a=n.Sc(s);if(o instanceof Pr&&o._c instanceof Lr)r.push(s);else {var u=Qr(o,a);null!=u&&(r.push(s),i.set(s,u));}});var o=new st(r);return new Hr(i.yt(),o,n.fieldTransforms);},t.prototype.Mc=function(t,e,n,r){var i=this.Nc(1,t),o=[ti(t,e)],s=[n];if(r.length%2!=0)throw new v(d.INVALID_ARGUMENT,"Function "+t+"() needs to be called with an even number of arguments that alternate between field names and values.");for(var a=0;a<r.length;a+=2)o.push(ti(t,r[a])),s.push(r[a+1]);for(var u=[],c=new mt(),h=o.length-1;h>=0;--h)if(!ni(u,o[h])){var l=o[h],f=s[h],p=i.Sc(l);if(f instanceof Pr&&f._c instanceof Lr)u.push(l);else {var y=Qr(f,p);null!=y&&(u.push(l),c.set(l,y));}}var m=new st(u);return new Hr(c.yt(),m,i.fieldTransforms);},t.prototype.Nc=function(t,e){return new Yr({fc:t,methodName:e,path:S.G,wc:!1},this.ii,this.serializer,this.ignoreUndefinedProperties);},t.prototype.xc=function(t,e,n){return void 0===n&&(n=!1),Qr(e,this.Nc(n?4:3,t));},t;}();function Qr(t,e){if($r(t))return Zr("Unsupported field value:",e,t),Jr(t,e);if(t instanceof Pr)return function(t,e){if(!Kr(e.fc))throw e.Tc(t.lc+"() can only be used with update() and set()");if(null===e.path)throw e.Tc(t.lc+"() is not currently supported inside arrays");var n=t.dc(e);n&&e.fieldTransforms.push(n);}(t,e),null;if(e.path&&e.Vt.push(e.path),t instanceof Array){if(e.settings.wc&&4!==e.fc)throw e.Tc("Nested arrays are not supported");return function(t,e){for(var n=[],r=0,i=0,o=t;i<o.length;i++){var s=Qr(o[i],e.Dc(r));null==s&&(s={nullValue:"NULL_VALUE"}),n.push(s),r++;}return {arrayValue:{values:n}};}(t,e);}return function(t,e){if(null===t)return {nullValue:"NULL_VALUE"};if("number"==typeof t)return e.serializer.ai(t);if("boolean"==typeof t)return {booleanValue:t};if("string"==typeof t)return {stringValue:t};if(t instanceof Date){var n=I.fromDate(t);return {timestampValue:e.serializer.C(n)};}if(t instanceof I){var r=new I(t.seconds,1e3*Math.floor(t.nanoseconds/1e3));return {timestampValue:e.serializer.C(r)};}if(t instanceof Br)return {geoPointValue:{latitude:t.latitude,longitude:t.longitude}};if(t instanceof Dr)return {bytesValue:e.serializer.ui(t)};if(t instanceof Gr){var i=e.ii,o=t.mc;if(!o.isEqual(i))throw e.Tc("Document reference is for database "+o.projectId+"/"+o.database+" but should be for database "+i.projectId+"/"+i.database);return {referenceValue:e.serializer._i(t.Pc.path,t.mc)};}if(void 0===t&&e.ignoreUndefinedProperties)return null;throw e.Tc("Unsupported field value: "+Er(t));}(t,e);}function Jr(t,e){var n={};return R(t)?e.path&&e.path.length>0&&e.Vt.push(e.path):D(t,function(t,r){var i=Qr(r,e.bc(t));null!=i&&(n[t]=i);}),{mapValue:{fields:n}};}function $r(t){return !("object"!=typeof t||null===t||t instanceof Array||t instanceof Date||t instanceof I||t instanceof Br||t instanceof Dr||t instanceof Gr||t instanceof Pr);}function Zr(t,e,n){if(!$r(n)||!_r(n)){var r=Er(n);throw "an object"===r?e.Tc(t+" a custom object"):e.Tc(t+" "+r);}}function ti(t,e){if(e instanceof Rr)return e.uc;if("string"==typeof e)return ei(t,e);throw new v(d.INVALID_ARGUMENT,"Function "+t+"() called with invalid data. Field path arguments must be of type string or FieldPath.");}function ei(t,e){try{return function(t){if(t.search(Cr)>=0)throw new v(d.INVALID_ARGUMENT,"Invalid field path ("+t+"). Paths must not contain '~', '*', '/', '[', or ']'");try{return new(Rr.bind.apply(Rr,r.__spreadArrays([void 0],t.split("."))))();}catch(e){throw new v(d.INVALID_ARGUMENT,"Invalid field path ("+t+"). Paths must not be empty, begin with '.', end with '.', or contain '..'");}}(e).uc;}catch(e){var n=(i=e)instanceof Error?i.message:i.toString();throw new v(d.INVALID_ARGUMENT,"Function "+t+"() called with invalid data. "+n);}var i;}function ni(t,e){return t.some(function(t){return t.isEqual(e);});}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var ri=function(){function t(t,e,n,r,i,o){this.Tr=t,this.Lc=n,this.Oc=r,this.Bc=i,this.listener=o,this.state=0,this.qc=0,this.Uc=null,this.stream=null,this.Na=new Be(t,e);}return t.prototype.Qc=function(){return 1===this.state||2===this.state||4===this.state;},t.prototype.Wc=function(){return 2===this.state;},t.prototype.start=function(){3!==this.state?this.auth():this.jc();},t.prototype.stop=function(){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(t){switch(t.label){case 0:return this.Qc()?[4,this.close(0)]:[3,2];case 1:t.sent(),t.label=2;case 2:return [2];}});});},t.prototype.Kc=function(){this.state=0,this.Na.reset();},t.prototype.Gc=function(){var t=this;this.Wc()&&null===this.Uc&&(this.Uc=this.Tr.yr(this.Lc,6e4,function(){return t.zc();}));},t.prototype.Hc=function(t){this.Yc(),this.stream.send(t);},t.prototype.zc=function(){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(t){return this.Wc()?[2,this.close(0)]:[2];});});},t.prototype.Yc=function(){this.Uc&&(this.Uc.cancel(),this.Uc=null);},t.prototype.close=function(t,e){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(n){switch(n.label){case 0:return this.Yc(),this.Na.cancel(),this.qc++,3!==t?this.Na.reset():e&&e.code===d.RESOURCE_EXHAUSTED?(we(e.toString()),we("Using maximum backoff delay to prevent overloading the backend."),this.Na.Vr()):e&&e.code===d.UNAUTHENTICATED&&this.Bc._(),null!==this.stream&&(this.Jc(),this.stream.close(),this.stream=null),this.state=t,[4,this.listener.Xc(e)];case 1:return n.sent(),[2];}});});},t.prototype.Jc=function(){},t.prototype.auth=function(){var t=this;this.state=1;var e=this.Zc(this.qc),n=this.qc;this.Bc.getToken().then(function(e){t.qc===n&&t.t_(e);},function(n){e(function(){var e=new v(d.UNKNOWN,"Fetching auth token failed: "+n.message);return t.e_(e);});});},t.prototype.t_=function(t){var e=this,n=this.Zc(this.qc);this.stream=this.s_(t),this.stream.i_(function(){n(function(){return e.state=2,e.listener.i_();});}),this.stream.Xc(function(t){n(function(){return e.e_(t);});}),this.stream.onMessage(function(t){n(function(){return e.onMessage(t);});});},t.prototype.jc=function(){var t=this;this.state=4,this.Na.gr(function(){return r.__awaiter(t,void 0,void 0,function(){return r.__generator(this,function(t){return this.state=0,this.start(),[2];});});});},t.prototype.e_=function(t){return be("PersistentStream","close with error: "+t),this.stream=null,this.close(3,t);},t.prototype.Zc=function(t){var e=this;return function(n){e.Tr.co(function(){return e.qc===t?n():(be("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve());});};},t;}(),ii=function(t){function e(e,n,r,i,o){var s=this;return (s=t.call(this,e,"listen_stream_connection_backoff","listen_stream_idle",n,r,o)||this).serializer=i,s;}return r.__extends(e,t),e.prototype.s_=function(t){return this.Oc.n_("Listen",t);},e.prototype.onMessage=function(t){this.Na.reset();var e=this.serializer.pi(t),n=this.serializer.bi(t);return this.listener.r_(e,n);},e.prototype.h_=function(t){var e={};e.database=this.serializer.Ii,e.addTarget=this.serializer.ee(t);var n=this.serializer.zi(t);n&&(e.labels=n),this.Hc(e);},e.prototype.o_=function(t){var e={};e.database=this.serializer.Ii,e.removeTarget=t,this.Hc(e);},e;}(ri),oi=function(t){function e(e,n,r,i,o){var s=this;return (s=t.call(this,e,"write_stream_connection_backoff","write_stream_idle",n,r,o)||this).serializer=i,s.a_=!1,s.lastStreamToken=C.ht,s;}return r.__extends(e,t),Object.defineProperty(e.prototype,"u_",{get:function(){return this.a_;},enumerable:!0,configurable:!0}),e.prototype.start=function(){this.a_=!1,this.lastStreamToken=C.ht,t.prototype.start.call(this);},e.prototype.Jc=function(){this.a_&&this.c_([]);},e.prototype.s_=function(t){return this.Oc.n_("Write",t);},e.prototype.onMessage=function(t){if(Ie(!!t.streamToken),this.lastStreamToken=this.serializer.ci(t.streamToken),this.a_){this.Na.reset();var e=this.serializer.xi(t.writeResults,t.commitTime),n=this.serializer.fromVersion(t.commitTime);return this.listener.__(n,e);}return Ie(!t.writeResults||0===t.writeResults.length),this.a_=!0,this.listener.l_();},e.prototype.d_=function(){var t={};t.database=this.serializer.Ii,this.Hc(t);},e.prototype.c_=function(t){var e=this,n={streamToken:this.serializer.ui(this.lastStreamToken),writes:t.map(function(t){return e.serializer.vi(t);})};this.Hc(n);},e;}(ri),si=function(t){function e(e,n,r){var i=this;return (i=t.call(this)||this).Oc=e,i.credentials=n,i.serializer=r,i;}return r.__extends(e,t),e.prototype.T_=function(t,e){var n=this;return this.credentials.getToken().then(function(r){return n.Oc.T_(t,e,r);}).catch(function(t){throw t.code===d.UNAUTHENTICATED&&n.credentials._(),t;});},e.prototype.E_=function(t,e){var n=this;return this.credentials.getToken().then(function(r){return n.Oc.E_(t,e,r);}).catch(function(t){throw t.code===d.UNAUTHENTICATED&&n.credentials._(),t;});},e;}(function(){this.f_=void 0;}),ai=function(){function t(t){this.w_=t,this.I_=new Map(),this.mutations=[],this.R_=!1,this.A_=null,this.m_=new Set();}return t.prototype.P_=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n=this;return r.__generator(this,function(i){switch(i.label){case 0:if(this.V_(),this.mutations.length>0)throw new v(d.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes.");return [4,function(t,e){return r.__awaiter(this,void 0,void 0,function(){var n,i,o,s,a;return r.__generator(this,function(r){switch(r.label){case 0:return n=Te(t),i={database:n.serializer.Ii,documents:e.map(function(t){return n.serializer.fi(t);})},[4,n.E_("BatchGetDocuments",i)];case 1:return o=r.sent(),s=new Map(),o.forEach(function(t){var e=n.serializer.gi(t);s.set(e.key.toString(),e);}),a=[],[2,(e.forEach(function(t){var e=s.get(t.toString());Ie(!!e),a.push(e);}),a)];}});});}(this.w_,t)];case 1:return [2,((e=i.sent()).forEach(function(t){t instanceof It||t instanceof Et?n.g_(t):Ee();}),e)];}});});},t.prototype.set=function(t,e){this.write(e.gc(t,this.Rt(t))),this.m_.add(t);},t.prototype.update=function(t,e){try{this.write(e.gc(t,this.p_(t)));}catch(t){this.A_=t;}this.m_.add(t);},t.prototype.delete=function(t){this.write([new dt(t,this.Rt(t))]),this.m_.add(t);},t.prototype.commit=function(){return r.__awaiter(this,void 0,void 0,function(){var t,e=this;return r.__generator(this,function(n){switch(n.label){case 0:if(this.V_(),this.A_)throw this.A_;return t=this.I_,this.mutations.forEach(function(e){t.delete(e.key.toString());}),t.forEach(function(t,n){var r=new x(k.K(n));e.mutations.push(new vt(r,e.Rt(r)));}),[4,function(t,e){return r.__awaiter(this,void 0,void 0,function(){var n,i,o;return r.__generator(this,function(r){switch(r.label){case 0:return n=Te(t),i={database:n.serializer.Ii,writes:e.map(function(t){return n.serializer.vi(t);})},[4,n.T_("Commit",i)];case 1:return o=r.sent(),[2,n.serializer.xi(o.writeResults,o.commitTime)];}});});}(this.w_,this.mutations)];case 1:return n.sent(),this.R_=!0,[2];}});});},t.prototype.g_=function(t){var e;if(t instanceof Et)e=t.version;else {if(!(t instanceof It))throw Ee();e=T.min();}var n=this.I_.get(t.key.toString());if(n){if(!e.isEqual(n))throw new v(d.ABORTED,"Document version changed between two reads.");}else this.I_.set(t.key.toString(),e);},t.prototype.Rt=function(t){var e=this.I_.get(t.toString());return !this.m_.has(t)&&e?ct.updateTime(e):ct.ft();},t.prototype.p_=function(t){var e=this.I_.get(t.toString());if(!this.m_.has(t)&&e){if(e.isEqual(T.min()))throw new v(d.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return ct.updateTime(e);}return ct.exists(!0);},t.prototype.write=function(t){this.V_(),this.mutations=this.mutations.concat(t);},t.prototype.V_=function(){},t;}(),ui=function(){function t(t,e){this.Ra=t,this.y_=e,this.state="Unknown",this.b_=0,this.v_=null,this.S_=!0;}return t.prototype.D_=function(){var t=this;0===this.b_&&(this.C_("Unknown"),this.v_=this.Ra.yr("online_state_timeout",1e4,function(){return t.v_=null,t.F_("Backend didn't respond within 10 seconds."),t.C_("Offline"),Promise.resolve();}));},t.prototype.N_=function(t){"Online"===this.state?this.C_("Unknown"):(this.b_++,this.b_>=1&&(this.k_(),this.F_("Connection failed 1 times. Most recent error: "+t.toString()),this.C_("Offline")));},t.prototype.set=function(t){this.k_(),this.b_=0,"Online"===t&&(this.S_=!1),this.C_(t);},t.prototype.C_=function(t){t!==this.state&&(this.state=t,this.y_(t));},t.prototype.F_=function(t){var e="Could not reach Cloud Firestore backend. "+t+"\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.";this.S_?(we(e),this.S_=!1):be("OnlineStateTracker",e);},t.prototype.k_=function(){null!==this.v_&&(this.v_.cancel(),this.v_=null);},t;}(),ci=function(){function t(t,e,n,i,o){var s=this;this.M_=t,this.w_=e,this.Ra=n,this.x_=[],this.L_=new Map(),this.O_=null,this.networkEnabled=!1,this.isPrimary=!1,this.B_=!1,this.q_=o,this.q_.U_(function(t){n.co(function(){return r.__awaiter(s,void 0,void 0,function(){return r.__generator(this,function(t){switch(t.label){case 0:return this.Q_()?(be("RemoteStore","Restarting streams for network reachability change."),[4,this.W_()]):[3,2];case 1:t.sent(),t.label=2;case 2:return [2];}});});});}),this.j_=new ui(n,i),this.K_=function(t,e,n){var r=Te(t);return new ii(e,r.Oc,r.credentials,r.serializer,n);}(this.w_,n,{i_:this.G_.bind(this),Xc:this.z_.bind(this),r_:this.H_.bind(this)}),this.Y_=function(t,e,n){var r=Te(t);return new oi(e,r.Oc,r.credentials,r.serializer,n);}(this.w_,n,{i_:this.J_.bind(this),Xc:this.X_.bind(this),l_:this.Z_.bind(this),__:this.__.bind(this)});}return t.prototype.start=function(){return this.enableNetwork();},t.prototype.enableNetwork=function(){return this.networkEnabled=!0,this.tl();},t.prototype.tl=function(){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(t){switch(t.label){case 0:return this.Q_()?(this.el()?this.sl():this.j_.set("Unknown"),[4,this.il()]):[3,2];case 1:t.sent(),t.label=2;case 2:return [2];}});});},t.prototype.disableNetwork=function(){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(t){switch(t.label){case 0:return this.networkEnabled=!1,[4,this.nl()];case 1:return t.sent(),this.j_.set("Offline"),[2];}});});},t.prototype.nl=function(){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(t){switch(t.label){case 0:return [4,this.Y_.stop()];case 1:return t.sent(),[4,this.K_.stop()];case 2:return t.sent(),this.x_.length>0&&(be("RemoteStore","Stopping write stream with "+this.x_.length+" pending writes"),this.x_=[]),this.rl(),[2];}});});},t.prototype.Vo=function(){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(t){switch(t.label){case 0:return be("RemoteStore","RemoteStore shutting down."),this.networkEnabled=!1,[4,this.nl()];case 1:return t.sent(),this.q_.Vo(),this.j_.set("Unknown"),[2];}});});},t.prototype.listen=function(t){this.L_.has(t.targetId)||(this.L_.set(t.targetId,t),this.el()?this.sl():this.K_.Wc()&&this.hl(t));},t.prototype.ol=function(t){this.L_.delete(t),this.K_.Wc()&&this.al(t),0===this.L_.size&&(this.K_.Wc()?this.K_.Gc():this.Q_()&&this.j_.set("Unknown"));},t.prototype.si=function(t){return this.L_.get(t)||null;},t.prototype.ei=function(t){return this.ul.ei(t);},t.prototype.hl=function(t){this.O_.Ns(t.targetId),this.K_.h_(t);},t.prototype.al=function(t){this.O_.Ns(t),this.K_.o_(t);},t.prototype.sl=function(){this.O_=new ce(this),this.K_.start(),this.j_.D_();},t.prototype.el=function(){return this.Q_()&&!this.K_.Qc()&&this.L_.size>0;},t.prototype.Q_=function(){return !this.B_&&this.isPrimary&&this.networkEnabled;},t.prototype.rl=function(){this.O_=null;},t.prototype.G_=function(){return r.__awaiter(this,void 0,void 0,function(){var t=this;return r.__generator(this,function(e){return this.L_.forEach(function(e,n){t.hl(e);}),[2];});});},t.prototype.z_=function(t){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(e){return this.rl(),this.el()?(this.j_.N_(t),this.sl()):this.j_.set("Unknown"),[2];});});},t.prototype.H_=function(t,e){return r.__awaiter(this,void 0,void 0,function(){var n,i,o;return r.__generator(this,function(r){switch(r.label){case 0:if(this.j_.set("Online"),!(t instanceof ae&&2===t.state&&t.cause))return [3,6];r.label=1;case 1:return r.trys.push([1,3,,5]),[4,this.cl(t)];case 2:return r.sent(),[3,5];case 3:return n=r.sent(),be("RemoteStore","Failed to remove targets %s: %s ",t.targetIds.join(","),n),[4,this._l(n)];case 4:return r.sent(),[3,5];case 5:return [3,13];case 6:if(t instanceof oe?this.O_.qs(t):t instanceof se?this.O_.Hs(t):this.O_.Ws(t),e.isEqual(T.min()))return [3,13];r.label=7;case 7:return r.trys.push([7,11,,13]),[4,this.M_._h()];case 8:return i=r.sent(),e.S(i)>=0?[4,this.ll(e)]:[3,10];case 9:r.sent(),r.label=10;case 10:return [3,13];case 11:return be("RemoteStore","Failed to raise snapshot:",o=r.sent()),[4,this._l(o)];case 12:return r.sent(),[3,13];case 13:return [2];}});});},t.prototype._l=function(t,e){return r.__awaiter(this,void 0,void 0,function(){var n=this;return r.__generator(this,function(i){switch(i.label){case 0:if(!zn(t))throw t;return this.B_=!0,[4,this.nl()];case 1:return i.sent(),this.j_.set("Offline"),e||(e=function(){return n.M_._h();}),this.Ra.lo(function(){return r.__awaiter(n,void 0,void 0,function(){return r.__generator(this,function(t){switch(t.label){case 0:return be("RemoteStore","Retrying IndexedDB access"),[4,e()];case 1:return t.sent(),this.B_=!1,[4,this.tl()];case 2:return t.sent(),[2];}});});}),[2];}});});},t.prototype.dl=function(t){var e=this;return t().catch(function(n){return e._l(n,t);});},t.prototype.ll=function(t){var e=this,n=this.O_.Xs(t);return n.as.forEach(function(n,r){if(n.resumeToken.rt()>0){var i=e.L_.get(r);i&&e.L_.set(r,i.Ie(n.resumeToken,t));}}),n.us.forEach(function(t){var n=e.L_.get(t);if(n){e.L_.set(t,n.Ie(C.ht,n.Ee)),e.al(t);var r=new Lt(n.target,t,1,n.sequenceNumber);e.hl(r);}}),this.ul.Mu(n);},t.prototype.cl=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n,i,o;return r.__generator(this,function(r){switch(r.label){case 0:e=t.cause,n=0,i=t.targetIds,r.label=1;case 1:return n<i.length?(o=i[n],this.L_.has(o)?[4,this.ul.fl(o,e)]:[3,3]):[3,5];case 2:r.sent(),this.L_.delete(o),this.O_.removeTarget(o),r.label=3;case 3:r.label=4;case 4:return n++,[3,1];case 5:return [2];}});});},t.prototype.il=function(){return r.__awaiter(this,void 0,void 0,function(){var t,e,n;return r.__generator(this,function(r){switch(r.label){case 0:t=this.x_.length>0?this.x_[this.x_.length-1].batchId:-1,r.label=1;case 1:if(!this.Tl())return [3,7];r.label=2;case 2:return r.trys.push([2,4,,6]),[4,this.M_.Bu(t)];case 3:return null===(e=r.sent())?(0===this.x_.length&&this.Y_.Gc(),[3,7]):(t=e.batchId,this.El(e),[3,6]);case 4:return n=r.sent(),[4,this._l(n)];case 5:return r.sent(),[3,6];case 6:return [3,1];case 7:return this.wl()&&this.Il(),[2];}});});},t.prototype.Tl=function(){return this.Q_()&&this.x_.length<10;},t.prototype.Rl=function(){return this.x_.length;},t.prototype.El=function(t){this.x_.push(t),this.Y_.Wc()&&this.Y_.u_&&this.Y_.c_(t.mutations);},t.prototype.wl=function(){return this.Q_()&&!this.Y_.Qc()&&this.x_.length>0;},t.prototype.Il=function(){this.Y_.start();},t.prototype.J_=function(){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(t){return this.Y_.d_(),[2];});});},t.prototype.Z_=function(){return r.__awaiter(this,void 0,void 0,function(){var t,e,n;return r.__generator(this,function(r){for(t=0,e=this.x_;t<e.length;t++)n=e[t],this.Y_.c_(n.mutations);return [2];});});},t.prototype.__=function(t,e){return r.__awaiter(this,void 0,void 0,function(){var n,i,o=this;return r.__generator(this,function(r){switch(r.label){case 0:return n=this.x_.shift(),i=Ce.from(n,t,e),[4,this.dl(function(){return o.ul.Al(i);})];case 1:return r.sent(),[4,this.il()];case 2:return r.sent(),[2];}});});},t.prototype.X_=function(t){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(e){switch(e.label){case 0:return t&&this.Y_.u_?[4,this.ml(t)]:[3,2];case 1:e.sent(),e.label=2;case 2:return this.wl()&&this.Il(),[2];}});});},t.prototype.ml=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n,i=this;return r.__generator(this,function(r){switch(r.label){case 0:return jt(n=t.code)&&n!==d.ABORTED?(e=this.x_.shift(),this.Y_.Kc(),[4,this.dl(function(){return i.ul.Pl(e.batchId,t);})]):[3,3];case 1:return r.sent(),[4,this.il()];case 2:r.sent(),r.label=3;case 3:return [2];}});});},t.prototype.Vl=function(){return new ai(this.w_);},t.prototype.W_=function(){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(t){switch(t.label){case 0:return this.networkEnabled=!1,[4,this.nl()];case 1:return t.sent(),this.j_.set("Unknown"),[4,this.enableNetwork()];case 2:return t.sent(),[2];}});});},t.prototype.gl=function(){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(t){switch(t.label){case 0:return this.Q_()?(be("RemoteStore","RemoteStore restarting streams for new credential"),[4,this.W_()]):[3,2];case 1:t.sent(),t.label=2;case 2:return [2];}});});},t.prototype.pl=function(t){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(e){switch(e.label){case 0:return this.isPrimary=t,t&&this.networkEnabled?[4,this.enableNetwork()]:[3,2];case 1:return e.sent(),[3,5];case 2:return t?[3,4]:[4,this.nl()];case 3:e.sent(),this.j_.set("Unknown"),e.label=4;case 4:e.label=5;case 5:return [2];}});});},t;}();/**
	 * @license
	 * Copyright 2019 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function hi(t,e){return "firestore_clients_"+t+"_"+e;}function li(t,e,n){var r="firestore_mutations_"+t+"_"+n;return e.t()&&(r+="_"+e.uid),r;}function fi(t,e){return "firestore_targets_"+t+"_"+e;}var pi=function(){function t(t,e,n,r){this.user=t,this.batchId=e,this.state=n,this.error=r;}return t.yl=function(e,n,r){var i=JSON.parse(r),o="object"==typeof i&&-1!==["pending","acknowledged","rejected"].indexOf(i.state)&&(void 0===i.error||"object"==typeof i.error),s=void 0;return o&&i.error&&(o="string"==typeof i.error.message&&"string"==typeof i.error.code)&&(s=new v(i.error.code,i.error.message)),o?new t(e,n,i.state,s):(we("SharedClientState","Failed to parse mutation state for ID '"+n+"': "+r),null);},t.prototype.bl=function(){var t={state:this.state,updateTimeMs:Date.now()};return this.error&&(t.error={code:this.error.code,message:this.error.message}),JSON.stringify(t);},t;}(),di=function(){function t(t,e,n){this.targetId=t,this.state=e,this.error=n;}return t.yl=function(e,n){var r=JSON.parse(n),i="object"==typeof r&&-1!==["not-current","current","rejected"].indexOf(r.state)&&(void 0===r.error||"object"==typeof r.error),o=void 0;return i&&r.error&&(i="string"==typeof r.error.message&&"string"==typeof r.error.code)&&(o=new v(r.error.code,r.error.message)),i?new t(e,r.state,o):(we("SharedClientState","Failed to parse target state for ID '"+e+"': "+n),null);},t.prototype.bl=function(){var t={state:this.state,updateTimeMs:Date.now()};return this.error&&(t.error={code:this.error.code,message:this.error.message}),JSON.stringify(t);},t;}(),vi=function(){function t(t,e){this.clientId=t,this.activeTargetIds=e;}return t.yl=function(e,n){for(var r=JSON.parse(n),i="object"==typeof r&&r.activeTargetIds instanceof Array,o=Zt(),s=0;i&&s<r.activeTargetIds.length;++s)i=M(r.activeTargetIds[s]),o=o.add(r.activeTargetIds[s]);return i?new t(e,o):(we("SharedClientState","Failed to parse client data for instance '"+e+"': "+n),null);},t;}(),yi=function(){function t(t,e){this.clientId=t,this.onlineState=e;}return t.yl=function(e){var n=JSON.parse(e);return "object"==typeof n&&-1!==["Unknown","Online","Offline"].indexOf(n.onlineState)&&"string"==typeof n.clientId?new t(n.clientId,n.onlineState):(we("SharedClientState","Failed to parse online state: "+e),null);},t;}(),mi=function(){function t(){this.activeTargetIds=Zt();}return t.prototype.vl=function(t){this.activeTargetIds=this.activeTargetIds.add(t);},t.prototype.Sl=function(t){this.activeTargetIds=this.activeTargetIds.delete(t);},t.prototype.bl=function(){var t={activeTargetIds:this.activeTargetIds.W(),updateTimeMs:Date.now()};return JSON.stringify(t);},t;}(),gi=function(){function t(e,n,r,i,o){if(this.Tr=e,this.platform=n,this.persistenceKey=r,this.Dl=i,this.ul=null,this.y_=null,this.ur=null,this.Cl=this.Fl.bind(this),this.Nl=new Ut(ke),this.ho=!1,this.$l=[],!t.zh(this.platform))throw new v(d.UNIMPLEMENTED,"LocalStorage is not available on this platform.");var s=r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.platform.window.localStorage,this.currentUser=o,this.kl=hi(this.persistenceKey,this.Dl),this.Ml=function(t){return "firestore_sequence_number_"+t;}(this.persistenceKey),this.Nl=this.Nl.Ae(this.Dl,new mi()),this.xl=new RegExp("^firestore_clients_"+s+"_([^_]*)$"),this.Ll=new RegExp("^firestore_mutations_"+s+"_(\\d+)(?:_(.*))?$"),this.Ol=new RegExp("^firestore_targets_"+s+"_(\\d+)$"),this.Bl=function(t){return "firestore_online_state_"+t;}(this.persistenceKey),this.platform.window.addEventListener("storage",this.Cl);}return t.zh=function(t){return !(!t.window||null==t.window.localStorage);},t.prototype.start=function(){return r.__awaiter(this,void 0,void 0,function(){var t,e,n,i,o,s,a,u,c,h,l,f=this;return r.__generator(this,function(r){switch(r.label){case 0:return [4,this.ul.So()];case 1:for(t=r.sent(),e=0,n=t;e<n.length;e++)(i=n[e])!==this.Dl&&(o=this.getItem(hi(this.persistenceKey,i)))&&(s=vi.yl(i,o))&&(this.Nl=this.Nl.Ae(s.clientId,s));for(this.ql(),(a=this.storage.getItem(this.Bl))&&(u=this.Ul(a))&&this.Ql(u),c=0,h=this.$l;c<h.length;c++)l=h[c],this.Fl(l);return this.$l=[],this.platform.window.addEventListener("unload",function(){return f.Vo();}),this.ho=!0,[2];}});});},t.prototype.lr=function(t){this.setItem(this.Ml,JSON.stringify(t));},t.prototype.Wl=function(){return this.jl(this.Nl);},t.prototype.Kl=function(t){var e=!1;return this.Nl.forEach(function(n,r){r.activeTargetIds.has(t)&&(e=!0);}),e;},t.prototype.Gl=function(t){this.zl(t,"pending");},t.prototype.Hl=function(t,e,n){this.zl(t,e,n),this.Yl(t);},t.prototype.Jl=function(t){var e="not-current";if(this.Kl(t)){var n=this.storage.getItem(fi(this.persistenceKey,t));if(n){var r=di.yl(t,n);r&&(e=r.state);}}return this.Xl.vl(t),this.ql(),e;},t.prototype.Zl=function(t){this.Xl.Sl(t),this.ql();},t.prototype.td=function(t){return this.Xl.activeTargetIds.has(t);},t.prototype.ed=function(t){this.removeItem(fi(this.persistenceKey,t));},t.prototype.sd=function(t,e,n){this.nd(t,e,n);},t.prototype.vu=function(t,e,n){var r=this;e.forEach(function(t){r.Yl(t);}),this.currentUser=t,n.forEach(function(t){r.Gl(t);});},t.prototype.rd=function(t){this.hd(t);},t.prototype.Vo=function(){this.ho&&(this.platform.window.removeEventListener("storage",this.Cl),this.removeItem(this.kl),this.ho=!1);},t.prototype.getItem=function(t){var e=this.storage.getItem(t);return be("SharedClientState","READ",t,e),e;},t.prototype.setItem=function(t,e){be("SharedClientState","SET",t,e),this.storage.setItem(t,e);},t.prototype.removeItem=function(t){be("SharedClientState","REMOVE",t),this.storage.removeItem(t);},t.prototype.Fl=function(t){var e=this;if(t.storageArea===this.storage){if(be("SharedClientState","EVENT",t.key,t.newValue),t.key===this.kl)return void we("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Tr.lo(function(){return r.__awaiter(e,void 0,void 0,function(){var e,n,i,o,s,a;return r.__generator(this,function(r){if(this.ho){if(null!==t.key)if(this.xl.test(t.key)){if(null==t.newValue)return e=this.od(t.key),[2,this.ad(e,null)];if(n=this.ud(t.key,t.newValue))return [2,this.ad(n.clientId,n)];}else if(this.Ll.test(t.key)){if(null!==t.newValue&&(i=this._d(t.key,t.newValue)))return [2,this.ld(i)];}else if(this.Ol.test(t.key)){if(null!==t.newValue&&(o=this.dd(t.key,t.newValue)))return [2,this.fd(o)];}else if(t.key===this.Bl){if(null!==t.newValue&&(s=this.Ul(t.newValue)))return [2,this.Ql(s)];}else t.key===this.Ml&&(a=function(t){var e=Fe.dr;if(null!=t)try{var n=JSON.parse(t);Ie("number"==typeof n),e=n;}catch(t){we("SharedClientState","Failed to read sequence number from WebStorage",t);}return e;}(t.newValue))!==Fe.dr&&this.ur(a);}else this.$l.push(t);return [2];});});});}},Object.defineProperty(t.prototype,"Xl",{get:function(){return this.Nl.get(this.Dl);},enumerable:!0,configurable:!0}),t.prototype.ql=function(){this.setItem(this.kl,this.Xl.bl());},t.prototype.zl=function(t,e,n){var r=new pi(this.currentUser,t,e,n),i=li(this.persistenceKey,this.currentUser,t);this.setItem(i,r.bl());},t.prototype.Yl=function(t){var e=li(this.persistenceKey,this.currentUser,t);this.removeItem(e);},t.prototype.hd=function(t){var e={clientId:this.Dl,onlineState:t};this.storage.setItem(this.Bl,JSON.stringify(e));},t.prototype.nd=function(t,e,n){var r=fi(this.persistenceKey,t),i=new di(t,e,n);this.setItem(r,i.bl());},t.prototype.od=function(t){var e=this.xl.exec(t);return e?e[1]:null;},t.prototype.ud=function(t,e){var n=this.od(t);return vi.yl(n,e);},t.prototype._d=function(t,e){var n=this.Ll.exec(t),r=Number(n[1]),i=void 0!==n[2]?n[2]:null;return pi.yl(new p(i),r,e);},t.prototype.dd=function(t,e){var n=this.Ol.exec(t),r=Number(n[1]);return di.yl(r,e);},t.prototype.Ul=function(t){return yi.yl(t);},t.prototype.ld=function(t){return r.__awaiter(this,void 0,void 0,function(){return r.__generator(this,function(e){return t.user.uid===this.currentUser.uid?[2,this.ul.Td(t.batchId,t.state,t.error)]:(be("SharedClientState","Ignoring mutation for non-active user "+t.user.uid),[2]);});});},t.prototype.fd=function(t){return this.ul.Ed(t.targetId,t.state,t.error);},t.prototype.ad=function(t,e){var n=this,r=e?this.Nl.Ae(t,e):this.Nl.remove(t),i=this.jl(this.Nl),o=this.jl(r),s=[],a=[];return o.forEach(function(t){i.has(t)||s.push(t);}),i.forEach(function(t){o.has(t)||a.push(t);}),this.ul.wd(s,a).then(function(){n.Nl=r;});},t.prototype.Ql=function(t){this.Nl.get(t.clientId)&&this.y_(t.onlineState);},t.prototype.jl=function(t){var e=Zt();return t.forEach(function(t,n){e=e.He(n.activeTargetIds);}),e;},t;}(),bi=function(){function t(){this.Id=new mi(),this.Rd={},this.ul=null,this.y_=null,this.ur=null;}return t.prototype.Gl=function(t){},t.prototype.Hl=function(t,e,n){},t.prototype.Jl=function(t){return this.Id.vl(t),this.Rd[t]||"not-current";},t.prototype.sd=function(t,e,n){this.Rd[t]=e;},t.prototype.Zl=function(t){this.Id.Sl(t);},t.prototype.td=function(t){return this.Id.activeTargetIds.has(t);},t.prototype.ed=function(t){delete this.Rd[t];},t.prototype.Wl=function(){return this.Id.activeTargetIds;},t.prototype.Kl=function(t){return this.Id.activeTargetIds.has(t);},t.prototype.start=function(){return this.Id=new mi(),Promise.resolve();},t.prototype.vu=function(t,e,n){},t.prototype.rd=function(t){},t.prototype.Vo=function(){},t.prototype.lr=function(t){},t;}(),wi=function(t){this.key=t;},_i=function(t){this.key=t;},Ei=function(){function t(t,e){this.query=t,this.Ad=e,this.md=null,this.fs=!1,this.Pd=Jt(),this.ns=Jt(),this.Vd=new te(t.se.bind(t));}return Object.defineProperty(t.prototype,"gd",{get:function(){return this.Ad;},enumerable:!0,configurable:!0}),t.prototype.pd=function(t,e){var n=this,r=e?e.yd:new ee(),i=e?e.Vd:this.Vd,o=e?e.ns:this.ns,s=i,a=!1,u=this.query.oe()&&i.size===this.query.limit?i.last():null,c=this.query.ae()&&i.size===this.query.limit?i.first():null;if(t.pe(function(t,e){var h=i.get(t),l=e instanceof Et?e:null;l&&(l=n.query.matches(l)?l:null);var f=!!h&&n.ns.has(h.key),p=!!l&&(l.At||n.ns.has(l.key)&&l.hasCommittedMutations),d=!1;h&&l?h.data().isEqual(l.data())?f!==p&&(r.track({type:3,doc:l}),d=!0):n.bd(h,l)||(r.track({type:2,doc:l}),d=!0,(u&&n.query.se(l,u)>0||c&&n.query.se(l,c)<0)&&(a=!0)):!h&&l?(r.track({type:0,doc:l}),d=!0):h&&!l&&(r.track({type:1,doc:h}),d=!0,(u||c)&&(a=!0)),d&&(l?(s=s.add(l),o=p?o.add(t):o.delete(t)):(s=s.delete(t),o=o.delete(t)));}),this.query.oe()||this.query.ae())for(;s.size>this.query.limit;){var h=this.query.oe()?s.last():s.first();s=s.delete(h.key),o=o.delete(h.key),r.track({type:1,doc:h});}return {Vd:s,yd:r,vd:a,ns:o};},t.prototype.bd=function(t,e){return t.At&&e.hasCommittedMutations&&!e.At;},t.prototype.On=function(t,e,n){var r=this,i=this.Vd;this.Vd=t.Vd,this.ns=t.ns;var o=t.yd.es();o.sort(function(t,e){return function(t,e){var n=function(t){switch(t){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Ee();}};return n(t)-n(e);}(t.type,e.type)||r.query.se(t.doc,e.doc);}),this.Sd(n);var s=e?this.Dd():[],a=0===this.Pd.size&&this.fs?1:0,u=a!==this.md;return this.md=a,0!==o.length||u?{snapshot:new ne(this.query,t.Vd,i,o,t.ns,0===a,u,!1),Cd:s}:{Cd:s};},t.prototype.Fd=function(t){return this.fs&&"Offline"===t?(this.fs=!1,this.On({Vd:this.Vd,yd:new ee(),ns:this.ns,vd:!1},!1)):{Cd:[]};},t.prototype.Nd=function(t){return !this.Ad.has(t)&&!!this.Vd.has(t)&&!this.Vd.get(t).At;},t.prototype.Sd=function(t){var e=this;t&&(t.Ts.forEach(function(t){return e.Ad=e.Ad.add(t);}),t.Es.forEach(function(t){}),t.ws.forEach(function(t){return e.Ad=e.Ad.delete(t);}),this.fs=t.fs);},t.prototype.Dd=function(){var t=this;if(!this.fs)return [];var e=this.Pd;this.Pd=Jt(),this.Vd.forEach(function(e){t.Nd(e.key)&&(t.Pd=t.Pd.add(e.key));});var n=[];return e.forEach(function(e){t.Pd.has(e)||n.push(new _i(e));}),this.Pd.forEach(function(t){e.has(t)||n.push(new wi(t));}),n;},t.prototype.$d=function(t){this.Ad=t.ju,this.Pd=Jt();var e=this.pd(t.documents);return this.On(e,!0);},t.prototype.kd=function(){return ne.os(this.query,this.Vd,this.ns,0===this.md);},t;}(),Ii=function(){function t(t,e,n,r){this.Ra=t,this.w_=e,this.updateFunction=n,this.Pa=r,this.Md=5,this.Na=new Be(this.Ra,"transaction_retry");}return t.prototype.xd=function(){this.Ld();},t.prototype.Ld=function(){var t=this;this.Na.gr(function(){return r.__awaiter(t,void 0,void 0,function(){var t,e,n=this;return r.__generator(this,function(r){return t=new ai(this.w_),(e=this.Od(t))&&e.then(function(e){n.Ra.co(function(){return t.commit().then(function(){n.Pa.resolve(e);}).catch(function(t){n.Bd(t);});});}).catch(function(t){n.Bd(t);}),[2];});});});},t.prototype.Od=function(t){try{var e=this.updateFunction(t);return !P(e)&&e.catch&&e.then?e:(this.Pa.reject(Error("Transaction callback must return a Promise")),null);}catch(t){return this.Pa.reject(t),null;}},t.prototype.Bd=function(t){var e=this;this.Md>0&&this.qd(t)?(this.Md-=1,this.Ra.co(function(){return e.Ld(),Promise.resolve();})):this.Pa.reject(t);},t.prototype.qd=function(t){if("FirebaseError"===t.name){var e=t.code;return "aborted"===e||"failed-precondition"===e||!jt(e);}return !1;},t;}(),Ti=function(t,e,n){this.query=t,this.targetId=e,this.view=n;},Ai=function(t){this.key=t,this.Ud=!1;},ki=function(){function t(t,e,n,r,i,o){this.M_=t,this.Qd=e,this.w_=n,this.Wd=r,this.currentUser=i,this.jd=o,this.Kd=null,this.Gd=new De(function(t){return t.canonicalId();}),this.zd=new Map(),this.Hd=[],this.Yd=new Ut(x.N),this.Jd=new Map(),this.Xd=new ar(),this.Zd={},this.tf=new Map(),this.ef=nn.rh(),this.onlineState="Unknown";}return Object.defineProperty(t.prototype,"sf",{get:function(){return !0;},enumerable:!0,configurable:!0}),t.prototype.subscribe=function(t){this.Kd=t;},t.prototype.listen=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n,i,o,s;return r.__generator(this,function(r){switch(r.label){case 0:return this.if("listen()"),(i=this.Gd.get(t))?(e=i.targetId,this.Wd.Jl(e),n=i.view.kd(),[3,4]):[3,1];case 1:return [4,this.M_.Uu(t.ee())];case 2:return o=r.sent(),s=this.Wd.Jl(o.targetId),e=o.targetId,[4,this.nf(t,e,"current"===s)];case 3:n=r.sent(),this.sf&&this.Qd.listen(o),r.label=4;case 4:return [2,n];}});});},t.prototype.nf=function(t,e,n){return r.__awaiter(this,void 0,void 0,function(){var i,o,s,a,u,c;return r.__generator(this,function(r){switch(r.label){case 0:return [4,this.M_.Wu(t,!0)];case 1:return i=r.sent(),o=new Ei(t,i.ju),s=o.pd(i.documents),a=ie.ds(e,n&&"Offline"!==this.onlineState),u=o.On(s,this.sf,a),this.rf(e,u.Cd),c=new Ti(t,e,o),[2,(this.Gd.set(t,c),this.zd.has(e)?this.zd.get(e).push(t):this.zd.set(e,[t]),u.snapshot)];}});});},t.prototype.ol=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n,i=this;return r.__generator(this,function(r){switch(r.label){case 0:return this.if("unlisten()"),e=this.Gd.get(t),(n=this.zd.get(e.targetId)).length>1?[2,(this.zd.set(e.targetId,n.filter(function(e){return !e.isEqual(t);})),void this.Gd.delete(t))]:this.sf?(this.Wd.Zl(e.targetId),this.Wd.Kl(e.targetId)?[3,2]:[4,this.M_.Qu(e.targetId,!1).then(function(){i.Wd.ed(e.targetId),i.Qd.ol(e.targetId),i.hf(e.targetId);}).catch(sr)]):[3,3];case 1:r.sent(),r.label=2;case 2:return [3,5];case 3:return this.hf(e.targetId),[4,this.M_.Qu(e.targetId,!0)];case 4:r.sent(),r.label=5;case 5:return [2];}});});},t.prototype.write=function(t,e){return r.__awaiter(this,void 0,void 0,function(){var n,i,o;return r.__generator(this,function(r){switch(r.label){case 0:this.if("write()"),r.label=1;case 1:return r.trys.push([1,5,,6]),[4,this.M_.Fu(t)];case 2:return n=r.sent(),this.Wd.Gl(n.batchId),this.af(n.batchId,e),[4,this.uf(n.Dn)];case 3:return r.sent(),[4,this.Qd.il()];case 4:return r.sent(),[3,6];case 5:return i=r.sent(),o=Jn(i,"Failed to persist write"),e.reject(o),[3,6];case 6:return [2];}});});},t.prototype.runTransaction=function(t,e,n){new Ii(t,this.w_,e,n).xd();},t.prototype.Mu=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n=this;return r.__generator(this,function(r){switch(r.label){case 0:this.if("applyRemoteEvent()"),r.label=1;case 1:return r.trys.push([1,4,,6]),[4,this.M_.Mu(t)];case 2:return e=r.sent(),t.as.forEach(function(t,e){var r=n.Jd.get(e);r&&(Ie(t.Ts.size+t.Es.size+t.ws.size<=1),t.Ts.size>0?r.Ud=!0:t.Es.size>0?Ie(r.Ud):t.ws.size>0&&(Ie(r.Ud),r.Ud=!1));}),[4,this.uf(e,t)];case 3:return r.sent(),[3,6];case 4:return [4,sr(r.sent())];case 5:return r.sent(),[3,6];case 6:return [2];}});});},t.prototype.Fd=function(t,e){this.if("applyOnlineStateChange()");var n=[];this.Gd.forEach(function(e,r){var i=r.view.Fd(t);i.snapshot&&n.push(i.snapshot);}),this.Kd.cf(t),this.Kd.r_(n),this.onlineState=t;},t.prototype.fl=function(t,e){return r.__awaiter(this,void 0,void 0,function(){var n,i,o,s,a,u=this;return r.__generator(this,function(r){switch(r.label){case 0:return this.if("rejectListens()"),this.Wd.sd(t,"rejected",e),n=this.Jd.get(t),(i=n&&n.key)?(o=(o=new Ut(x.N)).Ae(i,new It(i,T.min())),s=Jt().add(i),a=new re(T.min(),new Map(),new Bt(ke),o,s),[4,this.Mu(a)]):[3,2];case 1:return r.sent(),this.Yd=this.Yd.remove(i),this.Jd.delete(t),this._f(),[3,4];case 2:return [4,this.M_.Qu(t,!1).then(function(){return u.hf(t,e);}).catch(sr)];case 3:r.sent(),r.label=4;case 4:return [2];}});});},t.prototype.Al=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n;return r.__generator(this,function(r){switch(r.label){case 0:this.if("applySuccessfulWrite()"),e=t.batch.batchId,r.label=1;case 1:return r.trys.push([1,4,,6]),[4,this.M_.Nu(t)];case 2:return n=r.sent(),this.lf(e,null),this.df(e),this.Wd.Hl(e,"acknowledged"),[4,this.uf(n)];case 3:return r.sent(),[3,6];case 4:return [4,sr(r.sent())];case 5:return r.sent(),[3,6];case 6:return [2];}});});},t.prototype.Pl=function(t,e){return r.__awaiter(this,void 0,void 0,function(){var n;return r.__generator(this,function(r){switch(r.label){case 0:this.if("rejectFailedWrite()"),r.label=1;case 1:return r.trys.push([1,4,,6]),[4,this.M_.ku(t)];case 2:return n=r.sent(),this.lf(t,e),this.df(t),this.Wd.Hl(t,"rejected",e),[4,this.uf(n)];case 3:return r.sent(),[3,6];case 4:return [4,sr(r.sent())];case 5:return r.sent(),[3,6];case 6:return [2];}});});},t.prototype.ff=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n,i,o;return r.__generator(this,function(r){switch(r.label){case 0:this.Qd.Q_()||be("SyncEngine","The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled."),r.label=1;case 1:return r.trys.push([1,3,,4]),[4,this.M_.ta()];case 2:return -1===(e=r.sent())?[2,void t.resolve()]:((n=this.tf.get(e)||[]).push(t),this.tf.set(e,n),[3,4]);case 3:return i=r.sent(),o=Jn(i,"Initialization of waitForPendingWrites() operation failed"),t.reject(o),[3,4];case 4:return [2];}});});},t.prototype.df=function(t){(this.tf.get(t)||[]).forEach(function(t){t.resolve();}),this.tf.delete(t);},t.prototype.Tf=function(t){this.tf.forEach(function(e){e.forEach(function(e){e.reject(new v(d.CANCELLED,t));});}),this.tf.clear();},t.prototype.af=function(t,e){var n=this.Zd[this.currentUser.s()];n||(n=new Ut(ke)),n=n.Ae(t,e),this.Zd[this.currentUser.s()]=n;},t.prototype.lf=function(t,e){var n=this.Zd[this.currentUser.s()];if(n){var r=n.get(t);r&&(e?r.reject(e):r.resolve(),n=n.remove(t)),this.Zd[this.currentUser.s()]=n;}},t.prototype.hf=function(t,e){var n=this;void 0===e&&(e=null),this.Wd.Zl(t);for(var r=0,i=this.zd.get(t);r<i.length;r++){var o=i[r];this.Gd.delete(o),e&&this.Kd.Ef(o,e);}this.zd.delete(t),this.sf&&this.Xd.ic(t).forEach(function(t){n.Xd.Ch(t)||n.wf(t);});},t.prototype.wf=function(t){var e=this.Yd.get(t);null!==e&&(this.Qd.ol(e),this.Yd=this.Yd.remove(t),this.Jd.delete(e),this._f());},t.prototype.rf=function(t,e){for(var n=0,r=e;n<r.length;n++){var i=r[n];i instanceof wi?(this.Xd.yh(i.key,t),this.If(i)):i instanceof _i?(be("SyncEngine","Document no longer in limbo: "+i.key),this.Xd.vh(i.key,t),this.Xd.Ch(i.key)||this.wf(i.key)):Ee();}},t.prototype.If=function(t){var e=t.key;this.Yd.get(e)||(be("SyncEngine","New document in limbo: "+e),this.Hd.push(e),this._f());},t.prototype._f=function(){for(;this.Hd.length>0&&this.Yd.size<this.jd;){var t=this.Hd.shift(),e=this.ef.next();this.Jd.set(e,new Ai(t)),this.Yd=this.Yd.Ae(t,e),this.Qd.listen(new Lt(kt.Wt(t.path).ee(),e,2,Fe.dr));}},t.prototype.Rf=function(){return this.Yd;},t.prototype.Af=function(){return this.Hd;},t.prototype.uf=function(t,e){return r.__awaiter(this,void 0,void 0,function(){var n,i,o,s=this;return r.__generator(this,function(r){switch(r.label){case 0:return n=[],i=[],o=[],this.Gd.forEach(function(r,a){o.push(Promise.resolve().then(function(){var e=a.view.pd(t);return e.vd?s.M_.Wu(a.query,!1).then(function(t){var n=t.documents;return a.view.pd(n,e);}):e;}).then(function(t){var r=e&&e.as.get(a.targetId),o=a.view.On(t,s.sf,r);if(s.rf(a.targetId,o.Cd),o.snapshot){s.sf&&s.Wd.sd(a.targetId,o.snapshot.fromCache?"not-current":"current"),n.push(o.snapshot);var u=Ue.ar(a.targetId,o.snapshot);i.push(u);}}));}),[4,Promise.all(o)];case 1:return r.sent(),this.Kd.r_(n),[4,this.M_.Ou(i)];case 2:return r.sent(),[2];}});});},t.prototype.if=function(t){},t.prototype.gl=function(t){return r.__awaiter(this,void 0,void 0,function(){var e;return r.__generator(this,function(n){switch(n.label){case 0:return this.currentUser.isEqual(t)?[3,3]:[4,this.M_.vu(t)];case 1:return e=n.sent(),this.currentUser=t,this.Tf("'waitForPendingWrites' promise is rejected due to a user change."),this.Wd.vu(t,e.Du,e.Cu),[4,this.uf(e.Su)];case 2:n.sent(),n.label=3;case 3:return [4,this.Qd.gl()];case 4:return n.sent(),[2];}});});},t.prototype.enableNetwork=function(){return this.Qd.enableNetwork();},t.prototype.disableNetwork=function(){return this.Qd.disableNetwork();},t.prototype.ei=function(t){var e=this.Jd.get(t);if(e&&e.Ud)return Jt().add(e.key);var n=Jt(),r=this.zd.get(t);if(!r)return n;for(var i=0,o=r;i<o.length;i++){var s=o[i],a=this.Gd.get(s);n=n.He(a.view.gd);}return n;},t;}(),Ni=function(t){function e(e,n,r,i,o,s){var a=this;return (a=t.call(this,e,n,r,i,o,s)||this).M_=e,a.mf=void 0,a;}return r.__extends(e,t),Object.defineProperty(e.prototype,"sf",{get:function(){return !0===this.mf;},enumerable:!0,configurable:!0}),e.prototype.enableNetwork=function(){return this.M_.uo(!0),t.prototype.enableNetwork.call(this);},e.prototype.disableNetwork=function(){return this.M_.uo(!1),t.prototype.disableNetwork.call(this);},e.prototype.Pf=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n;return r.__generator(this,function(r){switch(r.label){case 0:return [4,this.M_.Wu(t.query,!0)];case 1:return e=r.sent(),n=t.view.$d(e),[2,(this.mf&&this.rf(t.targetId,n.Cd),n)];}});});},e.prototype.Fd=function(e,n){this.sf&&0===n&&(t.prototype.Fd.call(this,e,n),this.Wd.rd(e)),this.sf||1!==n||t.prototype.Fd.call(this,e,n);},e.prototype.Td=function(t,e,n){return r.__awaiter(this,void 0,void 0,function(){var i;return r.__generator(this,function(r){switch(r.label){case 0:return this.if("applyBatchState()"),[4,this.M_.Gu(t)];case 1:return null===(i=r.sent())?[3,6]:"pending"!==e?[3,3]:[4,this.Qd.il()];case 2:return r.sent(),[3,4];case 3:"acknowledged"===e||"rejected"===e?(this.lf(t,n||null),this.M_.zu(t)):Ee(),r.label=4;case 4:return [4,this.uf(i)];case 5:return r.sent(),[3,7];case 6:be("SyncEngine","Cannot apply mutation batch with id: "+t),r.label=7;case 7:return [2];}});});},e.prototype.pl=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n,i,o,s,a,u,c=this;return r.__generator(this,function(r){switch(r.label){case 0:return !0!==t||!0===this.mf?[3,3]:(e=this.Wd.Wl(),[4,this.Vf(e.W(),!0)]);case 1:return n=r.sent(),this.mf=!0,[4,this.Qd.pl(!0)];case 2:for(r.sent(),i=0,o=n;i<o.length;i++)s=o[i],this.Qd.listen(s);return [3,7];case 3:return !1!==t||!1===this.mf?[3,7]:(a=[],u=Promise.resolve(),this.zd.forEach(function(t,e){c.Wd.td(e)?a.push(e):u=u.then(function(){return c.hf(e),c.M_.Qu(e,!0);}),c.Qd.ol(e);}),[4,u]);case 4:return r.sent(),[4,this.Vf(a,!1)];case 5:return r.sent(),this.gf(),this.mf=!1,[4,this.Qd.pl(!1)];case 6:r.sent(),r.label=7;case 7:return [2];}});});},e.prototype.gf=function(){var t=this;this.Jd.forEach(function(e,n){t.Qd.ol(n);}),this.Xd.nc(),this.Jd=new Map(),this.Yd=new Ut(x.N);},e.prototype.Vf=function(t,e){return r.__awaiter(this,void 0,void 0,function(){var e,n,i,o,s,a,u,c,h,l,f,p,d;return r.__generator(this,function(r){switch(r.label){case 0:e=[],n=[],i=0,o=t,r.label=1;case 1:return i<o.length?(s=o[i],a=void 0,(u=this.zd.get(s))&&0!==u.length?[4,this.M_.Uu(u[0].ee())]:[3,7]):[3,13];case 2:a=r.sent(),c=0,h=u,r.label=3;case 3:return c<h.length?(l=h[c],f=this.Gd.get(l),[4,this.Pf(f)]):[3,6];case 4:(p=r.sent()).snapshot&&n.push(p.snapshot),r.label=5;case 5:return c++,[3,3];case 6:return [3,11];case 7:return [4,this.M_.Hu(s)];case 8:return d=r.sent(),[4,this.M_.Uu(d)];case 9:return a=r.sent(),[4,this.nf(this.pf(d),s,!1)];case 10:r.sent(),r.label=11;case 11:e.push(a),r.label=12;case 12:return i++,[3,1];case 13:return [2,(this.Kd.r_(n),e)];}});});},e.prototype.pf=function(t){return new kt(t.path,t.collectionGroup,t.orderBy,t.filters,t.limit,"F",t.startAt,t.endAt);},e.prototype.So=function(){return this.M_.So();},e.prototype.Ed=function(t,e,n){return r.__awaiter(this,void 0,void 0,function(){var i,o;return r.__generator(this,function(r){switch(r.label){case 0:return this.mf?(be("SyncEngine","Ignoring unexpected query state notification."),[3,8]):[3,1];case 1:if(!this.zd.has(t))return [3,8];switch(e){case"current":case"not-current":return [3,2];case"rejected":return [3,5];}return [3,7];case 2:return [4,this.M_.Kr()];case 3:return i=r.sent(),o=re.ls(t,"current"===e),[4,this.uf(i,o)];case 4:return r.sent(),[3,8];case 5:return [4,this.M_.Qu(t,!0)];case 6:return r.sent(),this.hf(t,n),[3,8];case 7:Ee(),r.label=8;case 8:return [2];}});});},e.prototype.wd=function(t,e){return r.__awaiter(this,void 0,void 0,function(){var n,i,o,s,a,u,c,h,l,f,p=this;return r.__generator(this,function(d){switch(d.label){case 0:if(!this.mf)return [3,10];n=0,i=t,d.label=1;case 1:return n<i.length?(o=i[n],this.zd.has(o)?(be("SyncEngine","Adding an already active target "+o),[3,5]):[4,this.M_.Hu(o)]):[3,6];case 2:return s=d.sent(),[4,this.M_.Uu(s)];case 3:return a=d.sent(),[4,this.nf(this.pf(s),a.targetId,!1)];case 4:d.sent(),this.Qd.listen(a),d.label=5;case 5:return n++,[3,1];case 6:u=function(t){return r.__generator(this,function(e){switch(e.label){case 0:return c.zd.has(t)?[4,c.M_.Qu(t,!1).then(function(){p.Qd.ol(t),p.hf(t);}).catch(sr)]:[3,2];case 1:e.sent(),e.label=2;case 2:return [2];}});},c=this,h=0,l=e,d.label=7;case 7:return h<l.length?(f=l[h],[5,u(f)]):[3,10];case 8:d.sent(),d.label=9;case 9:return h++,[3,7];case 10:return [2];}});});},e;}(ki),Si=function(){this.yf=void 0,this.bf=[];},xi=function(){function t(t){this.ul=t,this.vf=new De(function(t){return t.canonicalId();}),this.onlineState="Unknown",this.Sf=new Set(),this.ul.subscribe(this);}return t.prototype.listen=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n,i,o,s,a;return r.__generator(this,function(r){switch(r.label){case 0:if(e=t.query,n=!1,(i=this.vf.get(e))||(n=!0,i=new Si()),!n)return [3,4];r.label=1;case 1:return r.trys.push([1,3,,4]),o=i,[4,this.ul.listen(e)];case 2:return o.yf=r.sent(),[3,4];case 3:return s=r.sent(),a=Jn(s,"Initialization of query '"+t.query+"' failed"),[2,void t.onError(a)];case 4:return this.vf.set(e,i),i.bf.push(t),t.Fd(this.onlineState),i.yf&&t.Df(i.yf)&&this.Cf(),[2];}});});},t.prototype.ol=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n,i,o;return r.__generator(this,function(r){return e=t.query,n=!1,(i=this.vf.get(e))&&(o=i.bf.indexOf(t))>=0&&(i.bf.splice(o,1),n=0===i.bf.length),n?[2,(this.vf.delete(e),this.ul.ol(e))]:[2];});});},t.prototype.r_=function(t){for(var e=!1,n=0,r=t;n<r.length;n++){var i=r[n],o=i.query,s=this.vf.get(o);if(s){for(var a=0,u=s.bf;a<u.length;a++)u[a].Df(i)&&(e=!0);s.yf=i;}}e&&this.Cf();},t.prototype.Ef=function(t,e){var n=this.vf.get(t);if(n)for(var r=0,i=n.bf;r<i.length;r++)i[r].onError(e);this.vf.delete(t);},t.prototype.cf=function(t){this.onlineState=t;var e=!1;this.vf.forEach(function(n,r){for(var i=0,o=r.bf;i<o.length;i++)o[i].Fd(t)&&(e=!0);}),e&&this.Cf();},t.prototype.Ff=function(t){this.Sf.add(t),t.next();},t.prototype.Nf=function(t){this.Sf.delete(t);},t.prototype.Cf=function(){this.Sf.forEach(function(t){t.next();});},t;}(),Oi=function(){function t(t,e,n){this.query=t,this.$f=e,this.kf=!1,this.Mf=null,this.onlineState="Unknown",this.options=n||{};}return t.prototype.Df=function(t){if(!this.options.includeMetadataChanges){for(var e=[],n=0,r=t.docChanges;n<r.length;n++){var i=r[n];3!==i.type&&e.push(i);}t=new ne(t.query,t.docs,t.ss,e,t.ns,t.fromCache,t.rs,!0);}var o=!1;return this.kf?this.xf(t)&&(this.$f.next(t),o=!0):this.Lf(t,this.onlineState)&&(this.Of(t),o=!0),this.Mf=t,o;},t.prototype.onError=function(t){this.$f.error(t);},t.prototype.Fd=function(t){this.onlineState=t;var e=!1;return this.Mf&&!this.kf&&this.Lf(this.Mf,t)&&(this.Of(this.Mf),e=!0),e;},t.prototype.Lf=function(t,e){if(!t.fromCache)return !0;var n="Offline"!==e;return !(this.options.Bf&&n||t.docs.B()&&"Offline"!==e);},t.prototype.xf=function(t){if(t.docChanges.length>0)return !0;var e=this.Mf&&this.Mf.hasPendingWrites!==t.hasPendingWrites;return !(!t.rs&&!e)&&!0===this.options.includeMetadataChanges;},t.prototype.Of=function(t){t=ne.os(t.query,t.docs,t.ns,t.fromCache),this.kf=!0,this.$f.next(t);},t;}(),Di=function(){function t(){}return t.prototype.bu=function(t){this.qf=t;},t.prototype.Zn=function(t,e,n,r){var i=this;return e.te()||n.isEqual(T.min())?this.Uf(t,e):this.qf.Yn(t,r).next(function(s){var a=i.Qf(e,s);return (e.oe()||e.ae())&&i.vd(e.Bt,a,r,n)?i.Uf(t,e):(ge()<=o.LogLevel.DEBUG&&be("IndexFreeQueryEngine","Re-using previous result from %s to execute query: %s",n.toString(),e.toString()),i.qf.Zn(t,e,n).next(function(t){return a.forEach(function(e){t=t.Ae(e.key,e);}),t;}));});},t.prototype.Qf=function(t,e){var n=new Bt(function(e,n){return t.se(e,n);});return e.forEach(function(e,r){r instanceof Et&&t.matches(r)&&(n=n.add(r));}),n;},t.prototype.vd=function(t,e,n,r){if(n.size!==e.size)return !0;var i="F"===t?e.last():e.first();return !!i&&(i.hasPendingWrites||i.version.S(r)>0);},t.prototype.Uf=function(t,e){return ge()<=o.LogLevel.DEBUG&&be("IndexFreeQueryEngine","Using full collection scan to execute query:",e.toString()),this.qf.Zn(t,e,T.min());},t;}(),Ri=function(){function t(t,e){this.jn=t,this.hh=e,this.Wn=[],this.Wf=1,this.jf=new Bt(ur.Ju);}return t.prototype.Ho=function(t){return Pe.resolve(0===this.Wn.length);},t.prototype.Yo=function(t,e,n,r){var i=this.Wf;this.Wf++,this.Wn.length>0&&this.Wn[this.Wn.length-1];var o=new Re(i,e,n,r);this.Wn.push(o);for(var s=0,a=r;s<a.length;s++){var u=a[s];this.jf=this.jf.add(new ur(u.key,i)),this.jn.Dr(t,u.key.path.M());}return Pe.resolve(o);},t.prototype.Jo=function(t,e){return Pe.resolve(this.Kf(e));},t.prototype.Zo=function(t,e){var n=e+1,r=this.Gf(n),i=r<0?0:r;return Pe.resolve(this.Wn.length>i?this.Wn[i]:null);},t.prototype.ta=function(){return Pe.resolve(0===this.Wn.length?-1:this.Wf-1);},t.prototype.ea=function(t){return Pe.resolve(this.Wn.slice());},t.prototype.Gn=function(t,e){var n=this,r=new ur(e,0),i=new ur(e,Number.POSITIVE_INFINITY),o=[];return this.jf.Ke([r,i],function(t){var e=n.Kf(t.hc);o.push(e);}),Pe.resolve(o);},t.prototype.Xn=function(t,e){var n=this,r=new Bt(ke);return e.forEach(function(t){var e=new ur(t,0),i=new ur(t,Number.POSITIVE_INFINITY);n.jf.Ke([e,i],function(t){r=r.add(t.hc);});}),Pe.resolve(this.zf(r));},t.prototype.nr=function(t,e){var n=e.path,r=n.length+1,i=n;x.et(i)||(i=i.child(""));var o=new ur(new x(i),0),s=new Bt(ke);return this.jf.Ge(function(t){var e=t.key.path;return !!n.q(e)&&(e.length===r&&(s=s.add(t.hc)),!0);},o),Pe.resolve(this.zf(s));},t.prototype.zf=function(t){var e=this,n=[];return t.forEach(function(t){var r=e.Kf(t);null!==r&&n.push(r);}),n;},t.prototype.ia=function(t,e){var n=this;Ie(0===this.Hf(e.batchId,"removed")),this.Wn.shift();var r=this.jf;return Pe.forEach(e.mutations,function(i){var o=new ur(i.key,e.batchId);return r=r.delete(o),n.hh.Uo(t,i.key);}).next(function(){n.jf=r;});},t.prototype.na=function(t){},t.prototype.Ch=function(t,e){var n=new ur(e,0),r=this.jf.ze(n);return Pe.resolve(e.isEqual(r&&r.key));},t.prototype.ra=function(t){return this.Wn.length,Pe.resolve();},t.prototype.Hf=function(t,e){return this.Gf(t);},t.prototype.Gf=function(t){return 0===this.Wn.length?0:t-this.Wn[0].batchId;},t.prototype.Kf=function(t){var e=this.Gf(t);return e<0||e>=this.Wn.length?null:this.Wn[e];},t;}(),Ci=function(){function t(t,e){this.jn=t,this.Yf=e,this.docs=new Ut(x.N),this.size=0;}return t.prototype.Nn=function(t,e,n){var r=e.key,i=this.docs.get(r),o=i?i.size:0,s=this.Yf(e);return this.docs=this.docs.Ae(r,{xr:e,size:s,readTime:n}),this.size+=s-o,this.jn.Dr(t,r.path.M());},t.prototype.kn=function(t){var e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size);},t.prototype.Mn=function(t,e){var n=this.docs.get(e);return Pe.resolve(n?n.xr:null);},t.prototype.getEntries=function(t,e){var n=this,r=Ht();return e.forEach(function(t){var e=n.docs.get(t);r=r.Ae(t,e?e.xr:null);}),Pe.resolve(r);},t.prototype.Zn=function(t,e,n){for(var r=Yt(),i=new x(e.path.child("")),o=this.docs.ve(i);o.$e();){var s=o.Ne(),a=s.key,u=s.value,c=u.xr,h=u.readTime;if(!e.path.q(a.path))break;h.S(n)<=0||c instanceof Et&&e.matches(c)&&(r=r.Ae(c.key,c));}return Pe.resolve(r);},t.prototype.Jf=function(t,e){return Pe.forEach(this.docs,function(t){return e(t);});},t.prototype.Yr=function(e){return new t.Jr(this);},t.prototype.Zr=function(t){return Pe.resolve(this.size);},t;}();Ci.Jr=function(t){function e(e){var n=this;return (n=t.call(this)||this).th=e,n;}return r.__extends(e,t),e.prototype.On=function(t){var e=this,n=[];return this.Dn.forEach(function(r,i){i?n.push(e.th.Nn(t,i,e.readTime)):e.th.kn(r);}),Pe.vn(n);},e.prototype.xn=function(t,e){return this.th.Mn(t,e);},e.prototype.Ln=function(t,e){return this.th.getEntries(t,e);},e;}(Le);/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var Pi=function(){function t(t){this.persistence=t,this.Xf=new De(function(t){return t.canonicalId();}),this.lastRemoteSnapshotVersion=T.min(),this.highestTargetId=0,this.Zf=0,this.tT=new ar(),this.targetCount=0,this.eT=nn.nh();}return t.prototype.js=function(t,e){return this.Xf.forEach(function(t,n){return e(n);}),Pe.resolve();},t.prototype._h=function(t){return Pe.resolve(this.lastRemoteSnapshotVersion);},t.prototype.lh=function(t){return Pe.resolve(this.Zf);},t.prototype.oh=function(t){return this.highestTargetId=this.eT.next(),Pe.resolve(this.highestTargetId);},t.prototype.dh=function(t,e,n){return n&&(this.lastRemoteSnapshotVersion=n),e>this.Zf&&(this.Zf=e),Pe.resolve();},t.prototype.Th=function(t){this.Xf.set(t.target,t);var e=t.targetId;e>this.highestTargetId&&(this.eT=new nn(e),this.highestTargetId=e),t.sequenceNumber>this.Zf&&(this.Zf=t.sequenceNumber);},t.prototype.fh=function(t,e){return this.Th(e),this.targetCount+=1,Pe.resolve();},t.prototype.wh=function(t,e){return this.Th(e),Pe.resolve();},t.prototype.Ih=function(t,e){return this.Xf.delete(e.target),this.tT.ic(e.targetId),this.targetCount-=1,Pe.resolve();},t.prototype.Ah=function(t,e,n){var r=this,i=0,o=[];return this.Xf.forEach(function(s,a){a.sequenceNumber<=e&&null===n.get(a.targetId)&&(r.Xf.delete(s),o.push(r.Rh(t,a.targetId)),i++);}),Pe.vn(o).next(function(){return i;});},t.prototype.Vh=function(t){return Pe.resolve(this.targetCount);},t.prototype.gh=function(t,e){var n=this.Xf.get(e)||null;return Pe.resolve(n);},t.prototype.ph=function(t,e,n){return this.tT.tc(e,n),Pe.resolve();},t.prototype.bh=function(t,e,n){this.tT.sc(e,n);var r=this.persistence.hh,i=[];return r&&e.forEach(function(e){i.push(r.Uo(t,e));}),Pe.vn(i);},t.prototype.Rh=function(t,e){return this.tT.ic(e),Pe.resolve();},t.prototype.Sh=function(t,e){var n=this.tT.rc(e);return Pe.resolve(n);},t.prototype.Ch=function(t,e){return Pe.resolve(this.tT.Ch(e));},t;}(),Li=function(){function t(t){var e=this;this.sT={},this.qh=new Fe(0),this.Uh=!1,this.Uh=!0,this.hh=t(this),this.Jh=new Pi(this),this.jn=new Ke(),this.Qn=new Ci(this.jn,function(t){return e.hh.iT(t);});}return t.prototype.start=function(){return Promise.resolve();},t.prototype.Vo=function(){return this.Uh=!1,Promise.resolve();},Object.defineProperty(t.prototype,"ho",{get:function(){return this.Uh;},enumerable:!0,configurable:!0}),t.prototype.oo=function(){},t.prototype.$o=function(){return this.jn;},t.prototype.Do=function(t){var e=this.sT[t.s()];return e||(e=new Ri(this.jn,this.hh),this.sT[t.s()]=e),e;},t.prototype.Fo=function(){return this.Jh;},t.prototype.No=function(){return this.Qn;},t.prototype.runTransaction=function(t,e,n){var r=this;be("MemoryPersistence","Starting transaction:",t);var i=new Mi(this.qh.next());return this.hh.nT(),n(i).next(function(t){return r.hh.rT(i).next(function(){return t;});}).yn().then(function(t){return i.Un(),t;});},t.prototype.hT=function(t,e){return Pe.Sn(Object.values(this.sT).map(function(n){return function(){return n.Ch(t,e);};}));},t;}(),Mi=function(t){function e(e){var n=this;return (n=t.call(this)||this).Lh=e,n;}return r.__extends(e,t),e;}(je),ji=function(){function t(t){this.persistence=t,this.oT=new ar(),this.aT=null;}return t.uT=function(e){return new t(e);},Object.defineProperty(t.prototype,"cT",{get:function(){if(this.aT)return this.aT;throw Ee();},enumerable:!0,configurable:!0}),t.prototype.yh=function(t,e,n){return this.oT.yh(n,e),this.cT.delete(n),Pe.resolve();},t.prototype.vh=function(t,e,n){return this.oT.vh(n,e),this.cT.add(n),Pe.resolve();},t.prototype.Uo=function(t,e){return this.cT.add(e),Pe.resolve();},t.prototype.removeTarget=function(t,e){var n=this;this.oT.ic(e.targetId).forEach(function(t){return n.cT.add(t);});var r=this.persistence.Fo();return r.Sh(t,e.targetId).next(function(t){t.forEach(function(t){return n.cT.add(t);});}).next(function(){return r.Ih(t,e);});},t.prototype.nT=function(){this.aT=new Set();},t.prototype.rT=function(t){var e=this,n=this.persistence.No().Yr();return Pe.forEach(this.cT,function(r){return e._T(t,r).next(function(t){t||n.kn(r);});}).next(function(){return e.aT=null,n.apply(t);});},t.prototype.Ko=function(t,e){var n=this;return this._T(t,e).next(function(t){t?n.cT.delete(e):n.cT.add(e);});},t.prototype.iT=function(t){return 0;},t.prototype._T=function(t,e){var n=this;return Pe.Sn([function(){return Pe.resolve(n.oT.Ch(e));},function(){return n.persistence.Fo().Ch(t,e);},function(){return n.persistence.hT(t,e);}]);},t;}(),Vi="You are using the memory-only build of Firestore. Persistence support is only available via the @firebase/firestore bundle or the firebase-firestore.js build.",Ui=function(){function t(){}return t.prototype.initialize=function(t){return r.__awaiter(this,void 0,void 0,function(){var e=this;return r.__generator(this,function(n){switch(n.label){case 0:return this.Wd=this.lT(t),this.persistence=this.dT(t),[4,this.persistence.start()];case 1:return n.sent(),this.fT=this.TT(t),this.M_=this.ET(t),this.Qd=this.wT(t),this.ul=this.IT(t),this.RT=this.AT(t),this.Wd.y_=function(t){return e.ul.Fd(t,1);},this.Qd.ul=this.ul,[4,this.M_.start()];case 2:return n.sent(),[4,this.Wd.start()];case 3:return n.sent(),[4,this.Qd.start()];case 4:return n.sent(),[4,this.Qd.pl(this.ul.sf)];case 5:return n.sent(),[2];}});});},t.prototype.AT=function(t){return new xi(this.ul);},t.prototype.TT=function(t){return null;},t.prototype.ET=function(t){return new ir(this.persistence,new Di(),t.mT);},t.prototype.dT=function(t){if(t.VT.PT)throw new v(d.FAILED_PRECONDITION,Vi);return new Li(ji.uT);},t.prototype.wT=function(t){var e=this;return new ci(this.M_,t.w_,t.Ra,function(t){return e.ul.Fd(t,0);},t.platform.gT());},t.prototype.lT=function(t){return new bi();},t.prototype.IT=function(t){return new ki(this.M_,this.Qd,t.w_,this.Wd,t.mT,t.jd);},t.prototype.clearPersistence=function(t){throw new v(d.FAILED_PRECONDITION,Vi);},t;}(),Fi=function(t){function e(){return null!==t&&t.apply(this,arguments)||this;}return r.__extends(e,t),e.prototype.initialize=function(e){return r.__awaiter(this,void 0,void 0,function(){var n=this;return r.__generator(this,function(i){switch(i.label){case 0:return [4,t.prototype.initialize.call(this,e)];case 1:return i.sent(),[4,this.persistence.ro(function(t){return r.__awaiter(n,void 0,void 0,function(){return r.__generator(this,function(e){switch(e.label){case 0:return [4,this.ul.pl(t)];case 1:return e.sent(),this.fT&&(t&&!this.fT.ho?this.fT.start(this.M_):t||this.fT.stop()),[2];}});});})];case 2:return i.sent(),[2];}});});},e.prototype.ET=function(t){return new or(this.persistence,new Di(),t.mT);},e.prototype.IT=function(t){var e=new Ni(this.M_,this.Qd,t.w_,this.Wd,t.mT,t.jd);return this.Wd instanceof gi&&(this.Wd.ul=e),e;},e.prototype.TT=function(t){var e=this.persistence.hh.xo;return new nr(e,t.Ra);},e.prototype.dT=function(t){var e=ln.Mo(t.pT),n=t.platform.Cc(t.pT.ii);return new ln(t.VT.synchronizeTabs,e,t.clientId,t.platform,er.nu(t.VT.cacheSizeBytes),t.Ra,n,this.Wd,t.VT.Bh);},e.prototype.lT=function(t){if(t.VT.PT&&t.VT.synchronizeTabs){if(!gi.zh(t.platform))throw new v(d.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");var e=ln.Mo(t.pT);return new gi(t.Ra,t.platform,e,t.clientId,t.mT);}return new bi();},e.prototype.clearPersistence=function(t){var e=ln.Mo(t);return ln.clearPersistence(e);},e;}(Ui),qi=function(){function t(t,e,n,r){this.platform=t,this.pT=e,this.credentials=n,this.Ra=r,this.clientId=Ae.cn();}return t.prototype.start=function(t,e){var n=this;this.yT();var r=new qe(),i=new qe(),o=!1;return this.credentials.l(function(s){if(!o)return o=!0,be("FirestoreClient","Initializing. user=",s.uid),n.bT(t,e,s,i).then(r.resolve,r.reject);n.Ra.lo(function(){return n.gl(s);});}),this.Ra.co(function(){return r.promise;}),i.promise;},t.prototype.enableNetwork=function(){var t=this;return this.yT(),this.Ra.enqueue(function(){return t.ul.enableNetwork();});},t.prototype.bT=function(t,e,n,i){return r.__awaiter(this,void 0,void 0,function(){var o,s,a,u,c=this;return r.__generator(this,function(h){switch(h.label){case 0:return h.trys.push([0,3,,4]),[4,this.platform.vT(this.pT)];case 1:return o=h.sent(),s=this.platform.Cc(this.pT.ii),a=function(t,e,n){return new si(t,e,n);}(o,this.credentials,s),[4,t.initialize({Ra:this.Ra,pT:this.pT,platform:this.platform,w_:a,clientId:this.clientId,mT:n,jd:100,VT:e})];case 2:return h.sent(),this.persistence=t.persistence,this.Wd=t.Wd,this.M_=t.M_,this.Qd=t.Qd,this.ul=t.ul,this.fT=t.fT,this.ST=t.RT,this.persistence.oo(function(){return r.__awaiter(c,void 0,void 0,function(){return r.__generator(this,function(t){switch(t.label){case 0:return [4,this.terminate()];case 1:return t.sent(),[2];}});});}),i.resolve(),[3,4];case 3:if(u=h.sent(),i.reject(u),!this.DT(u))throw u;return [2,(console.warn("Error enabling offline persistence. Falling back to persistence disabled: "+u),this.bT(new Ui(),{PT:!1},n,i))];case 4:return [2];}});});},t.prototype.DT=function(t){return "FirebaseError"===t.name?t.code===d.FAILED_PRECONDITION||t.code===d.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&t instanceof DOMException)||22===t.code||20===t.code||11===t.code;},t.prototype.yT=function(){if(this.Ra.ka)throw new v(d.FAILED_PRECONDITION,"The client has already been terminated.");},t.prototype.gl=function(t){return this.Ra.Ua(),be("FirestoreClient","Credential Changed. Current user: "+t.uid),this.ul.gl(t);},t.prototype.disableNetwork=function(){var t=this;return this.yT(),this.Ra.enqueue(function(){return t.ul.disableNetwork();});},t.prototype.terminate=function(){var t=this;return this.Ra.Ba(function(){return r.__awaiter(t,void 0,void 0,function(){return r.__generator(this,function(t){switch(t.label){case 0:return this.fT&&this.fT.stop(),[4,this.Qd.Vo()];case 1:return t.sent(),[4,this.Wd.Vo()];case 2:return t.sent(),[4,this.persistence.Vo()];case 3:return t.sent(),this.credentials.T(),[2];}});});});},t.prototype.waitForPendingWrites=function(){var t=this;this.yT();var e=new qe();return this.Ra.co(function(){return t.ul.ff(e);}),e.promise;},t.prototype.listen=function(t,e,n){var r=this;this.yT();var i=new Oi(t,e,n);return this.Ra.co(function(){return r.ST.listen(i);}),i;},t.prototype.ol=function(t){var e=this;this.CT||this.Ra.co(function(){return e.ST.ol(t);});},t.prototype.FT=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n=this;return r.__generator(this,function(i){switch(i.label){case 0:return this.yT(),e=new qe(),[4,this.Ra.enqueue(function(){return r.__awaiter(n,void 0,void 0,function(){var n,i,o;return r.__generator(this,function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),[4,this.M_.qu(t)];case 1:return (n=r.sent())instanceof Et?e.resolve(n):n instanceof It?e.resolve(null):e.reject(new v(d.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)")),[3,3];case 2:return i=r.sent(),o=Jn(i,"Failed to get document '"+t+" from cache"),e.reject(o),[3,3];case 3:return [2];}});});})];case 1:return [2,(i.sent(),e.promise)];}});});},t.prototype.NT=function(t){return r.__awaiter(this,void 0,void 0,function(){var e,n=this;return r.__generator(this,function(i){switch(i.label){case 0:return this.yT(),e=new qe(),[4,this.Ra.enqueue(function(){return r.__awaiter(n,void 0,void 0,function(){var n,i,o,s,a,u;return r.__generator(this,function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),[4,this.M_.Wu(t,!0)];case 1:return n=r.sent(),i=new Ei(t,n.ju),o=i.pd(n.documents),s=i.On(o,!1),e.resolve(s.snapshot),[3,3];case 2:return a=r.sent(),u=Jn(a,"Failed to execute query '"+t+" against cache"),e.reject(u),[3,3];case 3:return [2];}});});})];case 1:return [2,(i.sent(),e.promise)];}});});},t.prototype.write=function(t){var e=this;this.yT();var n=new qe();return this.Ra.co(function(){return e.ul.write(t,n);}),n.promise;},t.prototype.ii=function(){return this.pT.ii;},t.prototype.Ff=function(t){var e=this;this.yT(),this.Ra.co(function(){return e.ST.Ff(t),Promise.resolve();});},t.prototype.Nf=function(t){var e=this;this.CT||this.Ra.co(function(){return e.ST.Nf(t),Promise.resolve();});},Object.defineProperty(t.prototype,"CT",{get:function(){return this.Ra.ka;},enumerable:!0,configurable:!0}),t.prototype.transaction=function(t){var e=this;this.yT();var n=new qe();return this.Ra.co(function(){return e.ul.runTransaction(e.Ra,t,n),Promise.resolve();}),n.promise;},t;}(),Bi=function(){function t(t){this.observer=t,this.muted=!1;}return t.prototype.next=function(t){this.$T(this.observer.next,t);},t.prototype.error=function(t){this.$T(this.observer.error,t);},t.prototype.kT=function(){this.muted=!0;},t.prototype.$T=function(t,e){var n=this;this.muted||setTimeout(function(){n.muted||t(e);},0);},t;}();/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */ /**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function zi(t){return function(t,e){if("object"!=typeof t||null===t)return !1;for(var n=t,r=0,i=["next","error","complete"];r<i.length;r++){var o=i[r];if(o in n&&"function"==typeof n[o])return !0;}return !1;}(t);}var Gi=function(){function t(t,e,n,r){this.ii=t,this.timestampsInSnapshots=e,this.MT=n,this.xT=r;}return t.prototype.LT=function(t){switch(F(t)){case 0:return null;case 1:return t.booleanValue;case 2:return K(t.integerValue||t.doubleValue);case 3:return this.OT(t.timestampValue);case 4:return this.BT(t);case 5:return t.stringValue;case 6:return new Dr(Y(t.bytesValue));case 7:return this.qT(t.referenceValue);case 8:return this.UT(t.geoPointValue);case 9:return this.QT(t.arrayValue);case 10:return this.WT(t.mapValue);default:throw Ee();}},t.prototype.WT=function(t){var e=this,n={};return D(t.fields||{},function(t,r){n[t]=e.LT(r);}),n;},t.prototype.UT=function(t){return new Br(K(t.latitude),K(t.longitude));},t.prototype.QT=function(t){var e=this;return (t.values||[]).map(function(t){return e.LT(t);});},t.prototype.BT=function(t){switch(this.MT){case"previous":var e=function t(e){var n=e.mapValue.fields.__previous_value__;return j(n)?t(n):n;}(t);return null==e?null:this.LT(e);case"estimate":return this.OT(V(t));default:return null;}},t.prototype.OT=function(t){var e=H(t),n=new I(e.seconds,e.nanos);return this.timestampsInSnapshots?n:n.toDate();},t.prototype.qT=function(t){var e=k.K(t);Ie(ve(e));var n=new Oe(e.get(1),e.get(3)),r=new x(e.k(5));return n.isEqual(this.ii)||we("Document "+r+" contains a document reference within a different database ("+n.projectId+"/"+n.database+") which is not supported. It will be treated as a reference in the current database ("+this.ii.projectId+"/"+this.ii.database+") instead."),this.xT(r);},t;}(),Wi=er.ou,Hi=function(){function t(t){var e,n,r,i;if(void 0===t.host){if(void 0!==t.ssl)throw new v(d.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0;}else yr("settings","non-empty string","host",t.host),this.host=t.host,mr("settings","boolean","ssl",t.ssl),this.ssl=null===(e=t.ssl)||void 0===e||e;if(Tr("settings",t,["host","ssl","credentials","timestampsInSnapshots","cacheSizeBytes","experimentalForceLongPolling","ignoreUndefinedProperties"]),mr("settings","object","credentials",t.credentials),this.credentials=t.credentials,mr("settings","boolean","timestampsInSnapshots",t.timestampsInSnapshots),mr("settings","boolean","ignoreUndefinedProperties",t.ignoreUndefinedProperties),!0===t.timestampsInSnapshots?we("The setting 'timestampsInSnapshots: true' is no longer required and should be removed."):!1===t.timestampsInSnapshots&&we("Support for 'timestampsInSnapshots: false' will be removed soon. You must update your code to handle Timestamp objects."),this.timestampsInSnapshots=null===(n=t.timestampsInSnapshots)||void 0===n||n,this.ignoreUndefinedProperties=null!==(r=t.ignoreUndefinedProperties)&&void 0!==r&&r,mr("settings","number","cacheSizeBytes",t.cacheSizeBytes),void 0===t.cacheSizeBytes)this.cacheSizeBytes=er.uu;else {if(t.cacheSizeBytes!==Wi&&t.cacheSizeBytes<er.au)throw new v(d.INVALID_ARGUMENT,"cacheSizeBytes must be at least "+er.au);this.cacheSizeBytes=t.cacheSizeBytes;}mr("settings","boolean","experimentalForceLongPolling",t.experimentalForceLongPolling),this.forceLongPolling=null!==(i=t.experimentalForceLongPolling)&&void 0!==i&&i;}return t.prototype.isEqual=function(t){return this.host===t.host&&this.ssl===t.ssl&&this.timestampsInSnapshots===t.timestampsInSnapshots&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.forceLongPolling===t.forceLongPolling&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties;},t;}(),Ki=function(){function t(e,n,i){var o=this;if(void 0===i&&(i=new Ui()),this.jT=null,this.KT=new Qn(),this.INTERNAL={delete:function(){return r.__awaiter(o,void 0,void 0,function(){return r.__generator(this,function(t){switch(t.label){case 0:return this.GT(),[4,this.zT.terminate()];case 1:return t.sent(),[2];}});});}},"object"==typeof e.options){var s=e;this.jT=s,this.mc=t.HT(s),this.YT=s.name,this.JT=new g(n);}else {var a=e;if(!a.projectId)throw new v(d.INVALID_ARGUMENT,"Must provide projectId");this.mc=new Oe(a.projectId,a.database),this.YT="[DEFAULT]",this.JT=new m();}this.XT=i,this.ZT=new Hi({});}return Object.defineProperty(t.prototype,"tE",{get:function(){return this.eE||(this.eE=new Xr(this.mc,this.ZT.ignoreUndefinedProperties)),this.eE;},enumerable:!0,configurable:!0}),t.prototype.settings=function(t){hr("Firestore.settings",arguments,1),pr("Firestore.settings","object",1,t);var e=new Hi(t);if(this.zT&&!this.ZT.isEqual(e))throw new v(d.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only call settings() before calling any other methods on a Firestore object.");this.ZT=e,void 0!==e.credentials&&(this.JT=function(t){if(!t)return new m();switch(t.type){case"gapi":var e=t.sE;return Ie(!("object"!=typeof e||null===e||!e.auth||!e.auth.getAuthHeaderValueForFirstParty)),new w(e,t.V||"0");case"provider":return t.sE;default:throw new v(d.INVALID_ARGUMENT,"makeCredentialsProvider failed due to invalid credential type");}}(e.credentials));},t.prototype.enableNetwork=function(){return this.GT(),this.zT.enableNetwork();},t.prototype.disableNetwork=function(){return this.GT(),this.zT.disableNetwork();},t.prototype.enablePersistence=function(t){var e,n;if(this.zT)throw new v(d.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only call enablePersistence() before calling any other methods on a Firestore object.");var r=!1,i=!1;if(t&&(void 0!==t.experimentalTabSynchronization&&we("The 'experimentalTabSynchronization' setting will be removed. Use 'synchronizeTabs' instead."),r=null!==(n=null!==(e=t.synchronizeTabs)&&void 0!==e?e:t.experimentalTabSynchronization)&&void 0!==n&&n,i=!!t.experimentalForceOwningTab&&t.experimentalForceOwningTab,r&&i))throw new v(d.INVALID_ARGUMENT,"The 'experimentalForceOwningTab' setting cannot be used with 'synchronizeTabs'.");return this.iE(this.XT,{PT:!0,cacheSizeBytes:this.ZT.cacheSizeBytes,synchronizeTabs:r,Bh:i});},t.prototype.clearPersistence=function(){return r.__awaiter(this,void 0,void 0,function(){var t,e=this;return r.__generator(this,function(n){if(void 0!==this.zT&&!this.zT.CT)throw new v(d.FAILED_PRECONDITION,"Persistence cannot be cleared after this Firestore instance is initialized.");return t=new qe(),[2,(this.KT.Ma(function(){return r.__awaiter(e,void 0,void 0,function(){var e,n;return r.__generator(this,function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),e=this.nE(),[4,this.XT.clearPersistence(e)];case 1:return r.sent(),t.resolve(),[3,3];case 2:return n=r.sent(),t.reject(n),[3,3];case 3:return [2];}});});}),t.promise)];});});},t.prototype.terminate=function(){return this.app._removeServiceInstance("firestore"),this.INTERNAL.delete();},Object.defineProperty(t.prototype,"rE",{get:function(){return this.GT(),this.zT.CT;},enumerable:!0,configurable:!0}),t.prototype.waitForPendingWrites=function(){return this.GT(),this.zT.waitForPendingWrites();},t.prototype.onSnapshotsInSync=function(t){if(this.GT(),zi(t))return this.hE(t);pr("Firestore.onSnapshotsInSync","function",1,t);var e={next:t};return this.hE(e);},t.prototype.hE=function(t){var e=this,n=new Bi({next:function(){t.next&&t.next();},error:function(t){throw Ee();}});return this.zT.Ff(n),function(){n.kT(),e.zT.Nf(n);};},t.prototype.GT=function(){return this.zT||this.iE(new Ui(),{PT:!1}),this.zT;},t.prototype.nE=function(){return new xe(this.mc,this.YT,this.ZT.host,this.ZT.ssl,this.ZT.forceLongPolling);},t.prototype.iE=function(t,e){var n=this.nE();return this.zT=new qi(ye.nt(),n,this.JT,this.KT),this.zT.start(t,e);},t.HT=function(t){if(e=t.options,!Object.prototype.hasOwnProperty.call(e,"projectId"))throw new v(d.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');var e,n=t.options.projectId;/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */if(!n||"string"!=typeof n)throw new v(d.INVALID_ARGUMENT,"projectId must be a string in FirebaseApp.options");return new Oe(n);},Object.defineProperty(t.prototype,"app",{get:function(){if(!this.jT)throw new v(d.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this.jT;},enumerable:!0,configurable:!0}),t.prototype.collection=function(t){return hr("Firestore.collection",arguments,1),pr("Firestore.collection","non-empty string",1,t),this.GT(),new no(k.K(t),this);},t.prototype.doc=function(t){return hr("Firestore.doc",arguments,1),pr("Firestore.doc","non-empty string",1,t),this.GT(),Qi.oE(k.K(t),this);},t.prototype.collectionGroup=function(t){if(hr("Firestore.collectionGroup",arguments,1),pr("Firestore.collectionGroup","non-empty string",1,t),t.indexOf("/")>=0)throw new v(d.INVALID_ARGUMENT,"Invalid collection ID '"+t+"' passed to function Firestore.collectionGroup(). Collection IDs must not contain '/'.");return this.GT(),new to(new kt(k.G,t),this);},t.prototype.runTransaction=function(t){var e=this;return hr("Firestore.runTransaction",arguments,1),pr("Firestore.runTransaction","function",1,t),this.GT().transaction(function(n){return t(new Yi(e,n));});},t.prototype.batch=function(){return this.GT(),new Xi(this);},Object.defineProperty(t,"logLevel",{get:function(){switch(ge()){case o.LogLevel.DEBUG:return "debug";case o.LogLevel.ERROR:return "error";case o.LogLevel.SILENT:return "silent";case o.LogLevel.WARN:return "warn";case o.LogLevel.INFO:return "info";case o.LogLevel.VERBOSE:return "verbose";default:return "error";}},enumerable:!0,configurable:!0}),t.setLogLevel=function(t){var e;hr("Firestore.setLogLevel",arguments,1),br("setLogLevel",["debug","error","silent","warn","info","verbose"],1,t),e=t,me.setLogLevel(e);},t.prototype.aE=function(){return this.ZT.timestampsInSnapshots;},t;}(),Yi=function(){function t(t,e){this.uE=t,this.cE=e;}return t.prototype.get=function(t){var e=this;hr("Transaction.get",arguments,1);var n=so("Transaction.get",t,this.uE);return this.cE.P_([n.Pc]).then(function(t){if(!t||1!==t.length)return Ee();var r=t[0];if(r instanceof It)return new $i(e.uE,n.Pc,null,!1,!1,n.Vc);if(r instanceof Et)return new $i(e.uE,n.Pc,r,!1,!1,n.Vc);throw Ee();});},t.prototype.set=function(t,e,n){fr("Transaction.set",arguments,2,3);var r=so("Transaction.set",t,this.uE);n=ro("Transaction.set",n);var i=uo(r.Vc,e,"Transaction.set"),o=i[0],s=i[1],a=n.merge||n.mergeFields?this.uE.tE.$c(s,o,n.mergeFields):this.uE.tE.Fc(s,o);return this.cE.set(r.Pc,a),this;},t.prototype.update=function(t,e,n){for(var r,i,o=[],s=3;s<arguments.length;s++)o[s-3]=arguments[s];return "string"==typeof e||e instanceof Rr?(lr("Transaction.update",arguments,3),r=so("Transaction.update",t,this.uE),i=this.uE.tE.Mc("Transaction.update",e,n,o)):(hr("Transaction.update",arguments,2),r=so("Transaction.update",t,this.uE),i=this.uE.tE.kc("Transaction.update",e)),this.cE.update(r.Pc,i),this;},t.prototype.delete=function(t){hr("Transaction.delete",arguments,1);var e=so("Transaction.delete",t,this.uE);return this.cE.delete(e.Pc),this;},t;}(),Xi=function(){function t(t){this.uE=t,this._E=[],this.lE=!1;}return t.prototype.set=function(t,e,n){fr("WriteBatch.set",arguments,2,3),this.dE();var r=so("WriteBatch.set",t,this.uE);n=ro("WriteBatch.set",n);var i=uo(r.Vc,e,"WriteBatch.set"),o=i[0],s=i[1],a=n.merge||n.mergeFields?this.uE.tE.$c(s,o,n.mergeFields):this.uE.tE.Fc(s,o);return this._E=this._E.concat(a.gc(r.Pc,ct.ft())),this;},t.prototype.update=function(t,e,n){for(var r,i,o=[],s=3;s<arguments.length;s++)o[s-3]=arguments[s];return this.dE(),"string"==typeof e||e instanceof Rr?(lr("WriteBatch.update",arguments,3),r=so("WriteBatch.update",t,this.uE),i=this.uE.tE.Mc("WriteBatch.update",e,n,o)):(hr("WriteBatch.update",arguments,2),r=so("WriteBatch.update",t,this.uE),i=this.uE.tE.kc("WriteBatch.update",e)),this._E=this._E.concat(i.gc(r.Pc,ct.exists(!0))),this;},t.prototype.delete=function(t){hr("WriteBatch.delete",arguments,1),this.dE();var e=so("WriteBatch.delete",t,this.uE);return this._E=this._E.concat(new dt(e.Pc,ct.ft())),this;},t.prototype.commit=function(){return this.dE(),this.lE=!0,this._E.length>0?this.uE.GT().write(this._E):Promise.resolve();},t.prototype.dE=function(){if(this.lE)throw new v(d.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.");},t;}(),Qi=function(t){function e(e,n,r){var i=this;return (i=t.call(this,n.mc,e,r)||this).Pc=e,i.firestore=n,i.Vc=r,i.zT=i.firestore.GT(),i;}return r.__extends(e,t),e.oE=function(t,n,r){if(t.length%2!=0)throw new v(d.INVALID_ARGUMENT,"Invalid document reference. Document references must have an even number of segments, but "+t.j()+" has "+t.length);return new e(new x(t),n,r);},Object.defineProperty(e.prototype,"id",{get:function(){return this.Pc.path.O();},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"parent",{get:function(){return new no(this.Pc.path.M(),this.firestore,this.Vc);},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"path",{get:function(){return this.Pc.path.j();},enumerable:!0,configurable:!0}),e.prototype.collection=function(t){if(hr("DocumentReference.collection",arguments,1),pr("DocumentReference.collection","non-empty string",1,t),!t)throw new v(d.INVALID_ARGUMENT,"Must provide a non-empty collection name to collection()");var e=k.K(t);return new no(this.Pc.path.child(e),this.firestore);},e.prototype.isEqual=function(t){if(!(t instanceof e))throw Ar("isEqual","DocumentReference",1,t);return this.firestore===t.firestore&&this.Pc.isEqual(t.Pc)&&this.Vc===t.Vc;},e.prototype.set=function(t,e){fr("DocumentReference.set",arguments,1,2),e=ro("DocumentReference.set",e);var n=uo(this.Vc,t,"DocumentReference.set"),r=n[0],i=n[1],o=e.merge||e.mergeFields?this.firestore.tE.$c(i,r,e.mergeFields):this.firestore.tE.Fc(i,r);return this.zT.write(o.gc(this.Pc,ct.ft()));},e.prototype.update=function(t,e){for(var n,r=[],i=2;i<arguments.length;i++)r[i-2]=arguments[i];return "string"==typeof t||t instanceof Rr?(lr("DocumentReference.update",arguments,2),n=this.firestore.tE.Mc("DocumentReference.update",t,e,r)):(hr("DocumentReference.update",arguments,1),n=this.firestore.tE.kc("DocumentReference.update",t)),this.zT.write(n.gc(this.Pc,ct.exists(!0)));},e.prototype.delete=function(){return hr("DocumentReference.delete",arguments,0),this.zT.write([new dt(this.Pc,ct.ft())]);},e.prototype.onSnapshot=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];fr("DocumentReference.onSnapshot",arguments,1,4);var n,r={includeMetadataChanges:!1},i=0;"object"!=typeof t[i]||zi(t[i])||(Tr("DocumentReference.onSnapshot",r=t[i],["includeMetadataChanges"]),mr("DocumentReference.onSnapshot","boolean","includeMetadataChanges",r.includeMetadataChanges),i++);var o={includeMetadataChanges:r.includeMetadataChanges};return zi(t[i])?n=t[i]:(pr("DocumentReference.onSnapshot","function",i,t[i]),dr("DocumentReference.onSnapshot","function",i+1,t[i+1]),dr("DocumentReference.onSnapshot","function",i+2,t[i+2]),n={next:t[i],error:t[i+1],complete:t[i+2]}),this.fE(o,n);},e.prototype.fE=function(t,e){var n=this,r=function(t){console.error("Uncaught Error in onSnapshot:",t);};e.error&&(r=e.error.bind(e));var i=new Bi({next:function(t){if(e.next){var r=t.docs.get(n.Pc);e.next(new $i(n.firestore,n.Pc,r,t.fromCache,t.hasPendingWrites,n.Vc));}},error:r}),o=this.zT.listen(kt.Wt(this.Pc.path),i,t);return function(){i.kT(),n.zT.ol(o);};},e.prototype.get=function(t){var e=this;return fr("DocumentReference.get",arguments,0,1),oo("DocumentReference.get",t),new Promise(function(n,r){t&&"cache"===t.source?e.firestore.GT().FT(e.Pc).then(function(t){n(new $i(e.firestore,e.Pc,t,!0,t instanceof Et&&t.At,e.Vc));},r):e.TE(n,r,t);});},e.prototype.TE=function(t,e,n){var r=this.fE({includeMetadataChanges:!0,Bf:!0},{next:function(i){r(),!i.exists&&i.metadata.fromCache?e(new v(d.UNAVAILABLE,"Failed to get document because the client is offline.")):i.exists&&i.metadata.fromCache&&n&&"server"===n.source?e(new v(d.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):t(i);},error:e});},e.prototype.withConverter=function(t){return new e(this.Pc,this.firestore,t);},e;}(Gr),Ji=function(){function t(t,e){this.hasPendingWrites=t,this.fromCache=e;}return t.prototype.isEqual=function(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache;},t;}(),$i=function(){function t(t,e,n,r,i,o){this.uE=t,this.Pc=e,this.EE=n,this.wE=r,this.IE=i,this.Vc=o;}return t.prototype.data=function(t){var e=this;if(fr("DocumentSnapshot.data",arguments,0,1),t=io("DocumentSnapshot.data",t),this.EE){if(this.Vc){var n=new Zi(this.uE,this.Pc,this.EE,this.wE,this.IE);return this.Vc.fromFirestore(n,t);}return new Gi(this.uE.mc,this.uE.aE(),t.serverTimestamps||"none",function(t){return new Qi(t,e.uE);}).LT(this.EE.Mt());}},t.prototype.get=function(t,e){var n=this;if(fr("DocumentSnapshot.get",arguments,1,2),e=io("DocumentSnapshot.get",e),this.EE){var r=this.EE.data().field(ti("DocumentSnapshot.get",t));if(null!==r)return new Gi(this.uE.mc,this.uE.aE(),e.serverTimestamps||"none",function(t){return new Qi(t,n.uE,n.Vc);}).LT(r);}},Object.defineProperty(t.prototype,"id",{get:function(){return this.Pc.path.O();},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"ref",{get:function(){return new Qi(this.Pc,this.uE,this.Vc);},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"exists",{get:function(){return null!==this.EE;},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"metadata",{get:function(){return new Ji(this.IE,this.wE);},enumerable:!0,configurable:!0}),t.prototype.isEqual=function(e){if(!(e instanceof t))throw Ar("isEqual","DocumentSnapshot",1,e);return this.uE===e.uE&&this.wE===e.wE&&this.Pc.isEqual(e.Pc)&&(null===this.EE?null===e.EE:this.EE.isEqual(e.EE))&&this.Vc===e.Vc;},t;}(),Zi=function(t){function e(){return null!==t&&t.apply(this,arguments)||this;}return r.__extends(e,t),e.prototype.data=function(e){return t.prototype.data.call(this,e);},e;}($i),to=function(){function t(t,e,n){this.RE=t,this.firestore=e,this.Vc=n;}return t.prototype.where=function(e,n,r){hr("Query.where",arguments,3),Ir("Query.where",3,r);var i,o=br("Query.where",["<","<=","==",">=",">","array-contains","in","array-contains-any"],2,n),s=ti("Query.where",e);if(s.Y()){if("array-contains"===o||"array-contains-any"===o)throw new v(d.INVALID_ARGUMENT,"Invalid Query. You can't perform '"+o+"' queries on FieldPath.documentId().");if("in"===o){this.AE(r,o);for(var a=[],u=0,c=r;u<c.length;u++){var h=c[u];a.push(this.mE(h));}i={arrayValue:{values:a}};}else i=this.mE(r);}else "in"!==o&&"array-contains-any"!==o||this.AE(r,o),i=this.firestore.tE.xc("Query.where",r,"in"===o);var l=Nt.create(s,o,i);return this.PE(l),new t(this.RE.Gt(l),this.firestore,this.Vc);},t.prototype.orderBy=function(e,n){var r;if(fr("Query.orderBy",arguments,1,2),dr("Query.orderBy","non-empty string",2,n),void 0===n||"asc"===n)r="asc";else {if("desc"!==n)throw new v(d.INVALID_ARGUMENT,"Function Query.orderBy() has unknown direction '"+n+"', expected 'asc' or 'desc'.");r="desc";}if(null!==this.RE.startAt)throw new v(d.INVALID_ARGUMENT,"Invalid query. You must not call Query.startAt() or Query.startAfter() before calling Query.orderBy().");if(null!==this.RE.endAt)throw new v(d.INVALID_ARGUMENT,"Invalid query. You must not call Query.endAt() or Query.endBefore() before calling Query.orderBy().");var i=ti("Query.orderBy",e),o=new Pt(i,r);return this.VE(o),new t(this.RE.zt(o),this.firestore,this.Vc);},t.prototype.limit=function(e){return hr("Query.limit",arguments,1),pr("Query.limit","number",1,e),kr("Query.limit",1,e),new t(this.RE.Ht(e),this.firestore,this.Vc);},t.prototype.limitToLast=function(e){return hr("Query.limitToLast",arguments,1),pr("Query.limitToLast","number",1,e),kr("Query.limitToLast",1,e),new t(this.RE.Yt(e),this.firestore,this.Vc);},t.prototype.startAt=function(e){for(var n=[],r=1;r<arguments.length;r++)n[r-1]=arguments[r];lr("Query.startAt",arguments,1);var i=this.gE("Query.startAt",e,n,!0);return new t(this.RE.Jt(i),this.firestore,this.Vc);},t.prototype.startAfter=function(e){for(var n=[],r=1;r<arguments.length;r++)n[r-1]=arguments[r];lr("Query.startAfter",arguments,1);var i=this.gE("Query.startAfter",e,n,!1);return new t(this.RE.Jt(i),this.firestore,this.Vc);},t.prototype.endBefore=function(e){for(var n=[],r=1;r<arguments.length;r++)n[r-1]=arguments[r];lr("Query.endBefore",arguments,1);var i=this.gE("Query.endBefore",e,n,!0);return new t(this.RE.Xt(i),this.firestore,this.Vc);},t.prototype.endAt=function(e){for(var n=[],r=1;r<arguments.length;r++)n[r-1]=arguments[r];lr("Query.endAt",arguments,1);var i=this.gE("Query.endAt",e,n,!1);return new t(this.RE.Xt(i),this.firestore,this.Vc);},t.prototype.isEqual=function(e){if(!(e instanceof t))throw Ar("isEqual","Query",1,e);return this.firestore===e.firestore&&this.RE.isEqual(e.RE);},t.prototype.withConverter=function(e){return new t(this.RE,this.firestore,e);},t.prototype.gE=function(t,e,n,r){if(Ir(t,1,e),e instanceof $i){if(n.length>0)throw new v(d.INVALID_ARGUMENT,"Too many arguments provided to "+t+"().");var i=e;if(!i.exists)throw new v(d.NOT_FOUND,"Can't use a DocumentSnapshot that doesn't exist for "+t+"().");return this.pE(i.EE,r);}var o=[e].concat(n);return this.yE(t,o,r);},t.prototype.pE=function(t,e){for(var n=[],r=0,i=this.RE.orderBy;r<i.length;r++){var o=i[r];if(o.field.Y())n.push(X(this.firestore.mc,t.key));else {var s=t.field(o.field);if(j(s))throw new v(d.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+o.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(null===s){var a=o.field.j();throw new v(d.INVALID_ARGUMENT,"Invalid query. You are trying to start or end a query using a document for which the field '"+a+"' (used as the orderBy) does not exist.");}n.push(s);}}return new Ct(n,e);},t.prototype.yE=function(t,e,n){var r=this.RE.Ot;if(e.length>r.length)throw new v(d.INVALID_ARGUMENT,"Too many arguments provided to "+t+"(). The number of arguments must be less than or equal to the number of Query.orderBy() clauses");for(var i=[],o=0;o<e.length;o++){var s=e[o];if(r[o].field.Y()){if("string"!=typeof s)throw new v(d.INVALID_ARGUMENT,"Invalid query. Expected a string for document ID in "+t+"(), but got a "+typeof s);if(!this.RE._e()&&-1!==s.indexOf("/"))throw new v(d.INVALID_ARGUMENT,"Invalid query. When querying a collection and ordering by FieldPath.documentId(), the value passed to "+t+"() must be a plain document ID, but '"+s+"' contains a slash.");var a=this.RE.path.child(k.K(s));if(!x.et(a))throw new v(d.INVALID_ARGUMENT,"Invalid query. When querying a collection group and ordering by FieldPath.documentId(), the value passed to "+t+"() must result in a valid document path, but '"+a+"' is not because it contains an odd number of segments.");var u=new x(a);i.push(X(this.firestore.mc,u));}else {var c=this.firestore.tE.xc(t,s);i.push(c);}}return new Ct(i,n);},t.prototype.onSnapshot=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];fr("Query.onSnapshot",arguments,1,4);var n,r={},i=0;return "object"!=typeof t[i]||zi(t[i])||(Tr("Query.onSnapshot",r=t[i],["includeMetadataChanges"]),mr("Query.onSnapshot","boolean","includeMetadataChanges",r.includeMetadataChanges),i++),zi(t[i])?n=t[i]:(pr("Query.onSnapshot","function",i,t[i]),dr("Query.onSnapshot","function",i+1,t[i+1]),dr("Query.onSnapshot","function",i+2,t[i+2]),n={next:t[i],error:t[i+1],complete:t[i+2]}),this.bE(this.RE),this.fE(r,n);},t.prototype.fE=function(t,e){var n=this,r=function(t){console.error("Uncaught Error in onSnapshot:",t);};e.error&&(r=e.error.bind(e));var i=new Bi({next:function(t){e.next&&e.next(new eo(n.firestore,n.RE,t,n.Vc));},error:r}),o=this.firestore.GT(),s=o.listen(this.RE,i,t);return function(){i.kT(),o.ol(s);};},t.prototype.bE=function(t){if(t.ae()&&0===t.Ot.length)throw new v(d.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause");},t.prototype.get=function(t){var e=this;return fr("Query.get",arguments,0,1),oo("Query.get",t),this.bE(this.RE),new Promise(function(n,r){t&&"cache"===t.source?e.firestore.GT().NT(e.RE).then(function(t){n(new eo(e.firestore,e.RE,t,e.Vc));},r):e.TE(n,r,t);});},t.prototype.TE=function(t,e,n){var r=this.fE({includeMetadataChanges:!0,Bf:!0},{next:function(i){r(),i.metadata.fromCache&&n&&"server"===n.source?e(new v(d.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):t(i);},error:e});},t.prototype.mE=function(t){if("string"==typeof t){if(""===t)throw new v(d.INVALID_ARGUMENT,"Invalid query. When querying with FieldPath.documentId(), you must provide a valid document ID, but it was an empty string.");if(!this.RE._e()&&-1!==t.indexOf("/"))throw new v(d.INVALID_ARGUMENT,"Invalid query. When querying a collection by FieldPath.documentId(), you must provide a plain document ID, but '"+t+"' contains a '/' character.");var e=this.RE.path.child(k.K(t));if(!x.et(e))throw new v(d.INVALID_ARGUMENT,"Invalid query. When querying a collection group by FieldPath.documentId(), the value provided must result in a valid document path, but '"+e+"' is not because it has an odd number of segments ("+e.length+").");return X(this.firestore.mc,new x(e));}if(t instanceof Qi){var n=t;return X(this.firestore.mc,n.Pc);}throw new v(d.INVALID_ARGUMENT,"Invalid query. When querying with FieldPath.documentId(), you must provide a valid string or a DocumentReference, but it was: "+Er(t)+".");},t.prototype.AE=function(t,e){if(!Array.isArray(t)||0===t.length)throw new v(d.INVALID_ARGUMENT,"Invalid Query. A non-empty array is required for '"+e.toString()+"' filters.");if(t.length>10)throw new v(d.INVALID_ARGUMENT,"Invalid Query. '"+e.toString()+"' filters support a maximum of 10 elements in the value array.");if(t.indexOf(null)>=0)throw new v(d.INVALID_ARGUMENT,"Invalid Query. '"+e.toString()+"' filters cannot contain 'null' in the value array.");if(t.filter(function(t){return Number.isNaN(t);}).length>0)throw new v(d.INVALID_ARGUMENT,"Invalid Query. '"+e.toString()+"' filters cannot contain 'NaN' in the value array.");},t.prototype.PE=function(t){if(t instanceof Nt){var e=["array-contains","array-contains-any"],n=["in","array-contains-any"],r=e.indexOf(t.op)>=0,i=n.indexOf(t.op)>=0;if(t.ue()){var o=this.RE.jt();if(null!==o&&!o.isEqual(t.field))throw new v(d.INVALID_ARGUMENT,"Invalid query. All where filters with an inequality (<, <=, >, or >=) must be on the same field. But you have inequality filters on '"+o.toString()+"' and '"+t.field.toString()+"'");var s=this.RE.Kt();null!==s&&this.vE(t.field,s);}else if(i||r){var a=null;if(i&&(a=this.RE.ce(n)),null===a&&r&&(a=this.RE.ce(e)),null!=a)throw a===t.op?new v(d.INVALID_ARGUMENT,"Invalid query. You cannot use more than one '"+t.op.toString()+"' filter."):new v(d.INVALID_ARGUMENT,"Invalid query. You cannot use '"+t.op.toString()+"' filters with '"+a.toString()+"' filters.");}}},t.prototype.VE=function(t){if(null===this.RE.Kt()){var e=this.RE.jt();null!==e&&this.vE(e,t.field);}},t.prototype.vE=function(t,e){if(!e.isEqual(t))throw new v(d.INVALID_ARGUMENT,"Invalid query. You have a where filter with an inequality (<, <=, >, or >=) on field '"+t.toString()+"' and so you must also use '"+t.toString()+"' as your first Query.orderBy(), but your first Query.orderBy() is on field '"+e.toString()+"' instead.");},t;}(),eo=function(){function t(t,e,n,r){this.uE=t,this.SE=e,this.DE=n,this.Vc=r,this.CE=null,this.FE=null,this.metadata=new Ji(n.hasPendingWrites,n.fromCache);}return Object.defineProperty(t.prototype,"docs",{get:function(){var t=[];return this.forEach(function(e){return t.push(e);}),t;},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"empty",{get:function(){return this.DE.docs.B();},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"size",{get:function(){return this.DE.docs.size;},enumerable:!0,configurable:!0}),t.prototype.forEach=function(t,e){var n=this;fr("QuerySnapshot.forEach",arguments,1,2),pr("QuerySnapshot.forEach","function",1,t),this.DE.docs.forEach(function(r){t.call(e,n.NE(r));});},Object.defineProperty(t.prototype,"query",{get:function(){return new to(this.SE,this.uE,this.Vc);},enumerable:!0,configurable:!0}),t.prototype.docChanges=function(t){t&&(Tr("QuerySnapshot.docChanges",t,["includeMetadataChanges"]),mr("QuerySnapshot.docChanges","boolean","includeMetadataChanges",t.includeMetadataChanges));var e=!(!t||!t.includeMetadataChanges);if(e&&this.DE.hs)throw new v(d.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this.CE&&this.FE===e||(this.CE=function(t,e,n,r){if(n.ss.B()){var i=0;return n.docChanges.map(function(e){var o=new Zi(t,e.doc.key,e.doc,n.fromCache,n.ns.has(e.doc.key),r);return e.doc,{type:"added",doc:o,oldIndex:-1,newIndex:i++};});}var o=n.ss;return n.docChanges.filter(function(t){return e||3!==t.type;}).map(function(e){var i=new Zi(t,e.doc.key,e.doc,n.fromCache,n.ns.has(e.doc.key),r),s=-1,a=-1;return 0!==e.type&&(s=o.indexOf(e.doc.key),o=o.delete(e.doc.key)),1!==e.type&&(a=(o=o.add(e.doc)).indexOf(e.doc.key)),{type:ao(e.type),doc:i,oldIndex:s,newIndex:a};});}(this.uE,e,this.DE,this.Vc),this.FE=e),this.CE;},t.prototype.isEqual=function(e){if(!(e instanceof t))throw Ar("isEqual","QuerySnapshot",1,e);return this.uE===e.uE&&this.SE.isEqual(e.SE)&&this.DE.isEqual(e.DE)&&this.Vc===e.Vc;},t.prototype.NE=function(t){return new Zi(this.uE,t.key,t,this.metadata.fromCache,this.DE.ns.has(t.key),this.Vc);},t;}(),no=function(t){function e(e,n,r){var i=this;if((i=t.call(this,kt.Wt(e),n,r)||this).$E=e,e.length%2!=1)throw new v(d.INVALID_ARGUMENT,"Invalid collection reference. Collection references must have an odd number of segments, but "+e.j()+" has "+e.length);return i;}return r.__extends(e,t),Object.defineProperty(e.prototype,"id",{get:function(){return this.RE.path.O();},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"parent",{get:function(){var t=this.RE.path.M();return t.B()?null:new Qi(new x(t),this.firestore);},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"path",{get:function(){return this.RE.path.j();},enumerable:!0,configurable:!0}),e.prototype.doc=function(t){fr("CollectionReference.doc",arguments,0,1),0===arguments.length&&(t=Ae.cn()),pr("CollectionReference.doc","non-empty string",1,t);var e=k.K(t);return Qi.oE(this.RE.path.child(e),this.firestore,this.Vc);},e.prototype.add=function(t){hr("CollectionReference.add",arguments,1),pr("CollectionReference.add","object",1,this.Vc?this.Vc.toFirestore(t):t);var e=this.doc();return e.set(t).then(function(){return e;});},e.prototype.withConverter=function(t){return new e(this.$E,this.firestore,t);},e;}(to);/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function ro(t,e){if(void 0===e)return {merge:!1};if(Tr(t,e,["merge","mergeFields"]),mr(t,"boolean","merge",e.merge),function(t,e,n,r,i){void 0!==r&&function(t,e,n,r,i){if(!(r instanceof Array))throw new v(d.INVALID_ARGUMENT,"Function "+t+"() requires its "+e+" option to be an array, but it was: "+Er(r));for(var o=0;o<r.length;++o)if(!i(r[o]))throw new v(d.INVALID_ARGUMENT,"Function "+t+"() requires all "+e+" elements to be a string or a FieldPath, but the value at index "+o+" was: "+Er(r[o]));}(t,"mergeFields",0,r,function(t){return "string"==typeof t||t instanceof Rr;});}(t,0,0,e.mergeFields),void 0!==e.mergeFields&&void 0!==e.merge)throw new v(d.INVALID_ARGUMENT,"Invalid options passed to function "+t+'(): You cannot specify both "merge" and "mergeFields".');return e;}function io(t,e){return void 0===e?{}:(Tr(t,e,["serverTimestamps"]),gr(t,0,"serverTimestamps",e.serverTimestamps,["estimate","previous","none"]),e);}function oo(t,e){dr(t,"object",1,e),e&&(Tr(t,e,["source"]),gr(t,0,"source",e.source,["default","server","cache"]));}function so(t,e,n){if(e instanceof Gr){if(e.firestore!==n)throw new v(d.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return e;}throw Ar(t,"DocumentReference",1,e);}function ao(t){switch(t){case 0:return "added";case 2:case 3:return "modified";case 1:return "removed";default:return Ee();}}function uo(t,e,n){var r;return t?(r=t.toFirestore(e),n="toFirestore() in "+n):r=e,[r,n];}function co(t,e){function n(){var t="This constructor is private.";throw e&&(t+=" ",t+=e),new v(d.INVALID_ARGUMENT,t);}return n.prototype=t.prototype,Object.assign(n,t),n;}/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */var ho=co(Ki,"Use firebase.firestore() instead."),lo=co(Yi,"Use firebase.firestore().runTransaction() instead."),fo=co(Xi,"Use firebase.firestore().batch() instead."),po=co(Qi,"Use firebase.firestore().doc() instead."),vo=co($i),yo=co(Zi),mo=co(to),go=co(eo),bo=co(no,"Use firebase.firestore().collection() instead."),wo=co(Fr,"Use FieldValue.<field>() instead."),_o=co(Dr,"Use Blob.fromUint8Array() or Blob.fromBase64String() instead."),Eo={Firestore:ho,GeoPoint:Br,Timestamp:I,Blob:_o,Transaction:lo,WriteBatch:fo,DocumentReference:po,DocumentSnapshot:vo,Query:mo,QueryDocumentSnapshot:yo,QuerySnapshot:go,CollectionReference:bo,FieldPath:Rr,FieldValue:wo,setLogLevel:Ki.setLogLevel,CACHE_SIZE_UNLIMITED:Wi},Io=function(){function t(){}return t.prototype.U_=function(t){},t.prototype.Vo=function(){},t;}(),To=function(){function t(){var t=this;this.kE=function(){return t.ME();},this.xE=function(){return t.LE();},this.OE=[],this.BE();}return t.prototype.U_=function(t){this.OE.push(t);},t.prototype.Vo=function(){window.removeEventListener("online",this.kE),window.removeEventListener("offline",this.xE);},t.prototype.BE=function(){window.addEventListener("online",this.kE),window.addEventListener("offline",this.xE);},t.prototype.ME=function(){be("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(var t=0,e=this.OE;t<e.length;t++)(0, e[t])(0);},t.prototype.LE=function(){be("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(var t=0,e=this.OE;t<e.length;t++)(0, e[t])(1);},t.zh=function(){return "undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener;},t;}(),Ao=function(){function t(t){this.qE=t.qE,this.UE=t.UE;}return t.prototype.i_=function(t){this.QE=t;},t.prototype.Xc=function(t){this.WE=t;},t.prototype.onMessage=function(t){this.jE=t;},t.prototype.close=function(){this.UE();},t.prototype.send=function(t){this.qE(t);},t.prototype.KE=function(){this.QE();},t.prototype.GE=function(t){this.WE(t);},t.prototype.zE=function(t){this.jE(t);},t;}(),ko={BatchGetDocuments:"batchGet",Commit:"commit"},No="gl-js/ fire/"+f,So=function(){function t(t){this.ii=t.ii;var e=t.ssl?"https":"http";this.HE=e+"://"+t.host,this.forceLongPolling=t.forceLongPolling;}return t.prototype.YE=function(t,e){if(e)for(var n in e.o)e.o.hasOwnProperty(n)&&(t[n]=e.o[n]);t["X-Goog-Api-Client"]=No;},t.prototype.T_=function(t,e,n){var r=this,i=this.JE(t);return new Promise(function(o,s){var a=new h.XhrIo();a.listenOnce(h.EventType.COMPLETE,function(){try{switch(a.getLastErrorCode()){case h.ErrorCode.NO_ERROR:var e=a.getResponseJson();be("Connection","XHR received:",JSON.stringify(e)),o(e);break;case h.ErrorCode.TIMEOUT:be("Connection",'RPC "'+t+'" timed out'),s(new v(d.DEADLINE_EXCEEDED,"Request time out"));break;case h.ErrorCode.HTTP_ERROR:var n=a.getStatus();if(be("Connection",'RPC "'+t+'" failed with status:',n,"response text:",a.getResponseText()),n>0){var r=a.getResponseJson().error;if(r&&r.status&&r.message){var i=function(t){var e=t.toLowerCase().replace("_","-");return Object.values(d).indexOf(e)>=0?e:d.UNKNOWN;}(r.status);s(new v(i,r.message));}else s(new v(d.UNKNOWN,"Server responded with status "+a.getStatus()));}else be("Connection",'RPC "'+t+'" failed'),s(new v(d.UNAVAILABLE,"Connection failed."));break;default:Ee();}}finally{be("Connection",'RPC "'+t+'" completed.');}});var u=Object.assign({},e);delete u.database;var c=JSON.stringify(u);be("Connection","XHR sending: ",i+" "+c);var l={"Content-Type":"text/plain"};r.YE(l,n),a.send(i,"POST",c,l,15);});},t.prototype.E_=function(t,e,n){return this.T_(t,e,n);},t.prototype.n_=function(t,e){var n=[this.HE,"/","google.firestore.v1.Firestore","/",t,"/channel"],i=h.createWebChannelTransport(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:"projects/"+this.ii.projectId+"/databases/"+this.ii.database},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling};this.YE(a.initMessageHeaders,e),s.isMobileCordova()||s.isReactNative()||s.isElectron()||s.isIE()||s.isUWP()||s.isBrowserExtension()||(a.httpHeadersOverwriteParam="$httpHeaders");var u=n.join("");be("Connection","Creating WebChannel: "+u+" "+a);var c=i.createWebChannel(u,a),l=!1,p=!1,y=new Ao({qE:function(t){p?be("Connection","Not sending because WebChannel is closed:",t):(l||(be("Connection","Opening WebChannel transport."),c.open(),l=!0),be("Connection","WebChannel sending:",t),c.send(t));},UE:function(){return c.close();}}),m=function(t,e){c.listen(t,function(t){try{e(t);}catch(t){setTimeout(function(){throw t;},0);}});};return m(h.WebChannel.EventType.OPEN,function(){p||be("Connection","WebChannel transport opened.");}),m(h.WebChannel.EventType.CLOSE,function(){p||(p=!0,be("Connection","WebChannel transport closed"),y.GE());}),m(h.WebChannel.EventType.ERROR,function(t){p||(p=!0,function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];if(me.logLevel<=o.LogLevel.WARN){var i=e.map(_e);me.warn.apply(me,r.__spreadArrays(["Firestore ("+f+"): "+t],i));}}("Connection","WebChannel transport errored:",t),y.GE(new v(d.UNAVAILABLE,"The operation could not be completed")));}),m(h.WebChannel.EventType.MESSAGE,function(t){var e;if(!p){var n=t.data[0];Ie(!!n);var r=n,i=r.error||(null===(e=r[0])||void 0===e?void 0:e.error);if(i){be("Connection","WebChannel received error:",i);var o=i.status,s=function(t){var e=bt[t];if(void 0!==e)return Vt(e);}(o),a=i.message;void 0===s&&(s=d.INTERNAL,a="Unknown error status: "+o+" with message "+i.message),p=!0,y.GE(new v(s,a)),c.close();}else be("Connection","WebChannel received:",n),y.zE(n);}}),setTimeout(function(){y.KE();},0),y;},t.prototype.JE=function(t){var e=ko[t];return this.HE+"/v1/projects/"+this.ii.projectId+"/databases/"+this.ii.database+"/documents:"+e;},t;}();/**
	 * @license
	 * Copyright 2019 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */ /**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */ /**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */function xo(t){!function(t,e){t.INTERNAL.registerComponent(new a.Component("firestore",function(t){return function(t,e){return new Ki(t,e,new Fi());}(t.getProvider("app").getImmediate(),t.getProvider("auth-internal"));},"PUBLIC").setServiceProps(Object.assign({},Eo)));}(t),t.registerVersion("@firebase/firestore","1.15.0");/**
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */}ye.an(new(function(){function t(){this.oc="undefined"!=typeof atob;}return Object.defineProperty(t.prototype,"document",{get:function(){return "undefined"!=typeof document?document:null;},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"window",{get:function(){return "undefined"!=typeof window?window:null;},enumerable:!0,configurable:!0}),t.prototype.vT=function(t){return Promise.resolve(new So(t));},t.prototype.gT=function(){return To.zh()?new To():new Io();},t.prototype.Cc=function(t){return new de(t,{hi:!0});},t.prototype.un=function(t){return JSON.stringify(t);},t.prototype.atob=function(t){return atob(t);},t.prototype.btoa=function(t){return btoa(t);},t.prototype._n=function(t){var e="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e)e.getRandomValues(n);else for(var r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n;},t;}())()),xo(i),e.__PRIVATE_registerFirestore=xo;});e(yr);yr.__PRIVATE_registerFirestore;var mr,gr,br,wr,_r,Er,Ir={},Tr=[],Ar=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function kr(t,e){for(var n in e)t[n]=e[n];return t;}function Nr(t){var e=t.parentNode;e&&e.removeChild(t);}function Sr(t,e,n){var r,i=arguments,o={};for(r in e)"key"!==r&&"ref"!==r&&(o[r]=e[r]);if(arguments.length>3)for(n=[n],r=3;r<arguments.length;r++)n.push(i[r]);if(null!=n&&(o.children=n),"function"==typeof t&&null!=t.defaultProps)for(r in t.defaultProps)void 0===o[r]&&(o[r]=t.defaultProps[r]);return xr(t,o,e&&e.key,e&&e.ref,null);}function xr(t,e,n,r,i){var o={type:t,props:e,key:n,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:i};return null==i&&(o.__v=o),mr.vnode&&mr.vnode(o),o;}function Or(t){return t.children;}function Dr(t,e){this.props=t,this.context=e;}function Rr(t,e){if(null==e)return t.__?Rr(t.__,t.__.__k.indexOf(t)+1):null;for(var n;e<t.__k.length;e++)if(null!=(n=t.__k[e])&&null!=n.__e)return n.__e;return "function"==typeof t.type?Rr(t):null;}function Cr(t){var e,n;if(null!=(t=t.__)&&null!=t.__c){for(t.__e=t.__c.base=null,e=0;e<t.__k.length;e++)if(null!=(n=t.__k[e])&&null!=n.__e){t.__e=t.__c.base=n.__e;break;}return Cr(t);}}function Pr(t){(!t.__d&&(t.__d=!0)&&gr.push(t)&&!br++||_r!==mr.debounceRendering)&&((_r=mr.debounceRendering)||wr)(Lr);}function Lr(){for(var t;br=gr.length;)t=gr.sort(function(t,e){return t.__v.__b-e.__v.__b;}),gr=[],t.some(function(t){var e,n,r,i,o,s,a;t.__d&&(s=(o=(e=t).__v).__e,(a=e.__P)&&(n=[],(r=kr({},o)).__v=r,i=Fr(a,o,r,e.__n,void 0!==a.ownerSVGElement,null,n,null==s?Rr(o):s),qr(n,o),i!=s&&Cr(o)));});}function Mr(t,e,n,r,i,o,s,a,u,c){var h,l,f,p,d,v,y,m,g,b=r&&r.__k||Tr,w=b.length;for(u==Ir&&(u=null!=s?s[0]:w?Rr(r,0):null),n.__k=[],h=0;h<e.length;h++)if(null!=(p=n.__k[h]=null==(p=e[h])||"boolean"==typeof p?null:"string"==typeof p||"number"==typeof p?xr(null,p,null,null,p):Array.isArray(p)?xr(Or,{children:p},null,null,null):null!=p.__e||null!=p.__c?xr(p.type,p.props,p.key,null,p.__v):p)){if(p.__=n,p.__b=n.__b+1,null===(f=b[h])||f&&p.key==f.key&&p.type===f.type)b[h]=void 0;else for(l=0;l<w;l++){if((f=b[l])&&p.key==f.key&&p.type===f.type){b[l]=void 0;break;}f=null;}if(d=Fr(t,p,f=f||Ir,i,o,s,a,u,c),(l=p.ref)&&f.ref!=l&&(m||(m=[]),f.ref&&m.push(f.ref,null,p),m.push(l,p.__c||d,p)),null!=d){if(null==y&&(y=d),g=void 0,void 0!==p.__d)g=p.__d,p.__d=void 0;else if(s==f||d!=u||null==d.parentNode){t:if(null==u||u.parentNode!==t)t.appendChild(d),g=null;else {for(v=u,l=0;(v=v.nextSibling)&&l<w;l+=2)if(v==d)break t;t.insertBefore(d,u),g=u;}"option"==n.type&&(t.value="");}u=void 0!==g?g:d.nextSibling,"function"==typeof n.type&&(n.__d=u);}else u&&f.__e==u&&u.parentNode!=t&&(u=Rr(f));}if(n.__e=y,null!=s&&"function"!=typeof n.type)for(h=s.length;h--;)null!=s[h]&&Nr(s[h]);for(h=w;h--;)null!=b[h]&&Gr(b[h],b[h]);if(m)for(h=0;h<m.length;h++)zr(m[h],m[++h],m[++h]);}function jr(t,e,n){"-"===e[0]?t.setProperty(e,n):t[e]="number"==typeof n&&!1===Ar.test(e)?n+"px":null==n?"":n;}function Vr(t,e,n,r,i){var o,s,a,u,c;if(i?"className"===e&&(e="class"):"class"===e&&(e="className"),"style"===e){if(o=t.style,"string"==typeof n)o.cssText=n;else {if("string"==typeof r&&(o.cssText="",r=null),r)for(u in r)n&&u in n||jr(o,u,"");if(n)for(c in n)r&&n[c]===r[c]||jr(o,c,n[c]);}}else "o"===e[0]&&"n"===e[1]?(s=e!==(e=e.replace(/Capture$/,"")),a=e.toLowerCase(),e=(a in t?a:e).slice(2),n?(r||t.addEventListener(e,Ur,s),(t.l||(t.l={}))[e]=n):t.removeEventListener(e,Ur,s)):"list"!==e&&"tagName"!==e&&"form"!==e&&"type"!==e&&"size"!==e&&!i&&e in t?t[e]=null==n?"":n:"function"!=typeof n&&"dangerouslySetInnerHTML"!==e&&(e!==(e=e.replace(/^xlink:?/,""))?null==n||!1===n?t.removeAttributeNS("http://www.w3.org/1999/xlink",e.toLowerCase()):t.setAttributeNS("http://www.w3.org/1999/xlink",e.toLowerCase(),n):null==n||!1===n&&!/^ar/.test(e)?t.removeAttribute(e):t.setAttribute(e,n));}function Ur(t){this.l[t.type](mr.event?mr.event(t):t);}function Fr(t,e,n,r,i,o,s,a,u){var c,h,l,f,p,d,v,y,m,g,b,w=e.type;if(void 0!==e.constructor)return null;(c=mr.__b)&&c(e);try{t:if("function"==typeof w){if(y=e.props,m=(c=w.contextType)&&r[c.__c],g=c?m?m.props.value:c.__:r,n.__c?v=(h=e.__c=n.__c).__=h.__E:("prototype"in w&&w.prototype.render?e.__c=h=new w(y,g):(e.__c=h=new Dr(y,g),h.constructor=w,h.render=Wr),m&&m.sub(h),h.props=y,h.state||(h.state={}),h.context=g,h.__n=r,l=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=w.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=kr({},h.__s)),kr(h.__s,w.getDerivedStateFromProps(y,h.__s))),f=h.props,p=h.state,l)null==w.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else {if(null==w.getDerivedStateFromProps&&y!==f&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(y,g),!h.__e&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(y,h.__s,g)||e.__v===n.__v){for(h.props=y,h.state=h.__s,e.__v!==n.__v&&(h.__d=!1),h.__v=e,e.__e=n.__e,e.__k=n.__k,h.__h.length&&s.push(h),c=0;c<e.__k.length;c++)e.__k[c]&&(e.__k[c].__=e);break t;}null!=h.componentWillUpdate&&h.componentWillUpdate(y,h.__s,g),null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(f,p,d);});}h.context=g,h.props=y,h.state=h.__s,(c=mr.__r)&&c(e),h.__d=!1,h.__v=e,h.__P=t,c=h.render(h.props,h.state,h.context),null!=h.getChildContext&&(r=kr(kr({},r),h.getChildContext())),l||null==h.getSnapshotBeforeUpdate||(d=h.getSnapshotBeforeUpdate(f,p)),b=null!=c&&c.type==Or&&null==c.key?c.props.children:c,Mr(t,Array.isArray(b)?b:[b],e,n,r,i,o,s,a,u),h.base=e.__e,h.__h.length&&s.push(h),v&&(h.__E=h.__=null),h.__e=!1;}else null==o&&e.__v===n.__v?(e.__k=n.__k,e.__e=n.__e):e.__e=Br(n.__e,e,n,r,i,o,s,u);(c=mr.diffed)&&c(e);}catch(t){e.__v=null,mr.__e(t,e,n);}return e.__e;}function qr(t,e){mr.__c&&mr.__c(e,t),t.some(function(e){try{t=e.__h,e.__h=[],t.some(function(t){t.call(e);});}catch(t){mr.__e(t,e.__v);}});}function Br(t,e,n,r,i,o,s,a){var u,c,h,l,f,p=n.props,d=e.props;if(i="svg"===e.type||i,null!=o)for(u=0;u<o.length;u++)if(null!=(c=o[u])&&((null===e.type?3===c.nodeType:c.localName===e.type)||t==c)){t=c,o[u]=null;break;}if(null==t){if(null===e.type)return document.createTextNode(d);t=i?document.createElementNS("http://www.w3.org/2000/svg",e.type):document.createElement(e.type,d.is&&{is:d.is}),o=null,a=!1;}if(null===e.type)p!==d&&t.data!=d&&(t.data=d);else {if(null!=o&&(o=Tr.slice.call(t.childNodes)),h=(p=n.props||Ir).dangerouslySetInnerHTML,l=d.dangerouslySetInnerHTML,!a){if(null!=o)for(p={},f=0;f<t.attributes.length;f++)p[t.attributes[f].name]=t.attributes[f].value;(l||h)&&(l&&h&&l.__html==h.__html||(t.innerHTML=l&&l.__html||""));}(function(t,e,n,r,i){var o;for(o in n)"children"===o||"key"===o||o in e||Vr(t,o,null,n[o],r);for(o in e)i&&"function"!=typeof e[o]||"children"===o||"key"===o||"value"===o||"checked"===o||n[o]===e[o]||Vr(t,o,e[o],n[o],r);})(t,d,p,i,a),l?e.__k=[]:(u=e.props.children,Mr(t,Array.isArray(u)?u:[u],e,n,r,"foreignObject"!==e.type&&i,o,s,Ir,a)),a||("value"in d&&void 0!==(u=d.value)&&u!==t.value&&Vr(t,"value",u,p.value,!1),"checked"in d&&void 0!==(u=d.checked)&&u!==t.checked&&Vr(t,"checked",u,p.checked,!1));}return t;}function zr(t,e,n){try{"function"==typeof t?t(e):t.current=e;}catch(t){mr.__e(t,n);}}function Gr(t,e,n){var r,i,o;if(mr.unmount&&mr.unmount(t),(r=t.ref)&&(r.current&&r.current!==t.__e||zr(r,null,e)),n||"function"==typeof t.type||(n=null!=(i=t.__e)),t.__e=t.__d=void 0,null!=(r=t.__c)){if(r.componentWillUnmount)try{r.componentWillUnmount();}catch(t){mr.__e(t,e);}r.base=r.__P=null;}if(r=t.__k)for(o=0;o<r.length;o++)r[o]&&Gr(r[o],e,n);null!=i&&Nr(i);}function Wr(t,e,n){return this.constructor(t,n);}mr={__e:function(t,e){for(var n,r;e=e.__;)if((n=e.__c)&&!n.__)try{if(n.constructor&&null!=n.constructor.getDerivedStateFromError&&(r=!0,n.setState(n.constructor.getDerivedStateFromError(t))),null!=n.componentDidCatch&&(r=!0,n.componentDidCatch(t)),r)return Pr(n.__E=n);}catch(e){t=e;}throw t;}},Dr.prototype.setState=function(t,e){var n;n=this.__s!==this.state?this.__s:this.__s=kr({},this.state),"function"==typeof t&&(t=t(n,this.props)),t&&kr(n,t),null!=t&&this.__v&&(e&&this.__h.push(e),Pr(this));},Dr.prototype.forceUpdate=function(t){this.__v&&(this.__e=!0,t&&this.__h.push(t),Pr(this));},Dr.prototype.render=Or,gr=[],br=0,wr="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Er=Ir;var Hr,Kr=(Hr=E)&&"object"==typeof Hr&&"default"in Hr?Hr.default:Hr;/**
	 * @license
	 * Copyright 2018 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */Kr.registerVersion("firebase","7.15.0","app");var Yr,Xr=Kr;!function(t){t[t.NeedLogin=0]="NeedLogin";}(Yr||(Yr={}));const Qr=new class{constructor(){this.latestTag=0,this._article="",this.user=null;}get comments(){return this.db.collection(this._article);}init(t){this._article=t.article,Xr.initializeApp(t.db),this.db=Xr.firestore();}resetLatestTag(){this.latestTag=0;}async addComment(t){await this.comments.add(t);}async getAllComments(){return (await this.comments.orderBy("timestamp","desc").get()).docs.map(t=>({...t.data(),id:t.id}));}async getComment(t){const e=await this.comments.doc(t).get();return {...e.data(),id:e.id};}async getMoreComments(){const t=this.comments.orderBy("timestamp","desc").limit(10),e=(await(this.latestTag?t.startAfter(this.latestTag):t).get()).docs.map(t=>({...t.data(),id:t.id}));return this.latestTag=e.length&&e[e.length-1].timestamp,e;}async updateComment(t,e){await this.comments.doc(t).update(e);}async updateCommentLike(t,e){await this.comments.doc(t).update({likes:{[this.user.id]:e}});}}();var Jr;!function(t){t.Google="Google",t.GitHub="GitHub",t.Anonymously="Anonymously";}(Jr||(Jr={}));async function $r(t=Jr.Anonymously,e=!1){if(e){const t=localStorage.getItem("blog.comment.login.user"),e=t?JSON.parse(t):null;return e&&e.name?e:null;}let n=null;switch(t){case Jr.Google:n=new Xr.auth.GoogleAuthProvider();break;case Jr.GitHub:n=new Xr.auth.GithubAuthProvider();break;default:n=null;}const r=n?await Xr.auth().signInWithPopup(n):await Xr.auth().signInAnonymously(),i=r.additionalUserInfo.profile,o={avatar:r.user.photoURL,email:r.user.email,name:r.user.displayName,id:r.user.uid,homePage:"GitHub"===t?i.html_url:null};return localStorage.setItem("blog.comment.login.user",JSON.stringify(o)),o;}var Zr=n(function(t,e){t.exports=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function e(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r;}function n(t){var n=0;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(t=function(t,n){if(t){if("string"==typeof t)return e(t,n);var r=Object.prototype.toString.call(t).slice(8,-1);return "Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?e(t,n):void 0;}}(t)))return function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]};};throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}return (n=t[Symbol.iterator]()).next.bind(n);}var r=function(t,e){return t(e={exports:{}},e.exports),e.exports;}(function(t){function e(){return {baseUrl:null,breaks:!1,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartLists:!1,smartypants:!1,tokenizer:null,walkTokens:null,xhtml:!1};}t.exports={defaults:{baseUrl:null,breaks:!1,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartLists:!1,smartypants:!1,tokenizer:null,walkTokens:null,xhtml:!1},getDefaults:e,changeDefaults:function(e){t.exports.defaults=e;}};}),i=(r.defaults,r.getDefaults,r.changeDefaults,/[&<>"']/),o=/[&<>"']/g,s=/[<>"']|&(?!#?\w+;)/,a=/[<>"']|&(?!#?\w+;)/g,u={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},c=function(t){return u[t];},h=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;function l(t){return t.replace(h,function(t,e){return "colon"===(e=e.toLowerCase())?":":"#"===e.charAt(0)?"x"===e.charAt(1)?String.fromCharCode(parseInt(e.substring(2),16)):String.fromCharCode(+e.substring(1)):"";});}var f=/(^|[^\[])\^/g,p=/[^\w:]/g,d=/^$|^[a-z][a-z0-9+.-]*:|^[?#]/i,v={},y=/^[^:]+:\/*[^/]*$/,m=/^([^:]+:)[\s\S]*$/,g=/^([^:]+:\/*[^/]*)[\s\S]*$/;function b(t,e){v[" "+t]||(y.test(t)?v[" "+t]=t+"/":v[" "+t]=w(t,"/",!0));var n=-1===(t=v[" "+t]).indexOf(":");return "//"===e.substring(0,2)?n?e:t.replace(m,"$1")+e:"/"===e.charAt(0)?n?e:t.replace(g,"$1")+e:t+e;}function w(t,e,n){var r=t.length;if(0===r)return "";for(var i=0;i<r;){var o=t.charAt(r-i-1);if(o!==e||n){if(o===e||!n)break;i++;}else i++;}return t.substr(0,r-i);}var _=function(t,e){if(e){if(i.test(t))return t.replace(o,c);}else if(s.test(t))return t.replace(a,c);return t;},E=l,I=function(t,e){t=t.source||t,e=e||"";var n={replace:function(e,r){return r=(r=r.source||r).replace(f,"$1"),t=t.replace(e,r),n;},getRegex:function(){return new RegExp(t,e);}};return n;},T=function(t,e,n){if(t){var r;try{r=decodeURIComponent(l(n)).replace(p,"").toLowerCase();}catch(t){return null;}if(0===r.indexOf("javascript:")||0===r.indexOf("vbscript:")||0===r.indexOf("data:"))return null;}e&&!d.test(n)&&(n=b(e,n));try{n=encodeURI(n).replace(/%25/g,"%");}catch(t){return null;}return n;},A={exec:function(){}},k=function(t){for(var e,n,r=1;r<arguments.length;r++)for(n in e=arguments[r])Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t;},N=function(t,e){var n=t.replace(/\|/g,function(t,e,n){for(var r=!1,i=e;--i>=0&&"\\"===n[i];)r=!r;return r?"|":" |";}).split(/ \|/),r=0;if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;r<n.length;r++)n[r]=n[r].trim().replace(/\\\|/g,"|");return n;},S=w,x=function(t,e){if(-1===t.indexOf(e[1]))return -1;for(var n=t.length,r=0,i=0;i<n;i++)if("\\"===t[i])i++;else if(t[i]===e[0])r++;else if(t[i]===e[1]&&--r<0)return i;return -1;},O=function(t){t&&t.sanitize&&!t.silent&&console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");},D=r.defaults,R=S,C=N,P=_,L=x;function M(t,e,n){var r=e.href,i=e.title?P(e.title):null;return "!"!==t[0].charAt(0)?{type:"link",raw:n,href:r,title:i,text:t[1]}:{type:"image",raw:n,text:P(t[1]),href:r,title:i};}var j=function(){function t(t){this.options=t||D;}var e=t.prototype;return e.space=function(t){var e=this.rules.block.newline.exec(t);if(e)return e[0].length>1?{type:"space",raw:e[0]}:{raw:"\n"};},e.code=function(t,e){var n=this.rules.block.code.exec(t);if(n){var r=e[e.length-1];if(r&&"paragraph"===r.type)return {raw:n[0],text:n[0].trimRight()};var i=n[0].replace(/^ {4}/gm,"");return {type:"code",raw:n[0],codeBlockStyle:"indented",text:this.options.pedantic?i:R(i,"\n")};}},e.fences=function(t){var e=this.rules.block.fences.exec(t);if(e){var n=e[0],r=function(t,e){var n=t.match(/^(\s+)(?:```)/);if(null===n)return e;var r=n[1];return e.split("\n").map(function(t){var e=t.match(/^\s+/);return null===e?t:e[0].length>=r.length?t.slice(r.length):t;}).join("\n");}(n,e[3]||"");return {type:"code",raw:n,lang:e[2]?e[2].trim():e[2],text:r};}},e.heading=function(t){var e=this.rules.block.heading.exec(t);if(e)return {type:"heading",raw:e[0],depth:e[1].length,text:e[2]};},e.nptable=function(t){var e=this.rules.block.nptable.exec(t);if(e){var n={type:"table",header:C(e[1].replace(/^ *| *\| *$/g,"")),align:e[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:e[3]?e[3].replace(/\n$/,"").split("\n"):[],raw:e[0]};if(n.header.length===n.align.length){var r,i=n.align.length;for(r=0;r<i;r++)/^ *-+: *$/.test(n.align[r])?n.align[r]="right":/^ *:-+: *$/.test(n.align[r])?n.align[r]="center":/^ *:-+ *$/.test(n.align[r])?n.align[r]="left":n.align[r]=null;for(i=n.cells.length,r=0;r<i;r++)n.cells[r]=C(n.cells[r],n.header.length);return n;}}},e.hr=function(t){var e=this.rules.block.hr.exec(t);if(e)return {type:"hr",raw:e[0]};},e.blockquote=function(t){var e=this.rules.block.blockquote.exec(t);if(e){var n=e[0].replace(/^ *> ?/gm,"");return {type:"blockquote",raw:e[0],text:n};}},e.list=function(t){var e=this.rules.block.list.exec(t);if(e){for(var n,r,i,o,s,a,u,c=e[0],h=e[2],l=h.length>1,f={type:"list",raw:c,ordered:l,start:l?+h:"",loose:!1,items:[]},p=e[0].match(this.rules.block.item),d=!1,v=p.length,y=0;y<v;y++)c=n=p[y],r=n.length,~(n=n.replace(/^ *([*+-]|\d+\.) */,"")).indexOf("\n ")&&(r-=n.length,n=this.options.pedantic?n.replace(/^ {1,4}/gm,""):n.replace(new RegExp("^ {1,"+r+"}","gm"),"")),y!==v-1&&(i=this.rules.block.bullet.exec(p[y+1])[0],(h.length>1?1===i.length:i.length>1||this.options.smartLists&&i!==h)&&(o=p.slice(y+1).join("\n"),f.raw=f.raw.substring(0,f.raw.length-o.length),y=v-1)),s=d||/\n\n(?!\s*$)/.test(n),y!==v-1&&(d="\n"===n.charAt(n.length-1),s||(s=d)),s&&(f.loose=!0),u=void 0,(a=/^\[[ xX]\] /.test(n))&&(u=" "!==n[1],n=n.replace(/^\[[ xX]\] +/,"")),f.items.push({type:"list_item",raw:c,task:a,checked:u,loose:s,text:n});return f;}},e.html=function(t){var e=this.rules.block.html.exec(t);if(e)return {type:this.options.sanitize?"paragraph":"html",raw:e[0],pre:!this.options.sanitizer&&("pre"===e[1]||"script"===e[1]||"style"===e[1]),text:this.options.sanitize?this.options.sanitizer?this.options.sanitizer(e[0]):P(e[0]):e[0]};},e.def=function(t){var e=this.rules.block.def.exec(t);if(e)return e[3]&&(e[3]=e[3].substring(1,e[3].length-1)),{tag:e[1].toLowerCase().replace(/\s+/g," "),raw:e[0],href:e[2],title:e[3]};},e.table=function(t){var e=this.rules.block.table.exec(t);if(e){var n={type:"table",header:C(e[1].replace(/^ *| *\| *$/g,"")),align:e[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:e[3]?e[3].replace(/\n$/,"").split("\n"):[]};if(n.header.length===n.align.length){n.raw=e[0];var r,i=n.align.length;for(r=0;r<i;r++)/^ *-+: *$/.test(n.align[r])?n.align[r]="right":/^ *:-+: *$/.test(n.align[r])?n.align[r]="center":/^ *:-+ *$/.test(n.align[r])?n.align[r]="left":n.align[r]=null;for(i=n.cells.length,r=0;r<i;r++)n.cells[r]=C(n.cells[r].replace(/^ *\| *| *\| *$/g,""),n.header.length);return n;}}},e.lheading=function(t){var e=this.rules.block.lheading.exec(t);if(e)return {type:"heading",raw:e[0],depth:"="===e[2].charAt(0)?1:2,text:e[1]};},e.paragraph=function(t){var e=this.rules.block.paragraph.exec(t);if(e)return {type:"paragraph",raw:e[0],text:"\n"===e[1].charAt(e[1].length-1)?e[1].slice(0,-1):e[1]};},e.text=function(t,e){var n=this.rules.block.text.exec(t);if(n){var r=e[e.length-1];return r&&"text"===r.type?{raw:n[0],text:n[0]}:{type:"text",raw:n[0],text:n[0]};}},e.escape=function(t){var e=this.rules.inline.escape.exec(t);if(e)return {type:"escape",raw:e[0],text:P(e[1])};},e.tag=function(t,e,n){var r=this.rules.inline.tag.exec(t);if(r)return !e&&/^<a /i.test(r[0])?e=!0:e&&/^<\/a>/i.test(r[0])&&(e=!1),!n&&/^<(pre|code|kbd|script)(\s|>)/i.test(r[0])?n=!0:n&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(r[0])&&(n=!1),{type:this.options.sanitize?"text":"html",raw:r[0],inLink:e,inRawBlock:n,text:this.options.sanitize?this.options.sanitizer?this.options.sanitizer(r[0]):P(r[0]):r[0]};},e.link=function(t){var e=this.rules.inline.link.exec(t);if(e){var n=L(e[2],"()");if(n>-1){var r=(0===e[0].indexOf("!")?5:4)+e[1].length+n;e[2]=e[2].substring(0,n),e[0]=e[0].substring(0,r).trim(),e[3]="";}var i=e[2],o="";if(this.options.pedantic){var s=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(i);s?(i=s[1],o=s[3]):o="";}else o=e[3]?e[3].slice(1,-1):"";return M(e,{href:(i=i.trim().replace(/^<([\s\S]*)>$/,"$1"))?i.replace(this.rules.inline._escapes,"$1"):i,title:o?o.replace(this.rules.inline._escapes,"$1"):o},e[0]);}},e.reflink=function(t,e){var n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){var r=(n[2]||n[1]).replace(/\s+/g," ");if(!(r=e[r.toLowerCase()])||!r.href){var i=n[0].charAt(0);return {type:"text",raw:i,text:i};}return M(n,r,n[0]);}},e.strong=function(t){var e=this.rules.inline.strong.exec(t);if(e)return {type:"strong",raw:e[0],text:e[4]||e[3]||e[2]||e[1]};},e.em=function(t){var e=this.rules.inline.em.exec(t);if(e)return {type:"em",raw:e[0],text:e[6]||e[5]||e[4]||e[3]||e[2]||e[1]};},e.codespan=function(t){var e=this.rules.inline.code.exec(t);if(e){var n=e[2].replace(/\n/g," "),r=/[^ ]/.test(n),i=n.startsWith(" ")&&n.endsWith(" ");return r&&i&&(n=n.substring(1,n.length-1)),n=P(n,!0),{type:"codespan",raw:e[0],text:n};}},e.br=function(t){var e=this.rules.inline.br.exec(t);if(e)return {type:"br",raw:e[0]};},e.del=function(t){var e=this.rules.inline.del.exec(t);if(e)return {type:"del",raw:e[0],text:e[1]};},e.autolink=function(t,e){var n,r,i=this.rules.inline.autolink.exec(t);if(i)return r="@"===i[2]?"mailto:"+(n=P(this.options.mangle?e(i[1]):i[1])):n=P(i[1]),{type:"link",raw:i[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]};},e.url=function(t,e){var n;if(n=this.rules.inline.url.exec(t)){var r,i;if("@"===n[2])i="mailto:"+(r=P(this.options.mangle?e(n[0]):n[0]));else {var o;do{o=n[0],n[0]=this.rules.inline._backpedal.exec(n[0])[0];}while(o!==n[0]);r=P(n[0]),i="www."===n[1]?"http://"+r:r;}return {type:"link",raw:n[0],text:r,href:i,tokens:[{type:"text",raw:r,text:r}]};}},e.inlineText=function(t,e,n){var r,i=this.rules.inline.text.exec(t);if(i)return r=e?this.options.sanitize?this.options.sanitizer?this.options.sanitizer(i[0]):P(i[0]):i[0]:P(this.options.smartypants?n(i[0]):i[0]),{type:"text",raw:i[0],text:r};},t;}(),V=A,U=I,F=k,q={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:/^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,hr:/^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,heading:/^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,blockquote:/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,list:/^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:"^ {0,3}(?:<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?\\?>\\n*|<![A-Z][\\s\\S]*?>\\n*|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$))",def:/^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,nptable:V,table:V,lheading:/^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,_paragraph:/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,text:/^[^\n]+/,_label:/(?!\s*\])(?:\\[\[\]]|[^\[\]])+/,_title:/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/};q.def=U(q.def).replace("label",q._label).replace("title",q._title).getRegex(),q.bullet=/(?:[*+-]|\d{1,9}\.)/,q.item=/^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/,q.item=U(q.item,"gm").replace(/bull/g,q.bullet).getRegex(),q.list=U(q.list).replace(/bull/g,q.bullet).replace("hr","\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def","\\n+(?="+q.def.source+")").getRegex(),q._tag="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",q._comment=/<!--(?!-?>)[\s\S]*?-->/,q.html=U(q.html,"i").replace("comment",q._comment).replace("tag",q._tag).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),q.paragraph=U(q._paragraph).replace("hr",q.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag",q._tag).getRegex(),q.blockquote=U(q.blockquote).replace("paragraph",q.paragraph).getRegex(),q.normal=F({},q),q.gfm=F({},q.normal,{nptable:"^ *([^|\\n ].*\\|.*)\\n *([-:]+ *\\|[-| :]*)(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)",table:"^ *\\|(.+)\\n *\\|?( *[-:]+[-| :]*)(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"}),q.gfm.nptable=U(q.gfm.nptable).replace("hr",q.hr).replace("heading"," {0,3}#{1,6} ").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag",q._tag).getRegex(),q.gfm.table=U(q.gfm.table).replace("hr",q.hr).replace("heading"," {0,3}#{1,6} ").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag",q._tag).getRegex(),q.pedantic=F({},q.normal,{html:U("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment",q._comment).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,fences:V,paragraph:U(q.normal._paragraph).replace("hr",q.hr).replace("heading"," *#{1,6} *[^\n]").replace("lheading",q.lheading).replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").getRegex()});var B={escape:/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,autolink:/^<(scheme:[^\s\x00-\x1f<>]*|email)>/,url:V,tag:"^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",link:/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,reflink:/^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,nolink:/^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,strong:/^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,em:/^_([^\s_])_(?!_)|^_([^\s_<][\s\S]*?[^\s_])_(?!_|[^\s,punctuation])|^_([^\s_<][\s\S]*?[^\s])_(?!_|[^\s,punctuation])|^\*([^\s*<\[])\*(?!\*)|^\*([^\s<"][\s\S]*?[^\s\[\*])\*(?![\]`punctuation])|^\*([^\s*"<\[][\s\S]*[^\s])\*(?!\*)/,code:/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,br:/^( {2,}|\\)\n(?!\s*$)/,del:V,text:/^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/,_punctuation:"!\"#$%&'()*+\\-./:;<=>?@\\[^_{|}~"};B.em=U(B.em).replace(/punctuation/g,B._punctuation).getRegex(),B._escapes=/\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g,B._scheme=/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/,B._email=/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,B.autolink=U(B.autolink).replace("scheme",B._scheme).replace("email",B._email).getRegex(),B._attribute=/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/,B.tag=U(B.tag).replace("comment",q._comment).replace("attribute",B._attribute).getRegex(),B._label=/(?:\[[^\[\]]*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,B._href=/<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/,B._title=/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/,B.link=U(B.link).replace("label",B._label).replace("href",B._href).replace("title",B._title).getRegex(),B.reflink=U(B.reflink).replace("label",B._label).getRegex(),B.normal=F({},B),B.pedantic=F({},B.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,link:U(/^!?\[(label)\]\((.*?)\)/).replace("label",B._label).getRegex(),reflink:U(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",B._label).getRegex()}),B.gfm=F({},B.normal,{escape:U(B.escape).replace("])","~|])").getRegex(),_extended_email:/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,url:/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,_backpedal:/(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,del:/^~+(?=\S)([\s\S]*?\S)~+/,text:/^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/}),B.gfm.url=U(B.gfm.url,"i").replace("email",B.gfm._extended_email).getRegex(),B.breaks=F({},B.gfm,{br:U(B.br).replace("{2,}","*").getRegex(),text:U(B.gfm.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()});var z={block:q,inline:B},G=r.defaults,W=z.block,H=z.inline;function K(t){return t.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…");}function Y(t){var e,n,r="",i=t.length;for(e=0;e<i;e++)n=t.charCodeAt(e),Math.random()>.5&&(n="x"+n.toString(16)),r+="&#"+n+";";return r;}var X=function(){function e(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||G,this.options.tokenizer=this.options.tokenizer||new j(),this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options;var e={block:W.normal,inline:H.normal};this.options.pedantic?(e.block=W.pedantic,e.inline=H.pedantic):this.options.gfm&&(e.block=W.gfm,this.options.breaks?e.inline=H.breaks:e.inline=H.gfm),this.tokenizer.rules=e;}e.lex=function(t,n){return new e(n).lex(t);};var n,r,i,o=e.prototype;return o.lex=function(t){return t=t.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    "),this.blockTokens(t,this.tokens,!0),this.inline(this.tokens),this.tokens;},o.blockTokens=function(t,e,n){var r,i,o,s;for(void 0===e&&(e=[]),void 0===n&&(n=!0),t=t.replace(/^ +$/gm,"");t;)if(r=this.tokenizer.space(t))t=t.substring(r.raw.length),r.type&&e.push(r);else if(r=this.tokenizer.code(t,e))t=t.substring(r.raw.length),r.type?e.push(r):((s=e[e.length-1]).raw+="\n"+r.raw,s.text+="\n"+r.text);else if(r=this.tokenizer.fences(t))t=t.substring(r.raw.length),e.push(r);else if(r=this.tokenizer.heading(t))t=t.substring(r.raw.length),e.push(r);else if(r=this.tokenizer.nptable(t))t=t.substring(r.raw.length),e.push(r);else if(r=this.tokenizer.hr(t))t=t.substring(r.raw.length),e.push(r);else if(r=this.tokenizer.blockquote(t))t=t.substring(r.raw.length),r.tokens=this.blockTokens(r.text,[],n),e.push(r);else if(r=this.tokenizer.list(t)){for(t=t.substring(r.raw.length),o=r.items.length,i=0;i<o;i++)r.items[i].tokens=this.blockTokens(r.items[i].text,[],!1);e.push(r);}else if(r=this.tokenizer.html(t))t=t.substring(r.raw.length),e.push(r);else if(n&&(r=this.tokenizer.def(t)))t=t.substring(r.raw.length),this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title});else if(r=this.tokenizer.table(t))t=t.substring(r.raw.length),e.push(r);else if(r=this.tokenizer.lheading(t))t=t.substring(r.raw.length),e.push(r);else if(n&&(r=this.tokenizer.paragraph(t)))t=t.substring(r.raw.length),e.push(r);else if(r=this.tokenizer.text(t,e))t=t.substring(r.raw.length),r.type?e.push(r):((s=e[e.length-1]).raw+="\n"+r.raw,s.text+="\n"+r.text);else if(t){var a="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(a);break;}throw new Error(a);}return e;},o.inline=function(t){var e,n,r,i,o,s,a=t.length;for(e=0;e<a;e++)switch((s=t[e]).type){case"paragraph":case"text":case"heading":s.tokens=[],this.inlineTokens(s.text,s.tokens);break;case"table":for(s.tokens={header:[],cells:[]},i=s.header.length,n=0;n<i;n++)s.tokens.header[n]=[],this.inlineTokens(s.header[n],s.tokens.header[n]);for(i=s.cells.length,n=0;n<i;n++)for(o=s.cells[n],s.tokens.cells[n]=[],r=0;r<o.length;r++)s.tokens.cells[n][r]=[],this.inlineTokens(o[r],s.tokens.cells[n][r]);break;case"blockquote":this.inline(s.tokens);break;case"list":for(i=s.items.length,n=0;n<i;n++)this.inline(s.items[n].tokens);}return t;},o.inlineTokens=function(t,e,n,r){var i;for(void 0===e&&(e=[]),void 0===n&&(n=!1),void 0===r&&(r=!1);t;)if(i=this.tokenizer.escape(t))t=t.substring(i.raw.length),e.push(i);else if(i=this.tokenizer.tag(t,n,r))t=t.substring(i.raw.length),n=i.inLink,r=i.inRawBlock,e.push(i);else if(i=this.tokenizer.link(t))t=t.substring(i.raw.length),"link"===i.type&&(i.tokens=this.inlineTokens(i.text,[],!0,r)),e.push(i);else if(i=this.tokenizer.reflink(t,this.tokens.links))t=t.substring(i.raw.length),"link"===i.type&&(i.tokens=this.inlineTokens(i.text,[],!0,r)),e.push(i);else if(i=this.tokenizer.strong(t))t=t.substring(i.raw.length),i.tokens=this.inlineTokens(i.text,[],n,r),e.push(i);else if(i=this.tokenizer.em(t))t=t.substring(i.raw.length),i.tokens=this.inlineTokens(i.text,[],n,r),e.push(i);else if(i=this.tokenizer.codespan(t))t=t.substring(i.raw.length),e.push(i);else if(i=this.tokenizer.br(t))t=t.substring(i.raw.length),e.push(i);else if(i=this.tokenizer.del(t))t=t.substring(i.raw.length),i.tokens=this.inlineTokens(i.text,[],n,r),e.push(i);else if(i=this.tokenizer.autolink(t,Y))t=t.substring(i.raw.length),e.push(i);else if(n||!(i=this.tokenizer.url(t,Y))){if(i=this.tokenizer.inlineText(t,r,K))t=t.substring(i.raw.length),e.push(i);else if(t){var o="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(o);break;}throw new Error(o);}}else t=t.substring(i.raw.length),e.push(i);return e;},n=e,i=[{key:"rules",get:function(){return {block:W,inline:H};}}],(r=null)&&t(n.prototype,r),i&&t(n,i),e;}(),Q=r.defaults,J=T,$=_,Z=function(){function t(t){this.options=t||Q;}var e=t.prototype;return e.code=function(t,e,n){var r=(e||"").match(/\S*/)[0];if(this.options.highlight){var i=this.options.highlight(t,r);null!=i&&i!==t&&(n=!0,t=i);}return r?'<pre><code class="'+this.options.langPrefix+$(r,!0)+'">'+(n?t:$(t,!0))+"</code></pre>\n":"<pre><code>"+(n?t:$(t,!0))+"</code></pre>\n";},e.blockquote=function(t){return "<blockquote>\n"+t+"</blockquote>\n";},e.html=function(t){return t;},e.heading=function(t,e,n,r){return this.options.headerIds?"<h"+e+' id="'+this.options.headerPrefix+r.slug(n)+'">'+t+"</h"+e+">\n":"<h"+e+">"+t+"</h"+e+">\n";},e.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n";},e.list=function(t,e,n){var r=e?"ol":"ul";return "<"+r+(e&&1!==n?' start="'+n+'"':"")+">\n"+t+"</"+r+">\n";},e.listitem=function(t){return "<li>"+t+"</li>\n";},e.checkbox=function(t){return "<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"'+(this.options.xhtml?" /":"")+"> ";},e.paragraph=function(t){return "<p>"+t+"</p>\n";},e.table=function(t,e){return e&&(e="<tbody>"+e+"</tbody>"),"<table>\n<thead>\n"+t+"</thead>\n"+e+"</table>\n";},e.tablerow=function(t){return "<tr>\n"+t+"</tr>\n";},e.tablecell=function(t,e){var n=e.header?"th":"td";return (e.align?"<"+n+' align="'+e.align+'">':"<"+n+">")+t+"</"+n+">\n";},e.strong=function(t){return "<strong>"+t+"</strong>";},e.em=function(t){return "<em>"+t+"</em>";},e.codespan=function(t){return "<code>"+t+"</code>";},e.br=function(){return this.options.xhtml?"<br/>":"<br>";},e.del=function(t){return "<del>"+t+"</del>";},e.link=function(t,e,n){if(null===(t=J(this.options.sanitize,this.options.baseUrl,t)))return n;var r='<a href="'+$(t)+'"';return e&&(r+=' title="'+e+'"'),r+=">"+n+"</a>";},e.image=function(t,e,n){if(null===(t=J(this.options.sanitize,this.options.baseUrl,t)))return n;var r='<img src="'+t+'" alt="'+n+'"';return e&&(r+=' title="'+e+'"'),r+=this.options.xhtml?"/>":">";},e.text=function(t){return t;},t;}(),tt=function(){function t(){}var e=t.prototype;return e.strong=function(t){return t;},e.em=function(t){return t;},e.codespan=function(t){return t;},e.del=function(t){return t;},e.html=function(t){return t;},e.text=function(t){return t;},e.link=function(t,e,n){return ""+n;},e.image=function(t,e,n){return ""+n;},e.br=function(){return "";},t;}(),et=function(){function t(){this.seen={};}return t.prototype.slug=function(t){var e=t.toLowerCase().trim().replace(/<[!\/a-z].*?>/gi,"").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,"").replace(/\s/g,"-");if(this.seen.hasOwnProperty(e)){var n=e;do{this.seen[n]++,e=n+"-"+this.seen[n];}while(this.seen.hasOwnProperty(e));}return this.seen[e]=0,e;},t;}(),nt=r.defaults,rt=E,it=function(){function t(t){this.options=t||nt,this.options.renderer=this.options.renderer||new Z(),this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new tt(),this.slugger=new et();}t.parse=function(e,n){return new t(n).parse(e);};var e=t.prototype;return e.parse=function(t,e){void 0===e&&(e=!0);var n,r,i,o,s,a,u,c,h,l,f,p,d,v,y,m,g,b,w="",_=t.length;for(n=0;n<_;n++)switch((l=t[n]).type){case"space":continue;case"hr":w+=this.renderer.hr();continue;case"heading":w+=this.renderer.heading(this.parseInline(l.tokens),l.depth,rt(this.parseInline(l.tokens,this.textRenderer)),this.slugger);continue;case"code":w+=this.renderer.code(l.text,l.lang,l.escaped);continue;case"table":for(c="",u="",o=l.header.length,r=0;r<o;r++)u+=this.renderer.tablecell(this.parseInline(l.tokens.header[r]),{header:!0,align:l.align[r]});for(c+=this.renderer.tablerow(u),h="",o=l.cells.length,r=0;r<o;r++){for(u="",s=(a=l.tokens.cells[r]).length,i=0;i<s;i++)u+=this.renderer.tablecell(this.parseInline(a[i]),{header:!1,align:l.align[i]});h+=this.renderer.tablerow(u);}w+=this.renderer.table(c,h);continue;case"blockquote":h=this.parse(l.tokens),w+=this.renderer.blockquote(h);continue;case"list":for(f=l.ordered,p=l.start,d=l.loose,o=l.items.length,h="",r=0;r<o;r++)m=(y=l.items[r]).checked,g=y.task,v="",y.task&&(b=this.renderer.checkbox(m),d?y.tokens.length>0&&"text"===y.tokens[0].type?(y.tokens[0].text=b+" "+y.tokens[0].text,y.tokens[0].tokens&&y.tokens[0].tokens.length>0&&"text"===y.tokens[0].tokens[0].type&&(y.tokens[0].tokens[0].text=b+" "+y.tokens[0].tokens[0].text)):y.tokens.unshift({type:"text",text:b}):v+=b),v+=this.parse(y.tokens,d),h+=this.renderer.listitem(v,g,m);w+=this.renderer.list(h,f,p);continue;case"html":w+=this.renderer.html(l.text);continue;case"paragraph":w+=this.renderer.paragraph(this.parseInline(l.tokens));continue;case"text":for(h=l.tokens?this.parseInline(l.tokens):l.text;n+1<_&&"text"===t[n+1].type;)h+="\n"+((l=t[++n]).tokens?this.parseInline(l.tokens):l.text);w+=e?this.renderer.paragraph(h):h;continue;default:var E='Token with "'+l.type+'" type was not found.';if(this.options.silent)return void console.error(E);throw new Error(E);}return w;},e.parseInline=function(t,e){e=e||this.renderer;var n,r,i="",o=t.length;for(n=0;n<o;n++)switch((r=t[n]).type){case"escape":i+=e.text(r.text);break;case"html":i+=e.html(r.text);break;case"link":i+=e.link(r.href,r.title,this.parseInline(r.tokens,e));break;case"image":i+=e.image(r.href,r.title,r.text);break;case"strong":i+=e.strong(this.parseInline(r.tokens,e));break;case"em":i+=e.em(this.parseInline(r.tokens,e));break;case"codespan":i+=e.codespan(r.text);break;case"br":i+=e.br();break;case"del":i+=e.del(this.parseInline(r.tokens,e));break;case"text":i+=e.text(r.text);break;default:var s='Token with "'+r.type+'" type was not found.';if(this.options.silent)return void console.error(s);throw new Error(s);}return i;},t;}(),ot=k,st=O,at=_,ut=r.getDefaults,ct=r.changeDefaults,ht=r.defaults;function lt(t,e,n){if(null==t)throw new Error("marked(): input parameter is undefined or null");if("string"!=typeof t)throw new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected");if("function"==typeof e&&(n=e,e=null),e=ot({},lt.defaults,e||{}),st(e),n){var r,i=e.highlight;try{r=X.lex(t,e);}catch(t){return n(t);}var o=function(t){var o;if(!t)try{o=it.parse(r,e);}catch(e){t=e;}return e.highlight=i,t?n(t):n(null,o);};if(!i||i.length<3)return o();if(delete e.highlight,!r.length)return o();var s=0;return lt.walkTokens(r,function(t){"code"===t.type&&(s++,i(t.text,t.lang,function(e,n){if(e)return o(e);null!=n&&n!==t.text&&(t.text=n,t.escaped=!0),0==--s&&o();}));}),void(0===s&&o());}try{var a=X.lex(t,e);return e.walkTokens&&lt.walkTokens(a,e.walkTokens),it.parse(a,e);}catch(t){if(t.message+="\nPlease report this to https://github.com/markedjs/marked.",e.silent)return "<p>An error occurred:</p><pre>"+at(t.message+"",!0)+"</pre>";throw t;}}return lt.options=lt.setOptions=function(t){return ot(lt.defaults,t),ct(lt.defaults),lt;},lt.getDefaults=ut,lt.defaults=ht,lt.use=function(t){var e=ot({},t);if(t.renderer&&function(){var n=lt.defaults.renderer||new Z(),r=function(e){var r=n[e];n[e]=function(){for(var i=arguments.length,o=new Array(i),s=0;s<i;s++)o[s]=arguments[s];var a=t.renderer[e].apply(n,o);return !1===a&&(a=r.apply(n,o)),a;};};for(var i in t.renderer)r(i);e.renderer=n;}(),t.tokenizer&&function(){var n=lt.defaults.tokenizer||new j(),r=function(e){var r=n[e];n[e]=function(){for(var i=arguments.length,o=new Array(i),s=0;s<i;s++)o[s]=arguments[s];var a=t.tokenizer[e].apply(n,o);return !1===a&&(a=r.apply(n,o)),a;};};for(var i in t.tokenizer)r(i);e.tokenizer=n;}(),t.walkTokens){var n=lt.defaults.walkTokens;e.walkTokens=function(e){t.walkTokens(e),n&&n(e);};}lt.setOptions(e);},lt.walkTokens=function(t,e){for(var r,i=n(t);!(r=i()).done;){var o=r.value;switch(e(o),o.type){case"table":for(var s,a=n(o.tokens.header);!(s=a()).done;){var u=s.value;lt.walkTokens(u,e);}for(var c,h=n(o.tokens.cells);!(c=h()).done;)for(var l,f=n(c.value);!(l=f()).done;){var p=l.value;lt.walkTokens(p,e);}break;case"list":lt.walkTokens(o.items,e);break;default:o.tokens&&lt.walkTokens(o.tokens,e);}}},lt.Parser=it,lt.parser=it.parse,lt.Renderer=Z,lt.TextRenderer=tt,lt.Lexer=X,lt.lexer=X.lex,lt.Tokenizer=j,lt.Slugger=et,lt.parse=lt,lt;}();}),ti=n(function(t,e){/*! @license DOMPurify | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.0.8/LICENSE */t.exports=function(){var t=Object.hasOwnProperty,e=Object.setPrototypeOf,n=Object.isFrozen,r=Object.keys,i=Object.freeze,o=Object.seal,s="undefined"!=typeof Reflect&&Reflect,a=s.apply,u=s.construct;a||(a=function(t,e,n){return t.apply(e,n);}),i||(i=function(t){return t;}),o||(o=function(t){return t;}),u||(u=function(t,e){return new(Function.prototype.bind.apply(t,[null].concat(function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n;}return Array.from(t);}(e))))();});var c=I(Array.prototype.forEach),h=I(Array.prototype.indexOf),l=I(Array.prototype.join),f=I(Array.prototype.pop),p=I(Array.prototype.push),d=I(Array.prototype.slice),v=I(String.prototype.toLowerCase),y=I(String.prototype.match),m=I(String.prototype.replace),g=I(String.prototype.indexOf),b=I(String.prototype.trim),w=I(RegExp.prototype.test),_=T(RegExp),E=T(TypeError);function I(t){return function(e){for(var n=arguments.length,r=Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return a(t,e,r);};}function T(t){return function(){for(var e=arguments.length,n=Array(e),r=0;r<e;r++)n[r]=arguments[r];return u(t,n);};}function A(t,r){e&&e(t,null);for(var i=r.length;i--;){var o=r[i];if("string"==typeof o){var s=v(o);s!==o&&(n(r)||(r[i]=s),o=s);}t[o]=!0;}return t;}function k(e){var n={},r=void 0;for(r in e)a(t,e,[r])&&(n[r]=e[r]);return n;}var N=i(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),S=i(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","audio","canvas","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","video","view","vkern"]),x=i(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),O=i(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover"]),D=i(["#text"]),R=i(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","xmlns"]),C=i(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","tabindex","targetx","targety","transform","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),P=i(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),L=i(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),M=o(/\{\{[\s\S]*|[\s\S]*\}\}/gm),j=o(/<%[\s\S]*|[\s\S]*%>/gm),V=o(/^data-[\-\w.\u00B7-\uFFFF]/),U=o(/^aria-[\-\w]+$/),F=o(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),q=o(/^(?:\w+script|data):/i),B=o(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g),z="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t;}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t;};function G(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n;}return Array.from(t);}var W=function(){return "undefined"==typeof window?null:window;},H=function(t,e){if("object"!==(void 0===t?"undefined":z(t))||"function"!=typeof t.createPolicy)return null;var n=null;e.currentScript&&e.currentScript.hasAttribute("data-tt-policy-suffix")&&(n=e.currentScript.getAttribute("data-tt-policy-suffix"));var r="dompurify"+(n?"#"+n:"");try{return t.createPolicy(r,{createHTML:function(t){return t;}});}catch(t){return console.warn("TrustedTypes policy "+r+" could not be created."),null;}};return function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:W(),n=function(e){return t(e);};if(n.version="2.0.11",n.removed=[],!e||!e.document||9!==e.document.nodeType)return n.isSupported=!1,n;var o=e.document,s=!1,a=e.document,u=e.DocumentFragment,I=e.HTMLTemplateElement,T=e.Node,K=e.NodeFilter,Y=e.NamedNodeMap,X=void 0===Y?e.NamedNodeMap||e.MozNamedAttrMap:Y,Q=e.Text,J=e.Comment,$=e.DOMParser,Z=e.trustedTypes;if("function"==typeof I){var tt=a.createElement("template");tt.content&&tt.content.ownerDocument&&(a=tt.content.ownerDocument);}var et=H(Z,o),nt=et?et.createHTML(""):"",rt=a,it=rt.implementation,ot=rt.createNodeIterator,st=rt.getElementsByTagName,at=rt.createDocumentFragment,ut=o.importNode,ct={};n.isSupported=it&&void 0!==it.createHTMLDocument&&9!==a.documentMode;var ht=M,lt=j,ft=V,pt=U,dt=q,vt=B,yt=F,mt=null,gt=A({},[].concat(G(N),G(S),G(x),G(O),G(D))),bt=null,wt=A({},[].concat(G(R),G(C),G(P),G(L))),_t=null,Et=null,It=!0,Tt=!0,At=!1,kt=!1,Nt=!1,St=!1,xt=!1,Ot=!1,Dt=!1,Rt=!1,Ct=!1,Pt=!1,Lt=!0,Mt=!0,jt=!1,Vt={},Ut=A({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","plaintext","script","style","svg","template","thead","title","video","xmp"]),Ft=null,qt=A({},["audio","video","img","source","image","track"]),Bt=null,zt=A({},["alt","class","for","id","label","name","pattern","placeholder","summary","title","value","style","xmlns"]),Gt=null,Wt=a.createElement("form"),Ht=function(t){Gt&&Gt===t||(t&&"object"===(void 0===t?"undefined":z(t))||(t={}),mt="ALLOWED_TAGS"in t?A({},t.ALLOWED_TAGS):gt,bt="ALLOWED_ATTR"in t?A({},t.ALLOWED_ATTR):wt,Bt="ADD_URI_SAFE_ATTR"in t?A(k(zt),t.ADD_URI_SAFE_ATTR):zt,Ft="ADD_DATA_URI_TAGS"in t?A(k(qt),t.ADD_DATA_URI_TAGS):qt,_t="FORBID_TAGS"in t?A({},t.FORBID_TAGS):{},Et="FORBID_ATTR"in t?A({},t.FORBID_ATTR):{},Vt="USE_PROFILES"in t&&t.USE_PROFILES,It=!1!==t.ALLOW_ARIA_ATTR,Tt=!1!==t.ALLOW_DATA_ATTR,At=t.ALLOW_UNKNOWN_PROTOCOLS||!1,kt=t.SAFE_FOR_JQUERY||!1,Nt=t.SAFE_FOR_TEMPLATES||!1,St=t.WHOLE_DOCUMENT||!1,Dt=t.RETURN_DOM||!1,Rt=t.RETURN_DOM_FRAGMENT||!1,Ct=t.RETURN_DOM_IMPORT||!1,Pt=t.RETURN_TRUSTED_TYPE||!1,Ot=t.FORCE_BODY||!1,Lt=!1!==t.SANITIZE_DOM,Mt=!1!==t.KEEP_CONTENT,jt=t.IN_PLACE||!1,yt=t.ALLOWED_URI_REGEXP||yt,Nt&&(Tt=!1),Rt&&(Dt=!0),Vt&&(mt=A({},[].concat(G(D))),bt=[],!0===Vt.html&&(A(mt,N),A(bt,R)),!0===Vt.svg&&(A(mt,S),A(bt,C),A(bt,L)),!0===Vt.svgFilters&&(A(mt,x),A(bt,C),A(bt,L)),!0===Vt.mathMl&&(A(mt,O),A(bt,P),A(bt,L))),t.ADD_TAGS&&(mt===gt&&(mt=k(mt)),A(mt,t.ADD_TAGS)),t.ADD_ATTR&&(bt===wt&&(bt=k(bt)),A(bt,t.ADD_ATTR)),t.ADD_URI_SAFE_ATTR&&A(Bt,t.ADD_URI_SAFE_ATTR),Mt&&(mt["#text"]=!0),St&&A(mt,["html","head","body"]),mt.table&&(A(mt,["tbody"]),delete _t.tbody),i&&i(t),Gt=t);},Kt=function(t){p(n.removed,{element:t});try{t.parentNode.removeChild(t);}catch(e){t.outerHTML=nt;}},Yt=function(t,e){try{p(n.removed,{attribute:e.getAttributeNode(t),from:e});}catch(t){p(n.removed,{attribute:null,from:e});}e.removeAttribute(t);},Xt=function(t){var e=void 0,n=void 0;if(Ot)t="<remove></remove>"+t;else {var r=y(t,/^[\r\n\t ]+/);n=r&&r[0];}var i=et?et.createHTML(t):t;try{e=new $().parseFromString(i,"text/html");}catch(t){}if(s&&A(_t,["title"]),!e||!e.documentElement){var o=(e=it.createHTMLDocument("")).body;o.parentNode.removeChild(o.parentNode.firstElementChild),o.outerHTML=i;}return t&&n&&e.body.insertBefore(a.createTextNode(n),e.body.childNodes[0]||null),st.call(e,St?"html":"body")[0];};n.isSupported&&function(){try{var t=Xt("<x/><title>&lt;/title&gt;&lt;img&gt;");w(/<\/title/,t.querySelector("title").innerHTML)&&(s=!0);}catch(t){}}();var Qt=function(t){return ot.call(t.ownerDocument||t,t,K.SHOW_ELEMENT|K.SHOW_COMMENT|K.SHOW_TEXT,function(){return K.FILTER_ACCEPT;},!1);},Jt=function(t){return !(t instanceof Q||t instanceof J||"string"==typeof t.nodeName&&"string"==typeof t.textContent&&"function"==typeof t.removeChild&&t.attributes instanceof X&&"function"==typeof t.removeAttribute&&"function"==typeof t.setAttribute&&"string"==typeof t.namespaceURI);},$t=function(t){return "object"===(void 0===T?"undefined":z(T))?t instanceof T:t&&"object"===(void 0===t?"undefined":z(t))&&"number"==typeof t.nodeType&&"string"==typeof t.nodeName;},Zt=function(t,e,r){ct[t]&&c(ct[t],function(t){t.call(n,e,r,Gt);});},te=function(t){var e=void 0;if(Zt("beforeSanitizeElements",t,null),Jt(t))return Kt(t),!0;var r=v(t.nodeName);if(Zt("uponSanitizeElement",t,{tagName:r,allowedTags:mt}),("svg"===r||"math"===r)&&0!==t.querySelectorAll("p, br").length)return Kt(t),!0;if(!mt[r]||_t[r]){if(Mt&&!Ut[r]&&"function"==typeof t.insertAdjacentHTML)try{var i=t.innerHTML;t.insertAdjacentHTML("AfterEnd",et?et.createHTML(i):i);}catch(t){}return Kt(t),!0;}return "noscript"===r&&w(/<\/noscript/i,t.innerHTML)||"noembed"===r&&w(/<\/noembed/i,t.innerHTML)?(Kt(t),!0):(!kt||t.firstElementChild||t.content&&t.content.firstElementChild||!w(/</g,t.textContent)||(p(n.removed,{element:t.cloneNode()}),t.innerHTML?t.innerHTML=m(t.innerHTML,/</g,"&lt;"):t.innerHTML=m(t.textContent,/</g,"&lt;")),Nt&&3===t.nodeType&&(e=t.textContent,e=m(e,ht," "),e=m(e,lt," "),t.textContent!==e&&(p(n.removed,{element:t.cloneNode()}),t.textContent=e)),Zt("afterSanitizeElements",t,null),!1);},ee=function(t,e,n){if(Lt&&("id"===e||"name"===e)&&(n in a||n in Wt))return !1;if(Tt&&w(ft,e));else if(It&&w(pt,e));else {if(!bt[e]||Et[e])return !1;if(Bt[e]);else if(w(yt,m(n,vt,"")));else if("src"!==e&&"xlink:href"!==e&&"href"!==e||"script"===t||0!==g(n,"data:")||!Ft[t])if(At&&!w(dt,m(n,vt,"")));else if(n)return !1;}return !0;},ne=function(t){var e=void 0,i=void 0,o=void 0,s=void 0,a=void 0;Zt("beforeSanitizeAttributes",t,null);var u=t.attributes;if(u){var c={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:bt};for(a=u.length;a--;){var p=e=u[a],y=p.name,g=p.namespaceURI;if(i=b(e.value),o=v(y),c.attrName=o,c.attrValue=i,c.keepAttr=!0,c.forceKeepAttr=void 0,Zt("uponSanitizeAttribute",t,c),i=c.attrValue,!c.forceKeepAttr){if("name"===o&&"IMG"===t.nodeName&&u.id)s=u.id,u=d(u,[]),Yt("id",t),Yt(y,t),h(u,s)>a&&t.setAttribute("id",s.value);else {if("INPUT"===t.nodeName&&"type"===o&&"file"===i&&c.keepAttr&&(bt[o]||!Et[o]))continue;"id"===y&&t.setAttribute(y,""),Yt(y,t);}if(c.keepAttr)if(kt&&w(/\/>/i,i))Yt(y,t);else if(w(/svg|math/i,t.namespaceURI)&&w(_("</("+l(r(Ut),"|")+")","i"),i))Yt(y,t);else {Nt&&(i=m(i,ht," "),i=m(i,lt," "));var E=t.nodeName.toLowerCase();if(ee(E,o,i))try{g?t.setAttributeNS(g,y,i):t.setAttribute(y,i),f(n.removed);}catch(t){}}}}Zt("afterSanitizeAttributes",t,null);}},re=function t(e){var n=void 0,r=Qt(e);for(Zt("beforeSanitizeShadowDOM",e,null);n=r.nextNode();)Zt("uponSanitizeShadowNode",n,null),te(n)||(n.content instanceof u&&t(n.content),ne(n));Zt("afterSanitizeShadowDOM",e,null);};return n.sanitize=function(t,r){var i=void 0,s=void 0,a=void 0,c=void 0,h=void 0;if(t||(t="\x3c!--\x3e"),"string"!=typeof t&&!$t(t)){if("function"!=typeof t.toString)throw E("toString is not a function");if("string"!=typeof(t=t.toString()))throw E("dirty is not a string, aborting");}if(!n.isSupported){if("object"===z(e.toStaticHTML)||"function"==typeof e.toStaticHTML){if("string"==typeof t)return e.toStaticHTML(t);if($t(t))return e.toStaticHTML(t.outerHTML);}return t;}if(xt||Ht(r),n.removed=[],"string"==typeof t&&(jt=!1),jt);else if(t instanceof T)1===(s=(i=Xt("\x3c!--\x3e")).ownerDocument.importNode(t,!0)).nodeType&&"BODY"===s.nodeName||"HTML"===s.nodeName?i=s:i.appendChild(s);else {if(!Dt&&!Nt&&!St&&Pt&&-1===t.indexOf("<"))return et?et.createHTML(t):t;if(!(i=Xt(t)))return Dt?null:nt;}i&&Ot&&Kt(i.firstChild);for(var l=Qt(jt?t:i);a=l.nextNode();)3===a.nodeType&&a===c||te(a)||(a.content instanceof u&&re(a.content),ne(a),c=a);if(c=null,jt)return t;if(Dt){if(Rt)for(h=at.call(i.ownerDocument);i.firstChild;)h.appendChild(i.firstChild);else h=i;return Ct&&(h=ut.call(o,h,!0)),h;}var f=St?i.outerHTML:i.innerHTML;return Nt&&(f=m(f,ht," "),f=m(f,lt," ")),et&&Pt?et.createHTML(f):f;},n.setConfig=function(t){Ht(t),xt=!0;},n.clearConfig=function(){Gt=null,xt=!1;},n.isValidAttribute=function(t,e,n){Gt||Ht({});var r=v(t),i=v(e);return ee(r,i,n);},n.addHook=function(t,e){"function"==typeof e&&(ct[t]=ct[t]||[],p(ct[t],e));},n.removeHook=function(t){ct[t]&&f(ct[t]);},n.removeHooks=function(t){ct[t]&&(ct[t]=[]);},n.removeAllHooks=function(){ct={};},n;}();}();});function ei(t){const e=Zr(t,{gfm:!0,breaks:!0});return ti.sanitize(e);}class ni extends Dr{constructor(t){super(t),this.previewMD=t=>{const e=t.target;this.updateComment(e.value);},this.handlePreview=()=>{this.setState({isPreview:!this.state.isPreview});},this.handleComment=async t=>{t.preventDefault(),this.state.commentContent&&this.props.logged&&(await Qr.addComment({user:this.props.user,content:this.state.commentContent,timestamp:new Date().getTime(),likes:{}}),await this.props.refreshComments(),this.updateComment(),this.setState({isPreview:!1}));},this.handleChangeUser=async(t,e)=>{this.props.user[e]=t.target.value,this.props.handleChangeUser(this.props.user);},this.state={isPreview:!1,markdownContent:"",commentContent:""};}updateComment(t=""){this.setState({commentContent:t,markdownContent:ei(t)});}async handleLogout(){await Xr.auth().signOut();}handleLogin(t){this.props.handleLogin(t);}render(t,e){const n="预览: "+(e.isPreview?"ON":"OFF");return h("form",{class:"firement-form"},h("div",{class:"firement-form__header firement-flex"},h("div",{class:"firement-flex__left firement-flex"},h("img",{src:t.user.avatar,alt:"avatar",class:"firement-avatar"}),t.logged&&h("input",{type:"text",value:t.user.name,placeholder:"name",class:"firement-input",style:"margin-right: 5px;",onInput:t=>this.handleChangeUser(t,"name")}),t.logged&&h("input",{type:"text",value:t.user.email,class:"firement-input",placeholder:"email",onInput:t=>this.handleChangeUser(t,"email")})),h("div",{className:"firement-flex__right firement-flex"},h("div",{className:"firement-tip"},"登录方式："),h("input",{type:"button",class:"firement-button",value:"Google",onClick:this.handleLogin.bind(this,Jr.Google)}),h("input",{type:"button",class:"firement-button",value:"GitHub",onClick:this.handleLogin.bind(this,Jr.GitHub)}),h("input",{type:"button",class:"firement-button",value:"Anonymously",onClick:this.handleLogin.bind(this,Jr.Anonymously)}))),h("div",{class:"firement-form__content"},t.logged?h("div",{className:"firement-box firement-form__comment_input firement-input"},this.state.isPreview?h("div",{class:"firement-box firement-form__preview"},h("div",{className:"firement-form__preview_content",dangerouslySetInnerHTML:{__html:e.markdownContent}})):h("textarea",{name:"content",placeholder:"Markdown Supported",class:"firement-form__textarea",value:e.commentContent,onInput:this.previewMD})):h("div",{className:"firement-box firement-form__not_login"},h("label",{class:"firement-form__label"},"请登录后评论"),h("input",{type:"button",class:"firement-button",value:"Google",onClick:this.handleLogin.bind(this,Jr.Google)}),h("input",{type:"button",class:"firement-button",value:"GitHub",onClick:this.handleLogin.bind(this,Jr.GitHub)}),h("input",{type:"button",class:"firement-button",value:"Anonymously",onClick:this.handleLogin.bind(this,Jr.Anonymously)}))),h("div",{className:"firement-row"},h("div",{className:"firement-row__right"},h("input",{type:"button",value:n,class:"firement-button",onClick:this.handlePreview}),h("input",{type:"submit",value:"提交评论",class:"firement-submit firement-button",onClick:this.handleComment}))));}}const ri="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAgICAgJCAkKCgkNDgwODRMREBARExwUFhQWFBwrGx8bGx8bKyYuJSMlLiZENS8vNUROQj5CTl9VVV93cXecnNEBCAgICAkICQoKCQ0ODA4NExEQEBETHBQWFBYUHCsbHxsbHxsrJi4lIyUuJkQ1Ly81RE5CPkJOX1VVX3dxd5yc0f/CABEIAGQAYwMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABwMEBQYIAQL/2gAIAQEAAAAA0PwAAAAAAJHp2Fa0kSFLcKEyyDm/aeAgbXKh5ptZkdo02hSvNmGvWSt05y958Z7Jj5120l/obkXVMll6wkGdLHIYjMY265N+hK8yAcn2gmmUgOYsCJ2kUDm7VRP2+gc76Y//xAAaAQEAAgMBAAAAAAAAAAAAAAAAAwYBBAUC/9oACAECEAAAALQAj8ZxOxxNNN2thwdUscrhahZ8q/rlkkV2EsU3/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAUDAQIE/9oACAEDEAAAALgDx57zUmfM0pbJWBY0S/nLfUjIs+0fMsaf/8QAQRAAAgIABAEGBwwLAQAAAAAAAQMCBAAFBhESBxMgMVFSECEwcpKhoiIyQUJTYWJzgpGxsiQlNkVQZHF0gZPB4v/aAAgBAQABPwAn+FcnWS179y9ZtIg1KVBQjMAxM241BoLMq2YEZVVZYqsBlAAjdX0CZEYXyf6pn100w89wweTrU/yNX/f/AOcO0JqlX7uE/q2wl+JGNLaGq1svm3NK8Z27CyDCYBCYS+DzsW6rKduxVZ79DZql9g7b/wCelK1Wj756x9oY0HqLTGW5Hw2c4pqe17JzjJgB7oxU1Lp27LgrZzSbLsi6BOIyjIAxII7R4GuUmPE1kIR7ZEAevDtX6WRMwbntASHWOfhjWWY5M7UNx9PMENS6K2cUJgjiI4SMQcmZ2g2Ev6EHoSBMZAdZBw1DK8+bYAJAA+L4RiEpCIAkcE8R3kBLzhvihm+a5dKJo3rCNjuApkoj0erFrWmuxVRJ+Z3FofE8yzmoLDAO7MQxZt2bcwy09j595s5NPtk4EjEbROw7B4sNJJBJJOMtrtY9bogcC5+6JPzdHN4/pKz2r/A+GvXZaequobsbOKoecw8I9Zxr7JEy0O1KVQ/Vy1NUOyKfFL2cEbEjwM6sZQNqsj2sPRjkdzOrKq9JfHYEJyjDfbiERuRi5St0XFNxDEMHxWxKz7WOKHfj6QxyZ6OuWcyRnNxE11K/u0cY2LmYclb0sSyIlBkDGQ7RIbHGqdKX9N3ZqcuRq8WyLHxJx/5LHFDvx9IYp5NmeYqdOpTa1a4Gc2Rj7iIj4yTLqxWQK6FqB326z2k9Hk1QWahaz5KnP25AYdXQ+PC5MGR7JxEh68LyPJVM51eV1IT70UwBwxYYua95REomO8Twkb9hGIZHCLS4XrnPT2DWc4AWRj1RIA2AH0QDhi1tgYMhGUT1iQ3BxDIskgwshlVMT7wTAHFqvBlKwiMQIzVOGwHaNsQBEIA9YiAejyWKJsZu7sWmHrkfIZgoJv3ldy0+P3MI6PJbDahmjO21AfcseQ1QvmtR5zH+bmfSAl0eTJe2QPn37rPZAj5DW0DDVOa/OyEvvXHo8nH7NQ/un/m8hr8Aaqu/VI/L4f/EACsRAAIBAQUGBgMAAAAAAAAAAAECAwQAEBEgIRMxM1FhchIwQUJDYnGRsf/aAAgBAgEBPwDyJZBFGzncLCpgKhtouvM2FRAflX92iqEld1X2+vO87rVFVJKuzZAuBvgmaFyygHTC1NM80fiZcNb6xCtQ/XXJAhSGNTvAvrjjUN0AyA4gG+qONRJ+ckJxiiP0X+X1HHl7zkp+BF2C7//EACURAAIBAgQGAwAAAAAAAAAAAAECAxARABIgMwQhMEFhckJxkf/aAAgBAwEBPwDoO4RCx7YE0RAOcYE0R+a/uEmR2YL20TTu4yFbc6xSGNrjEMjSLcravEKRM3nnoiXLGo8V4o3mPgDQDcVn3n+9Ee2nqKzbr+x0RbSeop//2Q==";function ii(t){const{handleLikes:e,comment:n,user:r}=t,{email:i,homePage:o}=n.user,s=i?"mailto:"+i:"javascript:",a=o||"javascript:",u=!!o,c=function(t=new Date()){const e=t=>t.toString().padStart(2,"0"),n=e(t.getDay()),r=e(t.getMonth()+1);return `${e(t.getFullYear())}-${r}-${n} ${e(t.getHours())}:${e(t.getMinutes())}:${e(t.getSeconds())}`;}(new Date(+t.comment.timestamp)),l=!!r.id&&n.likes[r.id],f=Object.keys(n.likes).filter(t=>n.likes[t]).length,p=n.user.avatar.match(/^[a-z]+\:\/\//)?n.user.avatar:ri;let d=null;return h("section",{className:"firement-comment firement-form","data-id":n.id},h("div",{className:"firement-form__header firement-row"},h("div",{className:"firement-row__left"},h("a",{href:s},h("img",{src:p,alt:"avatar",className:"firement-avatar"})),h("a",{class:"firement-a firement-form__label",target:u?"_blank":"",href:a},n.user.name),h("span",{className:"firement-form__label firement-comment__time"},c)),h("div",{className:"firement-row__right"},h("span",{className:"firement-comment__likes"},h("i",{className:"firement-comment__likes_icon",onClick:async()=>e(n,!l)}),h("span",{className:"firement-form__label"},f)))),h("div",{className:"firement-comment__content",ref:t=>{d=t,setTimeout(()=>{t&&t.clientHeight>200&&t.classList.add("hide-more");},0);}},h("div",{className:"firement-comment__content__inner",dangerouslySetInnerHTML:{__html:ei(n.content)}}),h("div",{"data-js":"more-content",class:"firement-comment__content__more",onClick:()=>{d.classList.remove("hide-more");}},"显示更多")));}class oi extends Dr{render(t){const{comments:e,user:n,handleLikes:r}=t;return h("div",{className:"firement-comments"},e.map((t,e)=>h(ii,{user:n,comment:t,index:e,handleLikes:r})));}}window.h=Sr;class si extends Dr{constructor(){super(),this.refreshComments=async()=>(Qr.resetLatestTag(),this.getMoreComments(!0)),this.handleLogin=async t=>{try{const e=await $r(t);t===Jr.Anonymously&&(e.avatar=ri,e.name="匿名",e.email=void 0),this.solveLoginUser(e);}catch(t){alert("登录失败: "+t);}},this.handleLikes=async(t,e)=>{if(!this.state.logged)return;const{comments:n}=this.state;try{await Qr.updateCommentLike(t.id,e);const r=await Qr.getComment(t.id),i=n.findIndex(t=>t.id===r.id);n.splice(i,1,r),this.setState({comments:n});}catch(t){alert("评论失败:"+t);}},this.getMoreComments=async(t=!1)=>{if(this.state.loading)return;this.setState({loading:!0});const e=await Qr.getMoreComments();e.length<10&&this.setState({hasMoreComment:!1}),this.setState({loading:!1,comments:t?e:this.state.comments.concat(e)});},this.handleChangeUser=async t=>{this.setState({user:t});},this.state={comments:[],logged:!1,loading:!1,hasMoreComment:!0,user:{id:"",name:"匿名",avatar:ri}};}componentWillMount(){this.refreshComments(),this.getCacheLoginInfo();}async getCacheLoginInfo(){const t=await $r(Jr.Anonymously,!0);t&&this.solveLoginUser(t);}solveLoginUser(t){Object.keys(t).forEach(e=>{void 0===t[e]&&(t[e]=null);}),t.avatar=t.avatar||ri,Qr.user=t,this.setState({user:t,logged:!0});}render(t,e){const{user:n,logged:r,comments:i,hasMoreComment:o,loading:s}=e;return Sr("div",{class:"firement-root"},Sr(ni,{refreshComments:this.refreshComments,handleChangeUser:this.handleChangeUser,user:n,logged:r,handleLogin:this.handleLogin}),Sr(oi,{user:n,comments:i,handleLikes:this.handleLikes}),Sr("div",{className:"firement-more"},o?Sr("button",{class:"firement-more__btn"+(s?" loading":""),onClick:()=>this.getMoreComments()},s?"加载中...":"加载更多"):Sr("div",{className:"firement-more__none"},"到底了")));}}module.exports=function(t,e){Qr.init(t),function(t,e,n){var r,i,o;mr.__&&mr.__(t,e),i=(r=n===Er)?null:n&&n.__k||e.__k,t=Sr(Or,null,[t]),o=[],Fr(e,(r?e:n||e).__k=t,i||Ir,Ir,void 0!==e.ownerSVGElement,n&&!r?[n]:i?null:e.childNodes.length?Tr.slice.call(e.childNodes):null,o,n||Ir,r),qr(o,t);}(Sr(si,null),e);};});var Firement = /*@__PURE__*/unwrapExports(firement);

	function getMeta() {
	  const metas = document.getElementsByTagName('meta');
	  const metadata = {};

	  for (const meta of metas) {
	    metadata[meta.name] = meta.content;
	  }

	  return metadata;
	}

	const HEADER_HEIGHT = 60;
	$(document).ready(() => {
	  $('.markdown-content img').fancyImg();
	  let $pageNav = $('#post-nav');
	  const $postContent = $('#post-content');
	  if ($pageNav[0]) generateTOC($pageNav, $postContent);
	  syncTOC($(window));
	  generateComment();
	});

	function generateComment() {
	  const $comment = document.getElementById('post-comment');
	  const metas = getMeta();

	  if (!$comment || !metas['comment.apiKey']) {
	    return;
	  }

	  const firebaseConfig = {
	    apiKey: metas['comment.apiKey'],
	    authDomain: metas['comment.authDomain'],
	    databaseURL: metas['comment.databaseURL'],
	    projectId: metas['comment.projectId'],
	    storageBucket: metas['comment.storageBucket'],
	    messagingSenderId: metas['comment.messagingSenderId'],
	    appId: metas['comment.appId']
	  };
	  Firement({
	    db: firebaseConfig,
	    article: location.pathname.replace(/\//g, '-')
	  }, $comment);
	}

	function syncTOC($content) {
	  const $elements = $('#post-content').find('h1, h2, h3, h4, h5, h6');
	  const max = $elements.length;

	  const calcActive = () => {
	    let mark = -1;

	    for (let i = 0; i < max; i++) {
	      const $ele = $($elements[i]);

	      if ($ele.offset().top >= $content.scrollTop() + HEADER_HEIGHT) {
	        mark = i;
	        break;
	      }
	    }

	    if (mark != -1) {
	      const $lis = $('#post-nav').find('a');
	      const ele = $('#post-nav').find('a').get(mark);
	      const $ele = $(ele);
	      $lis.removeClass('hover');
	      $ele.addClass('hover');
	    }
	  };

	  $($content).scroll(calcActive);
	  calcActive();
	}

	function getTOC($content) {
	  const getChildTOC = list => {
	    const level = list.node.level + 1;

	    for (let index = 0; index < list.children.length; index++) {
	      const item = list.children[index];
	      if (item.children.length !== 0) getChildTOC(item);else {
	        if (item.node.level !== level) {
	          const child = list.children.splice(index, 1);
	          list.children[index - 1].children.push(child);
	        }
	      }
	    }
	  };

	  const list = [];
	  let preLevel = null;
	  $content.find('h1, h2, h3, h4, h5, h6').each((index, ele) => {
	    const level = +ele.nodeName.split('').pop();
	    if (!preLevel) preLevel = level;
	    const text = $(ele).text();
	    const node = {
	      level,
	      text,
	      href: text.split(/[\s.*+?^=!:${}()|[\]/\\]+/).filter(item => item !== '').join('-')
	    };

	    if (preLevel === level) {
	      list.push({
	        node,
	        children: []
	      });
	    } else {
	      list[list.length - 1].children.push({
	        node,
	        children: []
	      });
	    }
	  });
	  list.forEach(child => {
	    getChildTOC(child);
	  });
	  return list;
	}

	function generateTOC($pageNav, $content) {
	  const generate = list => {
	    const $ul = $('<ul> </ul>');
	    list.forEach(child => {
	      const $li = $('<li> </li>');
	      const $a = $(`<a>${child.node.text}</a>`);
	      $a.click(() => {
	        const top = $('#' + child.node.href).offset().top - HEADER_HEIGHT;
	        $(window).scrollTop(top);
	      }); // $li.append($(`<a href='#${child.node.href}'>${child.node.text}</a>`));

	      $li.append($a);

	      if (child.children.length !== 0) {
	        $li.append(generate(child.children));
	      }

	      $ul.append($li);
	    });
	    return $ul;
	  };

	  const TOC = getTOC($content);
	  const $ul = generate(TOC);
	  $pageNav.append($ul).addClass('active');
	}

	window.addEventListener('load', () => {
	  const metadata = getMeta();

	  {
	    unregisterSW();
	    return;
	  }
	});

	async function unregisterSW() {
	  if (!navigator.serviceWorker) {
	    return;
	  }

	  const sws = await navigator.serviceWorker.getRegistrations();

	  for (const sw of sws) {
	    sw.unregister();
	  }
	}

}());
//# sourceMappingURL=index.js.map
