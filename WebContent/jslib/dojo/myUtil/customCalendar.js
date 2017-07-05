// dojo.provide allows pages to use all of the types declared in this resource.

define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", "./templates/customCalendar.html", 
        "dojo/dom-style", "dijit/Calendar", "dojo/dom-construct", "dijit/form/Button", "dojo/on", 
        "dojo/date/locale","dojo/date", "dojo/_base/lang", "dojo/_base/connect", "dojo/domReady!"],
		function(declare, WidgetBase, TemplatedMixin, template, domStyle, Calendar, domConstruct, 
				Button, on, locale, dojoDate, lang, connect){
	        return declare([WidgetBase, TemplatedMixin], {
	            templateString: template,
	        	selectedDate : null,
	        	calendarInstance : null,	//our calendar
	        	bookingWindowMaxDate: null,
	        	bookingWindowMinDate : null,
	        	onValueSelectedPublishIDString : null,
	        	currentFocusDate : null,
	        	calendarFollowingMonthButton : null,
	        	calendarPreviousMonthButton : null,
	            
	            constructor: function myUtil_custom_calendar_constructor(args){
	            	if(args){
	            		lang.mixin(this,args);
	            	}
	            },
	            
	            postCreate : function myUtil_custom_calendar_postCreate(){

	        		this.bookingWindowMinDate = locale.parse(this.bookingWindowMinDate, {formatLength:'short', selector:'date', locale:'en-us'});
	        		this.bookingWindowMaxDate = locale.parse(this.bookingWindowMaxDate, {formatLength:'short', selector:'date', locale:'en-us'});
	        		this.currentFocusDate = this.selectedDate = locale.parse(this.selectedDate, {formatLength:'short', selector:'date', locale:'en-us'});
	        		this.calendarInstance = this.createCalendar(this.selectedDate, this.calendarMonthOneAttachPoint);
	        		this.calendarInstance.monthWidget.set("disabled", true);
	        		
	        		 this.calendarPreviousMonthButton = new Button({
	        		        label: "<<",
	        		        onClick: lang.hitch(this, function(){
	    						this.goToPreviousMonth(this.calendarInstance);
	    					})
	        		   }, this.calendarPreviousMonthButtonAP);
	        		 
	        		 this.calendarFollowingMonthButton = new Button({
	        		        label: ">>",
	        		        onClick: lang.hitch(this, function(){
	        		        	this.goToNextMonth(this.calendarInstance);
	    					})
	        		   }, this.calendarFollowingMonthButtonAP);


	        		//Check whether to disable the next and previous buttons or not for first time calendar view
	        		if(this.isLastCalendarMonth(this.bookingWindowMaxDate, this.currentFocusDate)){
	        			calendarFollowingMonthButton.set("disabled", true);
	        		}
	        		if(this.isLastCalendarMonth(this.bookingWindowMinDate, this.currentFocusDate)){
	        			calendarPreviousMonthButton.set("disabled", true);
	        		}
	        	},
	        	
	        	createCalendar : function myUtil_custom_calendar_createCalendar(selectedDate, calendarAttachPoint){
	        		//Summary: 
	        		// Initialize the actual calendar object. selectedDate in millisecond
	        		//
	        		//Description:
	        		// This is where we initialize the calendar. We override 3 methods in the calendar object
	        		// 1.isDisabledDate: We disable the dates that are outside the booking window.
	        		// We also disable the dates in the month view that are not in the current month. ie: If we are in April 2011 view, 
	        		// we would normally see the last few days in March in the first line of the calendar and few days from May 
	        		// in the last line of the calendar. 
	        		// 2. getClassForDate: We return different styling based on the day. 
	        		// We can indicate whether it is an available or unavailable check in date. Or if the date is selected. 
	        		// 3.onChange: When user clicks on a day we call our own method
	        		//
	        		//Return: 
	        		// Nothing

	        		var parent = this;

	        		return new Calendar({
	        			value : selectedDate,
	        			currentFocus : selectedDate,
	        			isDisabledDate: function(date) {
        					if(dojoDate.difference(parent.currentFocusDate, date, "month")!==0){ //disable any day that doesn't belong to current month
        						return true;
        					}
        					if(dojoDate.difference(parent.bookingWindowMinDate, date, "day")<0 ||
        							dojoDate.difference(parent.bookingWindowMaxDate, date, "day")>0){
        						return true;
        					}
        					else {
        						return false;
        					}
	        			},
	        			getClassForDate: function(date) {	
        					if(dojoDate.difference(parent.currentFocusDate, date, "month")!==0){ //hide any day that doesn't belong to current month
        						return "hiddenDay";
        					}
        					if(dojoDate.difference(parent.bookingWindowMinDate, date, "day")<0 ||
        							dojoDate.difference(parent.bookingWindowMaxDate, date, "day")>0 ){
        						return "disabled";
        					}
	        				if ( dojoDate.compare(date,parent.selectedDate,"date") === 0) {
	        					return "Available";
	        				} 
	        			},
	        			onChange : lang.hitch(this, function(date){
	        				this.onValueSelected(date);
	        			}) 
	        		},  domConstruct.create("div", {}, calendarAttachPoint));
	        	},
	        	
	        	goToPreviousMonth : function myUtil_custom_calendar_goToPreviousMonth(calendarInstance){
	        		//Summary: 
	        		// Change the view of the calendar(s) to display the previous month(s)
	        		//
	        		//Description:
	        		// In this method, we check the value of current month for every calendar and move it back by 1
	        		// We also check if it's the last available month to display, then we disable the previous button
	        		// and check to enable next if needed.
	        		//Return: 
	        		// Nothing	

	        		this.currentFocusDate = dojoDate.add(this.currentFocusDate,"month",-1);
	        		calendarInstance.set("currentFocus",this.currentFocusDate);
	        		if(this.isLastCalendarMonth(this.bookingWindowMinDate, this.currentFocusDate)){
						this.calendarPreviousMonthButton.set("disabled", true);
					}//check to see if I should disable the previous button
					if(!this.isLastCalendarMonth(this.bookingWindowMaxDate, this.currentFocusDate)){
						this.calendarFollowingMonthButton.set("disabled", false);
					}//check to see if I should enable the next button
	        		
	        	},
	        	
	        	goToNextMonth : function myUtil_custom_calendar_goToNextMonth(calendarInstance){
	        		//Summary: 
	        		// Change the view of the calendar(s) to display the following month(s)
	        		//
	        		//Description:
	        		// In this method, we check the value of current month for every calendar and advance it by 1
	        		//
	        		//Return: 
	        		// Nothing	

	        		this.currentFocusDate = dojoDate.add(this.currentFocusDate,"month",1);
	        		calendarInstance.set("currentFocus",this.currentFocusDate);
	        		if(this.isLastCalendarMonth(this.bookingWindowMaxDate, this.currentFocusDate)){
		        		this.calendarFollowingMonthButton.set("disabled", true);
					}//check to see if I should disable the next button
		        	if(!this.isLastCalendarMonth(this.bookingWindowMinDate, this.currentFocusDate)){
		        		this.calendarPreviousMonthButton.set("disabled", false);
					}//check to see if I should enable the previous button

	        	},
	        	
	        	isLastCalendarMonth : function myUtil_custom_calendar_isLastCalendarMonth(limitDate, testDate){
	        		//Summary: 
	        		// Check if this will be last screen to display or we can move forward or backward
	        		//
	        		//Description:
	        		// We get the limit date (can be the minimum or maximum from booking window) 
	        		// and then every time we go to previous or following month view of the calendar we check to see 
	        		// if this is going to be the last view 
	        		// limitDate: this is either the max or min date that can't go beyond
	        		//
	        		//Return: 
	        		// true: this is the last calendar view to display
	        		// false: we still have at least one more month before we hit the limit
	        		
	        		if(limitDate.getFullYear()-testDate.getFullYear() === 0){//check if same year
	        			if(limitDate.getMonth()-testDate.getMonth() === 0){ //check if same month
	        				return true;
	        			}
	        			else {
	        				return false;
	        			}
	        		}
	        		else {
	        			return false;
	        		}
	        	},
	        	
	        	onValueSelected : function myUtil_custom_calendar_onValueSelected (date){
	        		//Summary: 
	        		// handle onChange from the calendar
	        		//
	        		//Description:
	        		// When user clicks on a day in the calendar, publish to channel 
	        		//
	        		//Return: 
	        		// Nothing
	        		
	        		connect.publish(this.onValueSelectedPublishIDString, [date]);        		
	        	}
	        });
	});
