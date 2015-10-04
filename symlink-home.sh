#!/bin/bash
SCRIPTPATH=$(dirname "$0")
# requires https://github.com/akroshko/bash-stdlib
source ~/.bash_library
need_new_directory ~/.conkerorrc
need_new_symlink ${SCRIPTPATH}/conkerorrc.js ~/.conkerorrc/conkerorrc.js
need_new_symlink ${SCRIPTPATH}/conkyrc ~/.conkyrc
need_new_symlink ${SCRIPTPATH}/gitconfig ~/.gitconfig
need_new_symlink ${SCRIPTPATH}/gitignore ~/.gitignore
need_new_symlink ${SCRIPTPATH}/guile ~/.guile
need_new_symlink ${SCRIPTPATH}/hgpersonal ~/.hgpersonal
need_new_symlink ${SCRIPTPATH}/inputrc ~/.inputrc
need_new_symlink ${SCRIPTPATH}/latexmkrc ~/.latexmkrc
need_new_symlink ${SCRIPTPATH}/screenrc ~/.screenrc
# empty include files
# TODO: eventually change
touch ~/.xbindkeys_first_personal.scm
touch ~/.xbindkeys_second_personal.scm
need_new_symlink ${SCRIPTPATH}/xbindkeysrc.scm ~/.xbindkeysrc
need_new_symlink ${SCRIPTPATH}/pentadactylrc ~/.pentadactylrc
# openbox
need_new_directory ~/.config
need_new_directory ~/.config/openbox
need_new_directory ~/.config/autostart
need_new_symlink ${SCRIPTPATH}/openbox.xml ~/.config/openbox/rc.xml
need_new_symlink ${SCRIPTPATH}/openbox-autostart ~/.config/openbox/autostart
# X11
need_new_symlink ${SCRIPTPATH}/xmodmap ~/.xmodmap
need_new_symlink ${SCRIPTPATH}/xpdfrc ~/.xpdfrc
need_new_symlink ${SCRIPTPATH}/Xresources ~/.Xresources
