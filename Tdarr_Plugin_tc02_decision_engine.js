/* eslint-disable */

const details = () => ({
  id: 'Tdarr_Plugin_tc02_decision_engine',
  Stage: 'Pre-processing',
  Name: 'TC02 Media Decision Engine',
  Type: 'Video',
  Operation: 'Transcode',
  Description: 'Determines whether media should be transcoded based on library policy.',
  Version: '1.0',
  Tags: 'decision,report,custom',
  Inputs: [],
});

const plugin = (file, librarySettings, inputs, otherArguments) => {
  const response = {
    processFile: false,
    preset: '',
    handBrakeMode: false,
    FFmpegMode: false,
    reQueueAfter: true,
    infoLog: '',
  };

  const libraryName = librarySettings.name || 'Unknown';

  response.infoLog += '\n==============================\n';
  response.infoLog += 'TC02 MEDIA DECISION REPORT\n';
  response.infoLog += '==============================\n';

  response.infoLog += `Library: ${libraryName}\n`;
  response.infoLog += `File: ${file._id || file.file}\n`;
  response.infoLog += `Container: ${file.container}\n`;
  response.infoLog += `Video codec: ${file.video_codec_name}\n`;

  const isHDR =
    file.ffProbeData?.streams?.some(
      (s) =>
        s.color_transfer === 'smpte2084' ||
        s.color_transfer === 'arib-std-b67' ||
        s.profile?.includes('10')
    );

  response.infoLog += `HDR detected: ${isHDR ? 'YES' : 'NO'}\n`;

  let decision = 'SKIP';
  let reason = 'No matching rule';

  //
  // Test library
  //
  if (libraryName === 'Test') {
    decision = 'TRANSCODE';
    reason = 'Test library always processes files';
  }

  //
  // Recorded assets
  //
  else if (libraryName === 'Recorded Assets') {
    if (file.container === 'ts') {
      decision = 'TRANSCODE';
      reason = 'Recorded transport streams require normalization';
    } else {
      decision = 'SKIP';
      reason = 'Recorded asset already converted';
    }
  }

  //
  // Downloaded TV
  //
  else if (libraryName === 'Television') {
    if (isHDR) {
      decision = 'SKIP';
      reason = 'HDR content should be preserved';
    }
    else if (
      file.video_codec_name === 'h264' &&
      file.container === 'mkv'
    ) {
      decision = 'TRANSCODE';
      reason = 'H264 television content should be converted to HEVC';
    }
    else {
      decision = 'SKIP';
      reason = 'Already suitable format';
    }
  }

  //
  // Downloaded movies
  //
  else if (libraryName === 'Movies') {
    if (isHDR) {
      decision = 'SKIP';
      reason = 'HDR movie preservation policy';
    }
    else if (file.video_codec_name === 'hevc') {
      decision = 'SKIP';
      reason = 'Movie already HEVC';
    }
    else {
      decision = 'TRANSCODE';
      reason = 'Movie eligible for space-saving conversion';
    }
  }


  response.infoLog += '\nDecision:\n';
  response.infoLog += `${decision}\n`;
  response.infoLog += `Reason:\n`;
  response.infoLog += `${reason}\n`;
  response.infoLog += '==============================\n';

  if (decision === 'TRANSCODE') {
    response.processFile = true;

    // Placeholder only.
    // tc03 will eventually provide the actual command.
    response.preset = '';
  }

  return response;
};

module.exports.details = details;
module.exports.plugin = plugin;
