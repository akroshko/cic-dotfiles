// https://github.com/vedang/conkeror-rc/blob/master/README
homepage = "http://conkeror.org/";
load_paths.unshift("chrome://conkeror-contrib/content/");
// TODO: uncomment?
// require('block-content-focus-change.js');
// hinting

hint_digits="abcdefghijklmnopqrstuvwxyz";
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
// TODO: try to do this in single key
define_key(content_buffer_normal_keymap, "s-a",
           "browser-object-relationship-next",
           $repeat = "follow-unfocus")
interactive("follow-unfocus","Follow and unfocus.",
    function (I) {
        yield follow(I, OPEN_CURRENT_BUFFER);
        // removing this for now
        unfocus(I.window, I.buffer);
    });

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
define_key(content_buffer_normal_keymap, "C-]", "local-print-buffer");
// TODO: trying both of these for now
define_key(content_buffer_normal_keymap, "M-z", "unfocus");
define_key(content_buffer_normal_keymap, "s-v", "unfocus");
// TODO: not sure if this is best
define_key(content_buffer_normal_keymap, "s-f", "follow-new-buffer");
// TODO: back without keycord?
define_key(content_buffer_normal_keymap, "s-b", "back");
define_key(content_buffer_normal_keymap, "s-c", "back");
define_key(content_buffer_normal_keymap, "s-l", "back");
// define_key(content_buffer_normal_keymap, "s-g",   "find-url");
// define_key(content_buffer_normal_keymap, "s-l g", "find-url");
define_key(content_buffer_normal_keymap, "b", "follow-new-buffer-background");
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
// TODO: something slightly more consistent
define_key(content_buffer_normal_keymap, "d",   "duplicate-buffer");
define_key(content_buffer_normal_keymap, "M-d", "duplicate-buffer");
// new window
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

// scroll
define_key(content_buffer_normal_keymap, "C-,",   "cmd_scrollPageUp");
define_key(content_buffer_normal_keymap, "C-.",   "cmd_scrollPageDown");
define_key(content_buffer_normal_keymap, "M-,",   "cmd_scrollPageUp");
define_key(content_buffer_normal_keymap, "M-.",   "cmd_scrollPageDown");
define_key(content_buffer_normal_keymap, "s-S-z", "cmd_scrollPageUp");
define_key(content_buffer_normal_keymap, "s-z",   "cmd_scrollPageDown");

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
session_pref("full-screen-api.enabled",true);
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
// this actually works!!! can impose options on conkeror!
// session_pref("print.always_print_silent", true);
// session_pref("print.print_to_file","");
// session_pref("print.print_to_filename","");
// deactivate page modes
page_mode_deactivate(youtube_player_mode);

