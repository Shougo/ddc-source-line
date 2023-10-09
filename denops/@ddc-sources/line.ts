import {
  BaseSource,
  DdcOptions,
  Item,
  SourceOptions,
} from "https://deno.land/x/ddc_vim@v4.0.5/types.ts";
import { Denops, fn } from "https://deno.land/x/ddc_vim@v4.0.5/deps.ts";

type Params = {
  maxSize: number;
};

export class Source extends BaseSource<Params> {
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
