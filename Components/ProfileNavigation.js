import React from 'react';
import { View } from 'react-native';
import ProfileStudent from '../Screens/ProfileStudent';
import Profile from '../Screens/Profile';
import ProfileParent from '../Screens/ProfileParent';

const ProfileNavigation = ({ userType }) => {
  console.log(userType);
  return (
    <View>
      {<Profile/>}
      {userType === 'Student' && <ProfileStudent />}
      {userType === 'Tutor' && <Profile />}
      {userType === 'Parent' && <ProfileParent />}
    </View>
  );
};

export default ProfileNavigation;
