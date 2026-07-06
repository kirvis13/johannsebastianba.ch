/**
 * Splits lyric text into { speaker, content } segments.
 * A segment starts at a line beginning with "Speaker:" or "**Speaker:**"
 * (speaker names may contain letters, spaces and "&", e.g. "Soprano & Alto").
 */
export const parseLyrics = (text) => {
    if (!text) return [];
    const segments = [];
    let currentSegment = null;

    text.split('\n').forEach(line => {
        const match = line.match(/^([\p{L}\s&]+):(.*)/u) || line.match(/^(\*\*.*?\*\*):?(.*)/);
        if (match) {
            if (currentSegment) segments.push(currentSegment);
            currentSegment = {
                speaker: match[1].replace(/\*/g, '').trim(),
                content: match[2].trim(),
            };
        } else if (currentSegment) {
            currentSegment.content += '\n' + line;
        } else {
            currentSegment = { speaker: '', content: line };
        }
    });
    if (currentSegment) segments.push(currentSegment);

    if (segments.length === 0 && text) {
        return [{ speaker: '', content: text }];
    }
    return segments;
};
