import {
  type Context,
  type DdcOptions,
  type Item,
  type SourceOptions,
} from "jsr:@shougo/ddc-vim@~7.0.0/types";
import { BaseSource } from "jsr:@shougo/ddc-vim@~7.0.0/source";

import type { Denops } from "jsr:@denops/core@~7.0.0";
import * as fn from "jsr:@denops/std@~7.1.1/function";

type Params = {
  maxSize: number;
};

export class Source extends BaseSource<Params> {
  override getCompletePosition(args: {
    denops: Denops;
    context: Context;
  }): Promise<number> {
    const match = args.context.input.match(/^\s+/);
    return Promise.resolve(match ? match[0].length : 0);
  }

  override async gather(args: {
    denops: Denops;
    options: DdcOptions;
    sourceOptions: SourceOptions;
    sourceParams: Params;
    completeStr: string;
  }): Promise<Item[]> {
    const p = args.sourceParams as unknown as Params;
    const maxSize = p.maxSize;
    const currentLine = await fn.line(args.denops, ".");
    const minLines = Math.max(1, currentLine - maxSize);
    const maxLines = Math.min(
      await fn.line(args.denops, "$"),
      currentLine + maxSize,
    );
    const cs: Item[] = (await fn.getline(args.denops, minLines, maxLines)).map(
      (word: string) => ({ word: word.replace(/^\s+/, "") }),
    );
    return cs;
  }

  override params(): Params {
    return {
      maxSize: 5000,
    };
  }
}
