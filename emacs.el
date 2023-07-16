;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; low-level things first
;; TODO: do not want to defvar cic:server-running right now
;; TODO: do not start server if this if cic-server-p is already defined

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; things to set first for a minimally functional/familiar system
;; make sure warnings do not pop up
(require 'cl)

(setq warning-minimum-level :warning)

(setq x-meta-keysym 'meta)

;; set up some non-default keys for very standard Emacs functions
(global-set-key (kbd "C-x M-c")  #'save-buffers-kill-emacs)
(global-set-key (kbd "C-x r e")  #'string-insert-rectangle)
(global-set-key (kbd "C-x r \\") #'delete-whitespace-rectangle)
(global-set-key (kbd "M-o")      #'other-window)
;; TODO: move this
(global-set-key [f11]            #'cic:toggle-fullscreen)

;; faster startup, might want to change for smaller systems
(setq gc-cons-threshold (eval-when-compile (* 256 1024 1024))
      message-log-max t)
(run-with-idle-timer 2 t (lambda () (garbage-collect)))
; set up some queries to be nice and verbose
(fset 'yes-or-no-p 'y-or-n-p)
(setq confirm-kill-emacs 'yes-or-no-p)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; packages
;; required as soon as possible to get installed packages
;; TODO: does this work on a bare install in new places
(package-initialize)
;; a useful package load function
(defvar load-errors-p nil
  "Whether or not there were errors loading on startup.")
(defmacro* requiring-package ((package &key error-if-fail) &rest forms)
  "Require PACKAGE but log error instead terminating load."
  `(catch 'requiring-package-fail
     (condition-case error-string
         (progn
           (require ',package)
           ,@forms)
       (error
        (let ((msg (format "Failed to load package %s "
                           (symbol-name ',package))))
          (setq load-errors-p t)
          (with-current-buffer (get-buffer-create "*Load log*")
            (insert msg "\n")
            (insert (format "The error was: %s\n" error-string)))
          (menu-bar-mode 1)
          (if ,error-if-fail
              (error msg)
            (throw 'requiring-package-fail nil)))))))
(put 'requiring-package 'lisp-indent-function 1)

;; org is quite essential
(requiring-package (org))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; theming, appearance, and encoding
;; TODO set proper theme here
(unless (or (daemonp) (and (fboundp 'server-running-p) (server-running-p)) (display-graphic-p))
  (load-theme 'tango-dark))
(setq initial-frame-alist nil
      default-frame-alist nil
      frame-title-format "%b")
;; the "Monospace Regular" that comes when "emacs -Q" is used is quite slow
;; TODO: test if liberation mono-8 works, then
;; TODO: is problem with default font still the case
(add-to-list 'initial-frame-alist
             ;; '(font . "DejaVu Sans Mono-7")
             '(font . "Liberation Mono-8")
             ;; '(font . "Droid Sans Mono-8")
             ;; '(font . "Noto Sans Mono CJK JP Regular-7")
             ;; '(font . "Anonymous-8")
             )
(add-to-list 'default-frame-alist
            ;; '(font . "DejaVu Sans Mono-7")
            '(font . "Liberation Mono-8")
            ;; '(font . "Droid Sans Mono-8")
            ;; '(font . "Noto Sans Mono CJK JP Regular-7")
            ;; '(font . "Anonymous-8")
            )
;; this fixes many coding problems I used to have
(set-terminal-coding-system 'utf-8)
(set-keyboard-coding-system 'utf-8)
(set-language-environment "UTF-8")
(prefer-coding-system 'utf-8)
;; (set-default-coding-systems 'utf-8)
;; (set-selection-coding-system 'utf-8)
;; (set-file-name-coding-system 'utf-8)
;; (set-clipboard-coding-system 'utf-8)
;; (set-buffer-file-coding-system 'utf-8)
;; (set-language-environment 'utf-8)
;; TODO: the following breaks zip files.... and other things that read bytes into buffer....
;;       need a finer grained way of fixing it
;;       see https://emacs.stackexchange.com/questions/10146/cant-open-zip-files-in-emacs
;; (setq coding-system-for-read  'utf-8
;;       coding-system-for-write 'utf-8)

;; editing system appearance
(global-font-lock-mode t)
(show-paren-mode t)
(setq-default cursor-type 'bar)
(blink-cursor-mode 0)
;; scroll bar and window edges
(setq default-scroll-bar-width 10)
(setq-default indicate-buffer-boundaries '((t . left)))
; highlight in olive green, visible on many of my modes
(set-face-attribute 'region nil :background "#c0ff3e")
; quiet! please! no dinging!
(setq visible-bell t)
; avoid as much window splitting as possible
(setq split-height-threshold 0
      max-mini-window-height 0.75)
;; remove the "waiting time", dialog box, and other annoyances at startup
(modify-frame-parameters nil '((wait-for-wm . nil)))
(setq inhibit-splash-screen t
      use-dialog-box nil
      echo-keystrokes 0.4)
(tool-bar-mode 0)
;; TODO: would like this smaller and/or optional
(menu-bar-mode 1)
;; XXXX: reuse a frame if buffer is already displayed there
;; obsolete
;; (setq-default display-buffer-reuse-frames t)
;; add date/time to mode line
(setq display-time-day-and-date t
      display-time-24hr-format t)
; display time in modeline
(display-time)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; file handling
;; disable backup and autosave
(setq backup-inhibited t
      auto-save-default nil
      tags-revert-without-query 1)
(requiring-package (autorevert)
  (global-auto-revert-mode t)
  ;; TODO: don't indicate about reverting for now, could this cause me problems?
  ;;       selective autorevert?
  (setq auto-revert-verbose nil))
; try not to warn about large files unless really really necessary
(setq large-file-warning-threshold (eval-when-compile (* 100 1024 1024 1024)))
; TODO: can become a problem with some files used for capturing and logging
;       should only do for large files that are not text (e.g. org, above a certain threshold)
(defun cic:large-file-read-only-hook ()
  "If a file is over a given size (default 100mb), make the buffer
read only."
  (when (> (buffer-size) (eval-when-compile  (* 1024 1024 100)))
    (setq buffer-read-only t)
    (buffer-disable-undo)
    (fundamental-mode)))
;; TODO: do I want this?
;; (add-hook 'find-file-hooks 'cic:large-file-read-only-hook)
(auto-compression-mode 1)
;; set an appropriate tmp directory
;; TODO: does this directory have to be explicitly created
(setq temporary-file-directory "~/.emacs.d/tmp/")
(add-to-list 'completion-ignored-extensions ".aux")
(add-to-list 'completion-ignored-extensions ".bbl")
(add-to-list 'completion-ignored-extensions ".dvi")
(add-to-list 'completion-ignored-extensions ".fdb_latexmk")
(add-to-list 'completion-ignored-extensions ".fls")
(add-to-list 'completion-ignored-extensions ".org.archive")
(add-to-list 'completion-ignored-extensions ".pdfsync")
(add-to-list 'completion-ignored-extensions ".sage.py")
(add-to-list 'completion-ignored-extensions ".synctex.gz")

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; editing behaviour
;; TODO: used to conflict, do I want this?
;; (ffap-bindings)
(setq truncate-lines t
      line-move-visual nil
      ;; limit display lines, this prevents extremely large buffers from loading slowly
      line-number-display-limit 262144
      ;; don't need prefix for popping mark
      set-mark-command-repeat-pop t)
;; clipboard and tooltips
(setq x-select-enable-primary t
      x-select-enable-clipboard t
      x-gtk-use-system-tooltips nil
      kill-do-not-save-duplicates t
      history-delete-duplicates t
      select-active-regions t)
;; mouse
(setq mouse-1-click-follows-link nil)
;; case
(setq sort-fold-case t)
;; locale information, just a generic Canadian location as default
;; this is then reset elsewhere to my actual location
; enable disabled commands that I like and get rid of nuisance commands
(put 'narrow-to-region 'disabled nil)
(put 'set-goal-column 'disabled nil)
(put 'upcase-region 'disabled nil)
(put 'downcase-region 'disabled nil)
(put 'overwrite-mode 'disabled t)
; tabs
(setq-default indent-tabs-mode nil
             ;; I only use tabs in external code and this makes viewing included .el code much easier
              tab-width 8)
;; some potential defauts from c-ide-demo-repo
(setq global-mark-ring-max 5000
      mark-ring-max 5000
      kill-ring-max 5000
      mode-require-final-newline t)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; search
(setq search-upper-case nil)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; personal info as nil for general use
(setq calendar-latitude      nil
      calendar-longitude     nil
      calendar-location-name nil
      calendar-week-start-day 1)
;; making scrolling and moving nice
(setq scroll-margin 3
      scroll-step 0
      ;; think I want this 15 so I can see around searches
      scroll-conservatively 15)
;; TODO: how does this affect LaTeX?
(setq comment-auto-fill-only-comments t
      ;; I like this for quoting
      comment-empty-lines t)
;; special hooks to delete trailing whitespace and clean up files misc
(add-hook 'before-save-hook 'delete-trailing-whitespace)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; mode-specific configuration, these should all be builtin to emacs
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(setq bibtex-align-at-equal-sign t
      bibtex-field-delimiters 'double-quotes
      bibtex-text-indentation 17
      bibtex-contline-indentation 19)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; calc
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; TODO: revisit and put all calc in one place
(setq calc-multiplication-has-precedence nil)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; dired
(requiring-package (dired-aux))
(requiring-package (dired-x)
  (setq dired-omit-files-p t
        ;; these help avoid unwanted file operations
        delete-by-moving-to-trash t
        dired-keep-marker-rename nil
        dired-dwim-target t
        dired-omit-files "^\\.+\\|^\\.$\\|^\\.\\.$"
        ;; TODO: would like ".out" but only for latex directories
        dired-omit-extensions '("_flymake.aux" "_flymake.log" "_flymake.pdf" "_flymake.pdfsync" "_flymake.py"
       			        "_.log" "_.pdf" "_.pdfsync"  "_.prv" "_.tex"
       			        ".aux" ".bbl" ".blg" ".bst" ".fdb_latexmk" ".fls" ".lof" ".lot" ".pdfsync" ".snm" ".synctex.gz" ".toc"
       			        ".pyd" ".pyc" ".sage.py"))
  (setq dired-listing-switches "--group-directories-first -ahlv")
  (defun dired-mode-hook--minor-modes ()
    (dired-omit-mode 1)
    (hl-line-mode 1))
  ;; set omit by default
  (add-hook 'dired-mode-hook 'dired-mode-hook--minor-modes)
  (define-key dired-mode-map (kbd "C-x C-o") #'dired-omit-mode))
(requiring-package (wdired)
  (setq wdired-use-dired-vertical-movement 'sometimes
        wdired-confirm-overwrite t
        ;; I do not want link targets editable!!!
        wdired-allow-to-redirect-links nil))
(requiring-package (ispell)
  (setq ispell-program-name "aspell"
        ispell-dictionary "canadian"
        ispell-extra-args '("--sug-mode=ultra")))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; hl-mode
(defun init-hl-line-mode ()
  (hl-line-mode 1))
(add-hook 'package-menu-mode-hook 'init-hl-line-mode)
(add-hook 'occur-mode-hook        'init-hl-line-mode)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; emacs lisp mode
;; highlight functions
(defface font-lock-func-face
  '((nil (:foreground "#7F0055" :weight bold))
    (t (:bold t :italic t)))
  "Font Lock mode face used for function calls."
  :group 'font-lock-highlighting-faces)
(font-lock-add-keywords
 'emacs-lisp-mode
 '(("(\\s-*\\(\\_<\\(?:\\sw\\|\\s_\\)+\\)\\_>"
   1 'font-lock-func-face)))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; etags
;;
;; automatically load tags, this is because I typically use universal
;; ctags with -R -e to navigate at large codebases
;;
;; the buffer local tags table is also nice when looking at multiple
;; large projects in the same session
(setq tags-add-tables t
      tags-revert-without-query t)
(defun find-file-upwards (file-to-find)
  "Recursively searches each parent directory starting from the default-directory,
looking for a file with name FILE-TO-FIND.  Returns the path to
FILE-TO-FIND or nil if not found."
  (cl-labels ((find-file-r (path)
                           (let* ((parent (file-name-directory path))
                                  (possible-file (concat parent "/" file-to-find)))
                             (cond
                              ((file-exists-p possible-file)
                               ;; found
                               possible-file)
                              ((or (null parent) (equal parent (directory-file-name parent)))
                               ;; The parent of ~ is nil and the parent of / is itself.
                               ;; Thus the terminating condition for not finding the file
                               ;; accounts for both.
                               ;; i.e., not found
                               nil)
                              (t
                               ;; continue upwards
                               (find-file-r (directory-file-name parent)))))))
    (find-file-r default-directory)))
(defun upward-tag-table ()
  "Find an etags TABLE upward in the directory hierarchy."
  (interactive)
  (let ((found-tags-file (find-file-upwards "TAGS")))
    (when found-tags-file
      (message "Loading tags file: %s" found-tags-file)
      (visit-tags-table found-tags-file t))))
;; find tags table for common functions
(defun xref--find-tags-table (orig-fun &rest args)
  "Advice to make sure the right tags table is loaded."
  (unless tags-file-name
    (upward-tag-table))
  (apply orig-fun args))
(advice-add 'xref-find-definitions :around #'xref--find-tags-table)
(advice-add 'xref-find-references :around #'xref--find-tags-table)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; helm
(requiring-package (helm)
  (require 'helm-grep)
  (setq helm-M-x-fuzzy-match t
        helm-mode-fuzzy-match t
        helm-buffers-fuzzy-matching t
        helm-imenu-fuzzy-match t
        helm-lisp-fuzzy-completion t
        helm-display-header-line t
        ;; helm-split-window-in-side-p t ;; open helm buffer inside current window, not occupy whole other window
        helm-echo-input-in-header-line t
        ;; would love unlimited
        helm-candidate-number-limit 999)
  (add-to-list 'helm-sources-using-default-as-input 'helm-source-man-pages)
  ;; because C-x c is close to C-x C-c
  (global-set-key (kbd "C-c h") 'helm-command-prefix)
  (global-unset-key (kbd "C-x c"))
  ;; some nice bindings
  (global-set-key (kbd "M-x")                          'undefined)
  (global-set-key (kbd "M-x")                          #'helm-M-x)
  (global-set-key (kbd "M-y")                          #'helm-show-kill-ring)
  (global-set-key (kbd "C-x C-f")                      #'helm-find-files)
  ;; may conflict with major mode keybindings
  (global-set-key (kbd "C-c i")                        #'helm-imenu)
  (global-set-key (kbd "C-c o")                        #'helm-occur)
  ;; see helm-google-suggest-use-curl-p
  (helm-mode 1))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; image-mode
;; TODO: find out how to animate images by default
(setq image-animate-loop t)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; misc
(requiring-package (misc))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; new-comment
(requiring-package (newcomment))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; org-mode
(requiring-package (org)
  (requiring-package (ox-publish))
  (add-to-list 'auto-mode-alist '("\\.org\\.archive" . org-mode))
  (requiring-package (org-compat))
  ;; TODO: add mini languages like awk
  (setq org-src-lang-modes '(("asymptote"  . asy)
                             ("bash"       . sh)
                             ("C"          . c)
                             ("C++"        . c++)
                             ("calc"       . fundamental)
                             ("cpp"        . c++)
                             ("dot"        . fundamental)
                             ("elisp"      . emacs-lisp)
                             ("java"       . java)
                             ("javascript" . js)
                             ("lisp"       . lisp-mode)
                             ("postgresql" . sql)
                             ("python"     . python-mode)
                             ("sage"       . sage-shell:sage-mode)
                             ("screen"     . shell-script)
                             ("shell"      . sh)
                             ("sql"        . sql)
                             ("sqlite"     . sql)
                             ("xml"        . nxml))
        org-src-preserve-indentation t
        org-src-fontify-natively t)
  (requiring-package (ob-emacs-lisp))
  (requiring-package (ob-java))
  (requiring-package (ob-js))
  (requiring-package (ob-latex))
  (requiring-package (ob-matlab))
  (requiring-package (ob-python))
  ;; TODO: seems to have disappeared, verify
  ;; (requiring-package (ob-sh))
  (requiring-package (ob-sql))
  (requiring-package (ob-sqlite))
  (setq org-fontify-quote-and-verse-blocks t)
  ;; I like these faces
  (set-face-foreground 'org-block "dark slate blue")
  (set-face-foreground 'org-quote "deep pink")
  (set-face-foreground 'org-code "deep pink")
  (set-face-background 'org-code "light blue")
  ;; TODO: yellowish, would be great for BEGIN_QUOTE
  ;; (set-face-foreground 'org-quote "#8b6508")
  (modify-syntax-entry ?~ "." org-mode-syntax-table)
  ;; TODO temporarily disabling non-standard
  (setq org-archive-location "::* Archived" ;; "%s.archive::"
        org-todo-keyword-faces '(("TODO"             . "firebrick")
                                 ("DONE"             . (:foreground "dark orange" :background "blue"       :weight bold)))
        org-enforce-todo-dependencies t
        org-enforce-todo-checkbox-dependencies t
        org-use-property-inheritance t
        org-startup-folded t
        ;; clean up org agenda
        org-agenda-todo-list-sublevels t
        org-agenda-todo-ignore-scheduled t
        org-agenda-todo-ignore-deadlines t

        org-ctrl-k-protect-subtree nil
        org-cycle-global-at-bob t
        org-cycle-include-plain-lists nil
        org-cycle-level-after-item/entry-creation nil
        org-fontify-emphasized-text t
        org-fontify-whole-heading-line t
        org-ellipsis "➤➤➤"
        ;; org-ellipsis "⤵"
        ;; org-ellipsis "▼"
        ;; org-latex-listings t
        org-pretty-entities t
        org-pretty-entities-include-sub-superscripts nil
        org-use-tag-inheritance t)
  ;; stop links from opening in a way I don't like
  (setf (cdr (assoc 'file org-link-frame-setup)) 'find-file)
  ;; org-mode images
  ;; disable inline images by default
  (setq org-startup-with-inline-images nil
        ;; keep images small
        org-image-actual-width 128)
  ;; this allows the file local variable org-image-actual-width to take effect
  (put 'org-image-actual-width 'safe-local-variable 'integerp)
  (defun org-image-enable ()
    ;; this eq is on purpose and not derived-mode-p, in order to let derived modes set their own behaviour
    (when (eq major-mode 'org-mode)
      (org-display-inline-images)))
  (add-hook 'hack-local-variables-hook 'org-image-enable)
  ;; literal hyperlinks setup
  ;; (add-hook 'org-mode-hook 'org-list-highlight-setup)
  (defun org-literal-hyperlinks-setup ()
    (unless (and buffer-file-name (string-match-p "help\\.org" buffer-file-name))
      (remove-from-invisibility-spec '(org-link))
      (org-restart-font-lock)))
  (add-hook 'org-mode-hook 'org-literal-hyperlinks-setup)
  (defun cic:org-mode-hook--indent-setup ()
    ;; this eq is on purpose and not derived-mode-p, in order to let derived modes set their own behaviour
    (when (eq major-mode 'org-mode)
      ;; TODO: should this be here?
      (electric-indent-local-mode 0)
      (org-indent-mode 1)))
  (add-hook 'org-mode-hook 'cic:org-mode-hook--indent-setup)
  ;; most recent notes is always at the top
  (setq org-reverse-note-order t)
  ;; org agenda
  (setq org-agenda-dim-blocked-tasks t
        ;; show 10 days by default
        org-agenda-span 10
        org-deadline-warning-days 0
        ;; how many days early a deadline item will appear
        ;; show days with no tasks, so "free days" can be seen
        org-agenda-show-all-dates t
        ;; deadlines that are completed will not show up
        org-agenda-skip-deadline-if-done t
        ;; scheduled events will not show up
        org-agenda-skip-scheduled-if-done t
        ;; always begin on current day
        org-agenda-start-on-weekday nil
        ;; org-agenda custom commands, see above newartisans.com link
        ;; keyboard shortcuts for day-agenda, week-agenda, 21-day agenda
        org-agenda-custom-commands '(("w" "Agenda for 21 days" agenda "" ((org-agenda-span 21)))))
  ;; don't log anything for now
  (setq org-log-repeat nil
        org-log-done nil
        org-log-into-drawer nil
        org-log-note-clock-out nil
        org-log-redeadline nil
        org-log-reschedule nil)
  (add-hook 'org-capture-mode-hook 'delete-other-windows)
  ;; I like to use org-mode tables that may be read-only, this ensures TAB works for next field
  (defun org-table-next-previous-field--handle-read-only (orig-fun &rest args)
    "Ensure next and previous field can be navigated in read-only for org-mode."
    (if buffer-read-only
        (let ((org-table-automatic-realign nil))
          (apply orig-fun args))
      (apply orig-fun args)))
  (advice-add 'org-table-next-field :around #'org-table-next-previous-field--handle-read-only)
  (advice-add 'org-table-previous-field :around #'org-table-next-previous-field--handle-read-only))
;; this tends to work best for shells in Emacs
(setenv "PAGER" "cat")

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; tramp-mode
(setq tramp-default-method "ssh"
      ;; this detects my standard bash prompt
      tramp-shell-prompt-pattern "\\(?:^\\|\r\\)[^]#$%>\n]*#?[]#$%>].* *\\(^[\\[[0-9;]*[a-zA-Z] *\\)*")
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; uniquify
;; set up buffer uniquify so I can identify buffers better
(requiring-package (uniquify)
  ;; it would be ideal to force the first parent directory to be included
  (setq uniquify-buffer-name-style 'forward))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; disable vc for now, I just use a shell although I would like to use it from emacs
(requiring-package (vc)
  (defun remove-vc-modeline ()
    (setq mode-line-format (remove '(vc-mode vc-mode) mode-line-format)))
  (remove-hook 'find-file-hook 'vc-find-file-hook)
  (add-hook    'find-file-hook 'remove-vc-modeline))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; printing
;; https://www.emacswiki.org/emacs/CupsInEmacs
(setq lpr-command "gtklp"
      ps-lpr-command "gtklp"
      ;; TODO: 6 point font is nice I think
      ps-font-size (cons 6 6)
      ps-landscape-mode nil ;; t
      )
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; xref
(requiring-package (xref)
  (setq xref-prompt-for-identifier nil)
  ;; change xref keys to conflict less
  (global-set-key (kbd "M-.") 'xref-find-definitions)
  ;; these are better keys that don't conflict with anaconda and paredit mode
  (global-set-key (kbd "M-,") 'xref-find-references)
  (global-set-key (kbd "M-[") 'xref-pop-marker-stack)
  ;; (global-set-key (kbd "M-]") 'undefined)
  )

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; configure modeline last
;; add column numbers to modeline
(column-number-mode t)
;; more intuitive percentage in mode-line
(setcar mode-line-position
        '(:eval (format "%4.1f%%%%" (/ (point) 0.01 (point-max)))))
;; disable superfluous mail check in modeline and make time look like what I want
(setq display-time-string-forms '((if (and (not display-time-format) display-time-day-and-date)
                                      (format-time-string "%a %b %e " now)
                                    "")
                                  (propertize
                                   (format-time-string
                                    (or display-time-format
                                        (if display-time-24hr-format "%H:%M" "%-I:%M%p"))
                                    now)
                                   'help-echo
                                   (format-time-string "%a %b %e, %Y" now))
                                  load))

;; bluish/reddish modeline
(defun configure-modeline-color ()
  (if (and (fboundp 'server-running-p) (server-running-p))
      (progn
        (set-face-background 'mode-line "#6699ff")
        (set-face-background 'mode-line-inactive "#ffaa88"))
    (progn
      (set-face-background 'mode-line "#00ffff")
      (set-face-background 'mode-line-inactive "#ff00ff"))))
(add-hook 'before-make-frame-hook 'configure-modeline-color)
(defvar-local modeline-color-remapped
  nil
  "Stores the cookie from remapping the modeline face.")
(defun configure-local-modeline-color ()
  (cond ((and buffer-read-only (not modeline-color-remapped))
         (setq-local modeline-color-remapped (face-remap-add-relative 'mode-line :background "turquoise")))
        ((and modeline-color-remapped (not buffer-read-only))
         (face-remap-remove-relative modeline-color-remapped)
         (setq-local modeline-color-remapped nil))))
(add-hook 'post-command-hook 'configure-local-modeline-color)

;; run for when starting without server
(configure-modeline-color)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; finally load the rest of the site
;; but only if server is running

;; (when (and (fboundp #'server-running-p) (server-running-p)))
(if (file-exists-p "~/.emacs.d/emacs-local.el")
    (load "~/.emacs.d/emacs-local.el")
  (message "Not loading ~/.emacs.d/emacs-local.el because it does not exist."))
;; this ensures that emacs gets rid of garbage from startup
;; very good for if I'm starting up and immediately profiling something
(garbage-collect)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; modeline
;; change modeline if there are errors after emacs-local.el
(defvar modeline-already-added
  nil
  "Indicate whether additional modeline indicators have already
  been added.")

(defvar modeline-dirty
  nil
  "Indicate whether modeline is abnormal.")

(defvar modeline-other-error
  nil)

;; this makes the modeline red if "*Load log* buffer exists
;; this can quickly allow seeing if there's a problem rather than working for hours with a problem present
(unless modeline-already-added
  ;; mode-line-stuff
  (unless (some 'identity (mapcar (lambda (e) (ignore-errors (string-match-p "case:" e))) mode-line-format))
    (setq-default mode-line-format (append mode-line-format (list
                                                             '(:eval (cond ((or (get-buffer "*Load log*") modeline-other-error)
                                                                            (set-face-background 'mode-line "#ff0000")
                                                                            (setq modeline-dirty t)
                                                                            (if modeline-other-error
                                                                                modeline-other-error
                                                                              "load:ERR"))
                                                                           (t
                                                                            (when modeline-dirty
                                                                              (configure-modeline-color)
                                                                              (setq modeline-dirty nil))
                                                                            "load:OK ")))
                                                             "case:"
                                                             '(:eval (if case-fold-search
                                                                         "insensitive "
                                                                       (propertize "sensitive   " 'font-lock-face '(:foreground "yellow"))))))))
  ;; XXXX: remove this line for debugging the above....
  (setq modeline-already-added t))

;; TODO: want to make this clearer that end of emacs.el was reached
(message "Emacs loaded without error!")
