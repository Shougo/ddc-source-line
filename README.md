# ddc-source-line

Line completion for ddc.vim

This source collects items from current buffer lines.

## Required

### denops.vim

https://github.com/vim-denops/denops.vim

### ddc.vim

https://github.com/Shougo/ddc.vim

## Configuration

```vim
call ddc#custom#patch_global('sources', ['line'])

call ddc#custom#patch_global('sourceOptions', #{
      \   line: #{ mark: 'line' },
      \ })
call ddc#custom#patch_global('sourceParams', #{
      \   line: #{ maxSize: 1000 },
      \ })
```
