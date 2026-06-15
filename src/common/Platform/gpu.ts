// Detects the GPU renderer and reports whether it's an Nvidia RTX card,
// which is what RTX video processing (VSR / Video HDR) requires.
function rendererName(): string {
    const gl = document.createElement('canvas').getContext('webgl', { powerPreference: 'high-performance' });
    const ext = gl?.getExtension('WEBGL_debug_renderer_info');
    return (ext && gl?.getParameter(ext.UNMASKED_RENDERER_WEBGL)) || '';
}

export const supportsGpuVideoProcessing = /\brtx\b/i.test(rendererName());
