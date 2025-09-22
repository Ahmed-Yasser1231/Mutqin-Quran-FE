import React from 'react';
import UserProfileView from './UserProfileView.jsx';

/**
 * Profile page component that renders the user profile
 * This can be used as a page component in your routing setup
 */
export default function ProfilePage() {
  return (
    <div>
      <UserProfileView />
    </div>
  );
}

// Export individual components for flexibility
export { UserProfileView };
export { default as userProfileService } from './userProfileService.js';
export { useUserProfileViewModel } from './UserProfileViewModel.js';