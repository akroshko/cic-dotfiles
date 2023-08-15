#!/bin/bash
# bashrc
#
# Copyright (C) 2016-2021, Andrew Kroshko, all rights reserved.
#
# Author: Andrew Kroshko
# Maintainer: Andrew Kroshko <boreal6502@gmail.com>
# Created: Wed June 08, 2016
# Version: 20200408
# URL: https://github.com/akroshko/cic-etc
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or (at
# your option) any later version.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see http://www.gnu.org/licenses/.

################################################################################
# source system bashrc
[[ -f /etc/bash.bashrc ]] && source /etc/bash.bashrc
################################################################################
# standard bashrc settings that should work on any GNU system
set -o emacs

################################################################################
## things I'm defining in only one places so I have one monolithic bashrc, often sourced by scripts
# Reset
Color_Off='\033[0m'     # Text Reset
# Regular Colors
Black='\e[0;30m'        # Black
Red='\e[0;31m'          # Red
Green='\e[0;32m'        # Green
Yellow='\e[0;33m'       # Yellow
Blue='\e[0;34m'         # Blue
Purple='\e[0;35m'       # Purple
Cyan='\e[0;36m'         # Cyan
White='\e[0;37m'        # White
# Bold
BBlack='\e[1;30m'       # Black
BRed='\e[1;31m'         # Red
BGreen='\e[1;32m'       # Green
BYellow='\e[1;33m'      # Yellow
BBlue='\e[1;34m'        # Blue
BPurple='\e[1;35m'      # Purple
BCyan='\e[1;36m'        # Cyan
BWhite='\e[1;37m'       # White
# Underline
UBlack='\e[4;30m'       # Black
URed='\e[4;31m'         # Red
UGreen='\e[4;32m'       # Green
UYellow='\e[4;33m'      # Yellow
UBlue='\e[4;34m'        # Blue
UPurple='\e[4;35m'      # Purple
UCyan='\e[4;36m'        # Cyan
UWhite='\e[4;37m'       # White
# Background
On_Black='\e[40m'       # Black
On_Red='\e[41m'         # Red
On_Green='\e[42m'       # Green
On_Yellow='\e[43m'      # Yellow
On_Blue='\e[44m'        # Blue
On_Purple='\e[45m'      # Purple
On_Cyan='\e[46m'        # Cyan
On_White='\e[47m'       # White
# High Intensity
IBlack='\e[0;90m'       # Black
IRed='\e[0;91m'         # Red
IGreen='\e[0;92m'       # Green
IYellow='\e[0;93m'      # Yellow
IBlue='\e[0;94m'        # Blue
IPurple='\e[0;95m'      # Purple
ICyan='\e[0;96m'        # Cyan
IWhite='\e[0;97m'       # White
# Bold High Intensity
BIBlack='\e[1;90m'      # Black
BIRed='\e[1;91m'        # Red
BIGreen='\e[1;92m'      # Green
BIYellow='\e[1;93m'     # Yellow
BIBlue='\e[1;94m'       # Blue
BIPurple='\e[1;95m'     # Purple
BICyan='\e[1;96m'       # Cyan
BIWhite='\e[1;97m'      # White
# High Intensity backgrounds
On_IBlack='\e[0;100m'   # Black
On_IRed='\e[0;101m'     # Red
On_IGreen='\e[0;102m'   # Green
On_IYellow='\e[0;103m'  # Yellow
On_IBlue='\e[0;104m'    # Blue
On_IPurple='\e[10;95m'  # Purple
On_ICyan='\e[0;106m'    # Cyan
On_IWhite='\e[0;107m'   # White

# the three-fingered claw, see https://stackoverflow.com/questions/1378274/in-a-bash-script-how-can-i-exit-the-entire-script-if-a-certain-condition-occurs
yell () {
    local NEWCOM=$(sed -r 's|'"$HOME"'|~|g' <<< "$0")
    echo -e "${BRed}$NEWCOM${Red}: $*${Color_Off}" 1>&2
}

die () {
    yell "$*"; exit 111
}

try () {
    "$@" || die "cannot $*"
}

warn () {
    local NEWCOM=$(sed -r 's|'"$HOME"'|~|g' <<< "$0")
    echo -e "${BYellow}$NEWCOM${Yellow}: $*${Color_Off}" 1>&2
}

msg () {
    local NEWCOM=$(sed -r 's|'"$HOME"'|~|g' <<< "$0")
    echo -e "${BGreen}$NEWCOM${Green}: $*${Color_Off}" 1>&2
}

################################################################################
################################################################################
## start interactive stuff
if [[ -n "$PS1" ]]; then
    export LESS_TERMCAP_mb=$'\E[1;31m'     # begin bold
    export LESS_TERMCAP_md=$'\E[1;36m'     # begin blink
    export LESS_TERMCAP_me=$'\E[0m'        # reset bold/blink
    export LESS_TERMCAP_so=$'\E[01;44;33m' # begin reverse video
    export LESS_TERMCAP_se=$'\E[0m'        # reset reverse video
    export LESS_TERMCAP_us=$'\E[1;32m'     # begin underline
    export LESS_TERMCAP_ue=$'\E[0m'        # reset underline
    export PAGER="$(type -P less) --IGNORE-CASE --LONG-PROMPT"
    # this ensures the variables set by keychain are correct in the shell
    [[ -f "$HOME/.keychain/$HOSTNAME-sh" ]] && source "$HOME/.keychain/$HOSTNAME-sh" >/dev/null
    ################################################################################
    ################################################################################
    # aliases, generally spice up some already existing commands
    # XXXX: some may not work on all systems
    alias bash-debug='set -xv'
    alias bash-nodebug='set +xv'
    # stops things from overflowing /tmp if space is limited
    # TODO: this should be a function to make sure MAGICK_TEMPORARY_PATH works
    alias agu='sudo apt-get update && sudo apt list --upgradable && sudo apt-get dist-upgrade && sudo apt-file update'
    alias agu-dry-run='sudo apt-get update && sudo apt list --upgradable && sudo apt-get dist-upgrade --dry-run'
    alias ag-autoremove='sudo apt-get autoremove'
    alias ssh-controlmaster-list='\ps -elf | \grep controlmaster | \grep -v grep'
    alias cat-json='python -m json.tool'
    alias check-mem='smem -twk'
    alias dc='aafire -driver curses -extended'
    alias df='df -h'
    alias df-all='df -aTh'
    alias diff-minimal='diff --ignore-all-space --color=always'
    alias du='du -h'
    alias du-sort-symlinks='\du --total --summarize --human-readable --dereference -- * 2>/dev/null | sort --human-numeric-sort'
    alias du-sort-deference='du-sort-symlinks'
    alias du-sort-directories='\du --total --summarize --human-readable -- ./*/ 2>/dev/null | sort --human-numeric-sort'
    alias du-sort-dotfiles='du --total --summarize --human-readable .[^.]* 2>/dev/null | sort --human-numeric-sort'
    alias du-total-symlink='du --total --summarize --dereference --human-readable * 2>/dev/null'
    alias gi='grep --color -i'
    alias git-log-full='git log --decorate=full --graph --stat'
    alias git-status-full='git -c color.ui=always status -uno'
    alias grep='grep --color'
    alias grep-fileonly='grep --color --files-with-matches'
    alias ipy='ipython'
    alias less='less --IGNORE-CASE --LONG-PROMPT --RAW-CONTROL-CHARS +Gg'
    alias less-raw='less --IGNORE-CASE --LONG-PROMPT --raw-control-chars --max-forw-scroll=999999 +Gg'
    alias ls='ls -hF --color'
    alias lsblk='lsblk --output +fstype,tran,model,serial,uuid,label'
    alias man-find='man -k'
    alias man-scan='man -K'
    alias mv='mv --no-clobber'
    alias pc='cmatrix'
    alias scd='screen -d'
    alias scl='screen -ls'
    alias scr='screen -dr'
    alias scs='screen-select'
    alias scw='screen -wipe'
    # fallback ssh
    alias scp-fallback='scp -o "BatchMode no"   -o "ChallengeResponseAuthentication no" -o "PubkeyAuthentication no" -o "PasswordAuthentication yes"'
    alias ssh-fallback='ssh -o "BatchMode no"   -o "ChallengeResponseAuthentication no" -o "PubkeyAuthentication no" -o "PasswordAuthentication yes"'
    alias sftp-fallback='sftp -o "BatchMode no" -o "ChallengeResponseAuthentication no" -o "PubkeyAuthentication no" -o "PasswordAuthentication yes"'
    ################################################################################
    # x11 startup
    alias startx='startx -- -novtswitch'
    ################################################################################
    ## set interesting things for bashrc, should these be here or a seperate file?
    # XXXX: is it likely this may clobber other things in the namespace?
    export VISUAL="emacs -nw"
    export EDITOR="zile"
    export ALTERNATE_EDITOR="mg"
    alias f90='gfortran'
    alias gpg='gpg2'
    alias hrc='harm-bashrc'
    alias ifconfig='/sbin/ifconfig'
    alias lspci-full='lspci -knnn'
    alias killall-jobs='kill $(jobs -p)'
    alias mupdf='mupdf-gl'
    alias netstat-pid='sudo netstat -nlpt'
    alias pgtop='sudo -u postgres pg_activity -U postgres'
    alias psql-postgres='sudo -u postgres psql'
    alias pdw='fortune | cowsay'
    alias restart-openbox="openbox --restart"
    alias svn-log-full='svn log -l 100 -v | less'
    alias sagepy='sage -python'
    alias sageipy='sage -ipython'
    alias xmodmap-ls='xmodmap -pm'
    alias ls-xmodmap='xmodmap -pm'
    alias ls-xrandr='xrandr --listmonitors;xrandr'
    alias vlc-full-help='unbuffer vlc --longhelp --advanced | less-raw'
    alias convert-safe='MAGICK_TEMPORARY_PATH=$HOME/tmp/imagemagick convert -limit memory 2GB -limit area 2GB -limit map 2GB'
    ################################################################################
    ################################################################################
    ## interactive and TTY stuff
    # prevent power save on virtual consoles
    # XXXX: without this, can cause problems when "not a tty" and $TERM=dumb
    [[ -z "$DISPLAY" && $(tty) != *'not a tty'* && $(tty) == *tty* ]] && setterm -blank 0 -powersave off
    # write, then reread the history file with each command
    export HISTCONTROL=ignoreboth
    export HISTSIZE=4096
    export HISTFILESIZE=65536
    export HISTIGNORE='exit:history:ls:rm *'
    shopt -s autocd extglob histappend
    export IGNOREEOF=99
    shopt -s expand_aliases
    export MAILCHECK=-1
    force_color_prompt=yes
    # turn off mail
    export MAILCHECK=-1
    # this allows C-s to be useful in a terminal
    [[ $- == *i* ]] && stty -ixon
    case "$TERM" in
    "dumb")
        PS1="> "
        ;;
    linux|xterm*|rxvt*|eterm*|screen*)
        if [ $(id -u) -eq 0 ]; then
            # \[\033[6 q\] gives a vertical cursor in xterm/rxvt
            export PS1="\[${BPurple}\]\H $(if [[ -n $SSH_CLIENT && $TERM =~ screen ]];then echo -n '(ssh,screen) ';elif [[ -n $SSH_CLIENT ]];then echo -n '(ssh) ';elif [[ $TERM =~ screen ]];then echo -n '(screen) ';fi)\[${Purple}\]\j \[${BBLue}\]\w
