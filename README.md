# Educational Site to Demonstrate Local Keylogging with JavaScript

## Overview

This repository hosts a GitHub pages demo of a simple JavaScript application.
You can visit the application [here](https://statsmaths.github.io/keylog/).
The code performs keylogging of input typed into a textbox. All of the
data is stored in the DOM and is downloadable as a CSV file. I use this for a
number of different pedagolical purposes:

- To demonstrate how easy it is to build a fairly invasive picture of one's
activity online using a small amount of code running in the browser. This
can be done as an activity without requiring any technical prerequisites.
- The output data is very interesting from a data science perspective. I make
use of it as a way to demonstrate different kinds of cleaning tasks,
particularly the use of date-time manipulation, table pivots, and window
functions.
- Keylogging is a common source of data in cognitive science and experimental
linguistics. While I am not sure that the application is accurate enough for
large-scale experiments, it is a good way to introduce the general data type
and see some common patterns.
- The JavaScript code is done with plain, vanilla JS. It is a good example of
how the basics can be put together in an interesting way outside of a larger
platform.

If you make use of this demo in your work or use it in a classroom activity,
I appreciate any and all feedback or suggestions!

## Data Schema

The data downloaded from the application is a CSV file with one row for each
detected event. The fields available are:

- **time**: time stamp in milliseconds since the Unix epoch
- **type**: the event type; either 'down' for a key being pressed, 'up' for a
key being released, 'click' for a mouse click, or 'paste' for pasted text from
the clipboard
- **key**: for key press and release events, the actual value of the key press;
for a paste event, this is the pasted text; for a click event, this value is
missing
- **key_code** for key press and release events, this is the name of the
physical key on the keyboard rather than the specific layout choosen by the
user; the names are associated, roughly, with a US-based QWERTY layout; value
is missing for click and paste events
- **alt_key**: was the alt key pressed at the time? not available for the paste
event
- **ctrl_key**: was the ctrl key pressed at the time? not available for the
paste event
- **meta_key**: was the meta key pressed at the time? not available for the
paste event
- **shift_key**: was the alt key pressed at the time? not available for the
paste event
- **is_repeat**: is this a key that is automatically repeating because the key
is held down? always false for paste and mouse events; it is usually false for
key down events, but may be triggered on some devices
- **range_start**: at the time of the event, the location as an integer offset
in the box of either the cursor or the start of any selected text
- **range_end**: at the time of the event, the location as an integer offset
in the box of either the cursor or the end of any selected text

I recommend using the `key` column to determine what key has been produced in
the text box. The `key_code` is useful to determine a user's keyboard layout and
to sync key press events with key release events; note that `key` is not
reliable for this task because the state of the alt/ctrl/meta/shift keys may
have changed. Also, one cannot accurately determine the state of any modifiers
from the boolean values along because a user may have caps-lock or alt-lock
turned on. Their usage is primarily for use in understanding how a user is
physically typing.

Note that reading the data into Excel using the default import may incorrectly
translate UTF-8 characters. Reading the data into R or Python may accidentally
convert values where key is a space into missing values.
