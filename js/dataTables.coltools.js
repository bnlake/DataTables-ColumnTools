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
	DataTable.coltools.init = function (dt) {};

	$(document).on('preInit.dt', function (event, settings) {
		settings.aoColumns.forEach(function (dtColumn, index) {
			let $th = $(dtColumn.nTh);
			let tableId = $th.closest('table')[0].id;

			$('<button/>')
				.text('=')
				.addClass('btn btn-sm btn-primary')
				.attr('data-table', tableId)
				.on('click', function (event) {
					event.stopPropagation();
					event.preventDefault();
					console.log(
						`clicked for table: ${tableId} column: ${index}`
					);
				})
				.appendTo($th);
		});
	});
});
