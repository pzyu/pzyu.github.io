'use strict';

// Location of data files
const conditionsFile = "./data/experiments_p"
const conditionsFileExt = ".csv"
var currentConditionsFile = ""

const menuL1File = "./data/menu_depth_1.csv"
const menuL2File = "./data/menu_depth_2.csv"
const menuL3File = "./data/menu_depth_3.csv"
const menuL1B2File = "./data/menu_depth_1_breadth_2.csv"
const menuL2B2File = "./data/menu_depth_2_breadth_2.csv"
const menuL3B2File = "./data/menu_depth_3_breadth_2.csv"

var participant = 0;

// Global variables
var menu;
var conditionsData = [];
var numConditions = 0;
var currentCondition = 1;
var numTrials = 3;
var currentTrial = 1;
var targetItem;
var isTrialCompleted = false;
var isConditionCompleted = false;
var currentCompletion = 0;
var markingMenuL1 = [];
var markingMenuL2 = [];
var markingMenuL3 = [];
var markingMenuL1B2 = [];
var markingMenuL2B2 = [];
var markingMenuL3B2 = [];
var radialMenuTree = null;
var radialMenuL1 = [];
var radialMenuL2 = [];
var radialMenuL3 = [];
var radialMenuL1B2 = [];
var radialMenuL2B2 = [];
var radialMenuL3B2 = [];
var tracker = new ExperimentTracker();
var markingMenuSubscription = null;
var radialMenuSvg = null;

var instructions = "Please select: ";
var trialCompletedPrompt = "Please click on the <b>Next</b> button";

var radialHintMouse = "<u>Usage:</u>" +
    "\n1.) <b>Click</b> the <b>Right Mouse Button</b> to see a list of items you can select." +
    "\n2.) <b>Click</b> on the item with the <b>Left Mouse Button</b> to select it.";

var markingHintMouse = "<u>Usage:</u>" +
    "\n1.) <b>Hold down</b> the <b>Left Mouse Button</b> to see a list of items you can select." +
    "\n2.) <b>Hover</b> over the item while the button is pressed and <b>release</b> to select it." +
    "\n3.) You can also perform a fast select by executing the same marking gesture quickly.";

// Warning so users don't accidentally refresh page
window.onbeforeunload = function() {
    //return true;
};

// Load CSV files from data and return text
function getData(relativePath) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", relativePath, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

// Change participant
function changeParticipant(value) {
    // 4 sets of conditions, but 8 participants
    // Each set is tested by 2 participants
    participant = value;
    
    var fileToUse = value % 4 == 0 ? 4 : value % 4;
    
    currentConditionsFile = conditionsFile + fileToUse + conditionsFileExt;
    console.log(participant + " using: " + currentConditionsFile);
    
    initExperiment();
}

// Loads the CSV data files on page load and store it to global variables
function initExperiment() {

    // Get Trails
    var data = getData(currentConditionsFile);

    var records = data.split("\n");
    numConditions = records.length - 1;
    for (var i = 1; i <= numConditions; i++) {
        var cells = records[i].split(",");
        var menuType = cells[0].trim();
        var menuDepth = cells[1].trim();
        var targetItem = cells[2].trim();
        var menuBreadth = cells[3].trim();
        conditionsData[i] = {
            'Menu Type': menuType,
            'Menu Depth': menuDepth,
            'Target Item': targetItem,
            'Menu Breadth': menuBreadth
        };
    }
    
    document.getElementById("interaction-container").onmousedown = contextMouseDown;
    
    tracker.id = participant;

    // Get Menus
    var menuL1Data = getData(menuL1File);
    var menuL2Data = getData(menuL2File);
    var menuL3Data = getData(menuL3File);
    
    var menuL1B2Data = getData(menuL1B2File);
    var menuL2B2Data = getData(menuL2B2File);
    var menuL3B2Data = getData(menuL3B2File);

    // Format CSV Menu to respective Menu structures
    markingMenuL1 = formatMarkingMenuData(menuL1Data);
    markingMenuL2 = formatMarkingMenuData(menuL2Data);
    markingMenuL3 = formatMarkingMenuData(menuL3Data);
    radialMenuL1 = formatRadialMenuData(menuL1Data);
    radialMenuL2 = formatRadialMenuData(menuL2Data);
    radialMenuL3 = formatRadialMenuData(menuL3Data);
    
    markingMenuL1B2 = formatMarkingMenuData(menuL1B2Data);
    markingMenuL2B2 = formatMarkingMenuData(menuL2B2Data);
    markingMenuL3B2 = formatMarkingMenuData(menuL3B2Data);
    radialMenuL1B2 = formatRadialMenuData(menuL1B2Data);
    radialMenuL2B2 = formatRadialMenuData(menuL2B2Data);
    radialMenuL3B2 = formatRadialMenuData(menuL3B2Data);

    //Start the first condition
    nextCondition();
    updateNextButton();
    updateInstructions();
}

