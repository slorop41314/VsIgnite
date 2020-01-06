import React, { Component } from 'react';
import {
  Modal,
  Platform,
  View,
  ProgressBarAndroid,
  ProgressViewIOS,
  Alert,
  Text
} from 'react-native';
import codePush from 'react-native-code-push';
import { Colors } from '../Themes';


class DownloadUpdateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      downloadByte: 0,
      totalByte: 1,
      isDownloadUpdate: false,
      isInstallUpdate: false,
      isCompleteUpdate: false,
    };
  }

  codePushDownloadDidProgress(progress) {
    this.setState(
      {
        downloadByte: progress.receivedBytes,
        totalByte: progress.totalBytes,
      },
      () => {
        if (progress.receivedBytes === progress.totalBytes) {
          this.setState({
            isDownloadUpdate: false,
            isInstallUpdate: true,
          });
        }
      },
    );
  }

  codePushStatusDidChange(status) {
    console.tron.log('CODE PUSH STATUS', status);
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.tron.log('Checking for updates.');
        this.setState({
          showModal: false,
          isDownloadUpdate: false,
          isInstallUpdate: false,
        });
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.tron.log('Downloading package.');
        this.setState({ showModal: true, isDownloadUpdate: true });
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        console.tron.log('Installing update.');
        this.setState({
          showModal: true,
          isDownloadUpdate: false,
          isInstallUpdate: true,
        });
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.tron.log('Up-to-date.');
        this.setState({
          showModal: false,
          isDownloadUpdate: false,
          isInstallUpdate: false,
        });
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        console.tron.log('Update installed.');
        this.setState(
          { showModal: false, isDownloadUpdate: false, isInstallUpdate: false },
          () => {
            setTimeout(
              () =>
                Alert.alert(
                  "Info",
                  "Download complete",
                  [
                    {
                      text: "Later",
                      onPress: () => null,
                      style: 'cancel',
                    },
                    {
                      text: "Ok",
                      onPress: () => codePush.restartApp(),
                    },
                  ],
                  { cancelable: false },
                ),
              1000,
            );
          },
        );
        break;
      case codePush.SyncStatus.UNKNOWN_ERROR:
        this.setState(
          { showModal: false, isDownloadUpdate: false, isInstallUpdate: false },
          () => {
            if (!__DEV__) {
              setTimeout(
                () =>
                  Alert.alert(
                    "Update Alert",
                    "Update Failed",
                    [
                      {
                        text: "Ok",
                        onPress: () => null,
                        style: 'cancel',
                      },
                    ],
                    { cancelable: true },
                  ),
                1000,
              );
            }
          },
        );
        break;
    }
  }

  render() {
    const {
      downloadByte,
      totalByte,
      showModal,
      isDownloadUpdate,
      isInstallUpdate,
    } = this.state;
    const progress = downloadByte / totalByte;
    return (
      <Modal
        visible={showModal}
        onRequestClose={() => null}
        animationType='fade'
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            paddingHorizontal: 25,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              paddingVertical: 20,
              paddingHorizontal: 10,
              borderRadius: 5,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              {isDownloadUpdate && (
                <Text style={{ color: Colors.charcoal }}>
                    Downloading Update
                </Text>
              )}
              {isInstallUpdate && (
                <Text style={{ color: Colors.charcoal }}>
                    Installing Update
                </Text>
              )}
            </View>
            {Platform.OS === 'ios' ? (
              <ProgressViewIOS progress={progress} />
            ) : (
                <ProgressBarAndroid
                  styleAttr='Horizontal'
                  indeterminate={false}
                  progress={progress}
                  color={Colors.greenTea}
                />
              )}
          </View>
        </View>
      </Modal>
    );
  }
}

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
  updateDialog: true,
})(DownloadUpdateModal);
