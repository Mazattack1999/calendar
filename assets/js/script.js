var hoursList = $(".container");
var dateText = $("#currentDay");
var interval;
var startHour = 9;
var endHour = 17;
var date = moment();
var hour = date.hour();

var descriptions = [];

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
    loadDescriptions();
    
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

        // get section text from descriptions array
        getSectionText(eventSection);
        saveDescriptions();
        // updateEventSection(eventSection);
        

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

    $(".description").each(function(index) {
        var tempHour = $(this).parent().attr("data-hour");
        
        determineBackgroundColor($(this), tempHour);
    })
}

function updateDateText() {
    // update date and hour variables
    date = moment();
    hour = date.hour();
    

    // set the text
    dateText.text(date.format("dddd, MMMM Do"));
}

// load descriptions on start up
function loadDescriptions() {
    // check if descritpions are in local storage
    if (!localStorage.getItem("descriptions")) {
        saveDescriptions();
    } else {
        descriptions = JSON.parse(localStorage.getItem("descriptions"));
    }
}

function saveDescriptions() {
    // saves all descriptions to local storage
    localStorage.setItem("descriptions", JSON.stringify(descriptions));
}

function updateEventSection(section){
    // get and set section text
    getSectionText(section);
    saveDescriptions();
}

function getSectionText(section){
    // check if descriptions array has section text
    var tempHour = section.parent().attr("data-hour");

    for (var i = 0; i < descriptions.length; i++) {
        if (tempHour === descriptions[i].dHour) {
            section.val(descriptions[i].description);
            return;
        }
    }

    // if no description is returned, append object
    descriptions.push({
        description: section.val(),
        dHour: tempHour
    })
}

function setSectionText(section) {
    var tempHour = section.parent().attr("data-hour");

    // find correct description index
    for (var i = 0; i < descriptions.length; i++) {
        if (tempHour === descriptions[i].dHour) {
            descriptions[i].description = section.val();
            return;
        }
    }
}

// event listeners

// when save button is clicked, save description box text to local storage
$(".container").on("click", ".saveBtn", function(){
    var eventSection = $(this).parent().children(".description");
    setSectionText(eventSection);
    saveDescriptions();
    
});

createPlanner();
startInterval();
