import * as fs from 'fs/promises';

export const deleteFile = async (path: string): Promise<void> => {
    await fs.unlink(path);
};
