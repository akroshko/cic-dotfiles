#!/bin/bash
SCRIPTPATH=$(dirname "$0")
main () {
    # requires https://github.com/akroshko/bash-stdlib
    source ${HOME}/.bash_library
    need_new_directory ${HOME}/.conkerorrc
    need_new_symlink ${SCRIPTPATH}/conkerorrc.js ${HOME}/.conkerorrc/conkerorrc.js
    need_new_symlink ${SCRIPTPATH}/conkyrc ${HOME}/.conkyrc
    need_new_symlink ${SCRIPTPATH}/gitconfig ${HOME}/.gitconfig
    need_new_symlink ${SCRIPTPATH}/gitignore ${HOME}/.gitignore
    need_new_symlink ${SCRIPTPATH}/guile ${HOME}/.guile
    need_new_symlink ${SCRIPTPATH}/hgpersonal ${HOME}/.hgpersonal
    need_new_symlink ${SCRIPTPATH}/inputrc ${HOME}/.inputrc
    need_new_symlink ${SCRIPTPATH}/latexmkrc ${HOME}/.latexmkrc
    need_new_symlink ${SCRIPTPATH}/screenrc ${HOME}/.screenrc
    # empty include files
    # set this up better, want this to not go first
    # need_new_symlink /dev/null ${HOME}/.xbindkeys_first_personal.scm
    # need_new_symlink /dev/null ${HOME}/.xbindkeys_second_personal.scm
    need_new_symlink ${SCRIPTPATH}/xbindkeysrc.scm ${HOME}/.xbindkeysrc
    need_new_symlink ${SCRIPTPATH}/pentadactylrc ${HOME}/.pentadactylrc
    # openbox
    need_new_directory ${HOME}/.config
    need_new_directory ${HOME}/.config/openbox
    need_new_directory ${HOME}/.config/autostart
    need_new_symlink ${SCRIPTPATH}/openbox.xml ${HOME}/.config/openbox/rc.xml
    need_new_symlink ${SCRIPTPATH}/openbox-autostart ${HOME}/.config/openbox/autostart
    # X11
    need_new_symlink ${SCRIPTPATH}/xmodmap ${HOME}/.xmodmap
    need_new_symlink ${SCRIPTPATH}/xpdfrc ${HOME}/.xpdfrc
    need_new_symlink ${SCRIPTPATH}/Xresources ${HOME}/.Xresources
}
main
