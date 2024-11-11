import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerNavigator from './CustomDrawerNavigator.js';
import HomeScreen from '../../screens/Home/HomeScreen.js';
import ProfileScreen from '../../screens/Profile/ProfileScreen.js';
import BottomTabNavigator from '../BottomTab/BottomTabNavigator.js';
import LoginScreen from '../../screens/Auth/LoginScreen.js';
import Logout from '../../Components/Main/Auth/Logout.js';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="BottomTab"
      drawerContent={(props) => <CustomDrawerNavigator {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="BottomTab" component={BottomTabNavigator} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Logout" component={Logout} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;