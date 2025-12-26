import { LucideX, LucideSend, LucideMessageCircle, LucidePaperclip, LucideSmile, LucideMic, LucideCheck, LucideCheckCheck, LucideArrowDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

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
            text: '👋 Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui ?', 
            timestamp: new Date(),
            status: 'delivered'
        }
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
        '❓ Aide et support'
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
            status: 'sending'
        };
        
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setIsTyping(true);

        // Simulate message status updates
        setTimeout(() => {
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === userMsg.id 
                        ? { ...msg, status: 'sent' as const }
                        : msg
                )
            );
        }, 500);

        setTimeout(() => {
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === userMsg.id 
                        ? { ...msg, status: 'delivered' as const }
                        : msg
                )
            );
        }, 1000);

        try {
            const sessionId = getOrCreateChatbotSessionId();
            const response = await axios.post(
                '/api/chatbot/message',
                { message: textToSend },
                { headers: { 'X-Chatbot-Session': sessionId } }
            );

            setIsTyping(false);
            
            setTimeout(() => {
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'bot',
                    text: response.data.reply,
                    timestamp: new Date(),
                    status: 'delivered'
                };
                setMessages(prev => [...prev, botMsg]);
            }, 800);

        } catch (error) {
            setIsTyping(false);
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: '😅 Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.',
                timestamp: new Date(),
                status: 'delivered'
            };
            setMessages(prev => [...prev, botMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        setInput(prev => prev + emoji);
        setShowEmojiPicker(false);
        inputRef.current?.focus();
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const MessageStatusIcon = ({ status }: { status?: Message['status'] }) => {
        switch (status) {
            case 'sending':
                return <LucideCheck className="w-3 h-3 text-gray-400" />;
            case 'sent':
                return <LucideCheck className="w-3 h-3 text-gray-400" />;
            case 'delivered':
                return <LucideCheckCheck className="w-3 h-3 text-gray-400" />;
            case 'read':
                return <LucideCheckCheck className="w-3 h-3 text-blue-500" />;
            default:
                return null;
        }
    };

    // Mode mobile : plein écran
    if (isMobile && active) {
        return (
            <div className="fixed inset-0 z-50 bg-white">
                {/* En-tête fullscreen mobile */}
                <div className="relative bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white p-4 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
                    
                    <div className="relative flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <LucideMessageCircle className="w-6 h-6" />
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Assistant IA</h3>
                                <p className="text-xs opacity-90 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    En ligne
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setActive(false)} 
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-200 transform hover:scale-110"
                        >
                            <LucideArrowDown className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Zone des messages fullscreen mobile */}
                <div className="h-[calc(100vh-140px)] overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                    <div className="space-y-4 max-w-2xl mx-auto">
                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                className={`flex items-start space-x-3 group ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'bot' && (
                                    <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                                        <LucideMessageCircle className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                
                                <div className={`max-w-[80%] relative group/message`}>
                                    <div className={`px-4 py-3 rounded-2xl shadow-lg transform transition-all duration-200 group-hover/message:scale-105 ${
                                        msg.sender === 'user' 
                                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-br-none shadow-amber-500/30' 
                                            : 'bg-white text-gray-800 rounded-bl-none shadow-gray-200 border border-gray-100'
                                    }`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                    </div>
                                    
                                    <div className={`flex items-center justify-end space-x-1 mt-1 text-xs text-gray-400 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        <span>{formatTime(msg.timestamp)}</span>
                                        {msg.sender === 'user' && <MessageStatusIcon status={msg.status} />}
                                    </div>
                                </div>
                                
                                {msg.sender === 'user' && (
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className="flex items-start space-x-3 justify-start">
                                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <LucideMessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-white text-gray-800 shadow-lg rounded-2xl rounded-bl-none px-4 py-3 border border-gray-100">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {messages.length === 1 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {quickReplies.map((reply, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSend(reply)}
                                        className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-medium hover:bg-amber-100 transition-colors duration-200 transform hover:scale-105"
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
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
                    {showEmojiPicker && (
                        <div className="absolute bottom-20 left-4 right-4 bg-white rounded-xl shadow-2xl p-3 border border-gray-100">
                            <div className="grid grid-cols-5 gap-2">
                                {emojis.map((emoji, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleEmojiSelect(emoji)}
                                        className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-xl transition-colors duration-200"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 transform hover:scale-110">
                            <LucidePaperclip className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        <button 
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 transform hover:scale-110"
                        >
                            <LucideSmile className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all duration-200 pr-12"
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
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <LucideX className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        
                        <button 
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
                                isRecording 
                                    ? 'bg-red-500 text-white animate-pulse' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            <LucideMic className="w-5 h-5" />
                        </button>
                        
                        <button 
                            onClick={() => handleSend()}
                            disabled={loading || !input.trim()}
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                                loading || !input.trim() 
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed scale-95' 
                                    : 'bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:shadow-lg hover:scale-110'
                            }`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <LucideSend className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-400 text-center">
                        {input.length}/500 caractères
                    </div>
                </div>
            </div>
        );
    }

    // Mode desktop et mobile fermé
    return (
        <div className={`fixed z-50 bottom-4 sm:bottom-6 left-4 sm:left-6 transition-all duration-500 ${active ? 'scale-100' : 'scale-100'}`}>
            {/* Bouton de chat flottant */}
            <button 
                type="button" 
                onClick={() => setActive(!active)} 
                className={`group relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 transform hover:scale-110 hover:rotate-12 ${active ? 'rotate-180 scale-110' : 'rotate-0'}`}
            >
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                <div className={`transition-transform duration-500 ${active ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}`}>
                    <LucideMessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className={`absolute transition-transform duration-500 ${active ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
                    <LucideX className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                
                {!active && (
                    <>
                        <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
                        <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full animate-ping"></span>
                    </>
                )}
            </button>

            {/* Boîte de chat (desktop uniquement) */}
            <div className={`absolute bottom-20 sm:bottom-24 left-0 transition-all duration-700 ease-out transform origin-bottom-left ${
                active ? 'scale-100 opacity-100 translate-y-0 rotate-0' : 'scale-90 opacity-0 translate-y-8 rotate-2 pointer-events-none'
            }`}>
                <div className="hidden sm:block w-96 h-[600px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                    {/* En-tête desktop */}
                    <div className="relative bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white p-5">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
                        
                        <div className="relative flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <LucideMessageCircle className="w-6 h-6" />
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Assistant IA</h3>
                                    <p className="text-xs opacity-90 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        En ligne - Temps de réponse: instantané
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setActive(false)} 
                                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-200 transform hover:scale-110 hover:rotate-90"
                            >
                                <LucideX className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Zone des messages desktop */}
                    <div className="h-[420px] overflow-y-auto p-5 bg-gradient-to-b from-gray-50 to-white">
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`flex items-start space-x-3 group ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'bot' && (
                                        <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                                            <LucideMessageCircle className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                    
                                    <div className={`max-w-[75%] relative group/message`}>
                                        <div className={`px-4 py-3 rounded-2xl shadow-lg transform transition-all duration-200 group-hover/message:scale-105 ${
                                            msg.sender === 'user' 
                                                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-br-none shadow-amber-500/30' 
                                                : 'bg-white text-gray-800 rounded-bl-none shadow-gray-200 border border-gray-100'
                                        }`}>
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                        </div>
                                        
                                        <div className={`flex items-center justify-end space-x-1 mt-1 text-xs text-gray-400 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                            <span>{formatTime(msg.timestamp)}</span>
                                            {msg.sender === 'user' && <MessageStatusIcon status={msg.status} />}
                                        </div>
                                    </div>
                                    
                                    {msg.sender === 'user' && (
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {isTyping && (
                                <div className="flex items-start space-x-3 justify-start">
                                    <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <LucideMessageCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="bg-white text-gray-800 shadow-lg rounded-2xl rounded-bl-none px-4 py-3 border border-gray-100">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {messages.length === 1 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {quickReplies.map((reply, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSend(reply)}
                                            className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-medium hover:bg-amber-100 transition-colors duration-200 transform hover:scale-105"
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
                    <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
                        {showEmojiPicker && (
                            <div className="absolute bottom-20 left-4 bg-white rounded-xl shadow-2xl p-3 border border-gray-100">
                                <div className="grid grid-cols-5 gap-2">
                                    {emojis.map((emoji, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleEmojiSelect(emoji)}
                                            className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center text-lg transition-colors duration-200"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 transform hover:scale-110">
                                <LucidePaperclip className="w-4 h-4 text-gray-600" />
                            </button>
                            
                            <button 
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 transform hover:scale-110"
                            >
                                <LucideSmile className="w-4 h-4 text-gray-600" />
                            </button>
                            
                            <div className="flex-1 relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all duration-200 pr-12"
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
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <LucideX className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            
                            <button 
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
                                    isRecording 
                                        ? 'bg-red-500 text-white animate-pulse' 
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                <LucideMic className="w-4 h-4" />
                            </button>
                            
                            <button 
                                onClick={() => handleSend()}
                                disabled={loading || !input.trim()}
                                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                                    loading || !input.trim() 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed scale-95' 
                                        : 'bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:shadow-lg hover:scale-110 hover:rotate-12'
                                }`}
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <LucideSend className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-400 text-center">
                            {input.length}/500 caractères
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}