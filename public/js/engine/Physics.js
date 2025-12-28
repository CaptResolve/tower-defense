// Physics.js - Collision detection utilities

export class Physics {
    // Circle-circle collision detection
    static circleCollision(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distSq = dx * dx + dy * dy;
        const radiiSum = r1 + r2;
        return distSq < radiiSum * radiiSum;
    }

    // Point in circle detection
    static pointInCircle(px, py, cx, cy, radius) {
        const dx = px - cx;
        const dy = py - cy;
        return dx * dx + dy * dy < radius * radius;
    }

    // Point in rectangle detection
    static pointInRect(px, py, rx, ry, rw, rh) {
        return px >= rx && px < rx + rw && py >= ry && py < ry + rh;
    }

    // Rectangle-rectangle collision detection
    static rectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 &&
               x1 + w1 > x2 &&
               y1 < y2 + h2 &&
               y1 + h1 > y2;
    }

    // Distance between two points
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Distance squared (faster, for comparisons)
    static distanceSq(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return dx * dx + dy * dy;
    }

    // Angle between two points
    static angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    // Normalize angle to 0-2PI range
    static normalizeAngle(angle) {
        while (angle < 0) angle += Math.PI * 2;
        while (angle >= Math.PI * 2) angle -= Math.PI * 2;
        return angle;
    }

    // Linear interpolation
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }

    // Clamp value between min and max
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    // Get direction vector from angle
    static directionFromAngle(angle) {
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    // Check if a line segment intersects a circle
    static lineCircleIntersection(x1, y1, x2, y2, cx, cy, r) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const fx = x1 - cx;
        const fy = y1 - cy;

        const a = dx * dx + dy * dy;
        const b = 2 * (fx * dx + fy * dy);
        const c = fx * fx + fy * fy - r * r;

        let discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            return false;
        }

        discriminant = Math.sqrt(discriminant);

        const t1 = (-b - discriminant) / (2 * a);
        const t2 = (-b + discriminant) / (2 * a);

        if (t1 >= 0 && t1 <= 1) return true;
        if (t2 >= 0 && t2 <= 1) return true;

        return false;
    }

    // Find closest point on line segment to a point
    static closestPointOnLine(px, py, x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lengthSq = dx * dx + dy * dy;

        if (lengthSq === 0) {
            return { x: x1, y: y1 };
        }

        let t = ((px - x1) * dx + (py - y1) * dy) / lengthSq;
        t = this.clamp(t, 0, 1);

        return {
            x: x1 + t * dx,
            y: y1 + t * dy
        };
    }
}
