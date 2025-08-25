import React from 'react';
interface AdvancedLiveChatProps {
 streamId: string;
 className?: string;
 isOwner?: boolean;
 isModerator?: boolean;
}

const AdvancedLiveChat: React.FC<AdvancedLiveChatProps> = ({
 streamId,
 className,
 isOwner,
 isModerator }) => {
 return (
 <div className={className}>
 <div className='p-4'>
 <h3 className='text-lg font-semibold mb-4'>Live Chat</h3>
 <div className='text-gray-500'>
 Chat for stream {streamId} will be implemented here.
 {isOwner && (
 <div className='text-xs mt-2'>Owner controls available</div>
 )}
 {isModerator && (
 <div className='text-xs mt-2'>Moderator controls available</div>
 )}
// FIXED:  </div>
// FIXED:  </div>
// FIXED:  </div>
 );
};

export default AdvancedLiveChat;
