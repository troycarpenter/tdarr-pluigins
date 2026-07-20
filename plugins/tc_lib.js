/* eslint-disable */

function videoStream(file) {
    return file.ffProbeData.streams.find(s => s.codec_type === "video");
}

function audioStreams(file) {
    return file.ffProbeData.streams.filter(s => s.codec_type === "audio");
}

function subtitleStreams(file) {
    return file.ffProbeData.streams.filter(s => s.codec_type === "subtitle");
}

function englishAudio(file) {
    return audioStreams(file).filter(s =>
        (s.tags?.language || "").startsWith("eng")
    );
}

function englishSubs(file) {
    return subtitleStreams(file).filter(s =>
        (s.tags?.language || "").startsWith("eng")
    );
}

function hasClosedCaptions(file) {

    return file.ffProbeData.streams.some(s => {

        const codec = (s.codec_name || "").toLowerCase();

        return (
            codec === "eia_608" ||
            codec === "eia_708"
        );

    });

}

function isHDR(file) {

    const v = videoStream(file);

    if (!v)
        return false;

    const primaries = (v.color_primaries || "").toLowerCase();

    const transfer = (v.color_transfer || "").toLowerCase();

    return (
        primaries.includes("2020") ||
        transfer.includes("2084") ||
        transfer.includes("hlg")
    );

}

function is10Bit(file) {

    const v = videoStream(file);

    if (!v)
        return false;

    return (
        v.bits_per_raw_sample == 10 ||
        v.profile == "Main 10" ||
        v.profile == "High 10"
    );

}

function isHEVC(file) {

    const v = videoStream(file);

    return v && v.codec_name == "hevc";

}

function isTS(file) {

    return file.container == "ts";

}

module.exports = {

    videoStream,
    audioStreams,
    subtitleStreams,

    englishAudio,
    englishSubs,

    hasClosedCaptions,

    isHDR,
    is10Bit,

    isHEVC,
    isTS

};
