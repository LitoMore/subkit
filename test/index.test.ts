import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test, {ExecutionContext} from 'ava';
import {
	SubLike,
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sampleSrt = await fs.readFile(
	path.join(__dirname, '..', '..', 'fixtures', 'sample.srt'),
	'utf8',
);

const sampleVtt = await fs.readFile(
	path.join(__dirname, '..', '..', 'fixtures', 'sample.vtt'),
	'utf8',
);

const sampleFcpxml = await fs.readFile(
	path.join(__dirname, '..', '..', 'fixtures', 'sample.fcpxml'),
	'utf8',
);

const msThreshold = 30;

const approxEqual = (t: ExecutionContext, a: number, b: number) =>
	t.true(Math.abs(a - b) < msThreshold);

const approxMatch = (
	t: ExecutionContext,
	actual: SubLike,
	expected: SubLike,
) => {
	for (const [i, fcpxmlClip] of actual.items.entries()) {
		const srtClip = expected.items[i];
		if (!srtClip) continue;
		approxEqual(t, fcpxmlClip.from, srtClip.from);
		approxEqual(t, fcpxmlClip.to, srtClip.to);
		approxEqual(t, fcpxmlClip.duration, srtClip.duration);
	}
};

test('toData()', (t) => {
	const srtData = srtToData(sampleSrt);
	const vttData = vttToData(sampleVtt);
	t.deepEqual(srtData, vttData);

	const fcpxmlData = fcpxmlToData(sampleFcpxml);
	approxMatch(t, fcpxmlData, srtData);
});

test('toSrt()', (t) => {
	const vttSrt = vttToSrt(sampleVtt);
	t.true(sampleSrt.includes(vttSrt));

	const fcpxmlSrt = fcpxmlToSrt(sampleFcpxml);
	approxMatch(t, srtToData(sampleSrt), srtToData(fcpxmlSrt));
});

test('toVtt()', (t) => {
	const srtVtt = srtToVtt(sampleSrt);
	t.true(sampleVtt.includes(srtVtt));

	const fcpxmlVtt = fcpxmlToVtt(sampleFcpxml);
	approxMatch(t, vttToData(sampleVtt), vttToData(fcpxmlVtt));
});

test('toFcpxml()', (t) => {
	const srtFcpXml = srtToFcpxml(sampleSrt, 30);
	const vttFcpXml = vttToFcpxml(sampleVtt, 30);
	const srtFcpxmlData = fcpxmlToData(srtFcpXml);
	const vttFcpxmlData = fcpxmlToData(vttFcpXml);
	const srtData = srtToData(sampleSrt);
	const vttData = vttToData(sampleVtt);

	approxMatch(t, srtFcpxmlData, srtData);
	approxMatch(t, vttFcpxmlData, vttData);
});
