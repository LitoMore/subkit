export type Separator = ',' | '.';

export type SubLike = SubSrt | SubVtt | SubFcpxml;

export type SubSrt = {
	items: Array<{
		from: number;
		to: number;
		duration: number;
		text: string;
	}>;
};

export type SubVtt = {
	items: Array<{
		from: number;
		to: number;
		duration: number;
		text: string;
	}>;
};

export type SubFcpxml = {
	name: string;
	fps: number;
	gapDuration: string;
	sequenceDuration: string;
	items: Array<{
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
	}>;
};
