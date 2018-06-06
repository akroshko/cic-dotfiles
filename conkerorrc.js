// https://github.com/vedang/conkeror-rc/blob/master/README
homepage = "http://conkeror.org/";
load_paths.unshift("chrome://conkeror-contrib/content/");
// TODO: uncomment?
// require('block-content-focus-change.js');
// hinting

// define_key(content_buffer_normal_keymap, "h", "browse-buffer-history");

// hint_digits="abcdefghijklmnopqrstuvwxyz";
hint_digits="asdfgqwertzxcvb";
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
// TODO: try to do this in single key
define_key(content_buffer_normal_keymap, "s-x",
    "browser-object-relationship-next",
    $repeat = "follow-unfocus");
define_key(content_buffer_normal_keymap, "f17",
    "browser-object-relationship-previous",
    $repeat = "follow-unfocus");
define_key(content_buffer_normal_keymap, "f19",
    "browser-object-relationship-next",
    $repeat = "follow-unfocus");
interactive("follow-unfocus","Follow and unfocus.",
    function (I) {
        yield follow(I, OPEN_CURRENT_BUFFER);
        // removing this for now
        unfocus(I.window, I.buffer);
    });

// TODO: append to default instead
// currently nonfuncitonal
browser_relationship_patterns[RELATIONSHIP_NEXT] =
    [/^next$/i,
     new RegExp("^>$","i"),
     new RegExp("^(>>|[\\xBB])$","i"),
     new RegExp("^(>|[\\xBB])","i"),
     new RegExp("(>|[\\xBB])$","i"),
     // new RegExp("»","i"),
     new RegExp("[\\u25BA]","i"),
     new RegExp("\\bnext","i")];
// ► »

browser_relationship_patterns[RELATIONSHIP_PREVIOUS] =
    [/^(prev|previous)$/i,
     new RegExp("^<$","i"),
     new RegExp("^(<<|[\\xAB])$","i"),
     new RegExp("^(<|[\\xAB])","i"),
     new RegExp("(<|[\\xAB])$","i"),
     new RegExp("[\\u25C4]","i"),
     new RegExp("\\bprev|previous\\b","i")];
// ◄ «

////////////////////////////////////////
// capture page with keyboard shortcut
// TODO: change timeouts to not be stupid
interactive("local-print-buffer",
    "Print the currently loaded page.",
    function (I) {
        // only a copy, should not take long
        session_pref("print.always_print_silent", true);
        I.window.setTimeout(function() {
            I.buffer.top_frame.print();
        },1000);
        // TODO: use a callback on print instead if possible
        I.window.setTimeout(function() {
            session_pref("print.always_print_silent", false);
        },2000);
    });


