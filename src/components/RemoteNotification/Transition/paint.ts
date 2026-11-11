// Copyright (C) 2017-2026 Smart code 203358507

type Box = { x: number, y: number, width: number, height: number };

type Painter = {
    context: CanvasRenderingContext2D,
    view: DOMRect,
    scale: number,
    unit: number,
    images: Map<Element, HTMLImageElement>,
    range: Range,
    marks: Box[],
};

const CLEAR = ['rgba(0, 0, 0, 0)', 'transparent'];
const SIDES: Record<string, number> = { top: 0, right: 90, bottom: 180, left: 270 };
const CORNERS = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'] as const;

const trace = (context: CanvasRenderingContext2D, { x, y, width, height }: Box, radii: number[]) => {
    const limit = Math.min(width, height) / 2;
    const [topLeft, topRight, bottomRight, bottomLeft] = radii.map((radius) => Math.max(0, Math.min(radius, limit)));
    context.beginPath();
    context.moveTo(x + topLeft, y);
    context.arcTo(x + width, y, x + width, y + height, topRight);
    context.arcTo(x + width, y + height, x, y + height, bottomRight);
    context.arcTo(x, y + height, x, y, bottomLeft);
    context.arcTo(x, y, x + width, y, topLeft);
    context.closePath();
};

const corners = (style: CSSStyleDeclaration, box: Box, unit: number) => (
    CORNERS.map((corner) => {
        const value = style[corner];
        return value.includes('%') ? parseFloat(value) / 100 * Math.min(box.width, box.height) : parseFloat(value) * unit;
    })
);

const split = (value: string) => {
    const parts: string[] = [];
    let depth = 0;
    let start = 0;
    for (let index = 0; index < value.length; index++) {
        const char = value[index];
        if (char === '(') {
            depth++;
        } else if (char === ')') {
            depth--;
        } else if (char === ',' && depth === 0) {
            parts.push(value.slice(start, index).trim());
            start = index + 1;
        }
    }

    parts.push(value.slice(start).trim());
    return parts;
};

const linear = (context: CanvasRenderingContext2D, value: string, box: Box) => {
    const parts = split(value.slice(value.indexOf('(') + 1, value.lastIndexOf(')')));
    let degrees = 180;
    if (/^-?[\d.]+deg$/.test(parts[0])) {
        degrees = parseFloat(parts[0]);
        parts.shift();
    } else if (parts[0].startsWith('to ')) {
        degrees = SIDES[parts[0].slice(3)] ?? 180;
        parts.shift();
    }

    const angle = degrees * Math.PI / 180;
    const length = Math.abs(box.width * Math.sin(angle)) + Math.abs(box.height * Math.cos(angle));
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    const offsetX = Math.sin(angle) * length / 2;
    const offsetY = -Math.cos(angle) * length / 2;
    const gradient = context.createLinearGradient(centerX - offsetX, centerY - offsetY, centerX + offsetX, centerY + offsetY);
    try {
        parts.forEach((part, index) => {
            const [, color, position] = /^(.*?)(?:\s+(-?[\d.]+)%)?$/.exec(part) ?? [];
            const stop = position !== undefined ? parseFloat(position) / 100 : index / Math.max(1, parts.length - 1);
            gradient.addColorStop(Math.max(0, Math.min(1, stop)), color);
        });
    } catch (_error) {
        return null;
    }

    return gradient;
};

const fill = ({ context }: Painter, style: CSSStyleDeclaration, box: Box, radii: number[]) => {
    const solid = !CLEAR.includes(style.backgroundColor);
    const image = style.backgroundImage;
    const gradient = image.startsWith('linear-gradient(') && image.endsWith(')') ? linear(context, image, box) : null;
    if (!solid && gradient === null) {
        return;
    }

    trace(context, box, radii);
    if (solid) {
        context.fillStyle = style.backgroundColor;
        context.fill();
    }
    if (gradient !== null) {
        context.fillStyle = gradient;
        context.fill();
    }
};

const outline = ({ context, unit }: Painter, style: CSSStyleDeclaration, box: Box, radii: number[]) => {
    const width = parseFloat(style.outlineWidth) * unit;
    if (style.outlineStyle === 'none' || !(width > 0)) {
        return;
    }

    const offset = parseFloat(style.outlineOffset) * unit + width / 2;
    context.strokeStyle = style.outlineColor;
    context.lineWidth = width;
    trace(context, {
        x: box.x - offset,
        y: box.y - offset,
        width: box.width + offset * 2,
        height: box.height + offset * 2,
    }, radii.map((radius) => radius + offset));
    context.stroke();
};

const picture = ({ context, images, marks }: Painter, element: HTMLImageElement, style: CSSStyleDeclaration, box: Box, radii: number[]) => {
    const source = images.get(element) ?? element;
    if (!source.complete || source.naturalWidth === 0 || source.naturalHeight === 0) {
        return;
    }

    let { width, height } = box;
    const fit = style.objectFit;
    if (fit === 'cover' || fit === 'contain') {
        const ratio = source.naturalWidth / source.naturalHeight;
        const wide = (box.width / box.height > ratio) === (fit === 'cover');
        width = wide ? box.width : box.height * ratio;
        height = wide ? box.width / ratio : box.height;
    }

    const [left, top] = style.objectPosition.split(' ').map((value) => parseFloat(value) / 100);
    context.save();
    trace(context, box, radii);
    context.clip();
    context.drawImage(source, box.x + (box.width - width) * (left || 0), box.y + (box.height - height) * (top || 0), width, height);
    context.restore();
    marks.push(box);
};

