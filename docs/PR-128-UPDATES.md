# PR-128 Updates: Breadcrumbs and Floating AI Assistant

## Overview
This PR implements a reusable breadcrumbs component, fixes and enhances the floating AI assistant, updates the In Classe page with deep-linking support, and fixes the Orario (schedule) grid rendering.

## Changes Summary

### 1. Breadcrumbs Component (src/components/breadcrumbs)
- **Files Created:**
  - `breadcrumbs.html` - Component template
  - `breadcrumbs.css` - Mobile-first, responsive styles with accessibility support
  - `breadcrumbs.js` - Router/query parameter-based breadcrumb generation

- **Features:**
  - Mobile-first responsive design
  - Accessibility-first with aria-current on active elements
  - Auto-hides on Home page
  - Builds breadcrumb trail from URL and query parameters
  - Deep-linking support for In Classe and Orario pages
  - Dark mode and high contrast support
  - Keyboard navigation support

- **Integration:**
  - Integrated in In Classe page header
  - Integrated in Orario page header
  - Can be integrated in global header for all pages

### 2. Floating AI Assistant (src/ui/floating-assistant)
- **Files Created:**
  - `floating-assistant.css` - Responsive styles (mobile full-screen, desktop drawer)
  - `floating-assistant.js` - Logic with focus trap and aria-live

- **Features:**
  - Fixed floating action button (FAB) click handler
  - Mobile: Full-screen modal
  - Desktop: Right-side drawer
  - Text input field with auto-resize
  - Microphone button with mock recording functionality
  - Mock voice-to-text transcription
  - Mock AI responses area with typing indicator
  - ESC key handler for closing
  - Focus trap for accessibility
  - aria-live region for screen reader announcements
  - TODO comments for real API integration

- **MOCK_AI Feature Flag:**
  - Set to `true` by default
  - Switch to `false` when integrating real speech-to-text and AI APIs
  - See TODO comments in code for integration points

### 3. In Classe Page Updates (src/pages/in-classe)
- **Files Created/Updated:**
  - `in-classe.html` - Updated with breadcrumbs and new sections
  - `in-classe.css` - Mobile-first responsive styles
  - `in-classe.js` - Deep-linking support and localStorage-based history

- **Features:**
  - Breadcrumb navigation in header
  - Deep-linking support: `/in-classe?date=...&time=...&class=...&slotId=...`
  - Session data prefilled from URL parameters
  - Mobile-first collapsible sections:
    - Activities
    - Assignments
    - Grades
    - Voice Notes (MediaRecorder with mock transcription)
    - Analytics (demo mock)
    - Agenda
  - LocalStorage-based data persistence per session
  - LocalStorage-based history for e2e testing
  - Accessibility features (ARIA, keyboard navigation)

### 4. Orario (Schedule) Page (src/pages/orario)
- **Files Created:**
  - `orario.html` - Schedule page structure
  - `orario.css` - CSS Grid-based responsive layout
  - `orario.js` - Robust grid rendering with collision detection

- **Features:**
  - CSS Grid layout for day×time intersections
  - Robust slot positioning using 1-based grid indices
  - Multi-hour slot support with row spans
  - Collision detection and warnings
  - Fallback rendering for error cases
  - Deep-linking to In Classe page on cell click
  - Loads data from mock JSON file
  - Mobile-first responsive design
  - Accessibility features (ARIA labels, keyboard navigation)

### 5. Mock Data (src/mock)
- **Files Created:**
  - `orario-mock.json` - Sample schedule data with multi-hour slots and deep-link examples

### 6. Project Structure
- Created new `src/` directory hierarchy:
  - `src/components/` - Reusable components
  - `src/pages/` - Page-specific code
  - `src/ui/` - UI components and widgets
  - `src/mock/` - Mock data for development and testing

## Manual Test Checklist

### Breadcrumbs Component
- [ ] Navigate to In Classe page - breadcrumbs should show: Home > In Classe
- [ ] Navigate to Orario page - breadcrumbs should show: Home > Orario
- [ ] Navigate to Home - breadcrumbs should be hidden
- [ ] Click on "Home" link in breadcrumb - should navigate to home
- [ ] Test on mobile viewport - breadcrumbs should scroll horizontally if needed
- [ ] Test keyboard navigation - breadcrumb links should be keyboard accessible
- [ ] Test with screen reader - aria-current should be announced

### Floating AI Assistant
- [ ] Click FAB - panel should open
- [ ] On mobile - panel should be full-screen
- [ ] On desktop - panel should be a right drawer
- [ ] Click close button - panel should close
- [ ] Press ESC key - panel should close
- [ ] Click overlay - panel should close
- [ ] Type message and press Enter - mock AI response should appear
- [ ] Click microphone button - mock recording should start
- [ ] Click microphone again - recording should stop and transcription should appear
- [ ] Test focus trap - Tab should cycle through panel elements only
- [ ] Test with screen reader - responses should be announced via aria-live

