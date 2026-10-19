import { StyleSheet } from '@react-pdf/renderer';

// Shared style tokens/sheet for the multi-page roofing proposal document.
// Mirrors the color/spacing conventions already established in
// modern-quote-doc-final.tsx so the proposal matches the house style.
export const BRAND_BLUE = '#3b82f6';
export const BRAND_BLUE_DARK = '#1e40af';
export const BORDER_GRAY = '#e5e7eb';
export const TEXT_GRAY = '#374151';
export const MUTED_GRAY = '#6b7280';
export const BODY_GRAY = '#1f2937';
export const INFO_BG = '#f9fafb';
export const TOTAL_BG = '#dbeafe';

export const proposalStyles = StyleSheet.create({
  page: {
    fontSize: 9,
    paddingTop: 72,
    paddingLeft: 72,
    paddingRight: 72,
    paddingBottom: 72,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    lineHeight: 1.4
  },
  pageHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BRAND_BLUE_DARK,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: TEXT_GRAY,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3
  },
  text: {
    fontSize: 9,
    color: BODY_GRAY
  },
  mutedText: {
    fontSize: 8,
    color: MUTED_GRAY
  },
  bold: {
    fontWeight: 'bold'
  },
  infoBox: {
    backgroundColor: INFO_BG,
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: BRAND_BLUE
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 3
  },
  bulletMarker: {
    fontSize: 9,
    color: BRAND_BLUE,
    marginRight: 5
  },
  bulletText: {
    fontSize: 9,
    color: BODY_GRAY,
    flex: 1
  },
  table: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 4,
    marginBottom: 12
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 72,
    right: 72,
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
