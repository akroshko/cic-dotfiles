#! perl -w
# Copyright (C) 2018, Andrew Kroshko, all rights reserved.
#
# Author: Andrew Kroshko
# Maintainer: Andrew Kroshko <akroshko.public+devel@gmail.com>
# Created: Tue Feb 20, 2017
# Version: 20180220
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

# Provide some help functionality

# This displays a help string with common keys, because they are easy
# to forget.

# TODO: toggle overlay on the keypress and/or timeout on any keypress.

use strict;
use warnings;

# taken and modified from rxvt-unicode provided remote-clipboard extension that has no copyright notice
# TODO: I need a library for this
# TODO: it is slightly annoying to put the message in top-left corner
#        but better for the HD-width terminals I often run
sub msg_multiline {
   my ($self, @msg_array) = @_;
   # my @msg_array = split /^/m, $msg;
   my $msg_lines = @msg_array;

   # my $ov = $self->overlay (-1, 0, $self->strwidth ($msg), 1, urxvt::OVERLAY_RSTYLE, 0);
   my $ov = $self->overlay (0, 0, $self->strwidth ($msg_array[0]), $msg_lines, urxvt::OVERLAY_RSTYLE, 0);
   # TODO: loop here
   my $i=0;
   foreach my $current_line (@msg_array) {
       $ov->set (0, $i, $current_line);
       $i++;
   }

   $self->{msg} =
      urxvt::timer
              ->new
              ->after (5)
              ->cb (sub { delete $self->{msg}; undef $ov; });
}

sub displayhelp_now {
    my ($self) = @_;
    $self->msg_multiline(("C-1: Save selection to clipboard.                                      ",
                          "C-2: Capture selection as buffer in Emacs.                             ",
                          "C-5: Open new RXVT terminal at current directory.                      ",
                          "C-6: Open Emacs dired-mode at current directory.                       ",
                          "m-s: Search backward in scrollback (use arrow keys to navigate search)."));

    ()
}

sub on_action {
    my ($self, $action) = @_;

    on_user_command($self, "displayhelp:" . $action);
}

sub on_user_command {
	my ($self, $cmd) = @_;

	if ($cmd eq "displayhelp:now") {
	   $self->displayhelp_now;
	}

	()
}
