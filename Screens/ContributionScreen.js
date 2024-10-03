import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { firebase } from '../firebaseConfig';

const ContributionScreen = () => {
  const [data, setData] = useState({ posts: 0, comments: 0, mediaLinks: 0 });
  const [contribution, setContribution] = useState(0);
  const [remark, setRemark] = useState('');

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;

    const fetchData = async () => {
      try {
        const postQuery = await firebase.firestore().collection('posts').where('userId', '==', userId).get();
        const commentQuery = await firebase.firestore().collection('comments').where('userId', '==', userId).get();

        const mediaDoc = await firebase.firestore().collection('mediaLinks').doc(userId).get();
        const mediaLinks = mediaDoc.exists ? mediaDoc.data().links.length : 0;

        const posts = postQuery.size;
        const comments = commentQuery.size;
        
        // Calculate contribution based on posts and comments
        let contributionValue = posts * 3 + comments;
        if (contributionValue > 100) contributionValue = 100; // Cap at 100%

        // Determine remark based on contribution percentage
        let remarkText = '';
        if (contributionValue === 0) remarkText = 'Zero Contribution';
        else if (contributionValue <= 10) remarkText = 'Negligible Contribution';
        else if (contributionValue < 40) remarkText = 'Less Contribution';
        else if (contributionValue < 60) remarkText = 'Moderate Contribution';
        else if (contributionValue < 80) remarkText = 'Good Contribution';
        else remarkText = 'Excellent Contribution';

        setData({ posts, comments, mediaLinks });
        setContribution(contributionValue);
        setRemark(remarkText);
      } catch (error) {
        console.error('Error fetching contribution data: ', error);
      }
    };

    fetchData();
  }, []);

  const barChartData = {
    labels: ['Posts', 'Comments', 'Media'],
    datasets: [
      {
        data: [data.posts, data.comments, data.mediaLinks],
      },
    ],
  };

  const pieChartData = [
    {
      name: 'Contribution',
      percentage: contribution,
      color: '#f00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Remaining',
      percentage: 100 - contribution,
      color: '#ddd',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <View style={{ textAlign: 'center', padding: 2, paddingTop: 5, margin:5, marginTop: 15, borderColor: 'black', borderWidth: 1 }}>
      <Text style={{ textAlign: 'center', fontSize: 20, margin: 20, fontWeight: 'bold', color: 'green', borderColor: 'black', borderWidth: 2, borderBottomWidth: 5, borderBottomColor: 'blue', borderLeftWidth: 5, borderLeftColor: 'blue', }}>Your Contribution Report</Text>
      <Text style={{ textAlign: 'center', fontSize: 16, margin: 10, marginBottom: 20, borderBottomWidth: 5, borderBottomColor: 'lightblue', }}>Number of your Posts, Comments and stored Medias are shown below:</Text>
      <BarChart
        data={barChartData}
        width={screenWidth-15}
        height={220}
        yAxisLabel=""
        fromZero={true} 
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#001101',
          backgroundGradientTo: '#11f0ff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        verticalLabelRotation={0}
      />
      
      <Text style={{ textAlign: 'center', fontSize: 16, paddingTop: 10, marginTop: 20, marginBottom: 10, borderTopWidth: 5, borderTopColor: 'lightblue',borderBottomWidth: 5, borderBottomColor: 'lightblue', }}>What kind of Contributor you are:</Text>
      <Text style={{ textAlign: 'center', fontSize: 18, marginTop: 10 }}>Contribution: {contribution}%</Text>
      <PieChart
        data={pieChartData}
        width={screenWidth-15}
        height={200}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={'percentage'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        center={[0, 0]}
        absolute
      />
      <Text style={{ textAlign: 'center', fontSize: 18, marginTop: 20, marginBottom: 20,}}>Remark: "{remark}"</Text>
    </View>
  );
};

export default ContributionScreen;
