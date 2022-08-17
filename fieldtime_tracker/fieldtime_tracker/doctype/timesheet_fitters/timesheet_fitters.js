// Copyright (c) 2022, Jide Olayinka and contributors
// For license information, please see license.txt

frappe.ui.form.on('Timesheet Fitters', {
	
	setup: function(frm){

		frm.get_projects_hours = function(frm){
			let total_hour = 0;			
			frm.doc.time_logs.forEach(tm=>{
				total_hour += flt(tm.hours_spend);				
				
			})
			frm.set_value("total_project_time",total_hour);
			// total_work_time			
			
		}

		frm.get_total_hours = function(frm){
			let total_hour = 0;
			total_hour = frm.doc.total_project_time - frm.doc.break_time - (1/2*(frm.doc.travel_time-frm.doc.driver_time))
			frm.set_value("total_work_time",total_hour);
			
			
		}
	},
	refresh: function(frm) {
		
		if(frm.is_new()){ 
			//&& !cur_frm.is_dirty()

			//frm.set_df_property("expense_type", "options", []);//clear all options
			cur_frm.set_value("expense_type", "Whole Day");
			frm.set_value("expense_value",28);
		}

	},
	break_time:function(frm){
		//stat
		frm.get_projects_hours(frm);
		frm.get_total_hours(frm);
		
		frm.refresh_field();
	},
	travel_time:function(frm){
		//stat
		frm.get_projects_hours(frm);
		frm.get_total_hours(frm);
		
		frm.refresh_field();
	},
	driver_time:function(frm){
		//stat
		frm.get_projects_hours(frm);
		frm.get_total_hours(frm);
		
		frm.refresh_field();
	},
	expense_type: function(frm){		
		if (frm.doc.expense_type =="Arrival or Departure"){
			frm.set_value("expense_value",14);
		}
		if (frm.doc.expense_type =="Whole Day"){
			frm.set_value("expense_value",28);
		}

	}

});

frappe.ui.form.on("Hours Fitters Project", {	

	from_time: function(frm, cdt, cdn) {
		calculate_ento_timed_time(frm, cdt, cdn);
	},

	to_time: function(frm, cdt, cdn) {
		
		var child = locals[cdt][cdn];

		if(frm._setting_hours) return;		

		var hours = moment(child.to_time).diff(moment(child.from_time), "seconds") / 3600;
		
		frappe.model.set_value(cdt, cdn, "hours_spend", hours);


		frm.get_projects_hours(frm);
		frm.refresh_field('time_logs');
		frm.get_total_hours(frm);
		
		
	},

	hours_spend: function(frm, cdt, cdn) {
		calculate_end_time(frm, cdt, cdn);

		/* frm.get_total_hours(frm);		
		frm.refresh_field('time_logs'); */
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

