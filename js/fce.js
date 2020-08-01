/*
main functions
https://youtu.be/xW3sZqk8-4w?t=657
lady gaga 4 ever
*/

"use strict";

/*
IMPORT EVERYTHING
shadowMaster
*/
import './grabber.js';
import './mover.js';
import './listeners.js';

/*
// EVENT LISTENERS
*/

// EASING
jQuery.extend(jQuery.easing,
{
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	}
});
