#!/bin/bash
# symlink-home.sh symlinks or copies my configuration files to the appropriate place
#
# Copyright (C) 2015-2019, Andrew Kroshko, all rights reserved.
#
# Author: Andrew Kroshko
# Maintainer: Andrew Kroshko <akroshko.public+devel@gmail.com>
# Created: Fri Sep 18, 2015
# Version: 20191209
# URL: https://github.com/akroshko/cic-bash-common
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

SCRIPTPATH=$(dirname -- $(readlink -f -- "$0"))
main () {
    # requires https://github.com/akroshko/cic-bash-common
    source "$HOME/.bash_library"
    need_new_directory "$HOME/.conkerorrc"
    # make sure the normal conkerorrc is loaded first
    need_new_symlink "$SCRIPTPATH/conkerorrc.js"          "$HOME/.conkerorrc/00conkerorrc.js"
    # add some garbage collection to conkeror startup
    echo "Cu.forceGC();" >                                "$HOME/.conkerorrc/zz99conkerorgc.js"
    need_new_symlink "$SCRIPTPATH/conkeror-webjumps.json" "$HOME/.conkerorrc/conkeror-webjumps.json"
    need_new_symlink "$SCRIPTPATH/conkyrc"                "$HOME/.conkyrc"
    need_new_symlink "$SCRIPTPATH/gitconfig"              "$HOME/.gitconfig"
    need_new_symlink "$SCRIPTPATH/gitignore"              "$HOME/.gitignore"
    need_new_symlink "$SCRIPTPATH/inputrc"                "$HOME/.inputrc"
    need_new_symlink "$SCRIPTPATH/latexmkrc"              "$HOME/.latexmkrc"
    need_new_symlink "$SCRIPTPATH/screenrc"               "$HOME/.screenrc"
    need_new_symlink "$SCRIPTPATH/wmcalc"                 "$HOME/.wmcalc"
    need_new_symlink "$SCRIPTPATH/zile"                   "$HOME/.zile"
    need_new_symlink "$SCRIPTPATH/pentadactylrc"          "$HOME/.pentadactylrc"
    # .config
    need_new_directory "$HOME/.config"
    need_new_directory "$HOME/.config/autostart"
    # openbox
    need_new_directory "$HOME/.config/openbox"
    need_new_directory "$HOME/.themes"
    need_new_directory "$HOME/.themes/MyClearlooks/"
    need_new_directory "$HOME/.themes/MyClearlooks/openbox-3/"
    need_new_symlink   "$SCRIPTPATH/openbox.xml" "$HOME/.config/openbox/rc.xml"
    # raspberry pi openbox
    [[ -e "$HOME/.config/lxsession/LXDE-pi" ]] && need_new_symlink "$SCRIPTPATH/lxde-pi-autostart" "$HOME/.config/lxsession/LXDE-pi/autostart"
    # TODO: unify eventually?
    need_new_symlink "$SCRIPTPATH/lxde-pi-rc.xml"               "$HOME/.config/openbox/lxde-pi-rc.xml"
    need_new_symlink "$SCRIPTPATH/openbox-menu.xml"             "$HOME/.config/openbox/menu.xml"
    need_new_symlink "$SCRIPTPATH/openbox-autostart"            "$HOME/.config/openbox/autostart"
    need_new_symlink "$SCRIPTPATH/openbox-myclearlooks.themerc" "$HOME/.themes/MyClearlooks/openbox-3/themerc"
    # pcmanfm
    # XXXX: overwrite rather than symlink to avoid my git repo being edited by pcmanfm program
    need_new_directory "$HOME/.config/pcmanfm/default"
    # XXXX: using backslash in front of cp does not work well on some systems I have for unknown reasons
    cp_if_different "$SCRIPTPATH/pcmanfm.conf" "$HOME/.config/pcmanfm/default/pcmanfm.conf"
    # X11
    need_new_symlink "$SCRIPTPATH/xmodmaprc"                  "$HOME/.xmodmaprc"
    need_new_symlink "$SCRIPTPATH/xpdfrc"                     "$HOME/.xpdfrc"
    need_new_symlink "$SCRIPTPATH/Xresources"                 "$HOME/.Xresources"
    # feh
    need_new_directory                                        "$HOME/.config/feh"
    need_new_symlink "$SCRIPTPATH/feh-buttons"                "$HOME/.config/feh/buttons"
    need_new_symlink "$SCRIPTPATH/feh-keys"                   "$HOME/.config/feh/keys"
    # calibre
    need_new_directory                                          "$HOME/.config/calibre/shortcuts"
    [[ -d "$HOME/.config/calibre/shortcuts" ]]               && cp_if_different "$SCRIPTPATH/calibre-viewer.plist" "$HOME/.config/calibre/shortcuts/viewer.plist"
    [[ -f "$HOME/.config/calibre/viewer.py" ]]               && \rm                                                "$HOME/.config/calibre/viewer.py"
    [[ -d "$HOME/.config/calibre/" ]]                        && cp_if_different "$SCRIPTPATH/calibre-viewer.py"    "$HOME/.config/calibre/viewer.py"
    # create some quick links
    need_new_directory "$HOME/bin"
    # TODO: do better, works for now
    need_new_symlink "$SCRIPTPATH/../cic-bash-common/launch-emacsclient"          "$HOME/bin/launch-emacsclient"
    need_new_symlink "$SCRIPTPATH/../cic-bash-common/launch-emacsclient-fail.sh"  "$HOME/bin/launch-emacsclient-fail.sh"
    need_new_symlink "$SCRIPTPATH/../cic-bash-common/x11_restore_saved_window.sh" "$HOME/bin/x11_restore_saved_window.sh"
    need_new_symlink "$SCRIPTPATH/../cic-bash-common/x11_save_focused_window.sh"  "$HOME/bin/x11_save_focused_window.sh"
    need_new_symlink "$SCRIPTPATH/../cic-bash-common/zathura-tex-local.sh"        "$HOME/bin/zathura-tex-local.sh"
}
main
