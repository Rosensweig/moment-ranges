#moment-ranges is my playground for working with and extending the existing package [moment-range](https://github.com/rotaready/moment-range)
moment-range extends moment.js with support for date-time ranges.

This repository, moment-ranges, is where I've worked out array addition and subtraction with moment-range objects. This exists as a precursor to my scheduling app, enabling many events from the Google Calendar API to be quickly and easily subtracted from specified time ranges. Leaving remaining availability easily accessible as an array of time ranges.

I intend to adapt these into my open-source contribution to the moment-range package, but they exist first here independently.



Available functions:


---------------- addTwo: -------------------

Parameters: 2 moment-ranges

return: moment-range or null

Adds two overlapping or adjacent moment-ranges, and returns resultant moment-range. For instance, 2-4 PM + 4-5 PM returns 2-5 PM. Necessary because built-in moment-range add() function does NOT support adjacent ranges. Returns null if there is no overlap or touch point in parameter ranges

```
addTwo(range1, range2); // moment-range or null
```


----------------- addArray: ----------------

Parameters: array of moment-range objects

Return: array of moment-range objects

Adds an array of ranges. Returns an array with all overlapping and adjacent ranges added (combined) together, and preserves any ranges that do not overlap.
For instance, if I passed in an array of 10AM-12PM, 11AM-1PM, 2-3PM, 3-4PM, and 7-8PM, my return value would be an array of 10AM-1PM, 2-4PM, and 7-8PM.
(Times listed for simplicity, but real moment-range objects include full date as well.)

```
addArray(array); // [moment-range]
```


------------------ subtractArrays: ------------

Parameters: 2 arrays of moment-range objects

Return: array of moment-range objects (or empty array, if 2nd array overlaps ALL times in 1st array)

Subtracts all time ranges in second array from all time ranges in first array.

```
subtractArrays( array1, array2); // [moment-range]
```


---------------- subtractArrFromSingle: ---------------

Parameters: moment-range, array of moment-range objects

Return: array of moment-range objects (or empty array)

Subtracts all time ranges in array from the first moment-range

```
subtractArrFromSingle(range, array); // [moment-range]
```