function contextMouseDown() {
    tracker.clicks++;
}

// Wrapper around nextcondition() to prevent click events while loading menus
function loadNextCondition(e) {
    // console.log("Trials: " + currentTrial + " /" + numTrials + " - " + isConditionCompleted);
    // Only allow clicking of next when current trial is completed
    if (isConditionCompleted) {
        currentTrial = 1;
        isTrialCompleted = false;
        isConditionCompleted = false;
        updateNextButton();
        updateInstructions();

        e.preventDefault();
        nextCondition();
    }
}

// Move to next condition and record events
function nextCondition() {


    if (currentCondition <= numConditions) {
        // Get variables from experiments.csv
        var menuType = conditionsData[currentCondition]['Menu Type'];
        var menuDepth = conditionsData[currentCondition]['Menu Depth'];
        var menuBreadth = conditionsData[currentCondition]['Menu Breadth'];
        targetItem = conditionsData[currentCondition]['Target Item'];

        // console.log(conditionsData[currentCondition]);

        updateInstructions();
        resetSelectedItem();

        // Add condition to tracker
        tracker.newCondition();
        tracker.condition = currentCondition;
        tracker.menuType = menuType;
        tracker.menuDepth = menuDepth;
        tracker.targetItem = targetItem;
        tracker.menuBreadth = menuBreadth;

        if (menuType === "Marking") {

            initializeMarkingMenu();

            if (menuDepth == 1) {
                if (menuBreadth == 2) {
                    menu = MarkingMenu(markingMenuL1B2, document.getElementById('marking-menu-container'));
                } else {
                    menu = MarkingMenu(markingMenuL1, document.getElementById('marking-menu-container'));
                }
            } else if (menuDepth == 2) {
                if (menuBreadth == 2) {
                    menu = MarkingMenu(markingMenuL2B2, document.getElementById('marking-menu-container'));
                } else {
                    menu = MarkingMenu(markingMenuL2, document.getElementById('marking-menu-container'));
                }
            } else if (menuDepth == 3) {
                if (menuBreadth == 2) {
                    menu = MarkingMenu(markingMenuL3B2, document.getElementById('marking-menu-container'));
                } else {
                    menu = MarkingMenu(markingMenuL3, document.getElementById('marking-menu-container'));
                }
            }

            markingMenuSubscription = menu.subscribe((selection) => markingMenuOnSelect(selection));

            // Set hints
            document.getElementById("hints-header").innerHTML = "Marking Menu";
            document.getElementById("hints").innerHTML = markingHintMouse;

        } else if (menuType === "Radial") {

            initializeRadialMenu();
            if (menuDepth == 1) {
                if (menuBreadth == 2) {
                    menu = createRadialMenu(radialMenuL1B2);
                } else {
                    menu = createRadialMenu(radialMenuL1);
                }
            } else if (menuDepth == 2) {
                if (menuBreadth == 2) {
                    menu = createRadialMenu(radialMenuL2B2);
                } else {
                    menu = createRadialMenu(radialMenuL2);
                }
            } else if (menuDepth == 3) {
                if (menuBreadth == 2) {
                    menu = createRadialMenu(radialMenuL3B2);
                } else {
                    menu = createRadialMenu(radialMenuL3);
                }
            }

            // Set hints
            document.getElementById("hints-header").innerHTML = "Radial Menu";
            document.getElementById("hints").innerHTML = radialHintMouse;
        }

        currentCondition++;
    } else {
        var nextButton = document.getElementById("nextButton");
        nextButton.innerHTML = "Complete";
        tracker.toCsv();
    }
}

/*Functions related to MarkingMenu*/

