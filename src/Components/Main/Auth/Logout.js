import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../Context/auth.context.js';

const Logout = () => {
  const { logOutTeam } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    logOutTeam();
    navigation.navigate('Login');
  }, [logOutTeam, navigation]);

  return (
    <View>
      <Text>Logging out...</Text>
    </View>
  );
};

export default Logout;
