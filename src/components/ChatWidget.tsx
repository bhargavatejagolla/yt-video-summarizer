'use client';

import { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle } from 'lucide-react';
import { FeedbackWidget } from '@/components/FeedbackWidget';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setStreamingContent('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      if (!res.ok) throw new Error('Chat failed');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let assistantMsg = '';

      while (!done && reader) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          // Parse SSE: "data: {...}" lines
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6);
              if (jsonStr.trim() === '[DONE]') continue;
              try {
                const json = JSON.parse(jsonStr);
                const delta = json.choices?.[0]?.delta?.content || '';
                assistantMsg += delta;
                setStreamingContent(assistantMsg);
              } catch {}
            }
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: assistantMsg }]);
      setStreamingContent('');
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  return (
    <Sheet>
      <SheetTrigger
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-emerald-500 hover:bg-emerald-600 z-50 flex items-center justify-center cursor-pointer"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </SheetTrigger>
      <SheetContent side="right" className="w-96 bg-slate-900 border-slate-700 text-white p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-slate-700">
          <SheetTitle className="text-white">Ask about your notes</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 p-4">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-4 flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`inline-block px-3 py-2 rounded-lg max-w-[85%] ${msg.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'}`}>
                {msg.content}
              </div>
              {msg.role === 'assistant' && (
                <FeedbackWidget
                  contentType="chat_answer"
                  originalContent={msg.content}
                  metadata={{ question: messages[i - 1]?.content }}
                />
              )}
            </div>
          ))}
          {streamingContent && (
            <div className="flex justify-start mb-3">
              <span className="inline-block px-3 py-2 rounded-lg bg-slate-700 text-white max-w-[85%]">
                {streamingContent}
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <div className="p-4 border-t border-slate-700 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask a doubt..."
            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading} size="sm" className="bg-emerald-500 hover:bg-emerald-600">
            Send
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
