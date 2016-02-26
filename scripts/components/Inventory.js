/*
  Inventory
*/

import React from 'react';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import Firebase from 'firebase';

const ref = new Firebase('https://reactjs01.firebaseio.com/'); 

@autobind
class Inventory extends React.Component{

  constructor() {
    super();
    this.state = {
      uid : ''
    }
  }

  componentWillMount() {
    var storeIdRef = ref.child(this.props.params.storeId)
    var token = localStorage.getItem('token-' + storeIdRef.path.o[0]);
    if(token) {
      ref.authWithCustomToken(token, this.authHandler);
    }
  }

  authenticate(provider) {
    ref.authWithOAuthPopup(provider,this.authHandler);
  }

  authHandler(err, authData){
    if(err){
      console.err(err);
      return;
    }

    const storeRef = ref.child(this.props.params.storeId);
    storeRef.on('value', (snapshot)=> {
      var data = snapshot.val() || {};

      // Claim if there is no owner to store
      if(!data.owner){
        storeRef.set({
          owner : authData.uid
        });
      }

      this.setState({
        uid : authData.uid,
        owner : data.owner || authData.uid
      });

      // Save the login token in the browser
      localStorage.setItem('token-' + storeRef.path.o[0] , authData.token)
    });
  }

  renderLogin() {
    return (
      <nav className='login'>
        <button className='github' onClick={this.authenticate.bind(this, 'github')}> Login In with Github </button>
      </nav> 
    )
  }

  logout() {
    var storeIdRef = ref.child(this.props.params.storeId)
    ref.unauth();
    localStorage.removeItem('token-' + storeIdRef.path.o[0]);
    this.setState({
      uid : null
    });
  }


  renderInventory(key) {
    var linkState = this.props.linkState;
    return (
      <div className='fish-edit' key={key}>
        <input type='text' ref='name' valueLink={linkState('fishes.'+ key +'.name')} />
        <input type='text' ref='price' valueLink={linkState('fishes.'+ key +'.price')} />
        <select ref='status' valueLink={linkState('fishes.'+key+'.status')}>
          <option value='available'> FRESH! </option>
          <option value='unavailable'> SOLD OUT </option>
        </select>
        <textarea type='text' ref='desc' valueLink={linkState('fishes.'+key+'.desc')}></textarea>
        <input type='text' ref='image' valueLink={linkState('fishes.'+key+'.image')}/>
        <button onClick={this.props.removeFish.bind(null, key)}> Remove Fish! </button>
      </div>
    )
  }

  render(){
    let logoutButton = <button onClick={this.logout}>Logout</button>

    if(!this.state.uid){
      return (<div> {this.renderLogin()} </div>)
    }

    if(this.state.uid !== this.state.owner){
      return (
        <div>
          <p>Sorry, you are not the owner of this store.</p>
        </div>)
    }

    return (
      <div>
        <h2> Inventory </h2>
        {logoutButton}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        < AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
}

Inventory.propTypes = {
    addFish : React.PropTypes.func.isRequired,
    loadSamples : React.PropTypes.func.isRequired,
    fishes : React.PropTypes.object.isRequired,
    linkState : React.PropTypes.func.isRequired,
    removeFish : React.PropTypes.func.isRequired
}

export default Inventory;
