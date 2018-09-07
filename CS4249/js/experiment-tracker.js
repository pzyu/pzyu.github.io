// Class used to track experiment
class ExperimentTracker {


	constructor() {
		this.conditions = [];
		this.attempt = 0;
        this.trial = 0;
		this.condition = null;
		this.menuType = null;
		this.menuDepth = null;
        this.menuBreadth = null;
		this.targetItem = null;
		this.selectedItem = null;
		this.startTime = null;
		this.endTime = null;
	}
	
	resetTimers(){
		this.startTime = null;
		this.endTime = null;
	}

	startTimer() {
		this.startTime = Date.now();
	}

	recordSelectedItem(selectedItem) {
		this.selectedItem = selectedItem;
		this.stopTimer();
	}

	stopTimer() {
		this.attempt++;
		
		this.endTime = Date.now();
        var diff = this.endTime - this.startTime;
		this.conditions.push([this.condition, this.trial, this.attempt, this.menuType, this.menuBreadth, this.menuDepth, this.targetItem, this.selectedItem, this.startTime, this.endTime, diff])
		this.resetTimers();

	}

	newCondition() {
		this.trial = 1;
        this.attempt = 0;
	}
    
    newTrial() {
        this.attempt = 0;
    }

	toCsv() {
		var csvFile = "Condition,Trial,Attempt,Menu Type,Menu Breadth,Menu Depth,Target Item,Selected Item,Start Time, End Time, Time Taken (ms)\n";
		for (var i = 0; i < this.conditions.length; i++) {
			csvFile += this.conditions[i].join(',');
			csvFile += "\n";
		}

		var hiddenLink = document.createElement('a');
		hiddenLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvFile);
		hiddenLink.target = '_blank';
		hiddenLink.download = 'experiment.csv';
		document.body.appendChild(hiddenLink);
		hiddenLink.click();
	}


}