import React from 'react';

/**
 * Parses a string for markdown-like formatting:
 * **text** -> <strong>text</strong> (Gold color)
 * *text* -> <em>text</em> (Italic/Emphasis)
 * 
 * @param {string} text 
 * @returns {React.ReactNode}
 */
export const formatText = (text) => {
    if (!text) return null;

    // Split by simple newlines first if needed, but for now just handle inline formatting.
    // We assume the text is already being rendered in a whitespace-pre-line container if newlines matter.

    // 1. Split by bold (**...**)
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
        // Handle Bold
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={index} className="text-mp-gold font-bold">
                    {part.slice(2, -2)}
                </strong>
            );
        }

        // 2. Split by italic (*...*) within the non-bold parts
        const subParts = part.split(/(\*.*?\*)/g);
        return subParts.map((subPart, subIndex) => {
            if (subPart.startsWith('*') && subPart.endsWith('*')) {
                return (
                    <em key={`${index}-${subIndex}`} className="italic text-neutral-100">
                        {subPart.slice(1, -1)}
                    </em>
                );
            }
            return subPart;
        });
    });
};
