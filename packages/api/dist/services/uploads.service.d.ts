declare function createPresignedUrl(filename: string, filetype: string): Promise<{
    uploadUrl: string;
    publicUrl: string;
}>;
declare const _default: {
    createPresignedUrl: typeof createPresignedUrl;
};
export default _default;
