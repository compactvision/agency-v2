import React from 'react';

interface ErrorTextProps {
    readonly error?: string | string[];
    readonly id?: string;
}

export default function ErrorText({ error, id }: ErrorTextProps) {
    if (!error) return null;

    return (
        <span
            id={id}
            role="alert"
            className="mt-1 block text-sm font-medium text-red-700"
        >
            {Array.isArray(error) ? error.join(', ') : error}
        </span>
    );
}
