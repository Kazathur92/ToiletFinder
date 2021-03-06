import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Button, Modal, Icon } from "react-bulma-components/full";
import StarRatingComponent from 'react-star-rating-component';
import { slideInDown, flipInX, headShake, fadeIn, flipInY } from 'react-animations'
import Radium, { StyleRoot } from 'radium';
import Geocode from "react-geocode"
import InfoWindowEx from '../infoWindowEx/InfoWindowEx'
import MyMarkerSideBar from '../myMarkersSideBar/MyMarkersSideBar'
import SideBarEditModal from '../editModalFromSidebar/SideBarEditModal'
import TestSideBar from '../myMarkersSideBar/TestSideBar'
import "./Container.css"

// =================USING GOOGLE-MAPS-REACT==============================
const style = {
  borderRadius: '15px',
  border: 'solid 5px black',
  margin: 'auto',
  marginTop: '0px',
  width: '95%',
  height: '80%'
}

const color = {
  color: 'red',
  backgroundColor: 'red',
  border: "3px solid black"
}

//=============================ANIMATIONS==============================
const slideDownAnimation = {
  slideInDown: {
    animation: "1s",
    animationName: Radium.keyframes(slideInDown, "sildeInDown")
  }
}

const fadeInAnimation = {
  fadeIn: {
    animation: "1s",
    animationName: Radium.keyframes(fadeIn, "fadeIn")
  }
}

const flipInAnimation = {
  flipInX: {
    animation: "1s",
    animationName: Radium.keyframes(flipInX, "flipInX")
  }
}

const headShakeAnimation = {
  headShake: {
    animation: "3s",
    animationName: Radium.keyframes(headShake, "headShake")
  }
}

const flipInYAnimation = {
  flipInY: {
    animation: "1s",
    animationName: Radium.keyframes(flipInY, "flipInY")
  }
}
//=========================================================================


export class MapContainer extends Component {

  //============RATING COMPONENT============
  // constructor() {
  //   super();

