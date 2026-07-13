#!/bin/bash
# Fix motion -> m in framer-motion imports and JSX usage across all 26 files

FILES=(
  "components/ui/FocusModeWrapper.tsx"
  "components/ui/FocusModeToolbar.tsx"
  "components/PWARegistration.tsx"
  "components/system/OfflineSyncIndicator.tsx"
  "components/ui/GlobalDragDrop.tsx"
  "components/ui/SessionRestoredBanner.tsx"
  "components/ui/WorkflowSuggestions.tsx"
  "components/tools/world-clock/TimezoneSearchModal.tsx"
  "src/features/calendar/CalendarPage.tsx"
  "src/features/calendar/components/AgendaView.tsx"
  "src/features/calendar/components/DayDetailsSheet.tsx"
  "src/features/calendar/components/TimeGridView.tsx"
  "src/features/calendar/components/WorldEventPanel.tsx"
  "src/features/command-cheat-sheet/index.tsx"
  "src/features/hash-map-visualizer/index.tsx"
  "src/features/image-compressor/components/ImageQueue.tsx"
  "src/features/image-converter/components/ImageConverterControls.tsx"
  "src/features/internet-speed-test/components/IntelligenceCard.tsx"
  "src/features/internet-speed-test/components/PulseRing.tsx"
  "src/features/regex/components/RegexTesterClient.tsx"
  "app/(tools)/image-tools/color-palette-extractor/ColorPaletteExtractorClient.tsx"
  "app/(tools)/image-tools/image-converter/ImageConverterClient.tsx"
  "app/(tools)/productivity/pomodoro-timer/PomodoroTimerClient.tsx"
  "app/(tools)/security-tools/hash-generator/HashGeneratorClient.tsx"
  "app/(tools)/utilities/internet-speed-test/InternetSpeedTestClient.tsx"
  "app/(tools)/utilities/internet-speed-test/SpeedGauge.tsx"
)

for f in "${FILES[@]}"; do
  echo "Processing: $f"
  
  # 1. Fix import statements:
  # "import { motion, AnimatePresence }" -> "import { m, AnimatePresence }"
  # "import { motion }" -> "import { m }"
  # Handle both single and double quotes, with or without other imports
  sed -i 's/\bmotion\b, AnimatePresence/m, AnimatePresence/g; s/AnimatePresence, \bmotion\b/AnimatePresence, m/g' "$f"
  
  # For imports that are just "motion" alone (no AnimatePresence)
  # e.g. import { motion } from "framer-motion"
  # But be careful: only in import lines from framer-motion
  sed -i '/from.*framer-motion/s/{ motion }/{ m }/g' "$f"
  sed -i '/from.*framer-motion/s/{ motion,/{ m,/g' "$f"
  sed -i '/from.*framer-motion/s/, motion /, m /g' "$f"
  sed -i '/from.*framer-motion/s/, motion}/,  m}/g' "$f"
  
  # 2. Fix JSX usage: <motion.xxx -> <m.xxx and </motion.xxx -> </m.xxx
  sed -i 's/<motion\./<m./g' "$f"
  sed -i 's/<\/motion\./<\/m./g' "$f"
  
  # 3. Fix non-JSX usage: motion.div etc used as values
  # This handles patterns like "const X = motion.div"
  sed -i 's/= motion\./= m./g' "$f"
  
  echo "  Done: $f"
done

echo "All files processed!"
