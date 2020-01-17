/*
Linkedin auth for your apps and get user details from user account
What can do with this app?

Can get,
  *Email address
  *First name
  *Last name
  *Profile picture

Created by Chamal
*/
import React, {useState, useEffect} from  'react';
import { StyleSheet, Text, View, Image, Alert, Button } from 'react-native';
import LinkedInModal from  'react-native-linkedin';
import axios from  'axios';

export  default  function  App() {

  const [token, setToken] =  useState('');
  const [info, setInfo] =  useState();
  const [loading, setLoading] =  useState(true);
  const [email, setEmail] = useState();

  //Create axios instance and the token
  const instance = axios.create ({
    baseURL:  'https://api.linkedin.com/v2',
      headers: {
        Authorization:  'Bearer  '  + token,
      },
  });

  //Get user id, first and last name, profile picture
  async function getInfo() {
    await instance
    .get(
      '/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
    )
    .then(response => {
      setInfo(response.data);
      setLoading(false);
    })
    .catch(error =>  console.log(error));
  }

  //Get user email address
  async function getUserEmail() {
    await instance
    .get(
      '/emailAddress?q=members&projection=(elements*(handle~))',
    )
    .then(response => {
      setEmail(response.data.elements[0]['handle~'].emailAddress);
    })
    .catch(error =>  console.log(error));
  }

  //Pass data to useEffect method
  useEffect(() => {
    getInfo();
    getUserEmail();
  },
  [token]);

  //Implement the user interface first and last name, profile picture
  const renderData = info && (
    <>
      <Image
        source={{uri: info.profilePicture['displayImage~'].elements[3]['identifiers'][0]['identifier']}}
        style={styles.image}/>
      <Text style={styles.nameText}>
        First name: {info.firstName.localized.en_US}
      </Text>
      <Text style={styles.nameText}>
        Last name: {info.lastName.localized.en_US}
      </Text>
    </>
  );

  //Implement the user interface email address
  const renderEmail = email && (
    <Text style={styles.nameText}>
      Email: {email}
    </Text>
  );

  return (
    <View  style={styles.container}>
      <LinkedInModal
        clientID="YOUR_CLIENT_ID"
        clientSecret="YOUR_CLIENT_SECRET"
        redirectUri="http://localhost:3000/auth/linkedin"
        onSuccess={token =>  setToken(token.access_token)}
        onError={error =>  console.log(error)}
        areaTouchText={{top: 20, bottom: 20, left: 150, right: 150}}
      />
    {loading && <Text>Loading...</Text>}
    {renderData}
    {renderEmail}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:  1,
    backgroundColor:  '#fff',
    justifyContent:  'center',
    alignItems:  'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#23C5DF',
    margin: 15,
    width: 200,
    padding: 10
  },
  nameText: {
    fontSize: 18,
  },
  image: {
    width: 200,
    margin: 20,
    height: 200,
    left: 'auto',
    right: 'auto',
    justifyContent: 'center',
    borderRadius: 100,
    overflow: 'hidden',
    borderColor: '#1ca9a9a9',
    borderWidth: 2
  },
});