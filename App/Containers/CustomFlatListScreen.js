import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View, Button } from 'react-native'
import { connect } from 'react-redux'
import { CustomFlatList } from 'react-native-awesome-component'
import ProfileActions from '../Redux/ProfileRedux'
import CustomFlatListItem from '../Components/CustomFlatListItem'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/CustomFlatListScreenStyle'

class CustomFlatListScreen extends Component {
  render() {
    const { getProfileListStatus, profileList, getProfileList } = this.props
    let meta = undefined

    if (!getProfileListStatus.fetching && getProfileListStatus.payload && getProfileListStatus.payload.meta) {
      meta = getProfileListStatus.payload.meta
    }

    return (
      <CustomFlatList
        data={profileList}
        fetchFunction={getProfileList}
        meta={meta}
        loading={getProfileListStatus.fetching}
        error={getProfileListStatus.error}
        renderItem={({ item, index }) => <CustomFlatListItem key={index} data={item} />}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    getProfileListStatus: state.profile.getProfileList,
    profileList: state.profile.profileList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getProfileList: (params) => dispatch(ProfileActions.getProfileListRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomFlatListScreen)
