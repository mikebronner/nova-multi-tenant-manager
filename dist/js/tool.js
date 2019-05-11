/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(8)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
module.exports = __webpack_require__(16);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

Nova.booting(function (Vue, router, store) {
    router.addRoutes([{
        name: 'tenants',
        path: '/tenants',
        component: __webpack_require__(5)
    }, {
        name: 'tenant-settings',
        path: '/tenant-settings',
        component: __webpack_require__(11)
    }]);
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(6)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(9)
/* template */
var __vue_template__ = __webpack_require__(10)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Tenants.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-492da9ee", Component.options)
  } else {
    hotAPI.reload("data-v-492da9ee", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("53289622", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-492da9ee\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Tenants.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-492da9ee\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Tenants.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* Scoped Styles */\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            adminEmail: "",
            adminName: "",
            domain: "",
            name: "",
            tenants: []
        };
    },

    created: function created() {
        this.getTenants();
    },

    methods: {
        createTenant: function createTenant() {
            var self = this;

            axios.post("/nova-vendor/genealabs-nova-multi-tenant-manager/tenants", {
                adminEmail: this.adminEmail,
                adminName: this.adminName,
                domain: this.domain,
                name: this.name
            }).then(function (response) {
                self.$toasted.show("Tenant successfully created.", { type: "success" });
                self.tenants = Object.assign([], self.tenants, response.data);
                window.location.href = "//" + response.data.domain + "/dashboard/tenants";
            }).catch(function (error) {
                console.error(error, error.response);
                self.$toasted.show("Error " + error.response.status + ": " + error.response.statusText, { type: "error" });
            });
        },

        deleteTenant: function deleteTenant(id) {
            var self = this;

            axios.delete("/nova-vendor/genealabs-nova-multi-tenant-manager/tenants/" + id).then(function (response) {
                self.$toasted.show("Tenant successfully deleted.", { type: "success" });

                if (response.status == 204) {
                    var tenants = _.reject(self.tenants, function (tenant) {
                        return tenant.id == id;
                    });
                    self.tenants = Object.assign([], tenants);
                }
            }).catch(function (error) {
                console.error(error, error.response);
                self.$toasted.show("Error " + error.response.status + ": " + error.response.statusText, { type: "error" });
            });
        },

        getTenants: function getTenants() {
            var self = this;

            axios.get("/nova-vendor/genealabs-nova-multi-tenant-manager/tenants").then(function (response) {
                self.tenants = Object.assign([], response.data);
            }).catch(function (error) {
                console.error(error, error.response);
                self.$toasted.show("Error " + error.response.status + ": " + error.response.statusText, { type: "error" });
            });
        },

        isCurrentTenant: function isCurrentTenant(domain) {
            return domain == window.location.hostname;
        },

        isNotCurrentTenant: function isNotCurrentTenant(domain) {
            return !this.isCurrentTenant(domain);
        }
    }
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("h1", [_vm._v("Tenant Management")]),
    _vm._v(" "),
    _c("div", { staticClass: "relative" }, [
      _c("h2", { staticClass: "mb-3 text-90 font-normal text-2xl" }, [
        _vm._v("Add Tenant")
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "card overflow-hidden" }, [
        _c("div", [
          _c(
            "div",
            {
              staticClass: "flex border-b border-40",
              attrs: {
                "via-resource": "",
                "via-resource-id": "",
                "via-relationship": ""
              }
            },
            [
              _vm._m(0),
              _vm._v(" "),
              _c("div", { staticClass: "py-6 px-8 w-1/2" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.name,
                      expression: "name"
                    }
                  ],
                  staticClass:
                    "w-full form-control form-input form-input-bordered",
                  attrs: { id: "name", type: "text", placeholder: "Name" },
                  domProps: { value: _vm.name },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.name = $event.target.value
                    }
                  }
                }),
                _vm._v(" "),
                _c("div", { staticClass: "help-text help-text mt-2" }),
                _vm._v(" "),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.domain,
                      expression: "domain"
                    }
                  ],
                  staticClass:
                    "w-full form-control form-input form-input-bordered",
                  attrs: { id: "domain", type: "text", placeholder: "Domain" },
                  domProps: { value: _vm.domain },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.domain = $event.target.value
                    }
                  }
                }),
                _vm._v(" "),
                _c("div", { staticClass: "help-text help-text mt-2" })
              ])
            ]
          )
        ]),
        _vm._v(" "),
        _c("div", [
          _c("div", { staticClass: "flex border-b border-40" }, [
            _vm._m(1),
            _vm._v(" "),
            _c("div", { staticClass: "py-6 px-8 w-1/2" }, [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.adminEmail,
                    expression: "adminEmail"
                  }
                ],
                staticClass:
                  "w-full form-control form-input form-input-bordered",
                attrs: { id: "adminEmail", type: "text", placeholder: "Email" },
                domProps: { value: _vm.adminEmail },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.adminEmail = $event.target.value
                  }
                }
              }),
              _vm._v(" "),
              _c("div", { staticClass: "help-text help-text mt-2" }),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.adminName,
                    expression: "adminName"
                  }
                ],
                staticClass:
                  "w-full form-control form-input form-input-bordered",
                attrs: {
                  id: "adminName",
                  type: "text",
                  placeholder: "First & Last Name"
                },
                domProps: { value: _vm.adminName },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.adminName = $event.target.value
                  }
                }
              }),
              _vm._v(" "),
              _c("div", { staticClass: "help-text help-text mt-2" })
            ])
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "bg-30 flex px-8 py-4 pb-1" }, [
          _c("div", { staticClass: "w-1/5 py-6 px-8" }),
          _vm._v(" "),
          _c(
            "button",
            {
              staticClass: "ml-4 btn btn-default btn-primary",
              on: { click: _vm.createTenant }
            },
            [
              _vm._v(
                "\n                        Create Tenant\n                    "
              )
            ]
          )
        ])
      ])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "card relative mt-8" }, [
      _c("div", { staticClass: "overflow-hidden overflow-x-auto relative" }, [
        _c(
          "table",
          {
            staticClass: "table w-full",
            attrs: {
              cellpadding: "0",
              cellspacing: "0",
              "data-testid": "resource-table"
            }
          },
          [
            _vm._m(2),
            _vm._v(" "),
            _c(
              "tbody",
              _vm._l(_vm.tenants, function(tenant) {
                return _c("tr", { key: tenant.id }, [
                  _c("td", [
                    _c(
                      "span",
                      { staticClass: "whitespace-no-wrap text-left" },
                      [
                        _vm._v(
                          "\n                                " +
                            _vm._s(tenant.name) +
                            "\n                            "
                        )
                      ]
                    )
                  ]),
                  _vm._v(" "),
                  _c("td", [
                    _c(
                      "span",
                      { staticClass: "whitespace-no-wrap text-left" },
                      [
                        _vm._v(
                          "\n                                " +
                            _vm._s(tenant.domain) +
                            "\n                            "
                        )
                      ]
                    )
                  ]),
                  _vm._v(" "),
                  _c("td", { staticClass: "td-fit text-right pr-6" }, [
                    _c(
                      "a",
                      {
                        staticClass:
                          "cursor-pointer text-70 hover:text-primary mr-3",
                        attrs: {
                          href:
                            "//" + tenant.domain + "/dashboard/site-settings",
                          title: "Site Settings"
                        }
                      },
                      [_c("i", { staticClass: "fas fa-tools" })]
                    ),
                    _vm._v(" "),
                    _vm.isNotCurrentTenant(tenant.domain)
                      ? _c("span", [
                          _c(
                            "a",
                            {
                              staticClass:
                                "cursor-pointer text-70 hover:text-primary mr-3",
                              attrs: {
                                href:
                                  "//" + tenant.domain + "/dashboard/tenants",
                                title: "Switch"
                              }
                            },
                            [_c("i", { staticClass: "fal fa-toggle-off" })]
                          )
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _vm.isCurrentTenant(tenant.domain)
                      ? _c("span", { staticClass: "mr-3" }, [
                          _c("i", { staticClass: "far fa-toggle-on" })
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass:
                          "appearance-none cursor-pointer text-70 hover:text-primary mr-3",
                        attrs: { title: "Delete" },
                        on: {
                          click: function($event) {
                            return _vm.deleteTenant(tenant.id)
                          }
                        }
                      },
                      [_c("i", { staticClass: "far fa-trash-alt" })]
                    )
                  ])
                ])
              }),
              0
            )
          ]
        )
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "w-1/5 py-6 px-8" }, [
      _c(
        "label",
        {
          staticClass: "inline-block text-80 pt-2 leading-tight",
          attrs: { for: "name" }
        },
        [
          _vm._v(
            "\n                                Tenant\n                            "
          )
        ]
      )
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "w-1/5 py-6 px-8" }, [
      _c(
        "label",
        {
          staticClass: "inline-block text-80 pt-2 leading-tight",
          attrs: { for: "adminEmail" }
        },
        [
          _vm._v(
            "\n                                Admin\n                            "
          )
        ]
      )
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("th", { staticClass: "text-left" }, [
          _vm._v("\n                            Name\n                        ")
        ]),
        _vm._v(" "),
        _c("th", { staticClass: "text-left" }, [
          _vm._v("\n                            URL\n                        ")
        ]),
        _vm._v(" "),
        _c("th")
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-492da9ee", module.exports)
  }
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(12)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(14)
/* template */
var __vue_template__ = __webpack_require__(15)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3a09080e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Settings.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3a09080e", Component.options)
  } else {
    hotAPI.reload("data-v-3a09080e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("aa9291fe", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3a09080e\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/sass-loader/lib/loader.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Settings.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3a09080e\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/sass-loader/lib/loader.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Settings.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.trashcan[data-v-3a09080e] {\n  cursor: pointer;\n}\n.trashcan i[data-v-3a09080e]:first-child {\n    display: inline-block;\n}\n.trashcan i[data-v-3a09080e]:last-child {\n    display: none;\n}\n.trashcan:hover i[data-v-3a09080e]:first-child {\n    display: none;\n}\n.trashcan:hover i[data-v-3a09080e]:last-child {\n    display: inline-block;\n}\n", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            fields: [],
            imagePreviewData: "",
            newAlias: "",
            tenant: {},
            validationErrors: []
        };
    },

    mounted: function mounted() {
        this.loadTenant();
    },


    computed: {
        hasLogo: function hasLogo() {
            return ((this.tenant.settings || {}).logo || "").length > 0;
        },

        currentImage: function currentImage() {
            return this.imagePreviewData.length > 0 ? this.imagePreviewData : this.hasLogo ? "/" + this.tenant.settings.logo : "";
        }
    },

    methods: {
        addAlias: function addAlias() {
            var self = this;

            axios.post("/nova-vendor/genealabs-nova-multi-tenant-manager/aliases", {
                alias: self.newAlias
            }).then(function (response) {
                self.tenant = response.data;
                self.newAlias = "";
            }).catch(function (error) {
                console.error(error);
                self.$toasted.show("Error " + error.response.status + ": " + error.response.statusText, { type: "error" });
            });
        },

        deleteAlias: function deleteAlias(aliasId) {
            var self = this;

            axios.delete("/nova-vendor/genealabs-nova-multi-tenant-manager/aliases/" + aliasId).then(function (response) {
                if (response.status >= 200 && response.status < 300) {
                    self.tenant.aliases = _.reject(self.tenant.aliases, function (alias) {
                        return alias.id == aliasId;
                    });
                }
            }).catch(function (error) {
                console.error(error, error.response);
                self.$toasted.show("Error " + error.response.status + ": " + error.response.statusText, { type: "error" });
            });
        },

        formData: function formData() {
            var data = new FormData();

            data.append("_method", "PATCH");

            if (this.tenant.name != null) {
                data.append("name", this.tenant.name);
            }

            if (this.tenant.settings.logo != null) {
                data.append("logo", this.tenant.settings.logo);
            }

            return data;
        },

        getName: function getName() {
            return this.tenant.name;
        },

        loadTenant: function loadTenant() {
            var self = this;

            axios.get("/nova-vendor/genealabs-nova-multi-tenant-manager/tenants/0").then(function (response) {
                self.tenant = response.data;
                self.fields = [{
                    name: "Name",
                    value: self.tenant.name,
                    component: "text-field",
                    resourceName: "Tenant"
                }, {
                    name: "Logo",
                    value: self.tenant.logo,
                    component: "file-field",
                    resourceName: "Tenant"
                }];
            }).catch(function (error) {
                console.error(error, error.response);
                self.$toasted.show("Error " + error.response.status + ": " + error.response.statusText, { type: "error" });
            });
        },

        previewImage: function previewImage(event) {
            var input = event.target;
            var self = this;

            if (input.files && input.files[0]) {
                var reader = new FileReader();

                this.tenant.settings = Object.assign({}, this.tenant.settings, {
                    logo: input.files[0]
                });
                reader.onload = function (event) {
                    var imageData = event.target.result;
                    self.imagePreviewData = "";

                    if (imageData.indexOf("data:image") === 0) {
                        self.imagePreviewData = imageData;
                    }
                };
                reader.readAsDataURL(input.files[0]);

                this.updateTenant();
            }
        },

        updateTenant: _.debounce(function () {
            var self = this;
            var data = this.formData();

            axios.post("/nova-vendor/genealabs-nova-multi-tenant-manager/tenants/" + this.tenant.id, data).then(function (response) {
                self.tenant = response.data;
                self.$toasted.show("Site settings updated successfully.", { type: "success" });
                setTimeout(function () {
                    window.location.reload(true);
                }, 1000);
            }).catch(function (error) {
                console.error(error, error.response);
                self.$toasted.show("Error " + error.response.status + ": " + error.response.statusText, { type: "error" });
            });
        }, 500)
    }
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("heading", { staticClass: "mb-6" }, [_vm._v("Site")]),
      _vm._v(" "),
      _c("card", [
        _c("div", [
          _c(
            "div",
            {
              staticClass: "flex border-b border-40",
              attrs: {
                "via-resource": "",
                "via-resource-id": "",
                "via-relationship": ""
              }
            },
            [
              _c("div", { staticClass: "w-1/5 py-6 px-8" }, [
                _c(
                  "label",
                  {
                    staticClass: "inline-block text-80 pt-2 leading-tight",
                    attrs: { for: "name" }
                  },
                  [
                    _vm._v(
                      "\n                        Name\n                    "
                    )
                  ]
                )
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "py-6 px-8 w-1/2" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.tenant.name,
                      expression: "tenant.name"
                    }
                  ],
                  staticClass:
                    "w-full form-control form-input form-input-bordered",
                  attrs: { type: "text", placeholder: "Name" },
                  domProps: { value: _vm.tenant.name },
                  on: {
                    keyup: _vm.updateTenant,
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.tenant, "name", $event.target.value)
                    }
                  }
                }),
                _vm._v(" "),
                _c("div", { staticClass: "help-text help-text mt-2" })
              ])
            ]
          ),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "flex border-b border-40",
              attrs: {
                "via-resource": "",
                "via-resource-id": "",
                "via-relationship": ""
              }
            },
            [
              _c("div", { staticClass: "w-1/5 py-6 px-8" }, [
                _c(
                  "label",
                  {
                    staticClass: "inline-block text-80 pt-2 leading-tight",
                    attrs: { for: "name" }
                  },
                  [
                    _vm._v(
                      "\n                        Domain\n                    "
                    )
                  ]
                )
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "w-3/4 py-8 px-8" }, [
                _c("p", {
                  staticClass: "text-90",
                  domProps: { textContent: _vm._s(_vm.tenant.domain) }
                })
              ])
            ]
          ),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "flex border-b border-40",
              attrs: {
                "via-resource": "",
                "via-resource-id": "",
                "via-relationship": ""
              }
            },
            [
              _c("div", { staticClass: "w-1/5 py-6 px-8" }, [
                _c(
                  "label",
                  {
                    staticClass: "inline-block text-80 pt-2 leading-tight",
                    attrs: { for: "name" }
                  },
                  [
                    _vm._v(
                      "\n                        Aliases\n                    "
                    )
                  ]
                )
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "py-8 px-8 w-3/4" },
                [
                  _vm._l(_vm.tenant.aliases, function(alias) {
                    return _c("p", { staticClass: "mb-3" }, [
                      _vm._v(
                        "\n                        " +
                          _vm._s(alias.fqdn) +
                          "\n                        "
                      ),
                      _c(
                        "span",
                        {
                          staticClass: "ml-3 text-danger trashcan",
                          on: {
                            click: function($event) {
                              return _vm.deleteAlias(alias.id)
                            }
                          }
                        },
                        [
                          _c("i", { staticClass: "fal fa-trash-alt" }),
                          _vm._v(" "),
                          _c("i", { staticClass: "fas fa-trash-alt" })
                        ]
                      )
                    ])
                  }),
                  _vm._v(" "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.newAlias,
                        expression: "newAlias"
                      }
                    ],
                    staticClass:
                      "w-2/3 form-control form-input form-input-bordered rounded-r-none",
                    attrs: { type: "text", placeholder: "Add Alias" },
                    domProps: { value: _vm.newAlias },
                    on: {
                      keyup: function($event) {
                        if (
                          !$event.type.indexOf("key") &&
                          _vm._k(
                            $event.keyCode,
                            "enter",
                            13,
                            $event.key,
                            "Enter"
                          )
                        ) {
                          return null
                        }
                        return _vm.addAlias($event)
                      },
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.newAlias = $event.target.value
                      }
                    }
                  }),
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-default btn-primary rounded-l-none",
                      on: { click: _vm.addAlias }
                    },
                    [_c("i", { staticClass: "fas fa-plus" })]
                  ),
                  _vm._v(" "),
                  _c("div", { staticClass: "help-text help-text mt-2" })
                ],
                2
              )
            ]
          )
        ])
      ]),
      _vm._v(" "),
      _c("heading", { staticClass: "mb-6 mt-12" }, [_vm._v("Settings")]),
      _vm._v(" "),
      _c("card", { staticClass: "mt-4" }, [
        _c("div", [
          _c("div", { staticClass: "flex border-b border-40" }, [
            _c("div", { staticClass: "w-1/5 py-6 px-8" }, [
              _c(
                "label",
                { staticClass: "inline-block text-80 pt-2 leading-tight" },
                [_vm._v("\n                        Logo\n                    ")]
              )
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "py-6 px-8 w-4/5" }, [
              _c("span", { staticClass: "form-file mr-4" }, [
                _c("input", {
                  ref: "logo",
                  staticClass: "form-file-input",
                  attrs: { type: "file", id: "logo", accept: "image" },
                  on: { change: _vm.previewImage }
                }),
                _vm._v(" "),
                _c("label", [
                  _c("img", {
                    staticClass: "image-preview",
                    attrs: { src: _vm.currentImage }
                  })
                ]),
                _vm._v(" "),
                _c("div"),
                _vm._v(" "),
                _c(
                  "label",
                  {
                    staticClass:
                      "mt-4 form-file-btn btn btn-default btn-primary",
                    attrs: { for: "logo" }
                  },
                  [
                    _vm._v(
                      "\n                            Choose File\n                        "
                    )
                  ]
                )
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "help-text help-text mt-2" }, [
                _vm._v(
                  "\n                        Current File: " +
                    _vm._s(_vm.tenant.logo || "no file selected") +
                    "\n                    "
                )
              ])
            ])
          ])
        ])
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3a09080e", module.exports)
  }
}

/***/ }),
/* 16 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);