
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import FBSDK, { LoginManager,LoginButton,AccessToken,GraphRequest,GraphRequestManager }from 'react-native-fbsdk';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class App extends Component<{}> {
  state = {
    user: undefined, // user has not logged in yet
  };


  // // Set up Linking
  // componentDidMount() {
  //   // Add event listener to handle OAuthLogin:// URLs
  //   Linking.addEventListener('url', this.handleOpenURL);
  //   // Launched from an external URL
  //   Linking.getInitialURL().then((url) => {
  //     if (url) {
  //       this.handleOpenURL({ url });
  //     }
  //   });
  // };

  fbAuth() {
    LoginManager.logInWithReadPermissions(['public_profile']).then(
        function (result) {
          if(result.isCancelled) {
            alert('Login cancelled');
          } else {
            alert('Login success with permissions: ' + result.grantedPermissions.toString());
          }
        },
        function(error) {
          alert('Login fail with errors: ' + error);
        }
      );
  }

  render() {
    const { user } = this.state
    return (
      <View style={styles.container}>

        { user
          ? // Show user info if already logged in
            <View style={styles.content}>
              <Text style={styles.header}>
                Welcome {user.name}!
              </Text>
              <View style={styles.avatar}>
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              </View>
            </View>
          : // Show Please log in message if not
            <View style={styles.content}>
              <Text style={styles.header}>
                Welcome Stranger!
              </Text>
              <View style={styles.avatar}>
                <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" />
              </View>
              <Text style={styles.text}>
                Please log in to continue {'\n'}
                to the awesomness
              </Text>
            </View>
        }

         {/* Login buttons */}
        <View style={styles.buttons}>
          <Icon.Button
            name="facebook"
            backgroundColor="#3b5998"
            onPress={this.loginWithFacebook}
            {...iconStyles}
          >
            Login with Facebook
          </Icon.Button>

          <Icon.Button
            name="google"
            backgroundColor="#DD4B39"
            onPress={this.loginWithGoogle}
            {...iconStyles}
          >
            Or with Google
          </Icon.Button>
        </View>


        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    console.log('123 data:', data);
                    const infoRequest = new GraphRequest(
                      '/me?fields=name,picture',
                      null,
                      this._responseInfoCallback
                    );
                    // Start the graph request.
                    new GraphRequestManager().addRequest(infoRequest).start();
                    console.log('data:', data);
                    console.log('infoRequest:', infoRequest);
                  }
                )
              }
            }
          }
          onLogoutFinished={() => alert("logout.")}/>
      </View>
    );
  }

  //Create response callback.
  _responseInfoCallback = (error, result) => {

    // user.user_friends = json.friends
    // user.email = json.email
    // user.username = json.name
    // user.loading = false
    // user.loggedIn = true
    // user.avatar = setAvatar(json.id)

    console.log('name ', result.name)
    console.log('user id', result.id)
    console.log('email', result.email)
    console.log('avatar', result.avatar)


    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      this.setState
      alert('Result Name: ' + result.name);
    }
  }

}

const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5 },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    margin: 20,
  },
  avatarImage: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 20,
    marginBottom: 30,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