// http://conkeror.org/Tips#Browse_buffer_session_history
// TODO: need hotkey for this
interactive("browse-buffer-history",
            "Browse the session history for the current buffer",
    function browse_buffer_history (I) {
        var b = check_buffer(I.buffer, content_buffer);
        var history = b.web_navigation.sessionHistory;

        if (history.count > 1) {
            var entries = [];

            for(var i = 0 ; i < history.count ; i += 1) {
                entries[i] = history.getEntryAtIndex(i, false).URI.spec;
            }

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
// esdf keys, experimental
// TODO: need new 10x, need new back
// TODO: these could be better, exteriment
// TODO: is this really what I want
define_key(content_buffer_normal_keymap, "o",       "browser-object-media");
// follow and other surfing keys
define_key(content_buffer_normal_keymap, "f",       "follow");
define_key(content_buffer_normal_keymap, "s-f",     "follow-new-buffer");
define_key(content_buffer_normal_keymap, "s-F",     "follow-new-buffer-background");
define_key(content_buffer_normal_keymap, "M-s-f",   "follow-new-window");
// TODO: esdf keys no longer used
// define_key(content_buffer_normal_keymap, "e",       "cmd_scrollLineUp");
// define_key(content_buffer_normal_keymap, "s",       "cmd_scrollLeft");
// define_key(content_buffer_normal_keymap, "d",       "cmd_scrollLineDown");
// define_key(content_buffer_normal_keymap, "f",       "cmd_scrollRight");
// TODO: d is too valuable
// define_key(content_buffer_normal_keymap, "d",       "duplicate-buffer");
// define_key(content_buffer_normal_keymap, "s-d",     "duplicate-buffer-new-window");
// m=mirror

define_key(content_buffer_normal_keymap, "s-m",     "duplicate-buffer");
define_key(content_buffer_normal_keymap, "s-M",     "duplicate-buffer-background");
define_key(content_buffer_normal_keymap, "M-s-m",   "duplicate-buffer-new-window");
define_key(content_buffer_normal_keymap, "D",       "find-url-new-window");
define_key(content_buffer_normal_keymap, "/",       "save");
// TODO: best way to disable \ as viewsource... too easy and descructive
define_key(content_buffer_normal_keymap, "\\",      "");
require("clicks-in-new-buffer.js");
// clicks_in_new_buffer_target = OPEN_NEW_BUFFER_BACKGROUND;
clicks_in_new_buffer_target = OPEN_NEW_WINDOW;
clicks_in_new_buffer_button = 2;
// / for download/save
// m for mirror/duplicate
// best ones are....
// ???
// buffer switching
define_key(content_buffer_normal_keymap, "s-space", "switch-to-buffer");
define_key(minibuffer_keymap,            "s-space", "minibuffer-complete");

define_key(content_buffer_normal_keymap, "C-]",     "local-print-buffer");
// define_key(default_global_keymap,        "M-u",     "unfocus");
// define_key(text_keymap,                  "M-u",     "unfocus");
// define_key(content_buffer_text_keymap,   "M-u",     "unfocus");
define_key(default_global_keymap,        "C-j",     "unfocus");
define_key(text_keymap,                  "C-j",     "unfocus");
define_key(content_buffer_text_keymap,   "C-j",     "unfocus");
// define_key(text_keymap,                  "M-U",     "upcase-word");

// TODO: not sure if this is best, unfocus back some?
define_key(content_buffer_normal_keymap, "a", "back");
define_key(content_buffer_normal_keymap, "s-a", "back");
define_key(content_buffer_normal_keymap, "s-c", "back");
define_key(content_buffer_normal_keymap, "s-l", "back");
define_key(content_buffer_normal_keymap, "f21", "back");
// define_key(content_buffer_normal_keymap, "F22", "forward");
// define_key(content_buffer_normal_keymap, "s-g",   "find-url");
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

define_key(default_global_keymap,        "M-?", "isearch-backward");
define_key(content_buffer_normal_keymap, "M-?", "isearch-backward");
define_key(isearch_keymap,               "M-?", "isearch-continue-backward");

define_key(default_global_keymap,        "M-/", "isearch-forward");
define_key(content_buffer_normal_keymap, "M-/", "isearch-forward");
define_key(isearch_keymap,               "M-/", "isearch-continue-forward");
// modules/bindings/default/content-buffer/normal.js:define_key(content_buffer_normal_keymap, "S", "isearch-continue-forward");
// modules/bindings/default/content-buffer/normal.js:define_key(content_buffer_normal_keymap, "R", "isearch-continue-backward");


interactive("open-marked-url", "Open the marked url.",
    function (I) {
        // see http://conkeror.org/Tips#Copy_Selection_to_Emacs_kill_ring
        call_interactively(I, "cmd_copy");
        var cc = read_from_x_primary_selection();
        // trim everything from the front and back that are not good characters
        // TODO: make a nice function for this
        cc=cc.replace(/^["';<>()\/\\]*/,"","g");
        cc=cc.replace(/["';<>()\\]*$/,"","g");
        // reconstruct http, could cause confusion for ftp but hey, it is not too bad
        cc=cc.replace(/^ttp/,"http","g");
        cc=cc.replace(/^tp/,"http","g");
        I.window.minibuffer.message(cc);
        // now follow the link
        browser_object_follow(I.buffer,OPEN_CURRENT_BUFFER,cc);
    }
);
define_key(content_buffer_normal_keymap, "M-f", "open-marked-url");

// TODO: could 5 be bad in some cases? do I need an F-key, i.e., F5?
define_key(content_buffer_normal_keymap, "5",   "reload");
define_key(content_buffer_normal_keymap, "%",   "reload");
// TODO: alternate key to avoid interception
define_key(content_buffer_normal_keymap, "s-r",   "reload");
// TODO: something slightly more consistent
// define_key(content_buffer_normal_keymap, "d",   "duplicate-buffer");
// TODO: not great, but not bad either, maybe b will free up some day
// define_key(content_buffer_normal_keymap, "D", "follow-new-buffer-background");
// new window
// TODO: still want these?
define_key(content_buffer_normal_keymap, "w",   "duplicate-buffer-new-window");
define_key(content_buffer_normal_keymap, "W",   "find-url-new-window");
// copy and paste
// TODO: should be copy-url sometimes too
// TODO: not sure about default_global_keymap
define_key(default_global_keymap,        "M-c", "kill-ring-save");
define_key(minibuffer_base_keymap,       "M-c", "kill-ring-save");
define_key(content_buffer_form_keymap,   "M-c", "kill-ring-save");
define_key(content_buffer_text_keymap,   "M-c", "kill-ring-save");
define_key(content_buffer_normal_keymap, "M-c", "cmd_copy");

// TODO: should be paste-url sometimes too
define_key(default_global_keymap,        "M-v", "yank");
define_key(minibuffer_base_keymap,       "M-v", "yank");
define_key(content_buffer_form_keymap,   "M-v", "yank");
define_key(content_buffer_text_keymap,   "M-v", "yank");
define_key(content_buffer_normal_keymap, "M-v", "paste-url");
define_key(default_global_keymap,        "s-v", "paste-x-primary-selection");
define_key(minibuffer_base_keymap,       "s-v", "paste-x-primary-selection");
define_key(content_buffer_form_keymap,   "s-v", "paste-x-primary-selection");
define_key(content_buffer_text_keymap,   "s-v", "paste-x-primary-selection");
// TODO: I'd like a paste url primary
define_key(content_buffer_normal_keymap, "s-v", "paste-url");
// scroll
define_key(content_buffer_normal_keymap, "b",         "cmd_scrollPageUp");
define_key(content_buffer_normal_keymap, "C-,",       "cmd_scrollPageUp");
define_key(content_buffer_normal_keymap, "C-.",       "cmd_scrollPageDown");
define_key(content_buffer_normal_keymap, "M-,",       "cmd_scrollPageUp");
define_key(content_buffer_normal_keymap, "M-.",       "cmd_scrollPageDown");
// this is pageup that works as expected everywhere
define_key(default_global_keymap,        "page_up",   "cmd_scrollPageUp");
define_key(minibuffer_base_keymap,       "page_up",   "cmd_scrollPageUp");
define_key(content_buffer_form_keymap,   "page_up",   "unfocus", $repeat = "cmd_scrollPageUp");
define_key(content_buffer_text_keymap,   "page_up",   "unfocus", $repeat = "cmd_scrollPageUp");
define_key(content_buffer_normal_keymap, "page_up",   "cmd_scrollPageUp");
define_key(default_global_keymap,        "s-Z",       "cmd_scrollPageUp");
define_key(minibuffer_base_keymap,       "s-Z",       "cmd_scrollPageUp");
define_key(content_buffer_form_keymap,   "s-Z",       "unfocus", $repeat = "cmd_scrollPageUp");
define_key(content_buffer_text_keymap,   "s-Z",       "unfocus", $repeat = "cmd_scrollPageUp");
define_key(content_buffer_normal_keymap, "s-Z",       "cmd_scrollPageUp");
// this is pagedown that works as expected everywhere
define_key(default_global_keymap,        "page_down", "cmd_scrollPageDown");
define_key(minibuffer_base_keymap,       "page_down", "cmd_scrollPageDown");
define_key(content_buffer_form_keymap,   "page_down", "unfocus", $repeat = "cmd_scrollPageDown");
define_key(content_buffer_text_keymap,   "page_down", "unfocus", $repeat = "cmd_scrollPageDown");
define_key(content_buffer_normal_keymap, "page_down", "cmd_scrollPageDown");
define_key(default_global_keymap,        "s-z",       "cmd_scrollPageDown");
define_key(minibuffer_base_keymap,       "s-z",       "cmd_scrollPageDown");
define_key(content_buffer_form_keymap,   "s-z",       "unfocus", $repeat = "cmd_scrollPageDown");
define_key(content_buffer_text_keymap,   "s-z",       "unfocus", $repeat = "cmd_scrollPageDown");
define_key(content_buffer_normal_keymap, "s-z",       "cmd_scrollPageDown");
// this is pageup that works as expected everywhere
define_key(default_global_keymap,        "S-up",   "cmd_scrollPageUp");
define_key(minibuffer_base_keymap,       "S-up",   "cmd_scrollPageUp");
define_key(content_buffer_form_keymap,   "S-up",   "unfocus", $repeat = "cmd_scrollPageUp");
define_key(content_buffer_text_keymap,   "S-up",   "unfocus", $repeat = "cmd_scrollPageUp");
define_key(content_buffer_normal_keymap, "S-up",   "cmd_scrollPageUp");
// this is pagedown that works as expected everywhere
// TODO: just v?
define_key(default_global_keymap,        "S-down",   "cmd_scrollPageDown");
define_key(minibuffer_base_keymap,       "S-down",   "cmd_scrollPageDown");
define_key(content_buffer_form_keymap,   "S-down",   "unfocus", $repeat = "cmd_scrollPageDown");
define_key(content_buffer_text_keymap,   "S-down",   "unfocus", $repeat = "cmd_scrollPageDown");
define_key(content_buffer_normal_keymap, "S-down",   "cmd_scrollPageDown");
// scroll a bit
// TODO: decide if this is right, need cheatsheet
// define_key(default_global_keymap,        "C-s-z", "cmd_scrollLineDown");
// define_key(minibuffer_base_keymap,       "C-s-z", "cmd_scrollLineDown");
// define_key(content_buffer_form_keymap,   "C-s-z", "cmd_scrollLineDown", $repeat = "cmd_scrollLineDown");
// define_key(content_buffer_text_keymap,   "C-s-z", "cmd_scrollLineDown", $repeat = "cmd_scrollLineDown");
// define_key(content_buffer_normal_keymap, "C-s-z", "cmd_scrollLineDown");
// TODO: I replaceed this stuff
// scroll a bit
// define_key(default_global_keymap,        "s-v",   "cmd_scrollLineDown");
// define_key(minibuffer_base_keymap,       "s-v",   "cmd_scrollLineDown");
// define_key(content_buffer_form_keymap,   "s-v",   "cmd_scrollLineDown", $repeat = "cmd_scrollLineDown");
// define_key(content_buffer_text_keymap,   "s-v",   "cmd_scrollLineDown", $repeat = "cmd_scrollLineDown");
// define_key(content_buffer_normal_keymap, "s-v",   "cmd_scrollLineDown");
// // scroll a bit
// define_key(default_global_keymap,        "s-V",   "cmd_scrollLineUp");
// define_key(minibuffer_base_keymap,       "s-V",   "cmd_scrollLineUp");
// define_key(content_buffer_form_keymap,   "s-V",   "cmd_scrollLineUp", $repeat = "cmd_scrollLineDown");
// define_key(content_buffer_text_keymap,   "s-V",   "cmd_scrollLineUp", $repeat = "cmd_scrollLineDown");
// define_key(content_buffer_normal_keymap, "s-V",   "cmd_scrollLineUp");


// TODO: does not seem to work
// interactive("cmd_scrollPageDown_unfocus",
//             "Unfocus and scroll page down",
//     function (I) {
//         // call_interactively(I, "unfocus");
//         call_interactively(I, "cmd_scrollPageDown");
//     });

// scroll
// TODO: replace by asdf keys
// TODO: do with "v" as well? change page back to "b", something else for background?
// define_key(content_buffer_normal_keymap, "s-V", "cmd_scrollLineUp");
// define_key(content_buffer_normal_keymap, "s-v", "cmd_scrollLineDown");
// TODO: replace standard view with something else
// define_key(content_buffer_normal_keymap, "V",   "cmd_scrollLineUp");
// define_key(content_buffer_normal_keymap, "v",   "cmd_scrollLineDown");
// url
url_completion_use_bookmarks = false;
url_completion_use_history = false;
url_completion_use_webjumps = true;
url_remoting_fn = load_url_in_new_window;
// url_remoting_fn = load_url_in_new_buffer;
// url_remoting_fn = load_url_in_current_buffer;

// // user prefs
// user_pref("layers.acceleration.disabled", false);
// user_pref("layers.acceleration.force-enabled", true);
// user_pref("layers.offmainthreadcomposition.enabled", true);

// session preferences
// fonts
session_pref("font.minimum-size.x-western", 11);
session_pref("font.size.x-western", 11);
session_pref("font.size.variable.x-western", 11);
// ???
session_pref("xpinstall.whitelist.required", false);
session_pref("browser.history_expire_days",1);
// session_pref("browser.download.manager.retention",1)
// TODO do any of these actually work? some of these are broken...
session_pref("browser.display.show_image_placeholders",false);
session_pref("full-screen-api.enabled",true);
// TODO: fix?
// session_pref("gfx.font_rendering.directwrite.enabled",true);
// session_pref("mozilla.widget.render-mode",6);
// session_pref("network.prefetch-next",true);
// TODO: are these still valid?
session_pref("network.http.max-persistent-connections-per-server",8);
session_pref("network.http.pipelining",true);
session_pref("network.http.pipelining.maxrequests",8);
// session_pref("network.dns.disableIPv6",true);
// TODO:
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
// javascript by default
// this actually works!!! can impose options on conkeror!
// session_pref("print.always_print_silent", true);
// session_pref("print.print_to_file","");
// session_pref("print.print_to_filename","");
// deactivate page modes
session_pref("dom.ipc.plugins.flash.subprocess.crashreporter.enabled",false);
session_pref("javascript.enabled",true);
// TODO: see if this breaks anything, add on a key
// session_pref("media.autoplay.enabled",false);
page_mode_deactivate(youtube_player_mode);

interactive("copy-url-title","Copy url and title to clipboard in org-mode format.",
    function (I) {
        var the_url_title="[[" + I.buffer.current_uri.spec + "][" + I.buffer.document.title + "]]";
        writeToClipboard(the_url_title);
        I.window.minibuffer.message("Copied to clipboard: " + the_url_title);
    });
define_key(content_buffer_normal_keymap, "s-0", "copy-url-title");

// So `* p c` will copy the title of the current buffer


// Adblock Plus
// http://conkeror.org/AdblockPlus
require("extensions/adblockplus.js");

// TODO: does not seem to work
// interactive("toggle-adblockplus","Toggle adblockplus.",
//     function (I) {
//         if (get_pref("extensions.adblockplus.enabled")) {
//             I.window.minibuffer.message("Disabling adblockplus!!!");
//             session_pref("extensions.adblockplus.enabled",false);
//         } else {
//             I.window.minibuffer.message("Enabling adblockplus!!!");
//             session_pref("extensions.adblockplus.enabled",true);
//         }
//     });
// define_key(content_buffer_normal_keymap,"s-b","toggle-adblockplus");

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

// http://conkeror.org/Focus
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
// TODO: highlight following
// define_opensearch_webjump("d", "duckduckgo.xml");
// define_webjump("duckduckgo","https://duckduckgo.com/?q=%s",$alternative="https://duckduckgo.com");
// define_opensearch_webjump("g", "google.xml");
// TODO: single letter abbreviations too confusing... can I add a help string?
// TODO: figure out safe search off by default in duckduckgo
define_webjump("duckduckgo","https://duckduckgo.com/?q=%s&t=hb&ia=web",                                    $alternative="https://duckduckgo.com");
// define_webjump("g",         "https://www.google.ca/search?q=%s&ie=utf-8&oe=utf-8&gws_rd=cr&dcr=0&safe=off",$alternative="https://www.google.ca/");
define_webjump("google",    "https://www.google.ca/search?q=%s&ie=utf-8&oe=utf-8&gws_rd=cr&dcr=0&safe=off",$alternative="https://www.google.ca/");
// define_webjump("y",         "https://www.youtube.com/results?search_query=%s&search=Search",               $alternative="https://www.youtube.com/feed/subscriptions");
// local stuff for completion
define_webjump("about-config", "about:config");
define_webjump("about-support","about:support");
// use web browser for system admin
// TODO: may need to be https for some people
define_webjump("local-router", "http://192.168.0.1");
define_webjump("router-local", "http://192.168.0.1");
define_webjump("local-cups",   "http://localhost:631");
define_webjump("cups-local",   "http://localhost:631");

// http://conkeror.org/Tips#Selection_Searches
// selection searches
function create_selection_search(webjump, key) {
    interactive(webjump+"-selection-search",
                "Search " + webjump + " with selection contents",
                "find-url-new-buffer",
                $browser_object = function (I) {
                    return webjump + " " + I.buffer.top_frame.getSelection();});
    define_key(content_buffer_normal_keymap, key.toUpperCase(), webjump + "-selection-search");

    interactive("prompted-"+webjump+"-search", null,
                function (I) {
                    var term = yield I.minibuffer.read_url($prompt = "Search "+webjump+":",
                                                           $initial_value = webjump+" ",
                                                           $select = false);
                    browser_object_follow(I.buffer, FOLLOW_DEFAULT, term);
                });
    define_key(content_buffer_normal_keymap, key, "prompted-" + webjump + "-search");
}
create_selection_search("duckduckgo","d");
// TODO: e is wierd for google
create_selection_search("google","e");

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
    for (entry in parsed_json) {
        if (parsed_json[entry].length == 2) {
            define_webjump(entry,String(parsed_json[entry][0]),$alternative=String(parsed_json[entry][1]));
        } else {
            define_webjump(entry,String(parsed_json[entry]));
        }
    }
}
load_webjumps_json('~/.conkerorrc/conkeror-webjumps.json');

////////////////////////////////////////////////////////////////////////////////
// proxies
// I use port localhost:18122 as a proxy to my University for accademic journals
//       port localhost:18222 as a proxy back to my home
//       port localhost:18322 as a proxy to other third party providers
var current_conkeror_proxy = "No proxy";
// var current_conkeror_proxy_init=null;

// TODO: make function
// magenta=academic
var academic_proxy_style_sheet=make_css_data_uri(["*, .mode-line {background-color: #ff99ff; -moz-appearance: none;border-color:#000000;}",
                                                  // can I keep these at default instead?
                                                  "#minibuffer-input, .textbox-input-box {background-color: #ffffff;}",
                                                  "tree.completions treechildren {background-color: #ffffff;}"],
                                                 $namespace = XUL_NS);
// cyan=home
var home_proxy_style_sheet=make_css_data_uri(["*, .mode-line {background-color: #99ffff; -moz-appearance: none;border-color:#000000;}",
                                              // can I keep these at default instead?
                                              "#minibuffer-input, .textbox-input-box {background-color: #ffffff;}",
                                              "tree.completions treechildren {background-color: #ffffff;}"],
                                             $namespace = XUL_NS);
// blue=third party
var third_proxy_style_sheet=make_css_data_uri(["*, .mode-line {background-color: #9999ff; -moz-appearance: none;border-color:#000000;}",
                                               // can I keep these at default instead?
                                               "#minibuffer-input, .textbox-input-box {background-color: #ffffff;}",
                                               "tree.completions treechildren {background-color: #ffffff;}"],
                                              $namespace = XUL_NS);

// academic proxy
interactive("academic-localhost-proxy", "Academic Localhost proxy",
    function (I) {
        server = 'localhost';
        port=18122;
        session_pref('network.proxy.socks', server);
        session_pref('network.proxy.socks_port', port);
        session_pref('network.proxy.share_proxy_settings', true);
        session_pref('network.proxy.type', 1);
        I.window.minibuffer.message("Socks using "+server+":"+port+" for this session");
        current_conkeror_proxy = "Academic proxy on "+server+":"+port;
        mode_line_mode(false);
        mode_line_mode(true);
        unregister_user_stylesheet(home_proxy_style_sheet);
        unregister_user_stylesheet(third_proxy_style_sheet);
        register_user_stylesheet(academic_proxy_style_sheet);
    });
define_key(content_buffer_normal_keymap,"C-c p","academic-localhost-proxy")

// home proxy
interactive("home-localhost-proxy", "Home Localhost proxy",
    function (I) {
        server = 'localhost';
        port=18123;
        session_pref('network.proxy.socks', server);
        session_pref('network.proxy.socks_port', port);
        session_pref('network.proxy.share_proxy_settings', true);
        session_pref('network.proxy.type', 1);
        I.window.minibuffer.message("Socks using "+server+":"+port+" for this session");
        current_conkeror_proxy = "Home proxy on "+server+":"+port;
        mode_line_mode(false);
        mode_line_mode(true);
        unregister_user_stylesheet(academic_proxy_style_sheet);
        unregister_user_stylesheet(third_proxy_style_sheet);
        register_user_stylesheet(home_proxy_style_sheet);
    });
define_key(content_buffer_normal_keymap,"C-c M-p","home-localhost-proxy")

// set up a proxy
// 3rd party proxy
interactive("third-localhost-proxy", "Third party localhost proxy",
    function (I) {
        server = 'localhost';
        port=18124;
        session_pref('network.proxy.socks', server);
        session_pref('network.proxy.socks_port', port);
        session_pref('network.proxy.share_proxy_settings', true);
        session_pref('network.proxy.type', 1);
        I.window.minibuffer.message("Socks using "+server+":"+port+" for this session");
        current_conkeror_proxy = "3rd-party proxy on "+server+":"+port;
        mode_line_mode(false);
        mode_line_mode(true);
        unregister_user_stylesheet(academic_proxy_style_sheet);
        unregister_user_stylesheet(home_proxy_style_sheet);
        register_user_stylesheet(third_proxy_style_sheet);
    });
define_key(content_buffer_normal_keymap,"C-u C-c p","third-localhost-proxy")


// remove proxy
// set up a proxy
interactive("remove-proxy", "Localhost proxy",
    function (I) {
        session_pref('network.proxy.share_proxy_settings', false);
        session_pref('network.proxy.type', 0);
        I.window.minibuffer.message("Removing Socks for this session");
        current_conkeror_proxy = "No proxy";
        mode_line_mode(false);
        mode_line_mode(true);
        // TODO: procedure to unregister all stylesheets
        // TODO: not highlighted in emacs conkeror mode...
        unregister_user_stylesheet(academic_proxy_style_sheet);
        unregister_user_stylesheet(home_proxy_style_sheet);
        unregister_user_stylesheet(third_proxy_style_sheet);
    });
define_key(content_buffer_normal_keymap,"C-c P","remove-proxy")

////////////////////////////////////////////////////////////////////////////////
// set up proxy modeline

function proxy_widget (window) {
    this.class_name = "proxy-widget";
    text_widget.call(this, window);
    // this.flex = "1";
    // this.crop = "end";
    this.add_hook("current_content_buffer_location_change_hook");
    this.add_hook("select_buffer_hook");
}
proxy_widget.prototype = {
    constructor: proxy_widget,
    __proto__: text_widget.prototype,
    update: function () {
        this.view.text = current_conkeror_proxy;
    }
};

////////////////////////////////////////////////////////////////////////////////
// find highlighted in google
// see http://conkeror.org/Tips#Selection_Searches
interactive("selection-search-google","Use current selection and search on Google.",
    "find-url-new-buffer",
    $browser_object = function (I) {
        return "google " + I.buffer.top_frame.getSelection();
    });
define_key(content_buffer_normal_keymap, "s-g", "selection-search-google")

interactive("selection-search-scholar","Use current selection and search on Google Scholar.",
    "find-url-new-buffer",
    $browser_object = function (I) {
        return "scholar " + I.buffer.top_frame.getSelection();
    });
define_key(content_buffer_normal_keymap, "s-s", "selection-search-scholar")

interactive("selection-search-wikipedia","Use current selection and search on Wikipedia.",
    "find-url-new-buffer",
    $browser_object = function (I) {
        return "wikipedia " + I.buffer.top_frame.getSelection();
    });
define_key(content_buffer_normal_keymap, "s-w", "selection-search-wikipedia")

////////////////////////////////////////////////////////////////////////////////
// find clipboard in google
interactive("clipboard-search-google","Use current clipboard and search on Google.",
    "find-url-new-buffer",
    $browser_object = function (I) {
        return "google " + read_from_clipboard();
    });
define_key(content_buffer_normal_keymap, "s-G", "clipboard-search-google")

// TODO: add others

////////////////////////////////////////////////////////////////////////////////
// misc

// copy all urls to clipboard as list
// TODO: and/or save to temp file
// generally meant to move to other programs
interactive("copy-all-urls", "Copy all URLs",
    function (I) {
        var urls="";
        for (var i = 0, nbuffers = I.window.buffers.count; i < nbuffers; i++ ) {
            urls = urls + "\n" + "[[" + I.window.buffers.get_buffer(i).display_uri_string + "]] -- " + I.window.buffers.get_buffer(i).document.title;
        }
        urls = urls + "\n";
        // I.window.minibuffer.message(urls);
        var gClipboardHelper = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper);
        gClipboardHelper.copyString(urls);
    });

// add to mode line hook during initialization, is there a more robust way?
if (!current_conkeror_proxy_init) {
    mode_line_mode(false);
    add_hook("mode_line_hook", mode_line_adder(proxy_widget));
    mode_line_mode(true);
}
var current_conkeror_proxy_init=true;

// fetch video as audio
interactive("fetch-video", "Fetch Video",
    function (I) {
        // TODO: why does --working-directory not work?
        var cmd_str = 'rxvt-unicode -cd "${HOME}/Documents" -e bash -i -c "youtube-dl --no-cache-dir ' + I.buffer.display_uri_string + ';wait;while read -r -t 0;do read -r; done;read -n 1 -s -r -p \'Press any key to continue...\'"'
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap,"C-c v","fetch-video");

// fetch video as audio
interactive("fetch-video-as-audio", "Fetch Video as audio",
    function (I) {
        // TODO: why does --working-directory not work?
        // TODO: default format
        var cmd_str = 'rxvt-unicode -cd "${HOME}/Documents" -e bash -i -c "youtube-dl --no-cache-dir --extract-audio --audio-format mp3 --audio-quality 9 ' + I.buffer.display_uri_string + ';wait;while read -r -t 0; do read -r; done;read -n 1 -s -r -p \'Press any key to continue...\'"'
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap,"C-c V","fetch-video-as-audio");

interactive("fetch-video-playlist-as-audio", "Fetch Video playlist as audio",
    function (I) {
        // TODO: why does --working-directory not work?
        // TODO: default format
        var cmd_str = 'rxvt-unicode -cd "${HOME}/Documents" -e bash -i -c "youtube-dl --no-cache-dir --extract-audio --output \'%(playlist_title)s/%(playlist_title)s-%(playlist_index)s-%(title)s-%(id)s.%(ext)s\' --audio-format mp3 --audio-quality 9 ' + I.buffer.display_uri_string + ';wait;while read -r -t 0; do read -r; done;read -n 1 -s -r -p \'Press any key to continue...\'"'
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap,"C-c M-v","fetch-video-playlist-as-audio");

// want C-c C-r to be restart
define_key(default_global_keymap, "C-c r", "reload-config");
////////////////////////////////////////
// open in firefox
interactive("open-firefox", "",
    function (I) {
        var theurl = transform_url_location(I.buffer,I.buffer.display_uri_string);
        var cmd_str = 'firefox -P default -new-tab "' + theurl + '"';
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap, "C-c f", "open-firefox");
// TODO: figure out C-u....
interactive("open-firefox-unsafe", "",
    function (I) {
        var theurl = transform_url_location(I.buffer,I.buffer.display_uri_string);
        var cmd_str = 'firefox -private -new-tab "' + theurl + '"';
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap, "C-u C-c f", "open-firefox-unsafe");
// open in firefox private
interactive("open-firefox-private", "",
    function (I) {
        var theurl = transform_url_location(I.buffer,I.buffer.display_uri_string);
        var cmd_str = 'firefox -P unsafe -new-tab "' + theurl + '"';
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap, "C-c x", "open-firefox-private");
////////////////////////////////////////
// chromium...
interactive("open-chromium", "",
    function (I) {
        // TODO: Can't auto-enable ad-blocker and avoid ads, I shred it enough that this is fine
        var theurl = transform_url_location(I.buffer,I.buffer.display_uri_string);
        var cmd_str = 'chromium "' + theurl + '"';
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap, "C-c g", "open-chromium");
interactive("open-chromium-ads-on", "",
    function (I) {
        // TODO: fix this....
        var theurl = transform_url_location(I.buffer,I.buffer.display_uri_string);
        var cmd_str = 'chromium --temp-profile "' + theurl + '"';
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap, "C-u C-c g", "open-chromium-ads-on");

// open in gnome-web
interactive("open-gnome-web", "",
    function (I) {
        // TODO: add transform url here
        var cmd_str = 'epiphany --new-tab "' + I.buffer.display_uri_string + '"';
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap, "C-c G", "open-gnome-web");

interactive("open-firefox-new-window", "",
    function (I) {
        var cmd_str = 'firefox -P default -new-window "' + I.buffer.display_uri_string + '"';
        shell_command_blind(cmd_str);
    });
// TODO is this the best way to do C-u?
define_key(content_buffer_normal_keymap, "C-u C-c f", "open-firefox-new-window");

// http://emacs-fu.blogspot.ca/2010/12/conkeror-web-browsing-emacs-way.html
// reload conkerorrc with C-c r
interactive("reload-config", "reload conkerorrc",
       function(I) {
          load_rc();
          I.window.minibuffer.message("config reloaded");
       });

// web video pause only
interactive("web-video-pause",
    "Pause Youtube videos (as opposed to pause/play of other thing).",
    function (I) {
        // get url, is this the best way?
        var theurl = load_spec_uri_string(load_spec(I.buffer.top_frame));
        if (theurl.indexOf("www.youtube.com") != -1) {
            // https://www.youtube.com/iframe_api
            var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
            player.pauseVideo()
        } else if (theurl.indexOf("twitch.tv") != -1 && theurl.indexOf("videos") != -1) {
            // https://openuserjs.org/scripts/flipperbw/Twitch_Hotkeys/source
            var player = I.buffer.document.getElementsByClassName('player-video')[0].getElementsByTagName('video')[0];
            player.pause();
        }
        // I.window.minibuffer.message(player.getDuration())
    });

interactive("web-video-play",
    "Pause Youtube videos (as opposed to pause/play of other thing).",
    function (I) {
        // get url, is this the best way?
        var theurl = load_spec_uri_string(load_spec(I.buffer.top_frame));
        if (theurl.indexOf("www.youtube.com") != -1) {
            // https://www.youtube.com/iframe_api
            var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
            player.playVideo()
        } else if (theurl.indexOf("twitch.tv") != -1 && theurl.indexOf("videos") != -1) {
            // https://openuserjs.org/scripts/flipperbw/Twitch_Hotkeys/source
            // TODO: only do for videos, live streams are only muted minimized or surfed away from
            var player = I.buffer.document.getElementsByClassName('player-video')[0].getElementsByTagName('video')[0];
            player.play();
        }
        // I.window.minibuffer.message(player.getDuration())
    });

interactive("web-video-pause-toggle",
    "Pause Youtube videos (as opposed to pause/play of other thing).",
    function (I) {
        var theurl = load_spec_uri_string(load_spec(I.buffer.top_frame));
        if (theurl.indexOf("www.youtube.com") != -1) {
            // https://www.youtube.com/iframe_api
            var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
            if (player.getPlayerState() == 1) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
        } else if (theurl.indexOf("twitch.tv") != -1  && theurl.indexOf("videos") != -1) {
            // https://openuserjs.org/scripts/flipperbw/Twitch_Hotkeys/source
            var player = I.buffer.document.getElementsByClassName('player-video')[0].getElementsByTagName('video')[0];
            var player_status = player.paused;
            if (player_status) {
                player.play();
            } else {
                player.pause();
            }
        }
        // I.window.minibuffer.message(player.getDuration())
    });


interactive("youtube-seek",
    "Seek to a youtube location.",
    function (I) {
        // TODO: do not use clipboard in future, communicate by temp file maybe
        var seek_location = parseFloat(read_from_clipboard())
        // https://www.youtube.com/iframe_api
        var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
        I.window.minibuffer.message("Seeking to: "+seek_location);
        player.seekTo(seek_location);
    });

// TODO: need a timeout on this, this may be an excessive way to do this
interactive("twitch-seek",
    "Seek to a twitch location.",
    function (I) {
        // TODO: do not use clipboard in future, communicate by temp file maybe
        var seek_location = parseFloat(read_from_clipboard())
        // https://openuserjs.org/scripts/flipperbw/Twitch_Hotkeys/source
        var player = I.buffer.document.getElementsByClassName('player-video')[0].getElementsByTagName('video')[0];
        // player.currentTime = seek_location;
        player.pause();
        sleep(1000.0);
        player.fastSeek(seek_location);
        sleep(1000.0);
        player.play();
    });

interactive("twitch-enumerate-api",
    "Enumerate API for twitch.  Clunky, but useful.",
    function (I) {
        // https://openuserjs.org/scripts/flipperbw/Twitch_Hotkeys/source
        var player = I.buffer.document.getElementsByClassName('player-video')[0].getElementsByTagName('video')[0];
        thestring = "";
        for (var p in player) {
            thestring+=(String(p) + " :: " + String(player[p]));
            thestring+="\n";
        }
        path = make_file('/home/akroshko/conkeror-debug.txt');
        write_text_file(path,thestring);
        // I.window.alert(String(thelist));
    });

interactive("youtube-previous",
    "Previous in a youtube playlist.",
    function (I) {
        // https://www.youtube.com/iframe_api
        var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
        player.previousVideo();
    });

interactive("youtube-next",
    "Next in youtube playlist.",
    function (I) {
        // https://www.youtube.com/iframe_api
        var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
        player.nextVideo();
    });

interactive("youtube-normalize-volume",
    "Set volume in youtube to a nice level.",
    function (I) {
        // https://www.youtube.com/iframe_api
        var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
        player.setVolume(40);
    });

interactive("youtube-enumerate-api",
    "Enumerate API in youtube.  Clunky, but useful.",
    function (I) {
        // https://www.youtube.com/iframe_api
        var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
        for (var p in player) {
            I.window.alert(p);
        }
    });

function transform_url_location (buffer,theurl) {
    // transform location of the url to include position for things like videos
    if ( theurl.indexOf("youtube.com") > -1 ) {
        return youtube_link_from_current_time(buffer,theurl);
    } else if ( theurl.indexOf("twitch.tv") != -1 && theurl.indexOf("videos") != -1) {
        return twitch_link_from_current_time(buffer,theurl);
    } else {
        return theurl;
    }
}

function youtube_link_from_current_time (buffer,url) {
    var current_time = youtube_get_currenttime(buffer);
    var current_time_integer=Math.floor(current_time);
    var theurl_stripped=url.replace(/&t=[0-9]*s?/g,"");
    return theurl_stripped+'&t='+String(current_time_integer);
}

function twitch_link_from_current_time (buffer,url) {
    // https://openuserjs.org/scripts/flipperbw/Twitch_Hotkeys/source
    // for testing...
    // https://www.twitch.tv/videos/212539340?collection=YeKb2LJQ6hQMpg
    // TODO: make a function
    var player = buffer.document.getElementsByClassName('player-video')[0].getElementsByTagName('video')[0];
    var current_time=player.currentTime;
    var hours=Math.floor(current_time/3600);
    var temptime=current_time - hours*3600;
    var minutes=Math.floor(temptime/60);
    var seconds=Math.floor(temptime - minutes*60);
    var timestring=integer_to_two_digit_string(hours) + 'h' + integer_to_two_digit_string(minutes) + 'm' + integer_to_two_digit_string(seconds) + 's';
    // convert to strings...
    // write_text_file_line(make_file(logdir+"conkeror-current-log.org"),get_now() + " [[" + theurl + "::" + String(current_time) + "][" + thetitle + "]]\n");
    // theurl_stripped=theurl.replace(/\?[0-9][0-9]h[0-9][0-9]m[0-9][0-9]s/,"");
    // TODO: strip off anything but ? until I know what's going on, figure out format of twitch urls with lots of options
    theurl_stripped=url.replace(/\?.*/,"");
    return (theurl_stripped + '?t=' + timestring);
}

// get youtube time
function youtube_get_currenttime (buffer) {
    // https://www.youtube.com/iframe_api
    var player = buffer.document.getElementById('movie_player').wrappedJSObject;
    return player.getCurrentTime()
};

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
