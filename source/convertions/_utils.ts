import {Separator, SubSrt, SubVtt} from '../types.js';

export const timeToMs = (time: string) => {
	const timePattern = /^(?<h>\d+):(?<m>\d+):(?<s>\d+)[.,](?<ss>\d+)$/;
	const match = timePattern.exec(time);
	const {h = '0', m = '0', s = '0', ss = '0'} = match?.groups ?? {};
	return (
		Number.parseInt(ss, 10) +
		Number.parseInt(s, 10) * 1000 +
		Number.parseInt(m, 10) * 60 * 1000 +
		Number.parseInt(h, 10) * 60 * 60 * 1000
	);
};

export const msToTime = (time: number, separator: Separator) => {
	const ms = Math.floor(time % 1000);
	const s = Math.floor(time / 1000) % 60;
	const m = Math.floor(time / 1000 / 60) % 60;
	const h = Math.floor(time / 1000 / 60 / 60);
	return `${h.toString().padStart(2, '0')}:${m
		.toString()
		.padStart(2, '0')}:${s.toString().padStart(2, '0')}${separator}${ms
		.toString()
		.padStart(3, '0')}`;
};

export const parseTimeRow = (line: string): [from: number, to: number] => {
	const [from, to] = line.split('-->');

	if (from && to) {
		return [timeToMs(from.trim()), timeToMs(to.trim())];
	}

	/* c8 ignore start */
	return [0, 0];
	/* c8 ignore stop */
};

export function toData(text: string, target: 'srt'): SubSrt;
export function toData(text: string, target: 'vtt'): SubVtt;
export function toData(text: string, target: 'srt' | 'vtt'): SubSrt | SubVtt {
	const timeLinePattern = /^\d+:\d+:\d+[.,]\d+\s+-->\s+\d+:\d+:\d+[.,]\d+$/;
	const lines = text.split('\n');
	const blocks: string[][] = [];
	let firstTurn = true;
	let block: string[] = [];

	for (const line_ of lines) {
		const line = line_;
		if (timeLinePattern.test(line)) {
			const formattedTimeLine = line.replaceAll(',', '.');
			if (firstTurn) {
				block.shift();
				block = [];
				block.push(formattedTimeLine);
				firstTurn = false;
			}

			if (block.length > 1) {
				if (target === 'srt') block.pop();
				blocks.push(block);
				block = [];
				block.push(formattedTimeLine);
			}
		} else if (line.trim() !== '') {
			block.push(line);
		}
	}

	if (block.length > 1) {
		blocks.push(block);
	}

	const items = blocks.map((block) => {
		const [timeRow = '', ...text] = block;
		const [from, to] = parseTimeRow(timeRow);
		return {from, to, duration: to - from, text: text.join('\n').trim()};
	});

	return {items};
}
