import {
  BaseSource,
  Candidate,
  DdcOptions,
  SourceOptions,
} from "https://deno.land/x/ddc_vim@v0.13.0/types.ts#^";
import {
  Denops,
  fn,
} from "https://deno.land/x/ddc_vim@v0.13.0/deps.ts#^";

type Params = {
  maxSize: number;
};

export class Source extends BaseSource<Params> {
  getCompletePosition({}): Promise<number> {
    return Promise.resolve(0);
  }

  async gatherCandidates(args: {
    denops: Denops,
    options: DdcOptions,
    sourceOptions: SourceOptions,
    sourceParams: Params,
    completeStr: string,
  }): Promise<Candidate[]> {
    const p = args.sourceParams as unknown as Params;
    const maxSize = p.maxSize;
    const currentLine = await fn.line(args.denops, ".");
    const minLines = Math.max(1, currentLine - maxSize);
    const maxLines = Math.min(
      await fn.line(args.denops, "$"),
      currentLine + maxSize,
    );
    const cs: Candidate[] =
      (await fn.getline(args.denops, minLines, maxLines)).map(
        (word: string) => ({ word }));
    return cs;
  }

  params(): Params {
    return {
      maxSize: 5000,
    };
  }
}
