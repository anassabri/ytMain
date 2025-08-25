import _React, { lazy } from 'react';
import AccountLayout from '../components/AccountLayout';
import ErrorBoundary from '../components/ErrorBoundary';
import Layout from '../components/Layout';
import StudioLayout from '../components/StudioLayout';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
// Import HomePage directly for faster initial load
import HomePage from '../pages/HomePage';

// Lazy load secondary components for better performance
// HomePage is loaded directly for faster initial render
const WatchPage = lazy(() => import('../pages/WatchPage'));
const SearchResultsPage = lazy(() => import('../pages/SearchResultsPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const TrendingPage = lazy(() => import('../pages/TrendingPage'));
const ShortsPage = lazy(() => import('../pages/ShortsPage'));
const SubscriptionsPage = lazy(() => import('../pages/SubscriptionsPage'));
const HistoryPage = lazy(() => import('../pages/HistoryPage'));
const WatchLaterPage = lazy(() => import('../pages/WatchLaterPage'));
const LikedVideosPage = lazy(() => import('../pages/LikedVideosPage'));
const ChannelPage = lazy(() => import('../pages/ChannelPage'));
const UserPage = lazy(() => import('../pages/UserPage'));
const PlaylistsPage = lazy(() => import('../pages/PlaylistsPage'));
const PlaylistDetailPage = lazy(() => import('../pages/PlaylistDetailPage'));
const LibraryPage = lazy(() => import('../pages/LibraryPage'));
const YourDataPage = lazy(() => import('../pages/YourDataPage'));
const GoLivePage = lazy(() => import('../pages/GoLivePage'));
const LiveStreamingHubPage = lazy(() => import('../pages/LiveStreamingHubPage'));
const AIContentSparkPage = lazy(() => import('../pages/AIContentSparkPage'));
const VideoUploadPage = lazy(() => import('../pages/VideoUploadPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const AdminPage = lazy(() => import('../pages/AdminPage'));

// Studio pages
const StudioPage = lazy(() => import('../pages/StudioPage'));
const UploadPage = lazy(() => import('../pages/UploadPage'));
const StudioDashboardPage = lazy(() => import('../pages/StudioDashboardPage'));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));
const CommentModerationPage = lazy(() => import('../pages/CommentModerationPage'));
const MonetizationPage = lazy(() => import('../pages/MonetizationPage'));
const ContentManagerPage = lazy(() => import('../pages/ContentManagerPage'));
const CreatorStudioPage = lazy(() => import('../pages/CreatorStudioPage'));
const CommunityPage = lazy(() => import('../pages/CommunityPage'));
const PlaylistManagerPage = lazy(() => import('../pages/PlaylistManagerPage'));
const ChannelCustomizationPage = lazy(() => import('../pages/ChannelCustomizationPage'));
const VideoEditorPage = lazy(() => import('../pages/VideoEditorPage'));

// Debug components
const TestMetadataFetch = lazy(() => import('../debug/TestMetadataFetch'));
const GoogleSearchStoreDebug = lazy(() => import('../debug/GoogleSearchStoreDebug'));

// Route configuration for main application
export const mainRoutes: RouteObject[] = [
 {
 path: '/',
 element: <Layout />,
 errorElement: <ErrorBoundary />,
 children: [
 {
 index: true,
 element: <HomePage /> },
 {
 path: 'watch/:videoId',
 element: <WatchPage /> },
 {
 path: 'watch',
 element: <WatchPage /> },
 {
 path: 'search',
 element: <SearchResultsPage /> },
 {
 path: 'trending',
 element: <TrendingPage /> },
 {
 path: 'shorts',
 element: <ShortsPage /> },
 {
 path: 'subscriptions',
 element: <SubscriptionsPage /> },
 {
 path: 'history',
 element: <HistoryPage /> },
 {
 path: 'watch-history',
 element: <HistoryPage /> },
 {
 path: 'playlists',
 element: <PlaylistsPage /> },
 {
 path: 'playlist/:playlistId',
 element: <PlaylistDetailPage /> },
 {
 path: 'watch-later',
 element: <WatchLaterPage /> },
 {
 path: 'liked-videos',
 element: <LikedVideosPage /> },
 {
 path: 'channel/:channelIdOrName',
 element: <ChannelPage /> },
 {
 path: 'user/:userName',
 element: <UserPage /> },
 {
 path: 'library',
 element: <LibraryPage /> },
 {
 path: 'your-data',
 element: <YourDataPage /> },
 {
 path: 'go-live',
 element: <GoLivePage /> },
 {
 path: 'live-hub',
 element: <LiveStreamingHubPage /> },
 {
 path: 'live',
 element: <LiveStreamingHubPage /> },
 {
 path: 'ai-content-spark',
 element: <AIContentSparkPage /> },
 {
 path: 'upload',
 element: <VideoUploadPage /> },
 {
 path: 'debug-metadata',
 element: <TestMetadataFetch /> },
 {
 path: 'debug-google-search',
 element: <GoogleSearchStoreDebug /> },
 {
 path: 'settings',
 element: <SettingsPage /> },
 {
 path: 'admin',
 element: <AdminPage /> },
 {
 path: 'studio',
 element: <StudioPage /> },
 {
 path: 'studio/upload',
 element: <UploadPage /> },
 // Account section with nested routes and dedicated layout
 {
 path: 'account',
 element: <AccountLayout />,
 children: [
 {
 path: 'settings',
 element: <SettingsPage /> },
 {
 path: 'privacy',
 element: <SettingsPage /> // Can be replaced with dedicated privacy page later
 },
 {
 path: 'data',
 element: <YourDataPage /> }] },
 {
 path: 'analytics',
 element: <AnalyticsPage /> },
 // Redirect for legacy content-manager route
 {
 path: 'content-manager',
 element: <ContentManagerPage /> }] }];

// Route configuration for studio
export const studioRoutes: RouteObject[] = [
 {
 path: 'studio',
 element: <StudioLayout />,
 errorElement: <ErrorBoundary />,
 children: [
 {
 index: true,
 element: <StudioDashboardPage /> },
 {
 path: 'analytics',
 element: <AnalyticsPage /> },
 {
 path: 'comments',
 element: <CommentModerationPage /> },
 {
 path: 'monetization',
 element: <MonetizationPage /> },
 {
 path: 'content',
 element: <ContentManagerPage /> },
 {
 path: 'creator',
 element: <CreatorStudioPage /> },
 {
 path: 'community',
 element: <CommunityPage /> },
 {
 path: 'playlists',
 element: <PlaylistManagerPage /> },
 {
 path: 'customization',
 element: <ChannelCustomizationPage /> },
 {
 path: 'editor',
 element: <VideoEditorPage /> }] }];

// Authentication routes (outside main layout)
const authRoutes: RouteObject[] = [
 {
 path: '/login',
 element: (
 <ProtectedRoute requireAuth={false}>
 <LoginPage />
// FIXED:  </ProtectedRoute>
 ),
 errorElement: <ErrorBoundary /> },
 {
 path: '/register',
 element: (
 <ProtectedRoute requireAuth={false}>
 <RegisterPage />
// FIXED:  </ProtectedRoute>
 ),
 errorElement: <ErrorBoundary /> }];

// Combined route configuration
export const routes: RouteObject[] = [...mainRoutes, ...studioRoutes, ...authRoutes];
