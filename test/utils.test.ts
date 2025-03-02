import test from 'ava';
import {
	msToTime,
	parseTimeRow,
	timeToMs,
} from '../source/convertions/_utils.js';

test('timeToMs()', (t) => {
	t.is(timeToMs('00:00:00.000'), 0);
	t.is(timeToMs('00:00:01.000'), 1000);
	t.is(timeToMs('00:01:00.000'), 60_000);
	t.is(timeToMs('01:00:00.000'), 3_600_000);
	t.is(timeToMs('01:01:01.000'), 3_661_000);
	t.is(timeToMs('01:01:01.001'), 3_661_001);
	t.is(timeToMs('01:01:01.010'), 3_661_010);
	t.is(timeToMs('01:01:01.100'), 3_661_100);
	t.is(timeToMs('01:01:01.999'), 3_661_999);
	t.is(timeToMs('01:01:01,999'), 3_661_999);
	t.is(timeToMs('01:01:01.999.123'), 0);
	t.is(timeToMs('01:01:01,999.123'), 0);
	t.is(timeToMs('01:01:01:999'), 0);
});

test('msToTime()', (t) => {
	t.is(msToTime(0, '.'), '00:00:00.000');
	t.is(msToTime(1000, '.'), '00:00:01.000');
	t.is(msToTime(60_000, '.'), '00:01:00.000');
	t.is(msToTime(3_600_000, '.'), '01:00:00.000');
	t.is(msToTime(3_661_000, '.'), '01:01:01.000');
	t.is(msToTime(3_661_999, '.'), '01:01:01.999');
	t.is(msToTime(3_661_999, ','), '01:01:01,999');
	t.is(msToTime(3_661_999.123, '.'), '01:01:01.999');
	t.is(msToTime(3_661_999.123, ','), '01:01:01,999');
	t.is(msToTime(3_661_999.789, '.'), '01:01:01.999');
});

test('parseTimeRow()', (t) => {
	t.deepEqual(parseTimeRow('00:00:00.000 --> 00:00:01.000'), [0, 1000]);
	t.deepEqual(parseTimeRow('00:00:00.000 --X 00:00:01.000'), [0, 0]);
});
