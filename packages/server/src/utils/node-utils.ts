import path from 'path';
import url from 'url';

export const createDirname = (metaUrl: string) => {
    return path.dirname(url.fileURLToPath(metaUrl));
};
