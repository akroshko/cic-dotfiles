#! perl -w
# Copyright (C) 2018, Andrew Kroshko, all rights reserved.
#
# Author: Andrew Kroshko
# Maintainer: Andrew Kroshko <akroshko.public+devel@gmail.com>
# Created: Fri Jan 5, 2018
# Version: 20180302
# URL: https://github.com/akroshko/dotfiles-stdlib
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or (at
# your option) any later version.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see http://www.gnu.org/licenses/.
#
# Open new terminal in current directory, works even if a command is
# running.

use strict;
use warnings;

use Proc::ProcessTable;

sub on_start {
    my ($self) = @_;

    $self->{open_new_terminal} = $self->x_resource('new:terminal');

    ()
}

# source described elsewhere, used for debugging here
sub msg {
   my ($self, $msg) = @_;

   # my $ov = $self->overlay (-1, 0, $self->strwidth ($msg), 1, urxvt::OVERLAY_RSTYLE, 0);
   my $ov = $self->overlay (0, 0, $self->strwidth ($msg), 1, urxvt::OVERLAY_RSTYLE, 0);
   $ov->set (0, 0, $msg);

   $self->{msg} =
      urxvt::timer
              ->new
              ->after (5)
              ->cb (sub { delete $self->{msg}; undef $ov; });
}

sub get_shell_pid () {
    my ($self) = @_;
    # http://search.cpan.org/~durist/Proc-ProcessTable-0.39/ProcessTable.pm
    # find process with the current process as parent
    my $t = new Proc::ProcessTable( 'cache_ttys' => 1 );
    foreach my $p ( @{$t->table} ){
        if ($p->ppid == $$) {
            # check if it is bash
            if (index("bash",$p->cmndline) != -1) {
                # just return on first bash for now
                return $p->pid;
            }
        }
    }
    ()
}


sub open_new_terminal {
    my ($self) = @_;
    # https://www.df7cb.de/blog/2014/New_urxvt_tab_in_current_directory.html
    # TODO: not fixed yet
    my $thepid = get_shell_pid();
    $self->msg ("Testing..." . $thepid);
    my $pwd = readlink "/proc/$thepid/cwd";
    if ($pwd) {
        $self->msg ("Opening new terminal with working directory for $thepid: " . $pwd);
        # I guess don't open up a new terminal if we don't know where
        system("rxvt-unicode -cd " . $pwd . " &");
    } else {
        $self->msg ("Could not find an appopriate working directory");
    }

    ()
}

sub open_emacs_dired {
    my ($self) = @_;
    # https://www.df7cb.de/blog/2014/New_urxvt_tab_in_current_directory.html
    # TODO: not fixed yet
    my $thepid = get_shell_pid();
    $self->msg ("Testing..." . $thepid);
    my $pwd = readlink "/proc/$thepid/cwd";
    # I guess don't open up emacs dired if we don't know where
    if ($pwd) {
        # keep this here for now
        $self->msg ("Opening emacs dired with working directory for $thepid: " . $pwd);
        system($ENV{"HOME"} . "/bin/launch-emacsclient nohup --eval '(dired \"" . $pwd . "\")'");
    } else {
        $self->msg ("Could not find an appopriate working directory");
    }

    ()
}

sub on_action {
    my ($self, $action) = @_;
    on_user_command($self, "new:" . $action);
}

sub on_user_command {
    my ($self, $cmd) = @_;
    if ($cmd eq "new:terminal") {
        $self->open_new_terminal;
    }
    if ($cmd eq "new:emacsdired") {
        $self->open_emacs_dired;
    }

    ()
}
