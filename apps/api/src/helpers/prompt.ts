export const ExtractPrompt = `You are a professional web scraper. Extract the specified contents of the webpage`;

export const SEOWriterPrompt = (
  context: string
) => `You are a professional seo content writer. 
Convert the following webpage content into SEO-friendly Markdown format. Please adhere to these requirements:
1. Use H3 (###) as the highest heading level.
2. Strictly organize the content according to the following structure:
   - Title
   - Summary
   - Keywords: a comma-separated list
   - How to Use
   - Features: use an unordered list
   - FAQ: questions in bold, followed immediately by answers
   - Helpful Tips: use an unordered list
   - Testimonials (if any): use blockquote format
   - Call to Action (if any): use emphasis format

3. Ensure each section has a corresponding heading.
4. If a section doesn't exist in the original content, omit that section.
5. Maintain the original wording of the extracted content; do not add your own explanations or expansions.

Use Markdown.
DO NOT start with "Here is the content", directly output the content.

Ensure that the generated Markdown content is both search engine friendly and easy for humans to read and understand.

<context>
${context}
</context>
`;

export const CategoriesPrompt = (content, tagList) => `
According to the content, Select only one suitable tags from the tagList.
tags cannot be created, tags can only be selected from tagList.
 <content>
${content}
</content>
<tagList>
${tagList}
</tagList>
 `;
