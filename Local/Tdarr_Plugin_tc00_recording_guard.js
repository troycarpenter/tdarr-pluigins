/* eslint-disable */

const fs = require('fs');

const details = () => ({
  id: "Tdarr_Plugin_tc00_recording_guard",
  Stage: "Pre-processing",
  Name: "Recording Guard",
  Type: "Video",
  Operation: "Filter",
  Description: "Skip files that appear to still be recording.",
  Version: "1.0",
  Tags: "recording,safety",
  Inputs: [
    {
      name: "min_age_minutes",
      type: "number",
      defaultValue: 10,
      inputUI: {
        type: "text",
      },
      tooltip: "Minimum file age before processing.",
    },
  ],
});

const plugin = async (file, librarySettings, inputs, otherArguments) => {

  const lib = require('../methods/lib')();
  inputs = lib.loadDefaultValues(inputs, details);

  const response = {
    processFile: false,
    preset: "",
    container: "",
    handBrakeMode: false,
    FFmpegMode: false,
    reQueueAfter: false,
    infoLog: "",
  };

  const filename = file.file || file.fileFullPath;

  let stat;

  try {
    stat = fs.statSync(filename);
  } catch (err) {
    response.infoLog += `Unable to stat file\n${err}\n`;
    return response;
  }

  const ageMinutes =
    (Date.now() - stat.mtimeMs) / 60000;

  response.infoLog += `Recording Guard\n`;
  response.infoLog += `Age: ${ageMinutes.toFixed(1)} minutes\n`;

  if (ageMinutes < inputs.min_age_minutes) {
    response.infoLog += `SKIP: File modified less than ${inputs.min_age_minutes} minutes ago.\n`;

    response.processFile = false;
    response.reQueueAfter = true;

    return response;
  }

  response.infoLog += `PASS\n`;

  response.processFile = true;

  return response;
};

module.exports.details = details;
module.exports.plugin = plugin;
