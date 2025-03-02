import {Separator, SubLike} from '../types.js';
import {msToTime, toData} from './_utils.js';

export const srtToData = (text: string) => toData(text, 'srt');

export const dataToSrt = (data: SubLike, separator: Separator = ',') => {
	const subsContent = data.items
		.map((sub, index) => {
			const timeRow =
				msToTime(sub.from, separator) + ' --> ' + msToTime(sub.to, separator);
			const textRows = sub.text.split('\n');
			return [index + 1, timeRow, ...textRows].join('\n');
		})
		.join('\n\n');
	return subsContent;
};
