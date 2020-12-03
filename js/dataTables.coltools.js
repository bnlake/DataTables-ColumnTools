(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net'], function ($) {
			return factory($, window, document);
		});
	} else if (typeof exports === 'object') {
		// CommonJS
		module.exports = function (root, $) {
			if (!root) {
				root = window;
			}

			if (!$ || !$.fn.dataTable) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory($, root, root.document);
		};
	} else {
		// Browser
		factory(jQuery, window, document);
	}
})(function ($, window, document, undefined) {
	'use strict';
	var DataTable = $.fn.dataTable;

	DataTable.coltools = {};

	DataTable.coltools.version = '1.0.0';

	/**
	 * Given a dataTables instance, initialization method for
	 * the coltools extension
	 * @param {object} dt DataTables instance
	 */
	DataTable.coltools.init = function (dt) {

	};
});
