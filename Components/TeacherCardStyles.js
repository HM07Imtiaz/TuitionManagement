import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 10px;
`;

export const ProfilePic = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;

export const InfoContainer = styled.View`
  flex: 1;
`;

export const Name = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: black;
`;

export const Qualification = styled.Text`
  font-size: 14px;
  color: #888;
`;

export const DetailsButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 8px;
  border-radius: 5px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;
