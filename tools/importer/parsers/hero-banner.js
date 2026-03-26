/* eslint-disable */
/* global WebImporter */

// Parser for hero-banner. Base: hero.
// Source: https://www.allianz.ch/en/insurance-switzerland.html
// Selectors from captured DOM: .c-stage element

export default function parse(element, { document }) {
  // Extract background image from .c-stage__image picture/img
  var bgImage = element.querySelector('.c-stage__image img, .c-stage img');

  // Extract heading from h1.c-heading--page or h1.c-stage__headline
  var heading = element.querySelector('h1.c-heading--page, h1.c-stage__headline, h1');

  // Extract CTA button link from .c-button inside .c-stage__paragraph-content
  var ctaLink = element.querySelector('.c-stage__paragraph-content a.c-button, .c-stage__paragraph-content a');

  // Build cells to match hero block library structure:
  // Row 1: background image (optional)
  // Row 2: heading + optional subheading + optional CTA
  var cells = [];

  // Row 1: background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: heading and CTA content
  var contentCell = [];
  if (heading) {
    // Create a clean h1 with just the text content
    var h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.push(h1);
  }
  if (ctaLink) {
    // Create a clean paragraph with the CTA link
    var p = document.createElement('p');
    var a = document.createElement('a');
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim();
    p.appendChild(a);
    contentCell.push(p);
  }
  if (contentCell.length > 0) {
    // Wrap in array so all content goes into a single cell in one row
    cells.push([contentCell]);
  }

  var block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells: cells });
  element.replaceWith(block);
}
