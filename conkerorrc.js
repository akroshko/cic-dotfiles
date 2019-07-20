var g_rc_successful=false;

homepage = "http://conkeror.org/";
load_paths.unshift("chrome://conkeror-contrib/content/");

// TODO: add exceptions to this later, kill all but then whitelist some
require("webpage-key-kill");
webpage_key_kill_mode.test.push(/\/\/.*\//); //regexp matches all sites

// hinting
// hint_digits="abcdefghijklmnopqrstuvwxyz";
// hint digits that make it easy to use while still using a mouse
hint_digits="asdfgzxcvbqwert";
register_user_stylesheet(
    "data:text/css," +
        escape(
            "@namespace url(\"http://www.w3.org/1999/xhtml\");\n" +
            "span.__conkeror_hint {\n"+
            "  font-size: 18px !important;\n"+
            "  line-height: 18px !important;\n"+
                "}"));
// add a line where I like it
register_user_stylesheet(make_css_data_uri(["*, .mode-line {border-color:#000000;}"],
                                           $namespace = XUL_NS));
// standard keys
define_key(content_buffer_normal_keymap, "C-[", "unfocus");
define_key(content_buffer_form_keymap, "M-c",
    "browser-object-relationship-previous",
    $repeat = "follow");
define_key(content_buffer_text_keymap, "M-c",
    "browser-object-relationship-previous",
    $repeat = "follow");
define_key(content_buffer_normal_keymap, "M-c",
    "browser-object-relationship-previous",
    $repeat = "follow");
define_key(content_buffer_form_keymap, "M-v",
    "browser-object-relationship-next",
    $repeat = "follow");
define_key(content_buffer_text_keymap, "M-v",
    "browser-object-relationship-next",
    $repeat = "follow");
define_key(content_buffer_normal_keymap, "M-v",
    "browser-object-relationship-next",
    $repeat = "follow");

// TODO: append to default patterns instead
browser_relationship_patterns[RELATIONSHIP_NEXT] =
    [/^next$/i,
     new RegExp("^>$","i"),
     new RegExp("^(>>|[\\xBB])$","i"),
     new RegExp("^(>|[\\xBB])","i"),
     new RegExp("(>|[\\xBB])$","i"),
     // ►
     new RegExp("[\\u25BA]","i"),
     // »
     new RegExp("\\bnext","i")];

browser_relationship_patterns[RELATIONSHIP_PREVIOUS] =
    [/^(prev|previous)$/i,
     new RegExp("^<$","i"),
     new RegExp("^(<<|[\\xAB])$","i"),
     new RegExp("^(<|[\\xAB])","i"),
     new RegExp("(<|[\\xAB])$","i"),
     // ◄
     new RegExp("[\\u25C4]","i"),
     // «
     new RegExp("\\bprev|previous\\b","i")];

// http://conkeror.org/Tips#Browse_buffer_session_history
// browse history of this buffer
interactive("browse-buffer-history",
            "Browse the session history for the current buffer",
    function browse_buffer_history (I) {
        var b = check_buffer(I.buffer, content_buffer);
        var history = b.web_navigation.sessionHistory;

        if (history.count > 1) {
            var entries = [];

            for (var i = 0 ; i < history.count ; i += 1) {
                entries[i] = history.getEntryAtIndex(i, false).URI.spec;
            }
            // TODO: do I want space completes here?
            var url = yield I.minibuffer.read(
                $prompt = "Go back or forward to:",
                $completer = new all_word_completer($completions = entries),
                $default_completion = history.index > 0 ? entries[history.index - 1] : entries[history.index + 1],
                $auto_complete = "url",
                $auto_complete_initial = true,
                $auto_complete_delay = 0,
                $require_match = true);

            b.web_navigation.gotoIndex(entries.indexOf(url));
        } else {
            I.window.minibuffer.message("No history");
        }
    });
// key 'h' is stolen from http://conkeror.org/History, since I don't use built-in history
define_key(content_buffer_normal_keymap, "h", "browse-buffer-history");

////////////////////////////////////////
// remap keys
define_key(content_buffer_button_keymap, "space", "cmd_scrollPageDown",
           $browser_object = browser_object_focused_element);
// hint keymap
define_key(hint_keymap,                  "C-space","hints-exit");
define_key(default_global_keymap,        "q",      "kill-current-buffer");
// compared to q, this stops me from closing accidently, eventually replace q completely?
define_key(default_global_keymap,        "s-q",    "kill-current-buffer");
define_key(content_buffer_normal_keymap, "o",       "browser-object-media");
// follow and other surfing keys
define_key(content_buffer_normal_keymap, "f",       "follow");
define_key(content_buffer_normal_keymap, "w",       "follow-new-window");
// TODO: update...
define_key(content_buffer_normal_keymap, "s-m",     "duplicate-buffer");
define_key(content_buffer_normal_keymap, "s-M",     "duplicate-buffer-background");
define_key(content_buffer_normal_keymap, "M-s-m",   "duplicate-buffer-new-window");
define_key(content_buffer_normal_keymap, "W",       "duplicate-buffer-new-window");
define_key(content_buffer_normal_keymap, "/",       "save");
// TODO: best way to disable \ as viewsource... too easy and destructive
define_key(content_buffer_normal_keymap, "\\",      "");
require("clicks-in-new-buffer.js");
clicks_in_new_buffer_target = OPEN_NEW_WINDOW;
clicks_in_new_buffer_button = 2;

// buffer switching
define_key(content_buffer_normal_keymap, "s-space", "switch-to-buffer");
define_key(minibuffer_keymap,            "s-space", "minibuffer-complete");

// esdf keys for minibuffer
define_key(minibuffer_keymap, "C-d", "minibuffer-complete");
define_key(minibuffer_keymap, "C-e", "minibuffer-complete-previous");

define_key(content_buffer_normal_keymap, "C-]",     "local-print-buffer");
define_key(default_global_keymap,        "C-j",     "unfocus");
define_key(text_keymap,                  "C-j",     "unfocus");
define_key(content_buffer_text_keymap,   "C-j",     "unfocus");
// define_key(text_keymap,                  "M-U",     "upcase-word");

// TODO: not sure if this is best, unfocus back some?
define_key(content_buffer_normal_keymap, "a",   "back");
define_key(content_buffer_normal_keymap, "s-a", "back");
define_key(content_buffer_normal_keymap, "s-l", "back");
define_key(content_buffer_normal_keymap, "s-g",   "find-url");
// define_key(content_buffer_normal_keymap, "s-l g", "find-url");
// emergency key to kill buffer quickly
// TODO: used for other things
// define_key(content_buffer_normal_keymap, "f4", "kill-buffer");
// key redefines
define_key(content_buffer_normal_keymap, "s-]", "buffer-next");
define_key(content_buffer_normal_keymap, "s-[", "buffer-previous");
// duplicate buffer
interactive("duplicate-buffer", "Duplicate buffer",
            function (I) {
                browser_object_follow(I.buffer, OPEN_NEW_BUFFER, I.buffer.current_uri.spec);
            });
interactive("duplicate-buffer-new-window", "Duplicate buffer in new window",
            function (I) {
                browser_object_follow(I.buffer, OPEN_NEW_WINDOW, I.buffer.current_uri.spec);
            });

// cuda-style keys
// find
define_key(default_global_keymap,        "s-f", "isearch-forward");
define_key(content_buffer_normal_keymap, "s-f", "isearch-forward");
define_key(isearch_keymap,               "s-f", "isearch-continue-forward");
define_key(default_global_keymap,        "s-r", "isearch-backward");
define_key(content_buffer_normal_keymap, "s-r", "isearch-backward");
define_key(isearch_keymap,               "s-r", "isearch-continue-backward");
// cut
define_key(default_global_keymap,        "s-x", "kill-region");
define_key(minibuffer_base_keymap,       "s-x", "kill-region");
// copy
define_key(default_global_keymap,        "s-c", "kill-ring-save");
define_key(content_buffer_form_keymap,   "s-c", "kill-ring-save");
define_key(content_buffer_text_keymap,   "s-c", "kill-ring-save");
define_key(content_buffer_normal_keymap, "s-c", "cmd_copy");
define_key(text_keymap,                  "s-c", "kill-ring-save");
define_key(minibuffer_base_keymap,       "s-c", "kill-ring-save");
// paste
define_key(default_global_keymap,        "s-v", "yank");
define_key(minibuffer_base_keymap,       "s-v", "yank");
define_key(content_buffer_form_keymap,   "s-v", "yank");
define_key(content_buffer_text_keymap,   "s-v", "yank");
define_key(content_buffer_normal_keymap, "s-v", "paste-url");
define_key(text_keymap,                  "s-v", "yank");
define_key(minibuffer_base_keymap,       "s-v", "yank");

// serach configuration
isearch_scroll_center_vertically=true;

// open the url currently highlighted, useful for sites that leave links unclickable
interactive("open-marked-url", "Open the marked url.",
    function (I) {
        call_interactively(I, "cmd_copy");
        var cc = read_from_x_primary_selection();
        // trim everything from the front and back that are not good characters
        // TODO: make a nice function for this
        cc=cc.replace(/^["';<>()\/\\]*/,"","g");
        cc=cc.replace(/["';<>()\\]*$/,"","g");
        // reconstruct http if first characters missed
        // this could cause confusion for ftp but hey, it is not too bad
        cc=cc.replace(/^ttp/,"http","g");
        cc=cc.replace(/^tp/,"http","g");
        I.window.minibuffer.message(cc);
        // now follow the link
        browser_object_follow(I.buffer,OPEN_CURRENT_BUFFER,cc);
    }
);
define_key(content_buffer_normal_keymap, "M-f",       "open-marked-url");

// esdf-style keys
define_key(default_global_keymap,        "C-e",       "cmd_scrollLineUp");
define_key(content_buffer_form_keymap,   "C-e",       "cmd_scrollLineUp");
define_key(content_buffer_text_keymap,   "C-e",       "cmd_scrollLineUp");
define_key(content_buffer_normal_keymap, "C-e",       "cmd_scrollLineUp");
define_key(default_global_keymap,        "C-d",       "cmd_scrollLineDown");
define_key(content_buffer_form_keymap,   "C-d",       "cmd_scrollLineDown");
define_key(content_buffer_text_keymap,   "C-d",       "cmd_scrollLineDown");
define_key(content_buffer_normal_keymap, "C-d",       "cmd_scrollLineDown");
define_key(default_global_keymap,        "C-s",       "cmd_scrollLeft");
define_key(content_buffer_form_keymap,   "C-s",       "cmd_scrollLeft");
define_key(content_buffer_text_keymap,   "C-s",       "backward-char");
define_key(content_buffer_normal_keymap, "C-s",       "backward-char");
define_key(minibuffer_keymap,            "C-s",       "backward-char");
// end of line
define_key(content_buffer_form_keymap,   "C-r",       "end-of-line");
define_key(content_buffer_text_keymap,   "C-r",       "end-of-line");
define_key(minibuffer_keymap,            "C-r",       "end-of-line");
define_key(content_buffer_form_keymap,   "C-h",       "cmd_deleteCharForward");
define_key(content_buffer_text_keymap,   "C-h",       "cmd_deleteCharForward");
define_key(minibuffer_keymap,            "C-h",       "cmd_deleteCharForward");
define_key(content_buffer_form_keymap,   "M-h",       "cmd_deleteWordForward");
define_key(content_buffer_text_keymap,   "M-h",       "cmd_deleteWordForward");
define_key(minibuffer_keymap,            "M-h",       "cmd_deleteWordForward");
// move by word
define_key(text_keymap,                  "M-f",       "forward-word");
define_key(content_buffer_form_keymap,   "M-f",       "forward-word");
define_key(content_buffer_text_keymap,   "M-f",       "forward-word");
define_key(minibuffer_keymap,            "M-f",       "forward-word");
define_key(isearch_keymap,               "M-f",       "forward-word");
define_key(text_keymap,                  "M-s",       "backward-word");
define_key(content_buffer_form_keymap,   "M-s",       "backward-word");
define_key(content_buffer_text_keymap,   "M-s",       "backward-word");
define_key(minibuffer_keymap,            "M-s",       "backward-word");
define_key(isearch_keymap,               "M-s",       "backward-word");
// TODO: do I want an an F-key to reload too, i.e., F5?
define_key(content_buffer_normal_keymap, "5",         "reload");
define_key(content_buffer_normal_keymap, "%",         "reload");
// scroll
define_key(content_buffer_normal_keymap, "b",         "cmd_scrollPageUp");
define_key(content_buffer_normal_keymap, "C-,",       "cmd_scrollPageUp");
define_key(content_buffer_normal_keymap, "C-.",       "cmd_scrollPageDown");
// this is pageup that works as expected everywhere
define_key(default_global_keymap,        "page_up",   "cmd_scrollPageUp");
define_key(minibuffer_base_keymap,       "page_up",   "cmd_scrollPageUp");
define_key(content_buffer_form_keymap,   "page_up",   "cmd_scrollPageUp_unfocus");
define_key(content_buffer_text_keymap,   "page_up",   "cmd_scrollPageUp_unfocus");
define_key(content_buffer_normal_keymap, "page_up",   "cmd_scrollPageUp");
// this is pagedown that works as expected everywhere
define_key(default_global_keymap,        "page_down", "cmd_scrollPageDown");
define_key(minibuffer_base_keymap,       "page_down", "cmd_scrollPageDown");
define_key(content_buffer_form_keymap,   "page_down", "cmd_scrollPageDown_unfocus");
define_key(content_buffer_text_keymap,   "page_down", "cmd_scrollPageDown_unfocus");
define_key(content_buffer_normal_keymap, "page_down", "cmd_scrollPageDown");
// this is pageup that works as expected everywhere
define_key(default_global_keymap,        "C-b",       "cmd_scrollPageUp");
define_key(minibuffer_base_keymap,       "C-b",       "cmd_scrollPageUp");
define_key(content_buffer_form_keymap,   "C-b",       "cmd_scrollPageUp_unfocus");
define_key(content_buffer_text_keymap,   "C-b",       "cmd_scrollPageUp_unfocus");
define_key(content_buffer_normal_keymap, "C-b",       "cmd_scrollPageUp");
// this is pagedown that works as expected everywhere
define_key(default_global_keymap,        "C-v",       "cmd_scrollPageDown");
define_key(minibuffer_base_keymap,       "C-v",       "cmd_scrollPageDown");
define_key(content_buffer_form_keymap,   "C-v",       "cmd_scrollPageDown_unfocus");
define_key(content_buffer_text_keymap,   "C-v",       "cmd_scrollPageDown_unfocus");
define_key(content_buffer_normal_keymap, "C-v",       "cmd_scrollPageDown");
// this is pageup that works as expected everywhere
define_key(default_global_keymap,        "S-up",      "cmd_scrollPageUp");
define_key(minibuffer_base_keymap,       "S-up",      "cmd_scrollPageUp");
define_key(content_buffer_form_keymap,   "S-up",      "cmd_scrollPageUp_unfocus");
define_key(content_buffer_text_keymap,   "S-up",      "cmd_scrollPageUp_unfocus");
define_key(content_buffer_normal_keymap, "S-up",      "cmd_scrollPageUp");
// this is pagedown that works as expected everywhere
define_key(default_global_keymap,        "S-down",    "cmd_scrollPageDown");
define_key(minibuffer_base_keymap,       "S-down",    "cmd_scrollPageDown");
define_key(content_buffer_form_keymap,   "S-down",    "cmd_scrollPageDown_unfocus");
define_key(content_buffer_text_keymap,   "S-down",    "cmd_scrollPageDown_unfocus");
define_key(content_buffer_normal_keymap, "S-down",    "cmd_scrollPageDown");

define_key(default_global_keymap, "C-c r", "reload-config");

// unfocus before pagedown
interactive("cmd_scrollPageDown_unfocus",
            "Unfocus and scroll page down",
    function (I) {
        unfocus(I.window,I.buffer);
        yield call_interactively(I, "cmd_scrollPageDown");
    });

// unfocus before pageup
interactive("cmd_scrollPageUp_unfocus",
            "Unfocus and scroll page up",
    function (I) {
        unfocus(I.window,I.buffer);
        yield call_interactively(I, "cmd_scrollPageUp");
    });

// help
define_key(default_global_keymap,"s-h k","describe-key");
define_key(default_global_keymap,"s-h t","tutorial");
define_key(default_global_keymap,"s-h v","describe-variable");

// url
url_completion_use_bookmarks = false;
url_completion_use_history = false;
url_completion_use_webjumps = true;
url_remoting_fn = load_url_in_new_window;
// alternatives if desired
// url_remoting_fn = load_url_in_new_buffer;
// url_remoting_fn = load_url_in_current_buffer;

// XXXX acceleration makes a big difference for me
// XXXX: make sure they are stored more permanently
user_pref("layers.acceleration.disabled", false);
user_pref("layers.acceleration.force-enabled", true);
user_pref("layers.offmainthreadcomposition.enabled", true);
// XXXX: hidden option enables azure acceleration
user_pref("gfx.canvas.azure.accelerated",true);
// XXXX: needs to be low on low-memory devices
user_pref("browser.preferences.defaultPerformanceSettings.enabled",false);
// maybe these should just be default?
user_pref("dom.ipc.processCount",4);
user_pref("dom.workers.enabled",true);
user_pref("dom.workers.sharedWorkers.enabled",true);
user_pref("dom.workers.maxPerDomain",20);
user_pref("dom.workers.websocket.enabled",true);
// TODO https://wiki.mozilla.org/Electrolysis#Force_Enable
// XXXX: remove if not stable, but puts each window into its own process
user_pref("browser.tabs.remote.force-enable",true);
user_pref("media.hardware-video-decoding.enabled",true);
user_pref("media.hardware-video-decoding.force-enabled",true);
// 1001: disable disk cache
user_pref("browser.cache.disk.enable",false);
user_pref("browser.cache.disk.capacity", 0);
user_pref("browser.cache.disk.smart_size.enabled", false);
user_pref("browser.cache.disk.smart_size.first_run", false);
// 1002: disable disk caching of SSL pages
// http://kb.mozillazine.org/Browser.cache.disk_cache_ssl
user_pref("browser.cache.disk_cache_ssl", false);
user_pref("browser.cache.memory.enable ",true);
// for 1GB computer, size in kb
// http://kb.mozillazine.org/Browser.cache.memory.capacity
user_pref("browser.cache.memory.capacity","32768");

// XXXX: not sure if these can be session prefs or must be user prefs
//       these seem to be needed for recaptcha v2 to work
user_pref("dom.w3c_pointer_events.enabled",true);
user_pref("dom.messageChannel.enabled",true);

// session preferences
// fonts
session_pref("font.minimum-size.x-western", 11);
session_pref("font.size.x-western", 11);
session_pref("font.size.variable.x-western", 11);
session_pref("xpinstall.whitelist.required", false);
// TODO: these may be needed sometimes, so they are here
session_pref("extensions.blocklist.enabled", false);
session_pref("extensions.checkCompatibility", false);
session_pref("extensions.checkUpdateSecurity", false);
session_pref("browser.history_expire_days",1);
// session_pref("browser.download.manager.retention",1)
session_pref("browser.display.show_image_placeholders",false);
session_pref("full-screen-api.enabled",true);
// TODO: is this what I want, especially for slow computers
// session_pref("network.prefetch-next",true);
user_pref("network.http.max-persistent-connections-per-server",4);
user_pref("network.http.pipelining",true);
user_pref("network.http.pipelining.ssl",true);
user_pref("network.http.pipelining.maxrequests",8);
// performance stuff
// I either have lots of memory or a slow computer
user_pref("browser.cache.compression_level",0);
// 1004: disable offline cache
user_pref("browser.cache.offline.enable", false);
// 1005: disable storing extra session data 0=all 1=http-only 2=none
// extra session data contains contents of forms, scrollbar positions, cookies and POST data
session_pref("browser.sessionstore.privacy_level", 2);
// printer stuff
session_pref("print.print_headercenter","");
session_pref("print.print_headerleft","");
session_pref("print.print_headerright","");
session_pref("print.print_footercenter","");
session_pref("print.print_footerleft","");
session_pref("print.print_footerright","");
// print to PDF by default
session_pref("print.print_printer","");
session_pref("print.print_shrink_to_fit",true);
session_pref("print.shrink_to_fit.scale-limit-percent",50);
// session_pref("print.always_print_silent", true);
// session_pref("print.print_to_file","");
// session_pref("print.print_to_filename","");
session_pref("dom.ipc.plugins.flash.subprocess.crashreporter.enabled",false);
// javascript by default
session_pref("javascript.enabled",true);
// media
session_pref("media.mediasource.mp4.enabled",true);
session_pref("media.mediasource.webm.enabled",true);
// session_pref("media.autoplay.enabled",false);
// deactivate conkeror page modes
// deactivating conkeror page modes speed up things a lot on slow computers
// TODO: eventually remove from conkeror
page_mode_deactivate(dailymotion_mode);
// page_mode_deactivate(duckduckgo_mode);
page_mode_deactivate(google_calendar_mode);
page_mode_deactivate(google_maps_mode);
// disabled in my version of conkeror
// page_mode_deactivate(google_reader_mode);
page_mode_deactivate(google_video_mode);
page_mode_deactivate(smbc_mode);
page_mode_deactivate(xkcd_mode);
page_mode_deactivate(youtube_mode);
page_mode_deactivate(youtube_player_mode);
// Page mode modules deactivate
session_pref("conkeror.load.page-modes/dailymotion", 0);
session_pref("conkeror.load.page-modes/google-calendar", 0);
session_pref("conkeror.load.page-modes/google-maps", 0);
session_pref("conkeror.load.page-modes/google-video", 0);
session_pref("conkeror.load.page-modes/smbc", 0);
session_pref("conkeror.load.page-modes/xkcd", 0);
session_pref("conkeror.load.page-modes/youtube", 0);
session_pref("conkeror.load.page-modes/youtube-player", 0);

// I go to sites that like webgl
session_pref("webgl.disabled", false);
session_pref("webgl.min_capability_mode", false);
session_pref("webgl.disable-extensions", false);
session_pref("webgl.dxgl.enabled", true);
session_pref("webgl.enable-webgl2", true);
session_pref("webgl.force-enabled", true);

session_pref("browser.sessionhistory.max_entries", 50);

// https://gist.github.com/haasn/69e19fc2fe0e25f3cff5
session_pref("dom.event.clipboardevents.enabled",false);
session_pref("dom.battery.enabled",false);
session_pref("loop.enabled",false);
// TODO: what is this, see https://gist.github.com/haasn/69e19fc2fe0e25f3cff5
session_pref("browser.beacen.enabled",false);
session_pref("geo.enabled",false);
session_pref("geo.wifi.logging.enabled",false);
session_pref("geo.wifi.uri","");
// TODO: should I enable these?
session_pref("browser.safebrowsing.enabled",false);
session_pref("browser.safebrowsing.downloads.enabled",false);
session_pref("browser.safebrowsing.malware.enabled",false);
session_pref("media.block-autoplay-until-in-foreground",true);
// TODO: if this has disappeared from waterfox, then can remove this permanently
// session_pref("social.manifest.facebook","");
session_pref("device.sensors.enabled",false);
session_pref("camera.control.autofocus_moving_callback.enabled",false);
// network.http.speculative-parallel-limit=0
// TODO: update security versions when relivant
session_pref("security.tls.insecure_fallback_hosts.use_static_list",false);
// TOOD: fix this
session_pref("security.tls.version.min",1);
// TODO: change security settings in future when I don't need to connect to certain unsafe websites
// https://wiki.mozilla.org/Security:Renegotiation#security.ssl.require_safe_negotiation
// session_pref("security.ssl.require_safe_negotiation",true);
// TODO: not having this broke google on January 19,2018
session_pref("security.ssl.treat_unsafe_negotiation_as_broken",false);
session_pref("security.ssl3.rsa_seed_sha",true);
session_pref("security.OCSP.enabled",1);
session_pref("security.OCSP.require",false);
// perfect forward secrecy, but muight break many things
// session_pref("security.ssl3.rsa_aes_256_sha",false);
// TODO: better, but some of my websites won't work
// session_pref("security.tls.version.min",3);
// changed ghacks defaults because I use it
session_pref("layout.css.visited_links_enabled", true);

// copy the current url and it's title to an org-mode link in the clipboard
interactive("copy-url-title","Copy url and title to clipboard in org-mode format.",
    function (I) {
        var the_url_title="[[" + I.buffer.current_uri.spec + "][" + I.buffer.document.title + "]]";
        writeToClipboard(the_url_title);
        I.window.minibuffer.message("Copied to clipboard: " + the_url_title);
    });
define_key(content_buffer_normal_keymap, "s-0", "copy-url-title");

// copy the current url and the selected text to an org-mode link in the clipboard
interactive("copy-url-selected","Copy url and the selected text to clipboard in org-mode format.",
    function (I) {
        var the_url_selected="[[" + I.buffer.current_uri.spec + "][" + read_from_x_primary_selection() + "]]";
        writeToClipboard(the_url_selected);
        I.window.minibuffer.message("Copied to clipboard: " + the_url_selected);
    });
define_key(content_buffer_normal_keymap, "C-0", "copy-url-selected");

// Adblock Plus
// http://conkeror.org/AdblockPlus
// I use Adblock Latitude right now but will probably replace with another fork of
require("extensions/adblockplus.js");

// toggle javascript on/off
// TODO: add modeline indication and hint
interactive("toggle-javascript","Toggle javascript.",
    function (I) {
        if (get_pref("javascript.enabled")) {
            I.window.minibuffer.message("Disabling javascript!!!");
            session_pref("javascript.enabled",false);
        } else {
            I.window.minibuffer.message("Enabling javascript!!!");
            session_pref("javascript.enabled",true);
        }
    });
define_key(content_buffer_normal_keymap,"s-n","toggle-javascript");

// based on http://conkeror.org/Focus
// stop things like form elements from focusing, eventually add a whitelist for certain websites
function focusblock (buffer) {
    var s = Components.utils.Sandbox(buffer.top_frame);
    s.document = buffer.document.wrappedJSObject;
    Components.utils.evalInSandbox(
        "(function () {\
            function nothing () {}\
            if (! document.forms)\
                return;\
            for (var i = 0, nforms = document.forms.length; i < nforms; i++) {\
              for (var j = 0, nels = document.forms[i].elements.length; j < nels; j++)\
                document.forms[i].elements[j].focus = nothing;\
            }\
          })();",
        s);
}
add_hook('content_buffer_progress_change_hook', focusblock);

// really quick ones
// these are here so the browser is functional even if json is not loaded
// TODO: figure out safe search off by default in duckduckgo
define_webjump("duckduckgo","https://duckduckgo.com/?q=%s&t=hb&ia=web",                                    $alternative="https://duckduckgo.com");
define_webjump("google",    "https://www.google.ca/search?q=%s&ie=utf-8&oe=utf-8&gws_rd=cr&dcr=0&safe=off",$alternative="https://www.google.ca/");
// local stuff for completion
define_webjump("aboutaddons", "about:config");
define_webjump("aboutconfig", "about:config");
define_webjump("aboutsupport","about:support");
// use web browser for system admin
define_webjump("local-router", "http://192.168.0.1");
define_webjump("router-local", "http://192.168.0.1");
define_webjump("local-cups",   "http://localhost:631");
define_webjump("cups-local",   "http://localhost:631");

// load webjumps from a json file
function load_webjumps_json (path) {
    if (! (path instanceof Ci.nsIFile)) {
        path = make_file(path);
    }
    var string_json = read_text_file(path);
    // TODO: this was suggested by stackoverflow but I could not get it to work
    // var rv = JSON.parse(JSON.stringify(read_text_file(path)));
    // https://stackoverflow.com/questions/244777/can-comments-be-used-in-json
    // https://stackoverflow.com/questions/2930852/javascript-how-to-remove-line-that-contain-specific-string
    var string_json_nocomment = string_json.replace(/^\s*\/\/.*$/mg,'');
    var parsed_json = JSON.parse(string_json_nocomment);
    for (let entry in parsed_json) {
        if (parsed_json[entry].length == 2) {
            define_webjump(entry,String(parsed_json[entry][0]),$alternative=String(parsed_json[entry][1]));
        } else {
            define_webjump(entry,String(parsed_json[entry]));
        }
    }
}
load_webjumps_json('~/.conkerorrc/conkeror-webjumps.json');

////////////////////////////////////////////////////////////////////////////////
// misc

// copy all urls in currently open buffer to clipboard as list, generally meant to move to other programs
// TODO: and/or save to temp file
// TODO: name ambiguous because it can be confused with scraping urls
interactive("copy-all-urls", "Copy all URLs",
    function (I) {
        var urls="";
        for (let i = 0, nbuffers = I.window.buffers.count; i < nbuffers; i++ ) {
            urls = urls + "\n" + "[[" + I.window.buffers.get_buffer(i).display_uri_string + "]] -- " + I.window.buffers.get_buffer(i).document.title;
        }
        urls = urls + "\n";
        // I.window.minibuffer.message(urls);
        var gClipboardHelper = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper);
        gClipboardHelper.copyString(urls);
    });
// open current url in firefox
interactive("open-firefox", "",
    function (I) {
        var theurl = transform_url_location(I.buffer,I.buffer.display_uri_string);
        var cmd_str = 'firefox -P default -new-tab "' + theurl + '"';
        dumpln(cmd_str);
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap, "C-c f", "open-firefox");
// open current url in a private session of firefox
interactive("open-firefox-private", "",
    function (I) {
        var theurl = transform_url_location(I.buffer,I.buffer.display_uri_string);
        var cmd_str = 'firefox -private -new-tab "' + theurl + '"';
        dumpln(cmd_str);
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap, "C-u C-c f", "open-firefox-private");
// open current url using the conkeror-private script
interactive("open-conkeror-private", "",
    function (I) {
        var theurl = transform_url_location(I.buffer,I.buffer.display_uri_string);
        var cmd_str = 'conkeror-private "' + theurl + '"';
        dumpln(cmd_str);
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap, "C-c x", "open-conkeror-private");
// open current url in chromium
interactive("open-chromium", "",
    function (I) {
        // TODO: Can't auto-enable ad-blocker and avoid ads, I shred it enough that this is fine
        var theurl = transform_url_location(I.buffer,I.buffer.display_uri_string);
        var cmd_str = 'chromium --temp-profile "' + theurl + '"';
        dumpln(cmd_str);
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap, "C-c g", "open-chromium");

// function to reload conkerorrc with a helpful message
interactive("reload-config", "reload conkerorrc",
       function(I) {
          load_rc();
          I.window.minibuffer.message("config reloaded");
       });

/*
 * Copyright (c) 2010 Nick Galbreath
 * http://code.google.com/p/stringencoders/source/browse/#svn/trunk/javascript
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* base64 encode/decode compatible with window.btoa/atob
 *
 * window.atob/btoa is a Firefox extension to convert binary data (the "b")
 * to base64 (ascii, the "a").
 *
 * It is also found in Safari and Chrome.  It is not available in IE.
 *
 * if (!window.btoa) window.btoa = base64.encode
 * if (!window.atob) window.atob = base64.decode
 *
 * The original spec's for atob/btoa are a bit lacking
 * https://developer.mozilla.org/en/DOM/window.atob
 * https://developer.mozilla.org/en/DOM/window.btoa
 *
 * window.btoa and base64.encode takes a string where charCodeAt is [0,255]
 * If any character is not [0,255], then an DOMException(5) is thrown.
 *
 * window.atob and base64.decode take a base64-encoded string
 * If the input length is not a multiple of 4, or contains invalid characters
 *   then an DOMException(5) is thrown.
 */
var base64 = {};
base64.PADCHAR = '=';
base64.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

base64.makeDOMException = function() {
    // sadly in FF,Safari,Chrome you can't make a DOMException
    var e, tmp;

    try {
        return new DOMException(DOMException.INVALID_CHARACTER_ERR);
    } catch (tmp) {
        // not available, just passback a duck-typed equiv
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error/prototype
        var ex = new Error("DOM Exception 5");

        // ex.number and ex.description is IE-specific.
        ex.code = ex.number = 5;
        ex.name = ex.description = "INVALID_CHARACTER_ERR";

        // Safari/Chrome output format
        ex.toString = function() { return 'Error: ' + ex.name + ': ' + ex.message; };
        return ex;
    }
}

base64.getbyte64 = function(s,i) {
    // This is oddly fast, except on Chrome/V8.
    //  Minimal or no improvement in performance by using a
    //   object with properties mapping chars to value (eg. 'A': 0)
    var idx = base64.ALPHA.indexOf(s.charAt(i));
    if (idx === -1) {
        throw base64.makeDOMException();
    }
    return idx;
}

base64.decode = function(s) {
    // convert to string
    s = '' + s;
    var getbyte64 = base64.getbyte64;
    var pads, i, b10;
    var imax = s.length
    if (imax === 0) {
        return s;
    }

    if (imax % 4 !== 0) {
        throw base64.makeDOMException();
    }

    pads = 0
    if (s.charAt(imax - 1) === base64.PADCHAR) {
        pads = 1;
        if (s.charAt(imax - 2) === base64.PADCHAR) {
            pads = 2;
        }
        // either way, we want to ignore this last block
        imax -= 4;
    }

    var x = [];
    for (i = 0; i < imax; i += 4) {
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) |
            (getbyte64(s,i+2) << 6) | getbyte64(s,i+3);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
    }

    switch (pads) {
    case 1:
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) | (getbyte64(s,i+2) << 6);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
        break;
    case 2:
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12);
        x.push(String.fromCharCode(b10 >> 16));
        break;
    }
    return x.join('');
}

base64.getbyte = function(s,i) {
    var x = s.charCodeAt(i);
    if (x > 255) {
        throw base64.makeDOMException();
    }
    return x;
}

base64.encode = function(s) {
    if (arguments.length !== 1) {
        throw new SyntaxError("Not enough arguments");
    }
    var padchar = base64.PADCHAR;
    var alpha   = base64.ALPHA;
    var getbyte = base64.getbyte;

    var i, b10;
    var x = [];

    // convert to string
    s = '' + s;

    var imax = s.length - s.length % 3;

    if (s.length === 0) {
        return s;
    }
    for (i = 0; i < imax; i += 3) {
        b10 = (getbyte(s,i) << 16) | (getbyte(s,i+1) << 8) | getbyte(s,i+2);
        x.push(alpha.charAt(b10 >> 18));
        x.push(alpha.charAt((b10 >> 12) & 0x3F));
        x.push(alpha.charAt((b10 >> 6) & 0x3f));
        x.push(alpha.charAt(b10 & 0x3f));
    }
    switch (s.length - imax) {
    case 1:
        b10 = getbyte(s,i) << 16;
        x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
               padchar + padchar);
        break;
    case 2:
        b10 = (getbyte(s,i) << 16) | (getbyte(s,i+1) << 8);
        x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
               alpha.charAt((b10 >> 6) & 0x3f) + padchar);
        break;
    }
    return x.join('');
}

var g_rc_successful=true;
