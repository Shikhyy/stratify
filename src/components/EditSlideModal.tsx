import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';

interface EditSlideModalProps {
    isOpen: boolean;
    onClose: () => void;
    slideProps: any;
    onSave: (newProps: any) => void;
}

export const EditSlideModal: React.FC<EditSlideModalProps> = ({ isOpen, onClose, slideProps, onSave }) => {
    const [jsonText, setJsonText] = useState(JSON.stringify(slideProps, null, 2));
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSave = () => {
        try {
            const parsed = JSON.parse(jsonText);
            onSave(parsed);
            onClose();
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                    <h2 className="font-bold text-lg text-slate-800">Edit Slide Data</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-hidden flex flex-col">
                    <div className="text-xs text-slate-500 mb-2">
                        Modify the raw JSON data to update the slide immediately.
                    </div>
                    <textarea
                        value={jsonText}
                        onChange={(e) => {
                            setJsonText(e.target.value);
                            setError(null);
                        }}
                        className="flex-1 w-full font-mono text-sm bg-slate-900 text-green-400 p-4 rounded-lg focus:outline-none resize-none border border-slate-700"
                        spellCheck={false}
                    />
                    {error && (
                        <div className="mt-2 text-red-500 text-xs font-bold">
                            Invalid JSON: {error}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors text-sm font-bold"
                    >
                        <Save size={16} />
                        Save Changes
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
