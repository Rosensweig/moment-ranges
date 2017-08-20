const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);


// modified addition for two ranges
// unlike built-in function, this adds adjacent ranges as well as overlapping ones
function addTwo(range1, range2) {
    if (range1.overlaps(range2, {adjacent: true})) {
        var start = moment.min(range1.start, range2.start);
        var end = moment.max(range1.end, range2.end);
        var sum = moment.range(start, end);
        return sum;
    } else {
        return null;
    }
}

//takes array of moment-ranges, adds them all together, returns array of moment-ranges
function addArray(ranges) {
    var origRanges = ranges;
    var newRanges = [];
    var overlap = false;
    for (var i = 0; i < origRanges.length; i += 1) {
        for (var j = i + 1; j < origRanges.length; j++) {
            if (origRanges[i].overlaps(origRanges[j], {adjacent:true})) {
                overlap = true;
                newRanges.push(addTwo(origRanges[i], origRanges[j]));
                origRanges.splice(j, 1);
                origRanges.splice(i, 1);
                if (i!=0) { i--; j-=2;}
                else {j--;}
            }
        }
    }
    if (overlap) {
        return addArray(newRanges.concat(origRanges));
    } else {
        return origRanges;
    }
}

// takes two arrays of ranges
// subtracts second array ranges from first array ranges
// returns array of ranges.
function subtractArrays(arr1, arr2) {
    var condensed1 = addArray(arr1);
    var condensed2 = addArray(arr2);
    var subtracted = [];
    for (var i = 0; i < condensed1.length; i++) {
        subtracted = subtracted.concat(subtractArrFromSingle(condensed1[i], condensed2));
    }
    return subtracted;
}

// subtracts array of moment-ranges from a single moment-range
// returns array of moment-ranges
function subtractArrFromSingle(single, array) {
    var subtracted = [];
    for (var i = 0; i < array.length; i++) {
    	if ( !(single.overlaps(array[i])) ) { continue }
    	else if (single.isSame(array[i])) {
            return subtracted;
        } else {
	        subtracted = single.subtract(array[i]);
	        if (subtracted.length === 2) {
	            return subtractArrFromSingle(subtracted[0], array.slice(i + 1))
	                .concat(subtractArrFromSingle(subtracted[1], array.slice(i + 1)));
	        } else {
	            return subtractArrFromSingle(subtracted[0], array.slice(i + 1));
	        }
    	}
    }
    return [single];
}



// Create test ranges
const start1 = moment([2017, 7, 10, 10, 30]);
const end1 = moment([2017, 7, 10, 22, 0]);
const range1 = moment.range(start1, end1);

const start2 = moment([2017, 7, 10, 12, 30]);
const end2 = moment([2017, 7, 10, 14, 0]);
const range2 = moment.range(start2, end2);

const start3 = moment([2017, 7, 10, 18, 0]);
const end3 = moment([2017, 7, 10, 20, 0]);
const range3 = moment.range(start3, end3);

const start4 = moment([2017, 7, 10, 20, 0]);
const end4 = moment([2017, 7, 10, 21, 0]);
const range4 = moment.range(start4, end4);

const start5 = moment([2017, 7, 10, 13, 0]);
const end5 = moment([2017, 7, 10, 16, 0]);
const range5 = moment.range(start5, end5);

const start6 = moment([2017, 7, 10, 10, 30]);
const end6 = moment([2017, 7, 10, 15, 0]);
const range6 = moment.range(start6, end6);

const start7 = moment([2017, 7, 10, 15, 0]);
const end7 = moment([2017, 7, 10, 22, 0]);
const range7 = moment.range(start7, end7);



//Log test results
console.log("range1: " + range1.toString());
console.log("range2: " + range2.toString());
console.log("range3: " + range3.toString());
console.log("range4: " + range4.toString());
console.log("range5: " + range5.toString());
console.log("range5: " + range6.toString());
console.log("range5: " + range7.toString());

//overlapping ranges. option to include adjacent
console.log("range2 overlaps range5: " + range2.overlaps(range5, {adjacent:true}));
console.log("range3 overlaps range4: " + range3.overlaps(range4, {adjacent:true}));

//adjacent ranges
console.log("range2 is adjacent to range5: " + range2.adjacent(range5));
console.log("range3 is adjacent to range4: " + range3.adjacent(range4));

// identical ranges
console.log("identical ranges? range2 overlaps range2: " + range2.overlaps(range2)); //true

//range.subtract returns array of ranges
//cannot chain. range1.subtract(range2).subtract(range3) crashes the server
console.log("range1 - range2: " + range1.subtract(range2));
console.log("range1 - range3: " + range1.subtract(range3));
console.log("identical ranges? range2 - range2 is still array: " + Array.isArray(range2.subtract(range2)));


// range.add adds overlapping ranges
// cannot add separate ranges without overlap
// cannot add adjacent ranges either (2-4 PM + 4-5 PM) != 2-5 PM
// cannot reliably chain. range2.add(range3).add(range4) crashes because first function returns null
// should work if all ranges overlap, though.
console.log("range2 + range3: " + range2.add(range3));
console.log("range2 + range5: " + range2.add(range5).toString());
console.log("range3 + range4: " + range3.add(range4));

// modified range addition to include adjacent ranges
console.log("modified add range2 + range5: " + addTwo(range2, range5).toString());
console.log("modified add range3 + range4: " + addTwo(range3, range4).toString());

// addition with arrays!
console.log("Array range addition, adding ranges 2-5: " + addArray([range2, range3, range4, range5]));

// subtraction with arrays!
console.log("Array subtraction, subtracting ranges 2-5 from range 1: " + subtractArrFromSingle(range1, [range2, range3, range4, range5]));


console.log("Adding range6 + range7: " + addTwo(range6, range7).toString());

// // Subtract one array of time ranges from another
console.log("Array subtraction, subtracting ranges 2-5 from ranges 6-7: " + subtractArrays([range6, range7], [range2, range3, range4, range5]));

