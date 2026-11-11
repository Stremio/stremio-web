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
const PSEUDOS = ['::before', '::after'];
const LINK = /^url\("?(.+?)"?\)$/;
const loaded = new Map<string, HTMLImageElement>();

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

const grow = ({ x, y, width, height }: Box, by: number): Box => ({ x: x - by, y: y - by, width: width + by * 2, height: height + by * 2 });

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

const stops = (gradient: CanvasGradient, parts: string[]) => {
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
    return stops(context.createLinearGradient(centerX - offsetX, centerY - offsetY, centerX + offsetX, centerY + offsetY), parts);
};

const radial = (context: CanvasRenderingContext2D, value: string, box: Box, unit: number) => {
    const parts = split(value.slice(value.indexOf('(') + 1, value.lastIndexOf(')')));
    let shape = '';
    if (/^(circle|ellipse|closest|farthest|at |[\d.]+(px|%))/.test(parts[0])) {
        shape = parts.shift() ?? '';
    }

    const [, left = '50%', top = '50%'] = /at\s+(\S+)(?:\s+(\S+))?/.exec(shape) ?? [];
    const place = (position: string, size: number) => position.endsWith('%') ? parseFloat(position) / 100 * size : parseFloat(position) * unit;
    const centerX = box.x + place(left, box.width);
    const centerY = box.y + place(top, box.height);
    const reachX = Math.max(centerX - box.x, box.x + box.width - centerX);
    const reachY = Math.max(centerY - box.y, box.y + box.height - centerY);
    const side = shape.includes('closest-side') || shape.includes('farthest-side');
    const round = shape.includes('circle');
    let radiusX = side ? reachX : reachX * Math.SQRT2;
    let radiusY = side ? reachY : reachY * Math.SQRT2;
    if (round) {
        radiusX = side ? Math.max(reachX, reachY) : Math.hypot(reachX, reachY);
        radiusY = radiusX;
    }

    const gradient = stops(context.createRadialGradient(0, 0, 0, 0, 0, 1), parts);
    return gradient !== null ? { gradient, centerX, centerY, radiusX: Math.max(1, radiusX), radiusY: Math.max(1, radiusY) } : null;
};

const fit = (source: HTMLImageElement, box: Box, mode: string, left: number, top: number) => {
    let { width, height } = box;
    if (mode === 'cover' || mode === 'contain') {
        const ratio = source.naturalWidth / source.naturalHeight;
        const wide = (box.width / box.height > ratio) === (mode === 'cover');
        width = wide ? box.width : box.height * ratio;
        height = wide ? box.width / ratio : box.height;
    }

    return { x: box.x + (box.width - width) * left, y: box.y + (box.height - height) * top, width, height };
};

const usable = (source: HTMLImageElement | undefined): source is HTMLImageElement => (
    source !== undefined && source.complete && source.naturalWidth > 0 && source.naturalHeight > 0
);

const shadows = ({ context, unit }: Painter, style: CSSStyleDeclaration, box: Box, radii: number[]) => {
    if (style.boxShadow === 'none') {
        return;
    }

    split(style.boxShadow).forEach((shadow) => {
        const [, color, x, y, blur, spread] = /^(.*?)\s(-?[\d.]+)px\s(-?[\d.]+)px\s([\d.]+)px\s(-?[\d.]+)px$/.exec(shadow) ?? [];
        if (color === undefined) {
            return;
        }

        const by = parseFloat(spread) * unit;
        const outer = grow(box, by);
        context.save();
        context.beginPath();
        context.rect(-1e5, -1e5, 2e5, 2e5);
        trace(context, box, radii);
        context.clip('evenodd');
        context.shadowColor = color;
        context.shadowBlur = parseFloat(blur) * unit;
        context.shadowOffsetX = parseFloat(x) * unit + 2e5;
        context.shadowOffsetY = parseFloat(y) * unit;
        context.fillStyle = color;
        trace(context, { ...outer, x: outer.x - 2e5 }, radii.map((radius) => radius + by));
        context.fill();
        context.restore();
    });
};

const fill = (painter: Painter, style: CSSStyleDeclaration, box: Box, radii: number[]) => {
    const { context, unit } = painter;
    const solid = !CLEAR.includes(style.backgroundColor);
    const image = split(style.backgroundImage)[0];
    if (solid) {
        trace(context, box, radii);
        context.fillStyle = style.backgroundColor;
        context.fill();
    }
    if (image.startsWith('linear-gradient(')) {
        const gradient = linear(context, image, box);
        if (gradient !== null) {
            trace(context, box, radii);
            context.fillStyle = gradient;
            context.fill();
        }
    } else if (image.startsWith('radial-gradient(')) {
        const spot = radial(context, image, box, unit);
        if (spot !== null) {
            context.save();
            trace(context, box, radii);
            context.clip();
            context.translate(spot.centerX, spot.centerY);
            context.scale(spot.radiusX, spot.radiusY);
            context.fillStyle = spot.gradient;
            context.fillRect(-1e4, -1e4, 2e4, 2e4);
            context.restore();
        }
    } else {
        const source = loaded.get(LINK.exec(image)?.[1] ?? '');
        if (usable(source)) {
            const [left, top] = style.backgroundPosition.split(' ').map((value) => value.endsWith('%') ? parseFloat(value) / 100 : 0);
            const target = fit(source, box, style.backgroundSize, left || 0, top || 0);
            context.save();
            trace(context, box, radii);
            context.clip();
            context.drawImage(source, target.x, target.y, target.width, target.height);
            context.restore();
        }
    }
};