// Adblock Plus
// http://conkeror.org/AdblockPlus
require("extensions/adblockplus.js");

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
define_webjump("abebooks","https://www.abebooks.com/Canada/");
define_webjump("alberta-firehazard","http://wildfire.alberta.ca/fire-danger-forecasts/images/firehaz.gif");
define_webjump("alternativeto","https://alternativeto.net/software/%s",$alternative="https://alternativeto.net");
define_webjump("amazon", "https://www.amazon.com/exec/obidos/external-search/?field-keywords=%s&mode=blended", $alternative="https://amazon.com");
define_webjump("amazonca","https://www.amazon.ca/exec/obidos/external-search/?field-keywords=%s&mode=blended", $alternative="https://amazon.ca");
define_webjump("amsaut","http://www.ams.org/mathscinet/search/publications.html?pg4=AUCN&s4=%s&co4=AND&pg5=TI&s5=&co5=AND&pg6=PC&s6=&co6=AND&pg7=ALLF&s7=&co7=AND&dr=all&yrop=eq&arg3=&yearRangeFirst=&yearRangeSecond=&pg8=ET&s8=All&review_format=html&Submit=Search", $alternative="http://www.ams.org/mathscinet/");
define_webjump("amskey","http://www.ams.org/mathscinet/search/publications.html?pg4=AUCN&s4=&co4=AND&pg5=TI&s5=&co5=AND&pg6=PC&s6=&co6=AND&pg7=ALLF&s7=%s&co7=AND&dr=all&yrop=eq&arg3=&yearRangeFirst=&yearRangeSecond=&pg8=ET&s8=All&review_format=html&Submit=Search",$alternative="http://www.ams.org/mathscinet/");
define_webjump("amstit","http://www.ams.org/mathscinet/search/publications.html?pg4=AUCN&s4=&co4=AND&pg5=TI&s5=%s&co5=AND&pg6=PC&s6=&co6=AND&pg7=ALLF&s7=&co7=AND&dr=all&yrop=eq&arg3=&yearRangeFirst=&yearRangeSecond=&pg8=ET&s8=All&review_format=html&Submit=Search",$alternative="http://www.ams.org/mathscinet/");
define_webjump("anandtech","http://www.anandtech.com/");
define_webjump("archwiki","https://wiki.archlinux.org/index.php?title=Special%3ASearch&search=%s&go=Go", $alternative="https://wiki.archlinux.org");
define_webjump("arstechnica","https://arstechnica.com");
define_webjump("bc-firehazard","http://www2.gov.bc.ca/gov/content/safety/wildfire-status/fire-danger");
define_webjump("bee","http://www.be-electronics.com/");
define_webjump("books", "https://www.google.com/search?q=%s&tbm=bks", $alternative = "https://books.google.com/");
define_webjump("budget-bytes", "http://www.budgetbytes.com");
// TODO: add some non-search things here
define_webjump("canada-firehazard","http://cwfis.cfs.nrcan.gc.ca/maps/fw");
define_webjump("ctan-all", "https://www.ctan.org/search/?search=%s&search_type=description&search_type=filename&search_type=id",$alternative="https://www.ctan.org");
define_webjump("ctan-description", "https://www.ctan.org/search/?search=%s&search_type=description",$alternative="https://www.ctan.org");
define_webjump("ctan-filename", "https://www.ctan.org/search/?search=%s&search_type=filename",$alternative="https://www.ctan.org");
define_webjump("ctan-package", "https://www.ctan.org/search/?search=%s&search_type=id",$alternative="https://www.ctan.org");
define_webjump("dictionary","http://dictionary.reference.com/browse/%s");
define_webjump("digikey","http://www.digikey.ca/");
define_webjump("duckduckgo","https://duckduckgo.com/?q=%s",$alternative="https://duckduckgo.com");
define_webjump("emacswiki",
    "https://www.google.com/cse?cx=004774160799092323420%3A6-ff2s0o6yi"+
        "&q=%s&sa=Search&siteurl=emacswiki.org%2F",
    $alternative="https://www.emacswiki.org/");
