#!/bin/bash
# XXXX: I'm using gnome less now as opposed to openbox, so this package will probably become depricated
# TODO: move some of these commands elsewhere
main () {
    # set some default apps
    # TODO: like these commands
    xdg-mime default ebook-viewer.desktop application/epub+zip
    xdg-mime default vlc.desktop video/mp4
    xdg-mime default vlc.desktop video/x-flv
    # TODO: move ones without problematic default bindings into comments
    # use dconf-editor to find these
    # also see /usr/share/glib-2.0/schemas
    # org.gnome.desktop.screensaver
    # misc gnome stuff
    # TODO: remapped to space for now
    # gsettings set org.gnome.mutter overlay-key "Menu"
    gsettings set org.gnome.mutter overlay-key ""
    # gsettings set org.gnome.desktop.wm.preferences theme "Crux"
    # I like this theme because it gives clear indication of the focused window and I really like this font
    gsettings set org.gnome.desktop.wm.preferences theme "Shiki-Colors-Striped-Metacity"
    gsettings set org.gnome.desktop.wm.preferences titlebar-font "Droid Sans Mono Bold 9"
    # see https://major.io/2015/07/06/allow-new-windows-to-steal-focus-in-gnome-3/
    gsettings set org.gnome.desktop.wm.preferences focus-new-windows 'strict'
    # gsettings set org.gnome.desktop.wm.preferences titlebar-font "Cantarell Bold 9"
    gsettings set org.gnome.mutter.keybindings toggle-tiled-left "@as ['<Alt><Super>b']"
    gsettings set org.gnome.mutter.keybindings toggle-tiled-right "@as ['<Alt><Super>f']"
    # blank screen after 30min of inactivity
    gsettings set org.gnome.desktop.session idle-delay 1800
    gsettings set org.gnome.desktop.screensaver lock-delay 120
    gsettings set org.gnome.desktop.screensaver lock-enabled true
    gsettings set org.gnome.settings-daemon.plugins.orientation active false
    gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-timeout 0
    gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-type "nothing"
    gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-battery-timeout 0
    gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-battery-type "nothing"
    # privacy and security
    gsettings set org.gnome.desktop.privacy remember-recent-files false
    gsettings set org.gnome.desktop.thumbnail-cache maximum-age 7
    # interface?
    gsettings set org.gnome.desktop.interface clock-show-date true
    # applets
    # [org/gnome/shell]
    gsettings set org.gnome.shell enabled-extensions "['alternative-status-menu@gnome-shell-extensions.gcampax.github.com', 'window-list@gnome-shell-extensions.gcampax.github.com', 'drive-menu@gnome-shell-extensions.gcampax.github.com']"
    # [org/gnome/shell/extensions/openweather, 'openweather-extension@jenslody.de',]
    gsettings set org.gnome.shell.extensions.openweather show-comment-in-panel true
    gsettings set org.gnome.shell.extensions.openweather center-forecast false
    gsettings set org.gnome.shell.extensions.openweather use-text-on-buttons false
    gsettings set org.gnome.shell.extensions.openweather unit "celsius"
    gsettings set org.gnome.shell.extensions.openweather actual-city 0
    gsettings set org.gnome.shell.extensions.openweather city "6141256>Saskatoon (CA)"
    # apps
    gsettings set org.gnome.calculator button-mode "advanced"
    # gsettings set org.gnome.Epiphany.ui tabs-bar-visibility-policy 'never'
    gsettings set org.gnome.Epiphany.web enable-adblock true
    gsettings set org.gnome.Epiphany.web enable-popups false
    gsettings set org.gnome.Epiphany.web do-not-track true
    gsettings set org.gnome.Epiphany restore-session-policy never
    # terminal
    gsettings set org.gnome.Terminal.Legacy.Settings dark-theme true
    gsettings set org.gnome.Terminal.Legacy.Settings confirm-close false
    gsettings set org.gnome.Terminal.Legacy.Settings default-show-menubar false
    ################################################################################
    ## keybindings I like
    # get with: gsettings list-recursively org.gnome.desktop.wm.keybindings > keybindings
    gsettings set org.gnome.desktop.wm.keybindings show-desktop " @as ['<Alt><Super>d']"
    # TODO: originally super alt-x,z
    gsettings set org.gnome.desktop.wm.keybindings switch-windows "@as ['<Super>x', '<Alt>Tab']"
    gsettings set org.gnome.desktop.wm.keybindings switch-windows-backward "@as ['<Shift><Super>x', '<Shift><Alt>Tab']"
    gsettings set org.gnome.desktop.wm.keybindings move-to-monitor-left "@as ['<Shift><Alt><Super>b']"
    gsettings set org.gnome.desktop.wm.keybindings move-to-monitor-right "@as ['<Shift><Alt><Super>f']"
    gsettings set org.gnome.desktop.wm.keybindings cycle-windows-backward " ['<Shift><Alt>Escape']"
    gsettings set org.gnome.desktop.wm.keybindings toggle-maximized " ['<Alt><Super>m']"
    gsettings set org.gnome.desktop.wm.keybindings minimize " ['<Alt><Super>l']"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-1 "['<Primary><Super>1']"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-2 "['<Primary><Super>2']"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-3 "['<Primary><Super>3']"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-4 "['<Primary><Super>4']"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-last "['<Primary><Super>e']"
    # Some defaults  I want to make sure are set
    gsettings set org.gnome.desktop.wm.keybindings panel-run-dialog "['<Alt>F2']"
    gsettings set org.gnome.desktop.wm.keybindings close "['<Alt>F4']"
    gsettings set org.gnome.desktop.wm.keybindings begin-move "['<Alt>F7']"
    gsettings set org.gnome.desktop.wm.keybindings begin-resize "['<Alt>F8']"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-left "['<Primary><Super>b']"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-right "['<Primary><Super>f']"
    gsettings set org.gnome.desktop.wm.keybindings cycle-group-backward "['<Shift><Alt>F6']"
    # not sure I want to keep these set
    gsettings set org.gnome.desktop.wm.keybindings switch-panels-backward " ['<Shift><Control><Alt>Tab']"
    gsettings set org.gnome.desktop.wm.keybindings cycle-panels-backward "['<Shift><Control><Alt>Escape']"
    gsettings set org.gnome.desktop.wm.keybindings switch-group "['<Super>Above_Tab', '<Alt>Above_Tab']"
    gsettings set org.gnome.desktop.wm.keybindings switch-group-backward "['<Shift><Super>Above_Tab', '<Shift><Alt>Above_Tab']"
    ################################################################################
    ## make sure keybinds that might conflict with mine are empty
    # nuke gnome wm defaults that I don't like
    gsettings set org.gnome.desktop.wm.keybindings switch-applications "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-applications-backward "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-side-w "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-side-e "@as []"
    # nuke gnome shell defaults that I don't like
    gsettings set org.gnome.shell.keybindings toggle-application-view "[]"
    gsettings set org.gnome.shell.keybindings focus-active-notification "[]"
    gsettings set org.gnome.shell.keybindings toggle-message-tray "[]"
    gsettings set org.gnome.shell.keybindings toggle-overview "[]"
    # settings daemon
    # XXXX: disable all builtin screenshot keys
    gsettings set org.gnome.settings-daemon.plugins.media-keys screenshot             "[]"
    gsettings set org.gnome.settings-daemon.plugins.media-keys screenshot-clip        "[]"
    gsettings set org.gnome.settings-daemon.plugins.media-keys area-screenshot-clip   "[]"
    gsettings set org.gnome.settings-daemon.plugins.media-keys window-screenshot-clip "[]"
    gsettings set org.gnome.settings-daemon.plugins.media-keys window-screenshot      "[]"
    gsettings set org.gnome.settings-daemon.plugins.media-keys screencast             "[]"
    gsettings set org.gnome.settings-daemon.plugins.media-keys screensaver            "[]"
    gsettings set org.gnome.settings-daemon.plugins.media-keys screenreader           "[]"
    gsettings set org.gnome.settings-daemon.plugins.media-keys video-out              "[]"
    # window change
    gsettings set org.gnome.desktop.wm.keybindings cycle-windows "@as []"
    gsettings set org.gnome.desktop.wm.keybindings maximize "@as []"
    gsettings set org.gnome.desktop.wm.keybindings maximize-vertically " @as []"
    gsettings set org.gnome.desktop.wm.keybindings maximize-horizontally " @as []"
    gsettings set org.gnome.desktop.wm.keybindings unmaximize " @as []"
    gsettings set org.gnome.desktop.wm.keybindings toggle-fullscreen "@as []"
    gsettings set org.gnome.desktop.wm.keybindings raise " @as []"
    gsettings set org.gnome.desktop.wm.keybindings lower "@as []"
    gsettings set org.gnome.desktop.wm.keybindings raise-or-lower "@as []"
    gsettings set org.gnome.desktop.wm.keybindings always-on-top "@as []"
    gsettings set org.gnome.desktop.wm.keybindings toggle-above "@as []"
    gsettings set org.gnome.desktop.wm.keybindings toggle-shaded "@as []"
    gsettings set org.gnome.desktop.wm.keybindings toggle-on-all-workspaces "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-corner-nw "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-corner-ne "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-corner-sw "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-corner-se "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-side-n "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-side-s "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-center "@as []"
    # window switch
    gsettings set org.gnome.desktop.wm.keybindings switch-panels "@as []"
    gsettings set org.gnome.desktop.wm.keybindings cycle-panels "@as []"
    gsettings set org.gnome.desktop.wm.keybindings panel-main-menu "@as []"
    gsettings set org.gnome.desktop.wm.keybindings cycle-group "@as []"
    # monitor
    gsettings set org.gnome.desktop.wm.keybindings move-to-monitor-up "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-monitor-down "@as []"
    # workspace
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-5 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-6 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-7 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-8 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-9 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-10 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-11 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-12 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-up "@as []"
    gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-down "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-1 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-2 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-3 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-4 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-5 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-6 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-7 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-8 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-9 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-10 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-11 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-12 "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-up "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-down "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-left "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-right "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-last "@as []"
    # wierd
    gsettings set org.gnome.desktop.wm.keybindings activate-window-menu "@as []"
    gsettings set org.gnome.desktop.wm.keybindings set-spew-mark "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-input-source "@as []"
    gsettings set org.gnome.desktop.wm.keybindings switch-input-source-backward "@as []"
}
main
