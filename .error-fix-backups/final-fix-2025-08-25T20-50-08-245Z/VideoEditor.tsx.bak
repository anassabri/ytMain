// VideoEditor - Enhanced Editor Component
import React, { useState, useCallback } from 'react';

interface VideoEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => Promise<void>;
  className?: string;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({
  initialValue = '',
  onChange,
  onSave,
  className = ''
}) => {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  const handleSave = useCallback(async () => {
    if (!onSave) return;
    
    try {
      setSaving(true);
      setError(null);
      await onSave(value);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [onSave, value]);

  return (
    <div className={`editor ${className}`}>
      <div className="editor-toolbar">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="save-button"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      
      {error && (
        <div className="editor-error">
          {error}
        </div>
      )}
      
      <div className="editor-content">
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="editor-textarea"
          placeholder="Start editing..."
        />
      </div>
    </div>
  );
};

export default VideoEditor;