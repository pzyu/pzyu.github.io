# CS4249 Assignment 1
## Introduction
The interface has been simplified to show only the necessary information for the experiment participants. The participants should have read the interface instructions and completed the practice trials before attempting the main experiment. The experiment process has also been improved to support trials per condition, and to provide feedback such as completion percentage, color feedback for item selected, as well as disabling of components when they are not needed. 

Participants carry out 12 conditions each having 3 trials for a total of 36 trials. Multiple attempts are allowed and thus trials are only considered to be complete only when the participant has selected the correct menu item. 

## Carrying out the experiment
A simple drop down list of all the participants is provided for the experiment conductor to select the participants's ID and to populate their corresponding conditions. This should be done before the participants begins the experiment.

## Changes made
### Interface
The interface can be broken down into 6 sections:
1. Progress Bar
    - Displays the completion percentage of the experiment so participants have an idea which stage of the experiment they are at. Percentage was chosen over trial numbers for the sake of abstractness, 50% completion looks more positive than 50/100.
2. Instructions
    - Tells the participant which menu item they have to select and how many more times. The participants do not have to know explicitly which trial they are at, instead they only have to focus on current objective, which how many more times they have to select a menu item. Also, once the condition is complete, the instructions prompt the participant to click on the next button.
3. You Selected
    - Displays the menu item that the participant has selected. While the default functionality of having the text change when a menu item is selected provides some feedback, it does not immediately let the participant know whether they have selected the correct menu item. Adding color to the selected item (i.e. Green for correct, red for incorrect) makes the selection clear. This element also resets when the participant opens a new menu, indicating that they have returned back to the neutral state.
4. Menu and Usage
    - Displays which menu the participant is currently working with, as well as short usage instructions with bolded action words which they can quickly refer to in case they have forgotten the instructions given before the experiment.
5. Next Button
    - Validates when the 3 trials for a condition are complete. While the trials are still ongoing, this button is disabled to prevent user error. Upon completion of the trials, the button is re-enabled with a color change to the same orange as the canvas to indicate that action can be taken there.
6. Canvas
    - The canvas is hidden once the 3 trials for a condition are complete, this shifts the participant's attention away from the canvas and to the next button instead.

### Menus
#### Marking Menu
The marking menu was updated to support menu breadth of 2. Before it would only offset menu items by 90 degrees, but the source code has been modified to offset menu items by 180 degrees when the list of items is only 2.
#### Radial Menu
There were a few changes made to the radial menu for the sake of consistency across both menus:
1. Font: Font family changed to "sans-serif", size "24", and color "#333333".
2. Background color: Changed to "#F2F2F2".
3. Position: Modified to be center aligned with the cursor.
4. Rotation: Rotation was removed to maintain position consistency within sub menus. Previously the menu rotates according to mouse position but it is not needed in this experiment.

### Experiment Tracker
Here are a few changes made to the experiment tracker:
1. Functionality for trials per condition is added.
2. Additionally tracks: Condition, trial, attempts, menu breadth, and number of mouse clicks.

### Others
1. A warning shows up when the user tries to refresh the page to prevent accidental navigation away from the interface.