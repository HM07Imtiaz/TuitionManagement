import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useQuery, gql } from '@apollo/client';

const GET_COUNTRIES_INFO = gql`
  query {
    countries {
      name
      code
      capital
      currencies
      languages {
        code
        name
      }
      continent {
        name
      }
      native
      phone
      subdivisions {
        name
      }
      states {
        name
      }
    }
  }
`;

const CountryInfo = () => {
  const { loading, error, data } = useQuery(GET_COUNTRIES_INFO);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <ScrollView style={styles.container}>
      {data.countries.map(country => (
        <View style={styles.countryList} key={country.code}>
          <Text style={styles.country}>Country: {country.name}</Text>
          <Text>Code: {country.code}</Text>
          <Text>Capital: {country.capital}</Text>
          <Text>Currencies: {country.currencies}</Text>
          <Text>Languages:</Text>
          <View style={{ marginLeft: 10 }}>
            {country.languages.map(lang => (
              <Text key={lang.code}>{lang.name}</Text>
            ))}
          </View>
          <Text>Continent: {country.continent.name}</Text>
          <Text>Native Name: {country.native}</Text>
          <Text>Phone Code: {country.phone}</Text>
          <Text>Subdivisions:</Text>
          <View style={{ marginLeft: 10 }}>
             {country.subdivisions.map((subdivision, index) => (
               <Text key={`${subdivision.name}-${index}`}>{subdivision.name}</Text>
             ))}
          </View>
          <Text>States:</Text>
          <View style={{ marginLeft: 10 }}>
            {country.states.map((state, index) => (
              <Text key={`${state.name}-${index}`}>{state.name}</Text>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10,
        padding: 5,
      },
      countryList: {
        flex: 1,
        marginBottom: 10,
        padding: 5,
        backgroundColor: 'lightblue',
      },
      country: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'darkgreen',
      }
});

export default CountryInfo;
