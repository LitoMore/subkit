import {Separator, SubLike} from '../types.js';
import {msToTime, toData} from './_utils.js';

export const vttToData = (text: string) => toData(text, 'vtt');

export const dataToVtt = (data: SubLike, separator: Separator = '.') => {
	const header = 'WEBVTT\n\n';
	const subsContent = data.items
		.map((sub) => {
			const timeRow =
				msToTime(sub.from, separator) + ' --> ' + msToTime(sub.to, separator);
			const textRows = sub.text.split('\n');
			return [timeRow, ...textRows].join('\n');
		})
		.join('\n\n');
	return header + subsContent;
};
