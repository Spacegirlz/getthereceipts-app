Title: Truth Receipt Social Save – Fix Log and Implementation Guide

Scope
- Fix the Truth Receipt social save layout and visual design; ensure export cards do not affect page layout and that all content is dynamic and null‑safe.
- Provide a repeatable method for Playbook and Immunity saves.

Root Causes
1) Hidden social export cards were rendered in normal document flow, creating a large gap above visible content on /receipts.
2) Footer text and spacing caused cutoff at 720×1280px due to excess padding and margins.
3) Text appearance looked heavy/glowy from shadows/weights inconsistent with desktop design.

Key Fixes (with receipts)
1) Remove layout gap by moving hidden export cards off‑screen
   File: src/pages/ReceiptsCardPage.jsx
```571:588:src/pages/ReceiptsCardPage.jsx
      {/* Hidden export cards - Positioned off-screen to avoid layout gap */}
      {analysis && (
        <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none" aria-hidden="true">
          <SocialReceiptCard analysis={analysis} archetype={analysis.archetype} />
          <SocialPlaybookCard deepDive={analysis.deepDive} archetype={analysis.archetype} />
          <SocialImmunityCard immunityData={analysis.immunityTraining} archetype={archetypeNameForImmunity} />
        </div>
      )}
```

2) Tighten top spacing to prevent cutoff and reduce perceived gap
   File: src/pages/ReceiptsCardPage.jsx
```498:503:src/pages/ReceiptsCardPage.jsx
-  <div className="min-h-screen flex flex-col items-center px-4 py-6 text-white overflow-y-auto">
+  <div className="min-h-screen flex flex-col items-center px-4 py-2 text-white overflow-y-auto">
```
```571:586:src/pages/ReceiptsCardPage.jsx
- <div className="text-center mb-4 md:mb-6 py-2 md:py-3 px-2">
-   <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 px-2 md:px-4 py-1 md:py-2 leading-relaxed">
+ <div className="text-center mb-3 md:mb-4 py-1 md:py-2 px-2">
+   <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 md:mb-3 px-2 md:px-3 py-0 md:py-1 leading-relaxed">
```

3) Footer text, weight, and spacing adjustments; sparkles both sides; www URL
   File: src/components/exports/SocialCards.jsx
```633:661:src/components/exports/SocialCards.jsx
        <div style={{
          fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '0.05em',
          fontWeight: '500', marginBottom: '8px', textShadow: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          ✨ Upload Your Text and Get Instant Clarity Free ✨
        </div>
        <div style={{
          fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.1em',
          fontWeight: '400', textDecoration: 'underline', textUnderlineOffset: '2px', textShadow: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          www.getthereceipts.com
        </div>
```

4) Reduce footer/card padding to avoid bottom cutoff
   File: src/components/exports/SocialCards.jsx
```95:105:src/components/exports/SocialCards.jsx
        width: '720px', height: '1280px',
        background: 'linear-gradient(135deg, #1a1a3e 0%, #14142e 100%)',
        padding: '40px 40px 15px 40px',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff', overflow: 'hidden', borderRadius: '24px',
```
```631:639:src/components/exports/SocialCards.jsx
      <div style={{
        textAlign: 'center', marginTop: '2px', background: 'transparent',
        borderRadius: '16px', padding: '6px 12px', border: 'none', boxShadow: 'none'
      }}>
```

5) Text clarity: remove glow/heavy weight; consistent system font
   File: src/components/exports/SocialCards.jsx
```646:660:src/components/exports/SocialCards.jsx
          textShadow: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
```

6) Dynamic, null‑safe Drama Meter with clamped % and fallback remark
   File: src/components/exports/SocialCards.jsx
