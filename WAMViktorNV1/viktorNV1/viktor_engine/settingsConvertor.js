'use strict';

export function transposeValue(value, originalRange, newRange) {
	var originalRangeLenght = originalRange[1] - originalRange[0], ratioToRange = (value - originalRange[0]) / originalRangeLenght, newRangeLength = newRange[1] - newRange[0];

	return newRange[0] + ratioToRange * newRangeLength;
}
export function transposeParam(param, newRange) {
	var self = this, newValue = transposeValue(param.value, param.range, newRange);

	return {
		value: newValue,
		range: newRange
	};
}
export function getRangeCenter(range) {
	var rangeLength = range[1] - range[0];

	return range[0] + rangeLength / 2;
}