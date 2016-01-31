;;; xbindkeysrc.scm -- xbindkeys configuration file for global
;;; shortcuts, using either plain keyboard shortcuts or with a prefix
;;; key.
;;
;; Copyright (C) 2015, Andrew Kroshko, all rights reserved.
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
  (xbindkey-function '(control "b:7")
                     (lambda ()
                       (run-command "conkeror-clipboard.sh google")))
  (xbindkey-function '(alt "b:7")
                     (lambda ()
                       (run-command "conkeror-clipboard.sh scholar")))
  ;; Super-arrow keys to the do mouse wheel
  (xbindkey-function '(mod4 "c:111")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key --window %1 click 4")))
  (xbindkey-function '(mod4 "c:116")
                     (lambda ()
                       (run-command "xdotool getwindowfocus key --window %1 click 5")))
  ;; multi-media app keys are normally handled by DE
  (when (not (check-de))
        (xbindkey-function '("c:122")
                           (lambda ()
                             (run-command "amixer set Master 10%-")))
        (xbindkey-function '("c:123")
                           (lambda ()
                             (run-command "amixer set Master 10%+")))
        (xbindkey-function '("c:121")
                           (lambda ()
                             (run-command "amixer sset Master toggle")))
        (xbindkey-function '("c:148")
                           (lambda ()
                             (run-command "gnome-calculator"))))
  (xbindkey-function '(control shift "c")
                     (lambda ()
                       (run-command "xclip -o -selection primary | xclip -i -selection clipboard")))
  ;; TODO: does not work that well to replace space key
  ;; (xbindkey-function '(control shift "f")
  ;;                    (lambda ()
  ;;                      (run-command "sleep 0.1; xdotool key space")))
  (xbindkey-function '(control shift "v")
                     (lambda ()
                       ;; TODO: doesn't work everywhere
                       (run-command "xdotool getwindowfocus key --window %1 click 2")))
  (include "/home/akroshko/.xbindkeys_first_personal.scm"))

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
                       (run-command "gnome-terminal --title=\"nuke-extra\" --execute bash -c \"source ~/.bash_libenv;nuke-extra;read -p 'Press [Enter] to continue...'\"")
                       (reset-first-binding)))
  ;; ]
  (xbindkey-function '("c:35")
                     (lambda ()
                       (run-command "gnome-terminal --title=\"start-extra\" -execute bash -c \"source ~/.bash_libenv;start-extra;read -p 'Press [Enter] to continue...'\"")
                       (reset-first-binding)))
  (xbindkey-function '("c:51")
                     (lambda ()
                       ;; TODO: lock then hibernate
                       (run-command "gnome-terminal --title=\"pm-hibernate\" -execute bash -c \"source ~/.bash_libenv;sudo pm-hibernate\"")
                       (reset-first-binding)))
  ;; /
  (xbindkey-function '("c:61")
                     (lambda ()
                       (run-command "nautilus ~/Downloads")
                       (reset-first-binding)))
  ;; eventually check DE, for backlights
  ;; get working properly with fn+f6/f7
  (xbindkey-function '("c:71")
                     (lambda ()
                       (run-command "xbacklight -set 20")
                       (reset-first-binding)))
  (xbindkey-function '("c:72")
                     (lambda ()
                       (run-command "xbacklight -set 100")
                       (reset-first-binding)))
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
  ;; volume up key
  (xbindkey-function '("c:123")
                     (lambda ()
                       (run-command "launch-emacsclient noframe --eval \"(cic:emms-volume-raise)\"")
                       (reset-first-binding)))
  (xbindkey-function 'a
                     (lambda ()
                       (run-command "stellarium")
                       (reset-first-binding)))
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
  (xbindkey-function '(alt "f")
                     (lambda ()
                       (run-command "firefox -private")
                       (reset-first-binding)))
  (xbindkey-function 'g
                     (lambda ()
                       ;; XXXX: only on debian with the google earth pacakge maker
                       (run-command "googleearth")
                       (reset-first-binding)))
  (xbindkey-function '(alt "g")
                     (lambda ()
                       (run-command "conkeror-clipboard.sh google")
                       (reset-first-binding)))
  (xbindkey-function 'i
                     (lambda ()
                       (run-command "gnome-terminal --title=\"SAGE\" --execute bash -c \"source ~/.bash_libenv;sage;read -p 'Press [Enter] to continue...'\"")
                       (reset-first-binding)))
  (xbindkey-function '(alt "i")
                     (lambda ()
                       (run-command "gnome-terminal --title=\"SAGE notebook\" --execute bash -c \"source ~/.bash_libenv;sage-notebook;read -p 'Press [Enter] to continue...'\"")
                       (reset-first-binding)))
  (xbindkey-function 'm
                     (lambda ()
                       (run-command "gnome-terminal --title=\"power-managment\" --execute bash -c \"source ~/.bash_libenv;power-management-terminal;read -p 'Press [Enter] to continue...'\"")
                       (reset-first-binding)))
  ;; (xbindkey-function 's
  ;;                    (lambda ()
  ;;                      (run-command "import -window root ~/Pictures/screenshots/screenshot-$(date '+%Y%m%d-%H%M%S').jpg")
  ;;                      (reset-first-binding)))
  (xbindkey-function '(alt "s")
                     (lambda ()
                       (run-command "conkeror-clipboard.sh scholar")
                       (reset-first-binding)))
  (xbindkey-function 't
                     (lambda ()
                       (run-command "gnome-terminal")
                       (reset-first-binding)))
  (xbindkey-function '(alt "w")
                     (lambda ()
                       (run-command "conkeror-clipboard.sh wikipedia")
                       (reset-first-binding)))
  (xbindkey-function 'v
                     (lambda ()
                       (run-command "virtualbox")
                       (reset-first-binding)))
  (xbindkey-function 'x
                     (lambda ()
                       (run-command "firefox -private")
                       (reset-first-binding)))
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
  (include "/home/akroshko/.xbindkeys_second_personal.scm")
  (grab-all-keys))

(first-binding)
