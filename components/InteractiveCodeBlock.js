"use client";

import { useState } from 'react';
import styles from './InteractiveCodeBlock.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function InteractiveCodeBlock({ data, onSuccess }) {
    const { template, answer, language } = data;
    const [userAnswer, setUserAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const parts = template.split('___');

    const handleChange = (e) => {
        setUserAnswer(e.target.value);
        setHasSubmitted(false);
    };

    const handleCheck = () => {
        setHasSubmitted(true);
        const normalizedUser = userAnswer.trim().toLowerCase();
        const normalizedAnswer = String(answer).trim().toLowerCase();

        if (normalizedUser === normalizedAnswer) {
            setIsCorrect(true);
            if (onSuccess) onSuccess();
        } else {
            setIsCorrect(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCheck();
        }
    };

    // Custom style to remove default background/padding so it fits our container
    const customStyle = {
        margin: 0,
        padding: 0,
        background: 'transparent',
        display: 'inline',
    };

    return (
        <div className={styles.container}>
            <div className={styles.codeHeader}>
                <span className={styles.language}>{language}</span>
            </div>
            <div className={styles.codeContent}>
                <div className={styles.codeWrapper}>
                    <SyntaxHighlighter
                        language={language.toLowerCase()}
                        style={vscDarkPlus}
                        customStyle={customStyle}
                        PreTag="span"
                    >
                        {parts[0]}
                    </SyntaxHighlighter>
                    <input
                        type="text"
                        className={`${styles.input} ${hasSubmitted ? (isCorrect ? styles.correct : styles.incorrect) : ''} ${isCorrect ? styles.inputSuccess : ''}`}
                        value={userAnswer}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        disabled={isCorrect}
                        autoFocus
                        size={Math.max(answer.length + 2, 4)}
                        autoComplete="off"
                        spellCheck="false"
                    />
                    <SyntaxHighlighter
                        language={language.toLowerCase()}
                        style={vscDarkPlus}
                        customStyle={customStyle}
                        PreTag="span"
                    >
                        {parts[1]}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div className={styles.footer}>
                {!isCorrect && (
                    <button
                        onClick={handleCheck}
                        className={styles.checkButton}
                    >
                        Check Answer
                    </button>
                )}
                {hasSubmitted && !isCorrect && (
                    <span className={styles.feedbackError}>Try again!</span>
                )}
                {isCorrect && (
                    <span className={styles.feedbackSuccess}>Correct! 🎉</span>
                )}
            </div>
        </div>
    );
}
