import { gql } from '@apollo/client';

export const GET_TEACHER_DETAILS = gql`
  query GetTeacherDetails($userId: ID!) {
    teacher(userId: $userId) {
      userId
      fullName
      mobileNumber
      educationBackground
      gender
      address
      about
      eduQualification
      experience
      currentOccupation
      profilePic
      cv
      currentYear
      currentInstitution
    }
  }
`;
