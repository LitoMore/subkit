import test from 'ava';
import {
	fcpxmlToData,
	fcpxmlToSrt,
	fcpxmlToVtt,
	srtToData,
	srtToFcpxml,
	srtToVtt,
	vttToData,
	vttToFcpxml,
	vttToSrt,
} from 'subkit';
import {
	approxMatch,
	sampleFcpxml,
	sampleSrt,
	sampleVtt,
} from './_helpers.test.js';

const srtText = await sampleSrt();
const vttText = await sampleVtt();
const fcpxmlText = await sampleFcpxml();

test('toData()', (t) => {
	const srtData = srtToData(srtText);
	const vttData = vttToData(vttText);
	t.deepEqual(srtData, vttData);

	const fcpxmlData = fcpxmlToData(fcpxmlText);
	approxMatch(t, fcpxmlData, srtData);
});

test('toSrt()', (t) => {
	const vttSrt = vttToSrt(vttText);
	t.true(srtText.includes(vttSrt));

	const fcpxmlSrt = fcpxmlToSrt(fcpxmlText);
	approxMatch(t, srtToData(srtText), srtToData(fcpxmlSrt));
});

test('toVtt()', (t) => {
	const srtVtt = srtToVtt(srtText);
	t.true(vttText.includes(srtVtt));

	const fcpxmlVtt = fcpxmlToVtt(fcpxmlText);
	approxMatch(t, vttToData(vttText), vttToData(fcpxmlVtt));
});

test('toFcpxml()', (t) => {
	const srtFcpXml = srtToFcpxml(srtText, 30);
	const vttFcpXml = vttToFcpxml(vttText, 30);
	const srtFcpxmlData = fcpxmlToData(srtFcpXml);
	const vttFcpxmlData = fcpxmlToData(vttFcpXml);
	const srtData = srtToData(srtText);
	const vttData = vttToData(vttText);

	approxMatch(t, srtFcpxmlData, srtData);
	approxMatch(t, vttFcpxmlData, vttData);
});
