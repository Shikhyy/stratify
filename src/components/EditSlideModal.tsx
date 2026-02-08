import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface EditSlideModalProps {
    isOpen: boolean;
    onClose: () => void;
    slideProps: any;
    onSave: (newProps: any) => void;
}

export const EditSlideModal: React.FC<EditSlideModalProps> = ({ isOpen, onClose, slideProps, onSave }) => {
    const { isDark } = useTheme();
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
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDark ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/30'}`}>
            <div
                className={`rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDark ? 'bg-slate-900' : 'bg-white'}`}
            >
                <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <h2 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Edit Slide Data</h2>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>
                        <X size={20} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-hidden flex flex-col">
                    <div className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Modify the raw JSON data to update the slide immediately.
                    </div>
                    <textarea
                        value={jsonText}
                        onChange={(e) => {
                            setJsonText(e.target.value);
                            setError(null);
                        }}
                        className={`flex-1 w-full font-mono text-sm p-4 rounded-lg focus:outline-none resize-none border ${isDark ? 'bg-slate-900 text-green-400 border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-300'}`}
                        spellCheck={false}
                    />
                    {error && (
                        <div className={`mt-2 text-xs font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                            Invalid JSON: {error}
                        </div>
                    )}
                </div>

                <div className={`p-4 border-t flex justify-end gap-2 ${isDark ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                    <button onClick={onClose} className={`px-4 py-2 text-sm font-medium ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}>
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors text-sm font-bold"
                    >
                        <Save size={16} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
