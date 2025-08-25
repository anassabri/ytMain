import React, { useState } from 'react';

interface CommentModerationPageProps {
  className?: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  videoTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  flagReason?: string;
}

const CommentModerationPage: React.FC<CommentModerationPageProps> = ({ className }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'flagged' | 'approved' | 'rejected'>('pending');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'User123',
      content: 'Great video! Really helpful tutorial.',
      timestamp: '2 hours ago',
      videoTitle: 'React Tutorial for Beginners',
      status: 'pending'
    },
    {
      id: '2',
      author: 'VideoFan',
      content: 'This is spam content with inappropriate links.',
      timestamp: '4 hours ago',
      videoTitle: 'JavaScript Basics',
      status: 'pending',
      flagReason: 'Spam'
    },
    {
      id: '3',
      author: 'LearnerX',
      content: 'Could you make a video about advanced topics?',
      timestamp: '1 day ago',
      videoTitle: 'CSS Grid Layout',
      status: 'approved'
    }
  ]);

  const handleCommentAction = (commentId: string, action: 'approve' | 'reject') => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, status: action === 'approve' ? 'approved' : 'rejected' }
        : comment
    ));
  };

  const filteredComments = comments.filter(comment => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'flagged') return comment.flagReason;
    return comment.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`comment-moderation-page ${className || ''}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Comment Moderation</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700">Pending Review</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {comments.filter(c => c.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700">Flagged</h3>
            <p className="text-3xl font-bold text-red-600">
              {comments.filter(c => c.flagReason).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700">Approved Today</h3>
            <p className="text-3xl font-bold text-green-600">
              {comments.filter(c => c.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700">Rejected Today</h3>
            <p className="text-3xl font-bold text-red-600">
              {comments.filter(c => c.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex space-x-4 mb-6">
            {(['all', 'pending', 'flagged', 'approved', 'rejected'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedFilter === filter
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                {filter !== 'all' && (
                  <span className="ml-2 text-xs">
                    ({filter === 'flagged' 
                      ? comments.filter(c => c.flagReason).length
                      : comments.filter(c => c.status === filter).length
                    })
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {filteredComments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No comments found for the selected filter.</p>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{comment.author}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(comment.status)}`}>
                          {comment.status}
                        </span>
                        {comment.flagReason && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                            🚩 {comment.flagReason}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">On: {comment.videoTitle}</p>
                      <p className="text-gray-500 text-xs">{comment.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <p className="text-gray-800">{comment.content}</p>
                  </div>
                  
                  {comment.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleCommentAction(comment.id, 'approve')}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleCommentAction(comment.id, 'reject')}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                      >
                        Reject
                      </button>
                      <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm">
                        Hold for Review
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Moderation Settings */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Moderation Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Auto-moderation</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Hold potentially inappropriate comments for review</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Block links in comments</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Require approval for all comments</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Blocked Words</h3>
              <textarea
                className="w-full border rounded p-2 text-sm"
                rows={4}
                placeholder="Enter words to automatically block (one per line)"
              />
              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
                Save Blocked Words
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModerationPage;