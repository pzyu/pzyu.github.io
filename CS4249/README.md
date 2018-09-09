# CS4249 Assignment 1
## Introduction
The experiment interface has been simplified to show only the necessary information for the experiment subjects. The experiment process has also been improved to support trials per condition, and to provide feedback such as completion percentage, color feedback for item selected, as well as disabling of components when they are not needed. 

Subjects carry out 12 conditions each having 3 trials for a total of 72 trials. Multiple attempts are allowed and thus trials are only considered to be complete only when the subject has selected the correct menu item. 

## Carrying out the experiment
A simple drop down list of all the subjects is provided for the experiment conductor to select the subjects's ID and to populate their corresponding conditions. This should be done before the subjects begins the experiment.

## Changes made
### Interface
The interface can be broken down into 6 sections:
1. Progress Bar
    - Displays the completion percentage of the experiment so subjects have an idea which stage of the experiment they are at. Percentage was chosen over trial numbers for the sake of abstractness, 50% completion looks more positive than 50/100.
2. Instructions
    - Tells the subject which menu item they have to select and how many more times. The subjects do not have to know explicitly which trial they are at, instead they only have to focus on how many more times they have to select a menu item.
3. You Selected
    - Displays the menu item that the subject has selected. While the default functionality of having the text change when a menu item is selected provides some feedback, it does not immediately let the subject know whether they have selected the correct menu item. Adding color to the selected item (i.e. Green for correct, red for incorrect) makes the selection clear. This element also resets when the subject opens a new menu, indicating that they have returned to the neutral state.
4. Menu and Usage
    - Displays which menu the subject is currently working with, as well as short usage instructions with bolded action words which they can quickly refer to in case they have forgotten the instructions given before the experiment.
5. Next Button
    - Validates when the 3 trials for a condition are complete. While the trials are still ongoing, the button is disabled which prevents user error. Upon completion of the trials, the button is enabled and its color changes to a bright orange to indicate that action has to be taken there.
6. Canvas
    - The canvas is hidden once the 3 trials for a condition are complete, this shifts the subject's attention away from the canvas and to the next button instead.

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
