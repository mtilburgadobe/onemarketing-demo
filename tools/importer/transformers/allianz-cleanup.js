/* eslint-disable */
/* global WebImporter */

// Transformer: Allianz cleanup
// Removes non-authorable content from allianz.ch pages
// Selectors from captured DOM of allianz.ch/en/insurance-switzerland.html

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Cookie consent banner, overlay, skip links (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#overlay',
      '.c-skip-link'
    ]);
  }
  if (hookName === 'afterTransform') {
    // Non-authorable: header, footer, breadcrumbs, navigation (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      'header.c-header',
      '.c-header-spacer',
      'footer.c-footer',
      '.c-breadcrumb__container',
      '.c-three-level-navigation',
      'iframe',
      'link',
      'noscript'
    ]);
  }
}
