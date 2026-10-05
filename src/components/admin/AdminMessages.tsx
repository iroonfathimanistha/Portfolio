import React from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../common/Toast';
import { Mail, Check, Trash2, Clock, User, MessageSquare } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const { messages, markMessageRead, deleteMessage } = useData();
  const { toast } = useToast();

  const handleMarkRead = (id: string) => {
    markMessageRead(id);
    toast('Message marked as read', 'info');
  };

  const handleDelete = (id: string) => {
    deleteMessage(id);
    toast('Message deleted from inbox', 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-100">
          Contact Inquiries & Messages
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Review incoming communications submitted through the public contact form.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[#232a36] bg-[#0f131a] text-slate-500">
          <MessageSquare className="w-8 h-8 mx-auto mb-3 text-slate-600" />
          <p className="text-sm">No incoming inquiries received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-all ${
                !msg.read
                  ? 'bg-[#121722] border-emerald-500/40 shadow-lg'
                  : 'bg-[#0f131a] border-[#232a36]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-200">
                      {msg.name}{' '}
                      <span className="text-slate-500 font-normal font-mono text-xs">
                        &lt;{msg.email}&gt;
                      </span>
                    </h3>
                    <p className="text-xs font-mono text-emerald-400 font-semibold">
                      Subject: {msg.subject}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {msg.receivedAt}
                  </span>
                  {!msg.read && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                      New
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#090b10] border border-[#232a36] text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {msg.message}
              </div>

              <div className="flex items-center justify-end gap-3 text-xs">
                {!msg.read && (
                  <button
                    onClick={() => handleMarkRead(msg.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#161b24] hover:bg-[#1e2533] text-emerald-400 font-medium flex items-center gap-1.5 transition-colors border border-[#232a36]"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Read</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium flex items-center gap-1.5 transition-colors border border-rose-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