  // this.state = {
  //   rating: 1
  // };
  // }

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }
  //========================================

  userID = parseInt(+sessionStorage.getItem("userID"))
  // userID = +sessionStorage.userID



  state = {
    //google-maps-react
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    newMarker: false,
    currentLocation: "",
    //rating-component
    rating: 0,
    //buttons state to show or not show
    addressButton: false,
    currentLocationButton: false,
    show: false,
    infoWindowContent: true,
    editFields: false,
    editButton: false,
    deleteButton: false,
    deleteButton_2: false,
    myMarkerButton: false,
    //userBarSelection states
    userBarSelection: false,
    extraInfoState: false,
    littleArrowDownState: true,
    littleArrowUpState: false,
    extraInfoState_2: false,
    littleArrowDownState_2: true,
    littleArrowUpState_2: false,
    //satates for values
    userLocation: { lat: 40.6627, lng: -86.7816 }, //without the currentGeo
    loading: true,
    lat: "",
    lng: "",
    changingStation: "",
    handicapAccess: "",
    //states for text box values
    currentName: "",
    location: "",
    currentLocationName: "",
    editedName: "",
    editedLocationName: "",
    //states for checkboxes
    babyStationCheck: false,
    babyCheckStatus: "",
    babyCheckCondition: true,
    handicapAccessCheck: false,
    handiCheckStatus: "",
    handiCheckCondition: true,
    editBabyStationCheck: false,
    editHandicapAccessCheck: false,
    //marker states
    iconChange: false,
    currentMarker: "",
    //
    sideBarEditModal: false,
    sideBarMarkerToBeDeleted: "",
    // sideBarItemClicked: false
  }

  //Only use if not using currengGeo state
  // without the currentGeo
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        this.setState({
          userLocation: { lat: latitude, lng: longitude },
          loading: false
        });
        // console.log(this.state.userLocation)
      },
      () => {
        this.setState({ loading: false })
      }
    )
  }



  //dont think you need
  getInitialState() {
    return {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    }
  }

  //need
  onMapClick = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
        editButton: false,
        infoWindowContent: true,
        editedName: ""
      });
    }
  }

  //need
  onMarkerClick = (props, marker, e) => {

    if (this.state.showingInfoWindow) {

      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: false,
        editButton: false,
        infoWindowContent: true,
      });
    }

    else {

      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true,
      })
    }
  }

  //I made this one
  onMarkerHover = (props, marker, e) => {

    this.setState({
      selectedPlace: props,
      activeMarker: marker,
    })
  }

  //need
  onInfoWindowClose = () => {
    this.setState({
      showingInfoWindow: false,
      activeMarker: null,
      editButton: false,
      infoWindowContent: true,

    })
  }

  //======================ADD BATHROOM SELECTIONS STATES=====================
  handleAddressBoxState = () => {
    this.setState({
      addressButton: !this.state.addressButton,
      currentLocationButton: false,
      userBarSelection: false,
      show: true

    })
  }

  handleCurrentLocationBoxState = () => {
    this.setState({
      addressButton: false,
      currentLocationButton: true,
      userBarSelection: false,
      show: true
    })
  }

  handleAddBathroomSelectionState = () => {
    //modal
    if (this.state.userBarSelection) {
      this.setState({
        userBarSelection: false
      })
    } else {
      this.setState({
        userBarSelection: true,
      })
    }
  }

  handleMyMarkerButtonState = () => {
    this.props.setingUserMarkers()
    if (this.state.myMarkerButton) {
      this.setState({
        myMarkerButton: false
      })
    } else {
      this.setState({
        myMarkerButton: true
      })
    }

  }

  handleBackButtonState = () => {
    //modal
    this.setState({
      addressButton: false,
      currentLocationButton: false,
      userBarSelection: true,
      extraInfoState: false,
      littleArrowDownState: true,
      littleArrowUpState: false,
      extraInfoState_2: false,
      littleArrowDownState_2: true,
      littleArrowUpState_2: false,
      showingInfoWindow: false,
      rating: 0
      // show: true,
    })
  }
  //animation
  handleCloseButtonState = () => {
    this.setState({
      userBarSelection: false
    })
  }

  handleSearchSwitchModeButton = () => {

    if (this.state.addressButton) {

      this.setState({
        addressButton: false,
        currentLocationButton: true,
        extraInfoState: false,
        littleArrowDownState: true,
        littleArrowUpState: false,
        extraInfoState_2: false,
        littleArrowDownState_2: true,
        littleArrowUpState_2: false
      })
    }
  }

  handleCurrSwitchModeButton = () => {
    if (this.state.currentLocationButton) {

      this.setState({
        addressButton: true,
        currentLocationButton: false,
        extraInfoState: false,
        littleArrowDownState: true,
        littleArrowUpState: false,
        extraInfoState_2: false,
        littleArrowDownState_2: true,
        littleArrowUpState_2: false
      })
    }
  }

  handleExtraInfoState = () => {

    if (this.state.extraInfoState) {
      this.setState({
        extraInfoState: false,
        littleArrowDownState: true,
        littleArrowUpState: false
      })
    } else {
      this.setState({
        extraInfoState: true,
        littleArrowDownState: false,
        littleArrowUpState: true
      })
    }
  }

  handleExtraInfoState_2 = () => {

    if (this.state.extraInfoState_2) {
      this.setState({
        extraInfoState_2: false,
        littleArrowDownState_2: true,
        littleArrowUpState_2: false
      })
    } else {
      this.setState({
        extraInfoState_2: true,
        littleArrowDownState_2: false,
        littleArrowUpState_2: true
      })
    }
  }


  //=========================================ICONS STATES START==================

  handleIconState_1 = (props, id, e) => {

    let inactiveMarkerId = id
    let markerProps = props

    // this.onMarkerHover(markerProps)

    this.setState({
      currentMarker: props,
      currentIcon: true,
    })

    // console.log(id)
    // console.log(this.state.currentIcon)
  }

  //dont think ill need this one, since I can just make a conditional statement.
  handleIconState_2 = (props, id, e) => {

    let activeMarkerId = id

    this.setState({
      currentMarker: props,
      currentIcon: false,
    })
    // console.log(activeMarkerId)
  }

  //===========================================ICONS STATES END====================


  //========================================CHECKBOXES START======================

  //#1
  handleBabyStationCheckChange = (evt) => {
    if (evt.target.checked) {

      this.setState({
        babyStationCheck: true,
      })
    } else {
      this.setState({
        babyStationCheck: false,
      })

    }
  }

  //#2
  handleHandiAccessCheckChange = (evt) => {
    if (evt.target.checked) {
      this.setState({
        handicapAccessCheck: true,
        // handiCheckStatus: "Available",
        // handiCheckCondition: false
      })
    } else {
      this.setState({
        handicapAccessCheck: false,
        // handiCheckStatus: "Unavailable",
        // handiCheckCondition: false
      })

    }
  }

  //========================EDIT CHECKBOXES
  handleEditBabyStationCheckChange = (evt) => {
    if (evt.target.checked) {

      this.setState({
        babyStationCheck: true,
        babyCheckStatus: "Available",
        babyCheckCondition: false,
        editBabyStationCheck: true
      })
    } else {
      this.setState({
        babyStationCheck: false,
        babyCheckStatus: "Unavailable",
        babyCheckCondition: false,
        editBabyStationCheck: false
      })

    }
  }

  //#2
  handleEditHandiAccessCheckChange = (evt) => {
    if (evt.target.checked) {
      this.setState({
        handicapAccessCheck: true,
        handiCheckStatus: "Available",
        handiCheckCondition: false,
        editHandicapAccessCheck: true
      })
    } else {
      this.setState({
        handicapAccessCheck: false,
        handiCheckStatus: "Unavailable",
        handiCheckCondition: false,
        editHandicapAccessCheck: false
      })

    }
  }



  //========================================CHECKBOXES END=========================







  //==================================================================

  handleLogOutStateChanges = () => {
    this.props.logOutButton()

    this.setState({
      interactionBar: false,
      addressButton: false,
      userBarSelection: false,
      currentLocationButton: false,
      myMarkerButton: false,
      rating: 0
    })
  }
  //+
  handleTextBoxState = (evt) => {
    const stateToChange = {}
    stateToChange[evt.target.id] = evt.target.value
    this.setState(stateToChange)
    // console.log(stateToChange)
  }


  //=================INFO WINDOW STATES===========================
  //this changes the state of the infowindow content

  handleInfoWindowContentState_1 = () => {


    if (this.state.selectedPlace.changingStation_2 && this.state.selectedPlace.handicapAccess_2) {

      let previousBabyCheckStatus = this.state.selectedPlace.changingStation_2
      let previousHandiCheckStatus = this.state.selectedPlace.handicapAccess_2

      this.setState({
        editBabyStationCheck: previousBabyCheckStatus,
        editHandicapAccessCheck: previousHandiCheckStatus
      })
      console.log("both were true!")
      // this.handleInfoWindowContentState_2()
      this.handleInfoWindowIfCheckboxesTrue()

    }
    else if (this.state.selectedPlace.changingStation_2 === true && this.state.selectedPlace.handicapAccess_2 === false) {

      let previousBabyCheckStatus = this.state.selectedPlace.changingStation_2
      // let previousHandiCheckStatus = this.state.selectedPlace.handicapAccess_2
      console.log("baby was true handi was false")
      this.setState({
        editBabyStationCheck: previousBabyCheckStatus,
        editHandicapAccessCheck: false
      })

      this.handleInfoWindowContentState_2()
    }
    else if (this.state.selectedPlace.handicapAccess_2 === true && this.state.selectedPlace.changingStation_2 === false) {

      let previousHandiCheckStatus = this.state.selectedPlace.handicapAccess_2
      console.log("baby was false handi was true")
      this.setState({
        editBabyStationCheck: false,
        editHandicapAccessCheck: previousHandiCheckStatus
      })

      this.handleInfoWindowContentState_2()
    }
    else {
      console.log("both were false!")
      this.setState({
        editBabyStationCheck: false,
        editHandicapAccessCheck: false
      })

      this.handleInfoWindowContentState_2()
    }

  }


  handleInfoWindowIfCheckboxesTrue = () => {
    let placeName = this.state.selectedPlace.name
    let locationName = this.state.selectedPlace.address

    this.setState({
      editedName: placeName,
      editedLocationName: locationName,
      editButton: true,
      userBarSelection: false,
      currentLocationButton: false,
      addressButton: false,
      babyStationCheck: true,
      handicapAccessCheck: true,
      show: true
    })
  }

  handleInfoWindowContentState_2 = () => {

    // console.log("selecting path")
    // console.log("editBabyStationCheck", this.state.editBabyStationCheck)
    // console.log("editHandicapAccessCheck", this.state.editBabyStationCheck)


    if (this.state.editBabyStationCheck === true && this.state.editHandicapAccessCheck === false) {

      console.log("baby was true handi was false layer 2")
      let placeName = this.state.selectedPlace.name
      let locationName = this.state.selectedPlace.address

      this.setState({
        editedName: placeName,
        editedLocationName: locationName,
        editButton: true,
        userBarSelection: false,
        currentLocationButton: false,
        addressButton: false,
        babyStationCheck: true,
        handicapAccessCheck: false,
        show: true
      })
    } else if (this.state.editBabyStationCheck === false && this.state.editHandicapAccessCheck === true) {

      console.log("baby was false handi was true layer 2")
      let placeName = this.state.selectedPlace.name
      let locationName = this.state.selectedPlace.address

      this.setState({
        editedName: placeName,
        editedLocationName: locationName,
        editButton: true,
        userBarSelection: false,
        currentLocationButton: false,
        addressButton: false,
        babyStationCheck: false,
        handicapAccessCheck: true,
        show: true
      })
    } else {

      console.log("if boxes arent already checked")
      let placeName = this.state.selectedPlace.name
      let locationName = this.state.selectedPlace.address
      let previousRating = this.state.selectedPlace.rating
      this.setState({
        editedName: placeName,
        editedLocationName: locationName,
        editButton: true,
        userBarSelection: false,
        currentLocationButton: false,
        addressButton: false,
        show: true,
        rating: previousRating
      })
    }

  }

  handleEditBackButton = () => {

    this.setState({
      editButton: false,
      babyCheckCondition: true,
      sideBarEditModal: false,
      showingInfoWindow: false,
      rating: 0
    })
  }

  //=================================================================
  //+


  //==========================SIDE BAR STATE CHANGING FUNCTIONS=============================
  //TODO this after checkboxesfirst function in markeritem
  handleSidebarEditState = () => {

    if (this.state.sideBarEditModal) {
      this.setState({
        sideBarEditModal: false,
        show: false,
        editedName: "",
        editedLocationName: ""
      })
    }
    else {
      this.setState({
        sideBarEditModal: true,
        show: true,
        babyCheckCondition: true,
        handiCheckCondition: true
      })

      this.changeCheckboxStatesFirst()

    }
  }

  changeStateAndSubmitEdit = () => {
    this.setState({
      sideBarEditModal: false,
      show: false,
      editButton: false,
      currentLocationButton: false,
      addressButton: false,
    })

    this.constructNewEditedMarkerSidebar()
  }

  //in MarkItem component
  changeCheckboxStatesFirst = () => {


    if (this.state.currentMarker.changingStation_2 && this.state.currentMarker.handicapAccess_2) {

      let previousBabyCheckStatus = this.state.currentMarker.changingStation_2
      let previousHandiCheckStatus = this.state.currentMarker.handicapAccess_2

      this.setState({
        editBabyStationCheck: previousBabyCheckStatus,
        editHandicapAccessCheck: previousHandiCheckStatus
      })
      console.log("both were true!")
      // this.handleInfoWindowContentState_2()
      this.ifCheckboxesTrue()

    }
    else if (this.state.currentMarker.changingStation_2 === true && this.state.currentMarker.handicapAccess_2 === false) {

      let previousBabyCheckStatus = this.state.currentMarker.changingStation_2
      // let previousHandiCheckStatus = this.state.currentMarker.handicapAccess_2
      console.log("baby was true handi was false")
      this.setState({
        editBabyStationCheck: previousBabyCheckStatus,
        editHandicapAccessCheck: false
      })

      this.moreStateChangesBeforeEdit()
    }
    else if (this.state.currentMarker.handicapAccess_2 === true && this.state.currentMarker.changingStation_2 === false) {

      let previousHandiCheckStatus = this.state.currentMarker.handicapAccess_2
      console.log("baby was false handi was true")
      this.setState({
        editBabyStationCheck: false,
        editHandicapAccessCheck: previousHandiCheckStatus
      })

      this.moreStateChangesBeforeEdit()
    }
    else {
      console.log("both were false!")
      this.setState({
        editBabyStationCheck: false,
        editHandicapAccessCheck: false
      })

      this.moreStateChangesBeforeEdit()
    }

  }


  ifCheckboxesTrue = () => {
    let placeName = this.state.currentMarker.name
    let locationName = this.state.currentMarker.location

    this.setState({
      editedName: placeName,
      editedLocationName: locationName,
      editButton: true,
      userBarSelection: false,
      currentLocationButton: false,
      addressButton: false,
      babyStationCheck: true,
      handicapAccessCheck: true,
      // show: true
    })
  }

  moreStateChangesBeforeEdit = () => {

    // console.log("selecting path")
    // console.log("editBabyStationCheck", this.state.editBabyStationCheck)
    // console.log("editHandicapAccessCheck", this.state.editBabyStationCheck)


    if (this.state.editBabyStationCheck === true && this.state.editHandicapAccessCheck === false) {

      console.log("baby was true handi was false layer 2")
      let placeName = this.state.currentMarker.name
      let locationName = this.state.currentMarker.location

      this.setState({
        editedName: placeName,
        editedLocationName: locationName,
        editButton: true,
        userBarSelection: false,
        currentLocationButton: false,
        addressButton: false,
        babyStationCheck: true,
        handicapAccessCheck: false,
        // show: true
      })
    } else if (this.state.editBabyStationCheck === false && this.state.editHandicapAccessCheck === true) {

      console.log("baby was false handi was true layer 2")
      let placeName = this.state.currentMarker.name
      let locationName = this.state.currentMarker.location

      this.setState({
        editedName: placeName,
        editedLocationName: locationName,
        editButton: true,
        userBarSelection: false,
        currentLocationButton: false,
        addressButton: false,
        babyStationCheck: false,
        handicapAccessCheck: true,
        // show: true
      })
    } else {

      console.log("if boxes arent already checked")
      let placeName = this.state.currentMarker.name
      let locationName = this.state.currentMarker.location
      let previousRating = this.state.currentMarker.rating
      this.setState({
        editedName: placeName,
        editedLocationName: locationName,
        editButton: true,
        userBarSelection: false,
        currentLocationButton: false,
        addressButton: false,
        // show: true,
        rating: previousRating
      })
    }

  }
  //========================================sidebar end================================

  // ====================================================================================

  //this handles the state of the value from the textboxes inside the info window
  handleEditTextboxState = (evt) => {

    const stateToChange = {}
    stateToChange[evt.target.id] = evt.target.value
    this.setState(stateToChange)
    // console.log(stateToChange)

  }


  warningMessageToggle = () => {
    if (this.state.deleteButton) {
      this.setState({
        deleteButton: false,
        show: false
      })
    }
    else {
      this.setState({
        deleteButton: true,
        deleteButon_2: false,
        userBarSelection: false,
        editButton: false,
        addressButton: false,
        currentLocationButton: false,
        show: true
      })

    }
  }




  handleSubmitChangesButtonState = () => {


    //if both values are not empty
    if (this.state.editedName !== "") {

      // console.log("both fields filled")
      this.setState({
        editButton: false,
        infoWindowContent: true,
        showingInfoWindow: false,
        babyCheckCondition: true,
        handiCheckCondition: true,
        sideBarEditModal: false,
      })

      this.constructNewEditedMarker()
    }

    else {
      window.alert("Marker needs a name")
    }
  }

  // //need
  renderChildren() {

    const { children } = this.props;

    if (!children) return

    return React.Children.map(children, c => {
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation
      });
    })

  }
  // // ===========C.R.U.D==================================

  //==========================GEOCODE API FETCH and POST ======================
  geocodeLocation = () => {
    Geocode.setApiKey("AIzaSyDOEBqiYykHzoCJyKAij9f2UwaF-DxtuBs")
    // console.log('location: ', this.state.location)
    Geocode.fromAddress(this.state.location).then(
      response => {
        // console.log('happened 3', response)
        const latitude = response.results[0].geometry.location.lat;
        // console.log("latitude",latitude);
        const longitude = response.results[0].geometry.location.lng;
        // console.log("longitude", longitude)
        this.setState({
          lat: latitude,
          lng: longitude
        })


        // console.log("lat state", this.state.lat)
        let bathroom = {
          name: this.state.currentName,
          location: this.state.location,
          lat: this.state.lat,
          lng: this.state.lng,
          public: true,
          rating: this.state.rating,
          inactiveIcon: "https://cdn3.iconfinder.com/data/icons/map-and-location-fill/144/Place_Restroom-512.png",
          activeIcon: "https://cdn4.iconfinder.com/data/icons/bold-purple-free-samples/32/Men_Symbol_Restroom_Human_Toilet-512.png",
          changingStation: this.state.babyStationCheck,
          changingStation_2: this.state.babyStationCheck,
          handicapAccess: this.state.handicapAccessCheck,
          handicapAccess_2: this.state.handicapAccessCheck,
          user_Id: +sessionStorage.userID
        }
        this.props.addMarker(bathroom)

        this.setState({
          currentName: "",
          currentLocationName: "",
          babyStationCheck: false,
          handicapAccessCheck: false,
          addressButton: false,
          currentLocationButton: false,
          extraInfoState: false,
          littleArrowDownState: true,
          littleArrowUpState: false,
          extraInfoState_2: false,
          littleArrowDownState_2: true,
          littleArrowUpState_2: false
        })

      },
      error => {
        console.error(error);
      }
    )
  }
  //==================================================================================

  // //typing address POST
  constructNewBathroom = () => {
    if (this.state.location === "") {
      window.alert("Please provide a location for the marker.");
    } else {
      this.geocodeLocation()

    }
  };

  //current location POST
  constructNewCurrentGeoBathroom = () => {

    if (this.state.currentName === "") {
      window.alert("Bathroom needs a name");
    } else {
      //modal
      this.setState({
        show: false,
        addressButton: false,
        currentLocationButton: false,
        userBarSelection: true,
      })

      const newCurrentGeoBathroom = {
        name: this.state.currentName,
        location: this.state.currentLocationName,
        // lat: this.props.currentGeo.lat,
        // lng: this.props.currentGeo.lng,
        lat: this.state.userLocation.lat,
        lng: this.state.userLocation.lng,
        rating: this.state.rating,
        inactiveIcon: "https://cdn3.iconfinder.com/data/icons/map-and-location-fill/144/Place_Restroom-512.png",
        activeIcon: "https://cdn4.iconfinder.com/data/icons/bold-purple-free-samples/32/Men_Symbol_Restroom_Human_Toilet-512.png",
        changingStation: this.state.babyStationCheck,
        changingStation_2: this.state.babyStationCheck,
        handicapAccess: this.state.handicapAccessCheck,
        handicapAccess_2: this.state.handicapAccessCheck,
        user_Id: +sessionStorage.userID
      }
      this.props.addMarker(newCurrentGeoBathroom)

      //TODO why changing checkbox state here to false?
      this.setState({
        currentName: "",
        currentLocationName: "",
        babyStationCheck: false,
        handicapAccessCheck: false,
        addressButton: false,
        currentLocationButton: false,
        extraInfoState: false,
        littleArrowDownState: true,
        littleArrowUpState: false,
        extraInfoState_2: false,
        littleArrowDownState_2: true,
        littleArrowUpState_2: false
      })
    }

  }

  //EDIT MARKER FUNCTION
  constructNewEditedMarker = () => {

    if (this.state.rating === 0 && this.state.editBabyStationCheck && this.state.editHandicapAccessCheck) {
      //when values untouched
      let previousRating = this.state.selectedPlace.rating
      let previousBabyCheck = this.state.selectedPlace.changingStation_2

      // console.log("previous rating", previousRating)

      const editedMarker = {
        name: this.state.editedName,
        location: this.state.editedLocationName,

        changingStation: true,
        changingStation_2: true,
        handicapAccess: true,
        handicapAccess_2: true,
        rating: previousRating
      }

      console.log("if rating 0 and checkboxes true", editedMarker)
      this.props.editMarker(editedMarker, this.state.activeMarker.id)

    }

    else if (this.state.rating === 0 && this.state.editBabyStationCheck === true && this.state.editHandicapAccessCheck === false) {

      let previousRating = this.state.selectedPlace.rating
      console.log("previous rating", previousRating)

      const editedMarker = {
        name: this.state.editedName,
        location: this.state.editedLocationName,

        changingStation: true,
        changingStation_2: true,
        handicapAccess: false,
        handicapAccess_2: false,
        rating: previousRating
      }

      console.log("if rating 0 and baby is true but handi is false", editedMarker)
      this.props.editMarker(editedMarker, this.state.activeMarker.id)

    }

    else if (this.state.rating === 0 && this.state.editBabyStationCheck === false && this.state.editHandicapAccessCheck === true) {

      let previousRating = this.state.selectedPlace.rating
      console.log("previous rating", previousRating)

      const editedMarker = {
        name: this.state.editedName,
        location: this.state.editedLocationName,

        changingStation: false,
        changingStation_2: false,
        handicapAccess: true,
        handicapAccess_2: true,
        rating: previousRating
      }

      console.log("if rating 0 and baby is false but handi is true", editedMarker)
      this.props.editMarker(editedMarker, this.state.activeMarker.id)

    }

    else if (this.state.rating === 0 && this.state.editBabyStationCheck === false && this.state.editHandicapAccessCheck === false) {

      let previousRating = this.state.selectedPlace.rating
      console.log("previous rating", previousRating)

      const editedMarker = {
        name: this.state.editedName,
        location: this.state.editedLocationName,

        changingStation: false,
        changingStation_2: false,
        handicapAccess: false,
        handicapAccess_2: false,
        rating: previousRating
      }

      console.log("if rating 0 and both baby and handi are false", editedMarker)
      this.props.editMarker(editedMarker, this.state.activeMarker.id)

    }

    else if (this.state.editBabyStationCheck === true && this.state.editHandicapAccessCheck === false) {

      let previousRating = this.state.selectedPlace.rating
      console.log("previous rating", previousRating)

      const editedMarker = {
        name: this.state.editedName,
        location: this.state.editedLocationName,

        changingStation: true,
        changingStation_2: true,
        handicapAccess: false,
        handicapAccess_2: false,
        rating: this.state.rating
      }

      console.log("if baby is true but handi is false", editedMarker)
      this.props.editMarker(editedMarker, this.state.activeMarker.id)

    }

    else if (this.state.editBabyStationCheck === false && this.state.editHandicapAccessCheck === true) {

      let previousRating = this.state.selectedPlace.rating

      const editedMarker = {
        name: this.state.editedName,
        location: this.state.editedLocationName,

        changingStation: false,
        changingStation_2: false,
        handicapAccess: true,
        handicapAccess_2: true,
        rating: this.state.rating
      }

      console.log("if baby is true but handi is false", editedMarker)
      this.props.editMarker(editedMarker, this.state.activeMarker.id)

    }

    else {
      //when values altered
      const editedMarker = {
        name: this.state.editedName,
        location: this.state.editedLocationName,
        changingStation: this.state.babyStationCheck,
        changingStation_2: this.state.babyStationCheck,
        handicapAccess: this.state.handicapAccessCheck,
        handicapAccess_2: this.state.handicapAccessCheck,
        rating: this.state.rating
      }

      console.log("normal edit")
      this.props.editMarker(editedMarker, this.state.activeMarker.id)
    }
  }


  deleteCurrentMarker = (id) => {


    this.setState({
      showingInfoWindow: false,
      deleteButton: false,
      show: false
    })
    this.props.deleteMarker(id)

  }


  //==================================SIDE BAR crud========================
  constructNewEditedMarkerSidebar = () => {

    if (this.state.rating === 0 && this.state.editBabyStationCheck && this.state.editHandicapAccessCheck) {
      //when values untouched
      let previousRating = this.state.currentMarker.rating
      let previousBabyCheck = this.state.currentMarker.changingStation_2

      // console.log("previous rating", previousRating)

      const editedMarker = {
        name: this.state.editedName,
        location: this.state.editedLocationName,

        changingStation: true,
        changingStation_2: true,
        handicapAccess: true,
        handicapAccess_2: true,
        rating: previousRating
      }

      console.log("(sidebar) if rating 0 and checkboxes true", editedMarker)
      this.props.editMarker(editedMarker, this.state.currentMarker.id)

    }

    else if (this.state.rating === 0 && this.state.editBabyStationCheck === true && this.state.editHandicapAccessCheck === false) {

      let previousRating = this.state.currentMarker.rating
      console.log("(from sidebar) previous rating", previousRating)

      const editedMarker = {
        name: this.state.editedName,
        location: this.state.editedLocationName,

        changingStation: true,
        changingStation_2: true,
        handicapAccess: false,
        handicapAccess_2: false,
        rating: previousRating
      }

      console.log("(sidebar) if rating 0 and baby is true but handi is false", editedMarker)
      this.props.editMarker(editedMarker, this.state.currentMarker.id)

    }

    else if (this.state.rating === 0 && this.state.editBabyStationCheck === false && this.state.editHandicapAccessCheck === true) {

      let previousRating = this.state.currentMarker.rating
      console.log("(from sidebar) previous rating", previousRating)

      const editedMarker = {
        name: this.state.editedName,
        location: this.state.editedLocationName,

        changingStation: false,
        changingStation_2: false,
        handicapAccess: true,
        handicapAccess_2: true,
        rating: previousRating
      }

      console.log("(sidebar) if rating 0 and baby is false but handi is true", editedMarker)
      this.props.editMarker(editedMarker, this.state.currentMarker.id)

    }

    else if (this.state.rating === 0 && this.state.editBabyStationCheck === false && this.state.editHandicapAccessCheck === false) {

      let previousRating = this.state.currentMarker.rating
      console.log("(from sidebar) previous rating", previousRating)

      const editedMarker = {
        name: this.state.editedName,
        location: this.state.editedLocationName,

        changingStation: false,
        changingStation_2: false,
        handicapAccess: false,
        handicapAccess_2: false,
        rating: previousRating
      }

      console.log("(sidebar) if rating 0 and both baby and handi are false", editedMarker)
      this.props.editMarker(editedMarker, this.state.currentMarker.id)

    }

    else if (this.state.editBabyStationCheck === true && this.state.editHandicapAccessCheck === false) {

      let previousRating = this.state.currentMarker.rating
      console.log("(from sidebar) previous rating", previousRating)

      const editedMarker = {
        name: this.state.editedName,
        location: this.state.editedLocationName,

        changingStation: true,
        changingStation_2: true,
        handicapAccess: false,
        handicapAccess_2: false,
        rating: this.state.rating
      }

      console.log("(sidebar) if baby is true but handi is false", editedMarker)
      this.props.editMarker(editedMarker, this.state.currentMarker.id)
      this.reversingRatingSidebarState()
    }

    else if (this.state.editBabyStationCheck === false && this.state.editHandicapAccessCheck === true) {

      let previousRating = this.state.currentMarker.rating

      const editedMarker = {
        name: this.state.editedName,
        location: this.state.editedLocationName,

        changingStation: false,
        changingStation_2: false,
        handicapAccess: true,
        handicapAccess_2: true,
        rating: this.state.rating
      }

      console.log("(sidebar) if baby is true but handi is false", editedMarker)
      this.props.editMarker(editedMarker, this.state.currentMarker.id)
      this.reversingRatingSidebarState()
    }

    else {
      //when values altered
      const editedMarker = {
        name: this.state.editedName,
        location: this.state.editedLocationName,
        changingStation: this.state.babyStationCheck,
        changingStation_2: this.state.babyStationCheck,
        handicapAccess: this.state.handicapAccessCheck,
        handicapAccess_2: this.state.handicapAccessCheck,
        rating: this.state.rating
      }

      console.log("(sidebar) normal edit")
      this.props.editMarker(editedMarker, this.state.currentMarker.id)
      this.reversingRatingSidebarState()
    }
  }

  reversingRatingSidebarState = () => {
    this.setState({
      rating: 0
    })
  }


  warningMessageToggleSideBar = (id) => {
    if (this.state.deleteButton_2) {
      this.setState({
        deleteButton_2: false,
        show: false,
        sideBarMarkerToBeDeleted: ""
      })
    }
    else {
      this.setState({
        deleteButton_2: true,
        userBarSelection: false,
        show: true,
        sideBarMarkerToBeDeleted: id
      })

    }
  }


  deleteCurrentMarkerWithSideBarId = (id) => {


    this.setState({
      showingInfoWindow: false,
      deleteButton_2: false,
      show: false
    })
    this.props.deleteMarker(id)


    //all of this below is supposed to filter only the user id markers
    //so that it can close the side bar if there are no more left
    //in it, but it doesnt work.
//     this.props.markers.filter(markers => {
// console.log("markers", markers)
//       let myMarkers = []

//       if (markers.user_Id === +sessionStorage.userID) {
//         let arrayOfMarkers = markers
//         console.log("arrayOfMarkers", arrayOfMarkers)
//         arrayOfMarkers.push(myMarkers)
//       }


//       if (myMarkers === 0) {
//         this.setState({
//           myMarkerButton: false,
//         })
//       }
//     }
//     )

  }

  //=====================================================

  //modal
  close = () => this.setState({
    show: false,
    addressButton: false,
    currentLocationButton: false,
    editButton: false,
    deleteButton: false,
    extraInfoState: false,
    littleArrowDownState: true,
    littleArrowUpState: false,
    extraInfoState_2: false,
    littleArrowDownState_2: true,
    littleArrowUpState_2: false,
    sideBarEditModal: false,
    showingInfoWindow: false,
    rating: 0
  });

  //CONSOLE LOG
  consoleLog = () => {
    console.log("selectedPlace", this.state.selectedPlace)
    // console.log("selected place rating", this.state.selectedPlace.rating)
    // console.log("active Marker id", this.state.activeMarker)
    // console.log("selectedPlace property", this.state.selectedPlace.name)
    console.log("selectedPlace property", this.state.selectedPlace.address)

    // console.log("editedName", this.state.currentName)
    // console.log("editedLocationName", this.state.currentLocationName)
    // console.log("infoWindow", this.currentInfoWindow)
    // console.log("this id", this.id)
    // console.log("currentLocation state", this.props.bathrooms)
    console.log("this.state.rating", this.state.rating)
    // console.log("userID", this.userID)
    // console.log(sessionStorage)
    // console.log("sessionStorage.userID = ", sessionStorage.userID)
    // console.log("babyCheck", this.state.babyStationCheck)
    // console.log("handiCheck", this.state.handicapAccessCheck)
    console.log("editBabyCheck", this.state.editBabyStationCheck)
    console.log("editHandiCheck", this.state.editHandicapAccessCheck)
    // console.log("currentIcon", this.state.currentIcon)
    console.log("this.state.currentMarker", this.state.currentMarker)
  }


  //RENDER
  render() {

    // const { rating } = this.state;

    //this is so icons in the markers can load
    const { google } = this.props;

    //only use if not using currentGeo state in initialCenter of Map component tag
    const { loading, userLocation } = this.state


    if (loading) {
      return null
    }

    //====================================================



    //==CONDITIONAL STATEMENT VARIABLES==
    //=======logout========
    let logOutButton = ""
    //=====user bar==============
    let userBar = ""
    let userBarSelectionButtons = ""
    let searchBox = ""
    let currentLocationTextboxes = ""
    let extraInfoField = ""
    let littleArrowDownIcon = ""
    let littleArrowUpIcon = ""
    let extraInfoField_2 = ""
    let littleArrowDownIcon_2 = ""
    let littleArrowUpIcon_2 = ""
    //=====info window===========
    let infoWindowEditBoxes = ""
    let infoWindowContent = ""
    let infoWindowButtons = ""
    let deleteWarningMessage = ""
    //====================================
    let babyCheckboxStatus = ""
    let handiCheckboxStatus = ""
    //===============sidebar==============
    let sideBar = ""
    let SidebarEdit = ""
    let deleteWarningMessage_2 = ""

    //=================================START of CONDITIONAL STATEMENTS=============================


    //==================================================USER BAR=====================================================
    if (this.props.sessionStorage === true && this.state.addressButton === false && this.state.currentLocationButton === false && this.state.editButton === false && this.state.deleteButton === false && this.state.sideBarEditModal === false) {
      userBar = (
        <StyleRoot>
          <div className="userBar" style={flipInAnimation.flipInX}>
            <Button type="submit" className="addButton is-normal is-rounded" style={headShakeAnimation.headShake} onClick={this.handleAddBathroomSelectionState}>
              <Icon className="fas fa-toilet"></Icon>&nbsp;Add Bathroom</Button>
            {/* TODO for version 2 */}
            {/* <Button className="favoritesButton is-normal is-rounded" onClick={this.handleFieldChange}>
              <Icon className="fas fa-heart"></Icon>&nbsp;&nbsp;Favorites</Button>
            <Button className="trendingButton is-normal is-rounded" onClick={this.handleFieldChange}>
              <Icon className="fas fa-star"></Icon>&nbsp;&nbsp;Trending</Button> */}
            <Button className="myMarkerButton is-normal is-rounded" onClick={this.handleMyMarkerButtonState}><Icon className="fas fa-map-marked-alt" ></Icon>&nbsp;&nbsp;My Markers</Button>
          </div>
        </StyleRoot>
      );
    } else {
      userBar = null
    }
    //=============================================USER BAR END=====================================================


    //============================LOG OUT BUTTON==============================
    if (this.props.sessionStorage === true) {
      logOutButton = (
        <StyleRoot>
          <div style={flipInAnimation.flipInX}>
            <Button id="logOutButton" className="logOutButton is-normal is-rounded" onClick={this.handleLogOutStateChanges}><Icon className="fas fa-sign-out-alt"></Icon>&nbsp;&nbsp;Log Out</Button>
          </div>
        </StyleRoot>
      )
    } else {
      logOutButton = null
    }
    //=============================LOG OUT END=================================

    if (this.state.userBarSelection) {
      userBarSelectionButtons = (
        <StyleRoot>
          <div key={7} className="addBathroomSelectionBar" style={slideDownAnimation.slideInDown}>
            {/* <Button key={2} className="is-medium icon" onClick={this.handleCloseButtonState}> */}
            {/* <Icon className="fas fa-angle-double-up iconStyle"> */}
            {/* </Icon> */}
            {/* </Button> */}
            <Button key={3} onClick={this.handleCurrentLocationBoxState}>
              <Icon className="fas fa-map-marker-alt"></Icon>
              &nbsp;&nbsp;By Current Location</Button>
            <Button key={4} onClick={this.handleAddressBoxState}>
              <Icon className="fas fa-search-location"></Icon>
              &nbsp;&nbsp;By Location Name</Button>
          </div>
        </StyleRoot>
      );
    } else {
      userBarSelectionButtons = null
    }

    //========================================BY LOCATION NAME===============================================

    if (this.state.littleArrowDownState_2) {
      littleArrowDownIcon_2 = (
        <Icon className="fas fa-angle-down extraInfoWords"></Icon>
      )
    } else {
      littleArrowDownIcon_2 = null
    }


    if (this.state.littleArrowUpState_2) {
      littleArrowUpIcon_2 = (
        <Icon className="fas fa-angle-up extraInfoWords"></Icon>
      )
    } else {
      littleArrowUpIcon_2 = null
    }


    if (this.state.extraInfoState_2) {
      extraInfoField_2 = (
        <StyleRoot>
          <div className="extraInfoDiv" style={slideDownAnimation.slideInDown}>
            <label className="currLocationNameLabel extraInfoLabel">Nickname: </label>
            <input id="currentName" className="currLocationName" type="text" placeholder="Location Name" onChange={this.handleTextBoxState}></input>
          </div>
        </StyleRoot>
      )
    }
    else {
      extraInfoField_2 = null
    }



    if (this.state.addressButton === true && this.props.sessionStorage === true && this.state.editButton === false && this.state.deleteButton === false) {
      searchBox = (
        <StyleRoot>
          <Modal show={this.state.show} onClose={this.close} {...this.props.modal} closeOnBlur={true}>

            <div className="searchLocationBox modal-content" style={flipInYAnimation.flipInY}>
              <Button className="searchBackButton is-small" onClick={this.handleBackButtonState}>
                <Icon className="fas fa-backward"></Icon>&nbsp;&nbsp;Back</Button>
              <Button className="searchSwitchModeBtn is-small is-rounded" onClick={this.handleSearchSwitchModeButton}>
                <Icon className="phoneSizeIcon fas fa-map-marker-alt" color="danger"></Icon>
                &nbsp;&nbsp;Switch to Current Location</Button>
              <h1 className="searchWindowTitle"><Icon className="fas fa-search-location" color="info"></Icon>
                &nbsp;&nbsp;Add by Location Name</h1>

              <div className="boxSeparator">

                <div className="locationTextBoxes">
                  <label className="locationLabel">Which location? </label>
                  <input id="location" className="locationTextbox" type="text" placeholder="Search Location" onChange={this.handleTextBoxState}></input>
                </div>

                <div className="checkSeparator">

                  <div className="locationBabyCheckField">
                    <input id="babyStationCheck" onClick={this.handleBabyStationCheckChange} type="checkbox"></input>
                    <Icon className="fas fa-baby" color="info"></Icon>
                    &nbsp;<label className="babyStationCheckLabel">Baby Changing Station</label>
                  </div>

                  <div className="locationHandiAccessField">
                    <input id="handiAccessCheck" onClick={this.handleHandiAccessCheckChange} type="checkbox"></input>
                    <Icon className="fas fa-wheelchair" color="info"></Icon>
                    &nbsp;<label className="handiAccessCheckLabel">Handicap Access</label>
                  </div>


                </div>

              </div>

              <div className="extraInfoFieldDiv">
                <div className="amalgamator">
                  <Button className="extraInfoDropDown" onClick={this.handleExtraInfoState_2}><p className="extraInfoWords">{littleArrowUpIcon_2}{littleArrowDownIcon_2}
                    &nbsp;Extra Info</p></Button>
                  <div className="ratingDiv">
                    <p className="editRatingTitle">Your Rating: </p>
                    <StarRatingComponent
                      name="rate3"
                      starCount={5}
                      value={this.state.rating}
                      onStarClick={this.onStarClick.bind(this)}
                      editing={true}
                    />
                  </div>
                </div>
                {extraInfoField_2}
              </div>

              <div className="searchMarkItButton">
                <Button className="markItButton" onClick={this.constructNewBathroom}><Icon className="fas fa-restroom"></Icon>
                  &nbsp;&nbsp;Mark It</Button>
              </div>


            </div>

          </Modal>
        </StyleRoot>
      );
    } else {
      searchBox = null
    }

    //==============================================BY CURRENT LOCATION==========================================

    if (this.state.littleArrowDownState) {
      littleArrowDownIcon = (
        <Icon className="fas fa-angle-down extraInfoWords"></Icon>
      )
    } else {
      littleArrowDownIcon = null
    }


    if (this.state.littleArrowUpState) {
      littleArrowUpIcon = (
        <Icon className="fas fa-angle-up extraInfoWords"></Icon>
      )
    } else {
      littleArrowUpIcon = null
    }


    if (this.state.extraInfoState) {
      extraInfoField = (
        <StyleRoot>
          <div className="extraInfoDiv_2" style={slideDownAnimation.slideInDown}>
            <label className="currLocationNameLabel extraInfoLabel">Location Name/Address: </label>
            <input id="currentLocationName" className="currLocationName" type="text" placeholder="Location Name/Address" onChange={this.handleTextBoxState}></input>
          </div>
        </StyleRoot>
      )
    }
    else {
      extraInfoField = null
    }


    //@
    if (this.state.currentLocationButton === true && this.props.sessionStorage === true && this.state.editButton == false) {
      currentLocationTextboxes = (
        // new Marker("name")
        <StyleRoot>
          <Modal show={this.state.show} onClose={this.close} className="modalBox" {...this.props.modal} closeOnBlur={true}>
            <div className="currentLocationBoxes modal-content" style={flipInYAnimation.flipInY}>

              <Button className="currLocBackBtn is-small" onClick={this.handleBackButtonState}>
                <Icon className="fas fa-backward"></Icon>
                &nbsp;&nbsp;Back</Button>
              <Button className="currSwitchModeBtn is-small is-rounded" onClick={this.handleCurrSwitchModeButton}>
                <Icon className="fas fa-search-location" color="info"></Icon>
                &nbsp;&nbsp;Switch to Location Name</Button>
              <h1 className="currLocTitle"><Icon className="fas fa-map-marker-alt" color="danger"></Icon>
                &nbsp;Add by Current Location</h1>

              <div className="boxSeparator">

                <div className="currLocTextBoxes">
                  <label className="currLocNameLabel">Bathroom Name: </label>
                  <input id="currentName" className="currLocName" type="text" placeholder="Bathroom Name" onChange={this.handleTextBoxState}></input>
                </div>

                <div className="checkSeparator">

                  <div className="currBabyCheckField">
                    <input className="currBabyStationCheck" type="checkbox" onClick={this.handleBabyStationCheckChange} ></input>
                    <Icon className="fas fa-baby" color="info"></Icon>
                    &nbsp;<label className="currBabyStationCheckLabel">Baby Changing Station</label>
                  </div>

                  <div className="currHandiAccessCheckField">
                    <input className="currHandiAceesCheck" type="checkbox" onClick={this.handleHandiAccessCheckChange}></input>
                    <Icon className="fas fa-wheelchair" color="info"></Icon>
                    &nbsp;<label className="currHandiAccessCheckLabel">Handicap Access</label>
                  </div>


                </div>

              </div>

              <div className="extraInfoFieldDiv">
                <div className="amalgamator">
                  <Button className="extraInfoDropDown_2" onClick={this.handleExtraInfoState}><p className="extraInfoWords">{littleArrowUpIcon}{littleArrowDownIcon}
                    &nbsp;Extra Info</p></Button>
                  <div className="ratingDiv">
                    <p className="editRatingTitle">Your Rating: </p>
                    <StarRatingComponent
                      name="rate3"
                      starCount={5}
                      value={this.state.rating}
                      onStarClick={this.onStarClick.bind(this)}
                      editing={true}
                    />
                  </div>
                </div>
                {extraInfoField}
              </div>

              <div className="currMarkItButton">
                <Button className="markItButton" onClick={this.constructNewCurrentGeoBathroom}><Icon className="fas fa-restroom"></Icon>
                  &nbsp;&nbsp;Mark It</Button>
              </div>


            </div>
          </Modal>
        </StyleRoot>
      );
    } else {
      currentLocationTextboxes = null
    }

    //#1
    if (this.state.babyCheckCondition) {
      babyCheckboxStatus = (
        <p className="mockMarkerBabyCheck"><Icon className="fas fa-baby" color="info"></Icon>
          &nbsp;{this.state.selectedPlace.changingStation}</p>
      )
    } else {
      babyCheckboxStatus = (
        <p className="mockMarkerBabyCheck"><Icon className="fas fa-baby" color="info"></Icon>
          &nbsp;{this.state.babyCheckStatus}</p>
      )
    }

    //#2
    if (this.state.handiCheckCondition) {
      handiCheckboxStatus = (

        <p className="mockMarkerHandiCheck"><Icon className="fas fa-wheelchair" color="info"></Icon>
          &nbsp;{this.state.selectedPlace.handicapAccess}</p>
      )
    } else {
      handiCheckboxStatus = (

        <p className="mockMarkerHandiCheck"><Icon className="fas fa-wheelchair" color="info"></Icon>
          &nbsp;{this.state.handiCheckStatus}</p>
      )
    }

    //@
    if (this.state.editButton === true && this.state.currentLocationButton === false && this.state.addressButton === false) {
      infoWindowEditBoxes = (



        <StyleRoot>
          <Modal show={this.state.show} className="modalBox" onClose={this.close} {...this.props.modal} closeOnBlur={true}>
            <div className="editDiv modal-content" style={fadeInAnimation.fadeIn}>
              <Button className="editBackBtn is-small" onClick={this.handleEditBackButton}>
                <Icon className="fas fa-backward"></Icon>
                &nbsp;&nbsp;Back</Button>
              <h1 className="editTitle"><Icon className="fas fa-edit" color="warning"></Icon>
                &nbsp;Edit this Marker</h1>

              <div className="mockMarker">
                <h5 className="mockMarkerName">{this.state.editedName}</h5>
                <h5 className="mockMarkerAddress">{this.state.editedLocationName}</h5>
                {babyCheckboxStatus}
                {handiCheckboxStatus}
                {/* <p className="mockMarkerHandiCheck"><Icon className="fas fa-wheelchair" color="info"></Icon>
                    &nbsp;{this.state.selectedPlace.handicapAccess}</p> */}
                <div className="mockMarkerRating">
                  <StarRatingComponent
                    name="rate3"
                    starCount={5}
                    value={this.state.selectedPlace.rating}
                  />
                </div>
                <div className="mockButtons">
                  <Button className="is-small is-static"><Icon className="fas fa-edit"></Icon>
                    &nbsp;Edit Marker</Button>
                  <Button className="is-small is-static"><Icon className="fas fa-trash-alt"></Icon>
                    &nbsp;Delete Marker</Button>
                </div>
              </div>

              <div className="boxSeparator">

                <div className="editBoxesDiv">
                  <label className="editNameLabel">Bathroom Name: </label>
                  <input className="editNameBox" key={this.props.marker} id="editedName" type="text" value={this.state.editedName} maxLength="30" onChange={this.handleEditTextboxState}></input>
                  <label className="editLocationLabel">Location Name: </label>
                  <input className="editLocationBox" key={this.props.marker} id="editedLocationName" type="text" maxLength="30" value={this.state.editedLocationName} onChange={this.handleEditTextboxState}></input>
                </div>

                <div className="checkSeparator">

                  <div className="editBabyCheckField">
                    {/* #1 */}
                    <input id="editBabyStationCheck" className="editBabyStation" type="checkbox" defaultChecked={this.state.selectedPlace.changingStation_2} onClick={this.handleEditBabyStationCheckChange}></input>
                    <Icon className="fas fa-baby" color="info"></Icon>
                    &nbsp;<label className="editBabyCheckLabel">Baby Changing Station</label>
                  </div>
                  {/* #2 */}
                  <div className="editHandiAccessCheckField">
                    <input id="editHandicapAccessCheck" className="editHandiAccess" type="checkbox" defaultChecked={this.state.selectedPlace.handicapAccess_2} onClick={this.handleEditHandiAccessCheckChange}></input>
                    <Icon className="fas fa-wheelchair" color="info"></Icon>
                    &nbsp;<label className="editHandiAccessLabel">Handicap Access</label>
                  </div>

                  <div>
                    <p className="editRatingTitle">Your Rating: </p>
                    <StarRatingComponent
                      name="rate2"
                      starCount={5}
                      value={this.state.rating}
                      onStarClick={this.onStarClick.bind(this)}
                      editing={true}
                    />
                  </div>

                </div>

                {/* <Button onClick={this.consoleLog}></Button> */}
              </div>

              <div className="editSubmitBtnDiv">
                <Button className="markItButton" color="link" onClick={() => this.handleSubmitChangesButtonState()}>Submit Changes</Button>
              </div>

            </div>

          </Modal>
        </StyleRoot>
      );
    } else {
      infoWindowEditBoxes = null
    }


    //=========================DELETE WARNING MESSAGES===================

    if (this.state.deleteButton === true && this.state.currentLocationButton === false && this.state.addressButton === false && this.state.editButton === false && this.state.deleteButton_2 === false) {
      deleteWarningMessage = (
        <StyleRoot>
          <Modal show={this.state.show} className="modalBox" onClose={this.close} {...this.props.modal} closeOnBlur={true}>
            <div className="deleteWarningMessageDiv modal-content" style={fadeInAnimation.fadeIn}>
              <h1 className="deleteWarningMessageTitle"><Icon className="fas fa-exclamation-triangle" color="danger"></Icon>&nbsp;Are you sure you want to delete this marker?</h1>
              <div className="deleteWarningMessageButtonDiv">
                <Button onClick={() => this.deleteCurrentMarker(this.state.activeMarker.id)} color="danger"><Icon className="fas fa-surprise" color="warning"></Icon>
                  &nbsp;YES</Button>
                <Button onClick={this.warningMessageToggle} color="link"><Icon className="fas fa-smile-wink" color="warning"></Icon>
                  &nbsp;NO</Button>
              </div>
            </div>
          </Modal>
        </StyleRoot>
      )
    }
    else {
      deleteWarningMessage = null
    }

    if (this.state.deleteButton_2 === true && this.state.currentLocationButton === false && this.state.addressButton === false && this.state.editButton === false && this.state.deleteButton === false) {
      deleteWarningMessage_2 = (
        <StyleRoot>
          <Modal show={this.state.show} className="modalBox" onClose={this.close} {...this.props.modal} closeOnBlur={true}>
            <div className="deleteWarningMessageDiv modal-content" style={fadeInAnimation.fadeIn}>
              <h1 className="deleteWarningMessageTitle"><Icon className="fas fa-exclamation-triangle" color="danger"></Icon>&nbsp;Are you sure you want to delete this marker?</h1>
              <div className="deleteWarningMessageButtonDiv">
                <Button onClick={() => this.deleteCurrentMarker(this.state.sideBarMarkerToBeDeleted)} color="danger"><Icon className="fas fa-surprise" color="warning"></Icon>
                  &nbsp;YES</Button>
                <Button onClick={this.warningMessageToggleSideBar} color="link"><Icon className="fas fa-smile-wink" color="warning"></Icon>
                  &nbsp;NO</Button>
              </div>
            </div>
          </Modal>
        </StyleRoot>
      )
    }
    else {
      deleteWarningMessage_2 = null
    }


    //========================INFO WINDOW CONTENT========================


    if (this.props.sessionStorage) {
      infoWindowButtons = (
        <div>
          <Button id="editButton" className="infoWindowEditButton is-small" onClick={this.handleInfoWindowContentState_1}>
            <Icon className="fas fa-edit"></Icon>&nbsp;Edit Marker</Button>
          <Button id="deleteButton" className="infoWindowDeleteButton is-small" onClick={this.warningMessageToggle}>
            {/* onClick={() => this.deleteCurrentMarker(this.state.activeMarker.id)}> */}
            <Icon className="fas fa-trash-alt"></Icon>&nbsp;Delete Marker
      </Button>
          {/* <button onClick={this.consoleLog}>Console Log</button> */}
        </div>
      )
    }
    else {
      infoWindowButtons = null
    }

    if (this.state.showingInfoWindow && this.state.infoWindowContent) {
      // console.log(this.state.selectedPlace)
      infoWindowContent = (

        <div id="infoWindowContent" className="infoWindowDiv">
          <h1 id="currentNameInfo" className="infoWindowName">{this.state.selectedPlace.name}</h1>
          <p id="currentLocationName" className="infoWindowAddress">{this.state.selectedPlace.address}</p>
          <p className="infoWindowBaby" >
            <Icon className="fas fa-baby" color="info"></Icon>
            &nbsp;Baby Changing Station: {this.state.selectedPlace.changingStation}
          </p>
          <p className="infoWindowHandi" >
            <Icon className="fas fa-wheelchair" color="info"></Icon>
            &nbsp;Handicap Access: {this.state.selectedPlace.handicapAccess}</p>
          <p className="infoWindowRatingLabel">{this.state.selectedPlace.ratingLabel}{this.state.selectedPlace.rating}</p>
          <StarRatingComponent
            name="rate1"
            starCount={5}
            value={this.state.selectedPlace.rating}
          />
          {/* this is an If statement inside a render, a ternary */}
          {this.state.selectedPlace.userId === +sessionStorage.userID ? infoWindowButtons : null}
        </div>
      );
    } else {
      infoWindowContent = null
    }

    //=====================================SIDEBAR================================

    if (this.state.myMarkerButton) {
      sideBar = (

        // <TestSideBar
        // //C.R.U.D
        // deleteMarker={this.props.deleteMarker}
        // editMarker={this.props.editMarker}
        // //data states
        // markers={this.props.markers}
        // currentMarker={this.state.currentMarker}
        // userMarkers={this.props.userMarkers}
        // //rating states
        // rating={this.state.rating}
        // //state changing functions
        // handleInfoWindowContentState_1={this.handleInfoWindowContentState_1}
        // handleIconState_1={this.handleIconState_1}
        // handleIconState_2={this.handleIconState_2}
        // handleSidebarEditState={this.handleSidebarEditState}
        // handleMyMarkerButtonState={this.handleMyMarkerButtonState}
        // //authentication states
        // sessionStorage={this.state.sessionStorage}
        // warningMessageToggleSideBar={this.warningMessageToggleSideBar}

        // />

        <MyMarkerSideBar
          //C.R.U.D
          deleteMarker={this.props.deleteMarker}
          editMarker={this.props.editMarker}
          //data states
          markers={this.props.markers}
          currentMarker={this.state.currentMarker}
          userMarkers={this.props.userMarkers}
          //rating states
          rating={this.state.rating}
          //state changing functions
          handleInfoWindowContentState_1={this.handleInfoWindowContentState_1}
          handleIconState_1={this.handleIconState_1}
          handleIconState_2={this.handleIconState_2}
          handleSidebarEditState={this.handleSidebarEditState}
          handleMyMarkerButtonState={this.handleMyMarkerButtonState}
          //authentication states
          sessionStorage={this.state.sessionStorage}
          warningMessageToggleSideBar={this.warningMessageToggleSideBar}

        />
      );
    }
    else {
      sideBar = null
    }

    if (this.state.sideBarEditModal) {

      SidebarEdit = (
        <SideBarEditModal
          //C.R.U.D
          editMarker={this.props.editMarker}
          //checkbox state values
          editBabyStationCheck={this.state.editBabyStationCheck}
          editHandicapAccessCheck={this.state.editHandicapAccessCheck}
          babyCheckStatus={this.state.babyCheckStatus}
          handiCheckStatus={this.state.handiCheckStatus}
          babyCheckCondition={this.state.babyCheckCondition}
          handiCheckCondition={this.state.handiCheckCondition}
          //modal states
          close={this.close}
          show={this.state.show}
          //data states
          markers={this.props.markers}
          selectedPlace={this.state.selectedPlace}
          activeMarker={this.state.activeMarker}
          currentMarker={this.state.currentMarker}
          //rating states
          // rating={this.state.rating}
          onStarClick={this.onStarClick.bind(this)}
          //textbox values states
          editedName={this.state.editedName}
          editedLocationName={this.state.editedLocationName}
          //state changing functions
          handleEditTextboxState={this.handleEditTextboxState}
          handleEditBabyStationCheckChange={this.handleEditBabyStationCheckChange}
          handleEditHandiAccessCheckChange={this.handleEditHandiAccessCheckChange}
          handleEditBackButton={this.handleEditBackButton}
          handleSubmitChangesButtonState={this.handleSubmitChangesButtonState}
          changeStateAndSubmitEdit={this.changeStateAndSubmitEdit}
          //console log
          consoleLog={this.consoleLog}
          //renders
          babyCheckboxStatus={babyCheckboxStatus}
          handiCheckboxStatus={handiCheckboxStatus}
        />
      )
    }
    else {
      SidebarEdit = null
    }

    //=========================================================================

    let makeMarker = this.props.markers.map(currentUserMarker => {

      let changingStationLabel = ""
      let handicapAccessLabel = ""
      let userLabel = "Marker Owner Rating: "
      let userRating = ""
      let icon = ""

      if (currentUserMarker.changingStation) {


        changingStationLabel = "Available"

      } else {


        changingStationLabel = "Unavailable"
      }

      if (currentUserMarker.handicapAccess) {

        handicapAccessLabel = "Available"

      } else {

        handicapAccessLabel = "Unavailable"
      }

      if (currentUserMarker.rating === false) {

        userRating = 0

      } else {

        userRating = +currentUserMarker.rating
      }

      //icons will have to have 2 different icon properties in the database with the different images urls.
      //after that here we can say if iconChange is true or false render icon with that image

      if (this.state.currentMarker.id === currentUserMarker.id && this.state.currentIcon) {
        icon = {
          url: currentUserMarker.activeIcon,
          anchor: new google.maps.Point(32, 32),
          scaledSize: new google.maps.Size(30, 30)
        }
      } else {
        icon = {
          url: currentUserMarker.inactiveIcon,
          anchor: new google.maps.Point(32, 32),
          scaledSize: new google.maps.Size(35, 35)
        }
      }


      // if (this.state.iconChange) {
      //       icon = {
      //         url: "https://cdn4.iconfinder.com/data/icons/bold-purple-free-samples/32/Men_Symbol_Restroom_Human_Toilet-512.png",
      //             anchor: new google.maps.Point(32, 32),
      //             scaledSize: new google.maps.Size(35, 35)
      //       }
      //     } else {
      //       icon = {
      //         url: "https://cdn3.iconfinder.com/data/icons/map-and-location-fill/144/Place_Restroom-512.png",
      //             anchor: new google.maps.Point(32, 32),
      //             scaledSize: new google.maps.Size(35, 35)
      //       }
      //     }

      return (
        <Marker
          key={currentUserMarker.id}
          id={currentUserMarker.id}
          onClick={this.onMarkerClick}
          name={currentUserMarker.name}
          address={currentUserMarker.location}
          userId={currentUserMarker.user_Id}
          ratingLabel={userLabel}
          rating={userRating}
          icon={icon}
          style={color}
          changingStation={changingStationLabel}
          changingStation_2={currentUserMarker.changingStation_2}
          handicapAccess={handicapAccessLabel}
          handicapAccess_2={currentUserMarker.handicapAccess_2}
          position={currentUserMarker}
          draggable={true}
          onDragend={this.centerMoved}/>
      )
    })

    let makeDefaultMarkers = this.props.bathrooms.map(currentDefaultBathroom => {

      let label = "Google Rating: "

      let changingStationLabel = ""
      let handicapAccessLabel = ""
      let defaultRating = ""

      if (currentDefaultBathroom.changingStation) {

        changingStationLabel = "Available"

      } else {

        changingStationLabel = "Unavailable"
      }

      if (currentDefaultBathroom.handicapAccess) {

        handicapAccessLabel = "Available"

      } else {

        handicapAccessLabel = "Unavailable"
      }

      if (currentDefaultBathroom.rating === false) {

        defaultRating = 0

      } else {

        defaultRating = +currentDefaultBathroom.rating
      }

      return (
        <Marker
          key={currentDefaultBathroom.id}
          id={currentDefaultBathroom.id}
          onClick={this.onMarkerClick}
          name={currentDefaultBathroom.name}
          address={currentDefaultBathroom.formatted_address}
          ratingLabel={label}
          rating={defaultRating}
          icon={{
            url: "https://cdn0.iconfinder.com/data/icons/map-markers-2-1/512/xxx023-512.png",
            anchor: new google.maps.Point(32, 32),
            scaledSize: new google.maps.Size(25, 25)
          }}
          changingStation={changingStationLabel}
          handicapAccess={handicapAccessLabel}
          position={currentDefaultBathroom.geometry.location} />
      )
    })


    let makeinfoWindows = this.props.markers.map(currentInfoWindow => {
      return (
        <InfoWindowEx
          key={currentInfoWindow.id}
          id={currentInfoWindow.id}
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          selectedPlace={this.state.selectedPlace}
          onInfoWindowClose={this.onInfoWindowClose}
        >
          <div>
            {infoWindowContent}
          </div>
        </InfoWindowEx>
      )

    })






    //======================END of CONDITIONAL STATEMENTS==================================



    // ================USING GOOGLE-MAPS-REACT====================================

    return (
      <div className="background">
        {searchBox}
        {currentLocationTextboxes}
        {infoWindowEditBoxes}
        {SidebarEdit}
        {deleteWarningMessage}
        {deleteWarningMessage_2}
        <div className="interactionBar">
          {logOutButton}
          {userBar}
        </div>
        {userBarSelectionButtons}
        {/* <button onClick={this.consoleLog}>console log current location</button> */}
        <div>

          <br></br>
          <Map id="Map" google={this.props.google}
            style={style}
            className="background"
            zoom={14}
            initialCenter={userLocation}
            onClick={this.onMapClick}>
            {sideBar}
            {makeMarker}
            {makeDefaultMarkers}

            {makeinfoWindows}
          </Map>
        </div>
      </div>
    );
  };
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyDOEBqiYykHzoCJyKAij9f2UwaF-DxtuBs")
})(MapContainer)