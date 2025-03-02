export type Separator = ',' | '.';

export type SubLike = SubSrt | SubVtt | SubFcpxml;

export type SubSrtItem = {
	from: number;
	to: number;
	duration: number;
	text: string;
};

export type SubSrt = {
	items: SubSrtItem[];
};

export type SubVttItem = {
	from: number;
	to: number;
	duration: number;
	text: string;
};

export type SubVtt = {
	items: SubVttItem[];
};

export type SubFcpxmlItem = {
	text: string;
	from: number;
	to: number;
	duration: number;
	font: string;
	fontSize: string;
	fontFace: string;
	fontColor: string;
	bold: string;
	shadowColor: string;
	shadowOffset: string;
	alignment: string;
	titleOffset: string;
	titleDuration: string;
};

export type SubFcpxml = {
	name: string;
	fps: number;
	gapDuration: string;
	sequenceDuration: string;
	items: SubFcpxmlItem[];
};
