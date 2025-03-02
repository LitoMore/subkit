# subkit

## Install

```shell
npm i subkit
```

## Usage

```ts
import fs from "node:fs/promises";
import { dataToVtt, dataToFcpxml, srtToData, srtToFcpxml } from "subkit";

const srt = await fs.readFile("path/to/file.srt", "utf8");

// Convert SRT to data object
const data = srtToData(srt);

// Convert SRT data oject to any format
const vtt = dataToVtt(data);
const fcpxml = dataToFcpxml(data);

// Convert SRT to FCPXML with convertion aliases
const fcpxml_ = srtToFcpxml(srt);
console.log(fcpxml === fcpxml_);
// Output => true
```

## API

### SRT

#### srtToData(text: string): SubSrt

This converts SRT text content to a [`SubSrt`](./docs/types.md#subsrt) data object.

#### dataToSrt(data: SubLike, separator?: Separator): string

This accepts a [`SubLike`](./docs/types.md#sublike) data as input. The [`separator`](./docs/types.md#separator) is used for timestamp strings and it defaults to `,`.

### WebVTT

#### vttToData(text: string): SubVtt

This converts WebVTT text content to a [`SubVtt`](./docs/types.md#subvtt) data object.

#### dataToVtt(data: SubLike, separator?: Separator): string;

This accepts a [`SubLike`](./docs/types.md#sublike) data as input. The [`separator`](./docs/types.md#separator) is used for timestamp strings and it defaults to `.`.

### FCPXML

#### fcpxmlToData(text: string): SubFcpxmlv

This converts FCPXML text context to a [`SubFcpxml`](./docs/types.md#subfcpxml) data object.

#### dataToFcpxml(data: SubLike, fps: number, options?: DataToFcpxmlOptions): string

This accepts a [`SubLike`](./docs/types.md#sublike) and `fps` as input. And some fields can be configured by using [`DataToFcpxmlOptions`](./docs/types.md#datatofcpxmloptions).

### Convertions

We've defined some convertion aliases for converting between two subs. Available convertion aliaes are:

- `srtToVtt(text: string, separator?: Separator)`
- `vttToSrt(text: string, separator?: Separator)`
- `fcpxmlToSrt(text: string, separator?: Separator)`
- `fcpxmlToVtt(text: string, separator?: Separator)`
- `srtToFcpxml(text: string, fps: number, options?: DataToFcpxmlOptions)`
- `vttToFcpxml(text: string, fps: number, optiosn?: DataToFcpxmlOptions)`

### Utilities

#### msToTime(ms: string, separator?: Separator): string

This converts the milliseconds to time string for SRT or VTT.

#### timeToMs(time: string): number

This converts the SRT or VTT time string to milliseconds.

## License

MIT
