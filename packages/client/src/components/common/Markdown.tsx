import ReactMarkdown from 'react-markdown';

export const Markdown: React.FC = ({ children }) => {
    const allowedElements: string[] = ['p', 'strong', 'em'];

    if (!children) {
        return null;
    }

    return (
        <ReactMarkdown skipHtml allowedElements={allowedElements}>
            {children.toString()}
        </ReactMarkdown>
    );
};
