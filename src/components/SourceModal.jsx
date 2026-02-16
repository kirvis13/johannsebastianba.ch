import React from 'react';
import { X, Feather, Music } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SourceModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    const { language, t } = useLanguage();
    const infoText = data.info?.[language] || data.info?.nl;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-mp-darker w-full max-w-lg rounded border border-mp-gold/30 shadow-2xl animate-scaleIn overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Header with Icon */}
                <div className="bg-mp-gold/10 p-8 text-center border-b border-white/5">
                    <div className="w-16 h-16 bg-mp-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 text-mp-gold">
                        <Feather size={32} />
                    </div>
                    <h2 className="text-xl font-serif text-mp-gold tracking-wide italic">
                        "{data.title}"
                    </h2>
                    <div className="text-xs uppercase tracking-widest text-gray-500 mt-2 font-bold">
                        ORIGINAL SOURCE
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    {/* Origins Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded border border-white/5 text-center">
                            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
                                <Music size={12} />
                                Melody
                            </div>
                            <div className="text-white font-serif">{data.melody_origin}</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded border border-white/5 text-center">
                            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
                                <Feather size={12} />
                                Text
                            </div>
                            <div className="text-white font-serif">{data.text_origin}</div>
                        </div>
                    </div>

                    {/* Time Gap */}
                    <div className="text-center">
                        <div className="inline-block px-3 py-1 rounded-full bg-mp-blue/20 text-mp-blue text-xs font-mono border border-mp-blue/30">
                            ⏳ {data.time_gap}
                        </div>
                    </div>

                    {/* Context Info */}
                    <div className="border-t border-white/10 pt-4">
                        <h3 className="text-mp-gold text-sm font-bold uppercase tracking-wide mb-2">Context</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {infoText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SourceModal;
