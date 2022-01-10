import { useEffect, useState } from 'react';
import { useDebounce } from '@react-hook/debounce';
import htmlSanitizer from 'xss';

import { AppAPI } from '../../api/services';

type PropsType = {
    input: string;
};

export const Markdown: React.FC<PropsType> = ({ input }) => {
    const [markdownInput, setMarkdownInput] = useDebounce(input, 1000);

    const [markdownOutput, setMarkdownOutput] = useState<string>();

    setMarkdownInput(input);

    useEffect(() => {
        const response = async () => {
            try {
                const { output } = await AppAPI.parseMarkdown({ input });
                setMarkdownOutput(output);
            } catch (err) {
                console.warn(err);
            }
        };

        response();
    }, [markdownInput]);

    if (!markdownOutput) {
        return null;
    }

    return (
        <span
            style={{ display: 'contents' }}
            dangerouslySetInnerHTML={{
                __html: htmlSanitizer(markdownOutput),
            }}
        />
    );
};
