#!/bin/bash
SCRIPTPATH=$(dirname $(readlink -f "$0"))
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
    need_new_symlink ${SCRIPTPATH}/zile ${HOME}/.zile
    need_new_symlink ${SCRIPTPATH}/xbindkeysrc.scm ${HOME}/.xbindkeysrc
    need_new_symlink ${SCRIPTPATH}/pentadactylrc ${HOME}/.pentadactylrc
    # .config
    need_new_directory ${HOME}/.config
    need_new_directory ${HOME}/.config/autostart
    # openbox
    need_new_directory ${HOME}/.config/openbox
    need_new_directory ${HOME}/.themes
    need_new_directory ${HOME}/.themes/MyClearlooks/
    need_new_directory ${HOME}/.themes/MyClearlooks/openbox-3/
    need_new_symlink ${SCRIPTPATH}/openbox.xml       ${HOME}/.config/openbox/rc.xml
    # raspberry pi openbox
    if [[ -e "${HOME}"/.config/lxsession/LXDE-pi ]]; then
        need_new_symlink ${SCRIPTPATH}/lxde-pi-autostart "${HOME}"/.config/lxsession/LXDE-pi/autostart
    fi
    # TODO: unify eventually?
    need_new_symlink ${SCRIPTPATH}/lxde-pi-rc.xml    ${HOME}/.config/openbox/lxde-pi-rc.xml
    need_new_symlink ${SCRIPTPATH}/openbox-menu.xml  ${HOME}/.config/openbox/menu.xml
    need_new_symlink ${SCRIPTPATH}/openbox-autostart ${HOME}/.config/openbox/autostart
    need_new_symlink ${SCRIPTPATH}/openbox-myclearlooks.themerc ${HOME}/.themes/MyClearlooks/openbox-3/themerc
    # pcmanfm
    # XXXX: overwrite to avoid my git repo being edited by program
    need_new_directory ${HOME}/.config/pcmanfm/default
    # XXXX: using backslash in front of cp does not work well on some systems I have for unknown reasons
    command cp ${SCRIPTPATH}/pcmanfm.conf ${HOME}/.config/pcmanfm/default/pcmanfm.conf
    # X11
    need_new_symlink ${SCRIPTPATH}/xmodmaprc ${HOME}/.xmodmaprc
    need_new_symlink ${SCRIPTPATH}/xpdfrc ${HOME}/.xpdfrc
    need_new_symlink ${SCRIPTPATH}/Xresources ${HOME}/.Xresources
    # feh
    need_new_directory ${HOME}/.config/feh
    need_new_symlink ${SCRIPTPATH}/feh-buttons ${HOME}/.config/feh/buttons
    need_new_symlink ${SCRIPTPATH}/feh-keys    ${HOME}/.config/feh/keys
}
main
