import React, { useState, useEffect } from 'react';
import { PlusCircleIcon, QueueListIcon } from '@heroicons/react/24/solid';
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { createUserPlaylist, getUserPlaylists } from '../services/realVideoService';
import type { UserPlaylistDetails } from '../types';

const PlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<UserPlaylistDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  useEffect(() => {
    const fetchPlaylists = async (): Promise<void> => {
      setLoading(true);
      try {
        const fetchedPlaylists = await getUserPlaylists();
        setPlaylists(fetchedPlaylists);
      } catch (error) {
        console.error('Failed to fetch user playlists:', error);
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!newPlaylistName.trim()) {
      setCreateError('Please enter a playlist name.');
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      const newPlaylist = await createUserPlaylist(newPlaylistName.trim());
      const playlistWithDetails: UserPlaylistDetails = {
        id: newPlaylist.id,
        title: newPlaylist.name || newPlaylistName.trim(),
        description: newPlaylist.description || '',
        videoIds: newPlaylist.videos?.map((v) => v.id) || [],
        videoCount: newPlaylist.videos?.length || 0,
        createdAt: newPlaylist.createdAt,
        updatedAt: newPlaylist.updatedAt
      };
      setPlaylists(prev => [playlistWithDetails, ...prev]);
      setIsCreateModalOpen(false);
      setNewPlaylistName('');
    } catch (error) {
      console.error('Failed to create playlist:', error);
      setCreateError('Failed to create playlist. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewPlaylistName('');
    setCreateError(null);
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 md:gap-x-5 gap-y-5 md:gap-y-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-neutral-800/60 rounded-xl shadow-sm animate-pulse">
          <div className="aspect-video bg-neutral-200 dark:bg-neutral-700 rounded-t-xl" />
          <div className="p-3 sm:p-4">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-1.5" />
            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-neutral-950">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <QueueListIcon className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-700 dark:text-neutral-300 mr-3" aria-hidden="true" />
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">Your Playlists</h1>
        </div>
        <button
          className="flex items-center justify-center px-4 py-2 bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-medium rounded-full text-sm transition-colors w-full sm:w-auto"
          title="Create a new playlist"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Create New Playlist
        </button>
      </div>

      {loading ? (
        renderSkeleton()
      ) : playlists.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 md:gap-x-5 gap-y-5 md:gap-y-6">
          {playlists.map((playlist) => (
            <Link to={`/playlist/${playlist.id}`} key={playlist.id} className="group block bg-white dark:bg-neutral-800/60 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="relative aspect-video bg-neutral-200 dark:bg-neutral-700">
                <img
                  src={playlist.thumbnailUrl || 'https://picsum.photos/seed/playlistplaceholder/320/180'}
                  alt={`Thumbnail for ${playlist.title}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayIcon className="w-12 h-12 text-white" aria-hidden="true" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 py-2 text-white">
                  <p className="text-xs font-semibold">{playlist.videoCount} video{playlist.videoCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-semibold text-neutral-800 dark:text-neutral-50 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 mb-0.5">{playlist.title}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                  Updated {new Date(playlist.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-lg">
          <QueueListIcon className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-6" aria-hidden="true" />
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">No Playlists Yet</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-md mx-auto mb-6">
            You haven't created or saved any playlists. Start organizing your favorite videos by creating a new playlist.
          </p>
        </div>
      )}

      {/* Create Playlist Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Create New Playlist</h2>
              <button onClick={closeCreateModal} className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700">
                <XMarkIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-300" />
              </button>
            </div>

            <form onSubmit={handleCreatePlaylist} className="p-4 space-y-4">
              <div>
                <label htmlFor="playlistName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Playlist Name
                </label>
                <input
                  id="playlistName"
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => {
                    setNewPlaylistName(e.target.value);
                    setCreateError(null);
                  }}
                  placeholder="Enter playlist name..."
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50"
                  maxLength={100}
                  autoFocus
                />
                {createError && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1">{createError}</p>
                )}
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                Privacy: Public (default)
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPlaylistName.trim() || isCreating}
                  className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;