### In Classe Page
- [ ] Navigate to `/in-classe.html` - page should load with default data
- [ ] Navigate with query params: `/in-classe.html?date=2024-10-14&time=08:00&class=3A&subject=Matematica`
- [ ] Header should show correct class, subject, date, and time
- [ ] Breadcrumb should show: Home > In Classe > 3A - [date] - 08:00
- [ ] Add activity - should be saved and displayed
- [ ] Reload page with same params - data should persist
- [ ] Add assignment - should be saved and displayed
- [ ] Add grade - should be saved and displayed
- [ ] Click "Registra Nota" - mock recording should start and stop
- [ ] Mock transcription should appear in voice notes list
- [ ] Expand/collapse sections - should work smoothly
- [ ] Check localStorage - history should be saved
- [ ] Test on mobile - all sections should be accessible

### Orario Page
- [ ] Navigate to Orario page - schedule grid should render
- [ ] Grid should show days (Mon-Fri) as columns
- [ ] Grid should show time slots (8:00-17:00) as rows
- [ ] Lessons should appear in correct day×time intersections
- [ ] Multi-hour lessons should span multiple rows
- [ ] Click on a lesson cell - should navigate to In Classe with correct parameters
- [ ] Check browser console - no collision warnings (or expected collisions logged)
- [ ] Test on mobile - grid should be scrollable horizontally
- [ ] Test on tablet - grid should adapt to viewport
- [ ] Test on desktop - grid should have optimal spacing

## API Integration Notes

### Speech-to-Text Integration
**Location:** `src/ui/floating-assistant/floating-assistant.js`

**Steps:**
1. Set `MOCK_AI = false` in `FloatingAssistantManager` constructor
2. Implement `startRecording()` method:
   - Uncomment real MediaRecorder implementation
   - Request microphone permissions
   - Start recording
3. Implement `processAudioBlob()` method:
   - Send audio blob to speech-to-text API
   - Handle response and update input field
4. Update error handling for permission denials

**Recommended APIs:**
- Web Speech API (browser native)
- Google Cloud Speech-to-Text
- Azure Speech Services
- OpenAI Whisper

### AI Chat Integration
**Location:** `src/ui/floating-assistant/floating-assistant.js`

**Steps:**
1. Set `MOCK_AI = false`
2. Implement `callAIAPI()` method:
   - Send message to AI service
   - Include context (current page, user data, etc.)
   - Handle streaming responses if supported
3. Update `sendMessage()` to call real API instead of mock
4. Add error handling and retry logic
5. Add API key management (environment variables, secure storage)

**Recommended APIs:**
- OpenAI GPT API
- OpenRouter API
- Azure OpenAI Service
- Google Gemini API

### Context Enrichment
The `getContext()` method can be enhanced to include:
- Current page and section
- User preferences and settings
- Recent activities and history
- Student data and class information
- Upcoming deadlines and events

## QA Instructions

### Accessibility Testing
1. **Keyboard Navigation:**
   - Tab through all interactive elements
   - Verify focus indicators are visible
   - Test Enter/Space on buttons and links

2. **Screen Reader Testing:**
   - Test with NVDA, JAWS, or VoiceOver
   - Verify ARIA labels are announced correctly
   - Test aria-live regions in floating assistant
   - Verify breadcrumb current page is announced

3. **High Contrast Mode:**
   - Enable high contrast mode in OS
   - Verify all elements are visible
   - Check focus outlines are prominent

### Responsive Design Testing
1. **Mobile (320px - 767px):**
   - Test breadcrumbs horizontal scroll
   - Test floating assistant full-screen modal
   - Test In Classe collapsible sections
   - Test Orario grid horizontal scroll

2. **Tablet (768px - 1023px):**
   - Test floating assistant drawer transition
   - Test grid spacing adjustments
   - Test touch interactions

3. **Desktop (1024px+):**
   - Test floating assistant right drawer
   - Test optimal grid spacing
   - Test hover states

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Performance Testing
- [ ] Check page load time
- [ ] Check localStorage limits (test with large datasets)
- [ ] Check grid rendering performance with many lessons
- [ ] Check memory usage with floating assistant open

### Data Persistence Testing
- [ ] Add data to In Classe session
- [ ] Reload page - data should persist
- [ ] Navigate away and back - data should persist
- [ ] Clear localStorage - data should reset
- [ ] Check history - last 50 sessions should be saved

## Known Limitations
1. Voice recording uses mock implementation - requires real speech-to-text API
2. AI responses are mocked - requires real AI API integration
3. Date calculation in Orario is simplified - needs actual week calculation
4. No authentication or backend persistence yet
5. Limited error handling for network failures

## Future Enhancements
1. Real-time collaboration features
2. Cloud sync for data persistence
3. Advanced analytics with charts and graphs
4. Export capabilities (PDF, CSV)
5. Calendar integration
6. Push notifications for upcoming lessons
7. Offline mode improvements
8. Multi-language support

## Migration Notes
- New `src/` directory structure introduced
- Existing pages can be migrated incrementally
- Breadcrumbs component can be integrated globally
- Floating assistant is independent and won't affect existing code
- Mock data can be replaced with API calls without code changes

## Support
For questions or issues, please contact the development team or create an issue in the repository.
