import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ExecutionContext} from 'ava'; // eslint-disable-line ava/use-test
import {SubLike} from 'subkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadSample = async (file: string) =>
	fs.readFile(path.join(__dirname, '..', '..', 'fixtures', file), 'utf8');

export const sampleSrt = async () => loadSample('sample.srt');
export const sampleVtt = async () => loadSample('sample.vtt');
export const sampleFcpxml = async () => loadSample('sample.fcpxml');

const msThreshold = 30;

export const approxEqual = (t: ExecutionContext, a: number, b: number) =>
	t.true(Math.abs(a - b) < msThreshold);

export const approxMatch = (
	t: ExecutionContext,
	actual: SubLike,
	expected: SubLike,
) => {
	for (const [i, fcpxmlClip] of actual.items.entries()) {
		const srtClip = expected.items[i]!;
		approxEqual(t, fcpxmlClip.from, srtClip.from);
		approxEqual(t, fcpxmlClip.to, srtClip.to);
		approxEqual(t, fcpxmlClip.duration, srtClip.duration);
		t.is(fcpxmlClip.text, srtClip.text);
	}
};
