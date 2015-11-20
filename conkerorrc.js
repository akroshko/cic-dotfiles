// https://github.com/vedang/conkeror-rc/blob/master/README
homepage = "http://conkeror.org/";
load_paths.unshift("chrome://conkeror-contrib/content/");
// require('block-content-focus-change.js');
// hinting
hint_digits="abcdefghijklmnopqrstuvwxyz";
// hint_digits="asdfghjkl;";
register_user_stylesheet(
    "data:text/css," +
        escape(
            "@namespace url(\"http://www.w3.org/1999/xhtml\");\n" +
            "span.__conkeror_hint {\n"+
            "  font-size: 18px !important;\n"+
            "  line-height: 18px !important;\n"+
            "}"));
// standard keys
define_key(content_buffer_normal_keymap, "C-[", "unfocus");
define_key(content_buffer_normal_keymap, "s-z", "unfocus");
// define_key(content_buffer_normal_keymap, "s-f", "follow-new-buffer");
define_key(content_buffer_normal_keymap, "s-l f", "follow-new-buffer");
define_key(content_buffer_normal_keymap, "s-l B", "back");
// define_key(content_buffer_normal_keymap, "s-B", "back");
// define_key(content_buffer_normal_keymap, "s-l", "back");
// define_key(content_buffer_normal_keymap, "s-g", "find-url");
define_key(content_buffer_normal_keymap, "s-l g", "find-url");
define_key(content_buffer_normal_keymap, "s-space", "cmd_scrollPageDown");
// TODO: do I still want this?
define_key(content_buffer_normal_keymap, "C-u f", "follow-new-buffer");
define_key(content_buffer_normal_keymap, "b", "follow-new-buffer-background");
define_key(content_buffer_normal_keymap, "s-b", "follow-new-buffer-background");
// emergency key to kill buffer quickly
define_key(content_buffer_normal_keymap, "f4", "kill-buffer");
// key redefines
define_key(content_buffer_normal_keymap, "s-]", "buffer-next");
define_key(content_buffer_normal_keymap, "s-[", "buffer-previous");

// url
url_completion_use_bookmarks = false;
url_completion_use_history = false;
url_completion_use_webjumps = true;
url_remoting_fn = load_url_in_new_window;
// url_remoting_fn = load_url_in_new_buffer;
// url_remoting_fn = load_url_in_current_buffer;
// session preferences
// fonts
session_pref("font.minimum-size.x-western", 11);
session_pref("font.size.x-western", 11);
session_pref("font.size.variable.x-western", 11);
// ???
session_pref("xpinstall.whitelist.required", false);
session_pref("browser.history_expire_days",1);
// session_pref("browser.download.manager.retention",1)
// TODO do any of these actually work?
session_pref("browser.display.show_image_placeholders",false);
session_pref("browser.formfill.enable",false);
session_pref("gfx.font_rendering.directwrite.enabled",true);
session_pref("mozilla.widget.render-mode",6);
session_pref("network.prefetch-next",true);
session_pref("network.http.max-persistent-connections-per-server",8);
session_pref("network.http.pipelining",true);
session_pref("network.http.pipelining.maxrequests",8);
session_pref("network.dns.disableIPv6",true);
session_pref("privacy.clearOnShutdown.cache",true);
session_pref("privacy.clearOnShutdown.cookies",true);
session_pref("privacy.clearOnShutdown.downloads",true);
session_pref("privacy.clearOnShutdown.formdata",true);
session_pref("privacy.clearOnShutdown.history",true);
session_pref("privacy.clearOnShutdown.offlineApps",true);
session_pref("privacy.clearOnShutdown.passwords",true);
session_pref("privacy.clearOnShutdown.sessions",true);
session_pref("privacy.clearOnShutdown.siteSettings",true);
session_pref("privacy.sanitize.sanitizeOnShutdown",true);

// Adblock Plus
// http://conkeror.org/AdblockPlus
require("extensions/adblockplus.js");

// duplicate buffer
interactive("duplicate-buffer", "Duplicate buffer",
            function (I) {
                browser_object_follow(I.buffer, OPEN_NEW_BUFFER, I.buffer.current_uri.spec);
            });
define_key(content_buffer_normal_keymap, "d", "duplicate-buffer");
define_key(content_buffer_normal_keymap, "M-d", "duplicate-buffer");

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

////////////////////////////////////////////////////////////////////////////////
// proxies
// I use port localhost:18122 as a proxy to my University for accademic journals
//       port localhost:18222 as a proxy back to my home
//       port localhost:18322 as a proxy to other third party providers
var current_conkeror_proxy = "No proxy";
// var current_conkeror_proxy_init=null;

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
    });
define_key(content_buffer_normal_keymap,"C-c p","academic-localhost-proxy")

// home proxy
interactive("home-localhost-proxy", "Home Localhost proxy",
    function (I) {
        server = 'localhost';
        port=18222;
        session_pref('network.proxy.socks', server);
        session_pref('network.proxy.socks_port', port);
        session_pref('network.proxy.share_proxy_settings', true);
        session_pref('network.proxy.type', 1);
        I.window.minibuffer.message("Socks using "+server+":"+port+" for this session");
        current_conkeror_proxy = "Home proxy on "+server+":"+port;
        mode_line_mode(false);
        mode_line_mode(true);
    });
define_key(content_buffer_normal_keymap,"C-c C-p","home-localhost-proxy")

// set up a proxy
// 3rd party proxy
interactive("third-localhost-proxy", "Third party localhost proxy",
    function (I) {
        server = 'localhost';
        port=18322;
        session_pref('network.proxy.socks', server);
        session_pref('network.proxy.socks_port', port);
        session_pref('network.proxy.share_proxy_settings', true);
        session_pref('network.proxy.type', 1);
        I.window.minibuffer.message("Socks using "+server+":"+port+" for this session");
        current_conkeror_proxy = "3rd-party proxy on "+server+":"+port;
        mode_line_mode(false);
        mode_line_mode(true);
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
        var cmd_str = 'gnome-terminal --working-directory="~/Documents" --execute bash -c "youtube-dl --no-cache-dir ' + I.buffer.display_uri_string + '; read -p \'Press [Enter] to continue...\'"'
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap,"C-c v","fetch-video");

// fetch video as audio
interactive("fetch-video-as-audio", "Fetch Video as audio",
    function (I) {
        var cmd_str = 'gnome-terminal --working-directory="~/Documents" --execute bash -c "youtube-dl --no-cache-dir --extract-audio --audio-format mp3 ' + I.buffer.display_uri_string + '; read -p \'Press [Enter] to continue...\'"'
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap,"C-c V","fetch-video-as-audio");

// want C-c C-r to be restart
define_key(default_global_keymap, "C-c r", "reload-config");
// open in firefox
interactive("open-firefox", "",
            function (I) {
                var cmd_str = 'firefox -new-tab "' + I.buffer.display_uri_string + '"';
                shell_command_blind(cmd_str);
});
define_key(content_buffer_normal_keymap, "C-c f", "open-firefox");
// open in gnome-web
interactive("open-gnome-web", "",
            function (I) {
                var cmd_str = 'epiphany --new-tab "' + I.buffer.display_uri_string + '"';
                shell_command_blind(cmd_str);
});
define_key(content_buffer_normal_keymap, "C-c g", "open-gnome-web");
interactive("open-firefox-new-window", "",
            function (I) {
                // var cmd_str = 'cmd /C start /B firefox -new-window "' + I.buffer.display_uri_string + '"';
                var cmd_str = 'firefox -new-window "' + I.buffer.display_uri_string + '"';
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
       }
    );

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
