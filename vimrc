""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" defaults recommended by debian
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" some sane defaults
" tabs and indenting
set autoindent copyindent expandtab shiftwidth=4 softtabstop=4 smarttab tabstop=4
""""""""""""""""""""
" editor
set autoread
set autowrite
set background=dark
set backspace=indent,eol,start
set cursorline
set encoding=utf-8
set fileencoding=utf-8
set history=1000
set hidden
set laststatus=2
set lazyredraw
set mouse=a
set noerrorbells visualbell t_vb=
set number
set ruler
set scrolloff=5
set showbreak=>>>
set showcmd
set showmatch
set sidescroll=1
set sidescrolloff=2
set tabpagemax=100
set ttyfast
set wildignorecase
set wildmenu
set wrap
" backups
""""""""""""""""""""
" searching
set gdefault hlsearch ignorecase incsearch smartcase
""""""""""""""""""""
" file types, syntax, and color
filetype plugin indent on
syntax on
colorscheme elflord
" misc things
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" disable vim functions I don't like and/or don't want to activate by accident
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
cnoremap <C-k> <nop>
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" keys to match up with what I do in Emacs
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" not sure exactly which terminal settings need this
" comment these out for 8-bit terminal
if !has("gui_running")
  " set timeouts as high as several hundred for slow terminals
  set timeout
  set timeoutlen=15
  set ttimeout
  set ttimeoutlen=15
  for i in range(65,90) + range(97,122)
    let c = nr2char(i)
   exec "cmap \e".c." <M-".c.">"
  endfor
endif
set termencoding=utf-8
cnoremap <M-j> <nop>
cnoremap <M-k> <nop>
cnoremap <M-n> <Down>
cnoremap <M-p> <Up>
nnoremap <Space> <C-f>
nnoremap <S-Space> <C-b>
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" autocommands
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
let g:current_uid=system('id -u')
""""""""
autocmd GUIEnter * set visualbell t_vb=
""""""""
" make modifiable match read-only state
" code my user owns but I don't want but I don't want to modify accidently
let g:owned_nomodifiable_paths = "^/opt/prefix-*\\|foreign.*repo"
function UpdateModifiable()
  if !exists("b:setmodifiable")
    let b:setmodifiable = 0
  endif
  if &readonly
    if &modifiable
      setlocal nomodifiable
      let b:setmodifiable = 1
    endif
  elseif matchstr(expand("%:p"),g:owned_nomodifiable_paths) != ""
    if &modifiable
      setlocal nomodifiable
      let b:setmodifiable = 1
    endif
  else
    if b:setmodifiable
      setlocal modifiable
    endif
  endif
endfunction
if g:current_uid != 0
  autocmd BufReadPost * call UpdateModifiable()
endif
""""""""
autocmd FileType vim setlocal shiftwidth=2 tabstop=2
""""""""
