import styles from './MessageBubble.module.css';
import InteractiveCodeBlock from './InteractiveCodeBlock';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MessageBubble({ message, onSuccess }) {
    const isAi = message.role === 'ai';

    return (
        <div className={`${styles.bubbleWrapper} ${isAi ? styles.aiWrapper : styles.userWrapper}`}>
            <div className={`${styles.bubble} ${isAi ? styles.aiBubble : styles.userBubble}`}>
                <div className={styles.content}>
                    {message.content && (
                        <div className={styles.markdownContent}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                style={vscDarkPlus}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    }
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}

                    {message.type === 'interactive_code' && (
                        <div className={styles.codeBlockContainer}>
                            <InteractiveCodeBlock
                                data={message.codeData}
                                onSuccess={onSuccess}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
