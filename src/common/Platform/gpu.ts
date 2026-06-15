const rendererName = (): string => {
    const gl = document.createElement('canvas').getContext('webgl', { powerPreference: 'high-performance' });
    const ext = gl?.getExtension('WEBGL_debug_renderer_info');
    return (ext && gl?.getParameter(ext.UNMASKED_RENDERER_WEBGL)) || '';
};

export const supportsGpuVideoProcessing = /\brtx\b/i.test(rendererName());
