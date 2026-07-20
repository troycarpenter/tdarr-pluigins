/* eslint-disable */

const details = () => ({
  id: "Tdarr_Plugin_tc01_media_report",
  Stage: "Pre-processing",
  Name: "Media Report",
  Type: "Video",
  Operation: "Filter",
  Description: "Logs all media information for decision making.",
  Version: "1.0",
  Tags: "report,debug",
  Inputs: [],
});

const plugin = (file, librarySettings, inputs, otherArguments) => {

  const response = {
    processFile: false,
    preset: "",
    container: "",
    handBrakeMode: false,
    FFmpegMode: false,
    reQueueAfter: false,
    infoLog: "",
  };

  response.infoLog += "\n";
  response.infoLog += "=====================================\n";
  response.infoLog += "Tdarr Media Report\n";
  response.infoLog += "=====================================\n";

  response.infoLog += `Library : ${librarySettings.name}\n`;
  response.infoLog += `File    : ${file.file}\n`;
  response.infoLog += `Container : ${file.container}\n`;
  response.infoLog += `Size      : ${file.file_size} MB\n\n`;

  const streams = file.ffProbeData.streams;

  streams.forEach((stream, index) => {

    response.infoLog += `----- Stream ${index} -----\n`;

    response.infoLog += `Type : ${stream.codec_type}\n`;

    if (stream.codec_name)
      response.infoLog += `Codec : ${stream.codec_name}\n`;

    if (stream.profile)
      response.infoLog += `Profile : ${stream.profile}\n`;

    if (stream.width)
      response.infoLog += `Resolution : ${stream.width}x${stream.height}\n`;

    if (stream.r_frame_rate)
      response.infoLog += `FPS : ${stream.r_frame_rate}\n`;

    if (stream.pix_fmt)
      response.infoLog += `Pixel Format : ${stream.pix_fmt}\n`;

    if (stream.bits_per_raw_sample)
      response.infoLog += `Bit Depth : ${stream.bits_per_raw_sample}\n`;

    if (stream.color_space)
      response.infoLog += `Color Space : ${stream.color_space}\n`;

    if (stream.color_transfer)
      response.infoLog += `Transfer : ${stream.color_transfer}\n`;

    if (stream.color_primaries)
      response.infoLog += `Primaries : ${stream.color_primaries}\n`;

    if (stream.field_order)
      response.infoLog += `Field Order : ${stream.field_order}\n`;

    if (stream.channels)
      response.infoLog += `Channels : ${stream.channels}\n`;

    if (stream.channel_layout)
      response.infoLog += `Layout : ${stream.channel_layout}\n`;

    if (stream.sample_rate)
      response.infoLog += `Sample Rate : ${stream.sample_rate}\n`;

    if (stream.tags) {

      if (stream.tags.language)
        response.infoLog += `Language : ${stream.tags.language}\n`;

      if (stream.tags.title)
        response.infoLog += `Title : ${stream.tags.title}\n`;
    }

    if (stream.disposition) {

      response.infoLog +=
        `Disposition : default=${stream.disposition.default} forced=${stream.disposition.forced}\n`;
    }

    response.infoLog += "\n";
  });

  response.infoLog += "=====================================\n";

  response.processFile = false;

  return response;
};

module.exports.details = details;
module.exports.plugin = plugin;