// TODO: uses invalid security certificate
define_webjump("encyclopedia","http://www.reference.com/browse/%s",$alternative="http://www.reference.com");
define_webjump("epicurious","https://www.epicurious.com/tools/searchresults?search=%s",$alternative="https://www.epicurious.com");
define_webjump("extremetech","http://extremetech.com");
define_webjump("facebook","https://www.facebook.com/search/results.php?q=%s&init=quick",$alternative="https://www.facebook.com");
define_webjump("fivethirtyeight","http://fivethirtyeight.com");
define_webjump("flickr", "https://www.flickr.com/search/?q=%s", $alternative="https://www.flickr.com");
define_webjump("flotrack","http://www.flotrack.org");
define_webjump("github", "https://github.com/");
define_webjump("gmail", "https://mail.google.com/");
define_webjump("gnuplot", "http://www.gnuplot.info");
define_webjump("googleimages", "http://www.google.com/images?q=%s&safe=off", $alternative = "https://www.google.com/imghp?as_q=&safe=off");
define_webjump("googlescholar", "http://scholar.google.com/scholar?q=%s", $alternative = "https://scholar.google.com");
define_webjump("hackaday", "https://hackaday.com/");
define_webjump("hackerboards", "http://hackerboards.com");
define_webjump("hothardware","http://hothardware.com");
// does not appear to have acceptable webjump
define_webjump("instagram", "https://instagram.com/");
define_webjump("letsrun","http://letsrun.com");
define_webjump("linuxtoday","http://linuxtoday.com");
define_webjump("lwn","https://lwn.net");
define_webjump("lxer","http://lxer.com");
define_webjump("matplotlib","http://matplotlib.org/search.html?q=%s&check_keywords=yes&area=default",$alternative="http://matplotlib.org");
define_webjump("ncix","http://www.ncix.com/search/?categoryid=0&q=%s",$alternative="http://www.ncix.com");
// TODO: uses invalid security certificate
define_webjump("newegg","http://www.newegg.ca/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description=%s",$alternative="http://newegg.ca");
define_webjump("ohloh", "https://www.ohloh.net/p?query=%s",$alternative="https://www.ohloh.net");
define_webjump("otv", "https://otvtech.ca");
define_webjump("phoronix", "https://phoronix.com");
define_webjump("physorg", "http://phys.org");
define_webjump("plus","https://plus.google.com/");
define_webjump("pypi","https://pypi.python.org/pypi?%3Aaction=search&term=%s&submit=search",$alternative="https://pypi.python.org");
define_webjump("python", "https://docs.python.org/2.7/search.html?q=%s",$alternative="https://docs.python.org/2.7/");
define_webjump("theregister","http://www.theregister.co.uk/");
define_webjump("skyandtelescope","http://www.skyandtelescope.com");
define_webjump("sage","http://sagemath.org")
define_webjump("sage-sym","http://doc.sagemath.org/html/en/reference/calculus/sage/symbolic/expression.html")
define_webjump("sciencedaily","http://sciencedaily.com")
// TODO: uses invalid security certificate
define_webjump("slashdot","http://www.slashdot.com");
define_webjump("stackoverflow","https://stackoverflow.com/search?q=%s", $alternative="https://stackoverflow.com");
define_webjump("startpage","https://startpage.com/do/%s",$alternative="https://startpage.com");
define_webjump("strategypage","https://strategypage.com");
define_webjump("strava","https://strava.com");
define_webjump("stackexchange-math","https://math.stackexchange.com/search?q=%s",$alternative="https://math.stackexchange.com");
define_webjump("stackexchange-superuser","https://superuser.com/search?q=%s",$alternative="https://superuser.com/");
define_webjump("stackexchange-tex","https://tex.stackexchange.com/search?q=%s",$alternative="https://tex.stackexchange.com");
define_webjump("stackexchange-unix","https://unix.stackexchange.com/search?q=%s",$alternative="https://unix.stackexchange.com");
define_webjump("runningfree","http://www.runningfree.com/");
define_webjump("thesaurus","http://thesaurus.reference.com/browse/%s",$alternative="http://thesaurus.reference.com");
define_webjump("tigerdirect","http://www.tigerdirect.ca/applications/SearchTools/search.asp?keywords=%s",$alternative="http://www.tigerdirect.ca");
define_webjump("twitter","https://twitter.com/search?q=%s&src=typd",$alternative="https://twitter.com");
define_webjump("universetoday", "http://www.universetoday.com");
define_webjump("orgmode","https://www.google.com/cse?cx=002987994228320350715%3Az4glpcrritm&q=%s&sa=Search&siteurl=orgmode.org%2Fworg",$alternative="http://orgmode.org/worg/");
// TODO: set up search
define_webjump("bsdnow","https://bsdnow.tv");
define_webjump("undeadly","http://undeadly.org");
define_webjump("webofscience","https://apps.webofknowledge.com/");
define_webjump("youtube", "https://www.youtube.com/results?search_query=%s&search=Search",$alternative="https://www.youtube.com/feed/subscriptions");
define_webjump("youtube-user", "https://youtube.com/profile_videos?user=%s",$alternative="https://www.youtube.com/feed/subscriptions");
// local stuff here because it's useful
define_webjump("library-usask","https://sundog.usask.ca/search/a?searchtype=Y&SORT=D&searcharg=%s&searchscope=8&called_from=catalogue_home_tab",$alternative="https://library.usask.ca/");
define_webjump("library-saskatoon","http://www.saskatoonlibrary.ca/");
define_webjump("calgary-timeanddate","https://www.timeanddate.com/worldclock/city.html?n=55");
define_webjump("calgary-weathernetwork","http://www.theweathernetwork.com/weather/canada/alberta/calgary");
define_webjump("calgary-weatheroffice","http://www.weatheroffice.gc.ca/city/pages/ab-52_metric_e.html");
define_webjump("sundre-weatheroffice","http://www.weatheroffice.gc.ca/city/pages/ab-53_metric_e.html");
define_webjump("sundre-weathernetwork","http://www.theweathernetwork.com/weather/canada/alberta/sundre");
define_webjump("saskatchewan-firehazard","http://www.environment.gov.sk.ca/fire");
define_webjump("saskatoon-timeanddate","https://www.timeanddate.com/worldclock/city.html?n=1227");
define_webjump("saskatoon-weathernetwork","http://www.theweathernetwork.com/weather/canada/saskatchewan/saskatoon");
define_webjump("saskatoon-weatheroffice","http://www.weatheroffice.gc.ca/city/pages/sk-40_metric_e.html");
define_webjump("weathernetwork","http://www.theweathernetwork.com/");
define_webjump("weathernetwork-calgary","http://www.theweathernetwork.com/weather/canada/alberta/calgary");
define_webjump("weathernetwork-saskatoon","http://www.theweathernetwork.com/weather/canada/saskatchewan/saskatoon");
define_webjump("weathernetwork-sundre","http://www.theweathernetwork.com/weather/canada/alberta/sundre");
define_webjump("weatheroffice","http://www.weatheroffice.gc.ca/canada_e.html");
define_webjump("weatheroffice-calgary","http://www.weatheroffice.gc.ca/city/pages/ab-52_metric_e.html");
define_webjump("weatheroffice-saskatoon","http://www.weatheroffice.gc.ca/city/pages/sk-40_metric_e.html");
define_webjump("weatheroffice-sundre","http://www.weatheroffice.gc.ca/city/pages/ab-53_metric_e.html");
define_webjump("timeanddate","https://www.timeanddate.com/search/results.html?query=%s");
define_webjump("timeanddate-calgary","https://www.timeanddate.com/worldclock/city.html?n=55");
define_webjump("timeanddate-saskatoon","https://www.timeanddate.com/worldclock/city.html?n=1227");

