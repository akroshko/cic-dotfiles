;;; xbindkeysrc.scm -- xbindkeys configuration file for global
;;; shortcuts, using either plain keyboard shortcuts or with a prefix
;;; key.
;;
;; Copyright (C) 2015-2016, Andrew Kroshko, all rights reserved.
;;
;; Author: Andrew Kroshko
;; Maintainer: Andrew Kroshko <akroshko.public+devel@gmail.com>
;; Created: Sun Sep 20, 2015
;; Version: 20160130
;; URL: https://github.com/akroshko/emacs-stdlib
;;
;; This program is free software; you can redistribute it and/or
;; modify it under the terms of the GNU General Public License as
;; published by the Free Software Foundation; either version 3, or
;; (at your option) any later version.
;;
;; This program is distributed in the hope that it will be useful,
;; but WITHOUT ANY WARRANTY; without even the implied warranty of
;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
;; General Public License for more details.
;;
;; You should have received a copy of the GNU General Public License
;; along with this program; see the file COPYING.  If not, write to
;; the Free Software Foundation, Inc., 51 Franklin Street, Fifth
;; Floor, Boston, MA 02110-1301, USA.
;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; This script uses no prefix key or a prefix key of control-backtick
;; to define global keys.  Optionally includes some personal files for
;; the first or second key binding.
;;
;; see http://www.nongnu.org/xbindkeys/xbindkeysrc-combo.scm.html

(define (check-de)
  "Check for a desktop environment, only gnome for now."
  (equal? (getenv "DESKTOP_SESSION") "gnome"))

