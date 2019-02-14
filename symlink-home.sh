#!/bin/bash
SCRIPTPATH=$(dirname $(readlink -f "$0"))
main () {
    # requires https://github.com/akroshko/bash-stdlib
    source "$HOME/.bash_library"
    need_new_directory "$HOME/.conkerorrc"
    # make sure the normal conkerorrc is loaded first
    need_new_symlink "${SCRIPTPATH}/conkerorrc.js"          "$HOME/.conkerorrc/00conkerorrc.js"
    # add some garbage collection to conkeror startup
    echo "Cu.forceGC();" >                                  "$HOME/.conkerorrc/zz99conkerorgc.js"
    # TODO: add a fence here to make sure this works
    cp "${SCRIPTPATH}/conkeror-webpage-key-kill.js"         "$HOME/cic-external-vcs/conkeror-external/modules/page-modes/webpage-key-kill.js"
    need_new_symlink "${SCRIPTPATH}/conkeror-webjumps.json" "$HOME/.conkerorrc/conkeror-webjumps.json"
    need_new_symlink "${SCRIPTPATH}/conkyrc"                "$HOME/.conkyrc"
    need_new_symlink "${SCRIPTPATH}/gitconfig"              "$HOME/.gitconfig"
    need_new_symlink "${SCRIPTPATH}/gitignore"              "$HOME/.gitignore"
    need_new_symlink "${SCRIPTPATH}/guile"                  "$HOME/.guile"
    need_new_symlink "${SCRIPTPATH}/inputrc"                "$HOME/.inputrc"
    need_new_symlink "${SCRIPTPATH}/latexmkrc"              "$HOME/.latexmkrc"
    need_new_symlink "${SCRIPTPATH}/screenrc"               "$HOME/.screenrc"
    need_new_symlink "${SCRIPTPATH}/wmcalc"                 "$HOME/.wmcalc"
    need_new_symlink "${SCRIPTPATH}/zile"                   "$HOME/.zile"
    need_new_symlink "${SCRIPTPATH}/pentadactylrc"          "$HOME/.pentadactylrc"
    # .config
    need_new_directory "$HOME/.config"
    need_new_directory "$HOME/.config/autostart"
    # openbox
    need_new_directory "$HOME/.config/openbox"
    need_new_directory "$HOME/.themes"
    need_new_directory "$HOME/.themes/MyClearlooks/"
    need_new_directory "$HOME/.themes/MyClearlooks/openbox-3/"
    need_new_symlink   "${SCRIPTPATH}/openbox.xml" "$HOME/.config/openbox/rc.xml"
    # raspberry pi openbox
    [[ -e "$HOME/.config/lxsession/LXDE-pi" ]] && need_new_symlink "${SCRIPTPATH}/lxde-pi-autostart" "$HOME/.config/lxsession/LXDE-pi/autostart"
    # TODO: unify eventually?
    need_new_symlink "${SCRIPTPATH}/lxde-pi-rc.xml"               "$HOME/.config/openbox/lxde-pi-rc.xml"
    need_new_symlink "${SCRIPTPATH}/openbox-menu.xml"             "$HOME/.config/openbox/menu.xml"
    need_new_symlink "${SCRIPTPATH}/openbox-autostart"            "$HOME/.config/openbox/autostart"
    need_new_symlink "${SCRIPTPATH}/openbox-myclearlooks.themerc" "$HOME/.themes/MyClearlooks/openbox-3/themerc"
    # pcmanfm
    # XXXX: overwrite to avoid my git repo being edited by program
    need_new_directory "$HOME/.config/pcmanfm/default"
    # XXXX: using backslash in front of cp does not work well on some systems I have for unknown reasons
    cp_if_different "${SCRIPTPATH}/pcmanfm.conf" "$HOME/.config/pcmanfm/default/pcmanfm.conf"
    # X11
    need_new_symlink "${SCRIPTPATH}/xmodmaprc"                  "$HOME/.xmodmaprc"
    need_new_symlink "${SCRIPTPATH}/xmodmaprc_numpad_fkeys"     "$HOME/.xmodmaprc_numpad_fkeys"
    need_new_symlink "${SCRIPTPATH}/xmodmaprc_numpad_arrowkeys" "$HOME/.xmodmaprc_numpad_arrowkeys"
    need_new_symlink "${SCRIPTPATH}/xpdfrc"                     "$HOME/.xpdfrc"
    need_new_symlink "${SCRIPTPATH}/Xresources"                 "$HOME/.Xresources"
    # feh
    need_new_directory                                          "$HOME/.config/feh"
    need_new_symlink "${SCRIPTPATH}/feh-buttons"                "$HOME/.config/feh/buttons"
    need_new_symlink "${SCRIPTPATH}/feh-keys"                   "$HOME/.config/feh/keys"
    # calibre
    # TODO: copying to avoid settings overwriting.... need to suppress this script if experimenting
    need_new_directory                                          "$HOME/.config/calibre/shortcuts"
    # [[ -e $HOME/.config/calibre/shortcuts/viewer.plist ]] && rm $HOME/.config/calibre/shortcuts/viewer.plist
    [[ -d "$HOME/.config/calibre/shortcuts" ]]               && cp_if_different "${SCRIPTPATH}/calibre-viewer.plist" "$HOME/.config/calibre/shortcuts/viewer.plist"
    [[ -f "$HOME/.config/calibre/viewer.py" ]]               && rm                                                   "$HOME/.config/calibre/viewer.py"
    [[ -d "$HOME/.config/calibre/" ]]                        && cp_if_different "${SCRIPTPATH}/calibre-viewer.py"    "$HOME/.config/calibre/viewer.py"
    # create some quick links
    need_new_directory "$HOME/bin"
    # TODO: do better, works for now
    need_new_symlink "${SCRIPTPATH}/../bash-stdlib/launch-emacsclient"          "$HOME/bin/launch-emacsclient"
    need_new_symlink "${SCRIPTPATH}/../bash-stdlib/launch-emacsclient-fail.sh"  "$HOME/bin/launch-emacsclient-fail.sh"
    need_new_symlink "${SCRIPTPATH}/../bash-stdlib/web-video-focus.sh"          "$HOME/bin/web-video-focus.sh"
    need_new_symlink "${SCRIPTPATH}/../bash-stdlib/web-video-focus-restore.sh"  "$HOME/bin/web-video-focus-restore.sh"
    need_new_symlink "${SCRIPTPATH}/../bash-stdlib/web-video-minimize.sh"       "$HOME/bin/web-video-minimize.sh"
    need_new_symlink "${SCRIPTPATH}/../bash-stdlib/web-video-pause-toggle.sh"   "$HOME/bin/web-video-pause-toggle.sh"
    need_new_symlink "${SCRIPTPATH}/../bash-stdlib/web-video-restore.sh"        "$HOME/bin/web-video-restore.sh"
    need_new_symlink "${SCRIPTPATH}/../bash-stdlib/x11_restore_saved_window.sh" "$HOME/bin/x11_restore_saved_window.sh"
    need_new_symlink "${SCRIPTPATH}/../bash-stdlib/x11_save_focused_window.sh"  "$HOME/bin/x11_save_focused_window.sh"
    need_new_symlink "${SCRIPTPATH}/../bash-stdlib/zathura-tex-local.sh"        "$HOME/bin/zathura-tex-local.sh"
}
main