// Reconstructs marking menu container
function initializeMarkingMenu() {

    //Unload Radial Menu
    var radialMenuContainer = document.getElementById('radial-menu-container');
    if (radialMenuContainer != null) {
        radialMenuContainer.parentNode.removeChild(radialMenuContainer);
    }

    // Load Marking Menu
    var interactionContainer = document.getElementById('interaction-container');
    if (markingMenuSubscription != null) {
        markingMenuSubscription.unsubscribe();
    }
    var markingMenuContainer = document.getElementById('marking-menu-container');
    if (markingMenuContainer == null) {
        interactionContainer.innerHTML += "<div id=\"marking-menu-container\" style=\"height:75%;width:100%\" onmousedown=\"markingMenuOnMouseDown()\" oncontextmenu=\"preventRightClick(event)\"></div>";
    }
}

//Formats csv menu data in the structure accepted by radial menu
// Assumes menu csv is sorted by Id and Parent both Ascending
function formatMarkingMenuData(data) {
    var records = data.split("\n");
    var numRecords = records.length;
    var menuItems = {}

    // Parse through the records and create individual menu items
    for (var i = 1; i < numRecords; i++) {
        var items = records[i].split(',');
        var id = items[0].trim();
        var label = items[2].trim();
        menuItems[id] = {
            'name': label,
            'children': []
        };
    }

    for (var i = numRecords - 1; i >= 1; i--) {
        var items = records[i].split(',');
        var id = items[0].trim();
        var parent = items[1].trim();
        if (parent === '0') {
            continue;
        } else {
            var children = menuItems[parent]['children'];
            children.push(menuItems[id]);
            delete menuItems[id]
            menuItems[parent]['children'] = children;
        }
    }

    var menuItemsList = [];
    for (var key in menuItems) {
        menuItemsList.push(menuItems[key]);
    }

    return menuItemsList;
}

// Function to start tracking timer on mouse down
function markingMenuOnMouseDown() {
    resetSelectedItem();
    tracker.startTimer();
}

//Function to start tracking timer on mouse down
function markingMenuOnSelect(selectedItem) {
    tracker.trial = currentTrial;
    //console.log("Target: " + targetItem + " | Selected: " + selectedItem.name);
    //console.log("Current trial: " + tracker.trial + " attempt: " + tracker.attempt);

    // Only update trial when user has suceeded
    if (targetItem == selectedItem.name) {
        document.getElementById("selectedItem").style.backgroundColor = "#5cb85c";
        addAndUpdateTrial();
    } else {
        document.getElementById("selectedItem").style.backgroundColor = "#d9534f";
    }


    tracker.recordSelectedItem(selectedItem.name);
    document.getElementById("selectedItem").innerHTML = selectedItem.name;

    if (isTrialCompleted) {
        tracker.newTrial();
        isTrialCompleted = false;
    }
}

function preventRightClick(e) {
    e.preventDefault();
}

// Function to update trial number 
function addAndUpdateTrial() {
    if (currentTrial <= numTrials) {
        isTrialCompleted = true;

        currentTrial++;
        currentCompletion++;
    } else {
        isTrialCompleted = false;
    }

    if (currentTrial > numTrials) {
        isConditionCompleted = true;
    } else {
        isConditionCompleted = false;
    }

    updateInstructions();
    updateNextButton();

    var completion = Math.floor(((currentCompletion) / (numTrials * numConditions)) * 100) + "%";
    document.getElementById("completion").innerHTML = completion;
    document.getElementById("progressBar").style.width = completion;
}

// Function to update Next button 
function updateNextButton() {
    document.getElementById("nextButton").disabled = !isConditionCompleted;
    document.getElementById("interaction-container").style.display = isConditionCompleted ? "none" : "block";
    document.getElementById("nextButton").style.backgroundColor = isConditionCompleted ? "#f0ad4e" : "#337ab7";
}

// Function to update instructions 
function updateInstructions() {
    // Set instructions
    if (isConditionCompleted) {
        document.getElementById("instructions").innerHTML = trialCompletedPrompt;
    } else {
        var timesCompleted = "<u>" + (numTrials - currentTrial + 1) + "</u> more times";
        document.getElementById("instructions").innerHTML = instructions + "<b>" + targetItem + "</b> " + timesCompleted;
    }
}

function resetSelectedItem() {
    document.getElementById("selectedItem").style.backgroundColor = "#444444";
    document.getElementById("selectedItem").innerHTML = "&nbsp;"
}

/*Functions related to RadialMenu*/

