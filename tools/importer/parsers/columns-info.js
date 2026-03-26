/* eslint-disable */
/* global WebImporter */

// Parser for columns-info. Base: columns.
// Source: https://www.allianz.ch/en/insurance-switzerland.html
// Selectors from captured DOM: .multi-column-grid elements
// Instance 1: Topics + At a Glance (section 2)
// Instance 2: Customer Reviews ratings (section 8)
// Selector: .multi-column-grid (matches both instances)

export default function parse(element, { document }) {
  // Find the multi-column-grid container (element itself or ancestor)
  var grid = element.classList.contains('multi-column-grid')
    ? element
    : element.closest('.multi-column-grid') || element;

  // Find column divs within the grid row
  var columns = grid.querySelectorAll('.l-grid__row > .column, .l-grid__row > [class*="l-grid__column"]');
  if (!columns || columns.length === 0) {
    // Fallback: try direct children of l-grid__row
    var row = grid.querySelector('.l-grid__row');
    if (row) {
      columns = row.children;
    }
  }

  if (!columns || columns.length === 0) {
    // Last resort: use the element as a single column
    var block = WebImporter.Blocks.createBlock(document, { name: 'columns-info', cells: [] });
    element.replaceWith(block);
    return;
  }

  // Extract content from each column
  var row = [];
  for (var i = 0; i < columns.length; i++) {
    var col = columns[i];
    var cellContent = [];

    // Extract images (with links if wrapped in anchor)
    var images = col.querySelectorAll('.cmp-image a, .c-image img, img');
    for (var j = 0; j < images.length; j++) {
      var imgEl = images[j];
      if (imgEl.tagName === 'A' && imgEl.querySelector('img')) {
        cellContent.push(imgEl);
      } else if (imgEl.tagName === 'IMG') {
        // Only add if not already added via parent anchor
        if (!imgEl.closest('a') || !imgEl.closest('.cmp-image')) {
          cellContent.push(imgEl);
        }
      }
    }

    // Extract headings (h2, h3, or heading spans)
    var headings = col.querySelectorAll('h2, h3, span.c-heading, .article-sum-title');
    for (var j = 0; j < headings.length; j++) {
      var h = headings[j];
      var heading = document.createElement('h2');
      heading.textContent = h.textContent.trim();
      if (heading.textContent) {
        cellContent.push(heading);
      }
    }

    // Extract lists (ul with links or text items)
    var lists = col.querySelectorAll('ul.c-list');
    for (var j = 0; j < lists.length; j++) {
      var sourceList = lists[j];
      var ul = document.createElement('ul');
      var items = sourceList.querySelectorAll('li');
      for (var k = 0; k < items.length; k++) {
        var li = document.createElement('li');
        var link = items[k].querySelector('a');
        if (link) {
          var a = document.createElement('a');
          a.href = link.href;
          a.textContent = link.textContent.trim();
          li.appendChild(a);
        } else {
          // Get text content, skipping icon spans
          var textContent = items[k].textContent.trim();
          li.textContent = textContent;
        }
        ul.appendChild(li);
      }
      cellContent.push(ul);
    }

    // Extract text paragraphs (bold headings, description text from .c-copy divs)
    var textDivs = col.querySelectorAll('.text .c-copy');
    for (var j = 0; j < textDivs.length; j++) {
      var textDiv = textDivs[j];
      var childDivs = textDiv.querySelectorAll(':scope > div');
      for (var k = 0; k < childDivs.length; k++) {
        var childDiv = childDivs[k];
        var text = childDiv.textContent.trim();
        if (!text || text === '\u00a0') continue;

        // Check if it contains a link
        var childLink = childDiv.querySelector('a.c-link');
        if (childLink) {
          var p = document.createElement('p');
          var a = document.createElement('a');
          a.href = childLink.href;
          a.textContent = childLink.textContent.trim();
          p.appendChild(a);
          cellContent.push(p);
        } else {
          var p = document.createElement('p');
          // Preserve bold formatting
          var boldEl = childDiv.querySelector('b');
          if (boldEl) {
            var strong = document.createElement('strong');
            strong.textContent = boldEl.textContent.trim();
            p.appendChild(strong);
          } else {
            p.textContent = text;
          }
          cellContent.push(p);
        }
      }
    }

    row.push(cellContent.length > 0 ? cellContent : '');
  }

  // Create columns block: single row with N columns
  var cells = [row];
  var block = WebImporter.Blocks.createBlock(document, { name: 'columns-info', cells: cells });
  element.replaceWith(block);
}
