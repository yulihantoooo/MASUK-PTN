import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Compass,
  BookOpen,
  Copy,
  Check,
  Sparkles,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

interface StructuredAnalysisViewerProps {
  rawText: string;
  ptnName: string;
  prodiName: string;
}

export const StructuredAnalysisViewer: React.FC<StructuredAnalysisViewerProps> = ({
  rawText,
  ptnName,
  prodiName,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'raw'>('cards');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Extract sections by splitting headers (### or ####)
  const parseSections = (text: string) => {
    const lines = text.split('\n');
    const sections: { title: string; content: string[] }[] = [];
    let currentTitle = 'Ringkasan & Gambaran Umum';
    let currentContent: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
        if (currentContent.length > 0) {
          sections.push({ title: currentTitle, content: currentContent });
          currentContent = [];
        }
        currentTitle = trimmed.replace(/^#+\s*/, '').replace(/^\d+\.\s*/, '').replace(/\*+/g, '');
      } else if (trimmed.length > 0 && !trimmed.startsWith('---') && !trimmed.startsWith('>')) {
        currentContent.push(line);
      }
    }

    if (currentContent.length > 0) {
      sections.push({ title: currentTitle, content: currentContent });
    }

    return sections;
  };

  const sections = parseSections(rawText);

  const getSectionTheme = (index: number, title: string) => {
    const t = title.toLowerCase();
    if (t.includes('target') || t.includes('pemetaan') || index === 0) {
      return {
        icon: Target,
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        cardBg: 'bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/30',
        borderColor: 'border-blue-500/30',
        accentText: 'text-blue-400',
      };
    }
    if (t.includes('nilai') || t.includes('mapel') || t.includes('pendukung') || t.includes('rapor')) {
      return {
        icon: BookOpen,
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        cardBg: 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30',
        borderColor: 'border-cyan-500/30',
        accentText: 'text-cyan-400',
      };
    }
    if (t.includes('pilihan') || t.includes('urutan') || t.includes('strategi')) {
      return {
        icon: Compass,
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        cardBg: 'bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30',
        borderColor: 'border-amber-500/30',
        accentText: 'text-amber-400',
      };
    }
    if (t.includes('alternatif') || t.includes('serumpun') || t.includes('cadangan')) {
      return {
        icon: Lightbulb,
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        cardBg: 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30',
        borderColor: 'border-indigo-500/30',
        accentText: 'text-indigo-400',
      };
    }
    return {
      icon: CheckCircle2,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      cardBg: 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30',
      borderColor: 'border-emerald-500/30',
      accentText: 'text-emerald-400',
    };
  };

  const formatLine = (line: string) => {
    // Bold formatting
    const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    return boldFormatted;
  };

  return (
    <div className="space-y-4">
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Hasil Telaah Konsultasi SNBP</span>
            <span className="text-[11px] text-slate-400">
              Disusun untuk <strong className="text-slate-200">{prodiName}</strong> di{' '}
              <strong className="text-slate-200">{ptnName}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle View Mode */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tampilan Kartu Rapi
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'raw'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Teks Narasi
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            title="Salin hasil analisis untuk dibagikan ke Guru BK / Orang Tua"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Salin Hasil</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Render Mode: CARDS */}
      {viewMode === 'cards' ? (
        <div className="space-y-3.5">
          {sections.map((section, idx) => {
            const theme = getSectionTheme(idx, section.title);
            const IconComponent = theme.icon;

            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border ${theme.borderColor} ${theme.cardBg} shadow-md transition-all hover:border-slate-600 space-y-3`}
              >
                {/* Section Header */}
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800/80">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border ${theme.badgeColor}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight flex-1">
                    {section.title}
                  </h4>
                </div>

                {/* Section Body */}
                <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {section.content.map((paragraph, pIdx) => {
                    const isBullet = paragraph.trim().startsWith('-') || paragraph.trim().startsWith('*');
                    const isNumbered = /^\d+\.\s/.test(paragraph.trim());

                    if (isBullet) {
                      return (
                        <div key={pIdx} className="flex items-start gap-2.5 pl-1 py-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${theme.accentText} bg-current`} />
                          <div
                            className="flex-1 text-slate-300"
                            dangerouslySetInnerHTML={{
                              __html: formatLine(paragraph.replace(/^[-*]\s*/, '')),
                            }}
                          />
                        </div>
                      );
                    }

                    if (isNumbered) {
                      const num = paragraph.match(/^(\d+)\.\s/)?.[1] || `${pIdx + 1}`;
                      const textOnly = paragraph.replace(/^\d+\.\s*/, '');
                      return (
                        <div key={pIdx} className="flex items-start gap-2.5 pl-1 py-1">
                          <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                            {num}
                          </span>
                          <div
                            className="flex-1 text-slate-300"
                            dangerouslySetInnerHTML={{
                              __html: formatLine(textOnly),
                            }}
                          />
                        </div>
                      );
                    }

                    return (
                      <p
                        key={pIdx}
                        className="text-slate-300 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: formatLine(paragraph),
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Render Mode: RAW NARRATIVE */
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
          {rawText}
        </div>
      )}
    </div>
  );
};
