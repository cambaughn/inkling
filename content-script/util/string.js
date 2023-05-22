const sliceStringToRange = (text, minWords, maxWords) => {
  const wordCount = text.trim().split(/\s+/).length;
  const words = text.trim().split(/\s+/);

  let endIndex = maxWords;
  let foundPunctuation = false;

  // Check if there is punctuation within the range
  for (let i = minWords; i < maxWords && i < wordCount; i++) {
    const lastChar = words[i].charAt(words[i].length - 1);
    if (/[.,;?!]/.test(lastChar)) {
      endIndex = i + 1;
      foundPunctuation = true;
      break;
    }
  }

  // If no punctuation found, end after a full word
  if (!foundPunctuation) {
    endIndex = Math.min(endIndex, wordCount);
  }

  // Slice the string to the desired range
  const slicedText = words.slice(0, endIndex).join(' ');

  return slicedText;
}


export { sliceStringToRange }