(define (first-binding)
  "First binding."
  ;; control-backtick as a prefix key
  (xbindkey-function '(control "c:49") second-binding)
  ;; TODO: seperate repl and search key
  ;; control-shift-backtick as a search key
  (xbindkey-function '(control shift "c:49") second-repl-binding)
  ;; control-tab as a repl key
  (xbindkey-function '(control "c:23") second-search-binding)
  ;; deal with the fact terminals don't have C-, and C-.
  ;; TODO: still want apps to support other things, just in case xbindkeys not installed
  ;; TODO: disabled, M- most convienient for laptop, control most convienient for touch typing
  ;; (xbindkey-function '(alt "c:59")
  ;;                    (lambda ()
  ;;                      (run-command "xvkbd -xsendevent -text \"\\[Prior]\"")))
  ;; (xbindkey-function '(alt "c:60")
  ;;                    (lambda ()
  ;;                      (run-command "xvkbd -xsendevent -text \"\\[Next]\"")))
  (xbindkey-function '(control "c:59")
                     (lambda ()
                       (run-command "xvkbd -xsendevent -text \"\\[Prior]\"")))
  (xbindkey-function '(control "c:60")
                     (lambda ()
                       (run-command "xvkbd -xsendevent -text \"\\[Next]\"")))
  ;; super-shift-X is page up now, super-x is page down now
  ;; TODO: can I find something else?
  ;; (xbindkey-function '(shift mod4 "x")
  ;;                    (lambda ()
  ;;                      (run-command "xvkbd -xsendevent -text \"\\[Prior]\"")))
  ;; (xbindkey-function '(mod4 "x")
  ;;                    (lambda ()
  ;;                      (run-command "xvkbd -xsendevent -text \"\\[Next]\"")))
  ;; meta-alt-x focuses an Emacs window
  ;; TODO: focus conkeror or xpdf?
  ;; echo "" | base64 --wrap=0
  (xbindkey-function '(release mod4 "c:61")
                     (lambda ()
                       ;; TODO: do this in openbox, doing it this way to avoid sourcing, same as focus-emacs-window, much more responsive
                       (run-command "~/.switch-to-emacs-or-passthrough.sh")))
  (xbindkey-function '(release mod4 "x")
                     (lambda ()
                       ;; TODO: do this in openbox, doing it this way to avoid sourcing, same as focus-emacs-window, much more responsive
                       (run-command "~/.switch-to-emacs-or-passthrough.sh")))
  ;; (xbindkey-function '(control "b:7")
  ;;                    (lambda ()
  ;;                      (run-command "conkeror-clipboard.sh google")))
  ;; (xbindkey-function '(alt "b:7")
  ;;                    (lambda ()
  ;;                      (run-command "conkeror-clipboard.sh scholar")))
  ;; shift-arrow keys to simulate mouse wheel, really useful on laptop
  (xbindkey-function '(shift "c:111")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key --window %1 click 4")))
  (xbindkey-function '(shift "c:116")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key --window %1 click 5")))
  ;; multi-media app keys are normally handled by DE
  (when (not (check-de))
        ;; volume down key
        (xbindkey-function '("c:122")
                           (lambda ()
                             (run-command "bash -c \"amixer set Master 10%-;source ~/.bash_library.d/bash_functions_stdlib;notify-amixer-volumes\"")))
        ;; volume up key
        (xbindkey-function '("c:123")
                           (lambda ()
                             (run-command "bash -c \"amixer set Master 10%+;source ~/.bash_library.d/bash_functions_stdlib;notify-amixer-volumes\"")))
        ;; mute key
        (xbindkey-function '("c:121")
                           (lambda ()
                             (run-command "amixer sset Master toggle")))
        ;; calculator key
        (xbindkey-function '("c:148")
                           (lambda ()
                             (run-command "xcalc"))))
  ;; for laptops without multimedia keys
  ;; star key
  (xbindkey-function '(alt mod4 shift "c:17")
                     (lambda ()
                       (run-command "xcalc")))
  ;; minus key
  (xbindkey-function '(alt mod4 "c:20")
                     (lambda ()
                       (run-command "bash -c \"amixer set Master 10%-;source ~/.bash_library.d/bash_functions_stdlib;notify-amixer-volumes\"")))
  ;; plus key
  (xbindkey-function '(alt mod4 shift "c:21")
                     (lambda ()
                       (run-command "bash -c \"amixer set Master 10%+;source ~/.bash_library.d/bash_functions_stdlib;notify-amixer-volumes\"")))
  ;; TODO: do I still want this?
  ;; (xbindkey-function '(control shift "c")
  ;;                    (lambda ()
  ;;                      (run-command "xclip -o -selection primary | xclip -i -selection clipboard")))
  ;; overrode in emacs
  ;; see if I want to do this
  ;; (xbindkey-function '(control shift "v")
  ;;                    (lambda ()
  ;;                      ;; TODO: doesn't work everywhere
  ;;                      (run-command "xdotool getwindowfocus key --window %1 click 2")))
  ;; doesn't really work, detects mouse down in emacs
  ;; (xbindkey-function '(mod4 alt "v")
  ;;                    (lambda ()
  ;;                      ;; TODO: doesn't work everywhere
  ;;                      (run-command "xdotool getwindowfocus key --window %1 click 2")))
  ;; f3, kill volume
  (xbindkey-function '("c:69")
                     (lambda ()
                       (run-command "amixer set Master mute")))
  (xbindkey-function '(control "c:69")
                     (lambda ()
                       (run-command "amixer set Master unmute")))
  ;; alt f3, normalize volume
  (xbindkey-function '(alt "c:69")
                     (lambda ()
                       (run-command "bash -c \"source ~/.bash_library.d/bash_functions_stdlib;normalize-volume\"")))
  ;; TODO: airplane mode here too
  ;; f4, throttle up
  ;; TODO: should be
  (xbindkey-function '("c:70")
                     (lambda ()
                       (run-command "bash -c \"source ~/.bash_library.d/bash_functions_stdlib;throttle-down\"")))
  ;; control-f4
  (xbindkey-function '(control "c:70")
                     (lambda ()
                       (run-command "bash -c \"source ~/.bash_library.d/bash_functions_stdlib;throttle-up\"")))
  ;; alt-f4
  (xbindkey-function '(alt "c:70")
                     (lambda ()
                       (run-command "bash -c \"source ~/.bash_library.d/bash_functions_stdlib;throttle-normal\"")))
  ;; f7 to google
  ;; TODO: alternative to google
  (xbindkey-function '("c:73")
                     (lambda ()
                       ;; search in conkeror
                       (run-command "bash -c \"~/bin/conkeror -f clipboard-search-google\"")))
  ;; F8
  (xbindkey-function '("c:74")
                     (lambda ()
                       ;; copy primary to clipboard
                       ;; TODO: implement this elsewhere
                       ;; TODO: do I really need the sleep?
                       (run-command "bash -c \"xclip -o -selection p | xclip -i -selection c;sleep 0.2\"")
                       ;; open in Collection with clipboard
                       (run-command "launch-emacsclient noframe --eval \"(cic:create-open-paste-collection)\"")))
  ;; TODO: not sure if consistent
  (xbindkey-function '(control "c:74")
                     (lambda ()
                       ;; open in Collection with clipboard
                       (run-command "launch-emacsclient noframe --eval \"(cic:create-open-collection-frame)\"")))
  (when (file-exists? (string-concatenate (list (getenv "HOME") "/.xbindkeys_first_personal.scm")))
        (load (string-concatenate (list (getenv "HOME") "/.xbindkeys_first_personal.scm"))))
  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
  ;; shift function keys up to f9
  (xbindkey-function '(shift "c:67")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key F1")))
  (xbindkey-function '(shift "c:68")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key F2")))
  (xbindkey-function '(shift "c:69")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key F3")))
  (xbindkey-function '(shift "c:70")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key F4")))
  (xbindkey-function '(shift "c:71")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key F5")))
  (xbindkey-function '(shift "c:72")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key F6")))
  (xbindkey-function '(shift "c:73")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key F7")))
  (xbindkey-function '(shift "c:74")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key F8")))
  (xbindkey-function '(shift "c:75")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key F9")))
  (xbindkey-function '(shift "c:76")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key F10")))
  (xbindkey-function '(shift "c:95")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key F11")))
  (xbindkey-function '(shift "c:96")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key F12"))))

(define (reset-first-binding)
    "Reset the first binding."
    (ungrab-all-keys)
    (remove-all-keys)
    (first-binding)
    (grab-all-keys))

(define (second-binding)
  "Second binding."
  (ungrab-all-keys)
  (remove-all-keys)
  ;; reset if sequence entered again
  (xbindkey-function '(control "c:49")
                     (lambda ()
                       (reset-first-binding)))
  ;; [
  (xbindkey-function '("c:34")
                     (lambda ()
                       (run-command "rxvt-unicode -title \"nuke-extra\" -x bash -i -c \"source ~/.bash_libenv;nuke-extra;read -p 'Press [Enter] to continue...'\"")
                       (reset-first-binding)))
  ;; ]
  (xbindkey-function '("c:35")
                     (lambda ()
                       (run-command "rxvt-unicode -title \"start-extra\" -x bash -i -c \"source ~/.bash_libenv;start-extra;read -p 'Press [Enter] to continue...'\"")
                       (reset-first-binding)))
  (xbindkey-function '("c:51")
                     (lambda ()
                       ;; TODO: lock then hibernate
                       (run-command "rxvt-unicode -title \"pm-hibernate\" -e bash -c \"source ~/.bash_libenv;sudo pm-hibernate\"")
                       (reset-first-binding)))
  ;; /
  (xbindkey-function '("c:61")
                     (lambda ()
                       (run-command "pcmanfm ~/Downloads")
                       (reset-first-binding)))
  ;; eventually check DE, for backlights
  ;; TODO: removed, in openbox menu now
  ;; get working properly with fn+f6/f7
  ;; (xbindkey-function '("c:71")
  ;;                    (lambda ()
  ;;                      (run-command "xbacklight -set 20")
  ;;                      (reset-first-binding)))
  ;; (xbindkey-function '("c:72")
  ;;                    (lambda ()
  ;;                      (run-command "xbacklight -set 100")
  ;;                      (reset-first-binding)))
  ;; not sure if these bindings are permanant
  ;; alt-/
  ;; (xbindkey-function '(alt "c:61")
  ;;                    (lambda ()
  ;;                      (run-command "nautilus ~/Dropbox")
  ;;                      (reset-first-binding)))
  ;; pause/play key
  (xbindkey-function '("c:172")
                     (lambda ()
                       (run-command "launch-emacsclient noframe --eval \"(emms-pause)\"")
                       (reset-first-binding)))
  ;; multi-media prev key
  (xbindkey-function '("c:173")
                     (lambda ()
                       (run-command "launch-emacsclient noframe --eval \"(emms-previous)\"")
                       (reset-first-binding)))
  ;; multi-media next key
  (xbindkey-function '("c:171")
                     (lambda ()
                       (run-command "launch-emacsclient noframe --eval \"(emms-next)\"")
                       (reset-first-binding)))
  ;; multi-media stop key
  (xbindkey-function '("c:174")
                     (lambda ()
                       (run-command "launch-emacsclient noframe --eval \"(emms-stop)\"")
                       (reset-first-binding)))
  ;; volume down key
  (xbindkey-function '("c:122")
                     (lambda ()
                       (run-command "launch-emacsclient noframe --eval \"(cic:emms-volume-lower)\"")
                       (reset-first-binding)))
  ;; multi-media prev key "<"
  (xbindkey-function '(shift "c:59")
                     (lambda ()
                       (run-command "bash -c \"source ~/.bash_libenv;youtube-previous\"")
                       (reset-first-binding)))
  ;; multi-media next key ">"
  (xbindkey-function '(shift "c:60")
                     (lambda ()
                       (run-command "bash -c \"source ~/.bash_libenv;youtube-next\"")
                       (reset-first-binding)))
  ;; volume up key
  (xbindkey-function '("c:123")
                     (lambda ()
                       (run-command "launch-emacsclient noframe --eval \"(cic:emms-volume-raise)\"")
                       (reset-first-binding)))
  ;; TODO: replaced by something else and I do not use much
  ;; (xbindkey-function 'a
  ;;                    (lambda ()
  ;;                      (run-command "stellarium")
  ;;                      (reset-first-binding)))
  (xbindkey-function 'c
                     (lambda ()
                       (run-command "conkeror")
                       (reset-first-binding)))
  (xbindkey-function 'e
                     (lambda ()
                       (run-command "launch-emacsclient")
                       (reset-first-binding)))
  (xbindkey-function 'f
                     (lambda ()
                       (run-command "firefox")
                       (reset-first-binding)))
  (xbindkey-function 'g
                     (lambda ()
                       (run-command "chromium")
                       (reset-first-binding)))
  ;;TODO:  openstreetmap mapp with alt
  (xbindkey-function 'm
                     (lambda ()
                       ;; XXXX: only on debian with the google earth package maker
                       (run-command "googleearth")
                       (reset-first-binding)))
  (xbindkey-function 't
                     (lambda ()
                       (run-command "rxvt-unicode")
                       (reset-first-binding)))
  ;; (xbindkey-function '(alt "t")
  ;;                    (lambda ()
  ;;                      (run-command "gnome-terminal")
  ;;                      (reset-first-binding)))
  ;; TODO: replaced by something else and I do not use much
  ;; (xbindkey-function 'v
  ;;                    (lambda ()
  ;;                      (run-command "virtualbox")
  ;;                      (reset-first-binding)))
  ;; XXXX: unneeded anymore (see crypt-profiles repo)
  ;; (xbindkey-function 'x
  ;;                    (lambda ()
  ;;                      (run-command "firefox -private")
  ;;                      (reset-first-binding)))
  (when (not (check-de))
        (xbindkey-function 'z
                           (lambda ()
                             ;; not in DE, use other command
                             (run-command "xscreensaver-command --lock")
                             (reset-first-binding))))
  (xbindkey-function "1"
                     (lambda ()
                       (run-command "launch-emacsclient --eval \"(make-capture-frame)\"")
                       (reset-first-binding)))

  (xbindkey-function "2"
                     (lambda ()
                       (run-command "launch-emacsclient --eval \"(org-agenda)\"")
                       (reset-first-binding)))
  (xbindkey-function "4"
                     (lambda ()
                       (run-command "whitenoise.sh")
                       (reset-first-binding)))
  (xbindkey-function "*"
                     (lambda ()
                       (run-command "launch-emacsclient noframe --eval \"(calc)\"")
                       (reset-first-binding)))
  (when (file-exists? (string-concatenate (list (getenv "HOME") "/.xbindkeys_second_personal.scm")))
        (load (string-concatenate (list (getenv "HOME") "/.xbindkeys_second_personal.scm"))))
  (grab-all-keys))

(define (second-repl-binding)
  "Third binding."
  ;; TODO: what else do I want here?
  ;;       grab a backtrace from terminal
  ;;       dictionary?
  ;;       other reference sources? possibly???
  ;;       put number into calculator
  ;; TODO: put my repl and notebooks here
  ;;       i for ipython
  ;;       j for jupyter
  ;;       l for lisp
  ;;       m for sage
  ;;       q for sql
  (ungrab-all-keys)
  (remove-all-keys)
  ;; a == accademic search
  ;; TODO: these functions need to be released
  (xbindkey-function 'i
                     (lambda ()
                       ;; TODO: make sage load ipython
                       ;; (run-command "gnome-terminal --title=\"iPython repl\" --execute bash -c \"source ~/.bash_libenv;sage -ipython;read -p 'Press [Enter] to continue...'\"")
                       (run-command "rxvt-unicode -title \"iPython repl\" -e bash -i -c \"source ~/.bash_libenv;repl-restartable ipython\"")
                       (reset-first-binding)))
  (xbindkey-function 'j
                     (lambda ()
                       (run-command "rxvt-unicode -title \"iPython notebook\" -e bash -i -c \"source ~/.bash_libenv;repl-restartable sage-jupyter-notebook\"")
                       (reset-first-binding)))
  (xbindkey-function 'n
                     (lambda ()
                       (run-command "rxvt-unicode -title \"SAGE notebook\" -e bash -i -c \"source ~/.bash_libenv;repl-restartable sage-notebook\"")
                       (reset-first-binding)))
  (xbindkey-function 'q
                     (lambda ()
                       (run-command "rxvt-unicode -title \"psql akroshkodb\" -e bash -i -c \"source ~/.bash_libenv;repl-restartable 'psql akroshkodb'\"")
                       (reset-first-binding)))
  (xbindkey-function 's
                     (lambda ()
                       (run-command "rxvt-unicode -title \"SAGE repl\" -e bash -i -c \"source ~/.bash_libenv;repl-restartable sage;\"")
                       (reset-first-binding)))
  (grab-all-keys))

;; TODO: add dictionaries and encyclopedias
(define (second-search-binding)
  "Fourth binding."
  (ungrab-all-keys)
  (remove-all-keys)
  (xbindkey-function 'd
                     (lambda ()
                       (run-command "conkeror-clipboard.sh dictionary")
                       (reset-first-binding)))
  (xbindkey-function 'g
                     (lambda ()
                       (run-command "conkeror-clipboard.sh google")
                       (reset-first-binding)))
  (xbindkey-function 's
                     (lambda ()
                       (run-command "conkeror-clipboard.sh scholar")
                       (reset-first-binding)))
  (xbindkey-function 't
                     (lambda ()
                       (run-command "conkeror-clipboard.sh thesaurus")
                       (reset-first-binding)))
  (xbindkey-function 'w
                     (lambda ()
                       (run-command "conkeror-clipboard.sh wikipedia")
                       (reset-first-binding)))
  (grab-all-keys))

(first-binding)