```24:35:src/components/exports/SocialCards.jsx
  const rawConfidenceScore = Number(analysis?.confidenceScore);
  const confidenceScore = Number.isFinite(rawConfidenceScore)
    ? Math.min(100, Math.max(0, Math.round(rawConfidenceScore))) : 0;
  const confidenceRemark = (analysis?.confidenceRemark && String(analysis.confidenceRemark).trim())
    || getConfidenceRemark(confidenceScore);
```
```88:96:src/components/exports/SocialCards.jsx
  function getConfidenceRemark(score) {
    if (score >= 85) return 'SURE THIS IS TOXIC AF';
    if (score >= 70) return "PRETTY SURE IT'S MESSY";
    if (score >= 50) return 'MIXED SIGNALS, STAY SHARP';
    if (score >= 30) return 'COULD BE OKAY, WATCH VIBES';
    return 'SEEMS HEALTHY, KEEP COMMUNICATING';
  }
```

7) Engagement metric icon and color
   File: src/components/exports/SocialCards.jsx
```201:213:src/components/exports/SocialCards.jsx
        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginTop: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <span style={{ color: '#FFD700' }}>👥</span>
          <span>{gotThisPercentToday}% got this today</span>
        </div>
```

Save/Export Pipeline (how it works)
1) Social cards render off‑screen with fixed positioning and stable IDs: `social-receipt-card`, `social-playbook-card`, `social-immunity-card`.
2) The page calls the helper capture function: ReceiptsCardPage.jsx → `useSocialExport().captureById(id, filename)` (html2canvas + file-saver under the hood).
3) Export uses html2canvas at scale 1.0–1.5 as configured, with width 720 and height 1280, and saves via file‑saver; toast feedback indicates success/error.

Design/Content Principles codified
- Dimensions: 720×1280 px; rounded corners: 24px; overflow hidden.
- Inline styles only for the export components; no className usage.
- All text dynamic from `analysis` with null‑safety and truncation to fit.
- Typography: lighter weights (500/400), textShadow: none for legibility.
- Footer CTA compact; URL includes www; sparkles on both sides.
- Spacing tightened: smaller gaps and margins to avoid bottom cutoff.

Checklist to replicate for Playbook and Immunity saves
1) Ensure their social components (`SocialPlaybookCard`, `SocialImmunityCard`) follow:
   - size 720×1280, `borderRadius: '24px'`, inline styles only, overflow hidden
   - dynamic content from deepDive/immunityTraining; truncate and null‑safe
   - footer CTA and URL block identical to the receipt
2) Confirm they render inside the same off‑screen fixed wrapper in `ReceiptsCardPage.jsx` (already done).
3) Verify each has a stable root ID: `social-playbook-card`, `social-immunity-card` (present in components).
4) Test capture calls:
   - Receipt: `captureById('social-receipt-card', 'Sage-Receipt')`
   - Playbook: `captureById('social-playbook-card', 'Sage-Playbook')`
   - Immunity: `captureById('social-immunity-card', 'Sage-Immunity')`

QA – How to test
1) Run dev server; navigate to /receipts with analysis data.
2) Use the three “Save Social:” buttons; confirm images are 720×1280 with rounded corners and no bottom cutoff.
3) Verify dynamic text (verdict, tea, prophecy, drama meter) matches the on‑page receipt.
4) Confirm off‑screen cards do not push layout (no large gap under the navbar).

Known Risks / Notes
- If a future change re‑introduces className styles in social exports, html2canvas visuals may drift; keep all inline.
- If the export scale or padding is changed, re‑check for footer cutoff.
- Back button absolute positioning (`-top-10`) can affect perceived spacing on some breakpoints; current layout is stable.

Changelog
- Moved hidden export cards off‑screen (fixed) to eliminate layout gap.
- Reduced top padding/margins on /receipts title area.
- Standardized footer CTA content and typography; added sparkles and www URL.
- Reduced paddings/margins to prevent bottom cutoff.
- Implemented dynamic, clamped drama meter with safe fallback remark.
- Engagement icon updated to 👥 in gold.