// use your web browser for system admin
// TODO: may need to be https for some people
define_webjump("local-router", "http://192.168.0.1");
define_webjump("local-cups",   "http://localhost:631");

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
        port=18123;
        session_pref('network.proxy.socks', server);
        session_pref('network.proxy.socks_port', port);
        session_pref('network.proxy.share_proxy_settings', true);
        session_pref('network.proxy.type', 1);
        I.window.minibuffer.message("Socks using "+server+":"+port+" for this session");
        current_conkeror_proxy = "Home proxy on "+server+":"+port;
        mode_line_mode(false);
        mode_line_mode(true);
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
        var cmd_str = 'rxvt-unicode -cd "${HOME}/Documents" -e bash -i -c "(youtube-dl --no-cache-dir ' + I.buffer.display_uri_string + ');while read -r -t 0;do read -r; done;read -p \'Press [Enter] to continue...\'"'
        shell_command_blind(cmd_str);
    });
define_key(content_buffer_normal_keymap,"C-c v","fetch-video");

// fetch video as audio
interactive("fetch-video-as-audio", "Fetch Video as audio",
    function (I) {
        // TODO: why does --working-directory not work?
        var cmd_str = 'rxvt-unicode -cd "${HOME}/Documents" -e bash -i -c "(youtube-dl --no-cache-dir --extract-audio --audio-format mp3 ' + I.buffer.display_uri_string + ');while read -r -t 0; do read -r; done;read -p \'Press [Enter] to continue...\'"'
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
// open in firefox private
interactive("open-firefox-private", "",
    function (I) {
        var cmd_str = 'firefox -private -new-tab "' + I.buffer.display_uri_string + '"';
        shell_command_blind(cmd_str);
});
define_key(content_buffer_normal_keymap, "C-c x", "open-firefox-private");
interactive("open-chromium", "",
    function (I) {
        var cmd_str = 'chromium "' + I.buffer.display_uri_string + '"';
        shell_command_blind(cmd_str);
});
define_key(content_buffer_normal_keymap, "C-c g", "open-chromium");
// open in gnome-web
interactive("open-gnome-web", "",
    function (I) {
        var cmd_str = 'epiphany --new-tab "' + I.buffer.display_uri_string + '"';
        shell_command_blind(cmd_str);
});
define_key(content_buffer_normal_keymap, "C-c G", "open-gnome-web");

interactive("open-firefox-new-window", "",
    function (I) {
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

// Youtube
interactive("youtube-pause",
    "Pause Youtube videos (as opposed to pause/play of other thing).",
    function (I) {
        src = "https://www.youtube.com/iframe_api";
        var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
        player.pauseVideo()
        // I.window.minibuffer.message(player.getDuration())
    });

interactive("youtube-play",
    "Pause Youtube videos (as opposed to pause/play of other thing).",
    function (I) {
        src = "https://www.youtube.com/iframe_api";
        var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
        player.playVideo()
        // I.window.minibuffer.message(player.getDuration())
    });

interactive("youtube-seek",
    "Seek to a youtube location.",
    function (I) {
        src = "https://www.youtube.com/iframe_api";
        var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
        var seek_location = parseFloat(read_from_clipboard())
        I.window.minibuffer.message("Seeking to: "+seek_location);
        player.seekTo(seek_location)
    });

interactive("youtube-previous",
    "Previous in a youtube playlist.",
    function (I) {
        src = "https://www.youtube.com/iframe_api";
        var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
        player.previousVideo();
    });

interactive("youtube-next",
    "Next in youtube playlist.",
    function (I) {
        src = "https://www.youtube.com/iframe_api";
        var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
        player.nextVideo();
    });

interactive("youtube-normalize-volume",
    "Set volume in youtube to a nice level.",
    function (I) {
        src = "https://www.youtube.com/iframe_api";
        var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
        player.setVolume(40);
    });

// get youtube time
function youtube_get_currenttime (I) {
        src = "https://www.youtube.com/iframe_api";
        var player = I.buffer.document.getElementById('movie_player').wrappedJSObject;
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
