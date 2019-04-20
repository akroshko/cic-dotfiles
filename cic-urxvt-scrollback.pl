#! perl -w
# Author:   Andrew Kroshko 2017-2019
# Created:  Sun Nov 19, 2017
# Version:  20190411
# Website:  https://github.com/akroshko/cic-dotfiles
# License:  GPLv2

########################################
########## Original copyright ##########
#    Author:   Bert Muennich
#    Website:  http://www.github.com/muennich/urxvt-perls
#    License:  GPLv2

# Use keyboard shortcuts to copy the selection to the clipboard and to paste
# the clipboard contents (optionally escaping all special characters).
# Requires xsel to be installed!

# Usage: put the following lines in your .Xdefaults/.Xresources:
#   URxvt.perl-ext-common: ...,clipboard
#   URxvt.keysym.M-c:   perl:clipboard:copy
#   URxvt.keysym.M-v:   perl:clipboard:paste
#   URxvt.keysym.M-C-v: perl:clipboard:paste_escaped

# Options:
#   URxvt.clipboard.autocopy: If true, PRIMARY overwrites clipboard

# You can also overwrite the system commands to use for copying/pasting.
# The default ones are:
#   URxvt.clipboard.copycmd:  xsel -ib
#   URxvt.clipboard.pastecmd: xsel -ob
# If you prefer xclip, then put these lines in your .Xdefaults/.Xresources:
#   URxvt.clipboard.copycmd:  xclip -i -selection clipboard
#   URxvt.clipboard.pastecmd: xclip -o -selection clipboard
# On Mac OS X, put these lines in your .Xdefaults/.Xresources:
#   URxvt.clipboard.copycmd:  pbcopy
#   URxvt.clipboard.pastecmd: pbpaste

# The use of the functions should be self-explanatory!

use strict;
use warnings;

sub on_start {
    my ($self) = @_;

    $self->{save_scrollback} = $self->x_resource('scrollback:save');

    ()
}

# taken from rxvt-unicode provided remote-clipboard extension that has no copyright notice
# TODO: I need a library for this
# TODO: it is slightly annoying to put the message in top-left corner
#        but better for the HD-width terminals I often run
sub msg {
   my ($self, $msg) = @_;

   # my $ov = $self->overlay (-1, 0, $self->strwidth ($msg), 1, urxvt::OVERLAY_RSTYLE, 0);
   my $ov = $self->overlay (0, 0, $self->strwidth ($msg), 1, urxvt::OVERLAY_RSTYLE, 0);
   $ov->set (0, 0, $msg);
   # TODO: this seems to be after command is run, rather than after msg is called
   #       still needs more diagnosis
   # ->after (5)
   my $msgtime = time();
   $self->{msg} =
      urxvt::timer
              ->new
              ->set ($msgtime,5)
              ->cb (sub { delete $self->{msg}; undef $ov; });
}

# now figure out how to do scrollback
# $topmost_scrollback_row = $term->top_row

sub save_scrollback {
    my ($self) = @_;

    # create a datestamp
    (my $sec,my $min,my $hour,my $mday,my $mon,my $year,my $wday,my $yday,my $isdst) = localtime();
    # y2k+100 problem
    my $year_number=1900+$year;
    my $mon_number=$mon+1;
    my $timestamp = sprintf("%04d%02d%02d%02d%02d%02d", $year_number, $mon_number, $mday, $hour, $min, $sec);

    # TODO: might want to use tempfile.... but this fine for now
    my $filename=$ENV{"HOME"} . "/tmp/collect/urxvt-$timestamp" . ".txt";

    my $row = $self->top_row;
    my $notfirst = 0;
    open(my $fh,'>',$filename);
    while ($row <= $self->nrow) {
        # TODO: eventually capture long lines like this
        # my $line = $self->line ($row)
        #     or last;
        my $line = $self->ROW_t ($row)
            or last;
        if ($notfirst) {
            print $fh "\n";
        } else {
            $notfirst = 1;
        }
        # TODO: for getting long lines all at once
        # my $text = $line->t;
        my $text = $line;
        print $fh $text;
        $row = $row + 1;
    }
    # get rid of trailing newline
    close $fh;
    $self->msg ("Successfully captured scrollback to " . $filename);

    ()
}

sub save_scrollback_emacs {
    my ($self) = @_;

    # create a datestamp
    (my $sec,my $min,my $hour,my $mday,my $mon,my $year,my $wday,my $yday,my $isdst) = localtime();
    # y2k+100 problem
    my $year_number=1900+$year;
    my $mon_number=$mon+1;
    my $timestamp = sprintf("%04d%02d%02d%02d%02d%02d", $year_number, $mon_number, $mday, $hour, $min, $sec);

    # TODO: might want to use tempfile.... but this fine for now
    my $filename=$ENV{"HOME"} . "/tmp/collect/urxvt-$timestamp" . ".txt";

    my $row = $self->top_row;
    my $notfirst = 0;
    open(my $fh,'>',$filename);
    while ($row <= $self->nrow) {
        # TODO: eventually capture long lines like this
        # my $line = $self->line ($row)
        #     or last;
        my $line = $self->ROW_t ($row)
            or last;
        if ($notfirst) {
            print $fh "\n";
        } else {
            $notfirst = 1;
        }
        # TODO: for getting long lines all at once
        # my $text = $line->t;
        my $text = $line;
        print $fh $text;
        $row = $row + 1;
    }
    # get rid of trailing newline
    close $fh;
    # XXXX: requires launch-emacsclient script in place
    # run shell command to read it into emacs
    my $emacs_command = $ENV{"HOME"} . "/bin/launch-emacsclient";
    $self->msg ("Capturing scrollback to emacs");
    system($emacs_command,"noframe","--eval","(cic:capture-rxvt-scrollback \"$filename\")");
    $self->msg ("Successfully captured scrollback to emacs");

    ()
}

sub on_action {
    my ($self, $action) = @_;

    on_user_command($self, "scrollback:" . $action);
}

sub on_user_command {
	my ($self, $cmd) = @_;

	if ($cmd eq "scrollback:save") {
	   $self->save_scrollback;
	}
	if ($cmd eq "scrollback:save_emacs") {
	   $self->save_scrollback_emacs;
	}

	()
}
