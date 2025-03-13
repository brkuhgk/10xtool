/**
 * Quick Note Addon
 * Capture quick thoughts and ideas
 */
import React, { useState, useEffect, useRef } from 'react';
import { StickyNote, Save, Copy, Trash2, Clock } from 'lucide-react';
import './styles.css';

const QuickNote = () => {
  // State for note content and history
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [savedNotes, setSavedNotes] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Refs
  const textareaRef = useRef(null);
  
  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNote = localStorage.getItem('quickNote');
    const notesHistory = localStorage.getItem('quickNoteHistory');
    
    if (savedNote) {
      setNote(savedNote);
    } else {
      setNote('Stop reading my todos 😩');
    }
    
    if (notesHistory) {
      setSavedNotes(JSON.parse(notesHistory));
    }
  }, []);
  
  // Save note to localStorage when it changes
  useEffect(() => {
    if (note) {
      localStorage.setItem('quickNote', note);
    }
  }, [note]);
  
  // Autofocus textarea when editing
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);
  
  // Start editing
  const handleStartEditing = () => {
    setIsEditing(true);
  };
  
  // Save note
  const handleSaveNote = () => {
    setIsEditing(false);
    
    // Add to history if not already there
    if (note.trim() && !savedNotes.some(savedNote => savedNote.text === note)) {
      const newHistory = [
        { 
          id: Date.now(),
          text: note,
          date: new Date().toLocaleString()
        },
        ...savedNotes
      ].slice(0, 10); // Keep only 10 most recent notes
      
      setSavedNotes(newHistory);
      localStorage.setItem('quickNoteHistory', JSON.stringify(newHistory));
    }
  };
  
  // Update note content
  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };
  
  // Save note on Enter key (Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveNote();
    }
  };
  
  // Copy note to clipboard
  const handleCopyNote = () => {
    navigator.clipboard.writeText(note).then(() => {
      // Show a temporary success message
      const originalText = note;
      setNote('Copied to clipboard!');
      setTimeout(() => {
        setNote(originalText);
      }, 1000);
    });
  };
  
  // Clear note
  const handleClearNote = () => {
    // Save current note to history first
    if (note.trim()) {
      const newHistory = [
        { 
          id: Date.now(),
          text: note,
          date: new Date().toLocaleString()
        },
        ...savedNotes
      ].slice(0, 10);
      
      setSavedNotes(newHistory);
      localStorage.setItem('quickNoteHistory', JSON.stringify(newHistory));
    }
    
    // Clear current note
    setNote('');
    setIsEditing(false);
  };
  
  // Toggle history panel
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  
  // Load a note from history
  const loadHistoryNote = (savedNote) => {
    setNote(savedNote.text);
    setShowHistory(false);
    setIsEditing(false);
  };
  
  // Delete a note from history
  const deleteHistoryNote = (id) => {
    const newHistory = savedNotes.filter(note => note.id !== id);
    setSavedNotes(newHistory);
    localStorage.setItem('quickNoteHistory', JSON.stringify(newHistory));
  };
  
  return (
    <div className="quick-note-addon">
      <div className="quick-note-header">
        <div className="header-title">
          <StickyNote size={18} className="note-icon" />
          <h2 className="note-title">Quick Note</h2>
        </div>
        
        <div className="note-actions">
          <button 
            className="note-action-btn"
            onClick={toggleHistory}
            title="Note history"
          >
            <Clock size={16} />
          </button>
          <button 
            className="note-action-btn"
            onClick={handleCopyNote}
            title="Copy to clipboard"
          >
            <Copy size={16} />
          </button>
          <button 
            className="note-action-btn"
            onClick={handleClearNote}
            title="Clear note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="note-content">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={note}
            onChange={handleNoteChange}
            onBlur={handleSaveNote}
            onKeyDown={handleKeyDown}
            placeholder="Write your note here..."
            className="note-textarea"
          />
        ) : (
          <div 
            className="note-display"
            onClick={handleStartEditing}
          >
            {note || <span className="note-placeholder">Click to add a note</span>}
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="note-footer">
          <button 
            className="save-btn"
            onClick={handleSaveNote}
          >
            <Save size={14} />
            <span>Save</span>
          </button>
          <div className="note-hint">Press Enter to save, Shift+Enter for new line</div>
        </div>
      )}
      
      {showHistory && (
        <div className="note-history">
          <div className="history-header">
            <h3>Recent Notes</h3>
            <button 
              className="close-history-btn"
              onClick={toggleHistory}
            >
              ×
            </button>
          </div>
          
          {savedNotes.length === 0 ? (
            <div className="no-history">No saved notes yet</div>
          ) : (
            <ul className="history-list">
              {savedNotes.map(savedNote => (
                <li key={savedNote.id} className="history-item">
                  <div 
                    className="history-text"
                    onClick={() => loadHistoryNote(savedNote)}
                  >
                    <p>{savedNote.text.length > 50 ? 
                      savedNote.text.substring(0, 50) + '...' : 
                      savedNote.text}
                    </p>
                    <span className="history-date">{savedNote.date}</span>
                  </div>
                  <button 
                    className="delete-history-btn"
                    onClick={() => deleteHistoryNote(savedNote.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default QuickNote;