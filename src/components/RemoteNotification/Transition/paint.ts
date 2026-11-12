// Copyright (C) 2017-2026 Smart code 203358507

type Box = { x: number, y: number, width: number, height: number };

type Painter = {
    ink: CanvasRenderingContext2D,
    shots: CanvasRenderingContext2D,
    view: DOMRect,
    scale: number,
    unit: number,
    range: Range,
    marks: Box[],
    shot: Box[],
    images: Map<Element, HTMLImageElement>,
    skip: Element | null,
};

const CLEAR = ['rgba(0, 0, 0, 0)', 'transparent'];
const CORNERS = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'] as const;
const CHROMA = 64;
const BRIGHT = 128;

const vivid = (color: string) => {
    const [red, green, blue, alpha = 1] = (color.match(/[\d.]+/g) ?? []).map(Number);
    return alpha > 0.5 && (Math.max(red, green, blue) - Math.min(red, green, blue) > CHROMA || (red + green + blue) / 3 > BRIGHT);
};

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

const fill = ({ ink, marks }: Painter, style: CSSStyleDeclaration, box: Box, radii: number[]) => {
    if (vivid(style.backgroundColor)) {
        trace(ink, box, radii);
        ink.fillStyle = style.backgroundColor;
        ink.fill();
        marks.push(box);
    }
};

const fit = (ratio: number, box: Box, mode: string, left: number, top: number): Box => {
    let { width, height } = box;
    if (mode === 'cover' || mode === 'contain') {
        const wide = (box.width / box.height > ratio) === (mode === 'cover');
        width = wide ? box.width : box.height * ratio;
        height = wide ? box.width / ratio : box.height;
    }

    return { x: box.x + (box.width - width) * left, y: box.y + (box.height - height) * top, width, height };
};

const place = (ratio: number, style: CSSStyleDeclaration, box: Box) => {
    const [left, top] = style.objectPosition.split(' ').map((value) => parseFloat(value) / 100);
    return fit(ratio, box, style.objectFit, Number.isFinite(left) ? left : 0.5, Number.isFinite(top) ? top : 0.5);
};

const picture = ({ shots: context, images, shot }: Painter, element: HTMLImageElement, style: CSSStyleDeclaration, box: Box, radii: number[]) => {
    const source = element.complete && element.naturalWidth > 0 ? element : images.get(element) ?? element;
    if (!source.complete || !(source.naturalWidth > 0) || !(source.naturalHeight > 0)) {
        return;
    }

    const target = place(source.naturalWidth / source.naturalHeight, style, box);
    context.save();
    trace(context, box, radii);
    context.clip();
    if (style.filter !== 'none' && 'filter' in context) {
        context.filter = style.filter;
    }

    context.drawImage(source, target.x, target.y, target.width, target.height);
    context.restore();
    shot.push(box);
};

const vector = ({ ink: context, marks }: Painter, element: SVGSVGElement, box: Box) => {
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
        if (data !== null && style.fill !== 'none') {
            context.fillStyle = style.fill;
            context.fill(new Path2D(data), style.fillRule === 'evenodd' ? 'evenodd' : 'nonzero');
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

const write = ({ ink: context, view, scale, unit, range, marks }: Painter, node: Text, style: CSSStyleDeclaration) => {
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

const draw = (painter: Painter, element: Element, alpha: number) => {
    const { view, scale, unit, skip } = painter;
    const layers = [painter.ink, painter.shots];
    const style = getComputedStyle(element);
    const opacity = alpha * Number(style.opacity);
    const rect = element.getBoundingClientRect();
    const sized = rect.width > 0 && rect.height > 0;
    if (element === skip || style.display === 'none' || style.visibility === 'hidden' || !(opacity > 0.01)) {
        return;
    }
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
    const fade = () => layers.forEach((context) => {
        context.globalAlpha = opacity;
    });
    fade();
    if (sized) {
        fill(painter, style, box, radii);
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
        layers.forEach((context) => {
            context.save();
            trace(context, box, radii);
            context.clip();
        });
    }

    for (let child = element.firstChild; child !== null; child = child.nextSibling) {
        if (child instanceof Element) {
            draw(painter, child, opacity);
        } else if (child instanceof Text) {
            fade();
            write(painter, child, style);
        }
    }

    if (clipped) {
        layers.forEach((context) => context.restore());
    }
};

const paint = (roots: Element[], skip: Element | null, view: DOMRect, scale: number, zoom: number, images: Map<Element, HTMLImageElement>) => {
    const sheet = (options?: CanvasRenderingContext2DSettings) => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(view.width * scale));
        canvas.height = Math.max(1, Math.round(view.height * scale));
        return canvas.getContext('2d', options)!;
    };
    const painter: Painter = {
        ink: sheet({ willReadFrequently: true }),
        shots: sheet(),
        view,
        scale,
        unit: zoom * scale,
        range: document.createRange(),
        marks: [],
        shot: [],
        images,
        skip,
    };

    roots.forEach((root) => draw(painter, root, 1));
    return {
        ink: painter.ink,
        shots: painter.shots.canvas,
        marks: painter.marks,
        shot: painter.shot,
    };
};

export type { Box };

export { CLEAR, place };

export default paint;
