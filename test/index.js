var table1;
var table2;

$(function () {
	table1 = $('#table1').DataTable({
		columnDefs: [
			{ targets: 0, type: 'string', columntools: true },
			{ targets: 1, type: 'num' }
		]
	});

	table2 = $('#table2').DataTable({
		columnDefs: [
			{ targets: 0, type: 'string', columntools: false },
			{ targets: 1, type: 'num', columntools: true }
		]
	});

	// Testing out buttons

	let btn = $('<button/>')
		.addClass('btn btn-sm btn-primary ml-auto')
		.text('=')
		.on('click', function (event) {
			if (event.target == event.currentTarget) {
				event.stopPropagation();
				event.preventDefault();
				console.log('click!!');
			}
		});

	table1.tables().init();
});
