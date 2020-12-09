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

	// Used for namespacing events added to the document by each instance, so they
	// can be removed on destroy
	var _instCounter = 0;

	var ColumnTools = function (dt, config) {
		// If not created with a `new` keyword then we return a wrapper function that
		// will take the settings object for a DT. This allows easy use of new instances
		// with the `layout` option - e.g. `topLeft: $.fn.dataTable.Buttons( ... )`.
		if (!(this instanceof ColumnTools)) {
			return function (settings) {
				return new ColumnTools(settings, dt).container();
			};
		}

		// If there is no config set it to an empty object
		if (typeof config === 'undefined') {
			config = {};
		}

		// Allow a boolean true for defaults
		if (config === true) {
			config = {};
		}

		// set a configuration object for `this`
		this.c = $.extend(true, {}, ColumnTools.defaults, config);

		this.s = {
			dt: new DataTable.Api(dt),
			buttons: [], // @todo may not be using
			listenKeys: '',
			namespace: 'dtct' + _instCounter++
		};

		// set a DOM object for `this`
		this.dom = {
			container: $('<' + this.c.dom.container.tag + '/>').addClass(
				this.c.dom.container.className
			)
		};

		this._constructor();
	};

	$.extend(ColumnTools.prototype, {
		/**
		 * Return the container node
		 * @returns {jQuery}
		 */
		container: function () {
			return this.dom.container;
		},

		/**
		 * Destroy the column tools instance, cleaning up event listeners
		 * and removing DOM elements
		 */
		destroy: function () {
			// @todo implement
		},

		/**
		 * ColumnTools Constructor
		 * @private
		 */
		_constructor: function () {
			var that = this;
			var dt = this.s.dt;
			var dtSettings = dt.settings()[0]; // @todo identify this
			var columntools = this.c.columntools;

			if (!dtSettings._columntools) {
				dtSettings._columntools = [];
			}

			dtSettings._columntools.push({
				inst: this, // This column tools instance
				name: this.c.name
			});

			// @todo is this add each individual button in the container, or the containers for all datatables
			for (var i = 0, ien = buttons.length; i < ien; i++) {
				this.add(buttons[i]);
			}

			dt.on('destroy', function (e, settings) {
				if (settings === dtSettings) {
					that.destroy();
				}
			});
		},

		/**
		 * Create an individual container
		 * @param {object} config resolved columntools configuration
		 * @returns {jQuery} created container $ node
		 */
		_buildContainer: function (config) {
			// var dt = this.s.dt;
			var containerDom = this.s.dom.container;

			var tag = config.tag || containerDom.tag; // The HTML tag to be used as the container. Likely a div

			var container = $(`<${tag}/>`)
				.addClass(containerDom.className)
				.attr('aria-controls', this.s.dt.table().node().id);

			if (config.className) {
				container.addClass(config.className);
			}

			if (config.titleAttr) {
				container.attr('title', text(config.titleAttr));
			}

			if (config.attr) {
				container.attr(config.attr);
			}

			if (!config.namespace) {
				container.namespace = '.dt-columntool-' + _buttonCounter++;
			}

			return {
				config: config,
				node: container.get(0)
			};
		},

		/**
		 * @todo comment
		 * @param {object} config
		 */
		_buildToggler: function (config) {
			var togglerDom = this.s.dom.toggler;
			var tag = config.tag || togglerDom.tag;

			var toggler = $(`<${tag}/>`)
				.addClass(config.className)
				.text('=')
				.on('click', function (event) {
					console.log('clicked the opener');
				});

			return toggler;
		},

		/**
		 * @todo comment
		 * @param {object} config
		 */
		_buildSortAsc: function (config) {
			var sortascDom = this.s.dom.sort_asc;
			var tag = config.tag || sortascDom.tag;

			var sortasc = $(`<${tag}/>`)
				.addClass(config.className)
				.text('=')
				.on('click', function (event) {
					console.log('clicked the sort asc');
				});

			return sortasc;
		},

		/**
		 * @todo comment
		 * @param {object} config
		 */
		_buildSortDesc: function (config) {
			var sortdescDom = this.s.dom.sort_desc;
			var tag = config.tag || sortdescDom.tag;

			var sortdesc = $(`<${tag}/>`)
				.addClass(config.className)
				.text('=')
				.on('click', function (event) {
					console.log('clicked the sort desc');
				});

			return sortdesc;
		},

		/**
		 * @todo comment
		 * @param {object} config
		 */
		_buildFilterBox: function (config) {
			var filterDom = this.s.dom.filter;
			var tag = config.tag || filterDom.tag;

			var filter = $(`<${tag}/>`).addClass(config.className).attr('type', 'search');
			// @todo add events to search
			// @todo add listeners for other filters applied
		}
	});

	DataTable.columntools = {};

	ColumnTools.version = '1.0.0';

	ColumnTools.defaults = {
		name: 'main',
		dom: {
			toggler: {
				tag: 'div',
				className: 'dt-ct-toggler'
			},
			container: {
				tag: 'div',
				className: 'dt-columntools'
			},
			sort_asc: {
				tag: 'div',
				className: 'dt-ct-sortasc'
			},
			sort_desc: {
				tag: 'div',
				className: 'dt-ct-sortdesc'
			},
			filter: {
				tag: 'input',
				className: 'dt-ct-filter'
			}
		}
	};

	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter(settings) {
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="' + classes.sFilterInput + '"/>';

		var str = language.sSearch;
		str = str.match(/_INPUT_/) ? str.replace('_INPUT_', input) : str + input;

		var filter = $('<div/>', {
			id: !features.f ? tableId + '_filter' : null,
			class: classes.sFilter
		}).append($('<label/>').append(str));

		var searchFn = function () {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? '' : this.value; // mental IE8 fix :-(

			/* Now do the filter */
			if (val != previousSearch.sSearch) {
				_fnFilterComplete(settings, {
					sSearch: val,
					bRegex: previousSearch.bRegex,
					bSmart: previousSearch.bSmart,
					bCaseInsensitive: previousSearch.bCaseInsensitive
				});

				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw(settings);
			}
		};

		var searchDelay =
			settings.searchDelay !== null
				? settings.searchDelay
				: _fnDataSource(settings) === 'ssp'
				? 400
				: 0;

		var jqFilter = $('input', filter)
			.val(previousSearch.sSearch)
			.attr('placeholder', language.sSearchPlaceholder)
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ? _fnThrottle(searchFn, searchDelay) : searchFn
			)
			.on('mouseup', function (e) {
				// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking
				// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`
				// checks the value to see if it has changed. In other browsers it won't have.
				setTimeout(function () {
					searchFn.call(jqFilter[0]);
				}, 10);
			})
			.on('keypress.DT', function (e) {
				/* Prevent form submission */
				if (e.keyCode == 13) {
					return false;
				}
			})
			.attr('aria-controls', tableId);

		// Update the input elements whenever the table is filtered
		$(settings.nTable).on('search.dt.DT', function (ev, s) {
			if (settings === s) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if (jqFilter[0] !== document.activeElement) {
						jqFilter.val(previousSearch.sSearch);
					}
				} catch (e) {}
			}
		});

		return filter[0];
	}

	/**
	 * Given an x and y value, sets the css left and top properties of the column
	 * tools container
	 * @param {int} x
	 * @param {int} y
	 */
	function _setContainerXY(x, y) {
		let container = document.getElementsByClassName('column_tool')[0];

		container.style.top = y + 'px';
		container.style.left = x + 'px';
		return container;
	}

	/**
	 * Calculate the height of the column tools container
	 * @returns {int}
	 */
	function _getContainerHeight() {
		return document.getElementsByClassName('column_tool')[0].offsetHeight;
	}

	/**
	 * Calculate the width of the column tools container
	 * @returns {int}
	 */
	function _getContainerWidth() {
		return document.getElementsByClassName('column_tool')[0].offsetWidth;
	}

	/**
	 * Calculate the left of the column tools container
	 * @returns {int}
	 */
	function _getContainerLeft() {
		return document.getElementsByClassName('column_tool')[0].offsetLeft;
	}

	/**
	 * Calculate the top of the column tools container
	 * @returns {int}
	 */
	function _getContainerTop() {
		return document.getElementsByClassName('column_tool')[0].offsetTop;
	}

	/**
	 * Given the Y position of mouse, determines the top value that will
	 * safely position the column tools container in the window
	 * @param {int} desiredY
	 * @returns {int}
	 */
	function _getSafeContainerTop(desiredY) {
		if (desiredY + _getContainerHeight() > window.innerHeight) {
			return desiredY - _getContainerHeight();
		} else {
			return desiredY;
		}
	}

	/**
	 * Given the Y position of mouse, determines the top value that will
	 * safely position the column tools container in the window
	 * @param {int} desiredX
	 * @returns {int}
	 */
	function _getSafeContainerLeft(desiredX) {
		if (desiredX + _getContainerWidth() > window.innerWidth) {
			return desiredX - _getContainerWidth();
		} else {
			return desiredX;
		}
	}

	/**
	 * @todo
	 * @param {event} event
	 */
	function _handleOpenContainerClick(event) {
		event.stopPropagation();
		event.preventDefault();
		let tableID = event.target.dataset.table;
		let columnIDX = event.target.dataset.column;

		// Set the data properties for the container
		$('.column_tool').each(function (element) {
			$(element).attr('data-table', tableID).attr('data-column', columnIDX);
		});
		// Show the container

		// Add listeners?

		_setContainerXY(_getSafeContainerLeft(event.pageX), _getSafeContainerTop(event.pageY));
		console.log(`clicked for table: ${tableID} column: ${columnIDX}`);
	}

	/**
	 * @todo
	 * @param {event} event
	 */
	function _handleWindowResize(event) {
		if (
			window.innerWidth < _getContainerLeft() + _getContainerWidth() ||
			window.innerHeight < _getContainerTop() + _getContainerHeight()
		) {
			_setContainerXY(
				_getSafeContainerLeft(_getContainerLeft()),
				_getSafeContainerTop(_getContainerTop())
			);
		}
	}

	$.fn.dataTable.Buttons = ColumnTools;
	$.fn.DataTable.Buttons = ColumnTools;

	/**
	 * DataTables creation - check columndefs to identify which columns need a column
	 * tools objects created
	 */
	$(document).on('init.dt', function (event, settings) {
		if (event.namespace !== 'dt') {
			return;
		}

		var options = settings.oInit.columntools || DataTable.defaults.columntools;

		settings.aoColumns.forEach(function (dtColumn, index) {
			let $th = $(dtColumn.nTh);
			let tableId = $th.closest('table')[0].id;

			$('<button/>')
				.text('=')
				.addClass('btn btn-sm btn-primary')
				.attr('data-table', tableId)
				.attr('data-column', dtColumn.idx)
				.on('click', _handleOpenContainerClick)
				.appendTo($th);
		});
	});

	$(window).on('resize', _handleWindowResize);
});
