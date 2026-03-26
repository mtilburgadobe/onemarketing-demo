/* eslint-disable */
/* global WebImporter */

// Transformer: Allianz sections
// Inserts section breaks between content sections based on template selectors
// Selectors from captured DOM of allianz.ch/en/insurance-switzerland.html

// Fix selectors with IDs starting with digits (invalid CSS) and :contains() pseudo-selector
function fixSelector(sel) {
  // Convert #0_summary to [id="0_summary"] (IDs starting with digits are invalid CSS identifiers)
  var fixed = sel.replace(/#(\d[^.\s,:[]*)/g, '[id="$1"]');
  return fixed;
}

function findElement(root, sel) {
  // Handle :contains() pseudo-selector (not valid CSS, used in jQuery)
  var containsMatch = sel.match(/(.*):contains\(['"]([^'"]+)['"]\)/);
  if (containsMatch) {
    var baseSelector = containsMatch[1].trim();
    var textToFind = containsMatch[2];
    var candidates = root.querySelectorAll(baseSelector);
    for (var i = 0; i < candidates.length; i++) {
      if (candidates[i].textContent.indexOf(textToFind) !== -1) {
        return candidates[i];
      }
    }
    return null;
  }
  return root.querySelector(fixSelector(sel));
}

export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    var template = payload && payload.template;
    var sections = template && template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid offset issues when inserting elements
    var reversedSections = sections.slice().reverse();
    reversedSections.forEach(function(section, idx) {
      // Skip the first section (last in reversed = first in original)
      var originalIndex = sections.length - 1 - idx;
      if (originalIndex === 0) return;

      var selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      var sectionEl = null;
      for (var i = 0; i < selectors.length; i++) {
        try {
          sectionEl = findElement(element, selectors[i]);
        } catch (e) {
          sectionEl = null;
        }
        if (sectionEl) break;
      }

      if (sectionEl) {
        // Insert section-metadata block if section has a style
        if (section.style) {
          var metaBlock = WebImporter.Blocks.createBlock(document, {
            name: 'Section Metadata',
            cells: { style: section.style }
          });
          sectionEl.before(metaBlock);
        }

        // Insert hr before the section element
        var hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
