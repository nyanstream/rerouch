import MarkdownIt from 'markdown-it';

const md = new MarkdownIt('zero', {
    typographer: true,
});

md.enable(['text', 'strong', 'emphasis', 'strikethrough'], true);

export const parseMarkdown = (input: string) => {
    return md.renderInline(input).trim();
};
