/* eslint-disable */

const tc = require("./tc_lib");

const details = () => ({
    id: "Tdarr_Plugin_tc02_decision_engine",
    Stage: "Pre-processing",
    Name: "Decision Engine",
    Type: "Video",
    Operation: "Filter",
    Version: "1.0",
    Tags: "decision",
    Inputs: []
});

const plugin = (file, librarySettings) => {

    const response = {

        processFile: false,
        preset: "",
        container: "",
        handBrakeMode: false,
        FFmpegMode: false,
        reQueueAfter: false,
        infoLog: ""

    };

    const library = librarySettings.name;

    response.infoLog += "\n";
    response.infoLog += "Decision Engine\n";
    response.infoLog += "===============\n";

    response.infoLog += `Library : ${library}\n`;

    if (tc.isHDR(file)) {

        response.infoLog += "HDR detected\n";
        response.infoLog += "Decision : SKIP\n";

        return response;

    }

    if (library == "Recorded TV" || library == "Recorded Movies") {

        response.infoLog += "Recorded library\n";

        if (tc.isTS(file))
            response.infoLog += "Source is TS\n";

        if (tc.hasClosedCaptions(file))
            response.infoLog += "Broadcast CC detected\n";

        response.infoLog += "Decision : TRANSCODE\n";

        response.processFile = true;

        return response;

    }

    if (library == "Downloaded TV") {

        if (!tc.isHEVC(file)) {

            response.infoLog += "Downloaded TV H264\n";
            response.infoLog += "Decision : TRANSCODE\n";

            response.processFile = true;

            return response;

        }

        response.infoLog += "Already HEVC\n";
        response.infoLog += "Decision : SKIP\n";

        return response;

    }

    if (library == "Downloaded Movies") {

        if (!tc.isHEVC(file)) {

            response.infoLog += "Downloaded Movie\n";
            response.infoLog += "Decision : TRANSCODE\n";

            response.processFile = true;

            return response;

        }

        response.infoLog += "Already HEVC\n";

        return response;

    }

    if (library == "Test") {

        response.infoLog += "Test library\n";
        response.infoLog += "Decision : TRANSCODE\n";

        response.processFile = true;

        return response;

    }

    return response;

};

module.exports.details = details;
module.exports.plugin = plugin;
