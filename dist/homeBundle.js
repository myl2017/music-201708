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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(4);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(3);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!./reset.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!./reset.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/********************reset css *******************/\n*{ margin: 0; padding: 0; box-sizing: border-box;}\n*::after{ box-sizing: border-box;}\n*::after{ box-sizing: border-box;}\nimg{ vertical-align: middle;}\nh1,h2,h3,h4,h5,h6{ font-weight: normal;}\n/*{ outline: 1px solid red;} *css精髓*/\n\nbody{ font-size: 14px; line-height: 1.5; color: #333333; font-family: Helvetica, sans-serif; background: #fcfcfd; }\na,a:visited{ color: inherit; text-decoration: none; cursor: pointer;}\nul,ol{ list-style: none;}\n", ""]);

// exports


/***/ }),
/* 4 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reset_css__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reset_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__reset_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home_css__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__home_css__);


console.log('I am home page')


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!./home.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!./home.css");
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

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*********************home page css**********************/\ndiv.sticky{\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    z-index: 1;\n    background-color: white;\n}\nsection.topbar{\n    background: #d43c33;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    padding: 17px 10px;\n}\nsection.topbar .logo > svg{\n    width: 142px;\n    height: 25px;\n    vertical-align: top;\n}\nsection.topbar .downloadApp a{\n    color: white;\n    display: inline-block;\n    padding: 5px 11px;\n    line-height: 20px;\n    position: relative;\n}\nsection.topbar .downloadApp a::after{\n    content: '';\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 200%;\n    height: 200%;\n    border-radius: 50px;\n    border: 1px solid;\n    -webkit-transform: scale(0.5);\n            transform: scale(0.5);\n    -webkit-transform-origin: 0 0 ;\n            transform-origin: 0 0 ;\n}\nsection.globalNavigation .tabs-nav{\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    border-bottom: 1px solid #cccccc;\n}\nsection.globalNavigation .tabs-nav > li{\n    width: 33.333333%;\n    text-align: center;\n    line-height: 17px;\n}\n.tabs-nav > li .text{\n    display: inline-block;\n    line-height: 40px;\n    padding: 0 5px;\n    position: relative;\n}\n.tabs-nav > li.active{\n    color: #d33a31;\n}\n.tabs-nav > li.active .text::after{\n    content: '';\n    display: inline-block;\n    position: absolute;\n    left: 0;\n    bottom: -1px;\n    width: 100%;\n    height: 2px;\n    background: #d33a31;\n}\n\n.tab-pannel{\n    margin-top: 105px;\n    position: relative;\n    z-index: 0;\n}\n.tab-pannel .pannel-1, .pannel-2 , .pannel-3{\n    display: none;\n}\n.tab-pannel .pannel-1.active{\n    display: block;\n}\n.tab-pannel .pannel-2.active{\n    display: block;\n}\n.tab-pannel .pannel-3.active{\n    display: block;\n}\n\n.recommendList{\n    padding-top: 20px;\n    padding-bottom: 24px;\n}\n.pannel1Title{\n    font-size: 17px;\n    line-height: 20px;\n    margin-bottom: 15px;\n    padding-left: 9px;\n    position: relative;\n}\n.recommendList h2::after{\n    content: '';\n    position: absolute;\n    top: 1px;\n    left: 0;\n    width: 2px;\n    padding: 8px 0;\n    background: #d33a31;\n}\n.recommendList .recommendSongs{\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -ms-flex-flow: wrap;\n        flex-flow: wrap;\n    font-size: 13px;\n}\n.recommendList .recommendSongs > li{\n    width: calc(33.333333% - 2px);\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    margin-bottom: 16px;\n}\n.recommendList .loading{\n    padding: 44%;\n}\n.recommendSongs li a{\n    display: block;\n    width: 100%;\n}\n.recommendSongs .cover{\n    color: white;\n    position: relative;\n    padding-top: 100%;\n}\n.recommendSongs .cover::after{\n    content: \" \";\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 20px;\n    z-index: 2;\n    background-image: linear-gradient(180deg,rgba(0,0,0,.2),transparent);\n}\n .recommendSongs .cover > img{\n     width: 100%;\n     position: absolute;\n     top: 0;\n     left: 0;\n     vertical-align: middle;\n}\n .recommendSongs .cover .listener{\n     font-size: 12px;\n     position: absolute;\n     top: 2px;\n     right: 5px;\n     text-shadow: 1px 0 0 rgba(0,0,0,.15);\n }\n .icon-headset{\n     position: absolute;\n     top: 3px;\n     left: -18px;\n     -webkit-transform: scale(0.07);\n             transform: scale(0.07);\n     -webkit-transform-origin: 0 0;\n             transform-origin: 0 0;\n     vertical-align: middle;\n }\n.recommendSongs > li > a > p.remd-summary{\n    display: -webkit-box;\n    -webkit-line-clamp: 2;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n    padding: 6px 2px 0 6px;\n    line-height: 1.2;\n    font-size: 13px;\n}\n.newestList h2::after{\n    content: '';\n    position: absolute;\n    top: 1px;\n    left: 0;\n    width: 2px;\n    padding: 8px 0;\n    background: #d33a31;\n}\n.newestList .loading{\n    position: relative;\n}\n.newestList .loading > img{\n    position: absolute;\n    top: 0;\n    left: 45%;\n    margin-bottom: 50px;\n}\n.hotSongList .loading{\n    position: relative;\n}\n.hotSongList .loading > img{\n    position: absolute;\n    top: 50px;\n    left: 45%;\n    margin-bottom: 50px;\n}\n.newestSongs > li > a{\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    margin-left: 10px;\n    border-bottom: .1px solid rgba(136,136,136,.1);\n}\n.hotSongs > li > a{\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    margin-left: 10px;\n    border-bottom: .1px solid rgba(136,136,136,.1);\n}\n.songInfo{\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n    -ms-flex-negative: 1;\n        flex-shrink: 1;\n}\n.songInfo h3{\n    font-size: 17px;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    word-break: normal;\n    width: 78.6vw;\n}\n.songInfo h3 > span{\n    color: #888;\n    margin-left: 4px;\n}\n.songInfo .songIntroduce{\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    word-break:  normal;\n    width: 78.6vw;\n}\n.songInfo .songIntroduce > span{\n    font-size: 12px;\n    color: #888;\n}\n.songInfo .songIntroduce > i.icon-sq{\n    display: inline-block;\n    width: 12px;\n    height: 8px;\n    margin-right: 4px;\n    background: url(http://ovg4f07xy.bkt.clouddn.com/sprite.png) no-repeat;\n    background-size: 166px 97px;\n}\n.playButton{\n    padding: 16px 10px;\n}\n.playButton > span{\n    display: inline-block;\n    width: 22px;\n    height: 22px;\n    background: url(http://ovg4f07xy.bkt.clouddn.com/sprite.png) no-repeat;\n    background-size: 166px 97px;\n    background-position: -24px 0;\n    vertical-align: bottom;\n}\n.art{\n    background: url(http://ovg4f07xy.bkt.clouddn.com/recommandbg2x.png) no-repeat center;\n    background-size: cover;\n    text-align: center;\n    padding-bottom: 16px;\n    margin-top: 4px;\n}\n.art .logo{\n    padding-top: 16.9%;\n}\n.art .logo > svg{\n    width: 230px;\n    height: 44px;\n    vertical-align: middle;\n}\n.art .openApp{\n    display: inline-block;\n    line-height: 38px;\n    font-size: 16px;\n    padding: 0 48px;\n    border-radius: 50px;\n    border: 1px solid #d33a31;\n    margin-top: 15px;\n    margin-bottom: 5px;\n    color: #d33a31;\n}\n.art .copyright{\n    color: #888888;\n    font-size: 12px;\n    line-height: 16px;\n    -webkit-transform: scale(.75);\n            transform: scale(.75);\n}\n\n.pannel-2{}\n.pannel-2 .hotMusicBackground{\n    background: url(http://ovg4f07xy.bkt.clouddn.com/hotmusicbg2x.jpg) no-repeat;\n    background-size: cover;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    position: relative;\n    width: 100%;\n    padding-top: 145px;\n    vertical-align: top;\n}\n.pannel-2 .hotMusicBackground::after{\n    content: '';\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    z-index: 1;\n    background-color: rgba(0,0,0,.2);\n}\n.pannel-2 .hotMusicBackground > .hotSprites{\n    width: 142px;\n    height: 67px;\n    background: url(http://ovg4f07xy.bkt.clouddn.com/sprite.png) no-repeat;\n    background-size: 166px 97px;\n    background-position: -24px -30px;\n    position: absolute;\n    top: 32px;\n    left: 20px;\n    z-index: 2;\n}\n.pannel-2 .hotMusicBackground > .hotDate{\n    color: hsla(0,0%,100%,.8);\n    -webkit-transform: scale(.81);\n            transform: scale(.81);\n    -webkit-transform-origin: left top;\n            transform-origin: left top;\n    position: absolute;\n    left: 20px;\n    bottom: 20px;\n    z-index: 2;\n}\n.hotSongs{ font-size: 17px;}\n.order{\n    padding: 17px 9px 17px 0;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    align-items: center;\n    color: #999;\n}\n.song-hot{ color: #df3436; }\n.viewAll{ text-align: center; }\n.viewAll .hotViewLink{\n    display: inline-block;\n    color: #999;\n    padding-top: 17px;\n    padding-bottom: 18px;\n}\n.greaterThan{ color: #dddddd;}\n.hotSongs .songInfo span{\n    color: #888;\n    margin-left: 4px;\n}\n.pannel-3 .formInfo{\n    padding: 15px 10px;\n    border-bottom: .1px solid rgba(136,136,136,.1);\n}\n.pannel-3 .inputCover{\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    background: #ebecec;\n    border-radius: 30px;\n    position: relative;\n}\n.inputCover > .icon-search{\n    width: 13px;\n    height: 13px;\n    vertical-align: middle;\n    fill: #c9c9c9;\n    position: absolute;\n    top: 9px;\n    left: 9px;\n}\n.inputCover > .icon-closed{\n    width: 13px;\n    height: 13px;\n    fill: #c9c9c9;\n    vertical-align: middle;\n    position: absolute;\n    top: 9px;\n    right: 9px;\n}\n#search{\n    width: calc(100% - 60px);\n    font-size: 14px;\n    color: #333;\n    padding-top: 6.6px;\n    padding-right: 117px;\n    padding-bottom: 6.6px;\n    outline: none;\n    border: none;\n    background: transparent;\n}\n@media (max-width: 320px){\n    #search{\n        padding-right: 67px;\n    }\n}\n.holder{\n    width: calc(100% - 60px);\n    position: absolute;\n    top: 5px;\n    left: 30px;\n    font-size: 14px;\n    color: #c9c9c9;\n    background: transparent;\n    pointer-events: none;\n}\n\n.matchList{\n    display: none;\n}\n.matchList.active{\n    display: block;\n}\n.matchList h3.matchTitle{\n    height: 50px;\n    margin-left: 10px;\n    padding-right: 10px;\n    font-size: 15px;\n    line-height: 50px;\n    color: #507daf;\n    border-bottom: .1px solid rgba(136,136,136,.1);\n}\n.searchResult p.empty{\n    margin-left: 10px;\n    padding-right: 10px;\n    font-size: 15px;\n    line-height: 20px;\n    color: #507daf;\n}\n.searchResult > li > a{\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    margin-left: 10px;\n}\n.searchResult > li > a > svg.icon-search{\n    display: inline-block;\n    width: 15px;\n    height: 15px;\n    fill: #c9c9c9;\n    margin-right: 7px;\n}\n.searchResult > li > a > .matchItem{\n    padding-right: 10px;\n    font-size: 15px;\n    line-height: 45px;\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n    border-bottom: .1px solid rgba(136,136,136,.1);\n}\n.searchResult .highlight{\n    color: #507daf;\n}\n.noResult{\n    padding: 20px 0;\n    text-align: center;\n}\n\n.records{\n    display: block;\n}\n.records.active{\n    display: none;\n}\n.hotList{\n    padding-top: 15px;\n    padding-right: 10px;\n    padding-bottom: 0;\n    padding-left: 10px;\n}\n.hotList h3{\n    font-size: 12px;\n    line-height: 12px;\n    color: #666;\n}\n.hotList > ol{\n    margin: 10px 0 7px;\n}\n.hotList > ol > li{\n    display: inline-block;\n    margin-right: 8px;\n    margin-bottom: 8px;\n    padding: 0 14px;\n    font-size: 14px;\n    line-height: 32px;\n    color: #333;\n    border: .1px solid rgba(136,136,136,.2);\n    border-radius: 32px;\n}\n.history-Info > li{\n    padding-top: 15px;\n    padding-right: 10px;\n    padding-bottom: 10px;\n    padding-left: 10px;\n    position: relative;\n}\n.history-Info > li::after{\n    content: '';\n    position: absolute;\n    top: 45px;\n    left: 35px;\n    border-bottom: .1px solid rgba(136,136,136,.1);\n    width: 100%;\n}\n.history > ol > li{\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n.history .icon-lishi{\n    display: inline-block;\n    width: 15px;\n    height: 15px;\n    vertical-align: middle;\n    margin-top: 3px;\n    margin-right: 10px;\n}\n.lishiInfo{\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n}\n.history .icon-clear{\n    display: inline-block;\n    width: 12px;\n    height: 12px;\n    vertical-align: middle;\n    fill: #999;\n    position: relative;\n    top: 4px;\n    right: 0;\n}", ""]);

// exports


/***/ })
/******/ ]);