// Reconstructs radial menu container
function initializeRadialMenu() {

    // Unload Marking Menu
    if (markingMenuSubscription != null) {
        markingMenuSubscription.unsubscribe();
    }
    var markingMenuContainer = document.getElementById('marking-menu-container');
    if (markingMenuContainer != null) {
        markingMenuContainer.parentNode.removeChild(markingMenuContainer);
    }



    // Reload Radial Menu
    var interactionContainer = document.getElementById('interaction-container');
    var radialMenuContainer = document.getElementById('radial-menu-container');
    if (radialMenuContainer == null) {
        interactionContainer.innerHTML += "<div id=\"radial-menu-container\" style=\"height:75%;width:100%\" oncontextmenu=\"toggleRadialMenu(event)\"></div>";
    }

}

// Create radial menu svg element
function createRadialMenu(radialMenuL) {

    var radialmenuElement = document.getElementById('radialmenu');
    if (radialmenuElement != null) {
        radialmenuElement.parentNode.removeChild(radialmenuElement);
    }


    var w = window.innerWidth;
    var h = window.innerHeight;
    var radialMenuSvgElement = document.getElementById('radial-menu-svg');
    if (radialMenuSvgElement != null) {
        radialMenuSvgElement.parentNode.removeChild(radialMenuSvgElement);
    }
    radialMenuSvg = d3.select("#radial-menu-container").append("svg").attr("width", w).attr("height", h).attr("id", "radial-menu-svg");
    radialMenuTree = radialMenuL;
    return radialMenuSvg;
}

// Toggle radial menu on right click
function toggleRadialMenu(e) {

    if (tracker.startTime == null) {
        if (radialMenuTree != null) {
            menu = module.exports(radialMenuTree, {
                x: e.clientX - 25,
                y: e.clientY - 200
            }, radialMenuSvg);

            // Start timing once menu appears
            tracker.startTimer();
            resetSelectedItem();
        }
    } else {

        // Record previous item
        tracker.recordSelectedItem(null);

        if (radialMenuTree != null) {
            menu = module.exports(radialMenuTree, {
                x: e.clientX - 25,
                y: e.clientY - 200
            }, radialMenuSvg);

            // Start timing once menu appears
            tracker.startTimer();
            resetSelectedItem();
        }
    }
    e.preventDefault();
}

//Callback for radialmenu when a leaf node is selected
function radialMenuOnSelect() {
    tracker.trial = currentTrial;

    // Only update trial when user has suceeded
    if (targetItem == this.id) {
        document.getElementById("selectedItem").style.backgroundColor = "#5cb85c";
        addAndUpdateTrial();
    } else {
        document.getElementById("selectedItem").style.backgroundColor = "#d9534f";
    }

    tracker.recordSelectedItem(this.id);
    var radialmenu = document.getElementById('radialmenu');
    radialmenu.parentNode.removeChild(radialmenu);

    document.getElementById("selectedItem").innerHTML = this.id;

    if (isTrialCompleted) {
        tracker.newTrial();
        isTrialCompleted = false;
    }
}

//Formats csv menu data in the structure accepted by radial menu
// Assumes menu csv is sorted by Id and Parent both Ascending
function formatRadialMenuData(data) {

    var records = data.split("\n");
    var numRecords = records.length;
    var menuItems = {}



    // Parse through the records and create individual menu items
    for (var i = 1; i < numRecords; i++) {
        var items = records[i].split(',');
        var id = items[0].trim();
        var label = items[2].trim();
        menuItems[id] = {
            'id': label,
            'fill': "#39d",
            'name': label,
            '_children': []
        };
    }

    for (var i = numRecords - 1; i >= 1; i--) {
        var items = records[i].split(',');
        var id = items[0].trim();
        var parent = items[1].trim();
        if (parent === '0') {
            continue;
        } else {
            var _children = menuItems[parent]['_children'];
            if (menuItems[id]['_children'].length == 0) {
                menuItems[id]['callback'] = radialMenuOnSelect;
            }
            _children.push(menuItems[id]);
            delete menuItems[id];
            menuItems[parent]['_children'] = _children;
        }
    }


    var menuItemsList = [];
    for (var key in menuItems) {
        if (menuItems[key]['_children'].length == 0) {
            delete menuItems[key]['_children'];
            menuItems[key]['callback'] = radialMenuOnSelect;
        } else {
            delete menuItems[key]['callback'];
        }
        menuItemsList.push(menuItems[key]);
    }

    return {
        '_children': menuItemsList
    };

}