const vector = ({ context, unit, marks }: Painter, element: SVGSVGElement, box: Box) => {
    const { x, y, width, height } = element.viewBox.baseVal;
    if (!(width > 0) || !(height > 0)) {
        return;
    }

    const ratio = Math.min(box.width / width, box.height / height);
    context.save();
    context.translate(box.x + (box.width - width * ratio) / 2 - x * ratio, box.y + (box.height - height * ratio) / 2 - y * ratio);
    context.scale(ratio, ratio);
    element.querySelectorAll('path').forEach((shape) => {
        const data = shape.getAttribute('d');
        const style = getComputedStyle(shape);
        if (data === null) {
            return;
        }

        const path = new Path2D(data);
        if (style.fill !== 'none') {
            context.fillStyle = style.fill;
            context.fill(path, style.fillRule === 'evenodd' ? 'evenodd' : 'nonzero');
        }
        if (style.stroke !== 'none') {
            context.strokeStyle = style.stroke;
            context.lineWidth = parseFloat(style.strokeWidth) * unit / ratio;
            context.stroke(path);
        }
    });
    context.restore();
    marks.push(box);
};

const cased = (value: string, transform: string) => {
    if (transform === 'uppercase') {
        return value.toUpperCase();
    }
    if (transform === 'lowercase') {
        return value.toLowerCase();
    }

    return value;
};

const write = ({ context, view, scale, unit, range, marks }: Painter, node: Text, style: CSSStyleDeclaration) => {
    const size = parseFloat(style.fontSize) * unit;
    if (!(size > 1) || !/\S/.test(node.data)) {
        return;
    }

    context.font = `${style.fontStyle} ${style.fontWeight} ${size}px ${style.fontFamily}`;
    context.fillStyle = style.color;
    context.textBaseline = 'alphabetic';
    if ('letterSpacing' in context) {
        context.letterSpacing = `${(parseFloat(style.letterSpacing) || 0) * unit}px`;
    }

    const metrics = context.measureText('M');
    const ascent = metrics.fontBoundingBoxAscent ?? size * 0.8;
    const descent = metrics.fontBoundingBoxDescent ?? size * 0.2;
    const words = /\S+/g;
    const lines: { value: string, rect: DOMRect, end: number }[] = [];
    for (let match = words.exec(node.data); match !== null; match = words.exec(node.data)) {
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const rect = range.getClientRects()[0];
        const last = lines[lines.length - 1];
        if (rect === undefined) {
            continue;
        }
        if (last !== undefined && Math.abs(rect.top - last.rect.top) <= rect.height / 2) {
            last.value += ` ${match[0]}`;
            last.end = rect.right;
        } else {
            lines.push({ value: match[0], rect, end: rect.right });
        }
    }

    lines.forEach(({ value, rect, end }) => {
        const x = (rect.left - view.left) * scale;
        const y = (rect.top - view.top) * scale;
        context.fillText(cased(value, style.textTransform), x, y + (rect.height * scale + ascent - descent) / 2);
        marks.push({ x, y, width: (end - rect.left) * scale, height: rect.height * scale });
    });
};

const draw = (painter: Painter, element: Element, alpha: number, deep: boolean) => {
    const { context, view, scale, unit } = painter;
    const style = getComputedStyle(element);
    const opacity = alpha * Number(style.opacity);
    if (style.display === 'none' || style.visibility === 'hidden' || !(opacity > 0.01) || element.localName === 'nav') {
        return;
    }

    const rect = element.getBoundingClientRect();
    const sized = rect.width > 0 && rect.height > 0;
    if (sized && (rect.right <= view.left || rect.left >= view.right || rect.bottom <= view.top || rect.top >= view.bottom)) {
        return;
    }

    const box = {
        x: (rect.left - view.left) * scale,
        y: (rect.top - view.top) * scale,
        width: rect.width * scale,
        height: rect.height * scale,
    };
    const radii = corners(style, box, unit);
    context.globalAlpha = opacity;
    if (sized) {
        fill(painter, style, box, radii);
    }
    if (!deep) {
        return;
    }
    if (element instanceof HTMLImageElement) {
        picture(painter, element, style, box, radii);
        return;
    }
    if (element instanceof SVGSVGElement) {
        vector(painter, element, box);
        return;
    }

    const clipped = sized && style.overflowX !== 'visible';
    if (clipped) {
        context.save();
        trace(context, box, radii);
        context.clip();
    }

    for (let child = element.firstChild; child !== null; child = child.nextSibling) {
        if (child instanceof Element) {
            draw(painter, child, opacity, deep);
        } else if (child instanceof Text) {
            context.globalAlpha = opacity;
            write(painter, child, style);
        }
    }

    if (clipped) {
        context.restore();
    }
    if (sized) {
        context.globalAlpha = opacity;
        outline(painter, style, box, radii);
    }
};

const paint = (element: Element, view: DOMRect, scale: number, zoom: number, images: Map<Element, HTMLImageElement>, deep: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(view.width * scale));
    canvas.height = Math.max(1, Math.round(view.height * scale));
    const painter: Painter = {
        context: canvas.getContext('2d')!,
        view,
        scale,
        unit: zoom * scale,
        images,
        range: document.createRange(),
        marks: [],
    };

    draw(painter, element, 1, deep);
    return { canvas, marks: painter.marks };
};

export type { Box };

export { CLEAR };

export default paint;
