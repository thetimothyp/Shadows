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