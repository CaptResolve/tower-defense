// VectorShapes.js - Procedural vector graphics utilities

export const VectorShapes = {
    // Draw a rounded rectangle
    roundRect(ctx, x, y, w, h, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    },

    // Draw a star shape
    star(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        ctx.beginPath();
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            let x = cx + Math.cos(rot) * outerRadius;
            let y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }

        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    },

    // Draw an arrow
    arrow(ctx, fromX, fromY, toX, toY, headLength = 10) {
        const angle = Math.atan2(toY - fromY, toX - fromX);

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.lineTo(
            toX - headLength * Math.cos(angle - Math.PI / 6),
            toY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headLength * Math.cos(angle + Math.PI / 6),
            toY - headLength * Math.sin(angle + Math.PI / 6)
        );
    },

    // Draw a hexagon
    hexagon(ctx, cx, cy, radius) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
    },

    // Draw a gear shape
    gear(ctx, cx, cy, outerRadius, innerRadius, teeth) {
        ctx.beginPath();
        const toothAngle = (Math.PI * 2) / teeth;
        const toothDepth = (outerRadius - innerRadius) * 0.5;

        for (let i = 0; i < teeth; i++) {
            const angle = toothAngle * i;

            // Outer tooth point
            ctx.lineTo(
                cx + (outerRadius) * Math.cos(angle),
                cy + (outerRadius) * Math.sin(angle)
            );

            // Inner valley
            ctx.lineTo(
                cx + (innerRadius + toothDepth) * Math.cos(angle + toothAngle * 0.5),
                cy + (innerRadius + toothDepth) * Math.sin(angle + toothAngle * 0.5)
            );
        }
        ctx.closePath();
    },

    // Create a gradient for 3D effect
    createGradient3D(ctx, cx, cy, radius, color1, color2) {
        const gradient = ctx.createRadialGradient(
            cx - radius * 0.3, cy - radius * 0.3, 0,
            cx, cy, radius
        );
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
    },

    // Draw explosion effect
    explosion(ctx, x, y, progress, maxRadius, color) {
        const currentRadius = maxRadius * progress;
        const alpha = 1 - progress;

        ctx.save();

        // Outer ring
        ctx.beginPath();
        ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha * 0.8;
        ctx.lineWidth = 3 * (1 - progress);
        ctx.stroke();

        // Inner glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, currentRadius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color.replace(')', ', 0.5)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.globalAlpha = alpha * 0.5;
        ctx.fill();

        ctx.restore();
    },

    // Draw muzzle flash
    muzzleFlash(ctx, x, y, angle, size, progress) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        const alpha = 1 - progress;
        const currentSize = size * (1 + progress * 0.5);

        // Main flash
        ctx.fillStyle = `rgba(255, 200, 100, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(currentSize, -currentSize * 0.3);
        ctx.lineTo(currentSize * 1.5, 0);
        ctx.lineTo(currentSize, currentSize * 0.3);
        ctx.closePath();
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
        ctx.beginPath();
        ctx.arc(currentSize * 0.3, 0, currentSize * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    // Draw damage number floating up
    damageNumber(ctx, x, y, damage, progress, color = '#ff6b6b') {
        const yOffset = -30 * progress;
        const alpha = 1 - progress;
        const scale = 1 + progress * 0.3;

        ctx.save();
        ctx.translate(x, y + yOffset);
        ctx.scale(scale, scale);

        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Outline
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.globalAlpha = alpha;
        ctx.strokeText(`-${damage}`, 0, 0);

        // Fill
        ctx.fillStyle = color;
        ctx.fillText(`-${damage}`, 0, 0);

        ctx.restore();
    },

    // Draw a progress bar
    progressBar(ctx, x, y, width, height, progress, bgColor, fgColor, borderColor) {
        // Background
        ctx.fillStyle = bgColor || '#333';
        ctx.fillRect(x, y, width, height);

        // Fill
        ctx.fillStyle = fgColor || '#4dabf7';
        ctx.fillRect(x, y, width * Math.max(0, Math.min(1, progress)), height);

        // Border
        if (borderColor) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, width, height);
        }
    },

    // Draw a button
    button(ctx, x, y, width, height, text, options = {}) {
        const {
            bgColor = '#4a90d9',
            textColor = '#fff',
            borderColor = '#357abd',
            fontSize = 14,
            enabled = true,
            hovered = false
        } = options;

        // Background
        ctx.fillStyle = enabled
            ? (hovered ? '#5ba0e9' : bgColor)
            : '#666';
        this.roundRect(ctx, x, y, width, height, 5);
        ctx.fill();

        // Border
        ctx.strokeStyle = enabled ? borderColor : '#555';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        ctx.fillStyle = enabled ? textColor : '#999';
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + width / 2, y + height / 2);
    }
};