\[${Yellow}\][\!] \`exitstatus=\$?;if [[ exitstatus -eq 0 ]];then echo \[\033[32m\]\${exitstatus}\[\e[0m\];else echo \[\033[31m\]\${exitstatus}\[\e[0m\]; fi\` \[${Cyan}\]\t \[${Green}\]\u \[${BRed}\]"'\$'"\[${Color_Off}\]\[\033[6 q\] "
        else
            export PS1="\[${BPurple}\]\H $(if [[ -n $SSH_CLIENT && $TERM =~ screen ]];then echo -n '(ssh,screen) ';elif [[ -n $SSH_CLIENT ]];then echo -n '(ssh) ';elif [[ $TERM =~ screen ]];then echo -n '(screen) ';fi)\[${Purple}\]\j \[${BBLue}\]\w
\[${Yellow}\][\!] \`exitstatus=\$?;if [[ exitstatus -eq 0 ]];then echo \[\033[32m\]\${exitstatus}\[\e[0m\];else echo \[\033[31m\]\${exitstatus}\[\e[0m\]; fi\` \[${Cyan}\]\t \[${Green}\]\u \[${BGreen}\]\$\[${Color_Off}\]\[\033[6 q\] "
            # XXXX: originally was "linux" to help with sage -python, but interfered with htop
            #       seems fine with rxvt-256color because this is in both sage and Debian
            # export TERM=xterm-256color
            [[ $TERM == rxvt-unicode-256color ]] && export TERM=rxvt-256color
        fi
        ;;
    *)
        PS1="> "
    esac

    # XXXX: only do prompt command in appropriate terminals
    # TODO: enhance the terminals it works for including eterm
    #       do I want to do this with screen
    if [[ "$TERM" =~ linux|xterm*|rxvt* ]];then
        SHORTPWD=$(sed -r 's|'"$HOME"'|~|g' <<< "$PWD")
        export PROMPT_COMMAND='history -a; history -n;echo -ne "\033]0;${HOSTNAME}:${SHORTPWD}\007"'

        show_command_in_title_bar() {
            # TODO: this is needed here
            if [[ -n "$PS1" ]]; then
                export SHORTPWD=$(sed -r 's|'"$HOME"'|~|g' <<< "$PWD")
                case "$BASH_COMMAND" in
                    *"\033]0"*)
                    # The command is trying to set the title bar as well;
                    # this is most likely the execution of $PROMPT_COMMAND.
                    # In any case nested escapes confuse the terminal, so don't
                    # output them.
                    ;;
                *)
                    # this stops funny beeping when \n included
                    local BASH_COMMAND_TEST="${BASH_COMMAND//$'\n'/}"
                    local BASH_COMMAND_TEST="${BASH_COMMAND_TEST//'\n'/}"
                    echo -ne "\033]0;${BASH_COMMAND_TEST}: ${HOSTNAME}\007"
                    ;;
                esac
            fi
        }
        # XXXX: is there ever a nicer way to do this?
        trap -- show_command_in_title_bar DEBUG
    else
        export PROMPT_COMMAND='history -a; history -n'
    fi
fi
################################################################################
################################################################################
# source additional files
# these will check on their own whether things are appropriate for interactive or not
pushd . >/dev/null
cd "$HOME"
# load everything in ~/.bashrc.d
if [[ -d "$HOME/.bashrc.d/" ]]; then
    for FILE in $HOME/.bashrc.d/*; do
        source "$FILE"
    done
fi
# load everything in ~/.bash_library.d
if [[ -d "$HOME/.bash_library.d" ]]; then
    # load everything in ~/.bash_library.d
    for FILE in $HOME/.bash_library.d/*;do
        source "$FILE"
    done
fi
popd >/dev/null


################################################################################
################################################################################
# useful functions

dd-progress () {
    # check progress of dd commands, the output is in the terminal of the  dd command
    sudo kill -USR1 $(pgrep ^dd)
}
