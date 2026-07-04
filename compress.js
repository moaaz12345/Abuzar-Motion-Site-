import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';

const publicDir = path.resolve('public');
const videos = fs.readdirSync(publicDir).filter(file => file.endsWith('.mp4') && file.startsWith('video'));

console.log(`Found ${videos.length} videos to compress.`);

for (const video of videos) {
    const inputPath = path.join(publicDir, video);
    const backupPath = path.join(publicDir, `${video}.bak`);
    
    if (fs.existsSync(backupPath)) {
        console.log(`Skipping ${video} (backup already exists)`);
        continue;
    }

    console.log(`Compressing ${video}...`);
    
    fs.renameSync(inputPath, backupPath);

    const command = `"${ffmpegStatic}" -i "${backupPath}" -vf "scale=720:-2" -c:v libx264 -crf 28 -preset veryfast -c:a aac -b:a 128k "${inputPath}"`;
    
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`Successfully compressed ${video}.`);
    } catch (e) {
        console.error(`Failed to compress ${video}. Restoring original.`);
        fs.renameSync(backupPath, inputPath);
    }
}
console.log('Compression complete.');
