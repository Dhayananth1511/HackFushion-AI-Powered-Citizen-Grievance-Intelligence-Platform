import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Camera, MapPin, Send, Globe, X, Upload, CheckCircle2, Building2 } from 'lucide-react';
import { AppLayout } from '../../components/layout';
import { Button, Card } from '../../components/ui';
import { useComplaintStore } from '../../store';
import { complaintsApi } from '../../services/api';

const WARDS = ['Ward 1', 'Ward 5', 'Ward 9', 'Ward 12', 'Ward 17', 'Ward 21', 'Ward 25'];
const LANG_OPTIONS = ['English', 'Tamil', 'Tanglish'];
const SAMPLE_TEXTS = [
  'Enga street la 3 days ah water varala. Romba kashtama irukku.',
  'Road pothole near Anna Nagar junction causing accidents.',
  'Garbage not collected for 5 days in Ward 17. Very bad smell.',
  'Streetlight not working for 2 weeks near our school.',
];

export const ReportComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentText, selectedWard, hasImage, hasLocation,
    isSubmitting, setComplaintText, setSelectedWard,
    setHasImage, setHasLocation, setIsSubmitting, setSubmittedComplaint,
  } = useComplaintStore();

  const [selectedLang, setSelectedLang] = useState('Tanglish');
  const [showWardPicker, setShowWardPicker] = useState(false);
  const [showSamples, setShowSamples] = useState(true);
  const [voiceActive, setVoiceActive] = useState(false);

  const handleSubmit = async () => {
    if (!currentText.trim()) return;
    setIsSubmitting(true);

    try {
      const result = await complaintsApi.submit({
        text: currentText,
        ward: selectedWard,
        citizenName: 'Priya Ramesh',
        citizenId: 'DEMO_CITIZEN',
        hasImage,
        hasLocation,
      });
      setSubmittedComplaint(result.complaint, result.analysis);
      navigate('/citizen/ai-analysis');
    } catch (err) {
      console.error(err);
      // For demo — use mock data if API fails
      navigate('/citizen/ai-analysis');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSample = (text: string) => {
    setComplaintText(text);
    setShowSamples(false);
    setSelectedWard('Ward 12');
  };

  const charCount = currentText.length;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">CivicAssist AI</h1>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            Tell us what happened. You don't need to know the department or complaint category.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500">Language:</span>
          <div className="flex gap-1.5">
            {LANG_OPTIONS.map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${
                  selectedLang === lang
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Sample complaints */}
        <AnimatePresence>
          {showSamples && !currentText && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Try an example:</p>
              <div className="grid grid-cols-1 gap-2">
                {SAMPLE_TEXTS.map((text, i) => (
                  <button
                    key={i}
                    onClick={() => handleSample(text)}
                    className="text-left text-sm text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-2.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-150"
                  >
                    "{text}"
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main form card */}
        <Card className="p-5">
          {/* Text area */}
          <div className="relative mb-4">
            <textarea
              value={currentText}
              onChange={(e) => { setComplaintText(e.target.value); setShowSamples(false); }}
              placeholder="Describe your problem in Tamil, English, or Tanglish...&#10;&#10;Example: Enga street la 3 days ah water varala. Romba kashtama irukku."
              rows={5}
              className="w-full resize-none rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-0 outline-none px-4 py-3 text-slate-900 text-sm placeholder-slate-400 transition-colors duration-200"
            />
            {currentText && (
              <button
                onClick={() => { setComplaintText(''); setShowSamples(true); }}
                className="absolute top-3 right-3 w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3 text-slate-500" />
              </button>
            )}
            <div className="absolute bottom-3 right-3 text-xs text-slate-400">{charCount}/500</div>
          </div>

          {/* Evidence row */}
          <div className="flex flex-wrap gap-2 mb-5">
            {/* Voice */}
            <button
              onClick={() => setVoiceActive(!voiceActive)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                voiceActive
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              <Mic className={`w-4 h-4 ${voiceActive ? 'animate-pulse' : ''}`} />
              {voiceActive ? 'Recording...' : 'Voice Input'}
            </button>

            {/* Image */}
            <button
              onClick={() => setHasImage(!hasImage)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                hasImage
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {hasImage ? <CheckCircle2 className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
              {hasImage ? 'Image Added' : 'Add Photo'}
            </button>

            {/* Location */}
            <button
              onClick={() => setShowWardPicker(!showWardPicker)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                selectedWard
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              <MapPin className="w-4 h-4" />
              {selectedWard || 'Add Location'}
            </button>
          </div>

          {/* Ward picker */}
          <AnimatePresence>
            {showWardPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <p className="text-xs font-semibold text-slate-500 mb-2">Select your ward:</p>
                <div className="flex flex-wrap gap-2">
                  {WARDS.map(w => (
                    <button
                      key={w}
                      onClick={() => { setSelectedWard(w); setHasLocation(true); setShowWardPicker(false); }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                        selectedWard === w
                          ? 'bg-blue-700 text-white border-blue-700'
                          : 'border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!currentText.trim()}
            loading={isSubmitting}
            size="lg"
            icon={<Send className="w-5 h-5" />}
            className="w-full justify-center"
          >
            {isSubmitting ? 'AI is analyzing...' : 'Submit Complaint'}
          </Button>
        </Card>

        {/* Info footer */}
        <p className="text-center text-xs text-slate-400 mt-4">
          🔒 Your complaint is private · AI will extract category, severity and department automatically
        </p>
      </div>
    </AppLayout>
  );
};
