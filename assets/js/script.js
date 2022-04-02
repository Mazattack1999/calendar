var hoursList = $(".container");
var dateText = $("#currentDay");
var interval;
var startHour = 1;
var endHour = 24;
var date = moment();
var hour = date.hour();

// functions 

function startInterval() {
    // update page information every 30 seconds
    interval = setInterval(function(){
        updatePlanner();
    }, 30*1000);
}

function createPlanner() {
    // update dateText
    updateDateText();
    
    for (var i = startHour; i <= endHour; i++) {
        // create a row for bootstrap 
        var row = $("<div>").addClass("row").attr("data-hour", i);
        hoursList.append(row);
    }

    // iterate over each row
    $(".row").each(function(index){
        row = $(this);
        var tempHour = row.attr("data-hour");

        // create hour section
        var hourSection = $("<div>").addClass("hour time-block col-2 col-lg-1");

        // check for am or pm
        if (tempHour < 12) {
            hourSection.text(tempHour + " AM");
        } else if (tempHour == 12) {
            hourSection.text(tempHour + " PM");
        } else {
            hourSection.text((tempHour-12) + " PM");
        }
        // append hourSection to current row
        row.append(hourSection);


        // create colored event section
        var eventSection = $("<textarea>").addClass("description col-8 col-lg-10")

        // determine background color of event section
        determineBackgroundColor(eventSection, tempHour);

        // append event section
        row.append(eventSection);
        

        // create save button
        var saveBtn = $("<div>").addClass("saveBtn col-2 col-lg-1 d-flex justify-content-center align-items-center");
        var saveIcon = $("<i>").addClass("fa-solid fa-floppy-disk");

        // append saveIcon into saveBtn
        saveBtn.append(saveIcon);
        // append saveBtn into row
        row.append(saveBtn);
        
    })
    
}

function determineBackgroundColor(section, bgHour) {
    // remove previous background color classes
    section.removeClass("past present future");

    if (bgHour < hour) {
        section.addClass("past");
    } else if (bgHour == hour) {
        section.addClass("present");
    } else {
        section.addClass("future");
    }
}

function updatePlanner() {
    updateDateText();
}

function updateDateText() {
    // update date and hour variables
    date = moment();
    hour = date.hour();

    // set the text
    dateText.text(date.format("dddd, MMMM do"));
}

// event listeners


createPlanner();
startInterval();
