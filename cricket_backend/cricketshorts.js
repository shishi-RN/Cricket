const youtubedl = require('youtube-dl-exec');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const whisperFunction = require('whisper-node');
const path = require('path');

async function processVideo(videoUrl) {
  try {
    // 1. Fetch video info using youtube-dl-exec (to get duration, etc.)
    console.log('Fetching video information...');
    const videoInfo = await youtubedl(videoUrl, { dumpJson: true });
    console.log('Video information fetched.');

    // 2. Download the video using youtube-dl-exec
    console.log('Downloading video...');
    const videoPath = 'temp_video.mp4';
    await youtubedl(videoUrl, {
      output: videoPath,
      format: 'mp4'
    });
    console.log('Video downloaded.');

    // Get total video duration (in seconds) from the info (field "duration")
    const totalDuration = Number(videoInfo.duration);
    const numParts = 5;
    const segmentDuration = totalDuration / numParts;

    // Path to the Whisper model
    const modelPath = path.join(__dirname, 'models', 'ggml-tiny.en.bin');

    // Process each segment
    for (let i = 0; i < numParts; i++) {
      // Calculate start time and duration for this segment.
      const start = i * segmentDuration;
      // For the last segment, adjust the duration to capture any remainder.
      const currentDuration = (i === numParts - 1) ? (totalDuration - start) : segmentDuration;
      const videoSegmentPath = `temp_video_part_${i + 1}.mp4`;
      console.log(`Processing segment ${i + 1}: start ${start.toFixed(2)} sec, duration ${currentDuration.toFixed(2)} sec`);

      // 3. Split the video into a segment using ffmpeg
      await splitVideoSegment(videoPath, start, currentDuration, videoSegmentPath);

      // 4. Convert the video segment to audio (WAV)
      const audioPath = `audio_part_${i + 1}.wav`;
      await convertToAudio(videoSegmentPath, audioPath);

      // 5. Transcribe the audio segment using Whisper
      const transcript = await whisperFunction.whisper(
        audioPath,
        { modelPath },
        { language: 'auto', word_timestamps: true }
      );

      // Combine transcript segments into one text
      const transcriptText = transcript.segments
        .map(segment => segment.text.trim())
        .join(' ');
      const transcriptFilePath = `transcript_part_${i + 1}.txt`;
      fs.writeFileSync(transcriptFilePath, transcriptText);
      console.log(`Segment ${i + 1} processed. Transcript saved as "${transcriptFilePath}".`);

      // Cleanup temporary files for this segment
      fs.unlinkSync(videoSegmentPath);
      fs.unlinkSync(audioPath);
    }

    // Cleanup the original downloaded video file
    fs.unlinkSync(videoPath);
    console.log('All segments processed and temporary files cleaned up.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Helper function to split a video segment using ffmpeg
function splitVideoSegment(inputPath, start, duration, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(start)
      .setDuration(duration)
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
}

// Helper function to convert a video segment to audio (WAV)
function convertToAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioChannels(1)
      .audioFrequency(16000)
      .format('wav')
      .on('end', resolve)
      .on('error', reject)
      .save(outputPath);
  });
}

// Usage example:
processVideo('https://www.youtube.com/watch?v=I-McqhuE-y4');
