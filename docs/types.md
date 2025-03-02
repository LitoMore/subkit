# Types

## Separator

```ts
type Separator = "." | ",";
```

## SubLike

```ts
type SubLike = SubSrt | SubVtt | SubFcpxml;
```

## SubSrt

```ts
type SubSrt = {
	items: Array<{
		from: number;
		to: number;
		duration: number;
		text: string;
	}>;
};
```

## SubVtt

```ts
type SubVtt = {
	items: Array<{
		from: number;
		to: number;
		duration: number;
		text: string;
	}>;
};
```

## SubFcpxml

```ts
type SubFcpxml = {
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
```

## DataToFcpxmlOptions

```ts
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
```
