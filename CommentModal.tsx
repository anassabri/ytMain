import React, { useState, FC } from 'react';

import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';

import BaseModal from 'BaseModal.tsx';

interface CommentModalProps {
 isOpen: boolean;
 onClose: () => void;
 shortId: string;
 shortTitle?: string;
 onCommentSubmit?: (commentText) => void
}

/**
 * Comment modal specifically designed for shorts
 * Allows users to comment on short videos without navigating away
 */
const CommentModal: React.FC<CommentModalProps> = ({
 isOpen,
 onClose,
 shortId: _shortId,
 shortTitle,
 onCommentSubmit }) => {
 const [commentText, setCommentText] = useState<string>('');
 const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
 // shortId is currently not used but kept for future functionality

 const handleCommentSubmit = async (text): Promise<any> => {
 if (!text.trim()) {
return;
}

 setIsSubmitting(true);
 try {
 // Call the provided submit handler or default behavior
 if (onCommentSubmit as any) {
 await onCommentSubmit(text);
 } else {
 // Default behavior - you can implement API call here
 }

 setCommentText('');
 onClose();
 } catch (error) {
 (console as any).error('Failed to submit comment:', error);
 } finally {
 setIsSubmitting(false);
 }
 };

 const modalFooter = (
 <div className="flex justify-end space-x-3">
 <button
 type="button"
 onClick={(e) => onClose()}
 className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
 disabled={isSubmitting}
 >
 Cancel
 </button>
 <button
 type="button"
 onClick={() => handleCommentSubmit(commentText)}
 disabled={!commentText.trim() || isSubmitting}
 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {isSubmitting ? 'Posting...' : 'Comment'}
 </button>
 </div>
 );

 return (
 <BaseModal
 isOpen={isOpen}
 onClose={onClose}
 title="Add a comment"
 size="md"
 footer={modalFooter}
 >
 <div className="space-y-4">
 {shortTitle && (
 <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
 <ChatBubbleOvalLeftIcon className="w-4 h-4" />
 <span>Commenting on: {shortTitle}</span>
 </div>
 )}

 <div>
 <label htmlFor="comment-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
 Your comment
 </label>
 <textarea
 id="comment-text"
 rows={4}
 value={commentText}
 onChange={(e) => setCommentText(e.target.value)}
 placeholder="Share your thoughts about this short..."
 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none"
 maxLength={500}
 disabled={isSubmitting}
 />
 <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
 {commentText.length}/500
 </div>
 </div>
 </div>
 </BaseModal>
 );
};

export default CommentModal;