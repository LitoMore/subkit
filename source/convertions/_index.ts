import {Separator} from '../types.js';
import {DataToFcpxmlOptions, dataToFcpxml, fcpxmlToData} from './fcpxml.js';
import {dataToSrt, srtToData} from './srt.js';
import {dataToVtt, vttToData} from './vtt.js';

export {srtToData, dataToSrt} from './srt.js';
export {vttToData, dataToVtt} from './vtt.js';
export {
	fcpxmlToData,
	dataToFcpxml,
	type DataToFcpxmlOptions,
} from './fcpxml.js';

export const srtToVtt = (text: string, separator?: Separator) =>
	dataToVtt(srtToData(text), separator);

export const vttToSrt = (text: string, separator?: Separator) =>
	dataToSrt(vttToData(text), separator);

export const fcpxmlToSrt = (text: string, separator?: Separator) =>
	dataToSrt(fcpxmlToData(text), separator);

export const fcpxmlToVtt = (text: string, separator?: Separator) =>
	dataToVtt(fcpxmlToData(text), separator);

export const srtToFcpxml = (
	text: string,
	fps: number,
	options?: DataToFcpxmlOptions,
) => dataToFcpxml(srtToData(text), fps, options);

export const vttToFcpxml = (
	text: string,
	fps: number,
	options?: DataToFcpxmlOptions,
) => dataToFcpxml(vttToData(text), fps, options);
