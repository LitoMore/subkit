import {XMLBuilder, XMLParser} from 'fast-xml-parser';
import {SubFcpxml, SubLike} from '../types.js';

type SubPartial = {
	'@_offset': string;
	'@_duration': string;
	text: {
		'text-style': {
			'#text': string;
		};
	};
	'text-style-def': {
		'text-style': {
			'@_font': string;
			'@_fontSize': string;
			'@_fontFace': string;
			'@_fontColor': string;
			'@_bold': string;
			'@_shadowColor': string;
			'@_shadowOffset': string;
			'@_alignment': string;
		};
	};
};

type XmlDataPartial = {
	fcpxml: {
		resources: {
			format: {
				'@_name': string;
			};
		};
		library: {
			event: {
				project: {
					'@_name': string;
					sequence: {
						'@_duration': string;
						spine: {
							gap: {
								'@_duration': string;
								title: SubPartial[];
							};
						};
					};
				};
			};
		};
	};
};

const msToFrame = (ms: number, fps: number) => Math.floor(ms / (1000 / fps));

export const fcpxmlToData = (text: string): SubFcpxml => {
	const parser = new XMLParser({ignoreAttributes: false});
	const data = parser.parse(text) as XmlDataPartial;

	const formatName = data.fcpxml.resources.format['@_name'];
	const {sequence} = data.fcpxml.library.event.project;
	const fps = Number(formatName.split('p').at(-1)) / 100;

	const items = data.fcpxml.library.event.project.sequence.spine.gap.title.map(
		(sub) => {
			const offsetFrame = Number(sub['@_offset'].split('/').at(0)) / 100;
			const durationFrame = Number(sub['@_duration'].split('/').at(0)) / 100;
			const endFrame = offsetFrame + durationFrame;
			const from = offsetFrame * (1000 / fps);
			const to = endFrame * (1000 / fps);
			const duration = to - from;
			const textStyle = sub['text-style-def']['text-style'];
			return {
				from,
				to,
				duration,
				text: sub.text['text-style']['#text'],
				font: textStyle['@_font'],
				fontSize: textStyle['@_fontSize'],
				fontFace: textStyle['@_fontFace'],
				fontColor: textStyle['@_fontColor'],
				bold: textStyle['@_bold'],
				shadowColor: textStyle['@_shadowColor'],
				shadowOffset: textStyle['@_shadowOffset'],
				alignment: textStyle['@_alignment'],
				titleOffset: sub['@_offset'],
				titleDuration: sub['@_duration'],
			};
		},
	);

	return {
		name: data.fcpxml.library.event.project['@_name'],
		fps,
		sequenceDuration: sequence['@_duration'],
		gapDuration: sequence.spine.gap['@_duration'],
		items,
	};
};

export type DataToFcpxmlOptions = {
	name?: string;
	font?: string;
	fontSize?: string;
	fontFace?: string;
	fontColor?: string;
	bold?: string;
	shadowColor?: string;
	shadowOffset?: string;
	alignment?: string;
};

export const dataToFcpxml = (
	data: SubLike,
	fps: number,
	options: DataToFcpxmlOptions = {},
) => {
	const {
		name = 'subtitle',
		font = 'Helvetica',
		fontSize = '45',
		fontFace = 'Regular',
		fontColor = '1 1 1 1',
		bold = '1',
		shadowColor = '0 0 0 0.75',
		shadowOffset = '4 315',
		alignment = 'center',
	} = options;

	const builder = new XMLBuilder({ignoreAttributes: false});

	const x100Fps = (100 * fps).toString();
	const totalFrame = msToFrame(
		data.items.at(-1)?.to /* c8 ignore next */ ?? 0,
		fps,
	);
	const x100TotalFrame = String(100 * totalFrame);

	const sequenceDuration = `${x100TotalFrame}/${x100Fps}s`;
	const gapDuration = `${x100TotalFrame}/${x100Fps}s`;

	/* eslint-disable @typescript-eslint/naming-convention */
	const xmlData = {
		'?xml': {
			'@_version': '1.0',
			// eslint-disable-next-line unicorn/text-encoding-identifier-case
			'@_encoding': 'UTF-8',
		},
		fcpxml: {
			resources: {
				format: {
					'@_id': 'r1',
					'@_name': `FFVideoFormat1080p${x100Fps}`,
					'@_frameDuration': `100/${x100Fps}`,
					'@_width': '1920',
					'@_height': '1080',
					'@_colorSpace': '1-1-1 (Rec. 709)',
				},
				effect: {
					'@_id': 'r2',
					'@_name': 'Basic Title',
					'@_uid':
						'.../Titles.localized/Bumper:Opener.localized/Basic Title.localized/Basic Title.moti',
				},
			},
			library: {
				event: {
					project: {
						sequence: {
							spine: {
								gap: {
									title: data.items.map((sub, index) => {
										const offsetFrame = msToFrame(sub.from, fps);
										const endFrame = msToFrame(sub.to, fps);
										const durationFrame = endFrame - offsetFrame;
										const x100OffsetFrame = (100 * offsetFrame).toString();
										const x100DurationFrame = (100 * durationFrame).toString();

										const subText = sub.text;
										const tsIndex = `ts${index}`;
										const basicTitle = `${subText} - Basic Title`;
										const titleOffset = `${x100OffsetFrame}/${x100Fps}s`;
										const titleDuration = `${x100DurationFrame}/${x100Fps}s`;

										return {
											param: [
												{
													'@_name': 'Position',
													'@_key': '9999/999166631/999166633/1/100/101',
													'@_value': '0 -465',
												},
												{
													'@_name': 'Flatten',
													'@_key': '999/999166631/999166633/2/351',
													'@_value': '1',
												},
												{
													'@_name': 'Alignment',
													'@_key':
														'9999/999166631/999166633/2/354/999169573/401',
													'@_value': '1 (Center)',
												},
											],
											text: {
												'text-style': {
													'#text': subText,
													'@_ref': tsIndex,
												},
											},
											'text-style-def': {
												'text-style': {
													'@_font': font,
													'@_fontSize': fontSize,
													'@_fontFace': fontFace,
													'@_fontColor': fontColor,
													'@_bold': bold,
													'@_shadowColor': shadowColor,
													'@_shadowOffset': shadowOffset,
													'@_alignment': alignment,
												},
												'@_id': tsIndex,
											},
											'@_ref': 'r2',
											'@_lane': '1',
											'@_offset': titleOffset,
											'@_duration': titleDuration,
											'@_name': basicTitle,
										};
									}),
									'@_name': 'Gap',
									'@_offset': '0s',
									'@_duration': gapDuration,
								},
							},
							'@_format': 'r1',
							'@_tcStart': '0s',
							'@_tcFormat': 'NDF',
							'@_audioLayout': 'stereo',
							'@_audioRate': '48k',
							'@_duration': sequenceDuration,
						},
						'@_name': name,
					},
					'@_name': 'subkit',
				},
			},
			'@_version': '1.9',
		},
	};
	/* eslint-enable @typescript-eslint/naming-convention */

	const xml = builder.build(xmlData) as string;
	if (typeof xml === 'string') return xml;
	/* c8 ignore start */
	throw new Error('Failed to build XML');
	/* c8 ignore stop */
};
