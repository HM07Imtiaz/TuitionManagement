import React from 'react';
import { 
  Container, 
  ProfilePic, 
  InfoContainer, 
  Name, 
  Qualification, 
  DetailsButton, 
  ButtonText 
} from './TeacherCardStyles';  // Import the styled components

const TeacherCard = ({ teacher, onPress }) => {
  return (
    <Container onPress={onPress}>
      <ProfilePic source={{ uri: teacher.profilePic }} />
      <InfoContainer>
        <Name>{teacher.fullName}</Name>
        <Qualification>{teacher.eduQualification}</Qualification>
      </InfoContainer>
      <DetailsButton onPress={onPress}>
        <ButtonText>View Details</ButtonText>
      </DetailsButton>
    </Container>
  );
};

export default TeacherCard;
