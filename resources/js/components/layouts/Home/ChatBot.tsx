import axios from 'axios';
import {
    LucideArrowDown,
    LucideCheck,
    LucideCheckCheck,
    LucideMessageCircle,
    LucideMic,
    LucidePaperclip,
    LucideSend,
    LucideSmile,
    LucideX,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
    status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export default function ChatBot() {
    const [active, setActive] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'bot',
            text: "👋 Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
            timestamp: new Date(),
            status: 'delivered',
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Quick replies suggestions
    const quickReplies = [
        '🏘️ Voir les propriétés',
        '💰 Tarifs et abonnements',
        '📞 Contacter un agent',
        '❓ Aide et support',
    ];

    // Emojis
    const emojis = ['😊', '👍', '❤️', '🎉', '🤔', '😄', '👋', '🔥', '✨', '💯'];

    // Détecter si on est sur mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Empêcher le scroll du body quand le chat est ouvert en mobile
    useEffect(() => {
        if (active && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [active, isMobile]);

    const getOrCreateChatbotSessionId = () => {
        let id = localStorage.getItem('chatbotSessionId');
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem('chatbotSessionId', id);
        }
        return id;
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (active && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [active]);

    const handleSend = async (messageText?: string) => {
        const textToSend = messageText || input;
        if (!textToSend.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: textToSend,
            timestamp: new Date(),
            status: 'sending',
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setIsTyping(true);

        // Simulate message status updates
        setTimeout(() => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === userMsg.id
                        ? { ...msg, status: 'sent' as const }
                        : msg,
                ),
            );
        }, 500);

        setTimeout(() => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === userMsg.id
                        ? { ...msg, status: 'delivered' as const }
                        : msg,
                ),
            );
        }, 1000);

        try {
            const sessionId = getOrCreateChatbotSessionId();
            const response = await axios.post(
                '/api/chatbot/message',
                { message: textToSend },
                { headers: { 'X-Chatbot-Session': sessionId } },
            );

            setIsTyping(false);

            setTimeout(() => {
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'bot',
                    text: response.data.reply,
                    timestamp: new Date(),
                    status: 'delivered',
                };
                setMessages((prev) => [...prev, botMsg]);
            }, 800);
        } catch (error) {
            setIsTyping(false);
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: '😅 Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.',
                timestamp: new Date(),
                status: 'delivered',
            };
            setMessages((prev) => [...prev, botMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        setInput((prev) => prev + emoji);
        setShowEmojiPicker(false);
        inputRef.current?.focus();
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const MessageStatusIcon = ({ status }: { status?: Message['status'] }) => {
        switch (status) {
            case 'sending':
                return <LucideCheck className="h-3 w-3 text-gray-400" />;
            case 'sent':
                return <LucideCheck className="h-3 w-3 text-gray-400" />;
            case 'delivered':
                return <LucideCheckCheck className="h-3 w-3 text-gray-400" />;
            case 'read':
                return <LucideCheckCheck className="h-3 w-3 text-blue-500" />;
            default:
                return null;
        }
    };

    // Mode mobile : plein écran
    if (isMobile && active) {
        return (
            <div className="fixed inset-0 z-50 bg-white">
                {/* En-tête fullscreen mobile */}
                <div className="relative bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 p-4 text-white shadow-lg">
                    <div className="absolute inset-0 -skew-x-12 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                    <LucideMessageCircle className="h-6 w-6" />
                                </div>
                                <span className="absolute right-0 bottom-0 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-400"></span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">
                                    Assistant IA
                                </h3>
                                <p className="flex items-center gap-1 text-xs opacity-90">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
                                    En ligne
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActive(false)}
                            className="flex h-10 w-10 transform items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/30"
                        >
                            <LucideArrowDown className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Zone des messages fullscreen mobile */}
                <div className="h-[calc(100vh-140px)] overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4">
                    <div className="mx-auto max-w-2xl space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`group flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'bot' && (
                                    <div className="flex h-10 w-10 flex-shrink-0 transform items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg transition-transform duration-200 group-hover:scale-110">
                                        <LucideMessageCircle className="h-5 w-5 text-white" />
                                    </div>
                                )}

                                <div
                                    className={`group/message relative max-w-[80%]`}
                                >
                                    <div
                                        className={`transform rounded-2xl px-4 py-3 shadow-lg transition-all duration-200 group-hover/message:scale-105 ${
                                            msg.sender === 'user'
                                                ? 'rounded-br-none bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-amber-500/30'
                                                : 'rounded-bl-none border border-gray-100 bg-white text-gray-800 shadow-gray-200'
                                        }`}
                                    >
                                        <p className="text-sm leading-relaxed">
                                            {msg.text}
                                        </p>
                                    </div>

                                    <div
                                        className={`mt-1 flex items-center justify-end space-x-1 text-xs text-gray-400 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                                    >
                                        <span>{formatTime(msg.timestamp)}</span>
                                        {msg.sender === 'user' && (
                                            <MessageStatusIcon
                                                status={msg.status}
                                            />
                                        )}
                                    </div>
                                </div>

                                {msg.sender === 'user' && (
                                    <div className="flex h-10 w-10 flex-shrink-0 transform items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg transition-transform duration-200 group-hover:scale-110">
                                        <svg
                                            className="h-5 w-5 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-start justify-start space-x-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg">
                                    <LucideMessageCircle className="h-5 w-5 text-white" />
                                </div>
                                <div className="rounded-2xl rounded-bl-none border border-gray-100 bg-white px-4 py-3 text-gray-800 shadow-lg">
                                    <div className="flex space-x-1">
                                        <div
                                            className="h-2 w-2 animate-bounce rounded-full bg-amber-400"
                                            style={{ animationDelay: '0ms' }}
                                        ></div>
                                        <div
                                            className="h-2 w-2 animate-bounce rounded-full bg-amber-400"
                                            style={{ animationDelay: '150ms' }}
                                        ></div>
                                        <div
                                            className="h-2 w-2 animate-bounce rounded-full bg-amber-400"
                                            style={{ animationDelay: '300ms' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {messages.length === 1 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {quickReplies.map((reply, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSend(reply)}
                                        className="transform rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors duration-200 hover:scale-105 hover:bg-amber-100"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Zone de saisie fullscreen mobile */}
                <div className="absolute right-0 bottom-0 left-0 border-t border-gray-200 bg-white p-4 shadow-lg">
                    {showEmojiPicker && (
                        <div className="absolute right-4 bottom-20 left-4 rounded-xl border border-gray-100 bg-white p-3 shadow-2xl">
                            <div className="grid grid-cols-5 gap-2">
                                {emojis.map((emoji, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleEmojiSelect(emoji)}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-colors duration-200 hover:bg-gray-100"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <button className="flex h-10 w-10 transform items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 hover:scale-110 hover:bg-gray-200">
                            <LucidePaperclip className="h-5 w-5 text-gray-600" />
                        </button>

                        <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="flex h-10 w-10 transform items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 hover:scale-110 hover:bg-gray-200"
                        >
                            <LucideSmile className="h-5 w-5 text-gray-600" />
                        </button>

                        <div className="relative flex-1">
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full rounded-full bg-gray-100 px-4 py-3 pr-12 text-sm transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                                placeholder="Écrivez votre message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                disabled={loading}
                            />
                            {input && (
                                <button
                                    onClick={() => setInput('')}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                                >
                                    <LucideX className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <button
                            className={`flex h-10 w-10 transform items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                                isRecording
                                    ? 'animate-pulse bg-red-500 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            <LucideMic className="h-5 w-5" />
                        </button>

                        <button
                            onClick={() => handleSend()}
                            disabled={loading || !input.trim()}
                            className={`flex h-11 w-11 transform items-center justify-center rounded-full transition-all duration-300 ${
                                loading || !input.trim()
                                    ? 'scale-95 cursor-not-allowed bg-gray-200 text-gray-400'
                                    : 'bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:scale-110 hover:shadow-lg'
                            }`}
                        >
                            {loading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            ) : (
                                <LucideSend className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <div className="mt-2 text-center text-xs text-gray-400">
                        {input.length}/500 caractères
                    </div>
                </div>
            </div>
        );
    }

    // Mode desktop et mobile fermé
    return (
        <div
            className={`fixed bottom-4 left-4 z-50 transition-all duration-500 sm:bottom-6 sm:left-6 ${active ? 'scale-100' : 'scale-100'}`}
        >
            {/* Bouton de chat flottant */}
            <button
                type="button"
                onClick={() => setActive(!active)}
                className={`group relative flex h-14 w-14 transform items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-12 hover:shadow-amber-500/50 sm:h-16 sm:w-16 ${active ? 'scale-110 rotate-180' : 'rotate-0'}`}
            >
                <div className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>

                <div
                    className={`transition-transform duration-500 ${active ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}`}
                >
                    <LucideMessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <div
                    className={`absolute transition-transform duration-500 ${active ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}
                >
                    <LucideX className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>

                {!active && (
                    <>
                        <span className="absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full border-2 border-white bg-red-500 sm:h-5 sm:w-5"></span>
                        <span className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-red-500 sm:h-5 sm:w-5"></span>
                    </>
                )}
            </button>

            {/* Boîte de chat (desktop uniquement) */}
            <div
                className={`absolute bottom-20 left-0 origin-bottom-left transform transition-all duration-700 ease-out sm:bottom-24 ${
                    active
                        ? 'translate-y-0 scale-100 rotate-0 opacity-100'
                        : 'pointer-events-none translate-y-8 scale-90 rotate-2 opacity-0'
                }`}
            >
                <div className="hidden h-[600px] w-96 overflow-hidden rounded-3xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl sm:block">
                    {/* En-tête desktop */}
                    <div className="relative bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 p-5 text-white">
                        <div className="absolute inset-0 -skew-x-12 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                        <LucideMessageCircle className="h-6 w-6" />
                                    </div>
                                    <span className="absolute right-0 bottom-0 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-400"></span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">
                                        Assistant IA
                                    </h3>
                                    <p className="flex items-center gap-1 text-xs opacity-90">
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
                                        En ligne - Temps de réponse: instantané
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActive(false)}
                                className="flex h-10 w-10 transform items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:rotate-90 hover:bg-white/30"
                            >
                                <LucideX className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Zone des messages desktop */}
                    <div className="h-[420px] overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-5">
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`group flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'bot' && (
                                        <div className="flex h-10 w-10 flex-shrink-0 transform items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg transition-transform duration-200 group-hover:scale-110">
                                            <LucideMessageCircle className="h-5 w-5 text-white" />
                                        </div>
                                    )}

                                    <div
                                        className={`group/message relative max-w-[75%]`}
                                    >
                                        <div
                                            className={`transform rounded-2xl px-4 py-3 shadow-lg transition-all duration-200 group-hover/message:scale-105 ${
                                                msg.sender === 'user'
                                                    ? 'rounded-br-none bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-amber-500/30'
                                                    : 'rounded-bl-none border border-gray-100 bg-white text-gray-800 shadow-gray-200'
                                            }`}
                                        >
                                            <p className="text-sm leading-relaxed">
                                                {msg.text}
                                            </p>
                                        </div>

                                        <div
                                            className={`mt-1 flex items-center justify-end space-x-1 text-xs text-gray-400 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                                        >
                                            <span>
                                                {formatTime(msg.timestamp)}
                                            </span>
                                            {msg.sender === 'user' && (
                                                <MessageStatusIcon
                                                    status={msg.status}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {msg.sender === 'user' && (
                                        <div className="flex h-10 w-10 flex-shrink-0 transform items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg transition-transform duration-200 group-hover:scale-110">
                                            <svg
                                                className="h-5 w-5 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-start justify-start space-x-3">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg">
                                        <LucideMessageCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="rounded-2xl rounded-bl-none border border-gray-100 bg-white px-4 py-3 text-gray-800 shadow-lg">
                                        <div className="flex space-x-1">
                                            <div
                                                className="h-2 w-2 animate-bounce rounded-full bg-amber-400"
                                                style={{
                                                    animationDelay: '0ms',
                                                }}
                                            ></div>
                                            <div
                                                className="h-2 w-2 animate-bounce rounded-full bg-amber-400"
                                                style={{
                                                    animationDelay: '150ms',
                                                }}
                                            ></div>
                                            <div
                                                className="h-2 w-2 animate-bounce rounded-full bg-amber-400"
                                                style={{
                                                    animationDelay: '300ms',
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {messages.length === 1 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {quickReplies.map((reply, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSend(reply)}
                                            className="transform rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors duration-200 hover:scale-105 hover:bg-amber-100"
                                        >
                                            {reply}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Zone de saisie desktop */}
                    <div className="border-t border-gray-100 bg-white/80 p-4 backdrop-blur-sm">
                        {showEmojiPicker && (
                            <div className="absolute bottom-20 left-4 rounded-xl border border-gray-100 bg-white p-3 shadow-2xl">
                                <div className="grid grid-cols-5 gap-2">
                                    {emojis.map((emoji, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                handleEmojiSelect(emoji)
                                            }
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors duration-200 hover:bg-gray-100"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center space-x-2">
                            <button className="flex h-9 w-9 transform items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 hover:scale-110 hover:bg-gray-200">
                                <LucidePaperclip className="h-4 w-4 text-gray-600" />
                            </button>

                            <button
                                onClick={() =>
                                    setShowEmojiPicker(!showEmojiPicker)
                                }
                                className="flex h-9 w-9 transform items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 hover:scale-110 hover:bg-gray-200"
                            >
                                <LucideSmile className="h-4 w-4 text-gray-600" />
                            </button>

                            <div className="relative flex-1">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="w-full rounded-full bg-gray-100 px-4 py-3 pr-12 text-sm transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                                    placeholder="Écrivez votre message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    disabled={loading}
                                />
                                {input && (
                                    <button
                                        onClick={() => setInput('')}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                                    >
                                        <LucideX className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            <button
                                className={`flex h-9 w-9 transform items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                                    isRecording
                                        ? 'animate-pulse bg-red-500 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                <LucideMic className="h-4 w-4" />
                            </button>

                            <button
                                onClick={() => handleSend()}
                                disabled={loading || !input.trim()}
                                className={`flex h-11 w-11 transform items-center justify-center rounded-full transition-all duration-300 ${
                                    loading || !input.trim()
                                        ? 'scale-95 cursor-not-allowed bg-gray-200 text-gray-400'
                                        : 'bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:scale-110 hover:rotate-12 hover:shadow-lg'
                                }`}
                            >
                                {loading ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                ) : (
                                    <LucideSend className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        <div className="mt-2 text-center text-xs text-gray-400">
                            {input.length}/500 caractères
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
