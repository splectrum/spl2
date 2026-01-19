// tools/ffmpeg - FFmpeg wrapper
//
// Passthrough wrapper for ffmpeg command.
// All args passed directly to ffmpeg.
//
// Splectrum flags (extracted by cli.js):
//   --dryRun  Show command without executing
//   --silent  Suppress narrative output
//
// Help:
//   spl tools/ffmpeg --help     → ffmpeg's help
//   spl tools/ffmpeg/whoami     → splectrum wrapper help
//
// Examples:
//   spl tools/ffmpeg -i input.mp4 output.webm
//   spl tools/ffmpeg -i video.mp4 -vn audio.mp3
//   spl tools/ffmpeg -i input.mov -c:v libx264 output.mp4

const usageText =
  'Usage: spl tools/ffmpeg <ffmpeg-args>\n\n' +
  'Examples:\n' +
  '  spl tools/ffmpeg -i in.mp4 out.webm      # Convert format\n' +
  '  spl tools/ffmpeg -i video.mp4 -vn out.mp3 # Extract audio\n' +
  '  spl tools/ffmpeg -i in.mp4 -ss 00:01:00 -t 30 clip.mp4  # Trim\n' +
  '  spl tools/ffmpeg --help                  # Show ffmpeg help\n' +
  '  spl tools/ffmpeg/whoami                  # Show splectrum help'

export default async function(module) {
  const wrapper = await module.require('lib/spl/wrapper')
  wrapper.exec('ffmpeg', usageText)
}
