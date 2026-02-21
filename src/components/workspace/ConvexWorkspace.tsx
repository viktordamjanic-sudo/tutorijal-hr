'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api.js';
import { useState, useRef, useEffect } from 'react';
import ConvexWrapper from '../ConvexWrapper';

interface Message { role: 'user' | 'ai'; text: string; }

function ConvexWorkspaceInner({ taskId }: { taskId: string }) {
    const rawTasks = useQuery(api.tasks.getTasks);
    const task = rawTasks?.find(t => t._id.toString() === taskId);
    const [userPrompt, setUserPrompt] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    if (rawTasks === undefined) {
        return (
            <div className="cw-loading">
                <div className="cw-spinner" />
                <span>Učitavanje zadatka...</span>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="cw-error">
                <div className="cw-error-icon">😕</div>
                <h3>Zadatak nije pronađen</h3>
                <p>Ovaj zadatak možda više nije dostupan.</p>
                <a href="/" className="cw-back-btn">← Natrag na početnu</a>
            </div>
        );
    }

    const handleSend = async () => {
        if (!userPrompt.trim() || isLoading) return;
        const prompt = userPrompt.trim();
        setMessages((prev: Message[]) => [...prev, { role: 'user', text: prompt }]);
        setUserPrompt('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    taskId: task._id.toString(),
                    context: `Zadatak: ${task.title}\nScenarij: ${task.scenario}\nProblem: ${task.problem}`
                })
            });

            const data = await res.json();

            if (res.status === 401) {
                setMessages((prev: Message[]) => [...prev, {
                    role: 'ai',
                    text: '🔒 Moraš biti prijavljen/a za korištenje AI asistenta. Klikni "Prijava" u gornjem desnom kutu.'
                }]);
            } else if (res.status === 429) {
                setMessages((prev: Message[]) => [...prev, {
                    role: 'ai',
                    text: '⏳ Previše zahtjeva — dozvoljeno je 5 poruka po minuti. Pričekaj malo pa pokušaj ponovo.'
                }]);
            } else if (!res.ok || data.error) {
                setMessages((prev: Message[]) => [...prev, {
                    role: 'ai',
                    text: '⚠️ ' + (data.error || `Greška (${res.status}).`)
                }]);
            } else {
                // API returns { response: "..." }
                setMessages((prev: Message[]) => [...prev, {
                    role: 'ai',
                    text: data.response || 'AI je odgovorio, ali nema teksta.'
                }]);
            }
        } catch {
            setMessages((prev: Message[]) => [...prev, {
                role: 'ai',
                text: '⚠️ Ne mogu kontaktirati AI. Provjeri internet vezu.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const diffLabel = task.difficulty === 'beginner' ? 'Početnik' : task.difficulty === 'intermediate' ? 'Srednji' : 'Napredni';
    const diffColor = task.difficulty === 'beginner' ? '#059669' : task.difficulty === 'intermediate' ? '#d97706' : '#dc2626';

    return (
        <>
            {/* Top bar */}
            <div className="cw-topbar">
                <a href="/" className="cw-back">← Natrag</a>
                <div className="cw-title-row">
                    <span className="cw-icon">{task.icon}</span>
                    <span className="cw-title">{task.title}</span>
                </div>
                <div className="cw-status">
                    <span className="cw-status-dot" /> Online
                </div>
            </div>

            {/* Chat scroll */}
            <div className="cw-scroll" ref={scrollRef}>
                <div className="cw-content">
                    {/* Task card */}
                    <div className="cw-task-card">
                        <div className="cw-chips">
                            <span className="cw-chip">{task.category || 'Zadatak'}</span>
                            <span className="cw-chip cw-chip-diff" style={{ color: diffColor }}>{diffLabel}</span>
                        </div>
                        <div className="cw-block">
                            <div className="cw-block-label">Kontekst</div>
                            <p className="cw-block-text">{task.scenario}</p>
                        </div>
                        <div className="cw-block cw-block-goal">
                            <div className="cw-block-label" style={{ color: '#4f6ef7' }}>🎯 Cilj</div>
                            <p className="cw-block-text" style={{ fontWeight: 600, color: '#1e1e1e' }}>{task.problem}</p>
                        </div>
                        <div className="cw-block cw-block-hint">
                            <div className="cw-block-label" style={{ color: '#7c3aed' }}>✨ Prijedlog prompta</div>
                            <p className="cw-block-text" style={{ fontSize: 13 }}>{task.aiPrompt}</p>
                        </div>
                    </div>

                    {/* AI greeting */}
                    <div className="cw-msg cw-msg-ai">
                        <div className="cw-avatar cw-avatar-ai">AI</div>
                        <div className="cw-bubble cw-bubble-ai">
                            Spreman sam! Upiši prompt ispod ili koristi prijedlog iz zadatka.
                        </div>
                    </div>

                    {/* Messages */}
                    {messages.map((msg: Message, i: number) => (
                        <div key={i} className={`cw-msg ${msg.role === 'user' ? 'cw-msg-user' : 'cw-msg-ai'}`}>
                            {msg.role === 'ai' && <div className="cw-avatar cw-avatar-ai">AI</div>}
                            <div className={`cw-bubble ${msg.role === 'user' ? 'cw-bubble-user' : 'cw-bubble-ai'}`}
                                style={{ whiteSpace: 'pre-wrap' }}>
                                {msg.text}
                            </div>
                            {msg.role === 'user' && <div className="cw-avatar cw-avatar-user">Ja</div>}
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="cw-msg cw-msg-ai">
                            <div className="cw-avatar cw-avatar-ai">AI</div>
                            <div className="cw-bubble cw-bubble-ai" style={{ color: '#9ca3af' }}>
                                Razmišlja<span className="cw-dot">.</span><span className="cw-dot cw-dot-2">.</span><span className="cw-dot cw-dot-3">.</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input area */}
            <div className="cw-input-area">
                <div className="cw-composer">
                    <button
                        className="cw-suggest"
                        onClick={() => { setUserPrompt(task.aiPrompt); }}
                    >✨ Koristi prijedlog</button>
                    <div className="cw-input-row">
                        <textarea
                            value={userPrompt}
                            onChange={e => setUserPrompt(e.target.value)}
                            placeholder="Upiši svoj prompt ovdje..."
                            rows={1}
                            onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 140) + 'px'; }}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        />
                        <button
                            className="cw-send"
                            onClick={handleSend}
                            disabled={isLoading || !userPrompt.trim()}
                            title="Pošalji (Enter)"
                        >
                            {isLoading ? '⏳' : '→'}
                        </button>
                    </div>
                    <p className="cw-hint">Enter za slanje · Shift+Enter za novi red</p>
                </div>
            </div>
        </>
    );
}

export default function ConvexWorkspace({ taskId }: { taskId: string }) {
    return (
        <ConvexWrapper>
            <ConvexWorkspaceInner taskId={taskId} />
        </ConvexWrapper>
    );
}
