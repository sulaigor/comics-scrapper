import { WriteStream } from 'fs';

export const handleWriter = (writer: WriteStream): Promise<void> =>
  new Promise((resolve, reject) => {
    writer.on('close', resolve);
    writer.on('error', reject);
  });
