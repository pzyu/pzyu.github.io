// Class used to track experiment
class ExperimentTracker {


	constructor() {
		this.conditions = [];
		this.attempt = 0;
        this.trial = 0;
        this.trialsPerCondition = 3;
		this.condition = 1;
		this.menuType = null;
		this.menuDepth = null;
        this.menuBreadth = null;
		this.targetItem = null;
		this.selectedItem = null;
		this.startTime = null;
		this.endTime = null;
        this.clicks = 0;
        this.id = null;
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
        
        console.log(this);
		
		this.endTime = Date.now();
        var diff = this.endTime - this.startTime;
		this.conditions.push([this.condition, this.trial, this.attempt, this.menuType, this.menuBreadth, this.menuDepth, this.targetItem, this.selectedItem, this.startTime, this.endTime, diff, this.clicks])
		this.resetTimers();

	}

	newCondition() {
		//this.trial = 1;
        this.trial++;
        if (this.trial > this.trialsPerCondition) {
            console.log("Reset");
            this.trial = 1;
            this.condition++;
        }
        
        
        this.attempt = 0;
        this.clicks = 0;
	}
    
    newTrial() {
        this.attempt = 0;
    }

	toCsv() {
		var csvFile = "Condition,Trial,Attempt,Menu Type,Menu Breadth,Menu Depth,Target Item,Selected Item,Start Time, End Time, Time Taken (ms), Mouse Clicks\n";
		for (var i = 0; i < this.conditions.length; i++) {
			csvFile += this.conditions[i].join(',');
			csvFile += "\n";
		}

		var hiddenLink = document.createElement('a');
		hiddenLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvFile);
		hiddenLink.target = '_blank';
		hiddenLink.download = 'experiment_p' + this.id + '.csv';
		document.body.appendChild(hiddenLink);
		hiddenLink.click();
	}


}