#!/usr/bin/env node
/**
 * One-shot fix: the earlier link-portfolio-cards.js placed </a>
 * BEFORE the </div></div> closing .portfolio-overlay and .portfolio-image.
 * That breaks the HTML — browser auto-closes open elements at </a>,
 * then the orphan </div></div> close unrelated ancestors, corrupting
 * the entire .portfolio-grid layout downstream.
 *
 * This script moves </a> to AFTER the </div></div> for each portfolio
 * item, restoring valid nesting.
 *
 * Idempotent.
 */

'use strict';
const fs = require('fs');
const path = require('path');

const INDEX = path.resolve(__dirname, '..', 'index.html');
let html = fs.readFileSync(INDEX, 'utf8');

// Match the broken pattern:
//   </div>          (closes .portfolio-tags)
//   </a>            (anchor closes too early)
//       </div>      (orphan — was meant to close .portfolio-overlay)
//   </div>          (orphan — was meant to close .portfolio-image)
//
// Replace with correct nesting:
//   </div>          (closes .portfolio-tags)
//       </div>      (closes .portfolio-overlay)
//   </div>          (closes .portfolio-image)
//   </a>            (closes anchor)
const broken = /(\s+)<\/div>(\s+)<\/a>(\s+)<\/div>(\s+)<\/div>/g;
const replacement = '$1</div>$4</div>$2</div>$3</a>';

let count = 0;
const fixed = html.replace(broken, (m, s1, s2, s3, s4) => {
    count += 1;
    return `${s1}</div>${s4}</div>${s2}</div>${s3}</a>`;
});

fs.writeFileSync(INDEX, fixed, 'utf8');
console.log(`Fixed ${count} broken portfolio-item closing patterns.`);
