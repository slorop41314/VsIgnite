import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View, FlatList } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import PullToRefresh from 'react-native-pull-refresh';

const umbrella_pull = require('../AnimationJSON/coin_pull.json')
const umbrella_start = require('../AnimationJSON/coin_start.json')
const umbrella_repeat = require('../AnimationJSON/coin_repeat.json')
const umbrella_end = require('../AnimationJSON/coin_full.json')


// Styles
import styles from './Styles/PullRefreshListScreenStyle'

class PullRefreshListScreen extends Component {
  constructor() {
    super();
    this.state = {
      isRefreshing: false,
    };
  }

  onRefresh() {
    this.setState({ isRefreshing: true });

    // Simulate fetching data from the server
    setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 5000);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <PullToRefresh
          isRefreshing={this.state.isRefreshing}
          onRefresh={this.onRefresh.bind(this)}
          animationBackgroundColor={'white'}
          pullHeight={180}
          contentView={
            <FlatList
              data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return (
                  <View style={{height: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{item}</Text>
                  </View>
                )
              }}
              ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: 'red'}} />}
              onEndReached={() => console.tron.error('REACH END')}
              contentContainerStyle={{backgroundColor: 'white'}}
            />
          }

          onPullAnimationSrc={umbrella_pull}
          onStartRefreshAnimationSrc={umbrella_start}
          onRefreshAnimationSrc={umbrella_repeat}
          onEndRefreshAnimationSrc={umbrella_end}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PullRefreshListScreen)
