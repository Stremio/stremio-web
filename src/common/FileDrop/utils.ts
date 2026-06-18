import { MIME_SIGNATURES } from 'stremio/common/CONSTANTS';

const SIGNATURES = MIME_SIGNATURES as Record<string, string[]>;

const isFileType = (buffer: ArrayBuffer, type: string) => {
    const signatures = SIGNATURES[type];

    return signatures.some((signature) => {
        const array = new Uint8Array(buffer);
        const signatureBuffer = Buffer.from(signature, 'hex');
        const bufferToCompare = array.subarray(0, signatureBuffer.length);

        return Buffer.compare(signatureBuffer, bufferToCompare) === 0;
    });
};

const isFileTypeSupported = (buffer: ArrayBuffer) => {
    return Object.keys(SIGNATURES).some((type) => isFileType(buffer, type));
};

export {
    isFileType,
    isFileTypeSupported,
};
