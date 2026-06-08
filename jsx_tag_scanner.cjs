const fs = require('fs');
const text = fs.readFileSync('p2p-mobile/app/(tabs)/index.tsx','utf8');
let stack = [];
let i = 0;
let line = 1;
while (i < text.length) {
  const ch = text[i];
  if (ch === '\n') {
    line++;
    i++;
    continue;
  }
  if (ch === '<') {
    let j = i + 1;
    let inSingle = false;
    let inDouble = false;
    let inBack = false;
    let brace = 0;
    while (j < text.length) {
      const c = text[j];
      if (c === '\n') {
      } else if (inSingle) {
        if (c === '\'' && text[j - 1] !== '\\') inSingle = false;
      } else if (inDouble) {
        if (c === '"' && text[j - 1] !== '\\') inDouble = false;
      } else if (inBack) {
        if (c === '`' && text[j - 1] !== '\\') inBack = false;
      } else if (c === '\'') {
        inSingle = true;
      } else if (c === '"') {
        inDouble = true;
      } else if (c === '`') {
        inBack = true;
      } else if (c === '{') {
        brace++;
      } else if (c === '}') {
        brace--;
      } else if (c === '>' && brace === 0) {
        break;
      }
      j++;
    }
    if (j >= text.length) break;
    const tagText = text.slice(i, j + 1);
    const nameMatch = tagText.match(/^<\s*\/?\s*([A-Za-z]+)/);
    if (nameMatch) {
      const isClose = /^<\s*\//.test(tagText);
      const name = nameMatch[1];
      const selfClose = /\/\s*>$/.test(tagText);
      if (['View', 'Text', 'TouchableOpacity', 'SafeAreaView', 'SectionList'].includes(name)) {
        if (isClose) {
          if (stack.length && stack[stack.length - 1].name === name) {
            stack.pop();
          } else {
            console.log('UNMATCHED CLOSE', name, 'line', line, 'tag', tagText, 'top', stack[stack.length - 1]);
            process.exit(0);
          }
        } else if (!selfClose) {
          stack.push({ name, line, tag: tagText });
        }
      }
    }
    const chunk = text.slice(i, j + 1);
    const newlines = (chunk.match(/\n/g) || []).length;
    line += newlines;
    i = j + 1;
    continue;
  }
  i++;
}
if (stack.length) {
  console.log('UNMATCHED OPEN', stack[stack.length - 1], 'stack length', stack.length);
} else {
  console.log('ALL MATCH');
}
