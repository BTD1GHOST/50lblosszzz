import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { JOURNAL_PROMPTS, AFFIRMATIONS } from '../data/badges';

const MOODS = [
  { val: 1, emoji: '😫', label: 'Terrible' },
  { val: 2, emoji: '😔', label: 'Bad' },
  { val: 3, emoji: '😐', label: 'Okay' },
  { val: 4, emoji: '😊', label: 'Good' },
  { val: 5, emoji: '🔥', label: 'FIRE' },
];

type JournalTab = 'write' | 'entries' | 'affirmations' | 'future';

export default function Journal() {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry, futureLetter, setFutureLetter, customAffirmations, addAffirmation, deleteAffirmation } = useStore();
  const [activeTab, setActiveTab] = useState<JournalTab>('write');
  const [text, setText] = useState('');
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [tags, setTags] = useState('');
  const [prompt, setPrompt] = useState('');
  const [search, setSearch] = useState('');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [newAffirmation, setNewAffirmation] = useState('');
  const [futureText, setFutureText] = useState(futureLetter?.text || '');
  const [unlockDate, setUnlockDate] = useState(futureLetter?.unlockDate || '');
  const [letterSaved, setLetterSaved] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const randomPrompt = () => {
    const p = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
    setPrompt(p);
    setText(`${p}\n\n`);
  };

  const handleSave = () => {
    if (!text.trim()) return;
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    addJournalEntry({ date: today, text, mood, tags: tagList, prompt });
    setText('');
    setTags('');
    setPrompt('');
    setMood(3);
    setActiveTab('entries');
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const filteredEntries = useMemo(() => {
    return journalEntries.filter(e => {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return (
        e.text.toLowerCase().includes(searchLower) ||
        e.tags.some(t => t.toLowerCase().includes(searchLower)) ||
        e.date.includes(search)
      );
    });
  }, [journalEntries, search]);

  const isLetterUnlocked = futureLetter ? new Date(futureLetter.unlockDate) <= new Date() : false;

  return (
    <div className="pb-24 px-4 space-y-4">
      <div className="pt-6">
        <h1 className="text-2xl font-black text-white">JOURNAL</h1>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {([
          { val: 'write', label: '✍️ Write' },
          { val: 'entries', label: '📖 Entries' },
          { val: 'affirmations', label: '💪 Affirmations' },
          { val: 'future', label: '📬 Future Self' },
        ] as const).map(tab => (
          <button
            key={tab.val}
            onClick={() => setActiveTab(tab.val)}
            className={`flex-none px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.val ? 'bg-cyan-500 text-black' : 'bg-gray-900 text-gray-400 border border-gray-800'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* WRITE TAB */}
      {activeTab === 'write' && (
        <div className="space-y-4">
          {/* Mood */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
            <div className="text-gray-400 text-xs mb-3">HOW'S TODAY?</div>
            <div className="flex justify-around">
              {MOODS.map(m => (
                <button
                  key={m.val}
                  onClick={() => setMood(m.val as 1 | 2 | 3 | 4 | 5)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${mood === m.val ? 'bg-cyan-500/20 scale-110' : ''}`}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-xs text-gray-400">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          {prompt && (
            <div className="bg-gray-900 border border-cyan-500/30 rounded-xl p-3">
              <div className="text-cyan-400 text-xs font-bold mb-1">TODAY'S PROMPT</div>
              <div className="text-gray-300 text-sm">{prompt}</div>
            </div>
          )}

          <button
            onClick={randomPrompt}
            className="w-full py-2.5 bg-gray-900 border border-dashed border-gray-700 rounded-xl text-gray-400 font-bold text-sm hover:border-cyan-500 hover:text-cyan-400 transition-all"
          >
            🎲 Give Me a Prompt
          </button>

          {/* Text area */}
          <textarea
            className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-4 py-4 text-white text-base outline-none focus:border-cyan-500 min-h-48 resize-none leading-relaxed"
            placeholder="Write about your day, your wins, your struggles..."
            value={text}
            onChange={e => setText(e.target.value)}
          />

          <div className="text-gray-600 text-xs text-right">{wordCount} words</div>

          {/* Tags */}
          <input
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
            placeholder="Tags: #win, #struggle, #motivation..."
            value={tags}
            onChange={e => setTags(e.target.value)}
          />

          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className="w-full py-4 bg-cyan-500 disabled:bg-gray-800 disabled:text-gray-600 rounded-2xl text-black font-black text-xl active:scale-95 transition-transform"
          >
            SAVE ENTRY
          </button>
        </div>
      )}

      {/* ENTRIES TAB */}
      {activeTab === 'entries' && (
        <div className="space-y-4">
          <input
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
            placeholder="🔍 Search entries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="text-gray-500 text-sm">{filteredEntries.length} entries</div>

          {filteredEntries.map(entry => {
            const moodEmoji = MOODS.find(m => m.val === entry.mood)?.emoji;
            const isExpanded = expandedEntry === entry.id;
            const isEditing = editingEntry === entry.id;
            return (
              <div key={entry.id} className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                  className="w-full px-4 py-4 text-left"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-gray-400 text-sm">{entry.date}</div>
                      <div className="text-white font-medium mt-1 line-clamp-2">
                        {entry.text.substring(0, 100)}{entry.text.length > 100 ? '...' : ''}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.map(tag => (
                          <span key={tag} className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-2xl ml-2">{moodEmoji}</div>
                  </div>
                  <div className="text-gray-600 text-xs mt-2">{entry.wordCount} words • {isExpanded ? '▲' : '▼'}</div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-800 px-4 py-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <textarea
                          autoFocus
                          className="w-full bg-gray-900 border border-cyan-500 rounded-xl px-3 py-3 text-white outline-none min-h-32 resize-none"
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => setEditingEntry(null)} className="flex-1 py-2 bg-gray-800 rounded-xl text-gray-300">Cancel</button>
                          <button
                            onClick={() => { updateJournalEntry(entry.id, { text: editText }); setEditingEntry(null); }}
                            className="flex-1 py-2 bg-cyan-500 rounded-xl text-black font-bold"
                          >Save</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                        {entry.prompt && (
                          <p className="text-gray-600 text-xs mt-3 italic">Prompt: {entry.prompt}</p>
                        )}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => { setEditingEntry(entry.id); setEditText(entry.text); }}
                            className="flex-1 py-2 bg-gray-800 rounded-xl text-gray-300 text-sm font-bold"
                          >✏️ Edit</button>
                          <button
                            onClick={() => deleteJournalEntry(entry.id)}
                            className="px-4 py-2 bg-red-900/30 rounded-xl text-red-400 text-sm font-bold"
                          >🗑️ Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredEntries.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-3">📔</div>
              <div>No entries yet.</div>
              <div className="text-sm">Start writing in the Write tab!</div>
            </div>
          )}
        </div>
      )}

      {/* AFFIRMATIONS TAB */}
      {activeTab === 'affirmations' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {[...AFFIRMATIONS, ...customAffirmations].map((aff, i) => (
              <div key={i} className="bg-gray-950 border border-cyan-500/20 rounded-2xl p-4 flex justify-between items-start gap-3">
                <p className="text-white font-semibold flex-1 leading-snug">"{aff}"</p>
                {i >= AFFIRMATIONS.length && (
                  <button onClick={() => deleteAffirmation(aff)} className="text-red-500 shrink-0">×</button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-3 py-3 text-white outline-none focus:border-cyan-500"
              placeholder="Add your own affirmation..."
              value={newAffirmation}
              onChange={e => setNewAffirmation(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && newAffirmation.trim()) {
                  addAffirmation(newAffirmation.trim());
                  setNewAffirmation('');
                }
              }}
            />
            <button
              onClick={() => { if (newAffirmation.trim()) { addAffirmation(newAffirmation.trim()); setNewAffirmation(''); } }}
              className="px-4 py-3 bg-cyan-500 rounded-xl text-black font-bold"
            >+</button>
          </div>
        </div>
      )}

      {/* FUTURE SELF TAB */}
      {activeTab === 'future' && (
        <div className="space-y-4">
          {futureLetter?.locked && !isLetterUnlocked ? (
            <div className="bg-gray-950 border border-yellow-500/30 rounded-2xl p-6 text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-white font-black text-xl mb-2">Letter Locked</h3>
              <p className="text-gray-400">Your letter to your future self is sealed until:</p>
              <p className="text-yellow-400 font-black text-2xl mt-2">{futureLetter.unlockDate}</p>
            </div>
          ) : futureLetter?.locked && isLetterUnlocked ? (
            <div className="bg-gray-950 border border-green-500/30 rounded-2xl p-6">
              <div className="text-center mb-4">
                <div className="text-5xl">📬</div>
                <h3 className="text-white font-black text-xl mt-2">Your Letter Has Arrived!</h3>
              </div>
              <p className="text-white leading-relaxed whitespace-pre-wrap">{futureLetter.text}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4">
                <p className="text-gray-400 text-sm">
                  Write a letter to your future self. Set a date when it will unlock. Use it as motivation — remind yourself why you started.
                </p>
              </div>
              <textarea
                className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-4 py-4 text-white text-base outline-none focus:border-cyan-500 min-h-48 resize-none leading-relaxed"
                placeholder="Dear future me...&#10;&#10;Today I weighed ___ lbs and I'm about to change everything...&#10;&#10;The reason I started is because..."
                value={futureText}
                onChange={e => setFutureText(e.target.value)}
              />
              <div>
                <label className="text-gray-400 text-sm mb-1 block">UNLOCK DATE</label>
                <input
                  type="date"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                  value={unlockDate}
                  onChange={e => setUnlockDate(e.target.value)}
                />
              </div>
              <button
                onClick={() => {
                  if (futureText.trim() && unlockDate) {
                    setFutureLetter({ text: futureText, unlockDate, locked: true });
                    setLetterSaved(true);
                    setTimeout(() => setLetterSaved(false), 2000);
                  }
                }}
                disabled={!futureText.trim() || !unlockDate}
                className="w-full py-4 bg-yellow-500 disabled:bg-gray-800 disabled:text-gray-600 rounded-2xl text-black font-black text-lg"
              >
                {letterSaved ? '✓ LOCKED & SEALED' : '🔒 SEAL THE LETTER'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
