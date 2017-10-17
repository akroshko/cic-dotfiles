#! perl -w
# Author:   Bert Muennich
# Website:  http://www.github.com/muennich/urxvt-perls
# License:  GPLv2

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

# now figure out how to do scrollback
# $topmost_scrollback_row = $term->top_row

sub save_scrollback {
    my ($self) = @_;

    # TODO: where to start
    my $row = $self->top_row;
    # TODO: create string...
    my $scrollback = '';
    # print "===================="  . "\n";
    # print $row . "\n";
    # print $self->top_row . "\n";
    # print $self->nrow . "\n";
    # print "===================="  . "\n";
    while ($row <= $self->nrow) {
        my $line = $self->line ($row)
            or last;
        my $text = $line->t;
        # concat to string
        $scrollback = $scrollback . $text. "\n";
        $row = $row + 1;
        # print $row . "\n";

    }
    # get rid of trailing newline
    chomp($scrollback);
    # create a datestamp and add it
    # TODO: create directory if not exist
    # system("bash", "-c", "cat > $HOME/tmp/collect/urxvt-$(date +%Y%m%d%H%M%S)");
    (my $sec,my $min,my $hour,my $mday,my $mon,my $year,my $wday,my $yday,my $isdst) = localtime();
    # y2k+100 problem
    my $year_number=1900+$year;
    my $mon_number=$mon+1;
    my $timestamp = "$year_number$mon_number$mday$hour$min$sec";
    my $filename=$ENV{"HOME"} . "/tmp/collect/urxvt-$timestamp" . ".txt";
    open(my $fh,'>',$filename);
    print $fh $scrollback;
    close $fh;

    ()
}

sub save_scrollback_emacs {
    my ($self) = @_;

    # TODO: where to start
    my $row = $self->top_row;
    # TODO: create string...
    my $scrollback = '';
    # print "===================="  . "\n";
    # print $row . "\n";
    # print $self->top_row . "\n";
    # print $self->nrow . "\n";
    # print "===================="  . "\n";
    while ($row <= $self->nrow) {
        my $line = $self->line ($row)
            or last;
        my $text = $line->t;
        # concat to string
        $scrollback = $scrollback . $text. "\n";
        $row = $row + 1;
        # print $row . "\n";

    }
    # get rid of trailing newline
    chomp($scrollback);
    # create a datestamp and add it
    # TODO: create directory if not exist
    # system("bash", "-c", "cat > $HOME/tmp/collect/urxvt-$(date +%Y%m%d%H%M%S)");
    (my $sec,my $min,my $hour,my $mday,my $mon,my $year,my $wday,my $yday,my $isdst) = localtime();
    # y2k+100 problem
    my $year_number=1900+$year;
    my $mon_number=$mon+1;
    my $timestamp = "$year_number$mon_number$mday$hour$min$sec";

    # TODO: might want to use tempfile.... but this fine
    my $filename=$ENV{"HOME"} . "/tmp/collect/urxvt-$timestamp" . ".txt";
    open(my $fh,'>',$filename);
    print $fh $scrollback;
    close $fh;

    # XXXX: requires launch-emacsclient script in place
    # run shell command to read it into emacs
    my $emacs_command = $ENV{"HOME"} . "/bin/launch-emacsclient";
    system($emacs_command,"noframe","--eval","(cic:capture-rxvt-scrollback \"$filename\")");

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