const edge = ({ context, unit }: Painter, style: CSSStyleDeclaration, box: Box, radii: number[]) => {
    const width = parseFloat(style.borderTopWidth) * unit;
    const even = style.borderTopWidth === style.borderRightWidth && style.borderTopWidth === style.borderBottomWidth && style.borderTopWidth === style.borderLeftWidth;
    if (!even || style.borderTopStyle !== 'solid' || !(width > 0)) {
        return;
    }

    context.strokeStyle = style.borderTopColor;
    context.lineWidth = width;
    trace(context, grow(box, -width / 2), radii.map((radius) => radius - width / 2));
    context.stroke();
};

const outline = ({ context, unit }: Painter, style: CSSStyleDeclaration, box: Box, radii: number[]) => {
    const width = parseFloat(style.outlineWidth) * unit;
    if (style.outlineStyle === 'none' || !(width > 0)) {
        return;
    }

    const offset = parseFloat(style.outlineOffset) * unit + width / 2;
    context.strokeStyle = style.outlineColor;
    context.lineWidth = width;
    trace(context, grow(box, offset), radii.map((radius) => radius + offset));
    context.stroke();
};

const generated = (painter: Painter, element: Element, box: Box, alpha: number) => {
    PSEUDOS.forEach((pseudo) => {
        const style = getComputedStyle(element, pseudo);
        const width = parseFloat(style.width) * painter.unit;
        const height = parseFloat(style.height) * painter.unit;
        if (style.content === 'none' || style.display === 'none' || style.position !== 'absolute' || !(width > 0) || !(height > 0)) {
            return;
        }

        const area = {
            x: box.x + (parseFloat(style.left) || 0) * painter.unit,
            y: box.y + (parseFloat(style.top) || 0) * painter.unit,
            width,
            height,
        };
        const radii = corners(style, area, painter.unit);
        painter.context.globalAlpha = alpha * Number(style.opacity);
        shadows(painter, style, area, radii);
        fill(painter, style, area, radii);
        edge(painter, style, area, radii);
    });
};

const picture = ({ context, images, marks }: Painter, element: HTMLImageElement, style: CSSStyleDeclaration, box: Box, radii: number[]) => {
    const source = images.get(element) ?? element;
    if (!usable(source)) {
        return;
    }

    const [left, top] = style.objectPosition.split(' ').map((value) => parseFloat(value) / 100);
    const target = fit(source, box, style.objectFit, left || 0, top || 0);
    context.save();
    trace(context, box, radii);
    context.clip();
    if (style.filter !== 'none' && 'filter' in context) {
        context.filter = style.filter;
    }

    context.drawImage(source, target.x, target.y, target.width, target.height);
    context.restore();
    marks.push(box);
};

const vector = ({ context, marks }: Painter, element: SVGSVGElement, box: Box) => {
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
            context.lineWidth = parseFloat(style.strokeWidth);
            context.lineCap = style.strokeLinecap as CanvasLineCap;
            context.lineJoin = style.strokeLinejoin as CanvasLineJoin;
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

const draw = (painter: Painter, element: Element, alpha: number, forced: boolean, masked = false) => {
    const { context, view, scale, unit } = painter;
    const style = getComputedStyle(element);
    const opacity = alpha * Number(style.opacity);
    const mask = style.maskImage !== 'none' ? style.maskImage : style.webkitMaskImage;
    if (style.display === 'none' || (style.visibility === 'hidden' && !forced) || !(opacity > 0.01) || element.localName === 'nav') {
        return;
    }
    if (!masked && typeof mask === 'string' && mask.startsWith('linear-gradient(')) {
        const rect = element.getBoundingClientRect();
        const layer = document.createElement('canvas');
        const surface = layer.getContext('2d');
        const area = { x: (rect.left - view.left) * scale, y: (rect.top - view.top) * scale, width: rect.width * scale, height: rect.height * scale };
        const gradient = surface !== null ? linear(surface, mask, area) : null;
        if (surface !== null && gradient !== null) {
            layer.width = context.canvas.width;
            layer.height = context.canvas.height;
            draw({ ...painter, context: surface }, element, 1, forced, true);
            surface.globalAlpha = 1;
            surface.globalCompositeOperation = 'destination-in';
            surface.fillStyle = gradient;
            surface.fillRect(0, 0, layer.width, layer.height);
            context.globalAlpha = alpha;
            context.drawImage(layer, 0, 0);
            layer.width = 0;
            return;
        }
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
        shadows(painter, style, box, radii);
        fill(painter, style, box, radii);
        edge(painter, style, box, radii);
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
            draw(painter, child, opacity, false);
        } else if (child instanceof Text) {
            context.globalAlpha = opacity;
            write(painter, child, style);
        }
    }

    if (sized) {
        generated(painter, element, box, opacity);
    }
    if (clipped) {
        context.restore();
    }
    if (sized) {
        context.globalAlpha = opacity;
        outline(painter, style, box, radii);
    }
};

const warm = (root: Element) => {
    [root, ...Array.from(root.querySelectorAll('*'))].forEach((element) => {
        const url = LINK.exec(split(getComputedStyle(element).backgroundImage)[0])?.[1];
        if (url !== undefined && !loaded.has(url)) {
            const image = new Image();
            image.src = url;
            loaded.set(url, image);
        }
    });
};

const paint = (elements: Element[], view: DOMRect, scale: number, zoom: number, images: Map<Element, HTMLImageElement>) => {
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

    elements.forEach((element) => draw(painter, element, 1, true));
    return { canvas, marks: painter.marks };
};

export type { Box };

const forget = () => loaded.clear();

export { CLEAR, warm, forget };

export default paint;
