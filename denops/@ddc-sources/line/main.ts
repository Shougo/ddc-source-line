import type {
  Context,
  DdcOptions,
  Item,
  SourceOptions,
} from "@shougo/ddc-vim/types";
import { BaseSource } from "@shougo/ddc-vim/source";

import type { Denops } from "@denops/std";
import * as fn from "@denops/std/function";

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
