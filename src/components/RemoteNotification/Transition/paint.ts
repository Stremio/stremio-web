// Copyright (C) 2017-2026 Smart code 203358507

type Box = { x: number, y: number, width: number, height: number };

type Mark = Box & { text: boolean };

type Painter = {
    text: CanvasRenderingContext2D,
    image: CanvasRenderingContext2D,
    view: DOMRect,
    scale: number,
    unit: number,
    range: Range,
    marks: Mark[],
};

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

const usable = (source: HTMLImageElement) => source.complete && source.naturalWidth > 0 && source.naturalHeight > 0;

const picture = ({ image: context, marks }: Painter, element: HTMLImageElement, style: CSSStyleDeclaration, box: Box, radii: number[]) => {
    if (!usable(element)) {
        return;
    }

    const target = place(element.naturalWidth / element.naturalHeight, style, box);
    context.save();
    trace(context, box, radii);
    context.clip();
    if (style.filter !== 'none' && 'filter' in context) {
        context.filter = style.filter;
    }

    context.drawImage(element, target.x, target.y, target.width, target.height);
    context.restore();
    marks.push({ ...box, text: false });
};

const vector = ({ text: context, marks }: Painter, element: SVGSVGElement, box: Box) => {
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
    marks.push({ ...box, text: true });
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

const write = ({ text: context, view, scale, unit, range, marks }: Painter, node: Text, style: CSSStyleDeclaration) => {
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
        marks.push({ x, y, width: (end - rect.left) * scale, height: rect.height * scale, text: true });
    });
};

const draw = (painter: Painter, element: Element, alpha: number, skip: Element | null) => {
    const { text, image, view, scale, unit } = painter;
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
    text.globalAlpha = opacity;
    image.globalAlpha = opacity;
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
        [text, image].forEach((context) => {
            context.save();
            trace(context, box, radii);
            context.clip();
        });
    }

    for (let child = element.firstChild; child !== null; child = child.nextSibling) {
        if (child instanceof Element) {
            draw(painter, child, opacity, skip);
        } else if (child instanceof Text) {
            text.globalAlpha = opacity;
            write(painter, child, style);
        }
    }

    if (clipped) {
        text.restore();
        image.restore();
    }
};

const paint = (root: Element, skip: Element | null, view: DOMRect, scale: number, zoom: number) => {
    const [text, image] = [0, 1].map(() => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(view.width * scale));
        canvas.height = Math.max(1, Math.round(view.height * scale));
        return canvas;
    });
    const painter: Painter = {
        text: text.getContext('2d', { willReadFrequently: true })!,
        image: image.getContext('2d')!,
        view,
        scale,
        unit: zoom * scale,
        range: document.createRange(),
        marks: [],
    };

    draw(painter, root, 1, skip);
    return { text, image, marks: painter.marks };
};

export type { Box, Mark };

export { fit, place };

export default paint;
