

export const convertToEmailAppropriate = (text: string) => {
  const transformedText = text.toLowerCase().replace(/\s/g, '');

  return transformedText;
}