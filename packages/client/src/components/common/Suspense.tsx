import { Suspense as ReactSuspense, SuspenseProps } from 'react';

type PropsType = Omit<SuspenseProps, 'fallback'> & {
    fallback?: React.ReactNode;
};

export const Suspense: React.FC<PropsType> = ({ children, fallback = 'Загрузка...', ...props }) => {
    return (
        <ReactSuspense fallback={fallback} {...props}>
            {children}
        </ReactSuspense>
    );
};
