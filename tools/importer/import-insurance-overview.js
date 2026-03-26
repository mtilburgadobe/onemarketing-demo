/* eslint-disable */
/* global WebImporter */

// Import script for template: insurance-overview
// Source: https://www.allianz.ch/en/insurance-switzerland.html

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import columnsInfoParser from './parsers/columns-info.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/allianz-cleanup.js';
import sectionsTransformer from './transformers/allianz-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'columns-info': columnsInfoParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'insurance-overview',
  description: 'Insurance overview landing page showcasing insurance products and services available in Switzerland',
  urls: [
    'https://www.allianz.ch/en/insurance-switzerland.html'
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['.c-stage']
    },
    {
      name: 'columns-info',
      instances: ['.multi-column-grid']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero/Stage',
      selector: '.c-stage',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Topics and At a Glance',
      selector: '.parsys > .wrapper:first-child .multi-column-grid',
      style: null,
      blocks: ['columns-info'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Introduction',
      selector: '.parsys > .wrapper:first-child > .l-container .c-wrapper > .text',
      style: null,
      blocks: [],
      defaultContent: ['.parsys > .wrapper:first-child > .l-container .c-wrapper > .text .c-copy']
    },
    {
      id: 'section-4',
      name: 'Obligatory Insurance Policies',
      selector: '#0_summary',
      style: null,
      blocks: [],
      defaultContent: ['#0_summary', '.headline h3', '.text .c-copy']
    },
    {
      id: 'section-5',
      name: 'Voluntary Insurance Policies',
      selector: '#1_summary',
      style: null,
      blocks: [],
      defaultContent: ['#1_summary', '.headline h3', '.text .c-copy']
    },
    {
      id: 'section-6',
      name: 'Good to Know',
      selector: [".c-wrapper .headline span:contains('GOOD TO KNOW')", '.c-wrapper .headline span'],
      style: null,
      blocks: [],
      defaultContent: ['.c-heading', '.c-copy']
    },
    {
      id: 'section-7',
      name: 'Arrange a Consultation',
      selector: '#2_summary',
      style: null,
      blocks: [],
      defaultContent: ['#2_summary', '.c-copy', '.button']
    },
    {
      id: 'section-8',
      name: 'Customer Reviews and Ratings',
      selector: '#3_summary',
      style: null,
      blocks: ['columns-info'],
      defaultContent: ['#3_summary', '.c-copy']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };
  transformers.forEach(function(transformerFn) {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error('Transformer failed at ' + hookName + ':', e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  var pageBlocks = [];
  template.blocks.forEach(function(blockDef) {
    blockDef.instances.forEach(function(selector) {
      var elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn('Block "' + blockDef.name + '" selector not found: ' + selector);
      }
      elements.forEach(function(element) {
        pageBlocks.push({
          name: blockDef.name,
          selector: selector,
          element: element,
          section: blockDef.section || null
        });
      });
    });
  });
  console.log('Found ' + pageBlocks.length + ' block instances on page');
  return pageBlocks;
}

export default {
  transform: function(payload) {
    var document = payload.document;
    var url = payload.url;
    var html = payload.html;
    var params = payload.params;

    var main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    var pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach(function(block) {
      var parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document: document, url: url, params: params });
        } catch (e) {
          console.error('Failed to parse ' + block.name + ' (' + block.selector + '):', e);
        }
      } else {
        console.warn('No parser found for block: ' + block.name);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    var hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    var path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path: path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(function(b) { return b.name; }),
      }
    }];
  }
};
