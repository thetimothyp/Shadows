function getIntersection(ray,segment){
	// RAY in parametric: Point + Delta*T1
	var r_px = ray.p1.x;
	var r_py = ray.p1.y;
	var r_dx = ray.p2.x-ray.p1.x;
	var r_dy = ray.p2.y-ray.p1.y;
	// SEGMENT in parametric: Point + Delta*T2
	var s_px = segment.p1.x;
	var s_py = segment.p1.y;
	var s_dx = segment.p2.x-segment.p1.x;
	var s_dy = segment.p2.y-segment.p1.y;
	// Are they parallel? If so, no intersect
	var r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
	var s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
	if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){
		// Unit vectors are the same.
		return null;
	}
	// SOLVE FOR T1 & T2
	// r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
	// ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
	// ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
	// ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
	var T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
	var T1 = (s_px+s_dx*T2-r_px)/r_dx;
	// Must be within parametic whatevers for RAY/SEGMENT
	if(T1<0) return null;
	if(T2<0 || T2>1) return null;
	// Return the POINT OF INTERSECTION
	var pt = new Point(r_px+r_dx*T1, r_py+r_dy*T1);
	pt.param = T1;
	return pt;
}


function findRays(game) {
	var points = (function(walls){
		var a = [];
		for (var i = 0; i < walls.length; i++) {
			a.push(walls[i].p1,walls[i].p2);
		}
		return a;
	})(game.walls);

	var uniquePoints = (function(points){
		var set = {};
		return points.filter(function(p){
			var key = p.x+","+p.y;
			if(key in set){
				return false;
			}else{
				set[key]=true;
				return true;
			}
		});
	})(points);

	var uniqueAngles = [];
	for(var i = 0; i < uniquePoints.length; i++) {
		var uniquePoint = uniquePoints[i];
		var angle = Math.atan2(uniquePoint.y-game.player.y,uniquePoint.x-game.player.x);
		if (angle<0) angle += Math.PI * 2;
		uniquePoint.angle = angle;
		uniqueAngles.push(angle-0.000001, angle, angle+0.000001);
	}

	var intersects = [];
	for(var j = 0; j < uniqueAngles.length; j++) {
		var angle = uniqueAngles[j];
		var dx = Math.cos(angle);
		var dy = Math.sin(angle);

		var ray = new Wall(new Point(game.player.x, game.player.y),
			new Point(game.player.x + dx, game.player.y + dy));

		// Find CLOSEST intersection
		var closestIntersect = null;
		for(var i=0;i<game.walls.length;i++){
			var intersect = getIntersection(ray,game.walls[i]);
			if(!intersect) continue;
			if(!closestIntersect || intersect.param<closestIntersect.param){
				closestIntersect=intersect;
			}
		}
		closestIntersect.angle = angle;
		// Add to list of intersects
		intersects.push(closestIntersect);
	}

	intersects = intersects.sort(function(a,b){
		return a.angle-b.angle;
	});

	return intersects;
}

function pInShadow (game, p) {
	var vert_x = [];
	var vert_y = [];
	for(var i=1;i<game.intersects.length;i++){
		var intersect = game.intersects[i];
		vert_x.push(intersect.x);
		vert_y.push(intersect.y);
	}
	var n_vert = vert_x.length;
	return !pnpoly(n_vert, vert_x, vert_y, p.x, p.y);
}

/*

COPYRIGHT NOTICE FOR FOLLOWING ALGORITHM (pnpoly)

Copyright (c) 1970-2003, Wm. Randolph Franklin

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in 
 the Software without restriction, including without limitation the rights to 
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
 of the Software, and to permit persons to whom the Software is furnished to do 
 so, subject to the following conditions:

 1. Redistributions of source code must retain the above copyright notice, this 
 list of conditions and the following disclaimers. 

 2. Redistributions in binary form must reproduce the above copyright notice in 
 the documentation and/or other materials provided with the distribution. 

 3. The name of W. Randolph Franklin may not be used to endorse or promote 
 products derived from this Software without specific prior written permission.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 SOFTWARE.

*/

function pnpoly( nvert, vertx, verty, testx, testy ) {
    var i, j, c = false;
    for( i = 0, j = nvert-1; i < nvert; j = i++ ) {
        if( ( ( verty[i] > testy ) != ( verty[j] > testy ) ) &&
            ( testx < ( vertx[j] - vertx[i] ) * ( testy - verty[i] ) / ( verty[j] - verty[i] ) + vertx[i] ) ) {
                c = !c;
        }
    }
    return c;
}