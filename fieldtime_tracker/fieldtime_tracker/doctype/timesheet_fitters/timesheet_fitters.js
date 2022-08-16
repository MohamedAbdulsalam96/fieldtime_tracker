// Copyright (c) 2022, Jide Olayinka and contributors
// For license information, please see license.txt

frappe.ui.form.on('Timesheet Fitters', {
	// refresh: function(frm) {

	// }
});

frappe.ui.form.on("Hours Fitters Project", {	

	from_time: function(frm, cdt, cdn) {
		//calculate_ento_timed_time(frm, cdt, cdn);
	},

	to_time: function(frm, cdt, cdn) {
		
		var child = locals[cdt][cdn];

		//if(frm._setting_hours) return;
		

		var hours = moment(child.to_time).diff(moment(child.from_time), "seconds") / 3600;
		//var hours = moment("04:02:24").diff(moment("02:11:29"), "hours");
		console.log('got: ',hours);
		
		frappe.model.set_value(cdt, cdn, "hours_spend", hours);
		//frappe.model.set_value(cdt, cdn, "hours_spend", 3.0);
	},

	hours_spend: function(frm, cdt, cdn) {
		calculate_end_time(frm, cdt, cdn);
	},
});

var calculate_end_time = function(frm, cdt, cdn) {
	let child = locals[cdt][cdn];

	if(!child.from_time) {
		// if from_time value is not available then set the current datetime
		frappe.model.set_value(cdt, cdn, "from_time", frappe.datetime.get_datetime_as_string());
	}

	let d = moment(child.from_time);
	if(child.hours) {
		d.add(child.hours, "hours_spend");
		frm._setting_hours = true;
		frappe.model.set_value(cdt, cdn, "to_time",
			d.format(frappe.defaultDatetimeFormat)).then(() => {
			frm._setting_hours = false;
		});
	}
};

