import React, { Component } from 'react'
import { ScrollView, Text, Image, View, Button } from 'react-native'
import { Images } from '../Themes'
import { AppTour, AppTourSequence, AppTourView } from 'react-native-app-tour'


// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {
  appTourButton = undefined

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    setTimeout(() => {
      AppTour.ShowFor(this.appTourButton)
    }, 500)
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.launch} style={styles.logo} />
          </View>

          <View style={styles.section} >
            <Image source={Images.ready} />
            <Text style={styles.sectionText}>
              This probably isn't what your app is going to look like. Unless your designer handed you this screen and, in that case, congrats! You're ready to ship. For everyone else, this is where you'll see a live preview of your fully functioning app using Ignite.
            </Text>
          </View>

          <Button
            key='button'
            ref={r => {
              if (!r) return

              let props = {
                order: 20,
                title: 'This is a target button 6',
                description: 'We have the best targets, believe me',
                outerCircleColor: '#3f52ae'
              }

              this.appTourButton = AppTourView.for(r, { ...props })
            }}
            title={'HELLO'}
          />

        </ScrollView>
      </View>
    )
  }
}
